import React, {Component} from 'react';
import {Row, Col, Button, Container, Form, Dropdown, DropdownButton} from 'react-bootstrap'
import Navbar from './NavigationBar';
import Footer from './Footer';
import {Link} from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'
import Calendar from 'react-calendar'                          // npm install react-calendar

class PostEvent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username:'',
            event_name:'',
            event_contact:'',
            event_type:'select type',
            event_price:'',
            event_description:'',

            selectedFile:null,

            date: new Date(),
            check: "yes",

            categories:[],
            edit_mode:false,
            admin:false,
            edit_event_details:[]
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

        if (this.props.location.state!=undefined)
        {
            const {event, admin} = this.props.location.state;
            /*setState() is usually asynchronous, which means that at the time you
             console.log the state, it's not updated yet. Try putting the log in 
             the callback of the setState() method. It is executed after the state
             change is complete
             
             this.setState({ dealersOverallTotal: total }, () => {
                console.log(this.state.dealersOverallTotal, 'dealersOverallTotal1');
            }); 
             */
            this.setState({ 
                edit_mode:true,

                event_name:event.event_name,
                event_contact:event.event_contact,
                event_type:event.event_type,
                event_price:event.event_price,
                event_description:event.event_description,
                selectedFile: event.image
            })
            if(admin)
            {
                this.setState({
                    admin:true,
                    username:event.event_of
                })
                return
            }
        }

        var token = Cookies.get('token')
        
        if(token)
        {
            this.state.token = token    //setting token in state
            
            axios.post("cookies/",this.state)
            .then(response => {

                console.log(response.data.token)
                if(response.data.username == null)
                {
                    alert('No cookie is set')
                }
                else
                {
                    this.state.username = response.data.username
                }
            })
        }
    }
    
    changehandler=(e)=>{    //this is the onchange listener of the form, gets the id and value from the Formcontrol and updates the state constantly
        this.setState({[e.target.id]:e.target.value})
    }

    onChange(selectedDate) {
        this.setState({ 
            date: selectedDate, 
        });
    }


    go_to_db(form_data)
    {
        //if edit_mode is true then it is checked in backend
        //axios.post("postevent/",this.state)
        axios({
            method: 'post',
            url: 'postevent/',
            data: form_data,
            headers: {
                "content-type": "multipart/form-data"
            }
        }).then(response => {
            console.log(response.data)
            if(response.data[0] == null) {
                if(this.state.edit_mode==true) {
                    alert('Event updated!')
                    if(this.state.admin)
                    {
                        this.props.history.push('/adminDashboard', { some: 'state' })                        
                        return
                    }
                    this.props.history.push('/Profile', { some: 'state' })
                }
                else {
                    alert('This event is already up')
                }   
            }
            else {
                alert('Event Created')
                this.props.history.push('/Profile', { some: 'state' })
            }
        })
    }

    postevent() 
    {        
        var itms = [
                    this.state.event_name,
                    this.state.event_contact,
                    this.state.event_price,
                    this.state.date,
                    this.state.event_type,
                    this.state.event_description
                    ]
        if(isNaN(this.state.event_price))
        {
            alert('Event price is numeric')
            return
        }
        for (var i = 0; i < itms.length; i++) 
        {
            if(itms[i] == '' || itms[i] == 'select type')
            {
                alert('Required Field left empty')
                return
            }
        }

        let form_data = new FormData()
        if(this.state.selectedFile !=null) 
        {   
            form_data.append('event_name', this.state.event_name);
            form_data.append('event_contact', this.state.event_contact);
            form_data.append('event_price', this.state.event_price);
            form_data.append('date', this.state.date);
            form_data.append('event_type', this.state.event_type);
            form_data.append('event_description', this.state.event_description);
            form_data.append('image', this.state.selectedFile);
            form_data.append('username', this.state.username);
            form_data.append('edit_mode', this.state.edit_mode);
        }
        else
        {
            alert('Required Field left empty')
            return
        }

        this.go_to_db(form_data)
    }
   
    show_navbar_or_not()
    {
        if(this.state.admin)
        {
            return(<div>&nbsp;</div>)
        }
        else
        {
            return(<div><Navbar/></div>)
        }
    }

    handleSelect = (evtKey, evt) => {
        // Get the selectedIndex in the evtKey variable
        this.setState({
            event_type:evtKey
        })
    }

    show_type()
    {
        return(
            <DropdownButton onSelect={this.handleSelect} title={this.state.event_type} id="input-group-dropdown-2" variant='success'>
            {
                this.state.categories.map((data)=>{
                if(data.category_type=='Events') {
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

    fileChangeListener = event => {
        console.log(event.target.files[0])
        
        let url
        URL.revokeObjectURL(url);
        url = URL.createObjectURL(event.target.files[0]);
        
        var img = document.getElementById('event_img')
        img.src = url
        console.log(url)
        this.setState({
            selectedFile: event.target.files[0]
        })
    }

    render() {
        if(this.state.edit_mode==true) {
            var event_mode = 'Edit Event'

            var _img_input = document.getElementById('image_input')
            _img_input.style.setProperty("display", "none");
            
            let start = this.state.selectedFile.indexOf('/static/frontend/media/events/')
            let end = this.state.selectedFile.length
            let url_job = '../..'+this.state.selectedFile.slice(start, end)
            
            var img = document.getElementById('event_img')
            img.src = url_job
        }
        else {
            var event_mode = 'Post Event'
        }
        
        return(

            <div>
            {this.show_navbar_or_not()}
            &nbsp;
            <Container>
                <Row>
                    <Col>
                        <h1>{event_mode}</h1>
                    </Col>
                    <Col style={{textAlign:'right', marginTop:'1%'}}>

                        <Button onClick={this.postevent.bind(this)} variant='danger'>{event_mode}</Button>
                    </Col>
                </Row>
                    &nbsp;
                    
                <Form style={{fontFamily:'poppins'}}>
                    
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>
                                    <strong>Name of event </strong>
                                    <nobr style={{color:'red'}}>*</nobr>
                                </Form.Label>
                                
                                    <Form.Control disabled={this.state.edit_mode} as="textarea" rows="1" onChange={this.changehandler} id='event_name' value={this.state.event_name}/>

                            </Form.Group>  
                        </Col>

                        <Col>
                            <Form.Group>
                                <Form.Label>        
                                    <strong>Type of Event </strong>
                                    <nobr style={{color:'red'}}>*</nobr>
                                </Form.Label>

                                {this.show_type()}

                            </Form.Group>
                        </Col>
                    </Row> 

                    <Form.Group>
                        <Form.Label>
                        <strong>Contact information for the attendees </strong>
                            <nobr style={{color:'red'}}>*</nobr>
                        </Form.Label>
                        <Form.Control as="textarea" rows="1" onChange={this.changehandler} id='event_contact' value={this.state.event_contact}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>
                            <strong>Price of Event</strong> (in $)
                            <nobr style={{color:'red'}}>*</nobr>
                        </Form.Label>
                            <Form.Control as="textarea" rows="1" onChange={this.changehandler} id='event_price' value={this.state.event_price}/>
                    </Form.Group>
                       
                    <Form.Group>
                        <Form.Label>
                            <strong>Add a description </strong>
                            <nobr style={{color:'red'}}>*</nobr>
                        </Form.Label>
                        <Form.Control as="textarea" rows="3" onChange={this.changehandler} id='event_description' value={this.state.event_description}/>
                    </Form.Group>

                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>
                                    <strong>Date of event </strong>
                                    <nobr style={{color:'red'}}>*</nobr>
                                </Form.Label>
                                <div style={{width:'65%'}}>
                                <Calendar onChange={this.onChange.bind(this)} value={this.state.date}/>
                                </div>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group>
                                <Form.Label>
                                    <strong>Upload Image </strong>
                                    <nobr style={{color:'red'}}>*</nobr>
                                </Form.Label>
                            </Form.Group>
                            <img id='event_img' placeholder='Upload image' style={{height:'180px', width:'220px'}}/>
                                &nbsp;
                            <input id='image_input' type='file' onChange={this.fileChangeListener}/> 
                        </Col>
                    </Row>
                    
                </Form>
                    
            </Container>
            <Footer/>
        </div>
        );
    }
}

export default PostEvent;