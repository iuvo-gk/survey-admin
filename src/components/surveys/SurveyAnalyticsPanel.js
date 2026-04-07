import React from "react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card from "../ui/Card";
import {
  getCompletionRatio,
  getQuestionAnswerSummary,
  getSurveyAnswerVolume,
  getSurveyPublicUrl,
  getSurveyResponseCount,
  parseSurveyEditorState,
} from "../../lib/survey";
import { formatDateTime, truncate } from "../../lib/format";

function QuestionInsightCard(props) {
  var summary = getQuestionAnswerSummary(props.questionAnswer);
  var question = props.questionAnswer.question;

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
            {question.type}
          </div>
          <h3 className="mt-2 text-xl font-bold text-on-surface">{question.value}</h3>
        </div>
        <Badge tone={summary.totalAnswers ? "secondary" : "neutral"}>
          {summary.totalAnswers} answers
        </Badge>
      </div>

      {summary.buckets.length ? (
        <div className="mt-6 space-y-3">
          {summary.buckets.map(function mapBucket(bucket) {
            var ratio = summary.totalAnswers
              ? Math.max(8, Math.round((bucket.count / summary.totalAnswers) * 100))
              : 0;

            return (
              <div key={bucket.id}>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-on-surface">{bucket.label}</span>
                  <span className="text-slate-500">{bucket.count}</span>
                </div>
                <div className="h-2 rounded-full bg-surface-container-high">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                    style={{ width: ratio + "%" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {summary.textResponses.length ? (
        <div className="mt-6 space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
            Recent text responses
          </div>
          {summary.textResponses.slice(0, 3).map(function mapResponse(response, index) {
            return (
              <div
                key={index}
                className="rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600"
              >
                {truncate(response, 180)}
              </div>
            );
          })}
        </div>
      ) : null}
    </Card>
  );
}

function SurveyAnalyticsPanel(props) {
  var surveyInfo = props.surveyInfo;
  var survey = surveyInfo.survey;
  var editorState = parseSurveyEditorState(survey.surveyEditorState);
  var responseCount = getSurveyResponseCount(props.students, survey.id);
  var answerVolume = getSurveyAnswerVolume(surveyInfo.question_answers);
  var completionRate = getCompletionRatio(
    survey.questions ? survey.questions.length : 0,
    responseCount,
    answerVolume
  );
  var shareUrl = getSurveyPublicUrl(survey.id);

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden p-8">
        <div className="absolute -right-12 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.8fr,1fr]">
          <div>
            <Badge tone="secondary">{editorState.status || "Live survey"}</Badge>
            <h2 className="mt-4 font-headline text-3xl font-black tracking-tight text-on-surface">
              {survey.name}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
              {editorState.description || editorState.introBody}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="primary" iconLeft="link" onClick={props.onCopyLink}>
                Copy public link
              </Button>
              <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" iconLeft="open_in_new">
                  Open public survey
                </Button>
              </a>
            </div>

            <div className="mt-6 rounded-[24px] bg-surface-container-low p-4">
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Public URL
              </div>
              <div className="mt-2 break-all text-sm font-medium text-on-surface">{shareUrl}</div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <Card className="p-5">
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Respondents
              </div>
              <div className="mt-3 font-headline text-4xl font-black text-on-surface">
                {responseCount}
              </div>
            </Card>
            <Card className="p-5">
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Answer volume
              </div>
              <div className="mt-3 font-headline text-4xl font-black text-on-surface">
                {answerVolume}
              </div>
            </Card>
            <Card className="p-5">
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Completion rate
              </div>
              <div className="mt-3 font-headline text-4xl font-black text-primary">
                {completionRate}%
              </div>
            </Card>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        {(surveyInfo.question_answers || []).map(function mapQuestionAnswer(questionAnswer) {
          return (
            <QuestionInsightCard
              key={questionAnswer.question.id || questionAnswer.question.custom_id}
              questionAnswer={questionAnswer}
            />
          );
        })}
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
              Survey metadata
            </div>
            <div className="mt-3 text-sm leading-7 text-slate-500">
              Version {survey.version} - Created {formatDateTime(survey.createdAt)} - Updated{" "}
              {formatDateTime(survey.updatedAt)}
            </div>
          </div>
          <Badge tone="dark">{survey.questions.length} questions</Badge>
        </div>
      </Card>
    </div>
  );
}

export default SurveyAnalyticsPanel;
