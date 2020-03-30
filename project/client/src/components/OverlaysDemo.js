import React, {Component} from 'react';
// import { hot } from "react-hot-loader/root";
import { Viewer, Entity, PointGraphics, EntityDescription, GeoJsonDataSource, KmlDataSource, Cesium3DTileset, Camera, CameraFlyTo, CustomDataSource} from "resium";
import { Cartesian3, createWorldTerrain, Color} from "cesium";
import { IonResource } from "cesium";
import {Growl} from 'primereact/growl';
import {Button} from 'primereact/button';
import {Messages} from 'primereact/messages';

const terrainProvider = createWorldTerrain();
// const position = Cartesian3.fromDegrees(-74.0707383, 40.7117244, 100);
// const data = {
//     type: "Feature",
//     properties: {
//       name: "Coors Field",
//       amenity: "Baseball Stadium",
//       popupContent: "This is where the Rockies play!",
//     },
//     geometry: {
//       type: "Point",
//       coordinates: [this.state.latitude, this.state.longitude],
//     },
//   };


export class OverlaysDemo extends Component{
    
    componentDidMount(){
        this.getLocation()
    }
    
    constructor(props) {
        super(props);
        this.state = {
            latitude: null,
            longitude: null,
            options: {
                enableHighAccuracy: true,
                timeout: 5000,
                maxiumumAge: 0
            }
        };
        this.showInfo = this.showInfo.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.getCoordinates = this.getCoordinates.bind(this);
        this.error = this.error.bind(this);
        
    }

    getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.getCoordinates, this.error, this.state.options);
        } else {
          alert("Geolocation is not supported by this browser.");
        }
    }   

    getCoordinates(position){
        this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }

    error(){
        console.log("Heyoooo")
    }
    
    showInfo() {
        let msg = {severity: 'info', summary: 'Info Message', detail: 'PrimeReact rocks'};
        this.growl.show(msg);
        this.messages.show(msg);
    }

    render(){
        return(
            <div className="p-grid p-dir-col p-fluid card card-w-title" >
                <div className="p-col p-fluid p-card">
                    <h1>Find Your Address</h1>
                    <p1>Enter your address from right upper toolbar after picking search button.</p1>
                    <Button onClick={this.showInfo} label="Help" className="p-button-info" style={{width:'10em', marginLeft:"42em"}} />
                    <p>Latitude: {Number(this.state.latitude)}</p>
                    <p>Longitude: {Number(this.state.longitude)}</p>
                    <Button onClick = {this.getLocation} style={{width:'15em'}} label="Get Your Coordinates"></Button>
                </div>

                <Messages ref={(el) => this.messages = el} />
                <Growl ref={(el) => this.growl = el} style={{marginTop: '75px'}} />

                <div className="p-col p-fluid p-card">
                    <Viewer> 
                    <CustomDataSource name="custom">
                        <Entity
                        name="Your Current Location"
                        description="This is your current location."
                        position={Cartesian3.fromDegrees(Number(this.state.longitude), Number(this.state.latitude), 1000)}
                        point={{ pixelSize: 10, color: Color.RED }}
                        />
                    </CustomDataSource>
                        {/* <CameraFlyTo duration={5} destination={Cartesian3.fromDegrees(Number(this.state.longitude), Number(this.state.latitude), 1000)} /> */}
                    </Viewer>
                </div>
                
                {/* <Viewer full>
                    <GeoJsonDataSource data={"your_geo_json.geojson"} />
                    <KmlDataSource data={"your_geo_json.kml"} />
                    <GeoJsonDataSource data={data} />
                </Viewer> */}

                {/* <Viewer
                    full
                    ref={e => {
                    viewer = e && e.cesiumElement;
                }}>
                <Cesium3DTileset url={IonResource.fromAssetId(5714)} onReady={handleReady} />
                </Viewer> */}
            </div>
        )
    }    
}
