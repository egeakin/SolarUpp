import React, { Component } from 'react'
import {Chart} from 'primereact/chart';
import PropTypes from 'prop-types';

export default class FeasbilityCard extends Component {
    calculateSaving(freeSpace, monthlydata, averageConsumption) {
        let peakPower = (freeSpace*17)/100;  //kaç kWh olduğunu gösterir
        let systemCost = peakPower*9500; //1Kwh saat için kurulum ücreti ortalama her şey dahil 1500$
        let balance = 0;
        //first 15 year
        let income15 = 0;
        let i;
        for(i = 0; i < 12; i++){
            let diff = monthlydata[i] - averageConsumption;
            if(diff > 0) {
                income15 += diff * 0.31;
                income15 += averageConsumption * 0.71;
            }
            else{
                income15 += monthlydata[i] * 0.71;
            }
        }
        balance += income15 * 15;
        //last 10 year
        let income10 = 0;
        let j;
        for(j = 0; j < 12; j++){
            let diff = (monthlydata[j] * 0.85) - averageConsumption;
            if(diff > 0) {
                income10 += diff * 0.31;
                income10 += averageConsumption * 0.71;
            }
            else{
                income10 += monthlydata[j] * 0.71;
            }
        }
        balance += income10 * 10;
        return balance - systemCost;
    }

    calculateCarbonFootPrint(annualConsumption) {
        return (annualConsumption* 0.534) / 1000;
    }

    render() {
        //destruct information
        var info = this.props.feasbilityInfo;
        var monthlydata = [];
        var i;

        for(i = 0; i < info.outputs.monthly.fixed.length; i++) {
            monthlydata.push(info.outputs.monthly.fixed[i].E_m);
        }

        var freeSpace = this.props.freeSpace;
        var annualProduction = info.outputs.totals.fixed.E_y;
        var annualConsumption = this.props.averageConsumption *12;
        var cutCarbonFoodPrint = this.calculateCarbonFootPrint(annualConsumption);
        var saving25Year = this.calculateSaving( freeSpace, monthlydata, this.props.averageConsumption);
        
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
                            <p>Your Annual Energy Production (kWh): {annualProduction.toFixed(2)}</p>
                            <p>Free Space for Solar Panels: {freeSpace}m<sup>2</sup></p>
                            <p>Saving for 25 Years (₺): {saving25Year.toFixed(0)}</p>
                            <p>Cut Carbon Footprint (tons): {cutCarbonFoodPrint}   </p>
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

