import { Proptypes } from 'react';
import React from 'react';
import ReactTable from "react-table";
import { Button, FormGroup, FormControl, FormLabel, Modal, Container, Row, Col } from "react-bootstrap";
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
      selectedProject: {},
      selectedProjectDetails: {},
      loggedInUserData: props.loggedInUserData,
      projectList: [],
      showProjectDetails: false,
      showCreateProject: false,
      newProjectData: {
        projectName: "",
        budget: ""
      }
    };

    this.refreshProjectList = () => {
      fetch("https://api-test.oxheyhall.com/v1/accounts/projects", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.state.loggedInUserData.id
        }
      }).then(res => res.json())
      .then(response => {
        this.setState({projectList: response});
      });
    }

    this.refreshProjectList();

    this.openProject = this.openProject.bind(this);
  }

  // Project Details Modal functions
  openProject = event => {
    let filter = {"include": "owner"};

    fetch(encodeURI("https://api-test.oxheyhall.com/v1/accounts/projects/" + this.state.selectedProject.projectId + "?filter=" + JSON.stringify(filter)), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.state.loggedInUserData.id
      }
    }).then(res => res.json())
    .then(response => {
      this.setState({selectedProjectDetails: response});
      this.setState({showProjectDetails: true});
    });
  }

  closeProjectDetails = () => {
    this.setState({showProjectDetails: false});
  }

  // Create Project Modal functions
  newProject = event => {
    this.setState({showCreateProject: true});
  }

  closeCreateProject = event => {
    this.setState({newProjectData: {projectName: "", budget: ""}, showCreateProject: false});
  }

  createNewProject = event => {
    event.preventDefault();

    let newProjectData = {
      projectId: this.state.newProjectData.projectName,
      projectName: this.state.newProjectData.projectName,
      _rev: "001",
      budget: this.state.newProjectData.budget,
      dateCreated: new Date().toJSON(),
      dateUpdated: new Date().toJSON(),
      createdBy: this.state.loggedInUserData.userId,
      updatedBy: this.state.loggedInUserData.userId,
      ownerId: this.state.loggedInUserData.userId
    };

    fetch("https://api-test.oxheyhall.com/v1/accounts/projects/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.state.loggedInUserData.id
      },
      body: JSON.stringify(newProjectData)
    }).then(res => res.json())
    .then(response => {
      console.log(response);
      this.refreshProjectList();
      this.closeCreateProject();
    });
  }

  handleCreateProjectChange = event => {
    let newNewProjectData = this.state.newProjectData;
    newNewProjectData[event.target.id] = event.target.value;

    this.setState({
      newProjectData: newNewProjectData
    });
  }

  validateCreateProject = () => {
    return (!!this.state.newProjectData.projectName.length && !!this.state.newProjectData.budget.length);
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
      Header: 'Created By',
      accessor: 'createdBy'
    },
    {
      Header: 'Last Updated',
      accessor: 'dateUpdated'
    },
    {
      Header: "Updated By",
      accessor: "updatedBy"
    }];

    return (
      <div className="ProjectList">
        <Container>
          <Row>
            <Col>
              <Button variant="primary" onClick={this.openProject} disabled={!this.state.selectedProject.projectId}>View Selected Project</Button>
            </Col>
            <Col className="text-right">
              <Button variant="success" onClick={this.newProject}>New Project</Button>
            </Col>
          </Row>
        </Container>

        <ReactTable data={this.state.projectList} columns={columns} getTrProps={(state, rowInfo) => {
          if (rowInfo && rowInfo.row) {
            return {
              onClick: (e) => {
                this.setState({
                  selectedProject: rowInfo.row._original
                })
              },
              style: {
                background: rowInfo.row._original.projectId === this.state.selectedProject.projectId ? '#00afec' : 'white',
                color: rowInfo.row._original.projectId === this.state.selectedProject.projectId ? 'white' : 'black'
              }
            }
          } else{
            return {}
          }
        }} />

        <Modal show={this.state.showProjectDetails} onHide={this.closeProjectDetails}>
          <Modal.Header closeButton>
            <Modal.Title>Project Details</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Project Name: {this.state.selectedProjectDetails.projectName}</p>
            <p>Budget: {this.state.selectedProjectDetails.budget}</p>
            <p>Created by {this.state.selectedProjectDetails.createdBy} at {this.state.selectedProjectDetails.dateCreated}</p>
            <p>Updated by {this.state.selectedProjectDetails.updatedBy} at {this.state.selectedProjectDetails.dateUpdated}</p>
            <p>Revision: {this.state.selectedProjectDetails._rev}</p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" onClick={this.closeProjectDetails}>Close</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.showCreateProject} onHide={this.closeCreateProject}>
          <Modal.Header closeButton>
            <Modal.Title>Create Project</Modal.Title>
          </Modal.Header>

          <form onSubmit={this.createNewProject}>
            <Modal.Body>
              <FormGroup controlId="projectName" bssize="large">
                <FormLabel>Project Name</FormLabel>
                <FormControl
                  autoFocus
                  type="text"
                  value={this.state.username}
                  onChange={this.handleCreateProjectChange}
                />
              </FormGroup>
              <FormGroup controlId="budget" bssize="large">
                <FormLabel>Budget</FormLabel>
                <FormControl
                  value={this.state.password}
                  onChange={this.handleCreateProjectChange}
                  type="number"
                />
              </FormGroup>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="primary" type="submit" onClick={this.closeProjectDetails} disabled={!this.validateCreateProject}>Create Project</Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    );
  }
}

class AppDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedInUserData: null
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
      if (response.id) {console.log(response);
        this.setState({loggedInUserData: response});
      }
    });
  }

  render() {
    if (this.state.loggedInUserData !== null) {
      return <ProjectDisplay loggedInUserData={this.state.loggedInUserData} />
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

export default OxheyHall;
