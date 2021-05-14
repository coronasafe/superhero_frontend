import React, { Component } from "react";

class Logout extends Component {
  logout = async () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  };
  render() {
    return (
      <>
        <model-viewer
          alt="logout"
          loading="eager"
          load={this.logout()}
        />
      </>
    )
  }
}
export default Logout;
