import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import { DropdownButton, Dropdown, FormControl, InputGroup, Container, Col, Row, Button, ListGroup, Tabs, Tab} from 'react-bootstrap';
import axios from 'axios'

class adminDashboard extends Component {

    constructor(props) {
      super(props);
      this.state = {
        businesses:[],
        events:[],
        jobs:[],
        users:[],
        categories:[],
        orders:[],
        category_type:'Events',
        category_name:'',
      }
    }

    componentDidMount()
    {
        axios.get("signup/") //retrieve data for jobs
            .then(response => {
                this.setState({
                    users: response.data
                });
            })
        axios.post("getjobs/", this.state) //retrieve data for jobs
            .then(response => {
                this.setState({
                    jobs: response.data
                });
            })
        axios.post("getevents/", this.state) //retrieve data for events
            .then(response => {
                this.setState({
                    events: response.data
                });
            })
        axios.post("getbusinesses/", this.state) //retrieve data for businsses
            .then(response => {
                this.setState({
                    businesses: response.data
                });
            })
        axios.get("categories/") //retrieve data for businsses
            .then(response => {
                console.log(response.data)
                this.setState({
                    categories: response.data
                });
            })
        axios.get("pay/") //retrieve data for businsses
            .then(response => {
                console.log(response.data)
                this.setState({
                    orders: response.data
                });
            })
    }

    deleteItem(type, id)
    {
        let del = {
            type : type,
            ID:id,
        }
        axios.post("deleteitem/", del) //retrieve data for businsses
        .then(response => {
            console.log('deleted')
        })
    }

    handleSelect = (evtKey, evt) => {
        // Get the selectedIndex in the evtKey variable
        this.setState({
            category_type:evtKey
        })
    }
    
    changehandler=(e)=>{    //this is the onchange listener of the form, gets the id and value from the Formcontrol and updates the state constantly
        this.setState({[e.target.id]:e.target.value})
    }

    addCategory()
    {
        axios.post("categories/",this.state)
		.then(response => {
            if(response.data[0] == null) {
                alert('Category already exists!')
            }
            else {
                axios.get("categories/") //updating the categories
                    .then(response => {
                        console.log(response.data)
                        this.setState({
                            categories: response.data,
                            category_name:''
                        });
                    })
            }
        })
    }

    list_of_catgories(type)
    {
        return(
            this.state.categories.map((data)=>{
                if(data.category_type == type)
                {
                    return(
                        <div>
                            &nbsp;
                            <div style={{width:'95%', display:'inline-block'}}>{data.category_name}</div>
                            <div onClick={this.deleteItem.bind(this, 'categories', data.id)} style={{color:'red', fontWeight:'bold', display:'inline-block'}}>X</div>
                         </div>
                        
                    )
                }

            })
        )
    }
    show_categories()
    {
        return(
            <div>
                <Row style={{fontFamily:'Poppins'}}>
                <Col>
                    <h3>Events</h3><hr/>
                    {this.list_of_catgories('Events')}
                </Col>
                <Col>
                    <h3>Businesses</h3><hr/>
                    {this.list_of_catgories('Businesses')}
                </Col>
                <Col>
                    <h3>Jobs</h3><hr/>
                    {this.list_of_catgories('Jobs')} 
                </Col>
                </Row>
                
            </div>
        )
    }

    categories()
    {
        return(
            <div>
                &nbsp;
                <Container>
                <Row><Col>
                    <InputGroup>
                        <FormControl placeholder="Enter category" onChange={this.changehandler} id='category_name' value={this.state.category_name}/>
                        <InputGroup.Append>
                            <DropdownButton onSelect={this.handleSelect} title={this.state.category_type} id="input-group-dropdown-2" variant='danger'>
                                <Dropdown.Item eventKey="Events">Events</Dropdown.Item>
                                <Dropdown.Item eventKey="Businesses">Businesses</Dropdown.Item>
                                <Dropdown.Item eventKey="Jobs">Jobs</Dropdown.Item>
                            </DropdownButton>
                            &nbsp;&nbsp;
                            <Button variant="success" onClick={this.addCategory.bind(this)}>Add</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Col></Row>
                
                    &nbsp;
                    {this.show_categories()}
                
                </Container>
            </div>
        )
    }
    
    events()
    {
        return(
                this.state.events.map((data)=>{
                    return(
                        <ListGroup.Item>
                        <Row block>
                            <Col><strong>{data.event_name}</strong></Col>
                            <Col><strong>event id </strong>{data.id}</Col>
                            <Col><strong>${data.event_price}</strong></Col>
                            <Col><strong>posted by </strong>{data.event_of}</Col>
                        </Row>
                            <div block>{data.event_description}</div>
                            <Button onClick={this.deleteItem.bind(this, 'events', data.id)}  variant='danger' size='sm' style={{alignContent:'right', textDecoration:'none'}}>delete</Button>
                            &nbsp;
                            <Link to={{ pathname: '/PostEvent', state: {event:data, admin:true} }}>
                            <Button variant='secondary' size='sm'> edit</Button>
                        </Link>
                        </ListGroup.Item>
                    )  
                })        
        )
    }

    jobs()
    {
        return(
            this.state.jobs.map((data)=>{
                return(
                    <ListGroup.Item>
                    <Row block>
                        <Col><strong>{data.name_of_job}</strong></Col>
                        <Col><strong>{data.type_of_job}</strong></Col>
                        <Col><strong>posted by </strong>{data.job_of}</Col>
                    </Row>
                        <div block>{data.description_of_job}</div>
                        <Button onClick={this.deleteItem.bind(this, 'jobs', data.id)}  variant='danger' size='sm' style={{alignContent:'right', textDecoration:'none'}}>delete</Button>
                        &nbsp;
                        <Link to={{ pathname: '/PostJob', state: {job:data, admin:true} }}>
                            <Button variant='secondary' size='sm'> edit</Button>
                        </Link>
                    </ListGroup.Item>
                )
            })
        )
    }

    businesses()
    {
        return(
            this.state.businesses.map((data)=>{
                return(
                    <ListGroup.Item>
                    <Row block>
                        <Col><strong>{data.business_name}</strong></Col>
                        <Col><strong>{data.business_contact}</strong></Col>
                        <Col><strong>posted by </strong>{data.business_of}</Col>
                    </Row>
                        <div block>{data.business_description}</div>
                        <Button onClick={this.deleteItem.bind(this, 'businesses', data.id)}  variant='danger' size='sm' style={{alignContent:'right', textDecoration:'none'}}>delete</Button>
                        &nbsp;
                        <Link to={{ pathname: '/PostBusiness', state: {business:data, admin:true} }}>
                            <Button variant='secondary' size='sm'> edit</Button>
                        </Link>
                    </ListGroup.Item>
                )
            })
        )
    }

    users()
    {
        return(
            this.state.users.map((data)=>{
                return(
                    <ListGroup.Item>
                    <Row block>
                        <Col><strong>username</strong> {data.username}</Col>
                        <Col><strong>first_name</strong> {data.first_name}</Col>
                        <Col><strong>last_name</strong> {data.last_name}</Col>
                    </Row>
                        <Button onClick={this.deleteItem.bind(this, 'users', data.id)} variant='danger' size='sm' style={{alignContent:'right', textDecoration:'none'}}>delete</Button>
                    </ListGroup.Item>
                )
            })
        )
    }

    orders()
    {
        return(
            this.state.orders.map((data)=>{
                return(
                    <ListGroup.Item>
                    <Row block>
                        <Col><strong>ticket buyer</strong> {data.username}</Col>
                        <Col><strong>event id</strong> {data.event_id}</Col>
                        <Col><strong>event price</strong> {data.event_price} cents</Col>
                    </Row>
                        <div block><strong>reference number</strong> {data.reference_number}</div>
                        <Button onClick={this.deleteItem.bind(this, 'users', data.id)} variant='danger' size='sm' style={{alignContent:'right', textDecoration:'none'}}>delete</Button>
                    </ListGroup.Item>
                )
            })
        )
    }

    render() {
        
        return(

            <div>
                &nbsp;
                <h1 style={{textAlign:'center'}}>Admin Dashboard</h1>
                &nbsp;
                <Tabs defaultActiveKey="Categories" transition={false} block>
                    <Tab eventKey="Users" title="Users">
                        {this.users()}
                    </Tab>
                    <Tab eventKey="Jobs" title="Jobs">
                        {this.jobs()}
                    </Tab>
                    <Tab eventKey="Events" title="Events">
                        {this.events()}
                    </Tab>
                    <Tab eventKey="Businesses" title="Businesses">
                        {this.businesses()}
                    </Tab>
                    <Tab eventKey="Categories" title="Categories">
                        {this.categories()}
                    </Tab>
                    <Tab eventKey="Orders" title="Orders">
                        {this.orders()}
                    </Tab>
                    
                </Tabs>
            </div>
        
        );
    }
}

export default adminDashboard;