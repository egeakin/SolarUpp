import React, {Component} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {CarService} from '../service/CarService';
import {Button} from 'primereact/button';
import {DataView, DataViewLayoutOptions} from 'primereact/dataview';
import {Panel} from 'primereact/panel';
import classNames from 'classnames';
import {ProgressBar} from 'primereact/progressbar';
import {OverlayPanel} from 'primereact/overlaypanel';
import {Messages} from 'primereact/messages';
import {DataScroller} from 'primereact/datascroller';
import "./SolarPlanTable.scss"
import axios from 'axios';


export class SolarPlans extends Component { 
    constructor() {
        var selectedSolarPanel = null;
        var selectedInverter = null;
        var newFeasibilityStudy = null;
        super();
        this.state = {
            dataTableValue:[],
            checkboxValue: [],
            inverterData: [],
            solarPanelData: [],
            selectedSolarPanel: null,
            selectedInverter: null,
            layout: 'list',
            cars: [],
            selectedType: null,
            solarPlans:[
            {index:0, solarPanel:"Default", inverter:"Default", energyProduction:220000, carbonFootPrint:88, 
            estimatedProfit25Year:11200, panelEfficiency:28, cost:100000},
            {index:1, solarPanel:"A Marka", inverter:"C Marka", energyProduction:150000, carbonFootPrint:65, 
            estimatedProfit25Year:3000, panelEfficiency:22, cost:40000},
            {index:2, solarPanel:"X Marka", inverter:"S Marka", energyProduction:135000, carbonFootPrint:65, 
            estimatedProfit25Year:3000, panelEfficiency:22, cost:35000}
            ],
            selectedSolarPlans: null, 
            angle: 35,
            freeSpace: 100,
            latitude: 39.875,
            longitude: 32.714,
            annualConsumption: 12000
        };


      //views
      this.dataViewInverterTemplate = this.dataViewInverterTemplate.bind(this);
      this.dataViewSolarPanelTemplate = this.dataViewSolarPanelTemplate.bind(this);

      //body cells
      this.energyProductionBodyTemplate = this.energyProductionBodyTemplate.bind(this); //status
      this.carbonFootPrintBodyTemplate = this.carbonFootPrintBodyTemplate.bind(this); //progress bar
      this.estimatedProfit25YearBodyTemplate = this.estimatedProfit25YearBodyTemplate.bind(this); //status
      this.panelEfficiencyBodyTemplate = this.panelEfficiencyBodyTemplate.bind(this); //status
      this.costBodyTemplate = this.costBodyTemplate.bind(this); //status
      this.actionBodyTemplate = this.actionBodyTemplate.bind(this); //delete ve buyutec butonu

      //functions
      this.getSolarPlanDetail = this.getSolarPlanDetail.bind(this);
      this.addNewSolarPlan = this.addNewSolarPlan.bind(this);
      this.showError = this.showError.bind(this);
      this.getInverter = this.getInverter.bind(this);
    }

    calculteRank(rowData, category) {
        let size = this.state.solarPlans.length
        let categoryData = [];
        let i;
        for(i = 0; i < size; i++){
            categoryData.push(this.state.solarPlans[i][category]);
        }
        categoryData.sort();
        console.log(categoryData);
        let data = rowData[category];
        console.log(data);
        let index = categoryData.indexOf(data);

        if(size == 1) {
            return "medium";
        }
        else if(size == 2) {
            if(index > 0) {
                return "high";
            }
            else{
                return "medium";
            }
        }
        else {
            if(index < (size/3)){
                return "low";
            }
            else if(index >= (size/3) && index < ((size/3)*2)){
                return "medium";
            }
            else if(index >= ((size/3)*2)){
                return "high";
            }
        }
    }

    energyProductionBodyTemplate(rowData) {
        return  <span className={classNames('solarPlan-badge', 'energyProduction-' + this.calculteRank(rowData, 'energyProduction'))}>{rowData.energyProduction}</span>;
    }


    estimatedProfit25YearBodyTemplate(rowData) {
        return <span className={classNames('solarPlan-badge','estimatedProfit25Year-' + this.calculteRank(rowData, 'estimatedProfit25Year'))}>{rowData.estimatedProfit25Year}</span>;
    }

    panelEfficiencyBodyTemplate(rowData) {
        return <span className={classNames('solarPlan-badge','panelEfficiency-' + this.calculteRank(rowData, 'panelEfficiency'))}>{rowData.panelEfficiency}</span>;
    }

    costBodyTemplate(rowData) {
        return <span className={classNames('solarPlan-badge','cost-' + this.calculteRank(rowData, 'cost'))}>{rowData.cost}</span>;
    }
    
    carbonFootPrintBodyTemplate(rowData) {
        return <ProgressBar value={rowData.carbonFootPrint} showValue={false} />;
    }

    getSolarPlanDetail(planNumber) {
        //console.log(planNumber);
    }


    actionBodyTemplate(rowData) {
        return (
            <div>
                <Button type="button" onClick={this.getSolarPlanDetail(rowData.index)} icon="pi pi-search" className="p-button-secondary"></Button>
            </div>
        );
    }

    selectInverter(inverter) {
        this.selectedInverter = inverter;
    }

    selectSolarPanel(solarPanel) {
        this.selectedSolarPanel = solarPanel;
    }

    showError() {
        let msg = {severity: 'error', summary: 'Error Message', detail: 'Please be sure you choose solar panel and inverter.'};
        this.messages.show(msg);
    }

    getSolarPanels() {
        return axios.get("/getPanels")
                .then(res => res.data);
    }

    getInverter() {
        return axios.get("/getInverters")
                .then(res => res.data);
    }

    addNewSolarPlan() {
        //pvgise seçilen panel inverter ve userın konum bilgileri gidip yeni plan hesabı gelcek
        if(this.selectedSolarPanel != null && this.selectedInverter != null) {
            var newSolarPlan = {
                inverter: this.selectedInverter.name,
                solarPanel: this.selectedSolarPanel.name,
                energyProduction: null,
                estimatedProfit25Year: null,
                carbonFootPrint: null,
                panelEfficiency: this.selectedSolarPanel.efficiency,
                cost: null
            }
            this.calculateFeasibilityStudy(newSolarPlan);
        }
        else{
            this.showError();
        }  
    }

    calculateFeasibilityStudy(newSolarPlan) {
        this.sendRequest(newSolarPlan);

    }

    sendRequest(newSolarPlan) {
        //send query to pvgis with selected panel and inverter
        let panelEfficiency = this.selectedSolarPanel.efficiency;
        let inverterEfficiency = this.selectedInverter.efficiency;
        let systemLoss = 14 - ((inverterEfficiency - 93) * 0.9);

        //send request
        let url = 'https://cors-anywhere.herokuapp.com/https://re.jrc.ec.europa.eu/api/PVcalc?' +
            'lat=' + this.state.latitude + '&' +
            'lon=' + this.state.longitude + '&' +
            'mountingplace=' + 'building' + '&' + 
        //  'pvtechchoice=' + obj.pvtechchoice + '&' +
            'peakpower=' + (this.state.freeSpace*panelEfficiency)/100 + '&' +
            'loss=' + systemLoss + '&' +
            'outputformat=' + 'json' + '&' +
            'angle=' + this.state.angle;
        //'aspect=' + obj.aspect;

        axios.get(url)
        .then((response) => {
            console.log(response);
            this.newFeasibilityStudy = response.data;
            newSolarPlan.energyProduction = this.newFeasibilityStudy.outputs.totals.fixed.E_y;
            newSolarPlan.carbonFootPrint = this.calculateCarbonFootPrint(this.newFeasibilityStudy);
            newSolarPlan.estimatedProfit25Year = this.calculateSaving(this.newFeasibilityStudy);
            newSolarPlan.cost = this.calculateSystemCost();
            console.log(newSolarPlan);
            this.state.solarPlans.push(newSolarPlan);
        })
    }

    calculateCarbonFootPrint(newFeasibilityStudy) {
        return (newFeasibilityStudy.outputs.totals.fixed.E_y* 0.534) / 1000;
    }

    calculateSaving(newFeasibilityStudy) {
      //   let peakPower = (freeSpace*17)/100;
     //   console.log(peakPower);
        let systemCost = ((this.state.freeSpace*this.selectedSolarPanel.efficiency) / 100)*16000 + this.selectedInverter.price;
        return (newFeasibilityStudy.outputs.totals.fixed.E_y* 0.5 * 25) - systemCost;
    }

    calculateSystemCost() {
        return ((this.state.freeSpace*this.selectedSolarPanel.efficiency) / 100)*16000 + this.selectedInverter.price;
    }

    renderHeader() {
        return (
            <div>
                List of Solar Plans
            </div>
        );
    }

    componentDidMount() {
        this.getSolarPanels().then(data => this.setState({solarPanelData: data}));
        this.getInverter().then(data => this.setState({inverterData: data}));
    }

    dataViewInverterTemplate(inverter) {
        if (!inverter) {
            return;
        }
            return (
                <div className="p-grid" style={{padding: '2em', borderBottom: '1px solid #d9d9d9'}}>
                    <div className="p-col-12 p-md-3">
                        <img src={inverter.image}/>
                    </div>
                    <div className="p-col-12 p-md-6 car-details">
                        <div className="p-grid">
                            <div className="p-col-2 p-sm-6"><b>Name:</b></div>
                            <div className="p-col-10 p-sm-6"><b>{inverter.name}</b></div>

                            <div className="p-col-2 p-sm-6"><b>Efficiency:</b></div>
                            <div className="p-col-10 p-sm-6"><b>{inverter.efficiency}%</b></div>

                            <div className="p-col-2 p-sm-6"><b>Peak AC Power:</b></div>
                            <div className="p-col-10 p-sm-6"><b>{inverter.peakACPower} W</b></div>

                            <div className="p-col-2 p-sm-6"><b>Price:</b></div>
                            <div className="p-col-10 p-sm-6"><b>{inverter.price} ₺</b></div>
                        </div>
                    </div>
                    <div className="p-col-12 p-md-3">
                        <div className="p-vertical">
                            <div className="p-col-6">
                                <Button label="Select" style={{width:'150px'}} onClick={() => this.selectInverter(inverter)} className="p-button-success"></Button>
                            </div>
                            <div className="p-col-6">
                                <Button label="Detail" style={{width:'150px'}} onClick={(e) => this.op.toggle(e)} className="p-button-info"></Button>
                                <OverlayPanel ref={(el) => this.op = el} id="overlay_panel" showCloseIcon={true} >
                                        <img src={inverter.info}/>
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
                <div className="p-grid" style={{padding: '2em', borderBottom: '1px solid #d9d9d9'}}>
                    <div className="p-col-12 p-md-3">
                        <img src={panel.image}/>
                    </div>
                    <div className="p-col-12 p-md-6 car-details">
                        <div className="p-grid">
                            <div className="p-col-2 p-sm-6"><b>Panel Name:</b></div>
                            <div className="p-col-10 p-sm-6"><b>{panel.name}</b></div>

                            <div className="p-col-2 p-sm-6"><b>Peak Power:</b></div>
                            <div className="p-col-10 p-sm-6"><b>{panel.peakPower }W</b></div>

                            <div className="p-col-2 p-sm-6"><b>Efficiency:</b></div>
                            <div className="p-col-10 p-sm-6"><b>{panel.efficiency}%</b></div>

                            <div className="p-col-2 p-sm-6"><b>Price:</b></div>
                            <div className="p-col-10 p-sm-6"><b>{panel.price} ₺</b></div>

                            <div className="p-col-2 p-sm-6"><b>Panel Type:</b></div>
                            <div className="p-col-10 p-sm-6"><b>{panel.type}</b></div>
                        </div>
                    </div>

                    <div className="p-col-12 p-md-3">
                        <div className="p-vertical">
                            <div className="p-col-6">
                                <Button label="Select" style={{width:'150px'}} onClick={() => this.selectSolarPanel(panel)} className="p-button-success"></Button>
                            </div>
                            <div className="p-col-6">
                                <Button label="Detail" style={{width:'150px'}} onClick={(e) => this.op1.toggle(e)} className="p-button-info"></Button>
                                <OverlayPanel ref={(el) => this.op1 = el} id="overlay_panel" showCloseIcon={true} >
                                        <img src={panel.info}/>
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
                    <div className="datatable-solarPlans"> 
                            <DataTable ref={(el) => this.dt = el} value={this.state.solarPlans} header={header} selection={this.state.selectedSolarPlans} 
                                onSelectionChange={e => this.setState({selectedSolarPlans: e.value})} emptyMessage="No solar plans found">
                                <Column selectionMode="multiple" style={{width:'3em'}}/>
                                <Column field="solarPanel" header="Solar Panel" sortable={false}/>
                                <Column field="inverter" header="Inverter" sortable={false}/>
                                <Column field="energyProduction" header="Energy Production mWh(Annual)" body={this.energyProductionBodyTemplate} sortable/>
                                <Column field="carbonFootPrint" header="Carbon Foot Print" body={this.carbonFootPrintBodyTemplate}/>
                                <Column field="estimatedProfit25Year" header="Estimated Profit(25 Year)" body={this.estimatedProfit25YearBodyTemplate} sortable/>
                                <Column field="panelEfficiency" header="Panel Efficiency (%)" body={this.panelEfficiencyBodyTemplate} sortable/>
                                <Column field="cost" header="Cost" body={this.costBodyTemplate} sortable/>
                                <Column field="index" body={this.actionBodyTemplate} headerStyle={{width: '8em', textAlign: 'center'}} bodyStyle={{textAlign: 'center', overflow: 'visible'}} />
                            </DataTable>
                        </div>
                    <div className="p-vertical">
                            <div className="p-col-12" style={{textAlign:'left'}}>
                                <Button label="Compare Solar Plans" style={{width:'250px'}} className="p-button-success" />
                            </div>
                            <div className="p-col">
                                <Messages ref={(el) => this.messages = el} />
                                <Button label="Add New Solar Plan" onClick={this.addNewSolarPlan} className="p-button-success" style={{width:'250px'}}/>
                            </div>
                        </div>
                            <div className="p-col-12">
                                <div className="card card-w-title">
                                    <h1>Inverters</h1>
                                    <DataScroller value={this.state.inverterData} itemTemplate={this.dataViewInverterTemplate}
                                    rows={this.state.inverterData.length} buffer={0.6} header="List of Inverters" />
                                </div>
                            </div>
                            <div className="p-col-12">
                                <div className="card card-w-title">
                                    <h1>Solar Panels</h1>
                                    <DataScroller value={this.state.solarPanelData} itemTemplate={this.dataViewSolarPanelTemplate}
                                    rows={this.state.solarPanelData.length} buffer={0.6} header="List of Solar Panels" />
                                </div> 
                            </div>
                        </div>
                    </div>
        );
    }
}