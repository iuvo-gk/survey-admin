import React from "react";
import SurveyEditorQuestion from "./SurveyEditorQuestion"
import { getSameAsOperator, getContainsOperator, getOneOfOperator } from "../utils";
import { TEXT, OPTIONS_RADIO, OPTIONS_MULTI } from "../constants";
import { withRouter } from "react-router-dom";
import { withApollo } from "react-apollo";
import { CREATE_SURVEY_MUTATION } from "../graphql/Mutations";
import { compose } from "recompose";
import uuid from "uuid";
import { SURVEYS_QUERY } from "../graphql/Queries";

/*
TYPE ::= { type: String!, value: String! }

TEXT_TYPE_OPERATOR ::= "contains" | "equals"
OPTIONS_TYPE_OPERATOR ::= "equals" | "not equals"
OPERATOR ::= TEXT_TYPE_OPERATOR | OPTIONS_TYPE_OPERATOR

conditional ::= {
    questionId: question.id!
    operator: OPERATOR!
    value: String!
}

question ::= {
    id ::= Int! @unique
    type ::= TYPE!
    value ::= String!
    if (type.type contains "options"):
        options ::= [String!]!
        allowOther ::= Boolean!
    conditional_logic ::= Boolean!
    conditionals ::= [conditional!]!
}

example:

question = {
    id: 2,
    value: "What's not an animal?"
    type: "OPTIONS_RADIO",
    options: ["dog","cat","cow"],
    allowOther: false,
    conditional_logic: true,
    conditionals: [
        {
            questionId: 1,
            operator: "equals",
            value: "SLEEP"
        }
    ]
}

*/

const EQUALS_OPERATOR = {
    type: "EQUALS_OPERATOR",
    func: getSameAsOperator(),
    value: "equals"
}
const NOT_EQUALS_OPERATOR = {
    type: "NOT_EQUALS_OPERATOR",
    func: (val1, val2) => !EQUALS_OPERATOR.func(val1,val2),
    value: "not equals"
}
const CONTAINS_OPERATOR = {
    type: "CONTAINS_OPERATOR",
    func: getContainsOperator(),
    value: "contains"
}
const ONE_OF_OPERATOR = {
    type: "ONE_OF_OPERATOR",
    func: getOneOfOperator(),
    value: "one of"
}
const NOT_ONE_OF_OPERATOR = {
    type: "NOT_ONE_OF_OPERATOR",
    func: (val1, values) => !NOT_ONE_OF_OPERATOR.func(val1,values),
    value: "not one of"
}

const TEXT_TYPE_OPERATOR = [ NOT_EQUALS_OPERATOR, EQUALS_OPERATOR, CONTAINS_OPERATOR ]

const OPTIONS_SINGLE_TYPE_OPERATOR = [ EQUALS_OPERATOR, NOT_EQUALS_OPERATOR ]

const OPTIONS_MULTI_TYPE_OPERATOR = [ONE_OF_OPERATOR, NOT_ONE_OF_OPERATOR]

const QUESTION_TYPES = {
    [TEXT]: { operators: TEXT_TYPE_OPERATOR, value: "Text" },
    [OPTIONS_RADIO]: { operators: OPTIONS_SINGLE_TYPE_OPERATOR, value: "Options (Radio)" },
    [OPTIONS_MULTI]: { operators: OPTIONS_MULTI_TYPE_OPERATOR, value: "Options (Multi)" }
}

class _SurveyEditor extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            questions: [],
            onQuestion: undefined
        }
    }
    toggle = (key,value) => {
        this.setState(prevState => {
            let val = prevState[key];
            if (val !== value) prevState[key] = value;
            else prevState[key] = undefined;
            return prevState;
        })
    } 
    addQuestion = e => {
        this.setState(prevState => {
            let len = prevState.questions.length;
            let new_question = {
                id: len ? prevState.questions[len-1].id + 1 : 1,
                custom_id: uuid(),
                type: TEXT,
                value: "Doo fooo hu?",
                conditional_logic: false,
                allowOther: false,
                conditionals: [],
                options: [],
            }
            prevState.questions.push(new_question)
            prevState.onQuestion = new_question.id;
            return prevState;
        })
    }
    deleteQuestion = id => {
        this.setState(prevState => {
            prevState.questions = prevState.questions.filter(x => x.id !== id)
            prevState.questions.map(q => {
                q.conditionals = q.conditionals.filter(x => x.field.id !== id)
                for (let o of q.options) o.conditionals = o.conditionals.filter(x => x.field.id !== id);
                return q;
            })
            return prevState
        })
    }
    onQuestionChange = (questionId, key, value) => {
        this.setState(prevState => {
            let question = prevState.questions.find(x => x.id === questionId);
            question[key] = value;
            return prevState;
        })
    }
    onObjectAddItem = ({field,subField,fieldId,extra}) => {
        this.setState(prevState => {
            let obj = prevState[field].find(x => x.id === fieldId);
            let len = obj[subField].length;
            let id = len ? obj[subField][len-1].id + 1 : 1
            console.log({ new_obj: { id, ...extra }})
            obj[subField].push({ id, ...extra })
            return prevState;
        })
    }
    onObjectAddItem2 = ({ field, identifiers, extra }) => {
        this.setState(prevState => {
            let fields = field.split(".");
            let destination = undefined;
            while (fields.length) {
                let f = fields.shift();
                let startingPoint = destination ? destination : prevState;
                if (identifiers[f] === "STOP") {
                    destination = startingPoint[f];
                    break;
                }
                destination = startingPoint[f].find(x => x.id == identifiers[f]);
            }
            let len = destination.length;
            let id = len ? destination[len - 1].id + 1 : 1
            destination.push({ id, ...extra })
            return prevState;
        })
    }
    onObjectRemoveItem = ({ field, identifiers, objectId}) => {
        this.setState(prevState => {
            let fields = field.split(".");
            let destination = undefined;
            while (fields.length) {
                let f = fields.shift();
                let startingPoint = destination ? destination : prevState;
                console.log(identifiers[f],f)
                if (identifiers[f] === "STOP") {
                    startingPoint[f] = startingPoint[f].filter(x => x.id !== objectId);
                    break;
                }
                destination = startingPoint[f].find(x => x.id == identifiers[f]);
            }
            return prevState;
        })
    }
    onQuestionUpdateOption = ( questionId, optionId, value ) => {
        this.setState(prevState => {
            let question = prevState.questions.find(x => x.id === questionId);
            let option = question.options.find(x => x.id === optionId);
            option.value = value;
            return prevState;
        })
    }
    getNewConditional = (questionId) => {
        let cond = {};
        let rest_questions = this.state.questions.filter(x => x.id !== questionId);
        if (!rest_questions.length) throw new Error("Illegal rest_questions.length")
        let question = rest_questions[0];
        cond["field"] = question;
        cond["operator"] = QUESTION_TYPES[question.type].operators[0];
        if (question.type != TEXT) {
            cond["value"] = question.options[0].value;
        } else cond["value"] = ""
        cond["values"] = [];
        return cond;
    }
    onConditionalFieldChange = (questionId,conditional,new_id) => {
        this.setState(prevState => {
            let new_cond = this.getNewConditional(questionId)
            conditional = Object.assign(conditional, new_cond)
            conditional.field = this.state.questions.find(x => x.id == new_id);
            if (conditional.field.type != TEXT) {
                conditional.value = conditional.field.options[0].value;
            } else conditional.value = ""
            return prevState;
        })
    }
    onOperatorChange = (conditional, value) => {
        this.setState(prevState => {
            conditional.operator = QUESTION_TYPES[conditional.field.type].operators.find(x => x.value === value)
            return prevState;
        })
    }
    onConditionalValueChange = (conditional, value) => {
        this.setState(prevState => {
            if (conditional.field.type == TEXT){
                conditional.value = value;
            } else if (conditional.field.type == OPTIONS_MULTI) {
                let alreadyContains = conditional.values.indexOf(value) !== -1;
                if (alreadyContains) conditional.values = conditional.values.filter(x => x !== value);
                else conditional.values.push(value)
            } else if (conditional.field.type == OPTIONS_RADIO) {
                conditional.value = value;
            }
            return prevState;
        })
    }
    onObjectToggle = (field, objectId, key) => {
        this.setState(prevState => {
            let obj = prevState[field].find(x => x.id === objectId);
            obj[key] = !obj[key]
            return prevState;
        })
    }
    onObjectToggle2 = ({field,identifiers,subField}) => {
        this.setState(prevState => {
            let fields = field.split(".");
            let destination = undefined;
            while (fields.length) {
                let f = fields.shift();
                let startingPoint = destination ? destination : prevState;
                destination = startingPoint[f].find(x => x.id == identifiers[f]);
            }
            destination[subField] = !destination[subField];
            return prevState;
        })
    }
    filterQuestionData = question => {
        if (question.conditional_logic){
            for (let cond of question.conditionals){
                cond.field = this.filterQuestionData(cond.field)
                if (cond.field.type == TEXT){ cond.value = undefined; cond.values = undefined }
                else if (cond.field.type == OPTIONS_RADIO) { cond.values = undefined }
                else if (cond.field.type == OPTIONS_MULTI) { cond.value = undefined }
            }
            question.conditionals.map(c => c.field = c.field.custom_id);
            question.conditionals = JSON.stringify({data: question.conditionals})
        } else question.conditionals = undefined;
        if (question.type == OPTIONS_RADIO || question.type == OPTIONS_MULTI){
            for (let opt of question.options){
                if (opt.conditional_logic){
                    for (let cond of opt.conditionals){
                        cond.field = this.filterQuestionData(cond.field)
                        if (cond.field.type == TEXT) { cond.value = undefined; cond.values = undefined }
                        else if (cond.field.type == OPTIONS_RADIO) { cond.values = undefined }
                        else if (cond.field.type == OPTIONS_MULTI) { cond.value = undefined }
                    }
                    opt.conditionals.map(c => c.field = c.field.custom_id);
                    opt.conditionals = JSON.stringify({data: opt.conditionals })
                } else opt.conditionals = undefined;
            }
        }
        if (question.type == TEXT){
            let { id, custom_id, type, conditional_logic, conditionals, value } = question
            return { id, custom_id, type, conditional_logic, conditionals, value }
        } else if (question.type == OPTIONS_RADIO){
            let { id, custom_id, type, conditional_logic, conditionals, options, allowOther, value } = question
            return { id, custom_id, type, conditional_logic, conditionals, options, allowOther, value };
        } else if (question.type == OPTIONS_MULTI){
            let { id, custom_id, type, conditional_logic, conditionals, options, allowOther, value } = question
            return { id, custom_id, type, conditional_logic, conditionals, options, allowOther, value };
        } else {
            throw new Error(`Unknown option error: ${question.type} (${typeof(question.type)})`)
        }
    }
    submit = async () => {
        let questions = [];
        let original = JSON.stringify(this.state.questions);
        for (let question of this.state.questions){
            questions.push(this.filterQuestionData(question));
        }
        this.state.questions = JSON.parse(original);
        console.log({questions})
        let res = await this.props.client.mutate({
            mutation: CREATE_SURVEY_MUTATION,
            variables: {
                name: `SurveyName${String(Math.random() * 100)}`,
                questions: questions.map(q => {
                    console.log(q.custom_id,q);
                    let { type, custom_id, conditional_logic, conditionals, value, options, allowOther } = q;
                    return {
                        options: !options ? undefined : options.map(o => {
                            let { conditional_logic, conditionals, value } = o;
                            return { conditional_logic, conditionals, value }
                        }),
                        custom_id,
                        type,
                        conditional_logic,
                        conditionals,
                        value,
                        allowOther
                    }
                })
            }
        })
        try {
            let cache1 = this.props.client.readQuery({ query: SURVEYS_QUERY })
            cache1.surveys.push(res.data.createSurvey);
            this.props.client.writeQuery({ query: SURVEYS_QUERY, data: cache1 });
        } catch (e) { console.log(e) }
        this.props.history.push("/")
        return questions;
    }
    render(){
        console.log(this.state)
        return (
            <React.Fragment>
                <h3>Questions: {this.state.questions.length}</h3>
                {this.state.questions.map(question => 
                    <React.Fragment>
                        <SurveyEditorQuestion 
                            toggle={() => this.toggle("onQuestion", question.id)}
                            deleteQuestion={id => this.deleteQuestion(id)}
                            opened={this.state.onQuestion === question.id} 
                            question={question}
                            
                            onObjectAddItem={this.onObjectAddItem}
                            onObjectAddItem2={this.onObjectAddItem2}
                            onObjectRemoveItem={this.onObjectRemoveItem}
                            onObjectToggle={this.onObjectToggle}
                            onObjectToggle2={this.onObjectToggle2}

                            onQuestionChange={this.onQuestionChange}
                            onQuestionUpdateOption={this.onQuestionUpdateOption}
                            
                            getNewConditional={this.getNewConditional}
                            onConditionalFieldChange={this.onConditionalFieldChange}
                            onOperatorChange={this.onOperatorChange}
                            onConditionalValueChange={this.onConditionalValueChange}

                            data={{
                                QUESTION_TYPES,
                                questions: this.state.questions
                            }}
                        />

                    </React.Fragment>
                )}
                <button onClick={this.addQuestion}>Add question</button><br/><br/>
                <button onClick={this.submit}>Submit</button>
            </React.Fragment>
        )
    }
}

export default compose(withApollo,withRouter)(_SurveyEditor);