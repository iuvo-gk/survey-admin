import React from "react";
import SurveyQuestionOption from "./SurveyQuestionOption";

const SurveyQuestionOptions = props => {
    return (
        <React.Fragment>
            -Options:
            {
                props.question.options.map(option => (
                    <SurveyQuestionOption
                        questions={props.questions}
                        question={props.question}
                        option={option}

                        onOperatorChange={props.onOperatorChange}
                        onConditionalValueChange={props.onConditionalValueChange}
                        onConditionalRemove={props.onConditionalRemove}
                        onConditionalFieldChange={props.onConditionalFieldChange}
                        QUESTION_TYPES={props.QUESTION_TYPES}

                        onObjectToggle2={props.onObjectToggle2}
                        onQuestionUpdateOption={props.onQuestionUpdateOption}
                        onQuestionRemoveOption={props.onQuestionRemoveOption}
                        onAddOptionConditional={props.onAddOptionConditional}
                        onRemoveOptionConditional={props.onRemoveOptionConditional}
                    />
                ))
            }
            <br/>
            Allow Other - 
            <input 
                type="checkbox" 
                checked={props.question.allowOther}
                onChange={() => props.onObjectToggle("questions",props.question.id,"allowOther")}
            /><br/>
            <button onClick={props.onQuestionAddOption}>Add option</button>
        </React.Fragment>
    )
}

export default SurveyQuestionOptions;