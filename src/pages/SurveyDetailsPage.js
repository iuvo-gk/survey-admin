import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Link, useHistory, useParams } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import SurveyAnalyticsPanel from "../components/surveys/SurveyAnalyticsPanel";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import { ErrorPanel, LoadingPanel } from "../components/ui/StatePanel";
import { DELETE_SURVEY_MUTATION } from "../graphql/Mutations";
import { GET_SURVEYS_INFO_QUERY, STUDENTS_QUERY, SURVEY_QUERY } from "../graphql/Queries";
import { getGraphQLErrorMessages } from "../lib/format";

function SurveyDetailsPage(props) {
  var history = useHistory();
  var params = useParams();
  var surveyId = params.id;
  var [deleteErrors, setDeleteErrors] = useState([]);
  var [copyState, setCopyState] = useState("");
  var [deleteOpen, setDeleteOpen] = useState(false);
  var surveyQuery = useQuery(SURVEY_QUERY, {
    variables: { id: surveyId },
    errorPolicy: "all",
  });
  var surveyInfoQuery = useQuery(GET_SURVEYS_INFO_QUERY, { errorPolicy: "all" });
  var studentsQuery = useQuery(STUDENTS_QUERY, { errorPolicy: "all" });
  var [deleteSurvey, deleteState] = useMutation(DELETE_SURVEY_MUTATION);

  var survey = surveyQuery.data && surveyQuery.data.survey;
  var surveyInfoList =
    (surveyInfoQuery.data && surveyInfoQuery.data.getSurveysInfo) || [];
  var surveyInfo = surveyInfoList.find(function findSurveyInfo(item) {
    return item.survey.id === surveyId;
  });

  if (!surveyInfo && survey) {
    surveyInfo = {
      survey: survey,
      question_answers: survey.questions.map(function mapQuestion(question) {
        return {
          question: question,
          answers: question.answers || [],
        };
      }),
    };
  }

  async function handleCopyLink() {
    try {
      var url = window.location.origin + "/take/" + surveyId;
      await navigator.clipboard.writeText(url);
      setCopyState("Public link copied");
      window.setTimeout(function clearCopyState() {
        setCopyState("");
      }, 2000);
    } catch (error) {
      setCopyState("Could not copy link");
    }
  }

  async function handleDelete() {
    try {
      await deleteSurvey({ variables: { id: surveyId } });
      history.push("/surveys");
    } catch (error) {
      setDeleteErrors(getGraphQLErrorMessages(error));
    }
  }

  if (surveyQuery.loading && !survey) {
    return (
      <AdminLayout
        currentUser={props.currentUser}
        onLogout={props.session.logout}
        title="Survey analytics"
        description="Loading survey analytics."
        eyebrow="Analytics"
      >
        <LoadingPanel label="Loading survey..." />
      </AdminLayout>
    );
  }

  if (surveyQuery.error && !survey) {
    return (
      <AdminLayout
        currentUser={props.currentUser}
        onLogout={props.session.logout}
        title="Survey analytics"
        description="Unable to load survey analytics."
        eyebrow="Analytics"
      >
        <ErrorPanel message={surveyQuery.error.message} retry={surveyQuery.refetch} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      currentUser={props.currentUser}
      onLogout={props.session.logout}
      title={survey ? survey.name : "Survey analytics"}
      description="Inspect answer distributions, respondent counts, and survey metadata using `survey(id)` and `getSurveysInfo` together."
      eyebrow="Analytics"
      pageActions={
        <React.Fragment>
          <Button variant="secondary" iconLeft="link" onClick={handleCopyLink}>
            {copyState || "Copy public link"}
          </Button>
          <Link to={"/surveys/" + surveyId + "/edit"}>
            <Button variant="secondary" iconLeft="edit">
              Edit survey
            </Button>
          </Link>
          <a href={"/take/" + surveyId} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" iconLeft="open_in_new">
              Open public survey
            </Button>
          </a>
          <Button variant="danger" iconLeft="delete" onClick={function onClick() {
            setDeleteOpen(true);
          }}>
            Delete
          </Button>
        </React.Fragment>
      }
    >
      {surveyInfo ? (
        <SurveyAnalyticsPanel
          surveyInfo={surveyInfo}
          students={(studentsQuery.data && studentsQuery.data.students) || []}
          onCopyLink={handleCopyLink}
        />
      ) : (
        <LoadingPanel label="Preparing analytics..." />
      )}

      <Modal open={deleteOpen} onClose={function onClose() {
        setDeleteOpen(false);
        setDeleteErrors([]);
      }}>
        <div className="space-y-5">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-error">Delete survey</div>
            <h2 className="mt-3 font-headline text-3xl font-black tracking-tight text-on-surface">
              {survey ? survey.name : ""}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              This action calls `deleteSurvey` and then returns you to the survey management view.
            </p>
          </div>
          {deleteErrors.length ? (
            <Card className="border border-error/20 bg-error-container p-4">
              <div className="space-y-2 text-sm text-error">
                {deleteErrors.map(function mapError(error, index) {
                  return <div key={index}>{error}</div>;
                })}
              </div>
            </Card>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Button variant="danger" onClick={handleDelete} disabled={deleteState.loading}>
              {deleteState.loading ? "Deleting..." : "Delete survey"}
            </Button>
            <Button variant="secondary" onClick={function onClick() {
              setDeleteOpen(false);
            }}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}

export default SurveyDetailsPage;
