import { Proptypes } from 'react';
import React from 'react';

import Login from './Login';
import ProjectDisplay from './ProjectDisplay';

class OxheyHall extends React.Component {
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
      if (response.id) {
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

export default OxheyHall;
