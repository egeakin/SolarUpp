import React, {Component} from 'react';
import {Chart} from 'primereact/chart';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column'
import axios from 'axios';
import {CarService} from '../service/CarService';

export class EmptyPage extends Component {

    componentDidMount() {
        this.carService.getCarsSmall().then(data => this.setState({dataTableValue: data}));
    }

    onSortChange(event) {
        let value = event.value;

        if (value.indexOf('!') === 0)
            this.setState({sortOrder: -1, sortField:value.substring(1, value.length), sortKey: value});
        else
            this.setState({sortOrder: 1, sortField:value, sortKey: value});
    }

    constructor() {
        super();
        this.carService = new CarService();
        
        this.state = {
            dataTableValue:[],
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
    }
    render() {
        return (
            <div className="p-grid p-fluid">
                <div className="p-grid">
                    <div className="p-col-12">
                        <div className="card">
                            <h1>Maintenance</h1>
                            <p>You can see your solar panel data from this page. The left one demonstrates the linear version of Solar Panel data. Also you can get the maintenance information from this oage. At the bottom of the charts, you can see the situation of your solar panel.</p>
                        </div>
                    </div>
            </div>
                
            <div className="p-col-12 p-lg-6">
                <div className="card">
                    <h1 className="centerText">Linear Monthly View</h1>
                    <Chart type="line" data={this.state.lineData}/>
                </div>

            </div>
            <div className="p-col-12 p-lg-6">
                <div className="card">
                    <h1 className="centerText">Bar Monthly View</h1>
                    <Chart type="bar" data={this.state.barData}/>
                </div>
            </div>

            <div className="p-col-12">
                    <div className="card card-w-title">
                        <h1>List of Your Solar Panels</h1>
                        <DataTable value={this.state.dataTableValue} paginatorPosition="both" selectionMode="single" header="List of Panels" paginator={true} rows={10}
                            responsive={true} selection={this.state.dataTableSelection} onSelectionChange={event => this.setState({dataTableSelection: event.value})}>
                            <Column field="vin" header="Vin" sortable={true}/>
                            <Column field="year" header="Year" sortable={true}/>
                            <Column field="brand" header="Brand" sortable={true}/>
                            <Column field="color" header="Color" sortable={true}/>
                        </DataTable>
                    </div>
                </div>
            </div>


        );
    }
    
}