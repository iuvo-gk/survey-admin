import ApolloClient from "apollo-boost";
import { getAuthToken } from "./lib/auth";

var GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || "http://localhost:4000/";

var client = new ApolloClient({
  uri: GRAPHQL_ENDPOINT,
  request: function request(operation) {
    var token = getAuthToken();

    operation.setContext({
      headers: token ? { authorization: "Bearer " + token } : {},
    });
  },
  connectToDevTools: process.env.NODE_ENV !== "production",
});

export default client;
