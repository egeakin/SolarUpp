import React, { Component } from 'react';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column'
import axios from 'axios';
import { CarService } from '../service/CarService';
import { Messages } from 'primereact/messages';
import { Button } from 'primereact/button';
import { CSVReader } from 'react-papaparse'

const buttonRef = React.createRef()

export class MaintenancePage extends Component {

    componentDidMount() {
        axios
            .get("/existingSystems")
            .then((response) => {
                console.log(response);
                this.setState({ systems: response.data });
            })
            .catch((err) => { this.showError(); console.log(err) });
    }

    onSortChange(event) {
        let value = event.value;

        if (value.indexOf('!') === 0)
            this.setState({ sortOrder: -1, sortField: value.substring(1, value.length), sortKey: value });
        else
            this.setState({ sortOrder: 1, sortField: value, sortKey: value });
    }

    showError() {
        this.messages.show({ severity: 'error', summary: 'Something went wrong' });
    }

    handleOpenDialog = (e) => {
        if (buttonRef.current) {
            buttonRef.current.open(e)
        }
    }

    handleOnFileLoad = (data) => {
        console.log('---------------------------');
        console.log(data);
        console.log('---------------------------');
        this.setState({
            selectedFileData: data,
            selectedFileRowCount: data.length,
        });
    }

    handleOnError = (err, file, inputElem, reason) => {
        console.log(err);
    }

    handleOnRemoveFile = (data) => {
        console.log('---------------------------');
        console.log(data);
        console.log('---------------------------');
        this.setState({
            selectedFileData: null,
            selectedFileRowCount: 0,
        });
    }

    handleRemoveFile = (e) => {
        if (buttonRef.current) {
            buttonRef.current.removeFile(e);
        }
    }

    onChangeHandler(event) {
        console.log(event.target.files[0]);
        this.setState({
            selectedFile: event.target.files[0],
        });
    }

    uploadData(event) {
        if (this.state.selectedSystem === null) {
            this.showError();
        }
        for (var i = 0; i < this.state.selectedFileRowCount; i++) {
            let generationInfo = {
                date: this.state.selectedFileData[i].data[0],
                generated: this.state.selectedFileData[i].data[1],
                systemId: this.state.selectedSystem.existingSystemsId,
            }
            console.log(generationInfo);

            axios
            .post("/addGeneration/" + this.state.selectedSystem.existingSystemsId, generationInfo)
            .then((response) => {
                console.log(response);
            })
            .catch((err) => { console.log(err) });
        }

    }

    constructor() {
        super();
        this.carService = new CarService();
        this.showError = this.showError.bind(this);

        this.state = {
            selectedSystem: null,
            selectedFile: null,
            systems: [],
            selectedFileData: null,
            selectedFileRowCount: 0,
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
                <div className="p-col-12 p-lg-12">
                    <div className="card">
                        <h1>Maintenance</h1>
                        <p>This is the maintenance page</p>
                    </div>
                </div>

                <div className="p-col-12 p-lg-6">
                    <div className="card">
                        <h1 className="centerText">Linear Monthly View</h1>
                        <Chart type="line" data={this.state.lineData} />
                    </div>

                </div>
                <div className="p-col-12 p-lg-6">
                    <div className="card">
                        <h1 className="centerText">Bar Monthly View</h1>
                        <Chart type="bar" data={this.state.barData} />
                    </div>
                </div>

                <div className="p-col-12">
                    <Messages ref={(el) => this.messages = el} />
                    <div className="card card-w-title">
                        <h1>List of Your Systems</h1>
                        <DataTable value={this.state.systems} paginatorPosition="both" selectionMode="single" header="List of Systems" paginator={true} rows={10}
                            responsive={true} selection={this.state.selectedSystem} onSelectionChange={event => this.setState({ selectedSystem: event.value })}>
                            <Column field="name" header="Name of the System" sortable={true} />
                            <Column field="systemSize" header="System Size" sortable={true} />
                            <Column field="inverterSize" header="Inverter Size" sortable={true} />
                            <Column field="numPanels" header="Number of Panels" sortable={true} />
                            <Column field="age" header="Age of the System" sortable={true} />
                        </DataTable>
                        <div className="p-row-6 p-lg-6">
                            <CSVReader
                                ref={buttonRef}
                                onFileLoad={this.handleOnFileLoad}
                                onError={this.handleOnError}
                                noClick
                                noDrag
                                onRemoveFile={this.handleOnRemoveFile}>
                                {({ file }) => (
                                    <aside
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            marginBottom: 10,
                                            marginTop: 20,
                                        }}>
                                        <button
                                            type='button'
                                            onClick={this.handleOpenDialog}
                                            style={{
                                                borderRadius: 0,
                                                marginLeft: 0,
                                                marginRight: 10,
                                                width: '40%',
                                                paddingLeft: 0,
                                                paddingRight: 0
                                            }}>Select .csv file to upload generation log</button>
                                        <div
                                            style={{
                                                borderWidth: 1,
                                                borderStyle: 'solid',
                                                borderColor: '#ccc',
                                                height: 45,
                                                lineHeight: 2.5,
                                                marginTop: 5,
                                                marginBottom: 5,
                                                paddingLeft: 13,
                                                paddingTop: 3,
                                                width: '60%'
                                            }}>
                                            {file && file.name}
                                        </div>
                                        <button
                                            style={{
                                                borderRadius: 0,
                                                marginLeft: 10,
                                                marginRight: 0,
                                                paddingLeft: 5,
                                                paddingRight: 5
                                            }}
                                            onClick={this.handleRemoveFile}>Remove</button>
                                    </aside>
                                )}
                            </CSVReader>
                            </div>
                            <div className="p-row-6 p-lg-6">
                                <label>
                                    Rows found: {this.state.selectedFileRowCount}
                                </label>
                                <Button label="Upload generation log for the selected file" icon="pi pi-upload" 
                                    onClick={(event) => this.uploadData(event)} style={{ marginTop: 10, }}/>
                            </div>
                    </div>
                </div>
            </div>
        );
    }

}


//<input type="file" name="file" accept=".csv"s onChange={(event) => this.onChangeHandler(event)} />
//<Button label="Upload generation log for the selected file" icon="pi pi-upload" onClick={this.uploadData} />
                        