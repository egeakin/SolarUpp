import React, { Component } from 'react';
import { Dropdown } from 'primereact/dropdown';
import {Link} from 'react-router-dom';
import {InputText} from 'primereact/inputtext';
import {Messages} from 'primereact/messages';
import {Message} from 'primereact/message';
import {Button} from 'primereact/button';
import axios from "axios";
import {Growl} from 'primereact/growl';

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
            
        }
        
        this.showError = this.showError.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
    };

    showSuccess() {
        this.growl.show({severity: 'success', summary: 'Success Message', detail: 'System added'});
    }

    saveChanges = (e) => {
        if (this.state.sysName.trim() === '' || !isFinite(this.state.numPanels) || !isFinite(this.state.panelCap) || !isFinite(this.state.inverterSize) || this.state.address.trim() === '' || !isFinite(this.state.postalCode) || !isFinite(this.state.panelAngle)) {
            this.showError();
        }

        let systemInfo = {
            address: this.state.address,
            inverterSize: this.state.inverterSize,
            name: this.state.name,
            panelAngle: this.state.panelAngle,
            numPanels: this.state.numPanels,
            panelCap: this.state.panelCap,
            postalCode: this.state.postalCode,
            systemSize: this.state.systemSize,
        };


        console.log(systemInfo);
        axios
        .post("/addSystem", systemInfo)
        .then((res) => {
            console.log(res);
            this.showSuccess();
            //window.location = "#/feasibility";
            //window.location.reload();
        })
        .catch((err) => {this.showError(); console.log(err)});
    };

    showError() {
        this.messages.show({severity: 'error', summary: 'Invalid arguments', detail: 'Please make sure the details you have entered are valid'});
    }

    render() {
        return (
            <div className="p-grid p-fluid">
                <div className="p-col-12">
                    <div className="card card-w-title">
                        <h1 style={{ textAlign: "center" }}>Add Existing Solar System to SolarUpp</h1>
                        <div className="p-col-12 p-md-6">
                            <label>Name of the system:</label>
                        </div>
                        <InputText value={this.state.sysName} onChange={(e) => this.setState({sysName: e.target.value})} />
                        <div className="p-col-12 p-md-6">
                            <label>Number of panels in the system:</label>
                        </div>
                        <InputText value={this.state.numPanels} onChange={(e) => this.setState({numPanels: e.target.value, sysSize: e.target.value * this.state.panelCap})} />
                        <div className="p-col-12 p-md-6">
                            <label>Maximum power of the panels (W):</label>
                        </div>
                        <InputText value={this.state.panelCap} onChange={(e) => this.setState({panelCap: e.target.value, sysSize: e.target.value * this.state.numPanels})} />
                        <div className="p-col-12 p-md-6">
                            <label>System size (W): {this.state.sysSize}</label>
                        </div>
                        <div className="p-col-12 p-md-6">
                            <label>inverter size (W):</label>
                        </div>
                        <InputText value={this.state.inverterSize} onChange={(e) => this.setState({inverterSize: e.target.value})} />
                        <div className="p-col-12 p-md-6">
                            <label>Address:</label>
                        </div>
                        <InputText value={this.state.address} onChange={(e) => this.setState({address: e.target.value})} />
                        <div className="p-col-12 p-md-6">
                            <label>Postal ZIP code:</label>
                        </div>
                        <InputText value={this.state.postalCode} onChange={(e) => this.setState({postalCode: e.target.value})} />
                        <div className="p-col-12 p-md-6">
                            <label>Angle of the panels:</label>
                        </div>
                        <InputText value={this.state.panelAngle} onChange={(e) => this.setState({panelAngle: e.target.value})} />
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