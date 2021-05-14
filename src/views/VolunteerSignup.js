import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  FormInput,
  FormCheckbox,
  FormSelect,
  Button
} from "shards-react";
import PageTitle from "../components/common/PageTitle";
import axios from "axios";
import { api_url } from "../utils/constants";
class Login extends Component {
  state = { name: "", phone: "", password: "" };

  signup = async () => {
    for (let i of ["name", "phone", "password"]) {
      if (!this.state[i]) {
        alert(`Missing field ${i}`);
        return false;
      }
    }
    let response = await axios
      .post(`${api_url}/user/volunteer/fdc/signup`, {
        name: this.state.name,
        phone: this.state.phone,
        password: this.state.password
      })
      .catch(error => {
        console.log(error);
        alert(error.response.data.error);
      });
    console.log(response);
    if (response && response.data && response.data.data) {
      sessionStorage.setItem("access_token", response.data.data.access_token);
      sessionStorage.setItem("user_role", "fdc_volunteer");
      window.location.assign("/");
    }
  };
  render() {
    return (
      <Container fluid className="main-content-container px-4 pb-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="4"
            title="SignUp"
            subtitle="Sign up for volunteers."
            className="text-sm-left"
          />
        </Row>

        <Row>
          {/* Editor */}
          <Col lg="9" md="12">
            <Card>
              {/* <CardHeader>KCC Login</CardHeader> */}
              <CardBody>
                <Form>
                  <Row form>
                    <Col md="6">
                      <label htmlFor="fePassword">Name</label>
                      <FormInput
                        // id="fePassword"
                        type="text"
                        placeholder="Name"
                        value={this.state.name}
                        onChange={e => {
                          this.setState({ name: e.target.value });
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6" className="form-group">
                      <label htmlFor="fePhoneNumber">Phone Number</label>
                      <FormInput
                        //   id="feEmailAddress"
                        type="text"
                        placeholder="Phone Number"
                        pattern="[0-9]*"
                        value={this.state.phone}
                        onChange={e => {
                          if (e.target.validity.valid) {
                            this.setState({ phone: e.target.value });
                          }
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <label htmlFor="fePassword">Password</label>
                      <FormInput
                        id="fePassword"
                        type="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={e => {
                          this.setState({ password: e.target.value });
                        }}
                      />
                    </Col>
                  </Row>
                  <hr />
                  <Button onClick={this.signup}>Sign Up</Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Button
              onClick={() => {
                window.location.assign("/#/login");
              }}
            >
              Back to login
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default Login;
