import React from "react";
import SurveyQuestionConditional from "./SurveyQuestionConditional";

const SurveyQuestionOption = props => {
    return (
        <React.Fragment>
            <h5>
                #{props.option.id} - 
                <input 
                    value={props.option.value} 
                    onChange={e => props.onQuestionUpdateOption(props.question.id,props.option.id,e.target.value)}
                />
                <br/>
                {
                    props.questions.length > 1 && 
                    <React.Fragment>
                        Conditional logic -
                        <input
                            type="checkbox"
                            checked={props.option.conditional_logic}
                            onChange={() => props.onObjectToggle2({
                                field: "questions.options",
                                identifiers: {
                                    questions: props.question.id,
                                    options: props.option.id
                                }, 
                                subField: "conditional_logic"
                            })}
                        /><br />
                        {
                            props.option.conditional_logic &&
                            <React.Fragment>
                                Option Conditions:<br/>
                                {
                                    props.option.conditionals.map(cond => console.log(123,{cond}) || (
                                        <SurveyQuestionConditional
                                            conditional={cond}
                                            option={props.option}
                                            question={props.question}
                                            questions={props.questions}
                                            onOperatorChange={props.onOperatorChange}
                                            onConditionalValueChange={props.onConditionalValueChange}
                                            onConditionalFieldChange={props.onConditionalFieldChange}
                                            onConditionalRemove={props.onConditionalRemove}
                                            QUESTION_TYPES={props.QUESTION_TYPES}
                                        />
                                    ))
                                }
                                <button onClick={() => props.onAddOptionConditional(props.option.id)}>Create conditional</button> <br/>
                            </React.Fragment>
                        }
                    </React.Fragment>
                }
                <button onClick={() => props.onQuestionRemoveOption(props.option.id)}>DELETE OPTION</button> 
            </h5> 
            <br/>
        </React.Fragment>
    )
}

export default SurveyQuestionOption;