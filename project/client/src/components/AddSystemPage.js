import React, { Component } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Messages } from 'primereact/messages';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';
import axios from "axios";
import { Growl } from 'primereact/growl';
import { Checkbox } from 'primereact/checkbox';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';

export class AddSystemPage extends Component {
    constructor() {
        super();
        this.state = {
            sysName: '',
            numPanels: 0,
            panelCap: 0,
            sysSize: 0,
            inverterSize: 0,
            address: '',
            postalCode: null,
            panelAngle: null,
            age: 0,
            dynamicAngle: false,
            country: '',
            region: '',
            selectedBuilding: null,
            Buildings: [],
            lat: null,
            long: null,
            roofId: null,
        }

        this.showError = this.showError.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
    };

    showSuccess() {
        this.growl.show({ severity: 'success', summary: 'Success Message', detail: 'System added' });
    }

    saveChanges = (e) => {
        if (this.state.sysName.trim() === '' || !isFinite(this.state.numPanels) || !isFinite(this.state.panelCap) || !isFinite(this.state.inverterSize) || this.state.address.trim() === '' || !isFinite(this.state.postalCode) || !(isFinite(this.state.panelAngle) || this.state.dynamicAngle)) {
            this.showError();
            return;
        }

        let url =
            "https://cors-anywhere.herokuapp.com/https://re.jrc.ec.europa.eu/api/PVcalc?" +
            "lat=" +
            this.state.lat +
            "&" +
            "lon=" +
            this.state.long +
            "&" +
            "mountingplace=" +
            "building" +
            "&" +
            //  'pvtechchoice=' + obj.pvtechchoice + '&' +
            "peakpower=" +
            Math.min(this.state.systemSize, this.state.inverterSize) +
            "&" +
            "loss=" +
            "14" +
            "&" +
            "outputformat=" +
            "json" +
            "&" +
            "angle=" +
            this.state.panelAngle;

        var monthlydata = [];
        axios
            .get(url)
            .then((response) => {
                console.log(response);
                let i;
                for (i = 0; i < response.data.outputs.monthly.fixed.length; i++) {
                    monthlydata.push(response.data.outputs.monthly.fixed[i].E_m);
                }
            })

        let systemInfo = {
            address: this.state.address,
            inverterSize: this.state.inverterSize,
            name: this.state.sysName,
            panelAngle: this.state.panelAngle,
            numPanels: this.state.numPanels,
            panelCap: this.state.panelCap,
            postalCode: this.state.postalCode,
            systemSize: this.state.sysSize,
            age: this.state.age,
            dynamicAngle: this.state.dynamicAngle,
            country: this.state.country,
            region: this.state.region,
            lat: this.state.lat,
            long: this.state.long,
            roofId: this.state.roofId,
            estimates: monthlydata,
        };


        console.log(systemInfo);
        axios
            .post("/addSystem", systemInfo)
            .then((response) => {
                console.log(response);
                this.showSuccess();
                //window.location = "#/feasibility";
                //window.location.reload();
            })
            .catch((err) => { this.showError(); console.log(err) });


    };

    selectCountry(val) {
        this.setState({ country: val });
    }

    selectRegion(val) {
        this.setState({ region: val });
    }

    showError() {
        this.messages.show({ severity: 'error', summary: 'Invalid arguments', detail: 'Please make sure the details you have entered are valid' });
    }

    componentDidMount() {
        let data;
        axios
            .get("/getRoof")
            .then((res) => {
                data = res.data;
                console.log(data);
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

    render() {
        const { country, region } = this.state;
        return (
            <div className="p-grid p-fluid">
                <div className="p-col-12">
                    <div className="card card-w-title">
                        <h1 style={{ textAlign: "center" }}>Add Existing Solar System to SolarUpp</h1>
                        <div className="card card-w-title">
                            <h1>Your Registered Buildings</h1>
                            <DataTable
                                value={this.state.buildings}
                                paginatorPosition="bottom"
                                selectionMode="single"
                                header="Your Buildings"
                                paginator={true}
                                rows={10}
                                responsive={true}
                                selection={this.state.selectedBuilding}
                                onSelectionChange={(event) =>
                                    this.setState({
                                        selectedBuilding: event.value, roofId: event.value.roofId,
                                        lat: event.value.roofCoordinates[0]["y"], long: event.value.roofCoordinates[0]['x'],
                                        address: event.value.address,
                                    })
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
                                <Column field="address" header="Address" sortable={false} />
                                <Column field="roofArea" header="Roof Area" sortable={false} />
                            </DataTable>
                        </div>
                        <div className="p-col-12 p-md-6">
                            <label>Name of the system:</label>
                        </div>
                        <InputText value={this.state.sysName} onChange={(e) => this.setState({ sysName: e.target.value })} />
                        <div className="p-col-12 p-md-6">
                            <label>Number of panels in the system:</label>
                        </div>
                        <InputText value={this.state.numPanels} onChange={(e) => this.setState({ numPanels: e.target.value, sysSize: e.target.value * this.state.panelCap })} />
                        <div className="p-col-12 p-md-6">
                            <label>Maximum power of the panels (W):</label>
                        </div>
                        <InputText value={this.state.panelCap} onChange={(e) => this.setState({ panelCap: e.target.value, sysSize: e.target.value * this.state.numPanels })} />
                        <div className="p-col-12 p-md-6">
                            <label style={{ marginTop: 5 }}>System size (W): {this.state.sysSize}</label>
                        </div>
                        <div className="p-col-12 p-md-6">
                            <label>Inverter size (W):</label>
                        </div>
                        <InputText value={this.state.inverterSize} onChange={(e) => this.setState({ inverterSize: e.target.value })} />
                        <div className="p-col-12 p-md-6">
                            <label>Age of the system:</label>
                        </div>
                        <InputText value={this.state.age} onChange={(e) => this.setState({ age: e.target.value })} />
                        <div className="p-col-12 p-md-6">
                            <label style={{ marginTop: 5 }}>Address: {this.state.address}</label>
                        </div>
                        <div className="p-col-12 p-md-6">
                            <label>Country and Region:</label>
                        </div>
                        <div style={{ marginTop: 0, }}>
                            <CountryDropdown
                                value={country}
                                onChange={(val) => this.selectCountry(val)} />
                            <RegionDropdown
                                style={{ marginLeft: 10, }}
                                country={country}
                                value={region}
                                onChange={(val) => this.selectRegion(val)} />
                        </div>
                        <div className="p-col-12 p-md-6">
                            <label>Postal ZIP code:</label>
                        </div>
                        <InputText value={this.state.postalCode} onChange={(e) => this.setState({ postalCode: e.target.value })} />
                        <div className="p-col-12 p-md-6">
                            <label>Angle of the panels:</label>
                        </div>
                        <InputText value={this.state.panelAngle} onChange={(e) => this.setState({ panelAngle: e.target.value })} />
                    </div>
                    <Messages ref={(el) => this.messages = el} />
                    <Growl ref={(el) => this.growl = el} />
                    <Button
                        type="button"
                        label="Save your setup"
                        onClick={(e) => this.saveChanges(e)}
                    />
                </div>
            </div>
        );
    }
}