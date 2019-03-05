import { Proptypes } from 'react';
import React from 'react';
import ReactTable from "react-table";
import { Button, FormGroup, FormControl, FormLabel, Modal, Container, Row, Col } from "react-bootstrap";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: ""
    };

    this.handleLogin = props.handleLogin;

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = event => {
    event.preventDefault();
    this.handleLogin(this.state.username, this.state.password);
  }

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  render() {
    return (
      <div className="Login">
        <h1>Login</h1>

        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="username" bssize="large">
            <FormLabel>Username</FormLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.username}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bssize="large">
            <FormLabel>Password</FormLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            block
            bssize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Login
          </Button>
        </form>
      </div>
    );
  }
}

export default Login;
