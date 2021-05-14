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
import GoogleMapReact from "google-map-react";
import Marker from "../components/marker";
import Geosuggest from "react-geosuggest";

class FDCOverview extends Component {
  state = {
    assets: [],
    showAddressSuggestion: false,
    center: {
      lat: 10.1485476,
      lng: 76.5007524
    },
    zoom: 8
  };
  componentDidMount() {
    if (!sessionStorage.getItem("access_token"))
      window.location.assign("/#/login");
  }

  render() {
    return (
      <Container fluid className="main-content-container px-4 pb-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="6"
            title="Overview FDC"
            subtitle="Statistics of food distribution centers."
            className="text-sm-left"
          />
        </Row>
        <Row>
          <Col lg="12">
            <Card>
              <CardBody>
                {" "}
                <iframe
                  title="fdc_overview"
                  src="https://cookbookapp.in/RIA/ccc/dashboard.html"
                  style={{ height: "80vh", width: "100%", border: "none" }}
                ></iframe>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default FDCOverview;
