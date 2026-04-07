import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import AdminLayout from "../components/layout/AdminLayout";
import ProfileForm from "../components/profile/ProfileForm";
import Card from "../components/ui/Card";
import { UPDATE_USER_MUTATION } from "../graphql/Mutations";
import { getGraphQLErrorMessages } from "../lib/format";

function ProfilePage(props) {
  var [successMessage, setSuccessMessage] = useState("");
  var [errorMessages, setErrorMessages] = useState([]);
  var [updateUser, updateState] = useMutation(UPDATE_USER_MUTATION);

  async function handleSubmit(payload) {
    setSuccessMessage("");
    setErrorMessages([]);

    try {
      await updateUser({
        variables: payload,
      });
      await props.session.refetch();
      setSuccessMessage("Profile updated successfully.");
    } catch (error) {
      setErrorMessages(getGraphQLErrorMessages(error));
    }
  }

  return (
    <AdminLayout
      currentUser={props.currentUser}
      onLogout={props.session.logout}
      title="Profile"
      description="Update the `User` record and optional password payload through `updateUser`."
      eyebrow="Profile"
    >
      {successMessage ? (
        <Card className="mb-6 border border-secondary/15 bg-secondary-container/40 p-5 text-sm font-medium text-secondary">
          {successMessage}
        </Card>
      ) : null}
      {errorMessages.length ? (
        <Card className="mb-6 border border-error/15 bg-error-container/50 p-5 text-sm font-medium text-error">
          {errorMessages.map(function mapError(error, index) {
            return <div key={index}>{error}</div>;
          })}
        </Card>
      ) : null}
      <ProfileForm user={props.currentUser} onSubmit={handleSubmit} saving={updateState.loading} />
    </AdminLayout>
  );
}

export default ProfilePage;
