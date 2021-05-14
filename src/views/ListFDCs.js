import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  FormSelect
} from "shards-react";
import { api_url } from "../utils/constants";
import axios from "axios";
import PageTitle from "../components/common/PageTitle";
import { Link } from "react-router-dom";
const getFDCList = async (district, plb) => {
  let url = `${api_url}/fdc/list?a=1`;
  if (district) {
    url += `&district=${district}`;
    if (plb) {
      url += `&plb=${plb}`;
    }
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
class RequestList extends Component {
  state = {
    fdcs: [],
    showExpired: false,
    district_filter: null,
    plb_filter: null,
    districts: [],
    plbs: []
  };
  componentDidMount() {
    if (!sessionStorage.getItem("access_token"))
      window.location.assign("/#/login");
    this.populateDistrictList();
    if (this.state.district_filter) {
      this.populatePLBList();
    }
    this.getFDCs();
  }
  getFDCs = async () => {
    let fdcs = await getFDCList(
      this.state.district_filter,
      this.state.plb_filter
    );
    console.log(fdcs);
    this.setState({ fdcs });
  };
  populateDistrictList = async () => {
    let districts = await getDistrictList();
    sessionStorage.setItem("district_list", JSON.stringify(districts));
    this.setState({ districts: districts });
  };
  populatePLBList = async () => {
    let plbs = await getPLBList(this.state.district_filter);
    sessionStorage.setItem(
      `plb_list_${this.state.district_filter}`,
      JSON.stringify(plbs)
    );
    this.setState({ plbs: plbs });
  };
  render() {
    return (
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="6"
            title={"Food distribution centers"}
            subtitle="This list contains a list of food distribution centers."
            className="text-sm-left"
          />
        </Row>

        {/* Default Light Table */}
        {/* <Row>
          <Col>
            <Button
              onClick={() => {
                this.setState({ showExpired: !this.state.showExpired }, () => {
                  this.getRequests();
                });
              }}
            >
              {this.state.showExpired ? "Hide Expired" : "Show Expired"}
            </Button>
          </Col>
        </Row> */}
        <Row>
          <Col md="4" className="form-group">
            <label htmlFor="fePhoneNumber">District</label>
            <FormSelect
              // id="feEmailAddress"
              type="text"
              placeholder="Select District"
              value={this.state.district_filter}
              onChange={e => {
                console.log(e.target.value);
                this.setState(
                  {
                    district_filter: e.target.value,
                    plbs: sessionStorage.getItem(`plb_list_${e.target.value}`)
                      ? JSON.parse(
                          sessionStorage.getItem(`plb_list_${e.target.value}`)
                        )
                      : []
                  },
                  () => {
                    this.populatePLBList();
                    this.getFDCs();
                  }
                );
              }}
            >
              <option value={null}>Please select district</option>
              {this.state.districts.map(district => {
                return <option value={district.name}>{district.name}</option>;
              })}
            </FormSelect>
          </Col>
          <Col md="4" className="form-group">
            <label htmlFor="fePhoneNumber">Panchayat/Municipality</label>
            <FormSelect
              // id="feEmailAddress"
              type="text"
              placeholder="Select Panchayat/Municipality"
              value={this.state.plb_filter}
              onChange={e => {
                console.log(e.target.value);
                this.setState({ plb_filter: e.target.value }, this.getFDCs);
              }}
            >
              <option value={null}>Please select Panchayat/Municipality</option>
              {this.state.plbs.map(plb => {
                return <option value={plb.name}>{plb.name}</option>;
              })}
            </FormSelect>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Card small className="mb-4">
              {/* <CardHeader className="border-bottom">
                      <h6 className="m-0">Active Users</h6>
                    </CardHeader> */}
              <CardBody className="p-0 pb-3">
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
                        Support Contact
                      </th>
                      <th scope="col" className="border-0">
                        Address
                      </th>
                      <th scope="col" className="border-0">
                        Panchayat/Municipality
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
                      </th>*/}
                      <th scope="col" className="border-0">
                        More
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.fdcs.map((fdc, i) => {
                      return (
                        <tr>
                          <td>{i + 1}</td>
                          <td>{fdc.name}</td>
                          <td>{fdc.phone}</td>
                          <td>{fdc.address && fdc.address.split(",")[0]}</td>
                          <td>{fdc.plb}</td>

                          <td>{fdc.district}</td>
                          {/* <td>{fdc.notified_units.length}</td>
                          <td>{fdc.responded_unit_count}</td> */}
                          <td>
                            <Link to={`/dashboard/fdc/details/${fdc.id}`}>
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
      </Container>
    );
  }
}
export default RequestList;
