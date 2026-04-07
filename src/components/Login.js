import React from "react";
import { Mutation } from "react-apollo";
import { GET_LOGGED_IN_USER_QUERY } from "../graphql/Queries";
import { LOGIN_MUTATION } from "../graphql/Mutations";
import { getErrors } from "../utils";
import Cookies from "js-cookie";
import { withRouter } from "react-router-dom";

class _Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
            errors: []
        }
    }
    onChange(key) {
        return e => this.setState({ [key]: e.target.value })
    }
    render(){
        return (
            <div>
                <Mutation mutation={LOGIN_MUTATION}>
                    {(login,{loading,error,data}) => {
                        return (
                            <form onSubmit={async e => {
                                e.preventDefault();
                                if (loading) return;
                                this.setState({errors:[]})
                                try {
                                    let res = await login({
                                        variables: { ...this.state }
                                    })
                                    Cookies.set("token", res.data.login.token)
                                    await this.props.refetchApp();
                                    this.props.history.push("/")                                
                                } catch (e) { 
                                    this.setState({ errors: getErrors(e) }) 
                                }
                            }}>
                                {this.state.errors.map(err => (
                                    <h3>{err}</h3>
                                ))}
                                Login<br/>
                                Email: <input value={this.state.email} onChange={this.onChange("email")} /><br />
                                Password: <input type="password" value={this.state.password} onChange={this.onChange("password")} /> <br/>
                                <button>Login</button>
                                <button type="button" onClick={this.props.user && this.props.user.logout}>Logout</button>
                            </form>
                        )
                    }}
                </Mutation>
            </div>
        )
    }
}

export default withRouter(_Login);