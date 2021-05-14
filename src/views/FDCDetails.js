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
import { Link } from "react-router-dom";
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
const getFDCDetails = async id => {
  let response = await axios
    .get(`${api_url}/fdc/get/${id}`, {
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

class FDCDetails extends Component {
  state = {
    asset_categories: [],
    fdc: null
  };
  populate_asset_categories = async () => {
    let categories = await getAssetCategoryList();
    console.log(categories);
    this.setState({ asset_categories: categories });
  };
  getFDC = async id => {
    let fdc = await getFDCDetails(id);
    console.log(fdc);
    this.setState({ fdc });
  };
  componentDidMount() {
    // this.populate_asset_categories();
    console.log(this.props.match.params.id);
    this.getFDC(this.props.match.params.id);
  }

  render() {
    if (!this.state.fdc)
      return (
        <div>
          <p>Loading....</p>
        </div>
      );
    let fdc = this.state.fdc;
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
          <Col lg="8">
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
                        {fdc.name}
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col>
                        <h5>Address</h5>
                        {fdc.address}
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col>
                        <h5>Panchayat/Municipality</h5>
                        {fdc.plb}
                      </Col>
                      <Col>
                        <h5>Ward</h5>
                        {fdc.ward}
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
        <br />
        {fdc.requestDetails && fdc.requestDetails.length > 0 && (
          <Row>
            <Col>
              <Card>
                <CardHeader>Orders</CardHeader>
                <CardBody>
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
                          Contact Number
                        </th>
                        <th scope="col" className="border-0">
                          Address
                        </th>
                        <th scope="col" className="border-0">
                          Quantity
                        </th>
                        <th scope="col" className="border-0">
                          Veg/Non-Veg
                        </th>
                        {/* <th scope="col" className="border-0">
                        City
                      </th> */}
                        <th scope="col" className="border-0">
                          District
                        </th>
                        {/* <th scope="col" className="border-0">
                        Available Units
                      </th>
                      <th scope="col" className="border-0">
                        Responded Units
                      </th> */}
                        <th scope="col" className="border-0">
                          More
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {fdc.requestDetails.map((request, i) => {
                        return (
                          <tr>
                            <td>{i + 1}</td>
                            <td>{request.name}</td>
                            <td>{request.phone}</td>
                            <td>
                              {request.address && request.address.split(",")[0]}
                            </td>
                            <td>{request.quantity}</td>
                            <td>{request.diet_preference}</td>

                            <td>{request.district}</td>
                            {/* <td>{fdc.notified_units.length}</td>
                          <td>{fdc.responded_unit_count}</td> */}
                            <td>
                              <Link
                                to={`/dashboard/food/request/details/${request.id}`}
                              >
                                <Button>More info</Button>
                              </Link>
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
        )}
      </Container>
    );
  }
}

export default FDCDetails;
