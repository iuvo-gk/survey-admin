import React from "react";
import { OPTIONS_RADIO, OPTIONS_MULTI } from "../../constants";

const SurveyQuestionConditionalOption = props => {
    let type, checked;
    if (props.conditional.field.type == OPTIONS_RADIO) {
        type = "radio";
        checked = props.option.value === props.conditional.value
    }
    else if (props.conditional.field.type == OPTIONS_MULTI) {
        type = "checkbox"
        checked = props.conditional.values.indexOf(props.option.value) !== -1
    }
    return (
        <React.Fragment>
            {props.option.value}
            <input
                type={type}
                name={`question_${props.conditional.field.id}_cond_${props.conditional.id}_option_${props.question_option && props.question_option.id}`}
                checked={checked}
                value={props.option.value}
                onChange={e => props.onConditionalValueChange(
                    props.conditional,
                    e.target.value
                )}
            />
        </React.Fragment>
    )
}

export default SurveyQuestionConditionalOption;