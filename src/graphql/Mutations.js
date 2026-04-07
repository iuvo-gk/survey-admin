import gql from "graphql-tag";
import { SURVEY_FIELDS, USER_FIELDS } from "./fragments";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      userId
      token
      expiresIn
    }
  }
`;

export const SIGN_UP_MUTATION = gql`
  mutation SignUp(
    $first_name: String!
    $last_name: String!
    $email: String!
    $password: String!
  ) {
    signUp(
      first_name: $first_name
      last_name: $last_name
      email: $email
      password: $password
    ) {
      userId
      token
      expiresIn
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser(
    $first_name: String
    $last_name: String
    $email: String
    $password: ChangePasswordInput
  ) {
    updateUser(
      first_name: $first_name
      last_name: $last_name
      email: $email
      password: $password
    ) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;

export const CREATE_SURVEY_MUTATION = gql`
  mutation CreateSurvey(
    $name: String
    $questions: [QuestionInput!]!
    $surveyEditorState: String!
  ) {
    createSurvey(
      name: $name
      questions: $questions
      surveyEditorState: $surveyEditorState
    ) {
      ...SurveyFields
    }
  }
  ${SURVEY_FIELDS}
`;

export const EDIT_SURVEY_MUTATION = gql`
  mutation EditSurvey(
    $id: ID!
    $name: String
    $questions: [QuestionInput!]!
    $surveyEditorState: String!
  ) {
    editSurvey(
      id: $id
      name: $name
      questions: $questions
      surveyEditorState: $surveyEditorState
    ) {
      ...SurveyFields
    }
  }
  ${SURVEY_FIELDS}
`;

export const DELETE_SURVEY_MUTATION = gql`
  mutation DeleteSurvey($id: ID!) {
    deleteSurvey(id: $id) {
      id
      name
      deletedAt
      updatedAt
    }
  }
`;

export const SUBMIT_ANSWERS_MUTATION = gql`
  mutation SubmitAnswers(
    $survey: ID!
    $answers: [AnswerInput!]!
    $student: StudentInput!
  ) {
    submitAnswers(survey: $survey, answers: $answers, student: $student) {
      ...SurveyFields
    }
  }
  ${SURVEY_FIELDS}
`;
