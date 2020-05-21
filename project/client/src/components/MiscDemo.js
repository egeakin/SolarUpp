import React, { Component } from "react";
import { FileUpload } from "primereact/fileupload";
import { Growl } from "primereact/growl";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { Messages } from "primereact/messages";
import {
  Viewer,
  Entity,
  PointGraphics,
  EntityDescription,
  GeoJsonDataSource,
  KmlDataSource,
  Cesium3DTileset,
  Camera,
  CameraFlyTo,
  CustomDataSource,
} from "resium";
import { Cartesian3, createWorldTerrain, Color } from "cesium";

const key = "82005d27a116c2880c8f0fcb866998a0";
const KELVIN = 273;

const styles = (theme) => ({
  ...styles,
});

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE

export class MiscDemo extends Component {
  componentDidMount() {
    this.getLocation();
    this.interval = setInterval(() => {
      let val = this.state.value;
      val += Math.floor(Math.random() * 10) + 1;
      if (val >= 100) {
        val = 100;
        clearInterval(this.interval);
      }
      this.setState({ value: val });
    }, 2000);
  }

  constructor() {
    super();
    this.state = {
      value: 0,
      degree: "C",
      notification: ["", "", "", "", ""],
      temperature: ["", "", "", "", ""],
      description: ["", "", "", "", ""],
      iconId: "assets/layout/WeatherIcons/unknown.png",
      city: ["", "", "", "", ""],
      country: ["", "", "", "", ""],
      clouds: ["", "", "", "", ""],
      latitude: null,
      longitude: null,
      options: {
        enableHighAccuracy: true,
        timeout: 5000,
        maxiumumAge: 0,
      },
    };

    this.onUpload = this.onUpload.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.error = this.error.bind(this);
  }

  onUpload() {
    this.growl.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
    });
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.getCoordinates,
        this.error,
        this.state.options
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  getCoordinates(position) {
    this.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      notification: "",
    });
    let api = `http://api.openweathermap.org/data/2.5/forecast?lat=${this.state.latitude}&lon=${this.state.longitude}&appid=${key}`;
    console.log(this.state.latitude);
    console.log(this.state.longitude);
    console.log(
      `http://api.openweathermap.org/data/2.5/forecast?lat=${this.state.latitude}&lon=${this.state.longitude}&appid=${key}`
    );
    fetch(api)
      .then((response) => {
        let data = response.json();
        console.log(data);
        return data;
      })
      .then((data) => {
        this.setState({
          temperature: [
            Math.floor(data.list[0].main.temp - KELVIN),
            Math.floor(data.list[8].main.temp - KELVIN),
            Math.floor(data.list[16].main.temp - KELVIN),
            Math.floor(data.list[24].main.temp - KELVIN),
            Math.floor(data.list[32].main.temp - KELVIN),
          ],
          description: [
            data.list[0].weather[0].description,
            data.list[8].weather[0].description,
            data.list[16].weather[0].description,
            data.list[24].weather[0].description,
            data.list[32].weather[0].description,
          ],
          iconId: [
            `assets/layout/WeatherIcons/${data.list[0].weather[0].icon}.png`,
            `assets/layout/WeatherIcons/${data.list[8].weather[0].icon}.png`,
            `assets/layout/WeatherIcons/${data.list[16].weather[0].icon}.png`,
            `assets/layout/WeatherIcons/${data.list[24].weather[0].icon}.png`,
            `assets/layout/WeatherIcons/${data.list[32].weather[0].icon}.png`,
          ],
          clouds: [
            data.list[0].clouds.all,
            data.list[8].clouds.all,
            data.list[16].clouds.all,
            data.list[24].clouds.all,
            data.list[32].clouds.all,
          ],
          city: data.city.name,
          country: data.city.country,
        });
      });
  }

  error() {
    this.setState({ notification: "You need to enable location services" });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className="p-grid">
        <div className="p-col p-fluid p-card">
          <h1>Find Your Address</h1>
          <p>
            Enter your address from right upper toolbar after picking search
            button.
          </p>
          <Button
            onClick={this.showInfo}
            label="Help"
            className="p-button-info"
            style={{ width: "10em", marginLeft: "42em" }}
          />
          <p>Latitude: {Number(this.state.latitude)}</p>
          <p>Longitude: {Number(this.state.longitude)}</p>
          <Button
            onClick={this.getLocation}
            style={{ width: "15em" }}
            label="Get Your Coordinates"
          ></Button>
        </div>

        <Messages ref={(el) => (this.messages = el)} />
        <Growl ref={(el) => (this.growl = el)} style={{ marginTop: "75px" }} />

        <div className="p-col p-fluid p-card">
          <Viewer>
            <CustomDataSource name="custom">
              <Entity
                name="Your Current Location"
                description="This is your current location."
                position={Cartesian3.fromDegrees(
                  Number(this.state.longitude),
                  Number(this.state.latitude),
                  1000
                )}
                point={{ pixelSize: 10, color: Color.RED }}
              />
            </CustomDataSource>
            {/* <CameraFlyTo duration={5} destination={Cartesian3.fromDegrees(Number(this.state.longitude), Number(this.state.latitude), 1000)} /> */}
          </Viewer>
        </div>
        <div className="p-col-12">
          <div className="card">
            <h1>Upload</h1>
            <Growl ref={(el) => (this.growl = el)} />

            <FileUpload
              name="demo[]"
              url="./upload.php"
              onUpload={this.onUpload}
              multiple={true}
              accept="image/*"
              maxFileSize={1000000}
            />
          </div>
        </div>

        <div className="p-col-12">
          <div className="card">
            <h1>ProgressBar</h1>
            <ProgressBar value={this.state.value} />
          </div>
        </div>

        <div className="p-grid p-nogutter">
          <div className="containerr">
            <div className="app-title">
              <p>Today</p>
            </div>
            <div className="notification p" align="center">
              {this.state.notification}
            </div>
            <div className="whether-container">
              <div className="whether-icon" align="center">
                <img src={this.state.iconId[0]} alt=""></img>
              </div>
              <div align="center">
                {this.state.temperature[0]}°<span>{this.state.degree}</span>
              </div>
              <div className="temperature-value" />
              <div align="center">
                Total clouds <span>{this.state.clouds[0]}</span>
              </div>
              <div className="temperature-description">
                <p>{this.state.description[0]}</p>
              </div>
              <div className="location">
                <p>
                  {this.state.city}, {this.state.country}{" "}
                </p>
              </div>
            </div>
          </div>

          <div className="containerr">
            <div className="app-title">
              <p>Tomorrow</p>
            </div>
            <div className="notification p" align="center">
              {this.state.notification}
            </div>
            <div className="whether-container">
              <div className="whether-icon" align="center">
                <img src={this.state.iconId[1]} alt=""></img>
              </div>
              <div align="center">
                {this.state.temperature[1]}°<span>{this.state.degree}</span>
              </div>
              <div className="temperature-value" />
              <div align="center">
                Total clouds <span>{this.state.clouds[1]}</span>
              </div>
              <div className="temperature-description">
                <p>{this.state.description[1]}</p>
              </div>
              <div className="location">
                <p>
                  {this.state.city}, {this.state.country}{" "}
                </p>
              </div>
            </div>
          </div>

          <div className="containerr">
            <div className="app-title">
              <p>Two days later</p>
            </div>
            <div className="notification p" align="center">
              {this.state.notification}
            </div>
            <div className="whether-container">
              <div className="whether-icon" align="center">
                <img src={this.state.iconId[2]} alt=""></img>
              </div>
              <div align="center">
                {this.state.temperature[2]}°<span>{this.state.degree}</span>
              </div>
              <div className="temperature-value" />
              <div align="center">
                Total clouds <span>{this.state.clouds[2]}</span>
              </div>
              <div className="temperature-description">
                <p>{this.state.description[2]}</p>
              </div>
              <div className="location">
                <p>
                  {this.state.city}, {this.state.country}{" "}
                </p>
              </div>
            </div>
          </div>

          <div className="containerr">
            <div className="app-title">
              <p>Three days later</p>
            </div>
            <div className="notification p" align="center">
              {this.state.notification}
            </div>
            <div className="whether-container">
              <div className="whether-icon" align="center">
                <img src={this.state.iconId[3]} alt=""></img>
              </div>
              <div align="center">
                {this.state.temperature[3]}°<span>{this.state.degree}</span>
              </div>
              <div className="temperature-value" />
              <div align="center">
                Total clouds <span>{this.state.clouds[3]}</span>
              </div>
              <div className="temperature-description">
                <p>{this.state.description[3]}</p>
              </div>
              <div className="location">
                <p>
                  {this.state.city}, {this.state.country}{" "}
                </p>
              </div>
            </div>
          </div>

          <div className="containerr">
            <div className="app-title" align="center">
              <p>Four Days Later</p>
            </div>
            <div className="notification p" align="center">
              {this.state.notification}
            </div>
            <div className="whether-container">
              <div className="whether-icon" align="center">
                <img src={this.state.iconId[4]} alt=""></img>
              </div>
              <div align="center">
                {this.state.temperature[4]}°<span>{this.state.degree}</span>
              </div>
              <div className="temperature-value" />
              <div align="center">
                Total clouds <span>{this.state.clouds[4]}</span>
              </div>
              <div className="temperature-description">
                <p>{this.state.description[4]}</p>
              </div>
              <div className="location">
                <p>
                  {this.state.city}, {this.state.country}{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
