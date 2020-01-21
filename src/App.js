import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Register from "./components/auth/Register";
import Welcome from "./components/auth/Welcome";
import LogIn from "./components/auth/LogIn";
import ForgotPassword from "./components/auth/ForgotPassword";
import ForgotPasswordSubmit from "./components/auth/ForgotPasswordSubmit";
import { Auth } from "aws-amplify";
import ChangePasswordConfirmation from "./components/auth/ChangePasswordConfirmation";
import ChangePassword from "./components/auth/ChangePassword";

class App extends Component {
  state = {
    isAuth: false,
    user: null,
    checkingAuth: true
  };

  async componentDidMount() {
    try {
      // if the user is not signed in, this statement throws
      // and the remainder of the block is not executed
      const session = await Auth.currentSession();
      this.authenticateUser(true);
      console.log(session);
      const user = await Auth.currentAuthenticatedUser();
      this.setAuthUser(user);
    } catch (error) {
      console.log(error);
    }
    this.setState({ checkingAuth: false });
  }

  authenticateUser = authenticated => {
    this.setState({ isAuth: authenticated });
  };

  setAuthUser = user => {
    this.setState({ user: user });
  };

  render() {
    const authProps = {
      isAuth: this.state.isAuth,
      user: this.state.user,
      authenticateUser: this.authenticateUser,
      setAuthUser: this.setAuthUser
    };

    return (
      !this.state.checkingAuth && (
        <div className="App">
          <Router>
            <div>
              <Navbar auth={authProps} />
              <Switch>
                <Route exact path="/">
                  <Home auth={authProps} />
                </Route>
                <Route exact path="/login">
                  <LogIn auth={authProps} />
                </Route>
                <Route exact path="/register">
                  <Register auth={authProps} />
                </Route>
                <Route exact path="/forgotpassword">
                  <ForgotPassword auth={authProps} />
                </Route>
                <Route exact path="/forgotpasswordsubmit">
                  <ForgotPasswordSubmit auth={authProps} />
                </Route>
                <Route exact path="/changepasswordconfirmation">
                  <ChangePasswordConfirmation auth={authProps} />
                </Route>
                <Route exact path="/changepassword">
                  <ChangePassword auth={authProps} />
                </Route>
                <Route exact path="/welcome">
                  <Welcome auth={authProps} />
                </Route>
              </Switch>
            </div>
          </Router>
        </div>
      )
    );
  }
}

export default App;
