import React, { Component } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import { GMap } from 'primereact/gmap';

export class ProfilePage extends Component {

    constructor() {
        super();
        this.state = {
            selectedAddress: null,
            userAddresses: [
                {label: 'Bilkent', value: '0'},
                {label: 'Yeni Mahalle', value: '1'},
                {label: 'Cepa', value: '2'},
                {label: 'Sanayi', value: '3'},
            ],
            addressSelected: false,
            displayAddressRemoval: false,
            displayInfoChange: false,
            displayPassChange: false,
        }

        this.removeAddress = this.removeAddress.bind(this);
        this.savePasswordChanges = this.savePasswordChanges.bind(this);
        this.savePersonalChanges = this.savePersonalChanges.bind(this);
    }

    savePersonalChanges() {

        this.setState({displayInfoChange: false});
    }

    savePasswordChanges() {

        this.setState({displayPassChange: false});
    }

    removeAddress() {

        this.setState({displayAddressRemoval: false});
    }

    render() {
        const dialogAddressRemovalFooter = (
            <div>
                <Button icon="pi pi-check" onClick={this.removeAddress} label="Yes" />
                <Button icon="pi pi-times" onClick={() => this.setState({displayAddressRemoval:false})} label="No" className="p-button-secondary" />
            </div>
        );

        const dialogInfoChangeFooter = (
            <div>
                <Button icon="pi pi-check" onClick={this.savePersonalChanges} label="Yes" />
                <Button icon="pi pi-times" onClick={() => this.setState({displayInfoChange:false})} label="No" className="p-button-secondary" />
            </div>
        );

        const dialogPassChangeFooter = (
            <div>
                <Button icon="pi pi-check" onClick={this.savePasswordChanges} label="Yes" />
                <Button icon="pi pi-times" onClick={() => this.setState({displayPassChange:false})} label="No" className="p-button-secondary" />
            </div>
        );

        return (
            <div className="p-grid p-fluid">
                <div className="p-col-12">
                    <div className="card card-w-title">
                        <h1 style={{textAlign: "center"}}>Personal Information</h1>
                        <div className="p-grid">
                            <div className="p-col-12 p-md-2">
                                <label htmlFor="firstName">First Name</label>
                            </div>
                            <div className="p-col-12 p-md-10">
                                <InputText id="firstName" placeholder="First name" />
                            </div>
                            <div className="p-col-12 p-md-2">
                                <label htmlFor="lastName">Last Name</label>
                            </div>
                            <div className="p-col-12 p-md-10">
                                <InputText id="lastName" placeholder="Last name" />
                            </div>
                            <div className="p-col-12 p-md-2">
                                <label htmlFor="email">Email Address</label>
                            </div>
                            <div className="p-col-12 p-md-10">
                                <InputText id="email" placeholder="Email" />
                            </div>
                            <Dialog header="Changing Personal Information" visible={this.state.displayInfoChange} modal={true} width="400px" footer={dialogInfoChangeFooter} onHide={() => this.setState({displayInfoChange:false})}>
                                <p>Are you sure to change your personal information?</p>
                            </Dialog>
                            <div className="p-col-12 p-md-2">
                                <Button label="Save Changes" icon="pi pi-check" onClick={() => this.setState({displayInfoChange: true })} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-col-12">
                    <div className="card card-w-title">
                        <h1 style={{textAlign: "center"}}>Addresses</h1>
                            <div className="p-grid">
                                <div className="p-col-12 p-md-2">
                                    <label>Address List</label>
                                </div>
                                <div className="p-col-12 p-md-10">
                                    <Dropdown options={this.state.userAddresses} value={this.state.selectedAddress} onChange={event => this.setState({dropdownAddress: event.value})} placeholder="Select an address" autoWidth={false} />
                                </div>
                            </div>
                            <Dialog header="Removing Address" visible={this.state.displayAddressRemoval} modal={true} width="400px" footer={dialogAddressRemovalFooter} onHide={() => this.setState({displayAddressRemoval:false})}>
                                <p>Are you sure to remove {this.state.addressSelected}?</p>
                            </Dialog>
                            <div className="p-col-12 p-md-2">
                            <Button label="Remove This Address" icon="pi pi-times" onClick={() => this.setState({displayAddressRemoval: true})} />
                            </div>
                    </div>
                </div>

                <div className="p-col-12">
                    <div className="card card-w-title">
                        <h1 style={{textAlign: "center"}}>Password Change</h1>
                        <div className="p-grid">
                            <div className="p-col-12 p-md-2">
                                <label htmlFor="passOld">Current Password</label>
                            </div>
                            <div className="p-col-12 p-md-10">
                                <Password id="passOld" />
                            </div>
                            <div className="p-col-12 p-md-2">
                                <label htmlFor="passNew1">New Password</label>
                            </div>
                            <div className="p-col-12 p-md-10">
                                <Password id="passNew1" />
                            </div>
                            <div className="p-col-12 p-md-2">
                                <label htmlFor="passNew2">Confirm New Password</label>
                            </div>
                            <div className="p-col-12 p-md-10">
                                <Password id="passNew2" />
                            </div>
                            <Dialog header="Changing Password" visible={this.state.displayPassChange} modal={true} width="400px" footer={dialogPassChangeFooter} onHide={() => this.setState({displayPassChange:false})}>
                                <p>Are you sure to change your password?</p>
                            </Dialog>
                            <div className="p-col-12 p-md-2">
                                <Button label="Change Password" icon="pi pi-check" onClick={() => this.setState({displayPassChange: true})} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}