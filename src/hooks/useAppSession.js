import { useApolloClient, useQuery } from "@apollo/react-hooks";
import { useCallback } from "react";
import { GET_LOGGED_IN_USER_QUERY } from "../graphql/Queries";
import { clearAuthToken, getAuthToken, setAuthToken } from "../lib/auth";

export function useAppSession() {
  var client = useApolloClient();
  var queryResult = useQuery(GET_LOGGED_IN_USER_QUERY, {
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

  var user =
    queryResult.data && queryResult.data.getLoggedInUser
      ? queryResult.data.getLoggedInUser
      : null;

  var completeAuth = useCallback(
    function completeAuth(token) {
      if (token) {
        setAuthToken(token);
      }
      return client.resetStore();
    },
    [client]
  );

  var logout = useCallback(
    function logout() {
      if (getAuthToken()) {
        clearAuthToken();
      }
      return client.resetStore();
    },
    [client]
  );

  return {
    loading: queryResult.loading,
    error: queryResult.error,
    user: user,
    refetch: queryResult.refetch,
    completeAuth: completeAuth,
    logout: logout,
  };
}
