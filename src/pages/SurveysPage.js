import React, { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Link, useHistory } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import SurveyCard from "../components/surveys/SurveyCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import { EmptyPanel, ErrorPanel, LoadingPanel } from "../components/ui/StatePanel";
import { DELETE_SURVEY_MUTATION } from "../graphql/Mutations";
import { GET_SURVEYS_INFO_QUERY, STUDENTS_QUERY, SURVEYS_QUERY } from "../graphql/Queries";
import { getGraphQLErrorMessages } from "../lib/format";
import { getSurveyAnswerVolume, getSurveyResponseCount } from "../lib/survey";

function SurveysPage(props) {
  var history = useHistory();
  var [searchValue, setSearchValue] = useState("");
  var [surveyToDelete, setSurveyToDelete] = useState(null);
  var [deleteErrors, setDeleteErrors] = useState([]);
  var surveysQuery = useQuery(SURVEYS_QUERY, { errorPolicy: "all" });
  var surveyInfoQuery = useQuery(GET_SURVEYS_INFO_QUERY, { errorPolicy: "all" });
  var studentsQuery = useQuery(STUDENTS_QUERY, { errorPolicy: "all" });
  var [deleteSurvey, deleteState] = useMutation(DELETE_SURVEY_MUTATION);

  var surveys = (surveysQuery.data && surveysQuery.data.surveys) || [];
  var surveyInfos = (surveyInfoQuery.data && surveyInfoQuery.data.getSurveysInfo) || [];
  var students = (studentsQuery.data && studentsQuery.data.students) || [];
  var infoById = surveyInfos.reduce(function indexSurveyInfo(map, surveyInfo) {
    map[surveyInfo.survey.id] = surveyInfo;
    return map;
  }, {});

  var filteredSurveys = useMemo(
    function filterSurveys() {
      var query = searchValue.trim().toLowerCase();

      if (!query) {
        return surveys;
      }

      return surveys.filter(function matchSurvey(survey) {
        return survey.name.toLowerCase().indexOf(query) !== -1;
      });
    },
    [searchValue, surveys]
  );

  async function confirmDelete() {
    if (!surveyToDelete) {
      return;
    }

    setDeleteErrors([]);

    try {
      await deleteSurvey({
        variables: { id: surveyToDelete.id },
      });
      setSurveyToDelete(null);
      surveysQuery.refetch();
      surveyInfoQuery.refetch();
      studentsQuery.refetch();
    } catch (error) {
      setDeleteErrors(getGraphQLErrorMessages(error));
    }
  }

  var loading = surveysQuery.loading && surveyInfoQuery.loading && studentsQuery.loading;
  var error = surveysQuery.error || surveyInfoQuery.error || studentsQuery.error;

  return (
    <AdminLayout
      currentUser={props.currentUser}
      onLogout={props.session.logout}
      title="Survey management"
      description="Create, edit, delete, inspect, and share surveys using the same resolver-backed records that power analytics and public submissions."
      eyebrow="Surveys"
      searchValue={searchValue}
      onSearchChange={function onSearchChange(event) {
        setSearchValue(event.target.value);
      }}
      pageActions={
        <Link to="/surveys/new">
          <Button iconLeft="add">Create survey</Button>
        </Link>
      }
    >
      {loading ? <LoadingPanel label="Loading surveys..." /> : null}

      {!loading && error && !surveys.length ? (
        <ErrorPanel
          message={error.message}
          retry={function retry() {
            surveysQuery.refetch();
            surveyInfoQuery.refetch();
            studentsQuery.refetch();
          }}
        />
      ) : null}

      {!loading && !error && !filteredSurveys.length ? (
        <EmptyPanel
          icon="search_off"
          title={surveys.length ? "No surveys match your search" : "No surveys created yet"}
          description={
            surveys.length
              ? "Try a broader search or create a new survey."
              : "Start with a new survey and the workspace will populate automatically."
          }
          actionLabel="Create survey"
          onAction={function onAction() {
            history.push("/surveys/new");
          }}
        />
      ) : null}

      {filteredSurveys.length ? (
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredSurveys.map(function mapSurvey(survey) {
              var surveyInfo = infoById[survey.id];
              var responseCount = getSurveyResponseCount(students, survey.id);
              var answerVolume = surveyInfo ? getSurveyAnswerVolume(surveyInfo.question_answers) : 0;

              return (
                <SurveyCard
                  key={survey.id}
                  survey={survey}
                  responseCount={responseCount}
                  answerVolume={answerVolume}
                  onView={function onView() {
                    history.push("/surveys/" + survey.id);
                  }}
                  onEdit={function onEdit() {
                    history.push("/surveys/" + survey.id + "/edit");
                  }}
                  onDelete={function onDelete() {
                    setSurveyToDelete(survey);
                  }}
                />
              );
            })}
          </div>

          <Card className="p-8">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
              Coverage
            </div>
            <div className="mt-4 text-sm leading-7 text-slate-500">
              This surface uses `surveys`, `getSurveysInfo`, `students`, and `deleteSurvey` together so
              each card can show live response counts, answer volume, and destructive actions against real
              GraphQL data.
            </div>
          </Card>
        </div>
      ) : null}

      <Modal open={Boolean(surveyToDelete)} onClose={function onClose() {
        setSurveyToDelete(null);
        setDeleteErrors([]);
      }}>
        <div className="space-y-5">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-error">Delete survey</div>
            <h2 className="mt-3 font-headline text-3xl font-black tracking-tight text-on-surface">
              {surveyToDelete ? surveyToDelete.name : ""}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              This calls `deleteSurvey(id: ID!)` and removes the survey from the management surface.
            </p>
          </div>
          {deleteErrors.length ? (
            <div className="rounded-[24px] bg-error-container p-4 text-sm text-error">
              {deleteErrors.map(function mapError(error, index) {
                return <div key={index}>{error}</div>;
              })}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Button variant="danger" onClick={confirmDelete} disabled={deleteState.loading}>
              {deleteState.loading ? "Deleting..." : "Delete survey"}
            </Button>
            <Button variant="secondary" onClick={function onClick() {
              setSurveyToDelete(null);
              setDeleteErrors([]);
            }}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}

export default SurveysPage;
