
import ApolloClient from 'apollo-boost';
import Cookies from "js-cookie";

export default new ApolloClient({
    uri: 'http://localhost:4000/',
    request: async (operation) => {
        const token = Cookies.get("token");
        operation.setContext({
            headers: {
                authorization: `Bearer ${token}`
            }
        })
    },
    connectToDevTools: true
});