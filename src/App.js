import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import client from "./apolloClient";
import { Query } from "react-apollo";
import { GET_LOGGED_IN_USER_QUERY } from './graphql/Queries';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import SingleSurvey from "./components/SingleSurvey";
import Students from "./components/Students";
import CreateSurvey from "./components/CreateSurvey";
import Cookies from "js-cookie";

function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <Router>
          <Query query={GET_LOGGED_IN_USER_QUERY}>
            {({loading,error,data,refetch}) => {
              if (loading) return "Loading"
              if (error)  return error.message
              let user = data.getLoggedInUser;
              if (user) user.logout = () => {
                Cookies.set("token", "")
                refetch();
              }
              return (
                  <Switch>
                    <Route 
                      exact 
                      path="/" 
                      component={props => (
                        !user ? <Redirect to="/login"/> :
                        <Home {...props} user={user} /> 
                      )} 
                      />
                    
                    <Route 
                      exact
                      path="/login" 
                      user={user} 
                      component={props => (
                        user ? <Redirect to="/"/> :
                        <Login {...props} user={user} refetchApp={refetch} />
                      )
                    } />

                    <Route 
                      exact 
                      path="/create_survey"
                      user={user} 
                      component={props => (
                        !user ? <Redirect to="/login"/> :
                        <CreateSurvey {...props} user={user} />
                      )
                    } />
                    
                    <Route
                      exact
                      path="/logout"
                      component={props => {
                        user.logout();
                        return <Redirect to="/login"/>
                      }}
                    />
                    
                    <Route 
                      exact
                      path="/students"
                      component={props => (
                        !user ? <Redirect to="/login"/> :
                        <Students user={user} {...props} />
                      )}
                    />
                    
                    <Route
                      exact
                      path="/survey/:id"
                      component={props => (
                        !user ? <Redirect to="/login"/> :
                        <SingleSurvey user={user} {...props} />
                      )}
                    />
                  </Switch>
              )
            }}
          </Query>
        </Router>
      </ApolloProvider>
    </div>
  );
}

export default App;
