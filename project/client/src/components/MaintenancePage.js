import React, { Component } from 'react';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column'
import axios from 'axios';
import { CarService } from '../service/CarService';
import { Messages } from 'primereact/messages';
import { Button } from 'primereact/button';
import { CSVReader } from 'react-papaparse'
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

const buttonRef = React.createRef()

const key = "82005d27a116c2880c8f0fcb866998a0";
const KELVIN = 273;

const styles = (theme) => ({
  ...styles,
});

export class MaintenancePage extends Component {

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
    
      componentWillUnmount() {
        clearInterval(this.interval);
      }

    componentDidMount() {
        axios
            .get("/existingSystems")
            .then((response) => {
                console.log(response);
                this.setState({ systems: response.data });
            })
            .catch((err) => { this.showError(); console.log(err) });
        

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

    onSortChange(event) {
        let value = event.value;

        if (value.indexOf('!') === 0)
            this.setState({ sortOrder: -1, sortField: value.substring(1, value.length), sortKey: value });
        else
            this.setState({ sortOrder: 1, sortField: value, sortKey: value });
    }

    showError() {
        this.messages.show({ severity: 'error', summary: 'Something went wrong' });
    }

    handleOpenDialog = (e) => {
        if (buttonRef.current) {
            buttonRef.current.open(e)
        }
    }

    handleOnFileLoad = (data) => {
        console.log('---------------------------');
        console.log(data);
        console.log('---------------------------');
        this.setState({
            selectedFileData: data,
            selectedFileRowCount: data.length,
        });
    }

    handleOnError = (err, file, inputElem, reason) => {
        console.log(err);
    }

    handleOnRemoveFile = (data) => {
        console.log('---------------------------');
        console.log(data);
        console.log('---------------------------');
        this.setState({
            selectedFileData: null,
            selectedFileRowCount: 0,
        });
    }

    handleRemoveFile = (e) => {
        if (buttonRef.current) {
            buttonRef.current.removeFile(e);
        }
    }

    uploadData(event) {
        if (this.state.selectedSystem == null) {
            this.showError();
            return;
        }
        for (var i = 0; i < this.state.selectedFileRowCount; i++) {
            let generationInfo = {
                date: this.state.selectedFileData[i].data[0],
                generated: this.state.selectedFileData[i].data[1],
                systemId: this.state.selectedSystem.existingSystemsId,
            }
            console.log(generationInfo);

            axios
                .post("/addGeneration/" + this.state.selectedSystem.existingSystemsId, generationInfo)
                .then((response) => {
                    console.log(response);
                })
                .catch((err) => { console.log(err) });
        }

    }

    constructor() {
        super();
        this.carService = new CarService();
        this.showError = this.showError.bind(this);

        this.state = {
            value: 0,
            selectedSystem: null,
            selectedFile: null,
            systems: [],
            generations: [[]],
            selectedFileData: null,
            selectedFileRowCount: 0,
            degree: "C",
            notification: ["", "", "", "", ""],
            temperature: ["", "", "", "", ""],
            description: ["", "", "", "", ""],
            iconId: "assets/layout/WeatherIcons/unknown.png",
            city: ["", "", "", "", ""],
            country: ["", "", "", "", ""],
            clouds: ["", "", "", "", ""],
            options: {
                enableHighAccuracy: true,
                timeout: 5000,
                maxiumumAge: 0,
            },
            barData: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                    {
                        label: 'Solar Panel 1',
                        backgroundColor: '#03A9F4',
                        borderColor: '#03A9F4',
                        data: [65, 59, 80, 81, 56, 55, 40]
                    },
                    {
                        label: 'Solar Panel 2',
                        backgroundColor: '#FFC107',
                        borderColor: '#FFC107',
                        data: [28, 48, 40, 19, 86, 27, 90]
                    }
                ]
            }
        };

        this.getLocation = this.getLocation.bind(this);
        this.getCoordinates = this.getCoordinates.bind(this);
    }
    render() {
        return (
            <div className="p-grid p-fluid">
                <div className="p-col-12 p-lg-12">
                    <div className="card">
                        <h1>Maintenance</h1>
                        <p>This is the maintenance page</p>
                    </div>
                </div>

                <div className="p-col-12 p-lg-6">
                    <div className="card">
                        <h1 className="centerText">Bar Monthly View</h1>
                        <Chart type="bar" data={this.state.barData} />
                    </div>
                </div>

                <div className="p-col-12">
                    <Messages ref={(el) => this.messages = el} />
                    <div className="card card-w-title">
                        <h1>List of Your Systems</h1>
                        <DataTable value={this.state.systems} paginatorPosition="both" selectionMode="single" header="List of Systems" paginator={true} rows={10}
                            responsive={true} selection={this.state.selectedSystem} onSelectionChange={event => this.setState({ selectedSystem: event.value })}>
                            <Column field="name" header="Name of the System" sortable={true} />
                            <Column field="region" header="Location" sortable={true} />
                            <Column field="systemSize" header="System Size" sortable={true} />
                            <Column field="inverterSize" header="Inverter Size" sortable={true} />
                            <Column field="numPanels" header="Number of Panels" sortable={true} />
                            <Column field="age" header="Age of the System" sortable={true} />
                        </DataTable>
                        <div className="p-row-6 p-lg-6">
                            <CSVReader
                                ref={buttonRef}
                                onFileLoad={this.handleOnFileLoad}
                                onError={this.handleOnError}
                                noClick
                                noDrag
                                onRemoveFile={this.handleOnRemoveFile}>
                                {({ file }) => (
                                    <aside
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            marginBottom: 10,
                                            marginTop: 20,
                                        }}>
                                        <button
                                            type='button'
                                            onClick={this.handleOpenDialog}
                                            style={{
                                                borderRadius: 0,
                                                marginLeft: 0,
                                                marginRight: 10,
                                                width: '40%',
                                                paddingLeft: 0,
                                                paddingRight: 0
                                            }}>Select .csv file to upload generation log</button>
                                        <div
                                            style={{
                                                borderWidth: 1,
                                                borderStyle: 'solid',
                                                borderColor: '#ccc',
                                                height: 45,
                                                lineHeight: 2.5,
                                                marginTop: 5,
                                                marginBottom: 5,
                                                paddingLeft: 13,
                                                paddingTop: 3,
                                                width: '60%'
                                            }}>
                                            {file && file.name}
                                        </div>
                                        <button
                                            style={{
                                                borderRadius: 0,
                                                marginLeft: 10,
                                                marginRight: 0,
                                                paddingLeft: 5,
                                                paddingRight: 5
                                            }}
                                            onClick={this.handleRemoveFile}>Remove File</button>
                                    </aside>
                                )}
                            </CSVReader>
                        </div>

                        </div>
                        <div className="p-row-6 p-lg-6">
                            <label>
                                Rows found: {this.state.selectedFileRowCount}
                            </label>
                            <Button label="Upload generation log for the selected file" icon="pi pi-upload"
                                onClick={(event) => this.uploadData(event)} style={{ marginTop: 10, }} />
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
                </div>
            </div>
        );
    }

}

/*

            lineData: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                    {
                        label: 'Solar Panel 1',
                        data: [65, 59, 80, 81, 56, 55, 40],
                        fill: false,
                        borderColor: '#03A9F4'
                    },
                    {
                        label: 'Solar Panel 2',
                        data: [28, 48, 40, 19, 86, 27, 90],
                        fill: false,
                        borderColor: '#FFC107'
                    }
                ]
            },




                <div className="p-col-12 p-lg-6">
                    <div className="card">
                        <h1 className="centerText">Linear Monthly View</h1>
                        <Chart type="line" data={this.state.lineData} />
                    </div>

                </div>

*/