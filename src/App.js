import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import client from "./apolloClient";
import { useAppSession } from "./hooks/useAppSession";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import PublicSurveyPage from "./pages/PublicSurveyPage";
import StudentsPage from "./pages/StudentsPage";
import SurveyBuilderPage from "./pages/SurveyBuilderPage";
import SurveyDetailsPage from "./pages/SurveyDetailsPage";
import SurveysPage from "./pages/SurveysPage";

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-container-low px-4">
      <div className="w-full max-w-md rounded-[32px] bg-white p-8 text-center shadow-xl shadow-slate-900/10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed text-primary">
          <span className="material-symbols-outlined animate-pulse text-4xl">hourglass_top</span>
        </div>
        <h1 className="mt-5 font-headline text-3xl font-black tracking-tight text-on-surface">
          Loading workspace
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          Reconnecting session state and GraphQL data.
        </p>
      </div>
    </div>
  );
}

function ProtectedRoute(props) {
  var Component = props.component;
  var session = props.session;

  return (
    <Route
      exact={props.exact}
      path={props.path}
      render={function renderRoute(routeProps) {
        if (session.loading && !session.user) {
          return <FullScreenLoader />;
        }

        if (!session.user) {
          return <Redirect to="/auth" />;
        }

        return <Component {...routeProps} currentUser={session.user} session={session} />;
      }}
    />
  );
}

function GuestRoute(props) {
  var Component = props.component;
  var session = props.session;

  return (
    <Route
      exact={props.exact}
      path={props.path}
      render={function renderRoute(routeProps) {
        if (session.loading && !session.user) {
          return <FullScreenLoader />;
        }

        if (session.user) {
          return <Redirect to="/dashboard" />;
        }

        return <Component {...routeProps} currentUser={session.user} session={session} />;
      }}
    />
  );
}

function PublicRoute(props) {
  var Component = props.component;
  var session = props.session;

  return (
    <Route
      exact={props.exact}
      path={props.path}
      render={function renderRoute(routeProps) {
        return <Component {...routeProps} currentUser={session.user} session={session} />;
      }}
    />
  );
}

function AppRouter() {
  var session = useAppSession();

  return (
    <Router>
      <Switch>
        <PublicRoute exact path="/" component={LandingPage} session={session} />
        <GuestRoute exact path="/auth" component={AuthPage} session={session} />
        <ProtectedRoute exact path="/dashboard" component={DashboardPage} session={session} />
        <ProtectedRoute exact path="/surveys" component={SurveysPage} session={session} />
        <ProtectedRoute exact path="/surveys/new" component={SurveyBuilderPage} session={session} />
        <ProtectedRoute
          exact
          path="/surveys/:id/edit"
          component={SurveyBuilderPage}
          session={session}
        />
        <ProtectedRoute exact path="/surveys/:id" component={SurveyDetailsPage} session={session} />
        <ProtectedRoute exact path="/students" component={StudentsPage} session={session} />
        <ProtectedRoute exact path="/profile" component={ProfilePage} session={session} />
        <PublicRoute exact path="/take/:id" component={PublicSurveyPage} session={session} />
        <Route
          render={function renderFallback() {
            return <Redirect to={session.user ? "/dashboard" : "/"} />;
          }}
        />
      </Switch>
    </Router>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <AppRouter />
    </ApolloProvider>
  );
}

export default App;
