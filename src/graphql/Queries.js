import gql from "graphql-tag";

export const GET_LOGGED_IN_USER_QUERY = gql`
    query {
        getLoggedInUser {
            id
            first_name
            last_name
            email
            createdAt
            updatedAt
        }
    }
`

export const SURVEYS_QUERY = gql`
    query {
        surveys {
            id
            name
            version
            questions {
                id
                custom_id
                options {
                    id
                    public
                    value
                    conditional_logic
                    conditionals
                }
                value
            }
        }
    }
`

export const SURVEY_QUERY = gql`
    query Survey($id: ID!){
        survey(
            id: $id
        ) {
            id
            name
            version
            questions {
                id
                type
                custom_id
                options {
                    id
                    public
                    value
                    conditional_logic
                    conditionals
                }
                value
                answers {
                    id
                    question { id }
                    value
                    option { id value }
                    options { id value }
                }
            }
        }
    }
`

export const STUDENTS_QUERY = gql`
    query {
        students {
            id
            name
            surname
            email
            tel
            survey { id name }
            school {
                id
                name
            }
            department{
                id
                name
            }
            answers_len
            grade
            paralel
        }
    }
`