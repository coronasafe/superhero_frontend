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
  Button,
  FormTextarea
} from "shards-react";

import PageTitle from "../components/common/PageTitle";
import Editor from "../components/add-new-post/Editor";
import SidebarActions from "../components/add-new-post/SidebarActions";
import SidebarCategories from "../components/add-new-post/SidebarCategories";
import axios from "axios";
import { api_url } from "../utils/constants";
import RequestList from "./RequestList";
const getAssetCategoryList = async () => {
  let response = await axios
    .get(`${api_url}/asset/list/category`, {
      headers: { "x-access-token": sessionStorage.getItem("access_token") }
    })
    .catch(error => {
      console.log(error);
    });
  try {
    return response.data.data;
  } catch (e) {
    console.log(e);
  }
};
const getRequestDetails = async id => {
  let response = await axios
    .get(`${api_url}/service/request/get/${id}`, {
      headers: { "x-access-token": sessionStorage.getItem("access_token") }
    })
    .catch(error => {
      console.log(error);
    });
  try {
    return response.data.data;
  } catch (e) {
    console.log(e);
  }
};
const invalidateRequest = async id => {
  let response = await axios
    .put(
      `${api_url}/service/request/update/invalidate/${id}`,
      {},
      {
        headers: { "x-access-token": sessionStorage.getItem("access_token") }
      }
    )
    .catch(error => {
      console.log(error);
      alert(error.response.data.error);
    });
  try {
    return response.data.data;
  } catch (e) {
    console.log(e);
  }
};
const cancelRequest = async (id, body = {}) => {
  let response = await axios
    .put(`${api_url}/service/request/cancel/${id}`, body, {
      headers: { "x-access-token": sessionStorage.getItem("access_token") }
    })
    .catch(error => {
      console.log(error);
      alert(error.response.data.error);
    });
  try {
    return response.data.data;
  } catch (e) {
    console.log(e);
  }
};
const notifyMoreUnits = async (id, body = {}) => {
  let response = await axios
    .put(`${api_url}/service/request/notify/more/${id}`, body, {
      headers: { "x-access-token": sessionStorage.getItem("access_token") }
    })
    .catch(error => {
      console.log(error);
      alert(error.response.data.error);
    });
  try {
    return response.data.data;
  } catch (e) {
    console.log(e);
  }
};
class RequestDetails extends Component {
  state = {
    asset_categories: [],
    request: null
  };
  populate_asset_categories = async () => {
    let categories = await getAssetCategoryList();
    console.log(categories);
    this.setState({ asset_categories: categories });
  };
  getRequest = async id => {
    let request = await getRequestDetails(id);
    console.log(request);
    localStorage['retry']=JSON.stringify(request);
    this.setState({ request });
  };
  invalidate = async id => {
    let response = await invalidateRequest(this.props.match.params.id);
    if (response) this.getRequest(this.props.match.params.id);
  };
  cancel = async body => {
    let response = await cancelRequest(this.props.match.params.id, body);
    if (response) this.getRequest(this.props.match.params.id);
  };
  notifyMore = async body => {
    let response = await notifyMoreUnits(this.props.match.params.id, body);
    if (response) this.getRequest(this.props.match.params.id);
  };
  componentDidMount() {
    // this.populate_asset_categories();
    console.log(this.props.match.params.id);
    this.getRequest(this.props.match.params.id);
  }

  render() {
    if (!this.state.request)
      return (
        <div>
          <p>Loading....</p>
        </div>
      );
    return (
      <Container fluid className="main-content-container px-4 pb-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="6"
            title="Request Details"
            subtitle="Additional information of a service request."
            className="text-sm-left"
          />
        </Row>
        <Row>
          <Col lg="4" md="4">
            <h4>Category</h4>
            <Card>
              <CardBody>
                <h5>{this.state.request.categoryDetails.title}</h5>
              </CardBody>
            </Card>
          </Col>
          <Col lg="8" md="8">
            <h4>Patient Details</h4>
            <Card
              style={{
                display: "inline-block",
                height: "80%",
                width: "100%"
              }}
            >
              <CardBody>
                <Row>
                  <Col lg="4">
                    <div style={{ display: "inline-block" }}>
                      <CardHeader
                        style={{ display: "flex", justifyContent: "space-between" }}
                      >
                        <h5>Name</h5>
                      </CardHeader>
                      <CardBody>
                        {this.state.request.patient_name}
                      </CardBody>
                    </div>
                  </Col>
                  <Col lg="8">
                    <div style={{ display: "inline-block" }}>
                      <CardHeader
                        style={{ display: "flex", justifyContent: "space-between"}}
                      >
                        <h5>Medical Info</h5>
                      </CardHeader>
                        <CardBody>
                          {this.state.request.medical_info}
                        </CardBody>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
            <br />
          </Col>
        </Row>
        <Row>
          <Col lg="8" md="8">
            <h4>Address</h4>
            <Card
              style={{
                display: "inline-block",
                height: "100%",
                width: "100%"
              }}
            >
              <CardBody>
                <Row>
                  <Col lg="4">
                    {" "}
                    <div style={{ display: "inline-block" }}>
                      <h4>Pickup Address</h4>
                      {this.state.request.address_0}
                    </div>
                  </Col>
                  <Col lg="8">
                    <div style={{ display: "inline-block" }}>
                      <h4>Destination Address</h4>
                      {this.state.request.address_1}
                      {this.state.request.group == "1" ? (
                        <table className="table mb-0 table-responsive-sm table-responsive-md table-striped">
                          <thead className="bg-light">
                            <tr>
                              <th scope="col" className="border-0">
                                #
                              </th>
                              <th scope="col" className="border-0">
                                Name
                              </th>
                              <th scope="col" className="border-0">
                                Address
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.request.destination_addresses.map(
                              (dst, i) => {
                                return (
                                  <tr>
                                    <td>{i + 1}</td>
                                    <td>{dst.name}</td>
                                    <td>{dst.address}</td>
                                  </tr>
                                );
                              }
                            )}
                          </tbody>
                        </table>
                      ) : this.state.request.address_1 ? (
                        this.state.request.address_1
                      ) : (
                        "Not Applicable"
                      )}
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
            <br />
          </Col>
          <Col lg="4" md="4">
            <h4>Status</h4>
            <Card
              style={{
                display: "inline-block",
                height: "200px",
                width: "300px"
              }}
            >
              <CardBody>
                <div style={{ display: "flex", margin: "8px 0px" }}>
                  <label style={{ margin: "0px", width: "100%" }}>
                    Requested unit count :{" "}
                  </label>
                  <p
                    style={{
                      //   height: "28px",
                      width: "30px",
                      backgroundColor: "#ccc",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: "0px 20px",
                      borderRadius: "5px"
                    }}
                  >
                    {this.state.request.requested_unit_count}
                  </p>
                </div>
                <div
                  style={{ display: "flex", width: "100%", margin: "8px 0px" }}
                >
                  <label style={{ margin: "0px", width: "100%" }}>
                    Notified unit count :{" "}
                  </label>
                  <p
                    style={{
                      //   height: "28px",
                      width: "30px",
                      backgroundColor: "#ccc",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: "0px 20px",
                      borderRadius: "5px"
                    }}
                  >
                    {this.state.request.notified_units.length}
                  </p>
                </div>
                <div
                  style={{ display: "flex", width: "100%", margin: "8px 0px" }}
                >
                  <label style={{ margin: "0px", width: "100%" }}>
                    Responded unit count :{" "}
                  </label>
                  <p
                    style={{
                      //   height: "28px",
                      width: "30px",
                      backgroundColor: "#ccc",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: "0px 20px",
                      borderRadius: "5px"
                    }}
                  >
                    {this.state.request.responded_unit_count}
                  </p>
                </div>
                <div
                  style={{ display: "flex", width: "100%", margin: "8px 0px" }}
                >
                  <label style={{ margin: "0px", width: "100%" }}>
                    Request status :{" "}
                  </label>
                  <p
                    style={{
                      //   height: "28px",
                      width: "100px",
                      backgroundColor: this.state.request.completed_units &&
                      this.state.request.completed_units.length > 0 ? "rgb(181, 255, 184)" :
                        (!(this.state.request.active) ? "rgb(255, 151, 151)" : "rgb(181, 255, 184)"),
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "0px 9px 0px 9px",
                      margin: "0px 20px",
                      borderRadius: "5px"
                    }}
                  >
                    { this.state.request.completed_units &&
                    this.state.request.completed_units.length > 0 ? "Completed" :
                        ( !(this.state.request.active) ? "Expired" :"Active")}
                  </p>
                </div>
                {/* <div
                  style={{ display: "flex", width: "100%", margin: "8px 0px" }}
                >
                  <label style={{ margin: "0px", width: "100%" }}>
                    Picked up :{" "}
                  </label>
                  <p
                    style={{
                      //   height: "28px",
                      width: "100px",
                      backgroundColor: this.state.request.picked_up
                        ? "rgb(181, 255, 184)"
                        : "rgb(255, 151, 151)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: "0px 20px",
                      borderRadius: "5px"
                    }}
                  >
                    {this.state.request.picked_up ? "Yes" : "No"}
                  </p>
                </div> */}
                {this.state.request.active && (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center"
                    }}
                  >
                    {" "}
                    <Button
                      className="btn-danger"
                      style={{ margin: "auto" }}
                      onClick={() => {
                        this.invalidate();
                      }}
                    >
                      Invalidate
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <br />
        <Row style={{ marginTop: "28px" }}>
          <Col lg="6" md="6" sm="12">
            <Card>
              <CardHeader
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <h5>Notified Units</h5>
                {this.state.request.active && (
                  <Button onClick={this.notifyMore}>Notify More</Button>
                )}
              </CardHeader>
              <CardBody>
                {" "}
                <table className="table mb-0 table-responsive-sm table-responsive-md table-striped">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col" className="border-0">
                        #
                      </th>
                      <th scope="col" className="border-0">
                        Name
                      </th>
                      <th scope="col" className="border-0">
                        Phone
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.request.notifiedUnitDetails.map((unit, i) => {
                      return (
                        <tr>
                          <td>{i + 1}</td>
                          {/* <td>
                        {request.categoryDetails
                          ? request.categoryDetails.title
                          : "-"}
                      </td> */}
                          <td>{unit.name}</td>
                          <td>{unit.phone}</td>

                          {/* <td>{request.requested_unit_count}</td>
                      <td>{request.notified_units.length}</td>
                      <td>{request.responded_unit_count}</td> */}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Col>
          <Col lg="6" md="6" sm="12">
            <Card>
              <CardHeader>
                <h5>Responded Units</h5>
              </CardHeader>
              <CardBody>
                {" "}
                <table className="table mb-0 table-responsive-sm table-responsive-md table-striped">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col" className="border-0">
                        #
                      </th>
                      <th scope="col" className="border-0">
                        Name
                      </th>
                      <th scope="col" className="border-0">
                        Phone
                      </th>
                      <th scope="col" className="border-0">
                        Picked up
                      </th>
                      <th scope="col" className="border-0">
                        Cancellation
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.request.respondedUnitDetails &&
                      this.state.request.respondedUnitDetails.map((unit, i) => {
                        return (
                          <tr>
                            <td>{i + 1}</td>
                            {/* <td>
                        {request.categoryDetails
                          ? request.categoryDetails.title
                          : "-"}
                      </td> */}
                            <td>{unit.name}</td>
                            <td>{unit.phone}</td>

                            {/* <td>{request.requested_unit_count}</td>
                      <td>{request.notified_units.length}</td>
                      <td>{request.responded_unit_count}</td> */}
                            <td>
                              {this.state.request.picked_up_units &&
                              this.state.request.picked_up_units.indexOf(
                                unit.id
                              ) != -1 ? (
                                <p
                                  style={{
                                    margin: "0px",
                                    backgroundColor: "rgb(181, 255, 184)",
                                    textAlign: "center",
                                    width: "100px",
                                    borderRadius: "5px"
                                  }}
                                >
                                  Yes
                                </p>
                              ) : (
                                <p
                                  style={{
                                    margin: "0px",
                                    backgroundColor: "rgb(255, 151, 151)",
                                    textAlign: "center",
                                    width: "100px",
                                    borderRadius: "5px"
                                  }}
                                >
                                  No
                                </p>
                              )}
                            </td>
                            <td>
                              {this.state.request.cancelled_units &&
                              this.state.request.cancelled_units.indexOf(
                                unit.id
                              ) != -1 ? (
                                <p
                                  style={{
                                    margin: "0px",
                                    backgroundColor: "rgb(255, 151, 151)",
                                    textAlign: "center",
                                    width: "100px",
                                    borderRadius: "5px"
                                  }}
                                >
                                  Cancelled
                                </p>
                              ) : (
                                <p
                                  style={{
                                    margin: "0px",
                                    backgroundColor: "#ff6363",
                                    textAlign: "center",
                                    width: "100px",
                                    borderRadius: "5px",
                                    color: "#fff",
                                    cursor: "pointer"
                                  }}
                                  onClick={e => {
                                    this.cancel({ units: [unit.id] });
                                  }}
                                >
                                  Cancel
                                </p>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default RequestDetails;
