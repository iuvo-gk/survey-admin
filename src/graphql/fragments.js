import gql from "graphql-tag";

export const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    first_name
    last_name
    email
    createdAt
    updatedAt
  }
`;

export const OPTION_CORE_FIELDS = gql`
  fragment OptionCoreFields on Option {
    id
    custom_id
    conditional_logic
    conditionals
    public
    value
    deletedAt
    createdAt
    updatedAt
    addedBy {
      id
      name
      surname
      email
    }
  }
`;

export const QUESTION_CORE_FIELDS = gql`
  fragment QuestionCoreFields on Question {
    id
    custom_id
    type
    fromSurveyVersion
    conditional_logic
    conditionals
    value
    allowOther
    deletedAt
    createdAt
    updatedAt
  }
`;

export const QUESTION_WITH_OPTIONS_FIELDS = gql`
  fragment QuestionWithOptionsFields on Question {
    ...QuestionCoreFields
    options {
      ...OptionCoreFields
    }
  }
  ${QUESTION_CORE_FIELDS}
  ${OPTION_CORE_FIELDS}
`;

export const ANSWER_FIELDS = gql`
  fragment AnswerFields on Answer {
    id
    value
    createdAt
    updatedAt
    question {
      id
      custom_id
      type
      value
    }
    option {
      id
      custom_id
      value
    }
    options {
      id
      custom_id
      value
    }
    student {
      id
      name
      surname
      email
      tel
      school
      grade
      paralel
      createdAt
      updatedAt
    }
  }
`;

export const SURVEY_FIELDS = gql`
  fragment SurveyFields on Survey {
    id
    name
    image
    version
    surveyEditorState
    deletedAt
    createdAt
    updatedAt
    questions {
      ...QuestionWithOptionsFields
    }
  }
  ${QUESTION_WITH_OPTIONS_FIELDS}
`;

export const SURVEY_ANALYTICS_FIELDS = gql`
  fragment SurveyAnalyticsFields on Survey {
    id
    name
    image
    version
    surveyEditorState
    deletedAt
    createdAt
    updatedAt
    questions {
      ...QuestionWithOptionsFields
      answers {
        ...AnswerFields
      }
    }
  }
  ${QUESTION_WITH_OPTIONS_FIELDS}
  ${ANSWER_FIELDS}
`;

export const STUDENT_FIELDS = gql`
  fragment StudentFields on Student {
    id
    name
    surname
    email
    tel
    answers_len
    school
    grade
    paralel
    createdAt
    updatedAt
    survey {
      id
      name
      version
    }
    department {
      id
      name
      createdAt
      updatedAt
    }
    answers {
      ...AnswerFields
    }
  }
  ${ANSWER_FIELDS}
`;
