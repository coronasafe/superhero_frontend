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
import { Link } from "react-router-dom";
class Login extends Component {
  state = { cred: "", password: "" };

  login = async () => {
    let response = await axios
      .post(`${api_url}/auth/login`, {
        phone: this.state.cred,
        password: this.state.password
      })
      .catch(error => {
        console.log(error);
        alert("Username or password is incorrect");
      });
    console.log(response);
    if (response && response.data && response.data.data) {
      sessionStorage.setItem("access_token", response.data.data.access_token);
      sessionStorage.setItem("user_role", response.data.data.role);
      if (response.data.data.role === "fdc_volunteer") {
        window.location.assign("/#/volunteer/food/request/register");
      } else if (response.data.data.role === "fdc_local_read") {
        window.location.assign("/#/dashboard/fdc/overview");
      } else {
        window.location.assign("/");
      }
    }
  };
  render() {
    return (
      <Container fluid className="main-content-container px-4 pb-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="4"
            title="Login"
            subtitle="Please login to continue using this dashboard"
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
                    <Col md="6" className="form-group">
                      <label htmlFor="fePhoneNumber">
                        Phone Number / Username
                      </label>
                      <FormInput
                        // id="feEmailAddress"
                        type="text"
                        placeholder="Phone Number / Username"
                        // pattern="[0-9]*"
                        value={this.state.cred}
                        onChange={e => {
                          // if (e.target.validity.valid) {
                          this.setState({ cred: e.target.value });
                          // }
                        }}
                      />
                    </Col>
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

                  <Button onClick={this.login}>Login</Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <br />
        <hr />
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="4"
            // title="SignUp"
            subtitle="Sign up for volunteers."
            className="text-sm-left"
          />
        </Row>

        <Row>
          <Col>
            <Link to="/volunteer/signup">
              <Button>Call center volunteer signup</Button>
            </Link>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default Login;
