import React, { Component } from "react";
import FormErrors from "../FormErrors";
import Validate from "../util/Validation";
import { withRouter } from "react-router-dom";
import { Auth } from "aws-amplify";

class ForgotPasswordSubmit extends Component {
  //state variables for form inputs and errors
  state = {
    verificationcode: "",
    email: "",
    password: "",
    confirmpassword: "",
    errors: {
      blankfield: false,
      matchedpassword: false,
      cognito: null
    }
  };

  clearErrors = () => {
    this.setState({
      errors: {
        blankfield: false,
        matchedpassword: false,
        cognito: null
      }
    });
  };

  handleSubmit = async event => {
    //Prevent page reload
    event.preventDefault();

    //Form validation
    this.clearErrors();
    const error = Validate(event, this.state);
    if (error) {
      this.setState({
        errors: { ...this.state.errors, ...error }
      });
    } else {
      //Integrate Cognito here on valid form submission
      //Take the state variables to pass to the signUp method
      //we added email as a required field and this needs to be
      //passed to the api as an attribute.
      const { verificationcode, email, password } = this.state;
      console.log(verificationcode);
      try {
        const signUpResponse = await Auth.forgotPasswordSubmit(
          email,
          verificationcode,
          password
        );
        console.log(signUpResponse);
        this.props.history.push("/changepasswordconfirmation");
      } catch (error) {
        let err = null;
        error.message ? (err = error) : (err = { message: error });
        this.setState(state => ({
          errors: {
            ...state.errors,
            cognito: err
          }
        }));
      }
    }
  };

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    document.getElementById(event.target.id).classList.remove("is-danger");
  };

  render() {
    return (
      <section className="section auth">
        <div className="container">
          <h1>Reset Password</h1>
          <FormErrors formerrors={this.state.errors} />
          <form onSubmit={this.handleSubmit}>
            <div className="field">
              <p className="control has-icons-left">
                <input
                  className="input"
                  type="text"
                  id="verificationcode"
                  placeholder="Enter verification code"
                  value={this.state.verificationcode}
                  onChange={this.onInputChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-key"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control has-icons-left">
                <input
                  className="input"
                  type="email"
                  id="email"
                  placeholder="Enter email"
                  value={this.state.email}
                  onChange={this.onInputChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-envelope"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control has-icons-left">
                <input
                  className="input"
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.onInputChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control has-icons-left">
                <input
                  className="input"
                  type="password"
                  id="confirmpassword"
                  placeholder="Confirm password"
                  value={this.state.confirmpassword}
                  onChange={this.onInputChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <button className="button is-success">
                  Submit New Password
                </button>
              </p>
            </div>
          </form>
        </div>
      </section>
    );
  }
}
export default withRouter(ForgotPasswordSubmit);
