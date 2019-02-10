import { Proptypes } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTable from "react-table";
import Modal from "react-modal";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import './index.css';
import 'react-table/react-table.css';

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
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="username" bssize="large">
            <FormLabel>Email</FormLabel>
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

class ProjectDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedProjectId: null,
      accessToken: props.accessToken,
      projectList: []
    };

    fetch("https://api-test.oxheyhall.com/v1/accounts/projects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.state.accessToken
      }
    }).then(res => res.json())
    .then(response => {
      this.setState({projectList: response});
      console.log(this.state.projectList);
    });

    this.openProject = this.openProject.bind(this);
  }

  openProject(event) {

  }

  render() {
    const columns = [{
      Header: 'Project Name',
      accessor: 'projectName'
    },
    {
      Header: 'Date Created',
      accessor: 'dateCreated'
    },
    {
      Header: 'Last Updated',
      accessor: 'dateUpdated'
    },
    {
      Header: 'Project Name',
      accessor: 'projectName'
    }];

    return (
      <div className="ProjectList">
        <ReactTable data={this.state.projectList} columns={columns} />
      </div>
    );
  }
}

class AppDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accessToken: null
    };

    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(username, password) {
    fetch("https://api-test.oxheyhall.com/v1/admin/accounts/login", {
      method: "POST",
      body: JSON.stringify({username: username, password: password}),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
    .then(response => {
      if (response.id) {
        this.setState({accessToken: response.id});
      }
    });
  }

  render() {
    if (this.state.accessToken !== null) {
      return <ProjectDisplay accessToken={this.state.accessToken} />
    } else {
      return <Login handleLogin={this.handleLogin} />
    }
  }
}

class OxheyHall extends React.Component {
  render() {
    return (
      <div className="kiosk">
        <div className="app-display">
          <AppDisplay />
        </div>
      </div>
    );
  }
}

// ========================================
ReactDOM.render(
  <OxheyHall />,
  document.getElementById('root')
);
