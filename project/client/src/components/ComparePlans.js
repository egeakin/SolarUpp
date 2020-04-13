import React, { Component } from 'react';
import { Dropdown } from 'primereact/dropdown';

export class ComparePlans extends Component {

    constructor() {
        super();
        this.state = {
            selectedAddress1: null,
            selectedAddress2: null,
            address1Selected: false,
            address2Selected: false,
            selectedPlan1: null,
            selectedPlan2: null,
            plan1Selected: false,
            plan2Selected: false,
            userAddresses: [
                { label: 'Bilkent', value: '0' },
                { label: 'Yeni Mahalle', value: '1' },
                { label: 'Cepa', value: '2' },
                { label: 'Sanayi', value: '3' },
            ],
            userPlans: [
                { label: 'uzun vadeli', value: '0' },
                { label: 'orta vadeli', value: '1' },
                { label: 'kısa vadeli', value: '2' },
            ],
        }
    };

    render() {
        return (
            <div className="p-grid p-fluid">
                <div className="p-col-12 p-md-6 p-lg-12">
                    <div className="card card-w-title" style={{ alignItems: "center" }, { justifyContent: "center" }}>
                        <h1 style={{ textAlign: 'center' }}>Compare Plans</h1>
                    </div>
                </div>
                <div className="p-col-12 p-md-6 p-lg-6">
                    <div className="card card-w-title">
                        <h1 style={{ textAlign: "center" }}>Plan 1</h1>
                        <div className="p-col-12 p-md-6">
                            <label>Building</label>
                        </div>
                        <Dropdown options={this.state.userAddresses} value={this.state.selectedAddress1} onChange={event => this.setState({ selectedAddress1: event.value })} placeholder="Select an address" autoWidth={false} />
                        <div className="p-col-12 p-md-6">
                            <label>Plan</label>
                        </div>
                        <Dropdown options={this.state.userPlans} value={this.state.selectedPlan1} onChange={event => this.setState({ selectedPlan1: event.value })} placeholder="Select a plan" autoWidth={false} />

                    </div>
                    <div className="p-grid p-fluid dashboard">
                        <div className="p-col-12">
                            <div className="card summary">
                                <span className="title">Panels</span>
                                <span className="detail">Number of panels</span>
                                <span className="count visitors">10</span>
                            </div>
                        </div>
                        <div className="p-col-12">
                            <div className="card summary">
                                <span className="title">Surface</span>
                                <span className="detail">Total surface area of panels</span>
                                <span className="count visitors">650</span>
                            </div>
                        </div>
                        <div className="p-col-12">
                            <div className="card summary">
                                <span className="title">System Size</span>
                                <span className="detail">Maximum capacity of panels</span>
                                <span className="count visitors">4 kW</span>
                            </div>
                        </div>
                        <div className="p-col-12">
                            <div className="card summary">
                                <span className="title">Annual Production</span>
                                <span className="detail">Estimated average annual production</span>
                                <span className="count visitors">3500 kWh</span>
                            </div>
                        </div>
                        <div className="p-col-12">
                            <div className="card summary">
                                <span className="title">25 year savings</span>
                                <span className="detail">Estimated savings after 25 years</span>
                                <span className="count visitors">20000 TL</span>
                            </div>
                        </div>
                        <div className="p-col-12">
                            <div className="card summary">
                                <span className="title">System cost</span>
                                <span className="detail">Estimated initial cost to implement the system</span>
                                <span className="count purchases">30000 TL</span>
                            </div>
                        </div>
                        <div className="p-col-12">
                            <div className="card summary">
                                <span className="title">Payback period</span>
                                <span className="detail">Estimated time to gain back the initial costs</span>
                                <span className="count purchases">11 years 6 months</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-col-12 p-lg-6">
                    <div className="card card-w-title">
                        <h1 style={{ textAlign: "center" }}>Plan 2</h1>
                        <div className="p-col-12 p-md-6">
                            <label>Building</label>
                        </div>
                        <Dropdown options={this.state.userAddresses} value={this.state.selectedAddress2} onChange={event => this.setState({ selectedAddress2: event.value })} placeholder="Select an address" autoWidth={false} />
                        <div className="p-col-12 p-md-6">
                            <label>Plan</label>
                        </div>
                        <Dropdown options={this.state.userPlans} value={this.state.selectedPlan2} onChange={event => this.setState({ selectedPlan2: event.value })} placeholder="Select a plan" autoWidth={false} />
                    </div>
                    <div className="p-grid p-fluid dashboard">
                        <div className="p-col-12">
                            <div className="card summary">
                                <span className="title">Panels</span>
                                <span className="detail">Number of panels</span>
                                <span className="count visitors">10</span>
                            </div>
                        </div>
                        <div className="p-col-12">
                            <div className="card summary">
                                <span className="title">Surface</span>
                                <span className="detail">Total surface area of panels</span>
                                <span className="count visitors">650</span>
                            </div>
                        </div>
                        <div className="p-col-12">
                            <div className="card summary">
                                <span className="title">System Size</span>
                                <span className="detail">Maximum capacity of panels</span>
                                <span className="count visitors">4 kW</span>
                            </div>
                        </div>
                        <div className="p-col-12">
                            <div className="card summary">
                                <span className="title">Annual Production</span>
                                <span className="detail">Estimated average annual production</span>
                                <span className="count visitors">3500 kWh</span>
                            </div>
                        </div>
                        <div className="p-col-12">
                            <div className="card summary">
                                <span className="title">25 year savings</span>
                                <span className="detail">Estimated savings after 25 years</span>
                                <span className="count visitors">20000 TL</span>
                            </div>
                        </div>
                        <div className="p-col-12">
                            <div className="card summary">
                                <span className="title">System cost</span>
                                <span className="detail">Estimated initial cost to implement the system</span>
                                <span className="count purchases">30000 TL</span>
                            </div>
                        </div>
                        <div className="p-col-12">
                            <div className="card summary">
                                <span className="title">Payback period</span>
                                <span className="detail">Estimated time to gain back the initial costs</span>
                                <span className="count purchases">11 years 6 months</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}