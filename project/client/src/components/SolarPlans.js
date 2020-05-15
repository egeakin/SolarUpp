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
import "./SolarPlanTable.scss"

export class SolarPlans extends Component { 
    constructor() {
        //var selectedSolarPanel = null;
        //var selectedInverter = null;
        super();
        this.state = {
            dataTableValue:[],
            checkboxValue: [],
            dataViewValue:[],
            selectedSolarPanel: null,
            selectedInverter: null,
            cars: [],
            selectedType: null,
            solarPlans:[
            {index:0, solarPanel:"A Marka", inverter:"B Marka", energyProduction:"high", carbonFootPrint:"88", 
            estimatedProfit10Year:"3000", estimatedProfit20Year:"11200", panelEfficiency:"28", cost:"expensive"},
            {index:1, solarPanel:"A Marka", inverter:"C Marka", energyProduction:"medium", carbonFootPrint:"65", 
            estimatedProfit10Year:"1000", estimatedProfit20Year:"3000", panelEfficiency:"22", cost:"cheap"},
            {index:2, solarPanel:"X Marka", inverter:"S Marka", energyProduction:"medium", carbonFootPrint:"65", 
            estimatedProfit10Year:"1000", estimatedProfit20Year:"3000", panelEfficiency:"22", cost:"cheap"}
            ],
            selectedSolarPlans : null,
        };

      this.carService = new CarService();

      //views
      this.dataViewInverterTemplate = this.dataViewInverterTemplate.bind(this);
      this.dataViewSolarPanelTemplate = this.dataViewSolarPanelTemplate.bind(this);

      //body cells
      this.energyProductionBodyTemplate = this.energyProductionBodyTemplate.bind(this); //status
      this.carbonFootPrintBodyTemplate = this.carbonFootPrintBodyTemplate.bind(this); //progress bar
      this.estimatedProfit10YearBodyTemplate = this.estimatedProfit10YearBodyTemplate.bind(this); //status
      this.estimatedProfit20YearBodyTemplate = this.estimatedProfit20YearBodyTemplate.bind(this); //status
      this.panelEfficiencyBodyTemplate = this.panelEfficiencyBodyTemplate.bind(this); //status
      this.costBodyTemplate = this.costBodyTemplate.bind(this); //status
      this.actionBodyTemplate = this.actionBodyTemplate.bind(this); //delete ve buyutec butonu

      //functions
      this.deleteSolarPlan = this.deleteSolarPlan.bind(this);
      this.getSolarPlanDetail = this.getSolarPlanDetail.bind(this);
      this.addNewSolarPlan = this.addNewSolarPlan.bind(this);
      this.showError = this.showError.bind(this);
    }

    energyProductionBodyTemplate(rowData) {
        return  <span className={classNames('solarPlan-badge', 'energyProduction-' + rowData.energyProduction)}>{rowData.energyProduction}</span>;
    }

    estimatedProfit10YearBodyTemplate(rowData) {
        return <span className={classNames('solarPlan-badge','estimatedProfit10Year-' + rowData.estimatedProfit10Year)}>{rowData.estimatedProfit10Year}</span>;
    }

    estimatedProfit20YearBodyTemplate(rowData) {
        return <span className={classNames('solarPlan-badge','estimatedProfit20Year-' + rowData.estimatedProfit20Year)}>{rowData.estimatedProfit20Year}</span>;
    }

    panelEfficiencyBodyTemplate(rowData) {
        return <span className={classNames('solarPlan-badge','panelEfficiency-' + rowData.panelEfficiency)}>{rowData.panelEfficiency}</span>;
    }

    costBodyTemplate(rowData) {
        return <span className={classNames('solarPlan-badge','cost-' + rowData.cost)}>{rowData.cost}</span>;
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

    deleteSolarPlan(){
       /* console.log(this.state.selectedSolarPlans[0].index);
        var i;
        for(i = 0; i < this.state.selectedSolarPlans.length; i++){
            this.state.solarPlans.splice(this.state.selectedSolarPlans[i].index, 1);
        }*/

        //firebase le bağlantılı delete yapmak doğrusu
    }

    selectInverter(inverter) {
        this.setState({selectedInverter: inverter});
    }

    selecetSolarPanel(solarPanel) {
        this.setState({selectedSolarPanel: solarPanel});
    }

    addNewSolarPlan() {
        if(this.state.selectedSolarPanel === null && this.state.selectedInverter === null) {
            this.showError();
        }
        //pvgise seçilen panel inverter ve userın konum bilgileri gidip yeni plan hesabı gelcek
    }

    showError() {
        let msg = {severity: 'error', summary: 'Error Message', detail: 'Please be sure you choose solar panel and inverter.'};
        this.messages.show(msg);
    }

    renderHeader() {
        return (
            <div>
                List of Solar Plans
            </div>
        );
    }

    componentDidMount() {
        this.carService.getCarsMedium().then(data => this.setState({dataTableValue: data}));
        this.carService.getCarsLarge().then(data => this.setState({dataViewValue: data}));
        this.carService.getCarsMedium().then(data => this.setState({picklistSourceCars: data}));
        this.carService.getCarsSmall().then(data => this.setState({orderlistCars: data}));
    }

    dataViewInverterTemplate(car,layout) {
        if (!car) {
            return;
        }

        let src = "assets/demo/images/car/" + car.brand + ".png";

        if (layout === 'list') {
            return (
                <div className="p-grid" style={{padding: '2em', borderBottom: '1px solid #d9d9d9'}}>
                    <div className="p-col-12 p-md-3">
                        <img src={src} alt={car.brand}/>
                    </div>
                    <div className="p-col-12 p-md-6 car-details">
                        <div className="p-grid">
                            <div className="p-col-2 p-sm-6">Vin:</div>
                            <div className="p-col-10 p-sm-6">{car.vin}</div>

                            <div className="p-col-2 p-sm-6">Year:</div>
                            <div className="p-col-10 p-sm-6">{car.year}</div>

                            <div className="p-col-2 p-sm-6">Brand:</div>
                            <div className="p-col-10 p-sm-6">{car.brand}</div>

                            <div className="p-col-2 p-sm-6">Color:</div>
                            <div className="p-col-10 p-sm-6">{car.color}</div>
                        </div>
                    </div>
                    <div className="p-col-12 p-md-3">
                        <div className="p-vertical">
                            <div className="p-col-6">
                                <Button label="Select" style={{width:'150px'}} onClick={() => this.selectInverter(car)} className="p-button-success"></Button>
                            </div>
                            <div className="p-col-6">
                                <Button label="Detail" style={{width:'150px'}} className="p-button-info"></Button>
                            </div>
                        </div>
                    </div> 
                </div>
            );
        }
    }

    dataViewSolarPanelTemplate(car,layout) {
        if (!car) {
            return;
        }

        let src = "assets/demo/images/car/" + car.brand + ".png";

        if (layout === 'list') {
            return (
                <div className="p-grid" style={{padding: '2em', borderBottom: '1px solid #d9d9d9'}}>
                    <div className="p-col-12 p-md-3">
                        <img src={src} alt={car.brand}/>
                    </div>
                    <div className="p-col-12 p-md-6 car-details">
                        <div className="p-grid">
                            <div className="p-col-2 p-sm-6">Vin:</div>
                            <div className="p-col-10 p-sm-6">{car.vin}</div>

                            <div className="p-col-2 p-sm-6">Year:</div>
                            <div className="p-col-10 p-sm-6">{car.year}</div>

                            <div className="p-col-2 p-sm-6">Brand:</div>
                            <div className="p-col-10 p-sm-6">{car.brand}</div>

                            <div className="p-col-2 p-sm-6">Color:</div>
                            <div className="p-col-10 p-sm-6">{car.color}</div>
                        </div>
                    </div>

                    <div className="p-col-12 p-md-3">
                        <div className="p-vertical">
                            <div className="p-col-6">
                                <Button label="Select" style={{width:'150px'}} onClick={() => this.selecetSolarPanel(car)} className="p-button-success"></Button>
                            </div>
                            <div className="p-col-6">
                                <Button label="Detail" style={{width:'150px'}} className="p-button-info"></Button>
                            </div>
                        </div>
                    </div> 
                </div>
            );
        }
    }

    onSortChange(event) {
        let value = event.value;

        if (value.indexOf('!') === 0)
            this.setState({sortOrder: -1, sortField:value.substring(1, value.length), sortKey: value});
        else
            this.setState({sortOrder: 1, sortField:value, sortKey: value});
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
                                <Column field="estimatedProfit10Year" header="Estimated Profit(10 Year)" body={this.estimatedProfit10YearBodyTemplate} sortable/>
                                <Column field="estimatedProfit20Year" header="Estimated Profit(20 Year)" body={this.estimatedProfit20YearBodyTemplate} sortable/>
                                <Column field="panelEfficiency" header="Panel Efficiency (%)" body={this.panelEfficiencyBodyTemplate} sortable/>
                                <Column field="cost" header="Cost" body={this.costBodyTemplate} sortable/>
                                <Column field="index" body={this.actionBodyTemplate} headerStyle={{width: '8em', textAlign: 'center'}} bodyStyle={{textAlign: 'center', overflow: 'visible'}} />
                            </DataTable>
                        </div>
                    <div className="p-vertical">
                            <div className="p-col-12" style={{textAlign:'left'}}>
                                <Button onClick={this.deleteSolarPlan} label="Delete Solar Plan" style={{marginTop:'5px', width:'250px'}}/>
                            </div>
                            <div className="p-col-12" style={{textAlign:'left'}}>
                                <Button label="Compare Solar Plans" style={{width:'250px'}} className="p-button-success" />
                            </div>
                    </div>
                    <div className="p-col-12">
                        <div className="card card-w-title">
                            <h1>Inverters</h1>
                            <DataView ref={el => this.dv = el} value={this.state.dataViewValue} filterBy="brand" itemTemplate={this.dataViewInverterTemplate} layout={this.state.layout}
                                  paginatorPosition={'bottom'} paginator={true} rows={5} sortOrder={this.state.sortOrder} sortField={this.state.sortField}/>
                        </div>
                    </div>
                    <div className="p-col-12">
                        <div className="card card-w-title">
                            <h1>Solar Panels</h1>
                            <DataView ref={el => this.dv = el} value={this.state.dataViewValue} filterBy="brand" itemTemplate={this.dataViewSolarPanelTemplate} layout={this.state.layout}
                                paginatorPosition={'bottom'} paginator={true} rows={5} sortOrder={this.state.sortOrder} sortField={this.state.sortField}/>
                        </div>
                    </div>
                        <div className="p-col">
                            <Messages ref={(el) => this.messages = el} />
                            <Button label="Add New Solar Plan" onClick={this.addNewSolarPlan} className="p-button-success" style={{width:'250px'}}/>
                        </div>
                </div>
            </div>
        )
    }
}