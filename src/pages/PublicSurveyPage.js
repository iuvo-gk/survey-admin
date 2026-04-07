import React from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import SurveyPublicForm from "../components/surveys/SurveyPublicForm";
import { ErrorPanel, LoadingPanel } from "../components/ui/StatePanel";
import { SUBMIT_ANSWERS_MUTATION } from "../graphql/Mutations";
import { SURVEY_QUERY } from "../graphql/Queries";

function PublicSurveyPage(props) {
  var params = useParams();
  var surveyQuery = useQuery(SURVEY_QUERY, {
    variables: { id: params.id },
    errorPolicy: "all",
  });
  var [submitAnswers, submitState] = useMutation(SUBMIT_ANSWERS_MUTATION);

  async function handleSubmit(payload) {
    return submitAnswers({
      variables: payload,
    });
  }

  return (
    <PublicLayout currentUser={props.currentUser} subLabel="Respondent experience">
      <main className="bg-surface-container-low px-4 py-10 sm:px-6 lg:px-8">
        {surveyQuery.loading && !surveyQuery.data ? <LoadingPanel label="Loading survey..." /> : null}

        {surveyQuery.error && !surveyQuery.data ? (
          <ErrorPanel
            title="Survey unavailable"
            message={surveyQuery.error.message}
            retry={surveyQuery.refetch}
          />
        ) : null}

        {surveyQuery.data && surveyQuery.data.survey ? (
          <SurveyPublicForm
            survey={surveyQuery.data.survey}
            onSubmit={handleSubmit}
            submitting={submitState.loading}
          />
        ) : null}
      </main>
    </PublicLayout>
  );
}

export default PublicSurveyPage;
