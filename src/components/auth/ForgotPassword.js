import React, { Component } from "react";
import FormErrors from "../FormErrors";
import Validate from "../util/Validation";
import { Auth } from "aws-amplify";
import { withRouter } from "react-router-dom";

class ForgotPassword extends Component {
  state = {
    email: "",
    errors: {
      blankfield: false,
      cognito: null
    }
  };

  clearErrors = () => {
    this.setState({
      errors: {
        blankfield: false,
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
      try {
        await Auth.forgotPassword(this.state.email);
        this.props.history.push("/forgotpasswordsubmit");
      } catch (error) {
        let err = null;
        !error.message ? (err = { message: error }) : (err = error);
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
          <h1>Forgot Password?</h1>
          <p>Please enter your email to receive a password reset code.</p>
          <FormErrors formerrors={this.state.errors} />

          <form onSubmit={this.handleSubmit}>
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
              <p className="control">
                <button className="button is-success">Email Reset Code</button>
              </p>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default withRouter(ForgotPassword);
