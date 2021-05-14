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
import { Link } from "react-router-dom";
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
const getMealRequests = async () => {
  let response = await axios
    .get(`${api_url}/meal/request/volunteer/list?`, {
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
const registerFoodRequest = async data => {
  let response = await axios
    .post(`${api_url}/meal/request/register`, data, {
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
class CreateNewRequest extends Component {
  state = {
    lat_0: null,
    lng_0: null,
    address_0: "",
    support_contact: sessionStorage.getItem("support_contact"),
    address_0_custom: true,
    show_address_0_suggestion: false,
    lat_1: null,
    lng_1: null,
    address_1: "",
    address_1_custom: false,
    show_address_1_suggestion: false,
    districts: sessionStorage.getItem("district_list")
      ? JSON.parse(sessionStorage.getItem("district_list"))
      : [],
    selected_district: null,
    plbs: sessionStorage.getItem("plb_list")
      ? JSON.parse(sessionStorage.getItem("plb_list"))
      : [],
    selected_plb: null,
    ward_count: 0,
    selected_ward: null,
    caller_phone: "",
    aadhar_no: null,
    diet_preference: "VEG",
    quantity: "",
    children_count: "",
    senior_count: "",
    mreqs: []
  };

  componentDidMount() {
    this.populateDistrictList();
    if (this.state.selected_district) {
      this.populatePLBList();
    }
    this.fetchMR();
  }
  populateDistrictList = async () => {
    let districts = await getDistrictList();
    sessionStorage.setItem("district_list", JSON.stringify(districts));
    this.setState({ districts: districts });
  };
  populatePLBList = async () => {
    let plbs = await getPLBList(this.state.selected_district);
    sessionStorage.setItem(
      `plb_list_${this.state.selected_district}`,
      JSON.stringify(plbs)
    );
    this.setState({ plbs: plbs });
  };
  fetchMR = async () => {
    let mreqs = await getMealRequests();
    this.setState({ mreqs: mreqs });
  };
  render() {
    return (
      <Container fluid className="main-content-container px-4 pb-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="6"
            title="Record food request"
            subtitle="Record request for meals."
            className="text-sm-left"
          />
        </Row>

        <Row>
          {/* Editor */}
          <Col lg="9" md="12">
            <Card>
              <CardBody>
                <Form>
                  <Row>
                    <Col md="4" className="form-group">
                      <label htmlFor="fePhoneNumber">District</label>
                      <FormSelect
                        // id="feEmailAddress"
                        type="text"
                        placeholder="Select District"
                        value={this.state.selected_district}
                        onChange={e => {
                          console.log(e.target.value);
                          this.setState(
                            {
                              selected_district: e.target.value,

                              plbs: sessionStorage.getItem(
                                `plb_list_${e.target.value}`
                              )
                                ? JSON.parse(
                                    sessionStorage.getItem(
                                      `plb_list_${e.target.value}`
                                    )
                                  )
                                : []
                            },
                            this.populatePLBList
                          );
                        }}
                      >
                        <option value={null}>Please select district</option>
                        {this.state.districts.map(district => {
                          return (
                            <option value={district.name}>
                              {district.name}
                            </option>
                          );
                        })}
                      </FormSelect>
                    </Col>
                    <Col md="4" className="form-group">
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
                          Please select Panchayat/Municipality
                        </option>
                        {this.state.plbs.map(plb => {
                          return <option value={plb.name}>{plb.name}</option>;
                        })}
                      </FormSelect>
                    </Col>
                    <Col md="4" className="form-group">
                      <label htmlFor="fePhoneNumber">Ward Number</label>
                      <FormInput
                        // id="feEmailAddress"
                        type="number"
                        placeholder="Select Ward Number"
                        min={0}
                        value={this.state.selected_ward}
                        onChange={e => {
                          console.log(e.target.value);
                          this.setState({ selected_ward: e.target.value });
                        }}
                      ></FormInput>
                    </Col>
                  </Row>
                  <br />
                  <Row form>
                    <Col md="6" className="form-group">
                      <label htmlFor="fePhoneNumber"> Name</label>
                      <FormInput
                        // id="feEmailAddress"
                        type="text"
                        placeholder="Caller Name"
                        value={this.state.name}
                        onChange={e => {
                          console.log(e.target.value);
                          this.setState({ name: e.target.value });
                        }}
                      ></FormInput>
                    </Col>
                    <Col md="6" className="form-group">
                      <label htmlFor="fePhoneNumber">
                        {" "}
                        Caller Phone Number
                      </label>
                      <FormInput
                        // id="feEmailAddress"
                        type="text"
                        placeholder="Caller Phone Number"
                        pattern="[0-9]*"
                        value={this.state.caller_phone}
                        onChange={e => {
                          console.log(e.target.value);
                          if (e.target.validity.valid) {
                            this.setState({ caller_phone: e.target.value });
                          }
                        }}
                      ></FormInput>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="4">
                      <label htmlFor="fePassword">
                        Quantity <sub>(Number of people)</sub>
                      </label>
                      <FormInput
                        type="text"
                        placeholder="Quantity"
                        value={this.state.quantity}
                        min={0}
                        pattern="[0-9]*"
                        onChange={e => {
                          console.log(e.target.value);
                          if (e.target.validity.valid) {
                            this.setState({
                              quantity: e.target.value
                            });
                          }
                        }}
                      ></FormInput>
                    </Col>
                    <Col lg="4">
                      <label htmlFor="fePassword">Number of children</label>
                      <FormInput
                        type="text"
                        placeholder="No. of children"
                        value={this.state.children_count}
                        min={0}
                        pattern="[0-9]*"
                        onInput={e => {
                          console.log(e.target.value, e.target.validity.valid);
                          try {
                            if (
                              Number.parseInt(this.state.senior_count) +
                                Number.parseInt(e.target.value) >
                              Number.parseInt(this.state.quantity)
                            ) {
                              console.log("Error....");
                            } else {
                              if (e.target.validity.valid) {
                                this.setState({
                                  children_count: e.target.value
                                });
                              }
                            }
                          } catch (e) {
                            console.log(e);
                          }
                        }}
                      ></FormInput>
                    </Col>
                    <Col lg="4">
                      <label htmlFor="fePassword">
                        Number of senior citizens
                      </label>
                      <FormInput
                        type="text"
                        placeholder="No. of senior citizens"
                        value={this.state.senior_count}
                        min={0}
                        pattern="[0-9]*"
                        onChange={e => {
                          console.log(e.target.value);
                          try {
                            if (
                              Number.parseInt(this.state.children_count) +
                                Number.parseInt(e.target.value) >
                              Number.parseInt(this.state.quantity)
                            ) {
                              console.log("Error....");
                            } else {
                              if (e.target.validity.valid) {
                                this.setState({
                                  senior_count: e.target.value
                                });
                              }
                            }
                          } catch (e) {
                            console.log(e);
                          }
                        }}
                      ></FormInput>
                    </Col>
                  </Row>
                  <br />

                  <Row form>
                    <Col md="6" className="form-group">
                      <label htmlFor="fePhoneNumber">
                        House name / number / road
                      </label>
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
                          placeholder="House name / number / road"
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
                      <label htmlFor="fePassword">
                        Latitude{" "}
                        <span>
                          <sup>(Optional)</sup>
                        </span>
                      </label>
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
                      <label htmlFor="fePassword">
                        Longitude{" "}
                        <span>
                          <sup>(Optional)</sup>
                        </span>
                      </label>
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
                  {/* <Row>
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
                  </Row> */}
                  <Row form>
                    <Col md="6" className="form-group">
                      <label htmlFor="fePhoneNumber">Landmark Address</label>
                      {!this.state.address_1_custom && (
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
                              display: this.state.show_address_1_suggestion
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
                            this.setState({ show_address_1_suggestion: false });
                          }}
                          onFocus={() => {
                            this.setState({ show_address_1_suggestion: true });
                          }}
                          onSuggestNoResults={() => {
                            this.setState({ lat_1: "", lng_1: "" });
                          }}
                          onChange={text => {
                            if (!text || text === "") {
                              this.setState({ lat_1: "", lng_1: "" });
                            }
                            this.setState({ show_address_1_suggestion: true });
                          }}
                          onSuggestSelect={suggest => {
                            if (suggest && suggest.location) {
                              console.log(suggest);
                              this.setState({
                                show_address_1_suggestion: false,
                                address_1: suggest.label,
                                lat_1: suggest.location.lat,
                                lng_1: suggest.location.lng
                              });
                            }
                          }}
                        />
                      )}
                      {this.state.address_1_custom && (
                        <FormTextarea
                          // id="feEmailAddress"
                          type="text"
                          placeholder="Enter Landmark Address"
                          value={this.state.address_1}
                          onChange={e => {
                            console.log(e.target.value);
                            this.setState({ address_1: e.target.value });
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
                        value={this.state.lat_1}
                        disabled={!this.state.address_1_custom}
                        onChange={e => {
                          this.setState({ lat_1: e.target.value });
                        }}
                      />
                    </Col>
                    <Col md="3">
                      <label htmlFor="fePassword">Longitude</label>
                      <FormInput
                        type="number"
                        placeholder="Longitude"
                        value={this.state.lng_1}
                        disabled={!this.state.address_1_custom}
                        onChange={e => {
                          this.setState({ lng_1: e.target.value });
                        }}
                      />
                    </Col>
                  </Row>
                  {/* <Row>
                    <Col
                      style={{
                        position: "relative",
                        top: "-10px",
                        left: "5px",
                        fontSize: "12px"
                      }}
                    >
                      <FormCheckbox
                        checked={this.state.address_1_custom}
                        onChange={e => {
                          console.log(e.target.checked);
                          this.setState({
                            address_1_custom: e.target.checked
                          });
                        }}
                      >
                        Use custom address and location
                      </FormCheckbox>
                    </Col>
                  </Row> */}
                  <Row>
                    <Col lg="4">
                      <label htmlFor="fePassword">Diet Preference</label>
                      <FormSelect
                        type="text"
                        placeholder="Diet Preference"
                        value={this.state.diet_preference}
                        onChange={e => {
                          console.log(e.target.value);
                          this.setState({
                            diet_preference: e.target.value
                          });
                        }}
                      >
                        <option>VEG</option>
                        <option>NON-VEG</option>
                      </FormSelect>
                    </Col>
                    <Col md="6" className="form-group">
                      <label htmlFor="fePhoneNumber">
                        {" "}
                        Aadhar No.<sup>Optional</sup>
                      </label>
                      <FormInput
                        // id="feEmailAddress"
                        type="text"
                        placeholder="Aadhar Number"
                        value={this.state.aadhar_no}
                        onChange={e => {
                          console.log(e.target.value);
                          this.setState({ aadhar_no: e.target.value });
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
                          let respose = await registerFoodRequest({
                            name: this.state.name,
                            aadhar_no: this.state.aadhar_no,
                            address: this.state.address_0,
                            address_location:
                              this.state.lat_0 && this.state.lng_0
                                ? [this.state.lat_0, this.state.lng_0]
                                : null,
                            landmark_address: this.state.address_1,
                            landmark_location:
                              this.state.lat_1 && this.state.lng_1
                                ? [this.state.lat_1, this.state.lng_1]
                                : null,
                            phone: this.state.caller_phone,
                            district: this.state.selected_district,
                            plb: this.state.selected_plb,
                            ward: this.state.selected_ward,
                            quantity: this.state.quantity,
                            kids_count: this.state.children_count,
                            seniors_count: this.state.senior_count,
                            diet_preference: this.state.diet_preference
                          });
                          if (respose) {
                            alert("Food request Recorded");
                            window.location.reload();
                          }

                          this.fetchMR();
                        }}
                      >
                        Record
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col>
            <Card>
              <CardHeader>
                <h5>My Records</h5>
              </CardHeader>
              {!this.state.mreqs ||
                (this.state.mreqs.length === 0 && (
                  <CardBody>
                    <Row>
                      <Col>No Records!</Col>
                    </Row>
                  </CardBody>
                ))}
              {this.state.mreqs && this.state.mreqs.length > 0 && (
                <CardBody style={{ maxHeight: "600px", overflow: "scroll " }}>
                  <Row>
                    <Col lg="6">
                      <h5>Name</h5>
                    </Col>
                    <Col lg="4">
                      <h5>Qty</h5>
                    </Col>
                    <Col lg="1"></Col>
                  </Row>

                  {this.state.mreqs.map(request => {
                    return (
                      <React.Fragment>
                        <hr />
                        <Row>
                          <Col lg="6">{request.name}</Col>
                          <Col lg="4">{request.quantity}</Col>
                          <Col lg="1">
                            <Link
                              to={
                                ["fdc_volunteer"].indexOf(
                                  sessionStorage.getItem("user_role") !== -1
                                )
                                  ? `/volunteer/food/request/details/${request.id}`
                                  : `/dashboard/food/request/details/${request.id}`
                              }
                            >
                              {" "}
                              <i class="material-icons">details</i>
                            </Link>
                          </Col>
                        </Row>
                      </React.Fragment>
                    );
                  })}
                </CardBody>
              )}
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
