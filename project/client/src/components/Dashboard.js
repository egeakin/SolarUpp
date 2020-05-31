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
                    {/* <Carousel>
                        <img
                                src="https://wallpaperaccess.com/full/1743472.jpg"
                                alt="First slide"
                            />
                    </Carousel> */}
                    {/* <Carousel>
                        <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="https://wallpaperaccess.com/full/1743472.jpg"
                            alt="First slide"
                        />
                        <Carousel.Caption>
                            <h3>SolarUpp</h3>
                            <p>SolarUpp is a green field project which aims to increase solar energy usage by gathering information from rooftop’s images which are taken from above. Using images of rooftops to have a feasibility study is an essential point for large scale using by users.</p>
                        </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="https://www.iklimhaber.org/wp-content/uploads/2019/12/solar.jpeg"
                            alt="Third slide"
                        />

                        <Carousel.Caption>
                            <h3>SolarUpp</h3>
                            <p>SolarUpp is a green field project which aims to increase solar energy usage by gathering information from rooftop’s images which are taken from above. Using images of rooftops to have a feasibility study is an essential point for large scale using by users..</p>
                        </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="https://wallpaperaccess.com/full/1743472.jpg" 
                            alt="Third slide"
                        />

                        <Carousel.Caption>
                            <h3>Third slide label</h3>
                            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                        </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel> */}
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

    //     this.state = {
    //         tasks: [],
    //         city: null,
    //         selectedCar: null,
    //         lineData: {
    //             labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    //             datasets: [
    //                 {
    //                     label: 'First Dataset',
    //                     data: [65, 59, 80, 81, 56, 55, 40],
    //                     fill: false,
    //                     borderColor: '#007be5'
    //                 },
    //                 {
    //                     label: 'Second Dataset',
    //                     data: [28, 48, 40, 19, 86, 27, 90],
    //                     fill: false,
    //                     borderColor: '#20d077'
    //                 }
    //             ]
    //         },
    //         cities: [
    //             {label:'New York', value:{id:1, name: 'New York', code: 'NY'}},
    //             {label:'Rome', value:{id:2, name: 'Rome', code: 'RM'}},
    //             {label:'London', value:{id:3, name: 'London', code: 'LDN'}},
    //             {label:'Istanbul', value:{id:4, name: 'Istanbul', code: 'IST'}},
    //             {label:'Paris', value:{id:5, name: 'Paris', code: 'PRS'}}
    //         ],
    //         fullcalendarOptions: {
    //             plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    //             defaultDate: '2017-02-01',
    //             header: {
    //                 left: 'prev,next today',
    //                 center: 'title',
    //                 right: 'month,agendaWeek,agendaDay'
    //             },
    //             editable: true
    //         },
    //         events: [
    //             {
    //                 "id": 1,
    //                 "title": "All Day Event",
    //                 "start": "2017-02-01"
    //             },
    //             {
    //                 "id": 2,
    //                 "title": "Long Event",
    //                 "start": "2017-02-07",
    //                 "end": "2017-02-10"
    //             },
    //             {
    //                 "id": 3,
    //                 "title": "Repeating Event",
    //                 "start": "2017-02-09T16:00:00"
    //             },
    //             {
    //                 "id": 4,
    //                 "title": "Repeating Event",
    //                 "start": "2017-02-16T16:00:00"
    //             },
    //             {
    //                 "id": 5,
    //                 "title": "Conference",
    //                 "start": "2017-02-11",
    //                 "end": "2017-02-13"
    //             },
    //             {
    //                 "id": 6,
    //                 "title": "Meeting",
    //                 "start": "2017-02-12T10:30:00",
    //                 "end": "2017-02-12T12:30:00"
    //             },
    //             {
    //                 "id": 7,
    //                 "title": "Lunch",
    //                 "start": "2017-02-12T12:00:00"
    //             },
    //             {
    //                 "id": 8,
    //                 "title": "Meeting",
    //                 "start": "2017-02-12T14:30:00"
    //             },
    //             {
    //                 "id": 9,
    //                 "title": "Happy Hour",
    //                 "start": "2017-02-12T17:30:00"
    //             },
    //             {
    //                 "id": 10,
    //                 "title": "Dinner",
    //                 "start": "2017-02-12T20:00:00"
    //             },
    //             {
    //                 "id": 11,
    //                 "title": "Birthday Party",
    //                 "start": "2017-02-13T07:00:00"
    //             },
    //             {
    //                 "id": 12,
    //                 "title": "Click for Google",
    //                 "url": "http://google.com/",
    //                 "start": "2017-02-28"
    //             }
    //         ]
    //     };

    //     this.onTaskChange = this.onTaskChange.bind(this);
    //     this.onCityChange = this.onCityChange.bind(this);
    //     this.carservice = new CarService();
    // }

    // onTaskChange(e) {
    //     let selectedTasks = [...this.state.tasks];
    //     if(e.checked)
    //         selectedTasks.push(e.value);
    //     else
    //         selectedTasks.splice(selectedTasks.indexOf(e.value), 1);

    //     this.setState({tasks: selectedTasks});
    // }

    // onCityChange(e) {
    //     this.setState({city: e.value});
    // }

    // componentDidMount() {
    //     this.carservice.getCarsSmall().then(data => this.setState({cars: data}));
    // }


    // render() {        
    //     return (
    //         <div className="p-grid p-fluid dashboard">
    //             <div className="p-col-12 p-lg-4">
    //                 <div className="card summary">
    //                     <span className="title">Users</span>
    //                     <span className="detail">Number of visitors</span>
    //                     <span className="count visitors">12</span>
    //                 </div>
    //             </div>
    //             <div className="p-col-12 p-lg-4">
    //                 <div className="card summary">
    //                     <span className="title">Sales</span>
    //                     <span className="detail">Number of purchases</span>
    //                     <span className="count purchases">534</span>
    //                 </div>
    //             </div>
    //             <div className="p-col-12 p-lg-4">
    //                 <div className="card summary">
    //                     <span className="title">Revenue</span>
    //                     <span className="detail">Income for today</span>
    //                     <span className="count revenue">$3,200</span>
    //                 </div>
    //             </div>

    //             <div className="p-col-12 p-md-6 p-xl-3">
    //                 <div className="highlight-box">
    //                     <div className="initials" style={{backgroundColor:'#007be5',color:'#00448f'}}><span>TV</span></div>
    //                     <div className="highlight-details ">
    //                         <i className="pi pi-search"/>
    //                         <span>Total Queries</span>
    //                         <span className="count">523</span>
    //                     </div>
    //                 </div>
    //             </div>
    //             <div className="p-col-12 p-md-6 p-xl-3">
    //                 <div className="highlight-box">
    //                     <div className="initials" style={{backgroundColor:'#ef6262',color:'#a83d3b'}}><span>TI</span></div>
    //                     <div className="highlight-details ">
    //                         <i className="pi pi-question-circle"/>
    //                         <span>Total Issues</span>
    //                         <span className="count">81</span>
    //                     </div>
    //                 </div>
    //             </div>
    //             <div className="p-col-12 p-md-6 p-xl-3">
    //                 <div className="highlight-box">
    //                     <div className="initials" style={{backgroundColor:'#20d077',color:'#038d4a'}}><span>OI</span></div>
    //                     <div className="highlight-details ">
    //                         <i className="pi pi-filter"/>
    //                         <span>Open Issues</span>
    //                         <span className="count">21</span>
    //                     </div>
    //                 </div>
    //             </div>
    //             <div className="p-col-12 p-md-6 p-xl-3">
    //                 <div className="highlight-box">
    //                     <div className="initials" style={{backgroundColor:'#f9c851',color:'#b58c2b'}}><span>CI</span></div>
    //                     <div className="highlight-details ">
    //                         <i className="pi pi-check"/>
    //                         <span>Closed Issues</span>
    //                         <span className="count">60</span>
    //                     </div>
    //                 </div>
    //             </div>
    //             <div className="p-col-12 p-md-6 p-lg-4">
    //                 <Panel header="Tasks" style={{height: '100%'}}>
    //                     <ul className='task-list'>
    //                         <li>
    //                             <Checkbox value="task1" onChange={this.onTaskChange} checked={this.state.tasks.indexOf('task1')>-1?true:false}></Checkbox>
    //                             <span className="task-name">Sales Reports</span>
    //                             <i className="pi pi-chart-bar" />
    //                         </li>
    //                         <li>
    //                             <Checkbox value="task2" onChange={this.onTaskChange} checked={this.state.tasks.indexOf('task2')>-1?true:false}></Checkbox>
    //                             <span className="task-name">Pay Invoices</span>
    //                             <i className="pi pi-dollar" />
    //                         </li>
    //                         <li>
    //                             <Checkbox value="task3" onChange={this.onTaskChange} checked={this.state.tasks.indexOf('task3')>-1?true:false}></Checkbox>
    //                             <span className="task-name">Dinner with Tony</span>
    //                             <i className="pi pi-user" />
    //                         </li>
    //                         <li>
    //                             <Checkbox value="task4" onChange={this.onTaskChange} checked={this.state.tasks.indexOf('task4')>-1?true:false}></Checkbox>
    //                             <span className="task-name">Client Meeting</span>
    //                             <i className="pi pi-users" />
    //                         </li>
    //                         <li>
    //                             <Checkbox value="task5" onChange={this.onTaskChange} checked={this.state.tasks.indexOf('task5')>-1?true:false}></Checkbox>
    //                             <span className="task-name">New Theme</span>
    //                             <i className="pi pi-briefcase" />
    //                         </li>
    //                         <li>
    //                             <Checkbox value="task6" onChange={this.onTaskChange} checked={this.state.tasks.indexOf('task6')>-1?true:false}></Checkbox>
    //                             <span className="task-name">Flight Ticket</span>
    //                             <i className="pi pi-briefcase" />
    //                         </li>
    //                     </ul>
    //                 </Panel>
    //             </div>
    //             <div className="p-col-12 p-md-6 p-lg-4 p-fluid contact-form">
    //                 <Panel header="Contact Us">
    //                     <div className="p-grid">
    //                         <div className="p-col-12">
    //                             <Dropdown value={this.state.city} options={this.state.cities} placeholder="Select a City" onChange={this.onCityChange} autoWidth={false} />
    //                         </div>
    //                         <div className="p-col-12">
    //                             <InputText type="text" placeholder="Name" />
    //                         </div>
    //                         <div className="p-col-12">
    //                             <InputText type="text" placeholder="Age" />
    //                         </div>
    //                         <div className="p-col-12">
    //                             <InputText type="text" placeholder="Message" />
    //                         </div>
    //                         <div className="p-col-12">
    //                             <Button type="button" label="Send" icon="fa-send"/>
    //                         </div>
    //                     </div>
    //                 </Panel>
    //             </div>

    //             <div className="p-col-12 p-lg-4 contacts">
    //                 <Panel header="Contacts">
    //                     <ul>
    //                         <li>
    //                             <button className="p-link">
    //                                 <img src="assets/layout/images/avatar_1.png" width="35" alt="avatar1"/>
    //                                 <span className="name">Claire Williams</span>
    //                                 <span className="email">clare@pf-sigma.com</span>
    //                             </button>
    //                         </li>
    //                         <li>
    //                             <button className="p-link">
    //                                 <img src="assets/layout/images/avatar_2.png" width="35" alt="avatar2"/>
    //                                 <span className="name">Jason Dourne</span>
    //                                 <span className="email">jason@pf-sigma.com</span>
    //                             </button>
    //                         </li>
    //                         <li>
    //                             <button className="p-link">
    //                                 <img src="assets/layout/images/avatar_3.png" width="35" alt="avatar3"/>
    //                                 <span className="name">Jane Davidson</span>
    //                                 <span className="email">jane@pf-sigma.com</span>
    //                             </button>
    //                         </li>
    //                         <li>
    //                             <button className="p-link">
    //                                 <img src="assets/layout/images/avatar_4.png" width="35" alt="avatar4"/>
    //                                 <span className="name">Tony Corleone</span>
    //                                 <span className="email">tony@pf-sigma.com</span>
    //                             </button>
    //                         </li>
    //                     </ul>
    //                 </Panel>
    //             </div>
    //             <div className="p-col-12 p-lg-6">
    //                 <div className="card">
    //                     <h1 style={{fontSize:'16px'}}>Recent Sales</h1>
    //                     <DataTable value={this.state.cars}  style={{marginBottom: '20px'}} responsive={true}
    //                             selectionMode="single" selection={this.state.selectedCar} onSelectionChange={(e) => this.setState({selectedCar: e.value})}>
    //                         <Column field="vin" header="Vin" sortable={true} />
    //                         <Column field="year" header="Year" sortable={true} />
    //                         <Column field="brand" header="Brand" sortable={true} />
    //                         <Column field="color" header="Color" sortable={true} />
    //                     </DataTable>
    //                 </div>
    //             </div>
    //             <div className="p-col-12 p-lg-6">
    //                 <div className="card">
    //                     <Chart type="line" data={this.state.lineData}/>
    //                 </div>
    //             </div>
    //             <div className="p-col-12 p-lg-8">
    //                 <Panel header="Calendar" style={{height: '100%'}}> 
    //                     <FullCalendar events={this.state.events} options={this.state.fullcalendarOptions}></FullCalendar>
    //                 </Panel>
    //             </div>

    //             <div className="p-col-12 p-lg-4">
    //                 <Panel header="Activity" style={{height:'100%'}}>
    //                     <div className="activity-header">
    //                         <div className="p-grid">
    //                             <div className="p-col-6">
    //                                 <span style={{fontWeight:'bold'}}>Last Activity</span>
    //                                 <p>Updated 1 minute ago</p>
    //                             </div>
    //                             <div className="p-col-6" style={{textAlign:'right'}}>
    //                                 <Button label="Refresh" icon="pi pi-refresh" />
    //                             </div>
    //                         </div>
    //                     </div>

    //                     <ul className="activity-list">
    //                         <li>
    //                             <div className="count">$900</div>
    //                             <div className="p-grid">
    //                                 <div className="p-col-6">Income</div>
    //                                 <div className="p-col-6">95%</div>
    //                             </div>
    //                         </li>
    //                         <li>
    //                             <div className="count" style={{backgroundColor:'#f9c851'}}>$250</div>
    //                             <div className="p-grid">
    //                                 <div className="p-col-6">Tax</div>
    //                                 <div className="p-col-6">24%</div>
    //                             </div>
    //                         </li>
    //                         <li>
    //                             <div className="count" style={{backgroundColor:'#20d077'}}>$125</div>
    //                             <div className="p-grid">
    //                                 <div className="p-col-6">Invoices</div>
    //                                 <div className="p-col-6">55%</div>
    //                             </div>
    //                         </li>
    //                         <li>
    //                             <div className="count" style={{backgroundColor:'#f9c851'}}>$250</div>
    //                             <div className="p-grid">
    //                                 <div className="p-col-6">Expenses</div>
    //                                 <div className="p-col-6">15%</div>
    //                             </div>
    //                         </li>
    //                         <li>
    //                             <div className="count" style={{backgroundColor:'#007be5'}}>$350</div>
    //                             <div className="p-grid">
    //                                 <div className="p-col-6">Bonus</div>
    //                                 <div className="p-col-6">5%</div>
    //                             </div>
    //                         </li>
    //                         <li>
    //                             <div className="count" style={{backgroundColor:'#ef6262'}}>$500</div>
    //                             <div className="p-grid">
    //                                 <div className="p-col-6">Revenue</div>
    //                                 <div className="p-col-6">25%</div>
    //                             </div>
    //                         </li>
    //                     </ul>
    //                 </Panel>
    //             </div>
    //         </div>
    //     );
    
}