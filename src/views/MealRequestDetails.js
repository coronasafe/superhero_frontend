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
    .get(`${api_url}/meal/request/${id}`, {
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
const notifyDelivery = async (id, data) => {
  let response = await axios
    .post(`${api_url}/service/request/fdc/new/${id}`, data, {
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
class MealRequestDetails extends Component {
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
    this.setState({ request });
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
    let request = this.state.request;
    return (
      <Container fluid className="main-content-container px-4 pb-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="8"
            title="Meal Request Details"
            subtitle="Additional information of a meal request."
            className="text-sm-left"
          />
        </Row>
        <Row>
          <Col lg="3">
            <Card>
              {/* <CardHeader></CardHeader> */}
              <CardBody>
                <h5>Order ID</h5>
                <h3>{request.order_id}</h3>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <br />
        <Row>
          <Col lg="8">
            <Card>
              <CardBody>
                <Row>
                  <Col>
                    <h5>Name</h5>
                    {request.name}
                  </Col>
                  <Col>
                    <h5>Phone</h5>
                    {request.phone}
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h5>Address</h5>
                    {request.address}
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h5>Nearby Landmark</h5>
                    {request.landmark_address}
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h5>Veg / Non-Veg</h5>
                    {request.diet_preference}
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h5>Quantity</h5>
                    {request.quantity}
                  </Col>
                  <Col>
                    <h5>No. of children</h5>
                    {request.kids_count}
                  </Col>
                  <Col>
                    <h5>No.of senior citizens</h5>
                    {request.seniors_count}
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h5>District</h5>
                    {request.district}
                  </Col>
                  <Col>
                    <h5>Panchayat/Municipality</h5>
                    {request.plb}
                  </Col>
                  <Col>
                    <h5>Ward</h5>
                    {request.ward}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          {request.FDCDetails && (
            <Col>
              <Row>
                <Col>
                  <Card>
                    <CardHeader>
                      <h5>FDC Information</h5>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col>
                          <h5>Name</h5>
                          {request.FDCDetails.name}
                        </Col>
                      </Row>
                      <hr />
                      <Row>
                        <Col>
                          <h5>Address</h5>
                          {request.FDCDetails.address}
                        </Col>
                      </Row>
                      <hr />
                      <Row>
                        <Col>
                          <h5>Panchayat/Municipality</h5>
                          {request.FDCDetails.plb}
                        </Col>
                        <Col>
                          <h5>Ward</h5>
                          {request.FDCDetails.ward}
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              {/* <Row style={{ marginTop: "10px" }}>
                <Col>
                  <Card>
                    <CardHeader>
                      <h5>Actions</h5>
                    </CardHeader>
                    <CardBody>
                      <p>Update order status to notify the delivery unit.</p>

                      <hr />

                      <Row>
                        <Col>
                          <Button
                            onClick={async () => {
                              let response = await notifyDelivery(request.fdc, {
                                req_ids: [request.id],
                                category: ["1", "2"],
                                requested_unit_count: 1
                              });
                              if (response) alert("Notified");
                            }}
                          >
                            Ready for delivery
                          </Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row> */}
            </Col>
          )}
        </Row>
      </Container>
    );
  }
}

export default MealRequestDetails;
