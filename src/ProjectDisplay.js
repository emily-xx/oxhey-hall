import { Proptypes } from 'react';
import React from 'react';
import ReactTable from "react-table";
import { Button, FormGroup, FormControl, FormLabel, Modal, Container, Row, Col } from "react-bootstrap";
import 'react-table/react-table.css';

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
      <React.Fragment>
        <h1>Project List</h1>
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
            <p><strong>Project Name:</strong> {this.state.selectedProjectDetails.projectName}</p>
            <p><strong>Budget:</strong> {this.state.selectedProjectDetails.budget}</p>
            <p><strong>Created by</strong> {this.state.selectedProjectDetails.createdBy} <strong>on</strong> {this.state.selectedProjectDetails.dateCreated}</p>
            <p><strong>Updated by</strong> {this.state.selectedProjectDetails.updatedBy} <strong>ot</strong> {this.state.selectedProjectDetails.dateUpdated}</p>
            <p><strong>Revision:</strong> {this.state.selectedProjectDetails._rev}</p>
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
              <Button variant="primary" type="submit" onClick={this.closeProjectDetails} disabled={!this.validateCreateProject()}>Create Project</Button>
            </Modal.Footer>
          </form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default ProjectDisplay;
