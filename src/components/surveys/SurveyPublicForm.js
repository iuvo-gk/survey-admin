import React, { useMemo, useState } from "react";
import { getGraphQLErrorMessages, pluralize } from "../../lib/format";
import {
  buildStudentInput,
  buildSubmitAnswersInput,
  getVisibleOptions,
  getVisibleQuestions,
  hasQuestionAnswer,
  normalizeQuestion,
  parseSurveyEditorState,
} from "../../lib/survey";
import { OPTIONS_MULTI, OPTIONS_RADIO, TEXT } from "../../constants";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { InputField, TextareaField } from "../ui/FormField";

function RadioQuestion(props) {
  return (
    <div className="space-y-3">
      {props.options.map(function mapOption(option) {
        var checked = props.answer && props.answer.optionId === option.id;

        return (
          <button
            key={option.custom_id}
            type="button"
            onClick={function onClick() {
              props.onChange({
                optionId: option.id,
                optionCustomId: option.custom_id,
                otherText: "",
              });
            }}
            className={
              "flex w-full items-center justify-between rounded-[24px] px-5 py-5 text-left transition " +
              (checked
                ? "bg-primary-fixed ring-2 ring-primary/30"
                : "bg-surface-container-low hover:bg-surface-container")
            }
          >
            <span className={checked ? "font-bold text-primary" : "font-medium text-slate-700"}>
              {option.value}
            </span>
            <span
              className={
                "flex h-6 w-6 items-center justify-center rounded-full border-2 transition " +
                (checked ? "border-primary" : "border-outline-variant")
              }
            >
              {checked ? <span className="h-3 w-3 rounded-full bg-primary" /> : null}
            </span>
          </button>
        );
      })}

      {props.allowOther ? (
        <div className="rounded-[24px] bg-surface-container-low p-4">
          <div className="mb-2 text-sm font-semibold text-on-surface">Other</div>
          <input
            type="text"
            value={(props.answer && props.answer.otherText) || ""}
            onChange={function onChange(event) {
              props.onChange({
                optionId: null,
                optionCustomId: "",
                otherText: event.target.value,
              });
            }}
            placeholder="Type a custom answer"
            className="w-full rounded-2xl border-none bg-white/80 px-4 py-3 text-sm shadow-inner shadow-white/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      ) : null}
    </div>
  );
}

function MultiQuestion(props) {
  var selectedIds = (props.answer && props.answer.optionIds) || [];
  var selectedCustomIds = (props.answer && props.answer.optionCustomIds) || [];

  return (
    <div className="space-y-3">
      {props.options.map(function mapOption(option) {
        var checked = selectedIds.indexOf(option.id) !== -1;

        return (
          <button
            key={option.custom_id}
            type="button"
            onClick={function onClick() {
              if (checked) {
                props.onChange({
                  optionIds: selectedIds.filter(function filterId(id) {
                    return id !== option.id;
                  }),
                  optionCustomIds: selectedCustomIds.filter(function filterId(customId) {
                    return customId !== option.custom_id;
                  }),
                });
              } else {
                props.onChange({
                  optionIds: selectedIds.concat(option.id),
                  optionCustomIds: selectedCustomIds.concat(option.custom_id),
                });
              }
            }}
            className={
              "flex w-full items-center justify-between rounded-[24px] px-5 py-5 text-left transition " +
              (checked
                ? "bg-primary-fixed ring-2 ring-primary/30"
                : "bg-surface-container-low hover:bg-surface-container")
            }
          >
            <span className={checked ? "font-bold text-primary" : "font-medium text-slate-700"}>
              {option.value}
            </span>
            <span
              className={
                "flex h-6 w-6 items-center justify-center rounded-lg border-2 transition " +
                (checked ? "border-primary bg-primary text-white" : "border-outline-variant")
              }
            >
              {checked ? <span className="material-symbols-outlined text-[16px]">check</span> : null}
            </span>
          </button>
        );
      })}

      {props.allowOther ? (
        <div className="rounded-[24px] bg-surface-container-low p-4">
          <div className="mb-2 text-sm font-semibold text-on-surface">Other</div>
          <input
            type="text"
            value={(props.answer && props.answer.otherText) || ""}
            onChange={function onChange(event) {
              props.onChange({ otherText: event.target.value });
            }}
            placeholder="Add another answer"
            className="w-full rounded-2xl border-none bg-white/80 px-4 py-3 text-sm shadow-inner shadow-white/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      ) : null}
    </div>
  );
}

function QuestionBlock(props) {
  var question = props.question;
  var answer = props.answer || {};
  var visibleOptions = getVisibleOptions(question, props.answersByCustomId, props.questions);

  return (
    <Card className={"p-8 sm:p-10 " + (props.highlight ? "border-l-4 border-primary" : "")}>
      <div className="mb-6 flex items-center gap-3">
        <Badge tone={props.highlight ? "primary" : "neutral"}>
          Question {props.index + 1}
        </Badge>
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
          {question.type}
        </span>
      </div>

      <h2 className="max-w-3xl font-headline text-2xl font-bold leading-snug text-on-surface sm:text-3xl">
        {question.value}
      </h2>

      <div className="mt-8">
        {question.type === TEXT ? (
          <TextareaField
            label="Your answer"
            rows={5}
            value={answer.value || ""}
            onChange={function onChange(event) {
              props.onChange({ value: event.target.value });
            }}
            inputClassName="min-h-[160px]"
            placeholder="Write your answer here..."
          />
        ) : null}

        {question.type === OPTIONS_RADIO ? (
          <RadioQuestion
            options={visibleOptions}
            answer={answer}
            allowOther={question.allowOther}
            onChange={props.onChange}
          />
        ) : null}

        {question.type === OPTIONS_MULTI ? (
          <MultiQuestion
            options={visibleOptions}
            answer={answer}
            allowOther={question.allowOther}
            onChange={props.onChange}
          />
        ) : null}
      </div>
    </Card>
  );
}

function SurveyPublicForm(props) {
  var editorState = parseSurveyEditorState(props.survey.surveyEditorState);
  var questions = useMemo(
    function normalizeQuestions() {
      return (props.survey.questions || []).map(normalizeQuestion);
    },
    [props.survey.questions]
  );
  var [studentState, setStudentState] = useState({
    name: "",
    surname: "",
    email: "",
    tel: "",
    school: "",
    grade: "",
    paralel: "",
  });
  var [answersByCustomId, setAnswersByCustomId] = useState({});
  var [localErrors, setLocalErrors] = useState([]);
  var [submitted, setSubmitted] = useState(false);
  var visibleQuestions = getVisibleQuestions(questions, answersByCustomId);
  var answeredVisibleQuestions = visibleQuestions.filter(function filterAnswered(question) {
    return hasQuestionAnswer(question, answersByCustomId[question.custom_id]);
  }).length;
  var completion = visibleQuestions.length
    ? Math.round((answeredVisibleQuestions / visibleQuestions.length) * 100)
    : 0;

  function updateStudent(key, value) {
    setStudentState(function setNextState(previousState) {
      return Object.assign({}, previousState, { [key]: value });
    });
  }

  function updateAnswer(questionCustomId, nextPatch) {
    setAnswersByCustomId(function setNextAnswers(previousState) {
      return Object.assign({}, previousState, {
        [questionCustomId]: Object.assign({}, previousState[questionCustomId], nextPatch),
      });
    });
  }

  function validateStudent() {
    var errors = [];

    ["name", "surname", "email", "tel", "school"].forEach(function validateField(key) {
      if (!String(studentState[key] || "").trim()) {
        errors.push("`" + key + "` is required.");
      }
    });

    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    var studentErrors = validateStudent();
    if (studentErrors.length) {
      setLocalErrors(studentErrors);
      return;
    }

    setLocalErrors([]);

    try {
      await props.onSubmit({
        survey: props.survey.id,
        student: buildStudentInput(studentState),
        answers: buildSubmitAnswersInput(visibleQuestions, answersByCustomId),
      });
      setSubmitted(true);
    } catch (error) {
      setLocalErrors(getGraphQLErrorMessages(error));
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl">
        <Card className="overflow-hidden p-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary-container text-secondary">
            <span className="material-symbols-outlined text-4xl">check_circle</span>
          </div>
          <h1 className="mt-6 font-headline text-4xl font-black tracking-tight text-on-surface">
            {editorState.thankYouTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500">
            {editorState.thankYouMessage}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-8">
      <div className="mb-2">
        <div className="mb-4 flex items-end justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
            Progress
          </span>
          <span className="text-sm font-bold text-primary">
            {answeredVisibleQuestions} of {visibleQuestions.length}{" "}
            {pluralize(visibleQuestions.length, "question", "questions")}
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-secondary-container">
          <div
            className="h-full rounded-full bg-secondary transition-all duration-300"
            style={{ width: completion + "%" }}
          />
        </div>
      </div>

      {localErrors.length ? (
        <Card className="border border-error/20 bg-error-container p-6">
          <div className="text-sm font-semibold text-error">Submission needs attention</div>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-error">
            {localErrors.map(function mapError(error, index) {
              return <li key={index}>{error}</li>;
            })}
          </ul>
        </Card>
      ) : null}

      <Card className="overflow-hidden">
        <div className="relative">
          {editorState.heroImage ? (
            <img
              src={editorState.heroImage}
              alt={props.survey.name}
              className="h-64 w-full object-cover"
            />
          ) : (
            <div className="h-64 bg-gradient-to-br from-primary to-secondary" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <Badge tone="dark">{editorState.audienceLabel}</Badge>
            <h1 className="mt-4 font-headline text-4xl font-black tracking-tight">{props.survey.name}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/75">
              {editorState.description}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-8">
        <div className="mb-8">
          <h2 className="font-headline text-3xl font-black tracking-tight text-on-surface">
            Student information
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            These fields map directly to the `StudentInput` required by the resolver.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <InputField
            label="Name"
            value={studentState.name}
            onChange={function onChange(event) {
              updateStudent("name", event.target.value);
            }}
            placeholder="Alex"
          />
          <InputField
            label="Surname"
            value={studentState.surname}
            onChange={function onChange(event) {
              updateStudent("surname", event.target.value);
            }}
            placeholder="Rivera"
          />
          <InputField
            className="md:col-span-2"
            label="Email"
            type="email"
            value={studentState.email}
            onChange={function onChange(event) {
              updateStudent("email", event.target.value);
            }}
            placeholder="alex@example.edu"
          />
          <InputField
            label="Phone"
            value={studentState.tel}
            onChange={function onChange(event) {
              updateStudent("tel", event.target.value);
            }}
            placeholder="+48 123 456 789"
          />
          <InputField
            label="School"
            value={studentState.school}
            onChange={function onChange(event) {
              updateStudent("school", event.target.value);
            }}
            placeholder="North Academic Institute"
          />
          <InputField
            label="Grade"
            value={studentState.grade}
            onChange={function onChange(event) {
              updateStudent("grade", event.target.value);
            }}
            placeholder="11"
          />
          <InputField
            label="Paralel"
            value={studentState.paralel}
            onChange={function onChange(event) {
              updateStudent("paralel", event.target.value);
            }}
            placeholder="2"
          />
        </div>
      </Card>

      {visibleQuestions.map(function mapQuestion(question, index) {
        return (
          <QuestionBlock
            key={question.custom_id}
            highlight={index === 0}
            index={index}
            question={question}
            questions={questions}
            answersByCustomId={answersByCustomId}
            answer={answersByCustomId[question.custom_id]}
            onChange={function onChange(nextPatch) {
              updateAnswer(question.custom_id, nextPatch);
            }}
          />
        );
      })}

      <div className="flex flex-col items-stretch justify-between gap-4 pb-8 sm:flex-row sm:items-center">
        <div className="text-sm leading-6 text-slate-500">
          {visibleQuestions.length} active {pluralize(visibleQuestions.length, "question")} in this flow.
        </div>
        <Button
          type="submit"
          size="lg"
          iconLeft={props.submitting ? "hourglass_top" : "send"}
          disabled={props.submitting}
        >
          {props.submitting ? "Submitting..." : editorState.submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default SurveyPublicForm;
