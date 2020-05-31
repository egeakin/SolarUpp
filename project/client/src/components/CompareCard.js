import React, { Component } from 'react'
import {Chart} from 'primereact/chart';
import PropTypes from 'prop-types';

export default class CompareCard extends Component {
    render() {
        //destruct information
        //var info = this.props.feasbilityInfo;
        var info = this.props.comparedPlans;
        var backgroundColorCollections = ['#42A5F5', '#9CCC65', '#ffd633', '#df80ff',  '#ff1a1a', '#996600']
        //var monthlydata = [];
        var monthlyProductions = [];
        var planDatasets = [];
        console.log(info);

        for(var i = 0; i < info.length; i++){
            let monthlydata = [];
            for(var j = 0; j < info[i].study.outputs.monthly.fixed.length; j++) {
                monthlydata.push(info[i].study.outputs.monthly.fixed[j].E_m);
            }
            monthlyProductions.push(monthlydata);
        }
        console.log(monthlyProductions);

        for(let k = 0; k < info.length; k++){
            this.currentDataSet = {
                label: info[k].solarPanel + " && " + info[k].inverter,
                backgroundColor: backgroundColorCollections[k],
                data: monthlyProductions[k]
            }
            planDatasets.push(this.currentDataSet);
            
        }
        
        console.log(planDatasets);

        var data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: planDatasets
        };


        return (
           <div>
               <div className="p-col-12 p-lg-6">
                <div className="card"style={{width: '800px', height:'500px'}}>
                    <h1 className="centerText">Your Solar Plans' Annual Production (mWh)</h1>
                    <div className="p-grid p-dir-col">
                        <div className="p-col">
                            <Chart type="bar" data={data} />
                        </div>
                    </div>
                        
                    </div>
                </div>    
           </div> 
            
        )
    }
}

CompareCard.propTypes = {
    comparedPlans: PropTypes.array,
}

