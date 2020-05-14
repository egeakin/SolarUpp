import React, { Component } from 'react'
import {Chart} from 'primereact/chart';
import PropTypes from 'prop-types';


export default class FeasbilityCard extends Component {
    render() {
        const info = this.props.feasbilityInfo;
        console.log(info);
        return (
           <div>
               {info}
           </div> 
            
        )
    }
}

FeasbilityCard.propTypes = {
    feasbilityInfo: PropTypes.array.isRequired
}
