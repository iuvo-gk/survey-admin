import React from "react";
import { Query } from "react-apollo";
import { SURVEY_QUERY } from "../graphql/Queries";
import { withRouter } from "react-router-dom";

class _SingleSurvey extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return (
            <React.Fragment>
                <h1>Survey</h1>
                <Query query={SURVEY_QUERY} variables={{
                    id: this.props.location.pathname.split("/")[2]
                }}>
                    {({loading,error,data}) => {
                        if (loading) return "Loading";
                        if (error) return error.message;
                        let survey = data.survey;
                        let answers_len = 0
                        for (let q of survey.questions) answers_len += q.answers.length;
                        return (
                            <React.Fragment>
                                id: {survey.id}<br />
                                name: {survey.name}<br />
                                version: {survey.version}<br />
                                questions: {survey.questions && survey.questions.length} <br />
                                answers: {answers_len} <br />
                                <hr /><br/>
                                <h1>Questions:</h1>
                                {
                                    survey.questions.map(q => (
                                        <React.Fragment>
                                            id: {q.id}<br />
                                            value: {q.value}<br />
                                            type: {q.type}<br />
                                            answers: {q.answers.length}<br/>
                                            <hr/>
                                        </React.Fragment>
                                    ))
                                }
                            </React.Fragment>
                        )
                    }}
                </Query>
            </React.Fragment>
        )
    }
}

export default withRouter(_SingleSurvey);
