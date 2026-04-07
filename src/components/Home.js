import React from "react";
import { Query, withApollo } from "react-apollo";
import { SURVEYS_QUERY } from "../graphql/Queries";
import { DELETE_SURVEY_MUTATION } from "../graphql/Mutations";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { clone } from "../utils";

class _Home extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        console.log(this.props)
        return (
            <React.Fragment>
                <h4>{this.props.user ? "" : "not logged in"}</h4> {/*JSON.stringify(this.props.user)*/}
                <h1>Surveys: </h1>
                <Query query={SURVEYS_QUERY}>
                    {({loading,error,data}) => {
                        if (loading) return "loading";
                        if (error) return error.message;
                        
                        return data.surveys.map(s => (
                            <React.Fragment>
                                id: {s.id}<br/>
                                name: {s.name}<br/>
                                version: {s.version}<br/>
                                questions: {s.questions.length} <br/>
                                <button onClick={e => {
                                    this.props.client.mutate({ mutation: DELETE_SURVEY_MUTATION, variables: { id: s.id } })
                                    try {
                                        let cache1 = clone(this.props.client.readQuery({ query: SURVEYS_QUERY }));
                                        cache1.surveys = cache1.surveys.filter(x => x.id !== s.id);
                                        this.props.client.writeQuery({ query: SURVEYS_QUERY, data: cache1 });
                                    } catch (e) { console.log(e) }
                                }}>Delete</button>
                                <button onClick={e => {
                                    this.props.history.push(`/survey/${s.id}`)
                                }}>More</button>
                                <hr/>
                            </React.Fragment>
                        ))
                    }}
                </Query>
                <button onClick={() => this.props.history.push("/create_survey")}>Create survey</button>
            </React.Fragment>
        )
    }
}

export default compose(withApollo,withRouter)(_Home);