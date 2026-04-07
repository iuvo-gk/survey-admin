import React from "react";
import { Query } from "react-apollo";
import { STUDENTS_QUERY } from "../graphql/Queries";

class Students extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return (
            <React.Fragment>
                <h1>Students:</h1>
                <Query query={STUDENTS_QUERY}>
                    {({loading,error,data}) => {
                        if (loading) return "Loading";
                        if (error) return error.message;
                        return data.students.map(s => (
                            <React.Fragment>
                                id: {s.id}<br />
                                survey: {s.survey.name}<br/>
                                answers: {s.answers_len}<br/>
                                name: {s.name}<br />
                                surname: {s.surname} <br />
                                tel: {s.tel} <br />
                                school: {s.school && s.school.name} <br />
                                department: {s.department && s.department.name} <br />
                                grade: {s.grade && s.grade.name} <br />
                                paralel: {s.paralel && s.paralel.name} <br />
                                <hr />
                            </React.Fragment>
                        ))
                    }}
                </Query>
            </React.Fragment>   
        )
    }
}

export default Students;