import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { CarService } from "../service/CarService";
import { Button } from "primereact/button";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Panel } from "primereact/panel";
import classNames from "classnames";
import { ProgressBar } from "primereact/progressbar";
import { OverlayPanel } from "primereact/overlaypanel";
import { Messages } from "primereact/messages";
import { DataScroller } from "primereact/datascroller";
import FeasbilityCard from "./FeasbilityCard.js";
import CompareCard from "./CompareCard.js";
import "./SolarPlanTable.scss";
import axios from "axios";
import {Steps} from "primereact/steps"

const items = [
    {label: 'Find Address'},
    {label: 'Feasibility Study'},
    {label: 'Create Solar Plan'},
    {label: 'Maintenance'},
  ];

export class SolarPlans extends Component {
  constructor() {
    var selectedSolarPanel = null;
    var selectedInverter = null;
    var newFeasibilityStudy = null;
    var planSelected = false;
    var selectedSolarPlan = null;
    var comparedPlans = [];
    super();
    this.state = {
      dataTableValue: [],
      checkboxValue: [],
      inverterData: [],
      solarPanelData: [],
      selectedSolarPanel: null,
      selectedInverter: null,
      layout: "list",
      cars: [],
      selectedType: null,
      selectedBuilding: null,
      solarPlans: [],
      buildings: [],
      selectedSolarPlans: null,
      roofAngle: null,
      freeSpace: null,
      latitude: null,
      longitude: null,
      averageConsumption: null,
      isPlanSelected: false,
      isCompareSelected: false,
      showInverterDetail: false,
      showPanelDetail: false,
    };

    //views
    this.dataViewInverterTemplate = this.dataViewInverterTemplate.bind(this);
    this.dataViewSolarPanelTemplate = this.dataViewSolarPanelTemplate.bind(
      this
    );

    //body cells
    this.energyProductionBodyTemplate = this.energyProductionBodyTemplate.bind(
      this
    ); //status
    this.carbonFootPrintBodyTemplate = this.carbonFootPrintBodyTemplate.bind(
      this
    ); //progress bar
    this.estimatedProfit25YearBodyTemplate = this.estimatedProfit25YearBodyTemplate.bind(
      this
    ); //status
    this.panelEfficiencyBodyTemplate = this.panelEfficiencyBodyTemplate.bind(
      this
    ); //status
    this.costBodyTemplate = this.costBodyTemplate.bind(this); //status
    this.roofAreaTemplate = this.roofAreaTemplate.bind(this);

    //functions
    this.getSolarPlanDetail = this.getSolarPlanDetail.bind(this);
    this.addNewSolarPlan = this.addNewSolarPlan.bind(this);
    this.deleteSolarPlan = this.deleteSolarPlan.bind(this);
    this.showError = this.showError.bind(this);
    this.getInverter = this.getInverter.bind(this);
    this.selectBuilding = this.selectBuilding.bind(this);
    this.compareSolarPlans = this.compareSolarPlans.bind(this);
    this.getPanelDetail = this.getPanelDetail.bind(this);
    this.getInverterDetail = this.getInverterDetail.bind(this);
  }

  getSolarPlans() {
    return axios.get("/getStudies").then((res) => res.data);
  }

  selectBuilding() {
    console.log(this.state.dataTableSelection);
    this.getSolarPlans().then((response) => {
      this.getRoofStudies(response).then((roofPlans) => {
        this.renderSolarPlans(roofPlans);
      });
    });
  }

  getRoofStudies(userStudies) {
    let roofPlans = [];

    return new Promise((resolve) => {
      if (userStudies != null) {
        resolve(userStudies);
      }
    });
  }

  roofAreaTemplate(rowData) {
    let tempRoofArea = rowData.roofArea.toFixed(2);
    return <span>{tempRoofArea} m<sup>2</sup></span>;
}

  renderSolarPlans(roofPlans) {
    //set state roof angle ve average consumption ekle
    this.setState({ averageConsumption: roofPlans[0].averageConsumption });
    this.setState({ roofAngle: roofPlans[0].roofAngle });
    this.setState({ freeSpace: this.state.dataTableSelection.roofArea });
    this.setState({
      latitude: this.state.dataTableSelection.roofCoordinates[0].y,
    });
    this.setState({
      longitude: this.state.dataTableSelection.roofCoordinates[0].x,
    });

    let tmpPlans = [];
    let cost, energyProduction, carbonFootPrint, estimatedProfit25Year;
    for (let i = 0; i < roofPlans.length; i++) {
      if (roofPlans[i].buildingId == this.state.dataTableSelection.roofId) {
        tmpPlans.push(roofPlans[i]);
      }
    }
    this.setState({ solarPlans: tmpPlans });
    console.log(this.state.solarPlans);
  }

  calculteRank(rowData, category) {
    let size = this.state.solarPlans.length;
    let categoryData = [];
    let i;
    for (i = 0; i < size; i++) {
      categoryData.push(this.state.solarPlans[i][category]);
    }
    categoryData.sort((a, b) => a - b);
    let data = rowData[category];
    let index = categoryData.indexOf(data);

    if (size == 1) {
      return "medium";
    } else if (size == 2) {
      if (index > 0) {
        return "high";
      } else {
        return "medium";
      }
    } else {
      if (index < size / 3) {
        return "low";
      } else if (index >= size / 3 && index < (size / 3) * 2) {
        return "medium";
      } else if (index >= (size / 3) * 2) {
        return "high";
      }
    }
  }

  roofAreaTemplate(rowData) {
    let tempRoofArea = rowData.roofArea.toFixed(2);
    return <span>{tempRoofArea} m<sup>2</sup></span>;
}

  energyProductionBodyTemplate(rowData) {
    let energyProduction = rowData.energyProduction.toFixed(2);
    return (
      <span
        className={classNames(
          "solarPlan-badge",
          "energyProduction-" + this.calculteRank(rowData, "energyProduction")
        )}
      >
        {energyProduction}
      </span>
    );
  }

  estimatedProfit25YearBodyTemplate(rowData) {
    let estimatedProfit25Year = rowData.estimatedProfit25Year.toFixed(2);
    return (
      <span
        className={classNames(
          "solarPlan-badge",
          "estimatedProfit25Year-" +
            this.calculteRank(rowData, "estimatedProfit25Year")
        )}
      >
        {estimatedProfit25Year}
      </span>
    );
  }

  panelEfficiencyBodyTemplate(rowData) {
    return (
      <span
        className={classNames(
          "solarPlan-badge",
          "panelEfficiency-" + this.calculteRank(rowData, "panelEfficiency")
        )}
      >
        {rowData.panelEfficiency}
      </span>
    );
  }

  costBodyTemplate(rowData) {
    let cost = rowData.cost.toFixed(2);
    return (
      <span
        className={classNames(
          "solarPlan-badge",
          "cost-" + this.calculteRank(rowData, "cost")
        )}
      >
        {cost}
      </span>
    );
  }

  carbonFootPrintBodyTemplate(rowData) {
    let carbonFootPrint = rowData.carbonFootPrint.toFixed(2);
    return (
      <span
        className={classNames(
          "solarPlan-badge",
          "carbonFootPrint-" + this.calculteRank(rowData, "carbonFootPrint")
        )}
      >
        {carbonFootPrint}
      </span>
    );
  }

  getSolarPlanDetail() {
    if (this.state.selectedSolarPlans == null) {
      let msg = {
        severity: "error",
        summary: "Error Message",
        detail: "Please choose a plan.",
      };
      this.messages.show(msg);
    } else if (this.state.selectedSolarPlans.length > 1) {
      let msg = {
        severity: "error",
        summary: "Error Message",
        detail: "Please only choose 1 plan.",
      };
      this.messages.show(msg);
    } else {
      console.log(this.state.selectedSolarPlans);
      this.selectedSolarPlan = this.state.selectedSolarPlans[0];
      this.planSelected = true;
      this.checkSelectedPlans().then(() => {
        var event = new Event("build");
        // Listen for the event.
        document.addEventListener("build", this.openDetailCard(event), false);
      });
    }
  }

  compareSolarPlans() {
    if (this.state.selectedSolarPlans == null) {
      let msg = {
        severity: "error",
        summary: "Error Message",
        detail: "Please choose a plan.",
      };
      this.messages.show(msg);
    } else if (this.state.selectedSolarPlans.length > 1) {
      console.log(this.state.selectedSolarPlans);
      this.comparedPlans = this.state.selectedSolarPlans;
      //  this.planSelected = true;
      this.checkComparedSolarPlans().then(() => {
        var event = new Event("build1");
        // Listen for the event.
        document.addEventListener("build1", this.openCompareCard(event), false);
      });
    }
  }

  checkSelectedPlans() {
    return new Promise((resolve) => {
      if (this.state.selectedSolarPlans.length == 1) {
        resolve();
      }
    });
  }

  checkComparedSolarPlans() {
    return new Promise((resolve) => {
      if (this.state.selectedSolarPlans.length >= 1) {
        resolve();
      }
    });
  }

  openCompareCard(event) {
    this.setState({ isCompareSelected: true });
    this.op3.toggle(event);
  }

  openDetailCard(event) {
    this.setState({ isPlanSelected: true });
    this.op2.toggle(event);
  }

  getPanelDetail() {
    this.b = true;
  }

  getInverterDetail() {
    this.a = true;
  }

  openPanelDetail(event) {}

  openInverterDetail(event) {}

  selectInverter(inverter) {
    this.selectedInverter = inverter;
  }

  selectSolarPanel(solarPanel) {
    this.selectedSolarPanel = solarPanel;
  }

  showError() {
    let msg = {
      severity: "error",
      summary: "Error Message",
      detail: "Please be sure you choose solar panel and inverter.",
    };
    this.messages.show(msg);
  }

  getSolarPanels() {
    return axios.get("/getPanels").then((res) => res.data);
  }

  getInverter() {
    return axios.get("/getInverters").then((res) => res.data);
  }

  addNewSolarPlan() {
    //pvgise seçilen panel inverter ve userın konum bilgileri gidip yeni plan hesabı gelcek
    if (this.selectedSolarPanel != null && this.selectedInverter != null) {
      this.calculateFeasibilityStudy();
    } else {
      this.showError();
    }
  }

  deleteSolarPlan() {
    console.log(this.state.selectedSolarPlans[0].studyId);
    var studyId = this.state.selectedSolarPlans[0].studyId;

    axios
      .delete(
        `https://us-central1-socialape-27812.cloudfunctions.net/api/feasibilityStudy/${studyId}`
      )
      .then((res) => {
        console.log(res);
        this.selectBuilding();
      })
      .catch((err) => console.log(err));
  }
  calculateFeasibilityStudy() {
    this.sendRequest();
  }

  sendRequest() {
    //send query to pvgis with selected panel and inverter
    let panelEfficiency = this.selectedSolarPanel.efficiency;
    let inverterEfficiency = this.selectedInverter.efficiency;
    let systemLoss = 14 - (inverterEfficiency - 93) * 0.9;

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
      (this.state.freeSpace * panelEfficiency) / 100 +
      "&" +
      "loss=" +
      systemLoss +
      "&" +
      "outputformat=" +
      "json" +
      "&" +
      "angle=" +
      this.state.roofAngle;
    //'aspect=' + obj.aspect;

    axios.get(url).then((response) => {
      console.log(response);
      this.newFeasibilityStudy = response.data;

      this.newStudy = {
        buildingId: this.state.dataTableSelection.roofId,
        solarPanel: this.selectedSolarPanel.name,
        inverter: this.selectedInverter.name,
        estimatedProfit25Year: null,
        panelEfficiency: this.selectedSolarPanel.efficiency,
        cost: this.calculateSystemCost(),
        carbonFootPrint: this.calculateCarbonFootPrint(
          this.state.averageConsumption * 12
        ),
        freeSpace: this.state.freeSpace,
        averageConsumption: this.state.averageConsumption,
        energyProduction: this.newFeasibilityStudy.outputs.totals.fixed.E_y,
        study: this.newFeasibilityStudy,
        roofAngle: this.state.solarPlans[0].roofAngle,
      };

      let monthlydata = [];
      for (
        let i = 0;
        i < this.newFeasibilityStudy.outputs.monthly.fixed.length;
        i++
      ) {
        monthlydata.push(this.newFeasibilityStudy.outputs.monthly.fixed[i].E_m);
      }
      this.newStudy.estimatedProfit25Year = this.calculateSaving(
        this.state.freeSpace,
        monthlydata,
        this.state.averageConsumption
      );

      console.log(this.newStudy);
      this.state.solarPlans.push(this.newStudy);
      axios
        .post("/addFeasibilityStudy", this.newStudy)
        .then((res) => {
          this.selectBuilding();
        })
        .catch((err) => console.log(err));
    });
  }

  calculateCarbonFootPrint(annualConsumption) {
    return (annualConsumption * 0.6241) / 1000;
  }

  calculateSaving(freeSpace, monthlydata, averageConsumption) {
    let peakPower = (freeSpace * 17) / 100; //kaç kWh olduğunu gösterir
    let systemCost = peakPower * 9500; //1Kwh saat için kurulum ücreti ortalama her şey dahil 1500$
    let balance = 0;
    //first 15 year
    let income15 = 0;
    let i;
    for (i = 0; i < 12; i++) {
      let diff = monthlydata[i] - averageConsumption;
      if (diff > 0) {
        income15 += diff * 0.31;
        income15 += averageConsumption * 0.71;
      } else {
        income15 += monthlydata[i] * 0.71;
      }
    }
    balance += income15 * 15;
    //last 10 year
    let income10 = 0;
    let j;
    for (j = 0; j < 12; j++) {
      let diff = monthlydata[j] * 0.85 - averageConsumption;
      if (diff > 0) {
        income10 += diff * 0.31;
        income10 += averageConsumption * 0.71;
      } else {
        income10 += monthlydata[j] * 0.71;
      }
    }
    balance += income10 * 10;
    return balance - systemCost;
  }

  calculateSystemCost() {
    return (
      ((this.state.freeSpace * this.selectedSolarPanel.efficiency) / 100) *
        9500 +
      this.selectedInverter.price
    );
  }

  renderHeader() {
    return <div>List of Solar Plans</div>;
  }

  proceed() {
    window.location = "#/maintenance"
    window.location.reload()
}

  componentDidMount() {
    this.getSolarPanels().then((data) =>
      this.setState({ solarPanelData: data })
    );
    this.getInverter().then((data) => this.setState({ inverterData: data }));
    let data;
    axios
      .get("/getRoof")
      .then((res) => {
        data = res.data;
        // console.log(data);
        var buildings = [];
        for (let i = 0; i < data.length; i++) {
          buildings.push(data[i]);
        }
        this.setState({
          buildings: buildings,
        });
      })
      .catch((err) => console.log(err));
  }

  dataViewInverterTemplate(inverter) {
    if (!inverter) {
      return;
    }
    return (
      <div
        className="p-grid"
        style={{ padding: "2em", borderBottom: "1px solid #d9d9d9" }}
      >
        <div className="p-col-12 p-md-3">
          <img src={inverter.image} />
        </div>
        <div className="p-col-12 p-md-6 car-details">
          <div className="p-grid">
            <div className="p-col-2 p-sm-6">
              <b>Name:</b>
            </div>
            <div className="p-col-10 p-sm-6">
              <b>{inverter.name}</b>
            </div>

            <div className="p-col-2 p-sm-6">
              <b>Efficiency:</b>
            </div>
            <div className="p-col-10 p-sm-6">
              <b>{inverter.efficiency}%</b>
            </div>

            <div className="p-col-2 p-sm-6">
              <b>Peak AC Power:</b>
            </div>
            <div className="p-col-10 p-sm-6">
              <b>{inverter.peakACPower} W</b>
            </div>

            <div className="p-col-2 p-sm-6">
              <b>Price:</b>
            </div>
            <div className="p-col-10 p-sm-6">
              <b>{inverter.price} ₺</b>
            </div>
          </div>
        </div>
        <div className="p-col-12 p-md-3">
          <div className="p-vertical">
            <div className="p-col-6">
              <Button
                label="Select"
                style={{ width: "150px" }}
                onClick={() => this.selectInverter(inverter)}
                className="p-button-success"
              ></Button>
            </div>
            <div className="p-col-6">
              <Button
                label="Detail"
                style={{ width: "150px" }}
                onClick={(e) => this.op.toggle(e)}
                className="p-button-info"
              ></Button>
              <OverlayPanel
                ref={(el) => (this.op = el)}
                id="overlay_panel"
                showCloseIcon={true}
              >
                <img src={inverter.info} />
              </OverlayPanel>
            </div>
          </div>
        </div>
      </div>
    );
  }

  dataViewSolarPanelTemplate(panel) {
    if (!panel) {
      return;
    }

    return (
      <div
        className="p-grid"
        style={{ padding: "2em", borderBottom: "1px solid #d9d9d9" }}
      >
        <div className="p-col-12 p-md-3">
          <img src={panel.image} />
        </div>
        <div className="p-col-12 p-md-6 car-details">
          <div className="p-grid">
            <div className="p-col-2 p-sm-6">
              <b>Panel Name:</b>
            </div>
            <div className="p-col-10 p-sm-6">
              <b>{panel.name}</b>
            </div>

            <div className="p-col-2 p-sm-6">
              <b>Peak Power:</b>
            </div>
            <div className="p-col-10 p-sm-6">
              <b>{panel.peakPower}W</b>
            </div>

            <div className="p-col-2 p-sm-6">
              <b>Efficiency:</b>
            </div>
            <div className="p-col-10 p-sm-6">
              <b>{panel.efficiency}%</b>
            </div>

            <div className="p-col-2 p-sm-6">
              <b>Price:</b>
            </div>
            <div className="p-col-10 p-sm-6">
              <b>{panel.price} ₺</b>
            </div>

            <div className="p-col-2 p-sm-6">
              <b>Panel Type:</b>
            </div>
            <div className="p-col-10 p-sm-6">
              <b>{panel.type}</b>
            </div>
          </div>
        </div>

        <div className="p-col-12 p-md-3">
          <div className="p-vertical">
            <div className="p-col-6">
              <Button
                label="Select"
                style={{ width: "150px" }}
                onClick={() => this.selectSolarPanel(panel)}
                className="p-button-success"
              ></Button>
            </div>
            <div className="p-col-6">
              <Button
                label="Detail"
                style={{ width: "150px" }}
                onClick={(e) => this.op1.toggle(e)}
                className="p-button-info"
              ></Button>
              <OverlayPanel
                ref={(el) => (this.op1 = el)}
                id="overlay_panel"
                showCloseIcon={true}
              >
                <img src={panel.info} />
              </OverlayPanel>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const header = this.renderHeader();

    return (
      <div className="p-grid">
        <div className="p-col-12">
          <h1>Solar Plans</h1>
        </div>

        <div className="p-col-12 p-lg-12">
          <div className="p-col-12">
            <div className="card card-w-title">
              <h1>Your Registered Buildlings</h1>
              <DataTable
                value={this.state.buildings}
                paginatorPosition="bottom"
                selectionMode="single"
                header="Your Buildings"
                paginator={true}
                rows={10}
                responsive={true}
                selection={this.state.dataTableSelection}
                onSelectionChange={(event) =>
                  this.setState({ dataTableSelection: event.value })
                }
              >
                <Column
                  field="buildingName"
                  header="Building Name"
                  sortable={false}
                />
                <Column
                  field="buildingType"
                  header="Building Type"
                  sortable={false}
                />
                <Column field="address" header="Adress" sortable={false} />
                <Column field="roofArea" header="Roof Area" body={this.roofAreaTemplate} sortable={false} />
              </DataTable>
            </div>
            <div>
              <Button
                label="Select Building"
                onClick={this.selectBuilding}
                aria-controls="overlay_panel"
                aria-haspopup={true}
                style={{ width: "200px", height: "50px" }}
                className="p-button-success"
              />
            </div>
          </div>

          <div className="datatable-solarPlans">
            <DataTable
              ref={(el) => (this.dt = el)}
              value={this.state.solarPlans}
              header={header}
              selection={this.state.selectedSolarPlans}
              onSelectionChange={(e) =>
                this.setState({ selectedSolarPlans: e.value })
              }
              emptyMessage="No solar plans found"
            >
              <Column selectionMode="multiple" style={{ width: "3em" }} />
              <Column
                field="solarPanel"
                header="Solar Panel"
                sortable={false}
              />
              <Column field="inverter" header="Inverter" sortable={false} />
              <Column
                field="energyProduction"
                header="Energy Production mWh(Annual)"
                body={this.energyProductionBodyTemplate}
                sortable
              />
              <Column
                field="carbonFootPrint"
                header="Reduced Carbon Foot Print"
                body={this.carbonFootPrintBodyTemplate}
              />
              <Column
                field="estimatedProfit25Year"
                header="Estimated Profit(25 Year)"
                body={this.estimatedProfit25YearBodyTemplate}
                sortable
              />
              <Column
                field="panelEfficiency"
                header="Panel Efficiency (%)"
                body={this.panelEfficiencyBodyTemplate}
                sortable
              />
              <Column
                field="cost"
                header="Cost"
                body={this.costBodyTemplate}
                sortable
              />
            </DataTable>
          </div>
          <div className="p-vertical">
            <div>
              <div className="p-col-12" style={{ textAlign: "left" }}>
                <Button
                  label="Get Plan Detail"
                  style={{ width: "150px" }}
                  aria-controls="overlay_panel1"
                  style={{ width: "250px" }}
                  onClick={this.getSolarPlanDetail}
                  className="p-button-info"
                ></Button>
                {this.state.isPlanSelected && (
                  <div className="panelScreen">
                    <OverlayPanel
                      ref={(el) => (this.op2 = el)}
                      showCloseIcon={true}
                      id="overlay_panel1"
                    >
                      <FeasbilityCard newStudy={this.selectedSolarPlan} />
                    </OverlayPanel>
                  </div>
                )}
              </div>

              <div className="p-col-12" style={{ textAlign: "left" }}>
                <Button
                  label="Compare Solar Plans"
                  style={{ width: "250px" }}
                  className="p-button-success"
                  onClick={this.compareSolarPlans}
                />
                {this.state.isCompareSelected && (
                  <div className="panelScreen">
                    <OverlayPanel
                      ref={(el) => (this.op3 = el)}
                      showCloseIcon={true}
                      id="overlay_panel2"
                    >
                      <CompareCard comparedPlans={this.comparedPlans} />
                    </OverlayPanel>
                  </div>
                )}
              </div>
              <div className="p-col">
                <Messages ref={(el) => (this.messages = el)} />
                <Button
                  label="Delete Solar Plan"
                  onClick={this.deleteSolarPlan}
                  className="p-button-success"
                  style={{ width: "250px" }}
                />
              </div>
              <div className="p-col">
                <Messages ref={(el) => (this.messages = el)} />
                <Button
                  label="Add New Solar Plan"
                  onClick={this.addNewSolarPlan}
                  className="p-button-success"
                  style={{ width: "250px" }}
                />
              </div>
            </div>
          </div>
          <div className="p-col-12">
            <div className="card card-w-title">
              <h1>Inverters</h1>
              <DataScroller
                value={this.state.inverterData}
                itemTemplate={this.dataViewInverterTemplate}
                rows={this.state.inverterData.length}
                buffer={0.6}
                header="List of Inverters"
              />
            </div>
          </div>
          <div className="p-col-12">
            <div className="card card-w-title">
              <h1>Solar Panels</h1>
              <DataScroller
                value={this.state.solarPanelData}
                itemTemplate={this.dataViewSolarPanelTemplate}
                rows={this.state.solarPanelData.length}
                buffer={0.6}
                header="List of Solar Panels"
              />
            </div>
          </div>
        </div>
        <div className="p-col p-fluid p-card p-justify-end">
            <Steps model={items} activeIndex={2} readOnly={false}></Steps>
                <Button
                    onClick={this.proceed}
                    label="Proceed"
                    icon="pi pi-arrow-right"
                    style={{ marginLeft: "85em", width: "10em" }}
                    className="p-button-raised p-button-rounded p-button-warning"
                />
            </div>
      </div>
    );
  }
}
