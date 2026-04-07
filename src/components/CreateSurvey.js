import React from "react";
import SurveyEditor from "./SurveyEditor";

class CreateSurvey extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return (
            <React.Fragment>
                <h1>Create Survey</h1>
                <SurveyEditor/>
            </React.Fragment>
        )
    }
}

export default CreateSurvey;
