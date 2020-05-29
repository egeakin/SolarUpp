import React, { Component } from 'react'
import {Chart} from 'primereact/chart';
import PropTypes from 'prop-types';

export default class FeasbilityCard extends Component {
    render() {
        //destruct information
        //var info = this.props.feasbilityInfo;
        var info = this.props.newStudy;
        var monthlydata = [];
        var i;

        for(i = 0; i < info.study.outputs.monthly.fixed.length; i++) {
            monthlydata.push(info.study.outputs.monthly.fixed[i].E_m);
        }
        
        var data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
                {
                    label: 'Monthly Production (kWh)',
                    backgroundColor: '#00b300',
                    data: monthlydata
                }
            ]
        };


        return (
           <div>
               <div className="p-col-12 p-lg-6">
                <div className="card"style={{width: '600px', height:'500px'}}>
                    <h1 className="centerText">Your Results</h1>
                    <div className="p-grid p-dir-col">
                        <div className="p-col">
                            <p>Your Annual Energy Production: {info.study.outputs.totals.fixed.E_y.toFixed(2)} (kWh)</p>
                            <p>Free Space for Solar Panels: {info.freeSpace.toFixed(2)} m<sup>2</sup></p>
                            <p>Saving for 25 Years: {info.estimatedProfit25Year.toFixed(0)} (₺)</p>
                            <p>Cut Carbon Footprint: {info.carbonFootPrint.toFixed(2)} tons </p>
                        </div>
                        <div className="p-col">
                            <Chart type="bar" data={data}/>
                        </div>
                    </div>
                        
                    </div>
                </div>    
           </div> 
            
        )
    }
}

FeasbilityCard.propTypes = {
    feasbilityInfo: PropTypes.object,
}

