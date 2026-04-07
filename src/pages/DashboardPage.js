import React, { useMemo, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Link, useHistory } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import StatCard from "../components/dashboard/StatCard";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { EmptyPanel, ErrorPanel, LoadingPanel } from "../components/ui/StatePanel";
import {
  GET_SURVEYS_INFO_QUERY,
  STATS_QUERY,
  STUDENTS_QUERY,
  SURVEYS_QUERY,
} from "../graphql/Queries";
import {
  getCompletionRatio,
  getSurveyAnswerVolume,
  getSurveyResponseCount,
  parseSurveyEditorState,
} from "../lib/survey";
import { formatRelativeDate, truncate } from "../lib/format";

function DashboardPage(props) {
  var history = useHistory();
  var [searchValue, setSearchValue] = useState("");
  var statsQuery = useQuery(STATS_QUERY, { errorPolicy: "all" });
  var surveysQuery = useQuery(SURVEYS_QUERY, { errorPolicy: "all" });
  var surveyInfoQuery = useQuery(GET_SURVEYS_INFO_QUERY, { errorPolicy: "all" });
  var studentsQuery = useQuery(STUDENTS_QUERY, { errorPolicy: "all" });

  var surveys = (surveysQuery.data && surveysQuery.data.surveys) || [];
  var surveyInfos = (surveyInfoQuery.data && surveyInfoQuery.data.getSurveysInfo) || [];
  var students = (studentsQuery.data && studentsQuery.data.students) || [];
  var stats = statsQuery.data && statsQuery.data.stats;

  var filteredSurveys = useMemo(
    function filterSurveys() {
      var query = searchValue.trim().toLowerCase();

      if (!query) {
        return surveys;
      }

      return surveys.filter(function matchSurvey(survey) {
        var editorState = parseSurveyEditorState(survey.surveyEditorState);
        return [survey.name, editorState.description]
          .join(" ")
          .toLowerCase()
          .indexOf(query) !== -1;
      });
    },
    [searchValue, surveys]
  );

  var surveyInfoById = surveyInfos.reduce(function indexSurveyInfo(map, surveyInfo) {
    map[surveyInfo.survey.id] = surveyInfo;
    return map;
  }, {});

  var leadSurvey = filteredSurveys
    .slice()
    .sort(function sortSurveys(left, right) {
      return new Date(right.updatedAt) - new Date(left.updatedAt);
    })[0];

  var leadSurveyInfo = leadSurvey ? surveyInfoById[leadSurvey.id] : null;
  var leadSurveyEditorState = leadSurvey
    ? parseSurveyEditorState(leadSurvey.surveyEditorState)
    : null;
  var leadSurveyResponses = leadSurvey ? getSurveyResponseCount(students, leadSurvey.id) : 0;
  var leadSurveyAnswerVolume = leadSurveyInfo
    ? getSurveyAnswerVolume(leadSurveyInfo.question_answers)
    : 0;
  var leadSurveyCompletion = leadSurvey
    ? getCompletionRatio(
        leadSurvey.questions.length,
        leadSurveyResponses,
        leadSurveyAnswerVolume
      )
    : 0;

  var dashboardLoading =
    statsQuery.loading &&
    surveysQuery.loading &&
    surveyInfoQuery.loading &&
    studentsQuery.loading;

  var dashboardError =
    statsQuery.error || surveysQuery.error || surveyInfoQuery.error || studentsQuery.error;

  return (
    <AdminLayout
      currentUser={props.currentUser}
      onLogout={props.session.logout}
      title={"Welcome back, " + (props.currentUser.first_name || "there") + "."}
      description="Your resolver-backed workspace is ready. Track survey performance, answer volume, and respondent activity from one place."
      eyebrow="Dashboard"
      searchValue={searchValue}
      onSearchChange={function onSearchChange(event) {
        setSearchValue(event.target.value);
      }}
      pageActions={
        <Link to="/surveys/new">
          <Button iconLeft="add_circle">Create survey</Button>
        </Link>
      }
    >
      {dashboardLoading ? <LoadingPanel label="Loading dashboard data..." /> : null}

      {!dashboardLoading && dashboardError && !surveys.length ? (
        <ErrorPanel
          message={dashboardError.message}
          retry={function retry() {
            statsQuery.refetch();
            surveysQuery.refetch();
            surveyInfoQuery.refetch();
            studentsQuery.refetch();
          }}
        />
      ) : null}

      {!dashboardLoading && !dashboardError && !surveys.length ? (
        <EmptyPanel
          icon="poll"
          title="No surveys yet"
          description="Create your first survey to populate dashboard analytics, students, and answer volume."
          actionLabel="Create survey"
          onAction={function onAction() {
            history.push("/surveys/new");
          }}
        />
      ) : null}

      {surveys.length ? (
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Students"
              value={stats ? stats.students_len : students.length}
              trend={"+" + students.length}
              caption="All respondent records from `students`."
              icon="group"
              iconBackground="bg-primary-fixed text-primary"
            />
            <StatCard
              label="Answers"
              value={stats ? stats.answers_len : 0}
              trend="Live"
              caption="Total answer volume captured by the API."
              icon="forum"
              iconBackground="bg-secondary-container text-secondary"
            />
            <StatCard
              label="Surveys"
              value={stats ? stats.surveys_len : surveys.length}
              caption="Published and draft surveys under the workspace."
              icon="poll"
              iconBackground="bg-amber-100 text-amber-700"
            />
            <StatCard
              label="Questions"
              value={stats ? stats.questions_len : 0}
              caption="Resolver-visible question definitions across surveys."
              icon="quiz"
              iconBackground="bg-error-container text-error"
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.7fr,1fr]">
            {leadSurvey ? (
              <Card className="relative overflow-hidden p-8">
                <div className="absolute -right-10 -top-6 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                <div className="relative z-10">
                  <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                    Lead survey
                  </div>
                  <h2 className="mt-4 font-headline text-4xl font-black tracking-tight text-on-surface">
                    {leadSurvey.name}
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
                    {truncate(leadSurveyEditorState.description, 180)}
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        Respondents
                      </div>
                      <div className="mt-2 font-headline text-3xl font-black text-on-surface">
                        {leadSurveyResponses}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        Answer volume
                      </div>
                      <div className="mt-2 font-headline text-3xl font-black text-on-surface">
                        {leadSurveyAnswerVolume}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        Completion
                      </div>
                      <div className="mt-2 font-headline text-3xl font-black text-primary">
                        {leadSurveyCompletion}%
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link to={"/surveys/" + leadSurvey.id}>
                      <Button variant="primary" iconLeft="bar_chart">
                        View analytics
                      </Button>
                    </Link>
                    <Link to={"/surveys/" + leadSurvey.id + "/edit"}>
                      <Button variant="secondary" iconLeft="edit">
                        Edit survey
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ) : null}

            <Card className="p-8">
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Workspace signals
              </div>
              <div className="mt-6 space-y-5">
                {filteredSurveys.slice(0, 3).map(function mapSurvey(survey) {
                  var surveyInfo = surveyInfoById[survey.id];
                  var responseCount = getSurveyResponseCount(students, survey.id);
                  var answerVolume = surveyInfo ? getSurveyAnswerVolume(surveyInfo.question_answers) : 0;

                  return (
                    <div key={survey.id} className="rounded-[24px] bg-surface-container-low p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-on-surface">{survey.name}</div>
                        <div className="text-xs text-slate-400">{formatRelativeDate(survey.updatedAt)}</div>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                            Q
                          </div>
                          <div className="mt-1 font-semibold text-on-surface">
                            {survey.questions.length}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                            Resp
                          </div>
                          <div className="mt-1 font-semibold text-on-surface">{responseCount}</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                            Ans
                          </div>
                          <div className="mt-1 font-semibold text-on-surface">{answerVolume}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Recent surveys
                </div>
                <div className="mt-2 text-2xl font-bold text-on-surface">Latest survey activity</div>
              </div>
              <Link to="/surveys">
                <Button variant="secondary" size="sm">
                  View all
                </Button>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      Survey
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      Questions
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      Responses
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredSurveys.slice(0, 6).map(function mapSurvey(survey) {
                    return (
                      <tr
                        key={survey.id}
                        className="cursor-pointer transition hover:bg-surface-container-low/40"
                        onClick={function onClick() {
                          history.push("/surveys/" + survey.id);
                        }}
                      >
                        <td className="px-6 py-5">
                          <div className="font-semibold text-on-surface">{survey.name}</div>
                          <div className="mt-1 text-sm text-slate-500">
                            {truncate(parseSurveyEditorState(survey.surveyEditorState).description, 90)}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-on-surface">
                          {survey.questions.length}
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-on-surface">
                          {getSurveyResponseCount(students, survey.id)}
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-500">
                          {formatRelativeDate(survey.updatedAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : null}
    </AdminLayout>
  );
}

export default DashboardPage;
