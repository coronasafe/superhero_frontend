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
const getAssetList = async locationFilter => {
  let url = `${api_url}/asset?a=1&active=true`;
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
class MapView extends Component {
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
    this.getAssets();
  }
  getAssets = async locationFilter => {
    let assets = await getAssetList(locationFilter);
    this.setState({ assets });
  };

  render() {
    if (sessionStorage.getItem("user_role") === "fdc_volunteer") {
      window.location.assign("/#/volunteer/food/request/register");
      window.location.reload();
    } else
      return (
        <Container fluid className="main-content-container px-4 pb-4">
          {/* Page Header */}
          <Row noGutters className="page-header py-4">
            <PageTitle
              sm="6"
              title="Map View"
              subtitle="Plot of known locations of assets."
              className="text-sm-left"
            />
          </Row>
          <Row>
            <Col>
              <Geosuggest
                // ref={el => (this._geoSuggest = el)}
                placeholder="Search by address"
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
                    display: this.state.showAddressSuggestion
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
                    //   this.getAssets({
                    //     lat: suggest.location.lat,
                    //     lng: suggest.location.lng
                    //   });
                    this.setState({
                      showAddressSuggestion: false,
                      center: {
                        lat: suggest.location.lat,
                        lng: suggest.location.lng
                      },
                      zoom: 12
                    });
                  }
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <div style={{ height: "75vh", width: "100%" }}>
                  <GoogleMapReact
                    bootstrapURLKeys={{
                      key: "" // KEY GOES HERE
                    }}
                    defaultCenter={{
                      lat: 10.1485476,
                      lng: 76.5007524
                    }}
                    defaultZoom={8}
                    center={this.state.center}
                    zoom={this.state.zoom}
                    options={{
                      styles: [
                        {
                          elementType: "geometry",
                          stylers: [
                            {
                              color: "#f5f5f5"
                            }
                          ]
                        },
                        {
                          elementType: "labels.icon",
                          stylers: [
                            {
                              visibility: "off"
                            }
                          ]
                        },
                        {
                          elementType: "labels.text.fill",
                          stylers: [
                            {
                              color: "#616161"
                            }
                          ]
                        },
                        {
                          elementType: "labels.text.stroke",
                          stylers: [
                            {
                              color: "#f5f5f5"
                            }
                          ]
                        },
                        {
                          featureType: "administrative.land_parcel",
                          elementType: "labels.text.fill",
                          stylers: [
                            {
                              color: "#bdbdbd"
                            }
                          ]
                        },
                        {
                          featureType: "poi",
                          elementType: "geometry",
                          stylers: [
                            {
                              color: "#eeeeee"
                            }
                          ]
                        },
                        {
                          featureType: "poi",
                          elementType: "labels.text.fill",
                          stylers: [
                            {
                              color: "#757575"
                            }
                          ]
                        },
                        {
                          featureType: "poi.government",
                          elementType: "geometry.stroke",
                          stylers: [
                            {
                              color: "#ffc54a"
                            }
                          ]
                        },
                        {
                          featureType: "poi.medical",
                          elementType: "geometry.stroke",
                          stylers: [
                            {
                              color: "#40ff8b"
                            }
                          ]
                        },
                        {
                          featureType: "poi.park",
                          elementType: "geometry",
                          stylers: [
                            {
                              color: "#e5e5e5"
                            }
                          ]
                        },
                        {
                          featureType: "poi.park",
                          elementType: "labels.text.fill",
                          stylers: [
                            {
                              color: "#9e9e9e"
                            }
                          ]
                        },
                        {
                          featureType: "road",
                          elementType: "geometry",
                          stylers: [
                            {
                              color: "#ffffff"
                            }
                          ]
                        },
                        {
                          featureType: "road",
                          elementType: "geometry.stroke",
                          stylers: [
                            {
                              color: "#000000"
                            }
                          ]
                        },
                        {
                          featureType: "road.arterial",
                          elementType: "labels.text.fill",
                          stylers: [
                            {
                              color: "#757575"
                            }
                          ]
                        },
                        {
                          featureType: "road.highway",
                          elementType: "geometry",
                          stylers: [
                            {
                              color: "#dadada"
                            }
                          ]
                        },
                        {
                          featureType: "road.highway",
                          elementType: "labels.text.fill",
                          stylers: [
                            {
                              color: "#616161"
                            }
                          ]
                        },
                        {
                          featureType: "road.local",
                          elementType: "labels.text.fill",
                          stylers: [
                            {
                              color: "#9e9e9e"
                            }
                          ]
                        },
                        {
                          featureType: "transit.line",
                          elementType: "geometry",
                          stylers: [
                            {
                              color: "#e5e5e5"
                            }
                          ]
                        },
                        {
                          featureType: "transit.station",
                          elementType: "geometry",
                          stylers: [
                            {
                              color: "#eeeeee"
                            }
                          ]
                        },
                        {
                          featureType: "water",
                          elementType: "geometry",
                          stylers: [
                            {
                              color: "#c9c9c9"
                            }
                          ]
                        },
                        {
                          featureType: "water",
                          elementType: "labels.text.fill",
                          stylers: [
                            {
                              color: "#9e9e9e"
                            }
                          ]
                        }
                      ]
                    }}
                  >
                    {/* <AnyReactComponent
                    lat={59.955413}
                    lng={30.337844}
                    text="My Marker"
                  /> */}
                    {this.state.assets.map(asset => {
                      if (asset.location) {
                        return (
                          <Marker
                            data={{
                              reg_no: asset.reg_no,
                              manager: asset.managerDetails
                            }}
                            lat={asset.location.coordinates[0]}
                            lng={asset.location.coordinates[1]}
                            type={
                              asset.categoryDetails
                                ? asset.categoryDetails
                                : null
                            }
                            setFocus={(center, zoom) => {
                              this.setState({
                                center,
                                zoom: zoom
                              });
                            }}
                          />
                        );
                      }
                      return false;
                    })}
                  </GoogleMapReact>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      );
  }
}

export default MapView;
