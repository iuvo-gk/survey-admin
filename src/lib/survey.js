import {
  CONTAINS_OPERATOR,
  EQUALS_OPERATOR,
  NOT_EQUALS_OPERATOR,
  NOT_ONE_OF_OPERATOR,
  ONE_OF_OPERATOR,
  OPTIONS_MULTI,
  OPTIONS_RADIO,
  TEXT,
} from "../constants";
import { safeParseJson, sum } from "./format";

export var QUESTION_TYPE_META = {
  TEXT: {
    label: "Long answer",
    shortLabel: "TEXT",
    icon: "short_text",
    description: "Free-form response for feedback, comments, or explanations.",
  },
  OPTIONS_RADIO: {
    label: "Single select",
    shortLabel: "OPTIONS_RADIO",
    icon: "radio_button_checked",
    description: "Exactly one option can be chosen.",
  },
  OPTIONS_MULTI: {
    label: "Multi select",
    shortLabel: "OPTIONS_MULTI",
    icon: "checklist",
    description: "Participants can select more than one option.",
  },
};

export var OPERATOR_META = {
  EQUALS_OPERATOR: { label: "equals" },
  NOT_EQUALS_OPERATOR: { label: "does not equal" },
  CONTAINS_OPERATOR: { label: "contains" },
  ONE_OF_OPERATOR: { label: "contains one of" },
  NOT_ONE_OF_OPERATOR: { label: "contains none of" },
};

export function createLocalId(prefix) {
  return [
    prefix || "item",
    Date.now().toString(36),
    Math.random().toString(36).slice(2, 9),
  ].join("_");
}

export function createEditorState() {
  return {
    eyebrow: "New survey",
    description:
      "Guide respondents through a branded, high-clarity experience with polished question flows.",
    audienceLabel: "Student Assessment Portal",
    heroImage:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    status: "Draft",
    thankYouTitle: "Survey submitted",
    thankYouMessage:
      "Your answers have been recorded. Thank you for taking the time to share them.",
    submitLabel: "Submit survey",
    introHeading: "Tell us what you think",
    introBody:
      "Each answer flows directly into your GraphQL-backed survey analytics without a separate back-office step.",
  };
}

export function createOption(seed) {
  return {
    localId: createLocalId("option"),
    id: null,
    custom_id: createLocalId("option_custom"),
    conditional_logic: false,
    conditionals: [],
    value: seed || "",
    public: true,
    addedBy: null,
  };
}

export function createQuestion(type) {
  var resolvedType = type || TEXT;
  return {
    localId: createLocalId("question"),
    id: null,
    custom_id: createLocalId("question_custom"),
    type: resolvedType,
    conditional_logic: false,
    conditionals: [],
    value: "",
    allowOther: false,
    options:
      resolvedType === TEXT
        ? []
        : [createOption("First option"), createOption("Second option")],
  };
}

export function parseConditionals(rawConditionals) {
  var parsed = safeParseJson(rawConditionals, {});
  var items = parsed && parsed.data && parsed.data.length ? parsed.data : [];

  return items.map(function normalizeRule(rule) {
    return {
      id: createLocalId("rule"),
      field: rule.field || "",
      operator: rule.operator || EQUALS_OPERATOR,
      value: rule.value || "",
      values: rule.values && rule.values.length ? rule.values : [],
    };
  });
}

export function serializeConditionals(enabled, rules) {
  if (!enabled || !rules || !rules.length) {
    return null;
  }

  return JSON.stringify({
    data: rules.map(function serializeRule(rule) {
      return {
        field: rule.field,
        operator: rule.operator,
        value: rule.value || null,
        values: rule.values && rule.values.length ? rule.values : null,
      };
    }),
  });
}

export function parseSurveyEditorState(rawState) {
  return Object.assign({}, createEditorState(), safeParseJson(rawState, {}));
}

export function normalizeOption(option) {
  return {
    localId: option.custom_id || option.id || createLocalId("option"),
    id: option.id || null,
    custom_id: option.custom_id || createLocalId("option_custom"),
    conditional_logic: Boolean(option.conditional_logic),
    conditionals: parseConditionals(option.conditionals),
    value: option.value || "",
    public: typeof option.public === "boolean" ? option.public : true,
    addedBy: option.addedBy || null,
  };
}

export function normalizeQuestion(question) {
  return {
    localId: question.custom_id || question.id || createLocalId("question"),
    id: question.id || null,
    custom_id: question.custom_id || createLocalId("question_custom"),
    type: question.type || TEXT,
    conditional_logic: Boolean(question.conditional_logic),
    conditionals: parseConditionals(question.conditionals),
    value: question.value || "",
    allowOther: Boolean(question.allowOther),
    options: (question.options || []).map(normalizeOption),
  };
}

export function normalizeSurveyForBuilder(survey) {
  if (!survey) {
    return {
      id: null,
      name: "",
      surveyEditorState: createEditorState(),
      questions: [createQuestion(TEXT)],
    };
  }

  return {
    id: survey.id,
    name: survey.name || "",
    surveyEditorState: parseSurveyEditorState(survey.surveyEditorState),
    questions: (survey.questions || []).map(normalizeQuestion),
  };
}

export function isOptionQuestion(type) {
  return type === OPTIONS_RADIO || type === OPTIONS_MULTI;
}

export function getQuestionLabel(type) {
  return QUESTION_TYPE_META[type] ? QUESTION_TYPE_META[type].label : type;
}

export function getQuestionTypeOptions() {
  return [TEXT, OPTIONS_RADIO, OPTIONS_MULTI].map(function buildTypeOption(type) {
    return {
      value: type,
      label: QUESTION_TYPE_META[type].label,
      icon: QUESTION_TYPE_META[type].icon,
      description: QUESTION_TYPE_META[type].description,
    };
  });
}

export function getOperatorOptions(questionType) {
  if (questionType === TEXT) {
    return [EQUALS_OPERATOR, NOT_EQUALS_OPERATOR, CONTAINS_OPERATOR];
  }

  if (questionType === OPTIONS_RADIO) {
    return [EQUALS_OPERATOR, NOT_EQUALS_OPERATOR];
  }

  return [ONE_OF_OPERATOR, NOT_ONE_OF_OPERATOR];
}

export function getEligibleConditionalQuestions(questions, currentCustomId) {
  var eligible = [];

  for (var index = 0; index < questions.length; index += 1) {
    if (questions[index].custom_id === currentCustomId) {
      break;
    }

    eligible.push(questions[index]);
  }

  return eligible;
}

export function createConditionalRule(questions, currentCustomId) {
  var eligibleQuestions = getEligibleConditionalQuestions(questions, currentCustomId);
  var fieldQuestion = eligibleQuestions[0];

  if (!fieldQuestion) {
    return {
      id: createLocalId("rule"),
      field: "",
      operator: EQUALS_OPERATOR,
      value: "",
      values: [],
    };
  }

  var rule = {
    id: createLocalId("rule"),
    field: fieldQuestion.custom_id,
    operator: getOperatorOptions(fieldQuestion.type)[0],
    value: "",
    values: [],
  };

  if (fieldQuestion.type === OPTIONS_RADIO && fieldQuestion.options.length) {
    rule.value = fieldQuestion.options[0].custom_id;
  }

  if (fieldQuestion.type === OPTIONS_MULTI && fieldQuestion.options.length) {
    rule.values = [fieldQuestion.options[0].custom_id];
  }

  return rule;
}

export function getQuestionByCustomId(questions, customId) {
  return (questions || []).find(function matchQuestion(question) {
    return question.custom_id === customId;
  });
}

export function getAnswerSnapshot(question, answerState) {
  if (!question || !answerState) {
    return question && question.type === TEXT ? "" : [];
  }

  if (question.type === TEXT) {
    return answerState.value || "";
  }

  if (question.type === OPTIONS_RADIO) {
    return answerState.optionCustomId || answerState.value || "";
  }

  return answerState.optionCustomIds || [];
}

export function evaluateConditionalRule(rule, answersByCustomId, questions) {
  var fieldQuestion = getQuestionByCustomId(questions, rule.field);
  var snapshot = getAnswerSnapshot(fieldQuestion, answersByCustomId[rule.field]);

  if (!fieldQuestion) {
    return true;
  }

  if (rule.operator === EQUALS_OPERATOR) {
    return snapshot === rule.value;
  }

  if (rule.operator === NOT_EQUALS_OPERATOR) {
    return snapshot !== rule.value;
  }

  if (rule.operator === CONTAINS_OPERATOR) {
    return String(snapshot || "").toLowerCase().indexOf(String(rule.value || "").toLowerCase()) !== -1;
  }

  if (rule.operator === ONE_OF_OPERATOR) {
    return (snapshot || []).some(function hasAny(selectedValue) {
      return (rule.values || []).indexOf(selectedValue) !== -1;
    });
  }

  if (rule.operator === NOT_ONE_OF_OPERATOR) {
    return !(snapshot || []).some(function hasAny(selectedValue) {
      return (rule.values || []).indexOf(selectedValue) !== -1;
    });
  }

  return true;
}

export function evaluateConditionGroup(enabled, rules, answersByCustomId, questions) {
  if (!enabled || !rules || !rules.length) {
    return true;
  }

  return rules.every(function matchRule(rule) {
    return evaluateConditionalRule(rule, answersByCustomId, questions);
  });
}

export function getVisibleQuestions(questions, answersByCustomId) {
  return (questions || []).filter(function filterQuestion(question) {
    return evaluateConditionGroup(
      question.conditional_logic,
      question.conditionals,
      answersByCustomId,
      questions
    );
  });
}

export function getVisibleOptions(question, answersByCustomId, questions) {
  return (question.options || []).filter(function filterOption(option) {
    return evaluateConditionGroup(
      option.conditional_logic,
      option.conditionals,
      answersByCustomId,
      questions
    );
  });
}

export function buildQuestionInput(question) {
  return {
    type: question.type,
    custom_id: question.custom_id,
    conditional_logic: Boolean(question.conditional_logic),
    conditionals: serializeConditionals(question.conditional_logic, question.conditionals),
    value: question.value,
    options: isOptionQuestion(question.type)
      ? (question.options || []).map(function mapOption(option) {
          return {
            conditional_logic: Boolean(option.conditional_logic),
            conditionals: serializeConditionals(option.conditional_logic, option.conditionals),
            value: option.value,
            custom_id: option.custom_id,
          };
        })
      : undefined,
    allowOther: isOptionQuestion(question.type) ? Boolean(question.allowOther) : undefined,
  };
}

export function buildSurveyPayload(builderState) {
  return {
    name: builderState.name,
    surveyEditorState: JSON.stringify(builderState.surveyEditorState),
    questions: builderState.questions.map(buildQuestionInput),
  };
}

export function buildStudentInput(studentState) {
  var payload = {
    name: studentState.name || "",
    surname: studentState.surname || "",
    email: studentState.email || "",
    tel: studentState.tel || "",
    school: studentState.school || "",
  };

  var parsedGrade = parseInt(studentState.grade, 10);
  var parsedParalel = parseInt(studentState.paralel, 10);

  if (!Number.isNaN(parsedGrade)) {
    payload.grade = parsedGrade;
  }

  if (!Number.isNaN(parsedParalel)) {
    payload.paralel = parsedParalel;
  }

  return payload;
}

export function hasQuestionAnswer(question, answerState) {
  if (!answerState) {
    return false;
  }

  if (question.type === TEXT) {
    return Boolean(String(answerState.value || "").trim());
  }

  if (question.type === OPTIONS_RADIO) {
    return Boolean(answerState.optionId || String(answerState.otherText || "").trim());
  }

  return Boolean(
    (answerState.optionIds && answerState.optionIds.length) ||
      String(answerState.otherText || "").trim()
  );
}

export function buildSubmitAnswersInput(questions, answersByCustomId) {
  return (questions || []).reduce(function collectAnswerInputs(inputs, question) {
    var answerState = answersByCustomId[question.custom_id];

    if (!hasQuestionAnswer(question, answerState)) {
      return inputs;
    }

    if (question.type === TEXT) {
      inputs.push({
        question: question.id,
        value: answerState.value,
      });
      return inputs;
    }

    if (question.type === OPTIONS_RADIO) {
      var radioAnswer = { question: question.id };

      if (answerState.optionId) {
        radioAnswer.option = answerState.optionId;
      }

      if (String(answerState.otherText || "").trim()) {
        radioAnswer.value = answerState.otherText.trim();
      }

      inputs.push(radioAnswer);
      return inputs;
    }

    var multiAnswer = { question: question.id };

    if (answerState.optionIds && answerState.optionIds.length) {
      multiAnswer.options = answerState.optionIds;
    }

    if (String(answerState.otherText || "").trim()) {
      multiAnswer.value = answerState.otherText.trim();
    }

    inputs.push(multiAnswer);
    return inputs;
  }, []);
}

export function getQuestionAnswerSummary(questionAnswers) {
  var buckets = {};
  var textResponses = [];

  (questionAnswers.answers || []).forEach(function summarize(answer) {
    if (answer.option) {
      var optionKey = answer.option.custom_id || answer.option.id;
      if (!buckets[optionKey]) {
        buckets[optionKey] = {
          id: optionKey,
          label: answer.option.value,
          count: 0,
        };
      }
      buckets[optionKey].count += 1;
    }

    (answer.options || []).forEach(function accumulateMulti(option) {
      var optionKey = option.custom_id || option.id;
      if (!buckets[optionKey]) {
        buckets[optionKey] = {
          id: optionKey,
          label: option.value,
          count: 0,
        };
      }
      buckets[optionKey].count += 1;
    });

    if (answer.value) {
      textResponses.push(answer.value);

      if (questionAnswers.question.type !== TEXT) {
        if (!buckets.__other__) {
          buckets.__other__ = {
            id: "__other__",
            label: "Other",
            count: 0,
          };
        }
        buckets.__other__.count += 1;
      }
    }
  });

  return {
    totalAnswers: (questionAnswers.answers || []).length,
    buckets: Object.keys(buckets)
      .map(function mapBucket(key) {
        return buckets[key];
      })
      .sort(function sortBuckets(left, right) {
        return right.count - left.count;
      }),
    textResponses: textResponses,
  };
}

export function getSurveyResponseCount(students, surveyId) {
  return (students || []).filter(function filterStudent(student) {
    return student && student.survey && student.survey.id === surveyId;
  }).length;
}

export function getSurveyAnswerVolume(questionAnswers) {
  return sum(
    (questionAnswers || []).map(function mapQuestion(questionAnswer) {
      return questionAnswer.answers ? questionAnswer.answers.length : 0;
    })
  );
}

export function getSurveyPublicUrl(surveyId) {
  if (typeof window === "undefined") {
    return "/take/" + surveyId;
  }

  return window.location.origin + "/take/" + surveyId;
}

export function getCompletionRatio(questionCount, responseCount, answerVolume) {
  if (!questionCount || !responseCount) {
    return 0;
  }

  return Math.min(100, Math.round((answerVolume / (questionCount * responseCount)) * 100));
}
