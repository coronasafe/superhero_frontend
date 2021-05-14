import React, { Component } from "react";
import "./marker.css";
class Marker extends Component {
  state = {
    popup: false
  };
  render() {
    let data = this.props.data;
    // console.log("Marker Data", data);
    let img;
    switch (this.props.type.group) {
      case 0: {
        switch (this.props.type.title) {
          case "Ambulance - Auto Rickshaw":
            img = require("./rickshaw.png");
            break;
          case "Ambulance - Taxi":
            img = require("./taxi.png");
            break;
          case "Ambulance - Single Chamber":
            img = require("./ambulance-single.png");
            break;
          case "Ambulance - Double Chamber (Non-critical)":
            img = require("./ambulance-double.png");
            break;
          case "Ambulance - Critical Care":
            img = require("./ambulance.png");
            break;
          default:
            img = require("./ambulance-single.png");
            break;
        }
        break;
      }
      case 1: {
        img = require("./food_truck.png");
        break;
      }
      case 2: {
        img = require("./medicine.png");
        break;
      }
      default: {
        img = require("./ambulance.png");
      }
    }
    return (
      <div
        className="MarkerWrapper"
        onMouseLeave={e => {
          this.setState({ popup: false });
        }}
        onClick={() => {
          let center = { lat: this.props.lat, lng: this.props.lng };
          let zoom = 12;
          this.props.setFocus(center, zoom);
        }}
      >
        <div
          className="MapMarkerIcon"
          onMouseEnter={e => {
            this.setState({ popup: true });
          }}
        >
          <img
            alt="icon"
            src={this.props.src ? this.props.src : img}
            style={{ height: "30px", width: "30px" }}
          />
        </div>
        {/* <div className="MapMarkerLabel">{`${data.reg_no}`}</div> */}
        {this.state.popup && (
          <div className="MapMarkerOverlay">
            <div>Reg No: {data.reg_no}</div>
            <div>Name: {data.manager[0].name}</div>
            <div>Contact No: {data.manager[0].phone}</div>
          </div>
        )}
      </div>
    );
  }
}

// freepik attribution to be added for rickshaw icon
// <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

export default Marker;
