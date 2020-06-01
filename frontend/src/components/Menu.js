import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import Navbar from './NavigationBar';
import Footer from './Footer';
import GridItem from './GridItem';
import axios from 'axios';

import {Dropdown, DropdownButton, Button, Form, FormControl, Row, Col, Container} from 'react-bootstrap'

class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
        categories:[],
        jobs:[], 
        businesses:[],
        events:[], 
        type_menu:'',
        search:'',
        select_type_b:'all',
        select_type_j:'all',
        select_type_e:'all',
        }
        
    }

    componentDidMount()
    {
        axios.get("categories/") //get all categories
            .then(response => {
                console.log(response.data)
                this.setState({
                    categories: response.data
                });
            })

        axios.post('getevents/', this.state) //retrieve data for events
            .then(response => {
                this.setState({
                    events: response.data
                });
            })
        axios.post('getbusinesses/', this.state) //retrieve data for businesses
            .then(response => {
                this.setState({
                    businesses: response.data
                });
            })
        axios.post('getjobs/', this.state) //retrieve data for jobs
            .then(response => {
                this.setState({
                    jobs: response.data
                });
            })
    }

    changehandler=(e)=>{    //this is the onchange listener of the form, gets the id and value from the Formcontrol and updates the state constantly
        this.setState({[e.target.id]:e.target.value})
    }

    items(count)
    {
        if(this.state.type_menu=='Events')
        {
            return(
                count < this.state.events.length && this.state.events[count].event_name.includes(this.state.search)?
                <Link to={{ pathname: '/EventsDetails', state: {event:this.state.events[count]} }}>
                    <Col id='black'>
                        <div id='boldDetails' style={{color: 'black' }}>{(this.state.events[count].event_date.substring(0,10)).replace(/(\r\n|-|\r)/gm,"/")}</div>
                        <img style={{height:'75%', width:'240px'}} class="hoverable" id='gridItemImgSize' src={this.url_event(count)}></img>
                        <p style={{ color: 'black' }}>{this.state.events[count].event_name}</p>
                    </Col>
                </Link>
                :
                <div/>
            )
        }
        else if(this.state.type_menu=='Small Businesses')
        {
            return(
                count < this.state.businesses.length && this.state.businesses[count].business_name.includes(this.state.search)?
                <Link to={{ pathname: '/SmallBusinessesDetails', state: {businesses:this.state.businesses[count]} }}>
                    <Col id='black'>
                        <img style={{height:'75%', width:'240px'}} class="hoverable" id='gridItemImgSize' src={this.url_business(count)}></img>
                        <p style={{ color: 'black' }}>{this.state.businesses[count].business_name}</p>
                    </Col>
                </Link>
                :
                <div/>
            )
        }
        else
        {
            return(
                count < this.state.jobs.length && this.state.jobs[count].name_of_job.includes(this.state.search) ?
                <Link to={{ pathname: '/OppurtunitiesDetails', state: {jobs:this.state.jobs[count]} }}>
                    <Col id='black'>
                        <img style={{height:'75%', width:'240px'}} class="hoverable" id='gridItemImgSize' src={this.url_job(count)}></img>
                        <p style={{ color: 'black' }}>{this.state.jobs[count].name_of_job}</p>
                    </Col>
                </Link>
                :
                <div/>
            )
        }

    }

    url_job(count)
    {
        if(this.state.jobs[count].image == undefined)
        {
            return null
        }

        let start = this.state.jobs[count].image.indexOf('/static/frontend/media')
        let end = this.state.jobs[count].image.length
        let url_job = '../..'+this.state.jobs[count].image.slice(start, end)
        return url_job
    }
    
    url_business(count)
    {
        if(this.state.businesses[count].image == undefined)
        {
            return null
        }

        let start = this.state.businesses[count].image.indexOf('/static/frontend/media')
        let end = this.state.businesses[count].image.length
        let url_business = '../..'+this.state.businesses[count].image.slice(start, end)
        return url_business
    }
    
    url_event(count)
    {
        if(this.state.events[count].image == undefined)
        {
            return null
        }

        let start = this.state.events[count].image.indexOf('/static/frontend/media')
        let end = this.state.events[count].image.length
        let url_event = '../..'+this.state.events[count].image.slice(start, end)
        return url_event
    }

    handleSelect = (evtKey, evt) => {
        // Get the selectedIndex in the evtKey variable
        this.setState({
            select_type:evtKey
        })
    }

    show_type()
    {
        var cat_type = ''
        if(this.state.type_menu == 'Events') {
            cat_type = this.state.select_type_e
        }
        else if(this.state.type_menu == 'Small Businesses') {
            var cat_type = this.state.select_type_b
        }
        else {
            var cat_type = this.state.select_type_j
        }
        return(
            <DropdownButton onSelect={this.handleSelect} title={this.state.select_type} id="input-group-dropdown-2" variant='success'>
            {
                this.state.categories.map((data)=>{
                if(data.category_type==cat_type) {
                    return (
                        <div>
                            <Dropdown.Item eventKey={data.category_name}>{data.category_name}</Dropdown.Item>
                        </div>
                    )}
                })
            }
            </DropdownButton>
        )   
    }

    render() {

        var count = -1;
        const Events = 'Small Businesses'
        const {type_menu} = this.props.location.state==undefined? {type_menu:Events} : this.props.location.state
        this.state.type_menu = type_menu
        
        return (
            <div>
                <Navbar/>

                <Container id='gridItemsFont'>
                    <Row>
                        <Col>
                            <h2 style={{margin:'4% 1% 4% 0%'}}>{this.state.type_menu}</h2>
                        </Col>
                        
                        <Col md={{ span: 3, offset: 3 }} style={{marginTop:'2%'}}>
                            <Form id='form' inline>
                                <FormControl type="text" placeholder="Search" size='md' onChange={this.changehandler} id='search' value={this.state.search}/>
                            </Form>
                        </Col>
                    </Row>

                    &nbsp;&nbsp;
                    {
                        [0,0,0,0,0,0,0,0].map((x)=>{
                            return(
                                <Row class='h-100 d-inline-block'>
                                    {
                                        [0,0,0,0].map((x)=>{
                                            count+=1
                                            return(
                                                <div>
                                                    {this.items(count)}
                                                </div>
                                            )                                        
                                        })
                                    }
                                </Row>
                            )
                        })
                    }
                </Container>
                <Footer/>
            </div>
        )
    }
}
//margin is top, right, bottom, left
export default Menu;