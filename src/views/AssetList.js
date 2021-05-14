import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  FormSelect
} from "shards-react";
import { api_url } from "../utils/constants";
import axios from "axios";
import PageTitle from "../components/common/PageTitle";
import moment from "moment";
import Geosuggest from "react-geosuggest";
const getAssetList = async (locationFilter, categoryFilter) => {
  let url = `${api_url}/asset?a=1`;
  let role = sessionStorage.getItem("user_role");
  if (role) {
    url += `&role=${role}`;
  }
  if (locationFilter) {
    url =
      url +
      `&search_loc_lat=${locationFilter.lat}&search_loc_lng=${
        locationFilter.lng
      }&search_radius=25000&location_filter=true`;
  }
  if (categoryFilter && categoryFilter != "all") {
    url += `&category=${categoryFilter}`;
  }
  let response = await axios
    .get(url, {
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
const getGroupOptions = async () => {
  let url = `${api_url}/asset/list/group?a=1`;
  let role = sessionStorage.getItem("user_role");
  if (role) {
    url += `&role=${role}`;
  }
  let response = await axios
    .get(url, {
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
class AssetList extends Component {
  state = { assets: [], showAddressSuggestion: false, group_options: [] };
  componentDidMount() {
    if (!sessionStorage.getItem("access_token"))
      window.location.assign("/#/login");
    this.getAssets();
    this.populateGroupOptions();
  }
  getAssets = async (locationFilter, categoryFilter) => {
    let assets = await getAssetList(locationFilter, categoryFilter);
    this.setState({ assets });
  };
  populateGroupOptions = async () => {
    let options = await getGroupOptions();
    this.setState({ group_options: options });
  };
  render() {
    return (
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="4"
            title="Assets"
            subtitle="This list contains all registered resources."
            className="text-sm-left"
          />
        </Row>

        {/* Default Light Table */}
        <Row>
          <Col>
            <Geosuggest
              // ref={el => (this._geoSuggest = el)}
              placeholder="Search by address proximity"
              highlightMatch={true}
              country="in"
              style={{
                input: {
                  border: "none",
                  padding: "0px 10px",
                  color: "#454545",
                  backgroundColor: "#fff",
                  boxSizing: "border-box",
                  margin: "5px 0px",
                  height: "48px",
                  width: "300px",
                  borderRadius: "5px"
                },
                suggests: {
                  color: "#fff",
                  display: this.state.showAddressSuggestion ? "block" : "none",
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
                this.setState({ showAddressSuggestion: false });
              }}
              onFocus={() => {
                this.setState({ showAddressSuggestion: true });
              }}
              onChange={text => {
                if (text == null || text === "") {
                  this.getAssets();
                }
                this.setState({ showAddressSuggestion: true });
              }}
              onSuggestSelect={suggest => {
                if (suggest && suggest.location) {
                  this.getAssets({
                    lat: suggest.location.lat,
                    lng: suggest.location.lng
                  });
                  this.setState({
                    showAddressSuggestion: false
                  });
                }
              }}
            />
            <sub style={{ position: "relative", top: "-8px", left: "5px" }}>
              Shows all assets within a 25 km radius of a given address.
            </sub>
          </Col>
          <Col>
            <FormSelect
              onChange={e => {
                console.log(e.target.value);
                this.getAssets(null, e.target.value);
              }}
            >
              <option value={"all"}>All</option>
              {this.state.group_options.map(opt => {
                let cat_codes = [];
                for (let code of opt.categoryList) {
                  cat_codes.push(code.id);
                }

                cat_codes = cat_codes.join(",");
                console.log(cat_codes);
                return <option value={cat_codes}>{opt.title}</option>;
              })}
            </FormSelect>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card small className="mb-4">
              {/* <CardHeader className="border-bottom">
                      <h6 className="m-0">Active Users</h6>
                    </CardHeader> */}
              <CardBody className="p-0 pb-3">
                <table className="table mb-0 table-responsive-sm table-responsive-md table-responsive table-striped ">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col" className="border-0">
                        #
                      </th>
                      <th scope="col" className="border-0">
                        Reg.No
                      </th>
                      <th scope="col" className="border-0">
                        Managed By
                      </th>
                      <th scope="col" className="border-0">
                        Category
                      </th>
                      {/* <th scope="col" className="border-0">
                        City
                      </th> */}
                      <th scope="col" className="border-0">
                        Phone
                      </th>
                      {/* <th scope="col" className="border-0">
                        Last Known Location
                      </th> */}
                      <th scope="col" className="border-0">
                        Panchayat/Municipality{" "}
                      </th>
                      <th scope="col" className="border-0">
                        District{" "}
                      </th>
                      <th scope="col" className="border-0">
                        Current Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.assets.map((asset, i) => {
                      let active = false;
                      for (let mgr of asset.managerDetails) {
                        if (mgr.current_service != null) {
                          active = true;
                        }
                      }
                      let no_location_update = true;
                      try {
                        let updated_date = new Date(
                          asset.location_update_timestamp
                        );
                        console.log("updated At", updated_date.toTimeString());
                        let _3hrs_ago = moment().subtract(3, "hours");
                        console.log(
                          "3 hrs",
                          new Date(_3hrs_ago).toTimeString()
                        );
                        if (
                          updated_date.getTime() > new Date(_3hrs_ago).getTime()
                        ) {
                          no_location_update = false;
                        }
                      } catch (e) {
                        console.log(e);
                      }
                      return (
                        <tr className="asset-list-data-row">
                          <td>{i + 1}</td>
                          <td>{asset.reg_no}</td>
                          <td>
                            {asset.managerDetails[0]
                              ? asset.managerDetails[0].name
                              : "-"}
                          </td>
                          <td>
                            {asset.categoryDetails
                              ? asset.categoryDetails.title
                              : "-"}
                          </td>
                          <td>
                            {asset.managerDetails[0]
                              ? asset.managerDetails[0].phone
                              : "-"}
                          </td>
                          {/* <td>
                            {asset.location && asset.location.coordinates
                              ? asset.location.coordinates.toString()
                              : "Not Available"}
                          </td> */}
                          <td>
                            {asset.managerDetails[0]
                              ? asset.managerDetails[0].plb
                              : "-"}
                          </td>
                          <td>
                            {asset.managerDetails[0]
                              ? asset.managerDetails[0].district
                              : "-"}
                          </td>
                          <td>
                            {" "}
                            <p
                              style={{
                                //   height: "28px",
                                width: "100px",
                                backgroundColor: no_location_update
                                  ? "rgb(255, 151, 151)"
                                  : active
                                  ? "#ffeb99"
                                  : "rgb(181, 255, 184)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                margin: "0px 20px",
                                borderRadius: "5px",
                                padding: "2px",
                                marginLeft: "0px"
                              }}
                            >
                              {no_location_update
                                ? "Unavailable"
                                : active
                                ? "In service"
                                : "Available"}
                            </p>
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
export default AssetList;
