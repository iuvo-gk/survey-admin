import React from "react";
import { TEXT } from "../../constants";
import SurveyQuestionConditionalOption from "./SurveyQuestionConditionalOption";

const SurveyQuestionConditional = props => {
    console.log(33,{props})
    let cond_operators = props.QUESTION_TYPES[props.conditional.field.type].operators;
    return (
        <React.Fragment>
            <h5>
                #{props.conditional.id} -
                Field:
                <select
                    value={props.conditional.field.id}
                    onChange={e => props.onConditionalFieldChange(props.question.id,props.conditional, e.target.value)}
                >
                    {props.questions.filter(x => x.id !== props.question.id).map(question => {
                        return <option value={question.id}>{question.value}</option>
                    })}
                </select>
                Operator:
                <select
                    value={props.conditional.operator && props.conditional.operator.value}
                    onChange={e => props.onOperatorChange(props.conditional,e.target.value)}
                >
                    {
                        cond_operators.map(operator => {
                            return <option value={operator.value}>{operator.value}</option>
                        })
                    }
                </select>
                Value:
                {
                props.conditional.field.type == TEXT ?
                    <input
                        value={props.conditional.value}
                        onChange={e => props.onConditionalValueChange(props.conditional, e.target.value)}
                    />
                    :
                    props.conditional.field.options.map(option => (
                        <SurveyQuestionConditionalOption
                            question_option={props.option}
                            option={option}
                            question={props.question}
                            conditional={props.conditional}
                            onConditionalValueChange={props.onConditionalValueChange}
                            onConditionalRemove={props.onConditionalRemove}
                        />
                    ))
                }
                <button onClick={() => props.onConditionalRemove(props.conditional, props.option && props.option.id)}>Delete conditional</button>
            </h5>
            <br />

        </React.Fragment>
    )
}

export default SurveyQuestionConditional;