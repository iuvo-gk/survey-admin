import gql from "graphql-tag";

export const DELETE_SURVEY_MUTATION = gql`
    mutation DeleteSurvey($id: ID!){
        deleteSurvey(id: $id){
            id
        }
    }
`

export const LOGIN_MUTATION = gql`
    mutation Login(
        $email: String!
        $password: String!
    ) {
        login(
            email: $email
            password: $password
        ){
            token
        }
    }
`

export const CREATE_SURVEY_MUTATION = gql`
    mutation CreateSurvey(
        $name: String!
        $questions: [QuestionInput!]!
    ){
        createSurvey(
            name: $name
            questions: $questions
        ){
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