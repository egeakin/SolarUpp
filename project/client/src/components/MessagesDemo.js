import React, {Component} from 'react';
import {DataScroller} from 'primereact/datascroller';
import {CarService} from '../service/CarService';
import {Button} from 'primereact/button';
import {Card} from 'primereact/card';

export class MessagesDemo extends Component {

    constructor() {
        super();
        this.state = {
            cars: []
        };
        this.carservice = new CarService();
        this.carTemplate = this.carTemplate.bind(this);
    }

    componentDidMount() {
        this.carservice.getInverters().then(data => this.setState({cars: data}));
    }

    carTemplate(inverter) {
        console.log(inverter);
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
                            <div className="p-col-2 p-sm-6">Name:</div>
                            <div className="p-col-10 p-sm-6">{inverter.name}</div>

                            <div className="p-col-2 p-sm-6">Efficiency:</div>
                            <div className="p-col-10 p-sm-6">{inverter.efficiency}</div>

                            <div className="p-col-2 p-sm-6">Peak AC Power:</div>
                            <div className="p-col-10 p-sm-6">{inverter.peakACPower}</div>

                            <div className="p-col-2 p-sm-6">Price:</div>
                            <div className="p-col-10 p-sm-6">{inverter.price}</div>
                        </div>
                    </div>
                    <div className="p-col-12 p-md-3">
                        <div className="p-vertical">
                            <div className="p-col-6">
                                <Button label="Select" style={{width:'150px'}} onClick={() => this.selectInverter(inverter)} className="p-button-success"></Button>
                            </div>
                            <div className="p-col-6">
                                <Button label="Detail" style={{width:'150px'}} className="p-button-info"></Button>
                            </div>
                        </div>
                    </div> 
                </div> 
        );
    }

    render() {
        return (
            
            <div>
                <div className="content-section introduction">
                    <div className="feature-intro">
                        <h1>DataScroller</h1>
                        <p>DataScroller displays data with on demand loading using scroll.</p>
                    </div>
                </div>

                <div className="content-section implementation">
                    Demo is at the bottom of this page.
                </div>

                <div className="content-section implementation">
                    <DataScroller value={this.state.cars} itemTemplate={this.carTemplate}
                            rows={this.state.cars.length} buffer={0.6} header="List of Cars" />
                </div>
            </div>
                

 
        );
    }
}