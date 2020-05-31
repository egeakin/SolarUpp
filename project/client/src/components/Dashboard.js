import React, { Component } from 'react';
import {Button} from 'primereact/button';
import { animateScroll } from "react-scroll";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';


export class Dashboard extends Component {

    constructor() {
        super();
        this.getStarted = this.getStarted.bind(this)
    }

    getStarted(){
        window.location = "#/findaddress"
        window.location.reload()
    }

    goToTutorial(){
        animateScroll.scrollMore(1055)
    }

     render() {        
        return (
            <div className="p-grid p-dir-col p-fluid">
                <br></br>
                <div className="card card-w-title p-justify-end">
                    <h1>What is SolarUpp</h1>
                    <p1>
                    SolarUpp aims to have a feasibility study on solar energy production and efficiency on building rooftops in order to increase usage of green energy. In this web application, solar ratings of rooftops is calculated by gathered information from images of rooftops. The users can easily find their building’s images by entering their addresses. After finding their buildings, users are able to choose spaces to plant solar panels on their rooftops. In order to calculate solar energy production, users have the chance to compare different solar panels and inverters to find optimum solution on their rooftops in terms of cost, size and efficiency.After solar panel plantation, generated solar energy amount is gathered from registered users’s inverters in time intervals like one week. Gathered information will be uploaded to our system to compare expected and generated value of solar energy. Recent weather conditions in the area of specified building is checked to see if there are any additional reasons which cause low energy production than expected rather than unexpected weather conditions.
                    </p1>

                    <br></br>
                    <br></br>

                    <div className="p-grid p-fluid p-justify-end">
                    <Button onClick={this.goToTutorial} style={{width:"10em", marginRight:"5px"}} className="p-justify-end p-button-info p-button-rounded" label="Tutorial"></Button>
                    <Button onClick={this.getStarted} style={{width:"10em"}} className="p-justify-end p-button-success p-button-rounded" label="Get Started"></Button>
                </div>

                </div>
                

                <br></br>
                <div className='p-fluid grid'>
                    <Carousel>
                        <div>
                            <img src="https://www.iklimhaber.org/wp-content/uploads/2019/12/solar.jpeg" />
                            <p className="legend">SolarUpp is a green field project which aims to increase solar energy usage by gathering information from rooftop’s images which are taken from above. Using images of rooftops to have a feasibility study is an essential point for large scale using by users.</p>
                        </div>
                        <div>
                            <img src="https://wallpaperaccess.com/full/1743472.jpg" />
                            <p className="legend">SolarUpp detect obstacles on rooftops such as pools and air conditioning components to calculate free space on roofs </p>
                        </div>
                    </Carousel>
                </div>


                <br></br>
                <div className="card card-w-title">
                    <h1>Find Your Address</h1>
                    <p3>
                        Users are able to find addresses of their buildings by searchin in the global map. Every place is available in this map, and also users can change the map imagary view from right upper globe button.
                    </p3>
                </div>

                <div className="p-grid p-justify-center">
                    <img width="700px" height="350px" src="https://media.giphy.com/media/cjKIYwbRwvvMzstpTW/giphy.gif"/>
                </div>
                
                <br></br>
                <div className="card card-w-title">
                    <h1>Draw Your Roof Plan</h1>
                    <p3>
                        After users found their addresses , they can easiliy draw their roofs by putting little dots in the map. After finishing drawing users should press finish drawing button, after that the plan is added to database and all of the estimation calculations are done with respect to this drawing. Also users are able to remove their drawing if they are uncomfortable with current drawing.
                    </p3>
                </div>

                <div className="p-grid p-justify-center">
                    <img width="700px" height="350px" src="https://media.giphy.com/media/dUllesmlK18ArEIK5U/giphy.gif"/>
                </div>

                <br></br>
                <div className="card card-w-title">
                    <h1>Feasibility Study</h1>
                    <p3>
                        Users are able to pick their roofs and form the feasibility study. Our system use Pvgis in back-end which offers the most accurate solar energy production estimation. Our system use Edge Detection Algorithm for identifying obstacles on the roof, and the free space is calculated by extracting the found obstacles.
                    </p3>
                </div>

                <div className="p-grid p-justify-center">
                    <img width="700px" height="350px" src="https://media.giphy.com/media/WUruOP32kqGuBbUn9c/giphy.gif"/>
                </div>

                <br></br>
                <div className="card card-w-title">
                    <h1>Maintenance Service</h1>
                    <p3>
                        Users are able to pick their roofs and form the feasibility study. Our system use Pvgis in back-end which offers the most accurate solar energy production estimation. Our system use Edge Detection Algorithm for identifying obstacles on the roof, and the free space is calculated by extracting the found obstacles.
                    </p3>
                </div>

                <div className="p-grid p-justify-center">
                    <img width="700px" height="350px" src="https://media.giphy.com/media/RhrFHdJC2qYwgrGjan/giphy.gif"/>
                </div>

                <br></br>
                <div className="card card-w-title">
                    <h1>Compare Your Plans</h1>
                    <p3>
                        Users can compare two solar plan according to decide on one solar plan. While comparing users pick solar plan that they formed before and after that their features become visible and users can see the difference between each feature of solar plans.
                    </p3>
                </div>

                <div className="p-grid p-justify-center">
                    <img width="700px" height="350px" src="https://media.giphy.com/media/RizX84WBPEzaNTn6VB/giphy.gif"/>
                </div>

            </div>

        )
     }
}