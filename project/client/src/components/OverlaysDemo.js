import React, { Component, useState } from "react";
// import { hot } from "react-hot-loader/root";
import {
  Viewer,
  Entity,
  PathGraphics,
  PointGraphics,
  Polyline,
  LabelGraphics,
  PolylineGraphics,
  PolylineCollection,
  ScreenSpaceCameraController,
  EntityDescription,
  ScreenSpaceEventHandler,
  RectangleGraphics,
  GeoJsonDataSource,
  KmlDataSource,
  Cesium3DTileset,
  Camera,
  CameraFlyTo,
  CustomDataSource,
  PolygonGraphics,
  ScreenSpaceEvent,
  EntityStaticDescription,
  Label,
} from "resium";
import {
  Cartesian3,
  Cartesian2,
  PolylineDashMaterialProperty,
  WallGraphics,
  CesiumMath,
  Rectangle,
  createWorldTerrain,
  Color,
  Transforms,
} from "cesium";
// import { IonResource, Rectangle, CesiumMath, PolylineDashMaterialProperty, Transforms, ScreenSpaceEventType, KeyboardEventModifier} from "cesium";
import { Growl } from "primereact/growl";
import { Button } from "primereact/button";
import { Messages } from "primereact/messages";
import { Dialog } from "primereact/dialog";
import { Inplace, InplaceDisplay, InplaceContent } from "primereact/inplace";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const data = {
  type: "Feature",
  properties: {
    name: "Coors Field",
    amenity: "Baseball Stadium",
    popupContent: "This is where the Rockies play!",
  },
  geometry: {
    type: "Point",
    coordinates: [-104.99404, 39.75621],
  },
};

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

const positions = [
  new Cartesian3(-75, 35, 0),
  new Cartesian3(-125, 35, 0),
  new Cartesian3(-125, 135, 0),
];
const center = Cartesian3.fromDegrees(-75.59777, 40.03883);

export class OverlaysDemo extends Component {
  printDocument() {
    const input = document.getElementById("viewer");
    const pdf = new jsPDF();
    if (pdf) {
      html2canvas(input, {
        useCORS: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        console.log(imgData); //Maybe blank, maybe full image, maybe half of image
        pdf.addImage(imgData, "PNG", 10, 10, 200, 200);
        pdf.save("download.pdf");
      });
    }
  }

  savePDF() {
    const printArea = document.getElementById("viewer");

    html2canvas(printArea).then((canvas) => {
      const dataURL = canvas.toDataURL();
      const pdf = new jsPDF();

      pdf.addImage(dataURL, "JPEG", 20, 20, 180, 160);

      pdf.save("saved.pdf");
    });
  }

  componentDidMount() {
    this.getLocation();
    const { viewer } = this;
    if (viewer) {
    }
    this.state.userData.type = "Features";
    this.state.userData.properties.name = "Your Home";
    this.state.userData.properties.amenity = "Home";
    this.state.userData.properties.popupContent = "This is your home";
    this.state.userData.geometry.type = "Point";
    this.state.userData.geometry.coordinates = [
      this.state.longitude,
      this.state.latitude,
    ];
  }

  getLocationFromScreenXY = (x, y) => {
    const scene = this.viewer.scene;
    if (!scene) return;
    const ellipsoid = scene.globe.ellipsoid;
    const cartesian = scene.camera.pickEllipsoid(
      new Cartesian2(x, y),
      ellipsoid
    );
    if (!cartesian) return;
    const { latitude, longitude, height } = ellipsoid.cartesianToCartographic(
      cartesian
    );
    return { latitude, longitude, height };
  };

  radiansToDegrees = (radians) => {
    let pi = Math.PI;
    return radians * (180 / pi);
  };

  constructor(props) {
    super(props);
    this.cesium = React.createRef();
    this.state = {
      latitude: null,
      longitude: null,
      pointPositions: [],
      cartesian3dPositions: [],
      canDrawLine: false,
      userData: {
        type: null,
        properties: {
          name: null,
          amenity: null,
          popupContent: null,
        },
        geometry: {
          type: null,
          coordinates: [],
        },
      },
      displayPosition: false,
      position: "topright",
      height: 0.0,
      width: 0.0,
    };
    this.showInfo = this.showInfo.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.action = this.action.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onHide = this.onHide.bind(this);
    this.calculateWidthHeight = this.calculateWidthHeight.bind(this);
    this.deg2rad = this.deg2rad.bind(this);
    this.getDistanceFromLatLonInM = this.getDistanceFromLatLonInM.bind(this);
    this.savePDF = this.savePDF.bind(this);
    this.printDocument = this.printDocument.bind(this);
  }

  action(label, evt) {
    if (this.state.pointPositions.length >= 3) {
      this.state.canDrawLine = true;
      this.calculateWidthHeight();
    }

    let coords = this.getLocationFromScreenXY(evt.position.x, evt.position.y);
    let lon = this.radiansToDegrees(coords.longitude);
    let lat = this.radiansToDegrees(coords.latitude);

    let newCoord = new Cartesian3(lon, lat, 0);
    this.state.cartesian3dPositions.push(newCoord);
    console.log(this.state.cartesian3dPositions);

    this.state.pointPositions.push({
      x: Number(lon),
      y: Number(lat),
    });
    console.log(this.state.pointPositions);
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.getCoordinates,
        this.error,
        options
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  getCoordinates(position) {
    this.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  }

  error() {
    console.log("Heyoooo");
  }

  showInfo() {
    let msg = {
      severity: "info",
      summary: "Info Message",
      detail:
        "While picking your roof you must first mark up left then up right, then down right and then down left",
    };
    this.growl.show(msg);
    this.messages.show(msg);
  }

  isPointsClickedEmpty() {
    if (this.state.pointPositions.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  onClick(name, position) {
    this.state.displayPosition = true;
    // this.state.position = 'topright'
  }

  onHide(name) {
    this.state.displayPosition = false;
  }

  renderFooter(name) {
    return (
      <div>
        <Button
          label="Yes"
          icon="pi pi-check"
          onClick={() => this.onHide(name)}
        />
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => this.onHide(name)}
          className="p-button-secondary"
        />
      </div>
    );
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d * 1000;
  }

  calculateWidthHeight() {
    this.state.width = this.getDistanceFromLatLonInM(
      this.state.pointPositions[0].x,
      this.state.pointPositions[0].y,
      this.state.pointPositions[1].x,
      this.state.pointPositions[1].y
    );
    this.state.height = this.getDistanceFromLatLonInM(
      this.state.pointPositions[1].x,
      this.state.pointPositions[1].y,
      this.state.pointPositions[2].x,
      this.state.pointPositions[2].y
    );
  }

  render() {
    return (
      <div id="viewer" className="p-grid p-dir-col p-fluid">
        <div className="p-col card">
          <h1>Find Your Address</h1>
          <p1>
            Enter your address from right upper toolbar after picking search
            button.
          </p1>
          <Button
            onClick={this.showInfo}
            label="Help"
            className="p-button-info"
            style={{ width: "10em", marginLeft: "69em" }}
          />
        </div>

        <div className="p-grid p-fluid dashboard">
          <div className="p-col-12 p-lg-4">
            <div className="card summary">
              <span className="title">Your Latitude</span>
              <span className="detail">In Radian Degrees</span>
              <span className="count visitors">{this.state.latitude}</span>
            </div>
          </div>
          <div className="p-col-12 p-lg-4">
            <div className="card summary">
              <span className="title">Your Longitude</span>
              <span className="detail">In Radian Degrees</span>
              <span className="count purchases">{this.state.longitude}</span>
            </div>
          </div>
          <div className="p-col-12 p-lg-4">
            <div className="card summary">
              <span className="title">Your Address</span>
              <span className="detail">Turkey</span>
              <span className="count revenue">Ankara</span>
            </div>
          </div>
        </div>

        <Messages ref={(el) => (this.messages = el)} />
        <Growl ref={(el) => (this.growl = el)} style={{ marginTop: "75px" }} />

        <div className="p-col p-fluid p-card">
          <Viewer
            onClick={(evt) => this.action("Left Click", evt)}
            ref={(e) => {
              this.viewer = e ? e.cesiumElement : null;
            }}
          >
            {this.state.pointPositions.map((item, index) => {
              console.log(typeof item.x);
              return (
                <Entity
                  isPointsClickedEmpty={false}
                  key={index}
                  name="test"
                  description="test!!"
                  position={Cartesian3.fromDegrees(item.x, item.y, 0)}
                  point={{ pixelSize: 10, color: Color.ORANGERED }}
                />
              );
            })}

            {this.state.canDrawLine === true && (
              <Entity name="PolylineGraphics" description="PolylineGraphics!!">
                <PolylineGraphics
                  positions={Cartesian3.fromDegreesArrayHeights([
                    this.state.pointPositions[0].x,
                    this.state.pointPositions[0].y,
                    0,
                    this.state.pointPositions[1].x,
                    this.state.pointPositions[1].y,
                    0,
                    this.state.pointPositions[2].x,
                    this.state.pointPositions[2].y,
                    0,
                    this.state.pointPositions[3].x,
                    this.state.pointPositions[3].y,
                    0,
                    this.state.pointPositions[0].x,
                    this.state.pointPositions[0].y,
                    0,
                  ])}
                  width={3}
                  material={
                    new PolylineDashMaterialProperty({
                      color: Color.YELLOW,
                    })
                  }
                />
              </Entity>
            )}
          </Viewer>
          {/* <Button label="TopRight" icon="pi pi-arrow-down" onClick={() => this.onClick()} className="p-button-warning" /> */}
        </div>

        <div className="p-col card">
          <Card title="Your Roof Results" subTitle="Details">
            <div className="p-grid p-fluid dashboard">
              <div className="p-col-12 p-md-6 p-xl-3">
                <div className="highlight-box">
                  <div
                    className="initials"
                    style={{ backgroundColor: "#007be5", color: "#00448f" }}
                  >
                    <span>RH</span>
                  </div>
                  <div className="highlight-details ">
                    <i className="pi pi-search" />
                    <span>Roof Height</span>
                    <span className="count">
                      {this.state.height.toFixed(3)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-col-12 p-md-6 p-xl-3">
                <div className="highlight-box">
                  <div
                    className="initials"
                    style={{ backgroundColor: "#ef6262", color: "#a83d3b" }}
                  >
                    <span>RW</span>
                  </div>
                  <div className="highlight-details ">
                    <i className="pi pi-search" />
                    <span>Roof Width</span>
                    <span className="count">{this.state.width.toFixed(3)}</span>
                  </div>
                </div>
              </div>
              <div className="p-col-12 p-md-6 p-xl-3">
                <div className="highlight-box">
                  <div
                    className="initials"
                    style={{ backgroundColor: "#20d077", color: "#038d4a" }}
                  >
                    <span>RA</span>
                  </div>
                  <div className="highlight-details ">
                    <i className="pi pi-search" />
                    <span>Roof Area</span>
                    <span className="count">
                      {(this.state.width * this.state.height).toFixed(3)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-col-12 p-md-6 p-xl-3">
                <div className="highlight-box">
                  <div
                    className="initials"
                    style={{ backgroundColor: "#f9c851", color: "#b58c2b" }}
                  >
                    <span>RA</span>
                  </div>
                  <div className="highlight-details ">
                    <i className="pi pi-search" />
                    <span>Roof Angle</span>
                    <span className="count">30</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          {this.state.canDrawLine === true && (
            <Button onClick={this.printDocument} label="capture"></Button>
          )}
        </div>
      </div>
    );
  }
}
