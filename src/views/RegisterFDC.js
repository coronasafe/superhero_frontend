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
import Geosuggest from "react-geosuggest";
import axios from "axios";
import { api_url } from "../utils/constants";
const getDistrictList = async () => {
  let response = await axios
    .get(`${api_url}/asset/list/district`, {
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
const getPLBList = async district => {
  let response = await axios
    .get(
      `${api_url}/asset/list/plb?${district ? `district=${district}` : ""}`,
      {
        headers: { "x-access-token": sessionStorage.getItem("access_token") }
      }
    )
    .catch(error => {
      console.log(error);
    });
  try {
    return response.data.data;
  } catch (e) {
    console.log(e);
  }
};
const registerFDC = async data => {
  let response = await axios
    .post(`${api_url}/fdc/create`, data, {
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
class CreateNewRequest extends Component {
  state = {
    lat_0: null,
    lng_0: null,
    address_0: "",
    support_contact: sessionStorage.getItem("support_contact"),
    address_0_custom: false,
    show_address_0_suggestion: false,
    districts: [],
    selected_district: "ALAPPUZHA",
    plbs: [],
    selected_plb: null,
    ward_count: 0,
    selected_ward: null
  };

  componentDidMount() {
    this.populateDistrictList();
    if (this.state.selected_district) {
      this.populatePLBList();
    }
  }
  populateDistrictList = async () => {
    let districts = await getDistrictList();
    this.setState({ districts: districts });
  };
  populatePLBList = async () => {
    let plbs = await getPLBList(this.state.selected_district);
    this.setState({ plbs: plbs });
  };
  render() {
    return (
      <Container fluid className="main-content-container px-4 pb-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="6"
            title="Register new FDC"
            subtitle="Register a new food distribution center."
            className="text-sm-left"
          />
        </Row>

        <Row>
          {/* Editor */}
          <Col lg="9" md="12">
            <Card>
              <CardBody>
                <Form>
                  <Row form>
                    <Col md="6" className="form-group">
                      <label htmlFor="fePhoneNumber">Center Name</label>
                      <FormInput
                        // id="feEmailAddress"
                        type="text"
                        placeholder="Centre Name"
                        value={this.state.name}
                        onChange={e => {
                          console.log(e.target.value);
                          this.setState({ name: e.target.value });
                        }}
                      ></FormInput>
                    </Col>
                  </Row>
                  <Row form>
                    <Col md="6" className="form-group">
                      <label htmlFor="fePhoneNumber">Address</label>
                      {!this.state.address_0_custom && (
                        <Geosuggest
                          // ref={el => (this._geoSuggest = el)}
                          placeholder="Search address"
                          highlightMatch={true}
                          country="in"
                          style={{
                            input: {
                              padding: "0px 10px",
                              color: "#454545",
                              backgroundColor: "#fff",
                              boxSizing: "border-box",
                              margin: "0px 0px",
                              height: "35px",
                              width: "392px",
                              borderRadius: "5px",
                              border: "1px solid #ddd",
                              fontSize: "12px"
                            },
                            suggests: {
                              color: "#fff",
                              display: this.state.show_address_0_suggestion
                                ? "block"
                                : "none",
                              marginTop: "0px",
                              marginBottom: "0px",
                              position: "absolute",
                              zIndex: 1,
                              backgroundColor: "#fff",
                              borderRadius: "10px",
                              boxShadow: "rgb(238, 238, 238) 0px 0px 8px 8px"
                            },
                            suggestItem: {
                              backgroundColor: "#fff",
                              padding: "10px 10px",
                              cursor: "pointer",
                              color: "#454545"
                            }
                          }}
                          onBlur={() => {
                            this.setState({ show_address_0_suggestion: false });
                          }}
                          onFocus={() => {
                            this.setState({ show_address_0_suggestion: true });
                          }}
                          onChange={text => {
                            this.setState({ show_address_0_suggestion: true });
                          }}
                          onSuggestSelect={suggest => {
                            if (suggest && suggest.location) {
                              console.log(suggest);
                              this.setState({
                                show_address_0_suggestion: false,
                                address_0: suggest.label,
                                lat_0: suggest.location.lat,
                                lng_0: suggest.location.lng
                              });
                            }
                          }}
                        />
                      )}
                      {this.state.address_0_custom && (
                        <FormTextarea
                          // id="feEmailAddress"
                          type="text"
                          placeholder="Enter First Address"
                          value={this.state.address_0}
                          onChange={e => {
                            console.log(e.target.value);
                            this.setState({ address_0: e.target.value });
                          }}
                          style={{ minHeight: "100px" }}
                        />
                      )}
                    </Col>
                    <Col md="3">
                      <label htmlFor="fePassword">Latitude</label>
                      <FormInput
                        type="number"
                        placeholder="Latitude"
                        value={this.state.lat_0}
                        disabled={!this.state.address_0_custom}
                        onChange={e => {
                          this.setState({ lat_0: e.target.value });
                        }}
                      />
                    </Col>
                    <Col md="3">
                      <label htmlFor="fePassword">Longitude</label>
                      <FormInput
                        type="number"
                        placeholder="Longitude"
                        value={this.state.lng_0}
                        disabled={!this.state.address_0_custom}
                        onChange={e => {
                          this.setState({ lng_0: e.target.value });
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      style={{
                        position: "relative",
                        top: "-10px",
                        left: "5px",
                        fontSize: "12px"
                      }}
                    >
                      <FormCheckbox
                        checked={this.state.address_0_custom}
                        onChange={e => {
                          console.log(e.target.checked);
                          this.setState({
                            address_0_custom: e.target.checked
                          });
                        }}
                      >
                        Use custom address and location
                      </FormCheckbox>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="4">
                      <label htmlFor="fePassword">Support contact</label>
                      <FormInput
                        type="text"
                        placeholder="Support contact"
                        value={this.state.support_contact}
                        onChange={e => {
                          // console.log(e.target.value);
                          let validation_test = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(
                            e.target.value
                          );
                          if (!e.target.value || e.target.value == "")
                            validation_test = true;
                          // console.log(validation_test);
                          if (validation_test) {
                            this.setState({ support_contact: e.target.value });
                            sessionStorage.setItem(
                              "support_contact",
                              e.target.value
                            );
                          }
                        }}
                      ></FormInput>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6" className="form-group">
                      <label htmlFor="fePhoneNumber">District</label>
                      <FormSelect
                        // id="feEmailAddress"
                        type="text"
                        placeholder="Select District"
                        value={this.state.selected_district}
                        onChange={e => {
                          console.log(e.target.value);
                          this.setState(
                            { selected_district: e.target.value, plbs: [] },
                            this.populatePLBList
                          );
                        }}
                      >
                        {this.state.districts.map(district => {
                          return (
                            <option value={district.name}>
                              {district.name}
                            </option>
                          );
                        })}
                      </FormSelect>
                    </Col>
                    <Col md="6" className="form-group">
                      <label htmlFor="fePhoneNumber">
                        Panchayat/Municipality
                      </label>
                      <FormSelect
                        // id="feEmailAddress"
                        type="text"
                        placeholder="Select Panchayat/Municipality"
                        value={this.state.selected_plb}
                        onChange={e => {
                          console.log(e.target.value);
                          this.setState({ selected_plb: e.target.value });
                        }}
                      >
                        <option value={null}>
                          {"Please select Panchayat/Municipality"}
                        </option>
                        ;
                        {this.state.plbs.map(plb => {
                          return <option value={plb.name}>{plb.name}</option>;
                        })}
                      </FormSelect>
                    </Col>
                    <Col md="6" className="form-group">
                      <label htmlFor="fePhoneNumber">Ward Number</label>
                      <FormInput
                        // id="feEmailAddress"
                        type="text"
                        placeholder="Select Ward Number"
                        value={this.state.selected_ward}
                        onChange={e => {
                          console.log(e.target.value);
                          this.setState({ selected_ward: e.target.value });
                        }}
                      ></FormInput>
                    </Col>
                  </Row>
                  <br />
                  {/* <Row>
                    <Col lg="4">
                      {" "}
                      <label htmlFor="fePassword">Query Radius (KM)</label>
                      <FormInput
                        type="number"
                        value={this.state.search_radius}
                        onChange={e => {
                          this.setState({ search_radius: e.target.value });
                        }}
                      ></FormInput>
                    </Col>
                  </Row> */}

                  <br />
                  <Row>
                    <Col>
                      <Button
                        onClick={async () => {
                          let respose = await registerFDC({
                            name: this.state.name,
                            address: this.state.address_0,
                            location: [this.state.lat_0, this.state.lng_0],
                            district: this.state.selected_district,
                            plb: this.state.selected_plb,
                            ward: this.state.selected_ward,
                            phone: this.state.support_contact
                          });
                          if (respose) {
                            alert("New FDC Registered");
                            window.location.reload();
                          }
                        }}
                      >
                        Register
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>

          {/* Sidebar Widgets */}
          {/* <Col lg="3" md="12">
            <SidebarActions />
            <SidebarCategories />
          </Col> */}
        </Row>
      </Container>
    );
  }
}

export default CreateNewRequest;
