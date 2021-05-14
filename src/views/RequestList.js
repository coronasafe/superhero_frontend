import React, { Component, useState}  from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button
} from "shards-react";
import { api_url } from "../utils/constants";
import axios from "axios";
import PageTitle from "../components/common/PageTitle";
import { Link } from "react-router-dom";
import { CSVLink, CSVDownload } from "react-csv";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const getRequestList = async (showExpired, shiftedDate) => {
  let url = `${api_url}/service/request/list?a=1`;
  let role = sessionStorage.getItem("user_role");
  if (role) {
    url += `&role=${role}`;
  }
  if (showExpired) {
    url += `&show_expired=true`;
  }
  if (shiftedDate) {
    url += `&shifted_date=${shiftedDate.toISOString()}`;
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

class RequestList extends Component {
  csvLink = React.createRef()

  state = {
    requests: [],
    showExpired: false,
    shiftedTodayList: [],
    startDate: new Date(),
    showDownloadOption: false,
  };
  componentDidMount() {
    if (!sessionStorage.getItem("access_token"))
      window.location.assign("/#/login");
    this.getRequests();
    this.req_int = setInterval(this.getRequests, 100000);
  }
  componentWillUnmount() {
    clearInterval(this.req_int);
  }
  getRequests = async () => {
    let requests = await getRequestList(this.state.showExpired);
    console.log(requests);
    this.setState({ requests });
  };
  render() {
    const DatePickerExample = () => {
      // const [setStartDate] = useState(new Date());
      return (
        <DatePicker selected={this.state.startDate} onChange={date => this.setState({startDate: date})} />
      );
    };
    const DownloadButton = () => (
      <div>
        {
          (!this.state.showDownloadOption || !this.state.shiftedTodayList) ? <Button
              onClick={
                async () => {
                  const shiftedTodayList = await getRequestList(true, this.state.startDate);
                  let finalDataTobeDownloaded;
                  if (shiftedTodayList.length > 0) {
                    finalDataTobeDownloaded = shiftedTodayList.map((singleShiftedPatient, index) => {
                      return {
                        index: index+1,
                        patient_name: singleShiftedPatient.patient_name,
                        address_0: singleShiftedPatient.address_0,
                        support_contact: singleShiftedPatient.support_contact,
                        address_1: singleShiftedPatient.address_1,
                        destination_contact: singleShiftedPatient.destination_contact,
                        date: new Date(singleShiftedPatient.createdAt).toLocaleDateString("en-IN"),
                      }
                    })
                  }
                  console.log(JSON.stringify(finalDataTobeDownloaded))
                  this.setState({
                    shiftedTodayList: finalDataTobeDownloaded,
                    showDownloadOption: true,
                  }, () => {
                    this.state.showDownloadOption = false
                  });
                }
              }
            >
              Prepare shifted report
            </Button> : null
        }
        {this.state.showDownloadOption ?
          (
            this.state.shiftedTodayList && this.state.shiftedTodayList.length > 0 ?
              <CSVLink
                headers={[
                  {label: "No:", key: "index"},
                  {label: "Date", key: "date"},
                  {label: "Patient Name", key: "patient_name"},
                  {label: "Pickup Location", key: "address_0"},
                  {label: "Pickup Contact", key: "support_contact"},
                  {label: "Drop Location", key: "address_1"},
                  {label: "Drop Contact", key: "destination_contact"},
                ]}
                filename={`${new Date(this.state.startDate).toDateString()}.csv`}
                data={this.state.shiftedTodayList ? this.state.shiftedTodayList : []}
                className="hidden"
                ref={(r) => this.csvLink = r}
                target="_blank">
                Download
              </CSVLink> :
              alert("No patients were shifted.")
          ) : null
        }
      </div>
    )

    return (
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="6"
            title={this.state.showExpired ? "All Requests" : "Active Requests"}
            subtitle="This list contains a list of requests and their correspondind statuses."
            className="text-sm-left"
          />
        </Row>

        {/* Default Light Table */}
        <Row>
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
          <Col className="col">
            <div className="col">
              <div className="float-right">
                <div className="" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                  {this.state.showExpired ?
                    <DatePickerExample/> : null
                  }
                  {this.state.showExpired ?
                    <div style={{ marginLeft: "10px"}} >
                      <DownloadButton/>
                    </div> : null
                  }
                </div>
              </div>
            </div>
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
                        Category
                      </th>
                      <th scope="col" className="border-0">
                        Pickup Address
                      </th>
                      <th scope="col" className="border-0">
                        Destination Address
                      </th>
                      {/* <th scope="col" className="border-0">
                        City
                      </th> */}
                      <th scope="col" className="border-0">
                        Requested
                      </th>
                      <th scope="col" className="border-0">
                        Available
                      </th>
                      <th scope="col" className="border-0">
                        Responded
                      </th>
                      <th scope="col" className="border-0">
                        Patient name
                      </th>
                      <th scope="col" className="border-0">
                        Patient no.
                      </th>
                      <th scope="col" className="border-0">
                        Date
                        <br />
                        Time
                      </th>
                      <th scope="col" className="border-0">
                        Picked up
                      </th>
                      <th scope="col" className="border-0">
                        More
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.requests.map((request, i) => {
                      let createDate = new Date(request.createdAt);
                      // if (
                      //   request.categoryDetails &&
                      //   request.categoryDetails.id == 1
                      // )
                      return (
                        <tr>
                          <td>{i + 1}</td>
                          <td>
                            {request.categoryDetails
                              ? request.categoryDetails.title
                              : "-"}
                          </td>
                          <td>{request.address_0}</td>
                          <td>
                            {request.address_1
                              ? request.address_1
                              : "Not Applicable"}
                          </td>

                          <td>{request.requested_unit_count}</td>
                          <td>{request.notified_units.length}</td>
                          <td>{request.responded_unit_count}</td>
                          <td>{request.patient_name}</td>
                          <td>{request.support_contact}</td>
                          <td style={{ minWidth: "110px" }}>
                            {createDate.toLocaleDateString('en-GB')}
                            <br />
                            {createDate.toLocaleTimeString()}
                          </td>
                          <td>
                            <p
                              style={{
                                margin: "0px",
                                backgroundColor:
                                  request.responded_units &&
                                  request.picked_up_units &&
                                  request.responded_units.length ===
                                    request.picked_up_units.length
                                    ? "rgb(181, 255, 184)"
                                    : "rgb(255, 232, 151)",
                                textAlign: "center",
                                width: "100px",
                                borderRadius: "5px"
                              }}
                            >
                              <span>
                                {request.picked_up_units
                                  ? request.picked_up_units.length
                                  : 0}
                              </span>
                              <span style={{ margin: "0px 8px" }}>of</span>
                              <span>
                                {request.responded_units
                                  ? request.responded_units.length
                                  : 0}
                              </span>
                            </p>
                          </td>
                          <td>
                            <Link to={`/dashboard/requests/${request.id}`}>
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
