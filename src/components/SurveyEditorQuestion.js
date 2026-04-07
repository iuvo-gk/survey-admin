import React from "react";
import SurveyQuestionConditional from "./surveyComponents/SurveyQuestionConditional";
import SurveyQuestionOptions from "./surveyComponents/SurveyQuestionOptions";
import { OPTIONS_RADIO, OPTIONS_MULTI } from "../constants";

class SurveyEditorQuestion extends React.Component {
    constructor(props) {
        super(props);
    }
    isOfTypeOption(type){
        return type == OPTIONS_RADIO || type == OPTIONS_MULTI
    }
    onChange(key) {
        return e => this.props.onQuestionChange(this.props.question.id, key, e.target.value);
    }
    onQuestionAddOption = () => {
        this.props.onObjectAddItem({
            field: "questions",
            fieldId: this.props.question.id,
            subField: "options",
            extra: { value: "", conditional_logic: false, conditionals: [] }
        })
    }
    onQuestionRemoveOption = optionId => {
        this.props.onObjectRemoveItem({
            field: "questions.options",
            identifiers: {
                "questions": this.props.question.id,
                "options": "STOP"
            },
            objectId: optionId
        })
    }
    onQuestionAddConditional = () => {
        this.props.onObjectAddItem({
            field: "questions",
            fieldId: this.props.question.id,
            subField: "conditionals",
            extra: this.props.getNewConditional(this.props.question.id)
        })
    }
    onConditionalRemove = (conditional,optionId) => {
        if (conditional.type === "QUESTION_CONDITIONAL"){
            this.props.onObjectRemoveItem({
                field: "questions.conditionals",
                identifiers: {
                    questions: this.props.question.id,
                    conditionals: "STOP"
                },
                objectId: conditional.id
            })
        } else {
            this.props.onObjectRemoveItem({
                field: "questions.options.conditionals",
                identifiers: {
                    questions: this.props.question.id,
                    options: optionId,
                    conditionals: "STOP"
                },
                objectId: conditional.id
            })
        }
    }
    onAddOptionConditional = (optionId) => {
        this.props.onObjectAddItem2({
            field: `questions.options.conditionals`,
            identifiers: {
                "questions": this.props.question.id,
                "options": optionId,
                "conditionals": "STOP"
            },
            extra: this.props.getNewConditional(this.props.question.id)
        })
    }
    onRemoveOptionConditional = (optionId,conditionalId) => {
        this.props.onObjectRemoveItem2({
            field: `questions.options.conditionals`,
            identifiers: {
                "questions": this.props.question.id,
                "options": optionId,
                "conditionals": conditionalId
            },
            extra: this.props.getNewConditional(this.props.question.id)
        })
    }
    render() {
        return (
            <div>
                #{this.props.question.id} - 
                {
                    this.props.opened 
                    ?
                        <input
                            value={this.props.question.value}
                            onChange={this.onChange("value")}    
                        />
                    : 
                    `${this.props.question.value}`
                }
                - <button onClick={this.props.toggle}>Toggle</button><button onClick={() => this.props.deleteQuestion(this.props.question.id)}>Delete question</button>
                {
                    this.props.opened && (
                        <React.Fragment><br/>
                            - Type: <select value={this.props.question.type} onChange={this.onChange("type")}>
                                {Object.keys(this.props.data.QUESTION_TYPES).map(key => {
                                    const TYPE = this.props.data.QUESTION_TYPES[key];
                                    return <option value={key}>{TYPE.value}</option>
                                })}
                            </select><br/>
                            {
                                this.isOfTypeOption(this.props.question.type) && 
                                    <SurveyQuestionOptions
                                        questions={this.props.data.questions}
                                        question={this.props.question}
                                        onObjectToggle={this.props.onObjectToggle}
                                        onObjectToggle2={this.props.onObjectToggle2}
                                        onQuestionAddOption={this.onQuestionAddOption}
                                        onQuestionUpdateOption={this.props.onQuestionUpdateOption}
                                        onQuestionRemoveOption={this.onQuestionRemoveOption}
                                        onAddOptionConditional={this.onAddOptionConditional}
                                        onRemoveOptionConditional={this.onRemoveOptionConditional}
                                        onConditionalFieldChange={this.props.onConditionalFieldChange}
                                        onOperatorChange={this.props.onOperatorChange}
                                        onConditionalValueChange={this.props.onConditionalValueChange}
                                        onConditionalRemove={this.onConditionalRemove}
                                        QUESTION_TYPES={this.props.data.QUESTION_TYPES}

                                    />
                            }
                            <br/>
                            {
                                this.props.data.questions.length > 1 &&
                                <React.Fragment>
                                    Conditional logic - 
                                    <input 
                                        type="checkbox" 
                                        checked={this.props.question.conditional_logic}
                                        onChange={() => this.props.onObjectToggle("questions",this.props.question.id,"conditional_logic")}
                                    /><br/>
                                    {
                                        this.props.question.conditional_logic && 
                                            <React.Fragment>
                                                Conditionals:
                                                    {this.props.question.conditionals.map(cond => (
                                                        <SurveyQuestionConditional
                                                            conditional={cond}
                                                            question={this.props.question}
                                                            questions={this.props.data.questions}
                                                            onOperatorChange={this.props.onOperatorChange}
                                                            onConditionalValueChange={this.props.onConditionalValueChange}
                                                            onConditionalFieldChange={this.props.onConditionalFieldChange}
                                                            onConditionalRemove={this.onConditionalRemove}
                                                            QUESTION_TYPES={this.props.data.QUESTION_TYPES}
                                                        />
                                                    ))}
                                                <br/> 
                                                <button onClick={this.onQuestionAddConditional}>Add conditional</button>
                                            </React.Fragment>
                                    }
                                </React.Fragment>
                            }
                        </React.Fragment>
                    )
                }
                <br/>
            </div>
        )
    }
}

export default SurveyEditorQuestion;
