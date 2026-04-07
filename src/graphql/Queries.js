import gql from "graphql-tag";
import {
  ANSWER_FIELDS,
  QUESTION_WITH_OPTIONS_FIELDS,
  STUDENT_FIELDS,
  SURVEY_ANALYTICS_FIELDS,
  SURVEY_FIELDS,
  USER_FIELDS,
} from "./fragments";

export const GET_LOGGED_IN_USER_QUERY = gql`
  query GetLoggedInUser {
    getLoggedInUser {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;

export const STATS_QUERY = gql`
  query Stats {
    stats {
      students_len
      answers_len
      surveys_len
      questions_len
    }
  }
`;

export const SURVEYS_QUERY = gql`
  query Surveys {
    surveys {
      ...SurveyFields
    }
  }
  ${SURVEY_FIELDS}
`;

export const SURVEY_QUERY = gql`
  query Survey($id: ID!) {
    survey(id: $id) {
      ...SurveyAnalyticsFields
    }
  }
  ${SURVEY_ANALYTICS_FIELDS}
`;

export const STUDENTS_QUERY = gql`
  query Students {
    students {
      ...StudentFields
    }
  }
  ${STUDENT_FIELDS}
`;

export const GET_SURVEYS_INFO_QUERY = gql`
  query GetSurveysInfo {
    getSurveysInfo {
      survey {
        ...SurveyFields
      }
      question_answers {
        question {
          ...QuestionWithOptionsFields
        }
        answers {
          ...AnswerFields
        }
      }
    }
  }
  ${SURVEY_FIELDS}
  ${QUESTION_WITH_OPTIONS_FIELDS}
  ${ANSWER_FIELDS}
`;
