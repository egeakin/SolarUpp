import React, { Component, useState } from "react";
// import { hot } from "react-hot-loader/root";
import withStyles from "@material-ui/core/styles/withStyles";
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
  Cesium,
  Ion,
  BingMapsApi,
  BingMapsStyle,
  BingMapsImageryProvider,
  Rectangle,
  createWorldTerrain,
  Color,
  Transforms,
  Geometry,
} from "cesium";
import { Growl } from "primereact/growl";
import { Button } from "primereact/button";
import { Messages } from "primereact/messages";
import { Dialog } from "primereact/dialog";
import { Inplace, InplaceDisplay, InplaceContent } from "primereact/inplace";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
// import { Map, GoogleMap, Polygon, GoogleApiWrapper, GoogleAPI, withScriptjs, withGoogleMap, Marker} from "google-maps-react";
import { animateScroll } from "react-scroll";
import { Steps } from "primereact/steps";
import { Link } from "react-router-dom";
import { Panel } from "primereact/panel";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import { Tree } from "primereact/tree";
import { SelectButton } from "primereact/selectbutton";
import { SplitButton } from "primereact/splitbutton";
import { Toolbar } from "primereact/toolbar";
import PropTypes from "prop-types";
import html2canvas from "html2canvas";
import GoogleMapReact from "google-map-react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Polygon,
} from "react-google-maps";
import { compose, withProps } from "recompose";
import { SphericalUtil, PolyUtil } from "node-geometry-library";

// redux
import { connect } from "react-redux";
import axios from "axios";
Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiOTNjYjIwOC00YmQxLTRiZTAtYTFlNi03MjQ1NWMzMmE1YjkiLCJpZCI6MTkyMTIsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODkyOTM3NTZ9.Rx7wwt26JrRXp_upYCawvQDurrHOIn2ddb109kXNv5k";

const styles = {
  card: {
    display: "flex",
    marginBottom: 20,
  },
  image: {
    minWidth: 200,
  },
  content: {
    padding: 25,
    objectFit: "cover",
  },
};

const mapStyles = {
  width: "80%",
  height: "100%",
};

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

const triCoords = [
  { lat: 39.88389095569122, lng: 32.755354254001226 },
  { lat: 39.883921163078256, lng: 32.75670766092878 },
  { lat: 39.88351997703406, lng: 32.756732027785546 },
  { lat: 39.88347736859615, lng: 32.75538975962977 },
];

const items = [
  { label: "Find Address" },
  { label: "Feasibility Study" },
  { label: "Maintenance" },
  { label: "Track System" },
];

const MyMapComponent = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap
      defaultZoom={30}
      defaultCenter={{ lat: triCoords[0].lat, lng: triCoords[0].lng }}
    >
      <Polygon path={triCoords} />
      {props.isMarkerShown && (
        <Marker position={{ lat: triCoords[0].lat, lng: triCoords[0].lng }} />
      )}
    </GoogleMap>
  ))
);

export class FindAddress extends Component {
  //COMPONENTDIDMOUNT
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

  //CONSTRUCTOR
  constructor(props) {
    super(props);
    this.cesium = React.createRef();
    this.state = {
      latitude: null,
      longitude: null,
      screenPositions: [],
      pointPositions: [],
      pointPositionsX: [],
      pointPositionsY: [],
      cartesian3dPositions: [],
      cartesian3dPositionsX: [],
      cartesian3dPositionsY: [],
      canDrawLine: false,
      google: this.props,
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
      drawedPositions: [],
      position: "topright",
      height: 0.0,
      width: 0.0,
      area: 0.0,
      circumference: 0.0,
      roodImage: null,
      radioValue: null,
      value: null,
      selectedType: null,
      roofLatitude: 0.0,
      roofLongitude: 0.0,
      edge: null,
      types: [
        { label: "Suburban Estate", value: "Suburban Estate" },
        { label: "Apartment", value: "Apartment" },
        { label: "Industrial Estate", value: "Industrial Estate" },
      ],
    };
    this.showInfo = this.showInfo.bind(this);
    this.addRoof = this.addRoof.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.action = this.action.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onHide = this.onHide.bind(this);
    this.calculateCircumference = this.calculateCircumference.bind(this);
    this.deg2rad = this.deg2rad.bind(this);
    this.getDistanceFromLatLonInM = this.getDistanceFromLatLonInM.bind(this);
    this.polygonArea = this.polygonArea.bind(this);
  }

  //FUNCTIONS
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

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  action(label, evt) {
    this.state.screenPositions.push({
      x: evt.position.x,
      y: evt.position.y,
    });
    let coords = this.getLocationFromScreenXY(evt.position.x, evt.position.y);
    let lon = this.radiansToDegrees(coords.longitude);
    let lat = this.radiansToDegrees(coords.latitude);

    this.state.cartesian3dPositionsX.push(lon);
    this.state.cartesian3dPositionsY.push(lat);

    let newCoord = new Cartesian3(lon, lat, 0);
    this.state.cartesian3dPositions.push(newCoord);
    console.log(this.state.cartesian3dPositions);

    this.state.pointPositions.push({
      x: Number(lon),
      y: Number(lat),
    });
    console.log(this.state.pointPositions);
    this.state.pointPositionsX.push(Number(lon));
    this.state.pointPositionsY.push(Number(lat));
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

  polygonArea(X, Y, numPoints) {
    let area = 0; // Accumulates area
    let j = numPoints - 1;
    for (let i = 0; i < numPoints; i++) {
      area += (X[j] + X[i]) * (Y[j] - Y[i]);
      j = i; //j is previous vertex to i
    }
    return (area / 2) * 10000000000;
  }

  calculateCircumference() {
    for (let i = 1; i < this.state.cartesian3dPositions.length; i++) {
      this.state.circumference =
        this.state.circumference +
        this.getDistanceFromLatLonInM(
          this.state.pointPositions[i - 1].x,
          this.state.pointPositions[i - 1].y,
          this.state.pointPositions[i].x,
          this.state.pointPositions[i].y
        );
    }
    this.state.circumference =
      this.state.circumference +
      this.getDistanceFromLatLonInM(
        this.state.pointPositions[0].x,
        this.state.pointPositions[0].y,
        this.state.pointPositions[this.state.pointPositions.length - 1].x,
        this.state.pointPositions[this.state.pointPositions.length - 1].y
      );
  }

  drawingIsFinished() {
    if (this.state.pointPositions.length > 3) {
      this.setState({ canDrawLine: true });
      this.calculateCircumference();
      for (let i = 0; i < this.state.pointPositions.length; i++) {
        this.state.drawedPositions.push(
          this.state.pointPositions[i].x,
          this.state.pointPositions[i].y,
          0
        );
      }
      this.state.drawedPositions.push(
        this.state.pointPositions[0].x,
        this.state.pointPositions[0].y,
        0
      );
      // this.state.area = this.polygonArea(
      //   this.state.pointPositionsX,
      //   this.state.pointPositionsY,
      //   this.state.pointPositions.length
      // );
      this.convertGoogleFormat(); //This calculates this.state.area
      console.log(this.state.area);
      this.state.roofLatitude = this.state.pointPositions[0].x;
      this.state.roofLongitude = this.state.pointPositions[0].y;

      this.viewer.render();
      this.state.roofImage = this.viewer.canvas.toDataURL();
      console.log(this.state.roofImage);
      animateScroll.scrollToBottom();
    }
  }

  handleSaveButton() {
    animateScroll.scrollMore(480);
  }

  deletePlan() {
    this.state.pointPositions = [];
    this.state.pointPositionsX = [];
    this.state.pointPositionsY = [];
    this.state.cartesian3dPositions = [];
    this.state.cartesian3dPositionsX = [];
    this.state.cartesian3dPositionsY = [];
    this.state.drawedPositions = [];
    this.state.canDrawLine = false;
    this.state.circumference = 0.0;
    this.state.area = 0.0;
    this.state.roofLatitude = 0.0;
    this.state.roofLongitude = 0.0;
  }

  addRoof() {
    function dataURItoBlob(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(",")[0].indexOf("base64") >= 0)
        byteString = atob(dataURI.split(",")[1]);
      else byteString = unescape(dataURI.split(",")[1]);

      // separate out the mime component
      var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ia], { type: mimeString });
    }

    var blob = dataURItoBlob(this.state.roofImage);
    console.log(blob);
    blob = new File([blob], "image.png", {
      type: "image/png",
      lastModified: Date.now(),
    });
    //blob = blob.slice(0, blob.size, "image/png");
    //console.log(blob);
    var formData = new FormData(document.forms[0]);
    formData.append("canvasImage", blob);

    var ymax = this.state.screenPositions[0].y;
    var ymin = this.state.screenPositions[0].y;

    var xmax = this.state.screenPositions[0].x;
    var xmin = this.state.screenPositions[0].x;

    for (var i = 1; i < this.state.screenPositions.length; i++) {
      if (this.state.screenPositions[i].y < ymin) {
        ymin = this.state.screenPositions[i].y;
      }
      if (this.state.screenPositions[i].y > ymax) {
        ymax = this.state.screenPositions[i].y;
      }
      if (this.state.screenPositions[i].x < xmin) {
        xmin = this.state.screenPositions[i].x;
      }
      if (this.state.screenPositions[i].x > xmax) {
        xmax = this.state.screenPositions[i].x;
      }
    }

    var positions = {
      x: xmin,
      y: ymin,
      width: xmax - xmin,
      height: ymax - ymin,
    };

    console.log(positions);

    let roofInfo = {
      roofCoordinates: this.state.pointPositions,
      roofCircumference: this.state.circumference,
      roofArea: this.state.area,
      buildingName: this.state.buildingName,
      buildingType: this.state.selectedType,
      screenPositions: positions,
    };

    console.log(roofInfo);

    axios
      .post("/addRoof", roofInfo)
      .then((res) => {
        const txt = new Text("roofId");
        console.log(txt);
        console.log(res.data.roofId);
        formData.append("roofId", res.data.roofId);
        axios
          .post("uploadRoofImage", formData)
          .then((res) => {
            window.location = "#/feasibility";
            window.location.reload();
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  convertGoogleFormat() {
    let convertedCoordinates = [];
    for (let i = 0; i < this.state.pointPositions.length; i++) {
      convertedCoordinates.push({
        lat: this.state.pointPositions[i].y,
        lng: this.state.pointPositions[i].x,
      });
    }
    this.state.area = SphericalUtil.computeArea(convertedCoordinates);
  }

  render() {
    console.log(this.state.screenPositions);

    return (
      <div className="p-grid p-dir-col p-fluid">
        <div className="card card-w-title">
          <h1>Find Your Address</h1>
          <p3>
            Enter your address from right upper toolbar after picking search
            button.
          </p3>
        </div>

        <div className="p-grid p-fluid dashboard">
          <div className="p-col-12 p-lg-4">
            <div className="card summary">
              <span className="title">Your Latitude</span>
              <span className="detail">In Degrees</span>
              <span className="count visitors">{this.state.latitude}</span>
            </div>
          </div>
          <div className="p-col-12 p-lg-4">
            <div className="card summary">
              <span className="title">Your Longitude</span>
              <span className="detail">In Degrees</span>
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

        <div className="grid p-dir-col p-fluid">
          <div className="card card-w-title">
            <h1>Building Info</h1>
            <br></br>

            <div className="p-grid p-justify-end">
              <div className="p-col-12 p-md-2">
                <Button label="Building Name:"></Button>
              </div>
              <div className="p-col-12 p-md-4">
                <InputText
                  value={this.state.value}
                  onChange={(e) =>
                    this.setState({ buildingName: e.target.value })
                  }
                />
              </div>
              <div className="p-col-12 p-md-2">
                <Button label="Building Type:"></Button>
              </div>
              <div className="p-col-12 p-md-4">
                <SelectButton
                  value={this.state.selectedType}
                  options={this.state.types}
                  onChange={(event) =>
                    this.setState({ selectedType: event.value })
                  }
                />
              </div>
              <div className="p-justify-end">
                <br></br>
                <Button
                  style={{ width: "6em", marginRight: ".25em" }}
                  onClick={() => this.handleSaveButton()}
                  label="Save"
                  icon="pi pi-check"
                />
              </div>
            </div>
          </div>
        </div>

        <Messages ref={(el) => (this.messages = el)} />
        <Growl ref={(el) => (this.growl = el)} style={{ marginTop: "75px" }} />

        <div className="p-col p-fluid card card-w-title">
          <h1>Draw Your Roof</h1>

          <div className="p-col p-grid p-justify-end">
            <Button
              style={{ width: "9em", marginRight: ".25em" }}
              label="Help"
              size="10em"
              icon="pi pi-search"
              onClick={() => this.showInfo()}
              className="p-button p-button-info"
            />
            <Button
              style={{ width: "9em", marginRight: ".25em" }}
              label="Finish Plan"
              size="10em"
              icon="pi pi-check"
              onClick={() => this.drawingIsFinished()}
              className="p-button p-button-success"
            />
            <Button
              style={{ width: "9em" }}
              label="Delete Plan"
              size="10em"
              icon="pi pi-times"
              onClick={() => this.deletePlan()}
              className="p-button p-button-danger"
            />
          </div>

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
            {console.log(this.state.canDrawLine)}
            {this.state.canDrawLine && (
              <Entity name="PolylineGraphics" description="PolylineGraphics!!">
                <PolylineGraphics
                  positions={Cartesian3.fromDegreesArrayHeights(
                    this.state.drawedPositions
                  )}
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

          <div className="p-col card grid">
            <Card title="Your Roof Results" subTitle="Details">
              <div className="p-grid p-fluid dashboard">
                <div className="p-col-12 p-md-6 p-xl-3">
                  <div className="highlight-box">
                    <div
                      className="initials"
                      style={{ backgroundColor: "#007be5", color: "#00448f" }}
                    >
                      <span>RC</span>
                    </div>
                    <div className="highlight-details ">
                      <i className="pi pi-search" />
                      <span>Circumference</span>
                      <span className="count">
                        {this.state.circumference.toFixed(1)}
                      </span>
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
                        {this.state.area.toFixed(1)}
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
                      <span>RL</span>
                    </div>
                    <div className="highlight-details ">
                      <i className="pi pi-search" />
                      <span>Roof Latitude</span>
                      {
                        <span className="count">
                          {this.state.roofLatitude.toFixed(1)}
                        </span>
                      }
                    </div>
                  </div>
                </div>
                <div className="p-col-12 p-md-6 p-xl-3">
                  <div className="highlight-box">
                    <div
                      className="initials"
                      style={{ backgroundColor: "#ef6262", color: "#a83d3b" }}
                    >
                      <span>RL</span>
                    </div>
                    <div className="highlight-details ">
                      <i className="pi pi-search" />
                      <span>Roof Longitude</span>
                      <span>
                        {
                          <span className="count">
                            {this.state.roofLongitude.toFixed(1)}
                          </span>
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="p-col p-fluid p-card p-justify-end">
              <Steps model={items}></Steps>
              <Button
                onClick={this.addRoof}
                label="Proceed"
                icon="pi pi-arrow-right"
                style={{ marginLeft: "85em", width: "10em" }}
                className="p-button-raised p-button-rounded p-button-warning"
              />
            </div>

            <div>
              {/* <MyMapComponent
                  isMarkerShown
                  googleMapURL=yourAPI
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={<div style={{ height: `400px` }} />}
                  mapElement={<div style={{ height: `100%` }} />}
                >
                </MyMapComponent> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FindAddress;
