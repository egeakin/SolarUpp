import React, {Component} from 'react';
import {useState} from 'react';
import {Checkbox} from 'primereact/checkbox';
import {InputText} from 'primereact/inputtext';
import {Message} from 'primereact/message';
import {Button} from 'primereact/button';
import {Slider} from 'primereact/slider';
import {Messages} from 'primereact/messages';
import {OverlayPanel} from 'primereact/overlaypanel';
import {Column} from 'primereact/column'
import {DataTable} from 'primereact/datatable';
import FeasbilityCard from './FeasbilityCard.js';
import "./centerPanel.scss"
import axios from 'axios';

export class Feasibility extends Component {
    
    constructor() {
        var newFeasibilityStudy;
        super();
        this.state = {
            checkboxValue: [],
            rangeValues: [0,60],
            width: null,
            height: null,
            freeSpace: 100,
            occupiedSpace: null,
            buildingFacade: null,
            latitude: 39.875,
            longitude: 32.714,
            buildingType: null,
            roofAngle: null,
            roofMaterials: [],
            roofImage: null,
            solarPlans:[{index:1, solarPanel:"A Marka", inverter:"B Marka", energyProduction:"high", carbonFootPrint:"88", 
            estimatedProfit10Year:"3000", estimatedProfit20Year:"11200", panelEfficiency:"28", cost:"expensive"},
            {index:2,solarPanel:"A Marka", inverter:"C Marka", energyProduction:"medium", carbonFootPrint:"65", 
            estimatedProfit10Year:"1000", estimatedProfit20Year:"3000", panelEfficiency:"22", cost:"cheap"}
            ],
            feasibilityStudy: null,
            isResponseFetched: false,
            averageConsumption: 830,
            selectedBuilding: null,
            buildings: [{buildingName: "Ev1", buildingType: "House", address: "angora evleri 51", freeSpace: "115"},
                        {buildingName: "Ofis", buildingType: "Office", address: "Cyberpark Tepe Binase", freeSpace: "88"}]
        };

        this.restoreToDefaultValues = this.restoreToDefaultValues.bind(this);
        this.calculateFeasibility = this.calculateFeasibility.bind(this);
        this.selectBuilding = this.selectBuilding.bind(this);
        this.onChangeRangeSlider = this.onChangeRangeSlider.bind(this);
        this.onCheckboxChange = this.onCheckboxChange.bind(this);
    }

    calculateFeasibility(event) {
        let angle;
        if(Array.isArray(this.state.roofAngle) == true) {
            angle = (this.state.roofAngle[0] + this.state.roofAngle[1]) / 2;
        }
        else if (this.state.roofAngle == null){
            angle = '35';
        }
        else if(Array.isArray(this.state.roofAngle) == false){
            angle = this.state.roofAngle;
        }
        
        //send request
        let url = 'https://cors-anywhere.herokuapp.com/https://re.jrc.ec.europa.eu/api/PVcalc?' +
            'lat=' + this.state.latitude + '&' +
            'lon=' + this.state.longitude + '&' +
            'mountingplace=' + 'building' + '&' + 
        //  'pvtechchoice=' + obj.pvtechchoice + '&' +
            'peakpower=' + (this.state.freeSpace*17)/100 + '&' +
            'loss=' + '14' + '&' +
            'outputformat=' + 'json' + '&' +
            'angle=' + angle;
        //'aspect=' + obj.aspect;
        
        axios.get(url)
        .then((response) => {
            this.printFeasbilityStudy(response);
        })
        .then(() => {
            var event = new Event('build');
            // Listen for the event.
            document.addEventListener('build', this.openFeasibilityCard (event) , false);
        })
        this.messages.show({severity: 'info', summary: 'Info Message:', detail: 'Done feasbility study will be shown.'});
    }

    openFeasibilityCard(event) {
        this.setState({isResponseFetched: true});
        this.op1.toggle(event);
    }


    printFeasbilityStudy(res) {
        this.newFeasibilityStudy = res.data;

        return new Promise((resolve) => {
            if(this.newFeasibilityStudy != null) {
                resolve()
            }
        })   
    }

    restoreToDefaultValues() {
        this.messages.show({severity: 'info', summary: 'Info Message', detail: 'Default values Restored'});
        //this.setState({width: 30, height: 20, freeSpace: '450m^2', occupiedSpace: '150m^2', buildingFacade: 'South', latitude: 45, longitude: 8, buildingType: 'House'});
    }

    onCheckboxChange(event){
        let selected = [...this.state.checkboxValue];
        if (event.checked)
            selected.push(event.value);
        else
            selected.splice(selected.indexOf(event.value), 1);

        this.setState({checkboxValue: selected});
        this.setState({roofMaterials: this.checkboxValue});
    }


    onChangeRangeSlider(e) {
        this.setState({ rangeValues: e.value });
        this.setState({roofAngle: e.value});
    }

    selectBuilding() {

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
        //this.setState({width: , height: , freeSpace: '450m^2', occupiedSpace: '150m^2', buildingFacade: 'South', latitude: 45, longitude: 8, buildingType: 'House'});
    }

    

    render() {
        return (
            <div className="p-grid">
                <div className="p-col-12">
                    <div className="card">
                        <h1>Calculate Your Solar Potential</h1>
                        <p>Enter required information to have solar feasibility study.</p>
                    </div>
                    <div className="card card-w-title">
                        <h1>Your Registered Buildlings</h1>
                        <DataTable value={this.state.buildings} paginatorPosition="bottom" selectionMode="single" header="Your Buildings" paginator={true} rows={10}
                            responsive={true} selection={this.state.dataTableSelection} onSelectionChange={event => this.setState({dataTableSelection: event.value})}>
                            <Column field="buildingName" header="Building Name" sortable={false}/>
                            <Column field="buildingType" header="Building Type" sortable={false}/>
                            <Column field="address" header="Adress" sortable={false}/>
                            <Column field="freeSpace" header="Free Space" sortable={false}/>
                        </DataTable>
                    </div>
                    <Button label="Select Building" onClick={this.selectBuilding} aria-controls="overlay_panel" aria-haspopup={true} style={{width: '200px', height: '50px'}} className="p-button-success" />
                </div>

                
                
                <div className="p-col-12">
                    <div className="p-grid">
                    <div className="p-col-12 p-lg-4">
                        <div className="card card-w-title" style={{height:'350px'}}>
                            <h1>Choose Your Roof Material</h1>
                            <div className="p-vertical">
                                <div className="p-col-12">
                                    <Checkbox value="Asphalt Roofs" inputId="cb1" onChange={this.onCheckboxChange} 
                                    checked={this.state.checkboxValue.indexOf('Asphalt Roofs') > -1} />
                                    <label htmlFor="cb1" className="p-checkbox-label">Asphalt Roofs</label>
                                </div>
                                <div className="p-col-12">
                                    <Checkbox value="Wood Shingles" inputId="cb2" onChange={this.onCheckboxChange} 
                                    checked={this.state.checkboxValue.indexOf('Wood Shingles') > -1} />
                                    <label htmlFor="cb2" className="p-checkbox-label">Wood Shingles</label>
                                </div>
                                <div className="p-col-12">
                                    <Checkbox value="Metal Roofs" inputId="cb3" onChange={this.onCheckboxChange} 
                                    checked={this.state.checkboxValue.indexOf('Metal Roofs') > -1} />
                                    <label htmlFor="cb3" className="p-checkbox-label">Metal Roofs</label>
                                </div>
                                <div className="p-col-12">
                                    <Checkbox value="Prefabric" inputId="cb4" onChange={this.onCheckboxChange} 
                                    checked={this.state.checkboxValue.indexOf('Prefabric') > -1} />
                                    <label htmlFor="cb4" className="p-checkbox-label">Prefabric</label>
                                </div>
                                <div className="p-col-12">
                                    <Checkbox value="Clay" inputId="cb5" onChange={this.onCheckboxChange} 
                                    checked={this.state.checkboxValue.indexOf('Clay') > -1} />
                                    <label htmlFor="cb5" className="p-checkbox-label">Clay</label>
                                </div>
                                <div className="p-col-12">
                                    <Checkbox value="Cement" inputId="cb6" onChange={this.onCheckboxChange} 
                                    checked={this.state.checkboxValue.indexOf('Cement') > -1} />
                                    <label htmlFor="cb6" className="p-checkbox-label">Cement</label>
                                </div>
                                <div className="p-col-12">
                                    <Checkbox value="Slate" inputId="cb7" onChange={this.onCheckboxChange} 
                                    checked={this.state.checkboxValue.indexOf('Slate') > -1} />
                                    <label htmlFor="cb7" className="p-checkbox-label">Slate</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-col-12 p-lg-8">
                        <div className="card card-w-title" style={{height:'350px'}}>
                            <h1>Roof Angel</h1>
                            <div className="p-vertical">
                                <div className="p-cl-12">
                                    <h3>Adjust Your Roof Angle Range: {this.state.rangeValues[0]},{this.state.rangeValues[1]}</h3>
                                    <Slider value={this.state.rangeValues} max={60} onChange={this.onChangeRangeSlider} range={true} style={{width: '14em'}} />
                                </div>
                                <div className="p-col-12" style={{height:'20px'}}>
                                    
                                </div>
                                <div className="p-col-12">
                                    <Message severity="warn" text="If you know exact angle, please enter in building properties below." style={{width: '250px'}}/>
                                </div>
                                <div className="p-col-12">
                                    <Button type="button" label="Click to have an idea" onClick={(e) => this.op.toggle(e)} aria-controls="overlay_panel" aria-haspopup={true}/>
                                    <OverlayPanel ref={(el) => this.op = el} id="overlay_panel" showCloseIcon={true} >
                                        <img src="assets/layout/images/roofAngle.png" alt="Roof Angle" />
                                    </OverlayPanel>
                                </div>
                            </div> 
                        </div>
                    </div>
                    </div>                
                </div>
                <div className="p-col-12 p-lg-6">
                    <div className="card card-w-title" style={{height:'500px'}}>
                    <h1>Your Roof</h1>
                        <div className="p-col-12 p-md-6">
                            <img src="assets/layout/images/roof1.png" width="450" height="400" alt="roof1"/>
                        </div>
                    </div>
                </div>
                <div className="p-col-12 p-lg-6">
                    <div className="card card-w-title" style={{height:'500px'}}>
                    <h1>Building Properties</h1>
                        <div className="p-col-12">
                            <div className="p-grid">
                                <div className="p-col-6">
                                    <div className="p-grid">
                                        <div className="p-col-6">
                                            <label htmlFor="freeSpace">Free Space: </label>
                                        </div>
                                        <div className="p-col-6">
                                            <InputText value={this.state.freeSpace} style={{width:'100px'}} onChange={(e) => this.setState({freeSpace: e.target.value})} rows={1} cols={10}></InputText>
                                        </div>
                                    </div>
                                    <div className="p-grid">
                                        <div className="p-col-6">
                                            <label htmlFor="occupiedSpace">Occupied Space: </label>
                                        </div>
                                        <div className="p-col-6">
                                            <InputText value={this.state.occupiedSpace} style={{width:'100px'}} onChange={(e) => this.setState({occupiedSpace: e.target.value})} rows={1} cols={10}></InputText>
                                        </div>
                                    </div>
                                    <div className="p-grid">
                                        <div className="p-col-6">
                                            <label htmlFor="enlem">Latitude: </label>
                                        </div>
                                        <div className="p-col-6">
                                            <InputText value={this.state.latitude} style={{width:'100px'}} onChange={(e) => this.setState({latitude: e.target.value})} rows={1} cols={10}></InputText>
                                        </div>
                                    </div>
                                    <div className="p-grid">
                                        <div className="p-col-6">
                                            <label htmlFor="boylam">Longitude: </label>
                                        </div>
                                        <div className="p-col-6">
                                            <InputText value={this.state.longitude} style={{width:'100px'}} onChange={(e) => this.setState({longitude: e.target.value})} rows={1} cols={10}></InputText>
                                        </div>
                                    </div>
                                    <div className="p-grid">
                                        <div className="p-col-6">
                                            <label htmlFor="type">Building Type: </label>
                                        </div>
                                        <div className="p-col-6"> 
                                            <InputText value={this.state.buildingType} style={{width:'100px'}} onChange={(e) => this.setState({buildingType: e.target.value})} rows={1} cols={10}></InputText>
                                        </div>
                                    </div>
                                    <div className="p-grid">
                                        <div className="p-col-6">
                                            <label htmlFor="type">Roof Angle: </label>
                                        </div>
                                        <div className="p-col-6"> 
                                            <InputText value={this.state.roofAngle} style={{width:'100px'}} onChange={(e) => this.setState({roofAngle: e.target.value})} rows={1} cols={10}></InputText>
                                        </div>
                                    </div>
                                    <div className="p-grid">
                                        <div className="p-col-6">
                                            <label htmlFor="type">Monthly Elecricity Consumption (kWh): </label>
                                        </div>
                                        <div className="p-col-6"> 
                                            <InputText value={this.state.averageConsumption} style={{width:'100px'}} onChange={(e) => this.setState({averageConsumption: e.target.value})} rows={1} cols={10}></InputText>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-col-6">
                                    <div className="p-vertical">
                                        <div className="p-col-12">
                                            <Message severity="warn" text="If you know exact values for your building, please enter them." style={{width: '200px'}} />
                                        </div>
                                        <div className="p-col-12">
                                            <Messages ref={(el) => this.messages = el} />
                                            <Button onClick={this.restoreToDefaultValues} label="Restore to default values" className="p-button-info" style={{width: '200px', height: '50px'}}/>
                                        </div>
                                        <div className="p-col-12">
                                            <Button label="Calculate Feasability" onClick={this.calculateFeasibility} aria-controls="overlay_panel" aria-haspopup={true} style={{width: '200px', height: '50px'}} className="p-button-success" />
                                            {this.state.isResponseFetched &&
                                                (
                                                    <div className="panelScreen"> 
                                                        <OverlayPanel ref={(el) => this.op1 = el} id="overlay_panel" showCloseIcon={true} >
                                                            <FeasbilityCard feasbilityInfo={this.newFeasibilityStudy} freeSpace={this.state.freeSpace} averageConsumption={this.state.averageConsumption} />
                                                        </OverlayPanel>
                                                    </div>
                                                )
                                            }
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