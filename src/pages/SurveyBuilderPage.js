import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Link, useHistory, useParams } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import SurveyBuilderWorkspace from "../components/surveys/SurveyBuilderWorkspace";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { ErrorPanel, LoadingPanel } from "../components/ui/StatePanel";
import {
  CREATE_SURVEY_MUTATION,
  EDIT_SURVEY_MUTATION,
} from "../graphql/Mutations";
import { SURVEY_QUERY } from "../graphql/Queries";
import { getGraphQLErrorMessages } from "../lib/format";
import { buildSurveyPayload, normalizeSurveyForBuilder } from "../lib/survey";

function SurveyBuilderPage(props) {
  var history = useHistory();
  var params = useParams();
  var surveyId = params.id;
  var isEditMode = Boolean(surveyId);
  var surveyQuery = useQuery(SURVEY_QUERY, {
    variables: { id: surveyId },
    skip: !isEditMode,
    errorPolicy: "all",
  });
  var [builderState, setBuilderState] = useState(normalizeSurveyForBuilder(null));
  var [submissionErrors, setSubmissionErrors] = useState([]);
  var [createSurvey, createState] = useMutation(CREATE_SURVEY_MUTATION);
  var [editSurvey, editState] = useMutation(EDIT_SURVEY_MUTATION);

  useEffect(
    function syncSurveyData() {
      if (surveyQuery.data && surveyQuery.data.survey) {
        setBuilderState(normalizeSurveyForBuilder(surveyQuery.data.survey));
      }
    },
    [surveyQuery.data]
  );

  async function handleSubmit() {
    setSubmissionErrors([]);

    try {
      var payload = buildSurveyPayload(builderState);
      var response = isEditMode
        ? await editSurvey({
            variables: Object.assign({ id: surveyId }, payload),
          })
        : await createSurvey({
            variables: payload,
          });

      var nextSurvey = isEditMode ? response.data.editSurvey : response.data.createSurvey;
      history.push("/surveys/" + nextSurvey.id);
    } catch (error) {
      setSubmissionErrors(getGraphQLErrorMessages(error));
    }
  }

  if (isEditMode && surveyQuery.loading && !surveyQuery.data) {
    return (
      <AdminLayout
        currentUser={props.currentUser}
        onLogout={props.session.logout}
        title="Survey builder"
        description="Loading survey data for editing."
        eyebrow="Builder"
      >
        <LoadingPanel label="Loading survey for editing..." />
      </AdminLayout>
    );
  }

  if (isEditMode && surveyQuery.error && !surveyQuery.data) {
    return (
      <AdminLayout
        currentUser={props.currentUser}
        onLogout={props.session.logout}
        title="Survey builder"
        description="Unable to load the survey."
        eyebrow="Builder"
      >
        <ErrorPanel message={surveyQuery.error.message} retry={surveyQuery.refetch} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      currentUser={props.currentUser}
      onLogout={props.session.logout}
      title={isEditMode ? "Edit survey" : "Create survey"}
      description="Compose the survey shell, questions, options, and conditional logic that serialize directly into `QuestionInput[]` and `surveyEditorState`."
      eyebrow="Builder"
      pageActions={
        isEditMode ? (
          <Link to={"/surveys/" + surveyId}>
            <Button variant="secondary" iconLeft="analytics">
              View analytics
            </Button>
          </Link>
        ) : null
      }
    >
      {submissionErrors.length ? (
        <Card className="mb-6 border border-error/20 bg-error-container p-6">
          <div className="text-sm font-semibold text-error">The survey could not be saved</div>
          <div className="mt-3 space-y-2 text-sm text-error">
            {submissionErrors.map(function mapError(error, index) {
              return <div key={index}>{error}</div>;
            })}
          </div>
        </Card>
      ) : null}

      <SurveyBuilderWorkspace
        builderState={builderState}
        setBuilderState={setBuilderState}
        onSubmit={handleSubmit}
        submitting={createState.loading || editState.loading}
        mode={isEditMode ? "edit" : "create"}
      />
    </AdminLayout>
  );
}

export default SurveyBuilderPage;
