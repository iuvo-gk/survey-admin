import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { InputField } from "../components/ui/FormField";
import { LOGIN_MUTATION, SIGN_UP_MUTATION } from "../graphql/Mutations";
import { getGraphQLErrorMessages } from "../lib/format";

function AuthPage(props) {
  var history = useHistory();
  var [mode, setMode] = useState("login");
  var [formState, setFormState] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  var [authMeta, setAuthMeta] = useState(null);
  var [errorMessages, setErrorMessages] = useState([]);
  var [login, loginState] = useMutation(LOGIN_MUTATION);
  var [signUp, signUpState] = useMutation(SIGN_UP_MUTATION);
  var activeState = mode === "login" ? loginState : signUpState;

  function updateField(key, value) {
    setFormState(function setNextState(previousState) {
      return Object.assign({}, previousState, { [key]: value });
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessages([]);

    try {
      var response =
        mode === "login"
          ? await login({
              variables: {
                email: formState.email,
                password: formState.password,
              },
            })
          : await signUp({
              variables: formState,
            });

      var payload = mode === "login" ? response.data.login : response.data.signUp;
      setAuthMeta(payload);
      await props.session.completeAuth(payload.token);
      history.push("/dashboard");
    } catch (error) {
      setErrorMessages(getGraphQLErrorMessages(error));
    }
  }

  return (
    <PublicLayout currentUser={props.currentUser} subLabel="Authentication">
      <main className="bg-surface-container-low px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <div>
            <Badge tone="secondary">AuthData aware</Badge>
            <h1 className="mt-5 font-headline text-5xl font-black tracking-tight text-on-surface">
              Sign in or create an account without leaving the product shell.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-500">
              The auth surface is mapped to `login`, `signUp`, `getLoggedInUser`, and token-based
              session refresh through Apollo. There is no fake frontend-only state here.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Card className="p-6">
                <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Login mutation
                </div>
                <div className="mt-3 text-sm leading-7 text-slate-500">
                  Requests `userId`, `token`, and `expiresIn`, then immediately rehydrates session state.
                </div>
              </Card>
              <Card className="p-6">
                <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  SignUp mutation
                </div>
                <div className="mt-3 text-sm leading-7 text-slate-500">
                  Captures `first_name`, `last_name`, `email`, and `password` before redirecting into the workspace.
                </div>
              </Card>
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="grid grid-cols-2 bg-surface-container-low p-2">
              <button
                type="button"
                onClick={function onClick() {
                  setMode("login");
                }}
                className={
                  "rounded-2xl px-4 py-3 text-sm font-semibold transition " +
                  (mode === "login" ? "bg-white text-primary shadow-sm" : "text-slate-500")
                }
              >
                Login
              </button>
              <button
                type="button"
                onClick={function onClick() {
                  setMode("signup");
                }}
                className={
                  "rounded-2xl px-4 py-3 text-sm font-semibold transition " +
                  (mode === "signup" ? "bg-white text-primary shadow-sm" : "text-slate-500")
                }
              >
                Sign up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-8">
              <div>
                <h2 className="font-headline text-3xl font-black tracking-tight text-on-surface">
                  {mode === "login" ? "Welcome back" : "Create your account"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {mode === "login"
                    ? "Jump back into the dashboard and keep building."
                    : "Create a user record, receive AuthData, and enter the workspace immediately."}
                </p>
              </div>

              {errorMessages.length ? (
                <div className="rounded-[24px] bg-error-container p-4 text-sm text-error">
                  {errorMessages.map(function mapError(error, index) {
                    return <div key={index}>{error}</div>;
                  })}
                </div>
              ) : null}

              {mode === "signup" ? (
                <div className="grid gap-5 sm:grid-cols-2">
                  <InputField
                    label="First name"
                    value={formState.first_name}
                    onChange={function onChange(event) {
                      updateField("first_name", event.target.value);
                    }}
                  />
                  <InputField
                    label="Last name"
                    value={formState.last_name}
                    onChange={function onChange(event) {
                      updateField("last_name", event.target.value);
                    }}
                  />
                </div>
              ) : null}

              <InputField
                label="Email"
                type="email"
                value={formState.email}
                onChange={function onChange(event) {
                  updateField("email", event.target.value);
                }}
              />

              <InputField
                label="Password"
                type="password"
                value={formState.password}
                onChange={function onChange(event) {
                  updateField("password", event.target.value);
                }}
              />

              {authMeta ? (
                <div className="rounded-[24px] bg-primary-fixed p-4 text-sm text-primary">
                  Session expires in {authMeta.expiresIn} seconds for user {authMeta.userId}.
                </div>
              ) : null}

              <Button
                type="submit"
                fullWidth
                size="lg"
                iconLeft={activeState.loading ? "hourglass_top" : mode === "login" ? "login" : "person_add"}
                disabled={activeState.loading}
              >
                {activeState.loading
                  ? mode === "login"
                    ? "Signing in..."
                    : "Creating account..."
                  : mode === "login"
                  ? "Sign in"
                  : "Create account"}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </PublicLayout>
  );
}

export default AuthPage;
