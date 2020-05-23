import React, { Component } from "react";
import { useState } from "react";
//import Modal from 'react-modal';
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { Button } from "primereact/button";
import { Slider } from "primereact/slider";
import { Messages } from "primereact/messages";
import { OverlayPanel } from "primereact/overlaypanel";
import axios from "axios";
import FeasbilityCard from "./FeasbilityCard.js";

export class Feasibility extends Component {
  constructor() {
    var newFeasibilityStudy;
    super();
    this.state = {
      checkboxValue: [],
      rangeValues: [0, 100],
      width: null,
      height: null,
      freeSpace: null,
      occupiedSpace: null,
      buildingFacade: null,
      latitude: null,
      longitude: null,
      buildingType: null,
      roofAngle: null,
      roofMaterials: [],
      roofImage: null,
      solarPlans: [
        {
          index: 1,
          solarPanel: "A Marka",
          inverter: "B Marka",
          energyProduction: "high",
          carbonFootPrint: "88",
          estimatedProfit10Year: "3000",
          estimatedProfit20Year: "11200",
          panelEfficiency: "28",
          cost: "expensive",
        },
        {
          index: 2,
          solarPanel: "A Marka",
          inverter: "C Marka",
          energyProduction: "medium",
          carbonFootPrint: "65",
          estimatedProfit10Year: "1000",
          estimatedProfit20Year: "3000",
          panelEfficiency: "22",
          cost: "cheap",
        },
      ],
      feasibilityStudy: null,
    };

    this.restoreToDefaultValues = this.restoreToDefaultValues.bind(this);
    this.calculateFeasibility = this.calculateFeasibility.bind(this);
    this.onChangeRangeSlider = this.onChangeRangeSlider.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.showFeasbilityResults = this.showFeasbilityResults.bind(this);
    this.GetFixedSystemValues = this.GetFixedSystemValues.bind(this);
    this.GetRowValues = this.GetRowValues.bind(this);
    this.ParsePvgisCsv = this.ParsePvgisCsv.bind(this);
  }

  /**
   * Get fixed system values from the array.
   * @param {Array} lines Lines to parse.
   * @returns {Object}
   */
  GetFixedSystemValues = (lines) => {
    let obj;

    lines.forEach((line) => {
      let parts = line.replaceAll("\t\t", "\t").split("\t");

      if (!parts || parts.length !== 5 || parts[0] !== "Fixed system:") {
        return;
      }

      let aoi = parseFloat(parts[1].trim()),
        spectral = parseFloat(parts[2].trim()),
        temp = parseFloat(parts[3].trim()),
        combined = parseFloat(parts[4].trim());

      if (!aoi) {
        aoi = parts[1].trim();
      }

      if (!spectral) {
        spectral = parts[2].trim();
      }

      if (!temp) {
        temp = parts[3].trim();
      }

      if (!combined) {
        combined = parts[4].trim();
      }

      obj = {
        aoi: {
          info: "AOI loss (%)",
          value: aoi,
        },
        spectral: {
          info: "Spectral effects (%)",
          value: spectral,
        },
        temp: {
          info: "Temperature and low irradiance loss (%)",
          value: temp,
        },
        combined: {
          info: "Combined losses (%)",
          value: combined,
        },
      };
    });

    return obj;
  };

  /**
   * Get array'd values, formatted.
   * @param {Array} lines Lines to parse.
   * @param {String} index First item in row.
   * @returns {Object}
   */

  GetRowValues = (lines, index) => {
    let obj;

    lines.forEach((line) => {
      let parts = line.replaceAll("\t\t", "\t").split("\t");

      if (!parts || parts.length !== 6 || parts[0] !== index) {
        return;
      }

      obj = {
        Ed: parseFloat(parts[1].trim()),
        Em: parseFloat(parts[2].trim()),
        Hd: parseFloat(parts[3].trim()),
        Hm: parseFloat(parts[4].trim()),
        SDm: parseFloat(parts[5].trim()),
      };
    });

    return obj;
  };

  /**
   * Parse the incoming CSV and return usable values.
   * @param {Object} obj Input values and CSV from PVGIS Europe.
   * @returns {Promise}
   */

  ParsePvgisCsv = (obj) => {
    console.log("Function: QueryPvgisEuropeV5");
    console.log("obj", obj);

    return new Promise((resolve, reject) => {
      let lines = obj.csv.replaceAll("\n", "").split("\r");

      if (!lines) {
        return reject("Invalid CSV from PVGIS.");
      }

      return resolve({
        //input: FormatInputValues(obj.input),
        data: {
          fixedAngle: {
            monthly: {
              jan: this.GetRowValues(lines, "1"),
              feb: this.GetRowValues(lines, "2"),
              mar: this.GetRowValues(lines, "3"),
              apr: this.GetRowValues(lines, "4"),
              may: this.GetRowValues(lines, "5"),
              jun: this.GetRowValues(lines, "6"),
              jul: this.GetRowValues(lines, "7"),
              aug: this.GetRowValues(lines, "8"),
              sep: this.GetRowValues(lines, "9"),
              oct: this.GetRowValues(lines, "10"),
              nov: this.GetRowValues(lines, "11"),
              dec: this.GetRowValues(lines, "12"),
            },
            yearly: this.GetRowValues(lines, "Year"),
          },
          fixedSystem: this.GetFixedSystemValues(lines),
        },
        info: {
          Ed: "Average daily energy production from the given system (kWh)",
          Em: "Average monthly energy production from the given system (kWh)",
          Hd:
            "Average daily sum of global irradiation per square meter received by the modules of the given system (kWh/m2)",
          Hm:
            "Average monthly sum of global irradiation per square meter received by the modules of the given system (kWh/m2)",
          SDm:
            "Standard deviation of the monthly energy production due to year-to-year variation (kWh)",
        },
      });
    });
  };

  calculateFeasibility(event) {
    //send request
    let url =
      "https://cors-anywhere.herokuapp.com/https://re.jrc.ec.europa.eu/api/PVcalc?" +
      "lat=" +
      this.state.latitude +
      "&" +
      "lon=" +
      this.state.longitude +
      "&" +
      "mountingplace=" +
      "building" +
      "&" +
      //  'pvtechchoice=' + obj.pvtechchoice + '&' +
      "peakpower=" +
      "21" +
      "&" +
      "loss=" +
      "14" +
      "&" +
      "outputformat=" +
      "csv";
    // 'angle=' + obj.angle + '&' +
    //'aspect=' + obj.aspect;

    axios.get(url).then((res) => this.setState({ feasibilityStudy: res.data }));

    // const feasbilityInfo = JSON.parse(this.state.feasibilityStudy);
    //   console.log(feasbilityInfo.outputs);
    this.messages.show({
      severity: "info",
      summary: "Info Message",
      detail: "Done! Click below to see results.",
    });
    // this.op1.toggle(event)
    //console.log(this.state.feasibilityStudy);
  }

  restoreToDefaultValues() {
    this.messages.show({
      severity: "info",
      summary: "Info Message",
      detail: "Default values Restored",
    });
    this.setState({
      width: 30,
      height: 20,
      freeSpace: "450m^2",
      occupiedSpace: "150m^2",
      buildingFacade: "South",
      latitude: 45,
      longitude: 8,
      buildingType: "House",
    });
  }

  showFeasbilityResults() {
    //console.log(this.state.feasibilityStudy);
    console.log(this.ParsePvgisCsv(this.state.feasibilityStudy));
  }

  onCheckboxChange(event) {
    let selected = [...this.state.checkboxValue];
    if (event.checked) selected.push(event.value);
    else selected.splice(selected.indexOf(event.value), 1);

    this.setState({ checkboxValue: selected });
    this.setState({ roofMaterials: this.checkboxValue });
  }

  onChangeRangeSlider(e) {
    this.setState({ rangeValues: e.value });
    this.setState({ roofAngle: e.value });
  }

  componentDidMount() {
    let data;
    axios
      .get("/getRoof")
      .then((res) => {
        console.log(res);
        data = res.data;
      })
      .catch((err) => console.log(err));

    this.setState({
      width: 30,
      height: 20,
      freeSpace: "450m^2",
      occupiedSpace: "150m^2",
      buildingFacade: "South",
      latitude: 45,
      longitude: 8,
      buildingType: "House",
    });
  }

  render() {
    return (
      <div className="p-grid">
        <div className="p-col-12">
          <div className="card">
            <h1>Calculate Your Solar Potential</h1>
            <p>Enter required information to have solar feasibility study.</p>
          </div>
        </div>

        <div className="p-col-12">
          <div className="p-grid">
            <div className="p-col-12 p-lg-4">
              <div className="card card-w-title" style={{ height: "350px" }}>
                <h1>Choose Your Roof Material</h1>
                <div className="p-vertical">
                  <div className="p-col-12">
                    <Checkbox
                      value="Asphalt Roofs"
                      inputId="cb1"
                      onChange={this.onCheckboxChange}
                      checked={
                        this.state.checkboxValue.indexOf("Asphalt Roofs") > -1
                      }
                    />
                    <label htmlFor="cb1" className="p-checkbox-label">
                      Asphalt Roofs
                    </label>
                  </div>
                  <div className="p-col-12">
                    <Checkbox
                      value="Wood Shingles"
                      inputId="cb2"
                      onChange={this.onCheckboxChange}
                      checked={
                        this.state.checkboxValue.indexOf("Wood Shingles") > -1
                      }
                    />
                    <label htmlFor="cb2" className="p-checkbox-label">
                      Wood Shingles
                    </label>
                  </div>
                  <div className="p-col-12">
                    <Checkbox
                      value="Metal Roofs"
                      inputId="cb3"
                      onChange={this.onCheckboxChange}
                      checked={
                        this.state.checkboxValue.indexOf("Metal Roofs") > -1
                      }
                    />
                    <label htmlFor="cb3" className="p-checkbox-label">
                      Metal Roofs
                    </label>
                  </div>
                  <div className="p-col-12">
                    <Checkbox
                      value="Prefabric"
                      inputId="cb4"
                      onChange={this.onCheckboxChange}
                      checked={
                        this.state.checkboxValue.indexOf("Prefabric") > -1
                      }
                    />
                    <label htmlFor="cb4" className="p-checkbox-label">
                      Prefabric
                    </label>
                  </div>
                  <div className="p-col-12">
                    <Checkbox
                      value="Clay"
                      inputId="cb5"
                      onChange={this.onCheckboxChange}
                      checked={this.state.checkboxValue.indexOf("Clay") > -1}
                    />
                    <label htmlFor="cb5" className="p-checkbox-label">
                      Clay
                    </label>
                  </div>
                  <div className="p-col-12">
                    <Checkbox
                      value="Cement"
                      inputId="cb6"
                      onChange={this.onCheckboxChange}
                      checked={this.state.checkboxValue.indexOf("Cement") > -1}
                    />
                    <label htmlFor="cb6" className="p-checkbox-label">
                      Cement
                    </label>
                  </div>
                  <div className="p-col-12">
                    <Checkbox
                      value="Slate"
                      inputId="cb7"
                      onChange={this.onCheckboxChange}
                      checked={this.state.checkboxValue.indexOf("Slate") > -1}
                    />
                    <label htmlFor="cb7" className="p-checkbox-label">
                      Slate
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-col-12 p-lg-8">
              <div className="card card-w-title" style={{ height: "350px" }}>
                <h1>Roof Angle</h1>
                <div className="p-vertical">
                  <div className="p-cl-12">
                    <h3>
                      Adjust Your Roof Angle Range: {this.state.rangeValues[0]},
                      {this.state.rangeValues[1]}
                    </h3>
                    <Slider
                      value={this.state.rangeValues}
                      onChange={this.onChangeRangeSlider}
                      range={true}
                      style={{ width: "14em" }}
                    />
                  </div>
                  <div className="p-col-12" style={{ height: "20px" }}></div>
                  <div className="p-col-12">
                    <Message
                      severity="warn"
                      text="If you know exact angle, please enter in building properties below."
                      style={{ width: "250px" }}
                    />
                  </div>
                  <div className="p-col-12">
                    <Button
                      type="button"
                      label="Click to have an idea"
                      onClick={(e) => this.op.toggle(e)}
                      aria-controls="overlay_panel"
                      aria-haspopup={true}
                    />
                    <OverlayPanel
                      ref={(el) => (this.op = el)}
                      id="overlay_panel"
                      showCloseIcon={true}
                    >
                      <img
                        src="assets/layout/images/roofAngle.png"
                        alt="Roof Angle"
                      />
                    </OverlayPanel>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-col-12 p-lg-6">
          <div className="card card-w-title" style={{ height: "500px" }}>
            <h1>Your Roof</h1>
            <div className="p-col-12 p-md-6">
              <img
                src="assets/layout/images/roof1.png"
                width="450"
                height="400"
                alt="roof1"
              />
            </div>
          </div>
        </div>
        <div className="p-col-12 p-lg-6">
          <div className="card card-w-title" style={{ height: "500px" }}>
            <h1>Building Properties</h1>
            <div className="p-col-12">
              <div className="p-grid">
                <div className="p-col-6">
                  <div className="p-grid">
                    <div className="p-col-6">
                      <label htmlFor="width">Roof Width: </label>
                    </div>
                    <div className="p-col-6">
                      <InputText
                        value={this.state.width}
                        style={{ width: "100px" }}
                        onChange={(e) =>
                          this.setState({ width: e.target.value })
                        }
                        rows={1}
                        cols={10}
                      ></InputText>
                    </div>
                  </div>
                  <div className="p-grid">
                    <div className="p-col-6">
                      <label htmlFor="height">Roof Height: </label>
                    </div>
                    <div className="p-col-6">
                      <InputText
                        value={this.state.height}
                        style={{ width: "100px" }}
                        onChange={(e) =>
                          this.setState({ height: e.target.value })
                        }
                        rows={1}
                        cols={10}
                      ></InputText>
                    </div>
                  </div>
                  <div className="p-grid">
                    <div className="p-col-6">
                      <label htmlFor="freeSpace">Free Space: </label>
                    </div>
                    <div className="p-col-6">
                      <InputText
                        value={this.state.freeSpace}
                        style={{ width: "100px" }}
                        onChange={(e) =>
                          this.setState({ freeSpace: e.target.value })
                        }
                        rows={1}
                        cols={10}
                      ></InputText>
                    </div>
                  </div>
                  <div className="p-grid">
                    <div className="p-col-6">
                      <label htmlFor="occupiedSpace">Occupied Space: </label>
                    </div>
                    <div className="p-col-6">
                      <InputText
                        value={this.state.occupiedSpace}
                        style={{ width: "100px" }}
                        onChange={(e) =>
                          this.setState({ occupiedSpace: e.target.value })
                        }
                        rows={1}
                        cols={10}
                      ></InputText>
                    </div>
                  </div>
                  <div className="p-grid">
                    <div className="p-col-6">
                      <label htmlFor="side">Building Facade: </label>
                    </div>
                    <div className="p-col-6">
                      <InputText
                        value={this.state.buildingFacade}
                        style={{ width: "100px" }}
                        onChange={(e) =>
                          this.setState({ buildingFacade: e.target.value })
                        }
                        rows={1}
                        cols={10}
                      ></InputText>
                    </div>
                  </div>
                  <div className="p-grid">
                    <div className="p-col-6">
                      <label htmlFor="enlem">Latitude: </label>
                    </div>
                    <div className="p-col-6">
                      <InputText
                        value={this.state.latitude}
                        style={{ width: "100px" }}
                        onChange={(e) =>
                          this.setState({ latitude: e.target.value })
                        }
                        rows={1}
                        cols={10}
                      ></InputText>
                    </div>
                  </div>
                  <div className="p-grid">
                    <div className="p-col-6">
                      <label htmlFor="boylam">Longitude: </label>
                    </div>
                    <div className="p-col-6">
                      <InputText
                        value={this.state.longitude}
                        style={{ width: "100px" }}
                        onChange={(e) =>
                          this.setState({ longitude: e.target.value })
                        }
                        rows={1}
                        cols={10}
                      ></InputText>
                    </div>
                  </div>
                  <div className="p-grid">
                    <div className="p-col-6">
                      <label htmlFor="type">Building Type: </label>
                    </div>
                    <div className="p-col-6">
                      <InputText
                        value={this.state.buildingType}
                        style={{ width: "100px" }}
                        onChange={(e) =>
                          this.setState({ buildingType: e.target.value })
                        }
                        rows={1}
                        cols={10}
                      ></InputText>
                    </div>
                  </div>
                  <div className="p-grid">
                    <div className="p-col-6">
                      <label htmlFor="type">Roof Angle: </label>
                    </div>
                    <div className="p-col-6">
                      <InputText
                        value={this.state.roofAngle}
                        style={{ width: "100px" }}
                        onChange={(e) =>
                          this.setState({ roofAngle: e.target.value })
                        }
                        rows={1}
                        cols={10}
                      ></InputText>
                    </div>
                  </div>
                </div>
                <div className="p-col-6">
                  <div className="p-vertical">
                    <div className="p-col-12">
                      <Message
                        severity="warn"
                        text="If you know exact values for your building, please enter them."
                        style={{ width: "200px" }}
                      />
                    </div>
                    <div className="p-col-12">
                      <Messages ref={(el) => (this.messages = el)} />
                      <Button
                        onClick={this.restoreToDefaultValues}
                        label="Restore to default values"
                        className="p-button-info"
                        style={{ width: "200px", height: "50px" }}
                      />
                    </div>
                    <div className="p-col-12">
                      <Button
                        label="Calculate Feasability"
                        onClick={this.calculateFeasibility}
                        aria-controls="overlay_panel"
                        aria-haspopup={true}
                        style={{ width: "200px", height: "50px" }}
                        className="p-button-success"
                      />
                    </div>
                    <div className="p-col-12">
                      <Button
                        label="Show Results"
                        onClick={this.showFeasbilityResults}
                        aria-controls="overlay_panel"
                        aria-haspopup={true}
                        style={{ width: "200px", height: "50px" }}
                        className="p-button-success"
                      />
                      <OverlayPanel
                        ref={(el) => (this.op1 = el)}
                        id="overlay_panel"
                        showCloseIcon={true}
                        style={{ width: "800px", height: "800px" }}
                      >
                        <React.Fragment></React.Fragment>
                      </OverlayPanel>
                    </div>
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
