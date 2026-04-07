import React from "react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card from "../ui/Card";
import {
  getCompletionRatio,
  getSurveyAnswerVolume,
  parseSurveyEditorState,
} from "../../lib/survey";
import { formatDate, formatRelativeDate, truncate } from "../../lib/format";

function SurveyCard(props) {
  var survey = props.survey;
  var editorState = parseSurveyEditorState(survey.surveyEditorState);
  var heroImage = survey.image || editorState.heroImage;
  var responseCount = props.responseCount || 0;
  var answerVolume = props.answerVolume || 0;
  var completionRate =
    typeof props.completionRate === "number"
      ? props.completionRate
      : getCompletionRatio(
          survey.questions ? survey.questions.length : 0,
          responseCount,
          answerVolume
        );

  return (
    <Card className="overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/10">
      <div className="relative h-48 overflow-hidden">
        {heroImage ? (
          <img
            src={heroImage}
            alt={survey.name}
            className="h-full w-full object-cover transition duration-700 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-100 text-slate-400">
            <span className="material-symbols-outlined text-5xl">image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent" />
        <div className="absolute left-5 top-5">
          <Badge tone={responseCount ? "secondary" : "neutral"}>
            {responseCount ? editorState.status || "Live" : "Draft"}
          </Badge>
        </div>
        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
          <div className="text-white">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">
              Version {survey.version}
            </div>
            <h3 className="mt-2 font-headline text-2xl font-bold tracking-tight">{survey.name}</h3>
          </div>
          <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {responseCount} respondents
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <p className="min-h-[48px] text-sm leading-6 text-slate-500">
          {truncate(editorState.description || editorState.introBody, 140) ||
            "A survey ready for creation, editing, and public response collection."}
        </p>

        <div className="grid grid-cols-3 gap-3 rounded-[24px] bg-surface-container-low p-4 text-center">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Questions
            </div>
            <div className="mt-2 text-xl font-black text-on-surface">
              {survey.questions ? survey.questions.length : 0}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Answers
            </div>
            <div className="mt-2 text-xl font-black text-on-surface">{answerVolume}</div>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Completion
            </div>
            <div className="mt-2 text-xl font-black text-primary">{completionRate}%</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">schedule</span>
            <span>Updated {formatRelativeDate(survey.updatedAt)}</span>
          </div>
          <span>{formatDate(survey.createdAt)}</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button variant="subtle" size="sm" iconLeft="visibility" onClick={props.onView}>
            View
          </Button>
          <Button variant="secondary" size="sm" iconLeft="edit" onClick={props.onEdit}>
            Edit
          </Button>
          <Button variant="danger" size="sm" iconLeft="delete" onClick={props.onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}

SurveyCard.getAnswerVolume = function getAnswerVolume(surveyInfo) {
  return surveyInfo ? getSurveyAnswerVolume(surveyInfo.question_answers) : 0;
};

export default SurveyCard;
