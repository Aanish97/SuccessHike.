import React, {Component} from 'react';
import {Dropdown, DropdownButton, Row, Col, Button, Container, Form} from 'react-bootstrap'
import Navbar from './NavigationBar';
import Footer from './Footer';
import axios from 'axios';
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import FormData from 'form-data'

class PostJob extends Component {

    constructor(props) {
        super(props);

        this.state={    //state for storing data 
            username:'',
            form_name_of_job:'',
            form_type_of_job:'select type',
            form_contact_information:'',
            form_location_of_job:'',
            form_url_of_company:'',
            form_description_of_job:'',
            
            categories:[],
            edit_mode:false,
            admin:false,

            selectedFile: null
        };
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
            const {job, admin} = this.props.location.state;
            
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

                form_name_of_job:job.name_of_job,
                form_type_of_job:job.type_of_job,
                form_contact_information:job.contact_information,
                form_location_of_job:job.location_of_job,
                form_url_of_company:job.url_of_company,
                form_description_of_job:job.description_of_job,
                selectedFile:job.image,
            })
                        
            if(admin)
            {
                this.setState({
                    admin:true,
                    username:job.job_of
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

    go_to_db(form_data)
    {            
        axios({
            method: 'post',
            url: 'postjob/',
            data: form_data,
            headers: {
                "content-type": "multipart/form-data"
            }
            }).then(response => {
                
                console.log(response.data)
                if(response.data[0] == null) 
                {
                    if(this.state.edit_mode==true) 
                    {
                        alert('Job updated!')
                        if(this.state.admin==true)
                        {
                            this.props.history.push('/adminDashboard', { some: 'state' })                        
                            return
                        }
                        this.props.history.push('/Profile', { some: 'state' })
                    }
                    else 
                    {
                        alert('This job already exists')
                    }   
                }
                else 
                {
                    alert('Oppurtunity Created')
                    this.props.history.push('/Profile', { some: 'state' })
                }

            })
    }

    postjob() 
    {        
        var itms = [
                    this.state.form_name_of_job,
                    this.state.form_type_of_job,
                    this.state.form_location_of_job,
                    this.state.form_contact_information,
                    this.state.form_description_of_job,
                    this.state.form_url_of_company
                    ]
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
            form_data.append('form_name_of_job', this.state.form_name_of_job);
            form_data.append('form_type_of_job', this.state.form_type_of_job);
            form_data.append('form_location_of_job', this.state.form_location_of_job);
            form_data.append('form_contact_information', this.state.form_contact_information);
            form_data.append('image', this.state.selectedFile);
            form_data.append('form_description_of_job', this.state.form_description_of_job);
            form_data.append('form_url_of_company', this.state.form_url_of_company);
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
            form_type_of_job:evtKey
        })
    }

    show_type()
    {
        return(
            <DropdownButton onSelect={this.handleSelect} title={this.state.form_type_of_job} id="input-group-dropdown-2" variant='success'>
            
            {
                this.state.categories.map((data)=>{
                if(data.category_type=='Jobs') {
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
        //console.log(event.target.files[0])
        
        let url
        URL.revokeObjectURL(url);
        url = URL.createObjectURL(event.target.files[0]);
        
        var img = document.getElementById('job_img')
        img.src = url
        //console.log(url)
        this.setState({
            selectedFile: event.target.files[0]
            })
    }
    
    render() {
    
        if(this.state.edit_mode==true) {
            var event_mode = 'Edit Oppurtunity'
            var event_mode_btn = 'Update'
           
            //image field cannot be updated
            var _img_input = document.getElementById('image_input')
            _img_input.style.setProperty("display", "none");
            
            let start = this.state.selectedFile.indexOf('/static/frontend/media/jobs/')
            let end = this.state.selectedFile.length
            let url_job = '../..'+this.state.selectedFile.slice(start, end)
            
            var img = document.getElementById('job_img')
            img.src = url_job
        }
        else {
            var event_mode = 'Create an Oppurtunity'
            var event_mode_btn = 'Open Oppurtunity'
        }

        return(

            <div>
            {this.show_navbar_or_not()}
            &nbsp;
            <Container style={{fontFamily:'Poppins'}}>
                <Row>
                    <Col>
                        <h2 style={{fontFamily:'poppins'}}>{event_mode}</h2>
                    </Col>
                    <Col style={{textAlign:'right', marginTop:'0.5%'}}>
                        <Button onClick={this.postjob.bind(this)} type="submit" variant='danger'>
                            {event_mode_btn}
                        </Button>
                    </Col>
                </Row>
                    &nbsp;
                    
                    <Form style={{fontFamily:'poppins'}}>

                    <Row>
                        <Col>
                        <Form.Group controlId="exampleForm.ControlInput1">

                            <Form.Label>
                                <strong>Name of Job </strong>
                                <nobr style={{color:'red'}}>*</nobr>
                            </Form.Label>
                            <Form.Control disabled={this.state.edit_mode} as="textarea" rows="1" onChange={this.changehandler} id='form_name_of_job' value={this.state.form_name_of_job}/>

                        </Form.Group>
                        </Col>
                        <Col>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>
                                <strong>Type of Job </strong>
                                <nobr style={{color:'red'}}>*</nobr>
                            </Form.Label>

                            {this.show_type()}

                        </Form.Group>
                        </Col>
                    </Row> 

                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>
                            <strong>Location of Job </strong>
                            <nobr style={{color:'red'}}>*</nobr>
                        </Form.Label>
                        <Form.Control as="textarea" rows="1" onChange={this.changehandler} id='form_location_of_job' value={this.state.form_location_of_job}/>
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>
                            <strong>URL of the Company </strong>
                            <nobr style={{color:'red'}}>*</nobr>
                        </Form.Label>
                        <Form.Control as="textarea" rows="1" onChange={this.changehandler} id='form_url_of_company' value={this.state.form_url_of_company}/>
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>
                            <strong>Description about the position </strong>
                            <nobr style={{color:'red'}}>*</nobr>
                        </Form.Label>
                        <Form.Control as="textarea" rows="3" onChange={this.changehandler} id='form_description_of_job' value={this.state.form_description_of_job}/>
                    </Form.Group>

                    <Row>
                        <Col>
                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>
                                    <strong>Contact Information for the applicants</strong>
                                    <nobr style={{color:'red'}}>*</nobr>
                                </Form.Label>
                                <Form.Control as="textarea" rows="1" onChange={this.changehandler} id='form_contact_information' value={this.state.form_contact_information}/>
                            </Form.Group>
                        </Col> 
                        <Col>
                            <img id='job_img' placeholder='Upload image' style={{height:'180px', width:'220px'}}/>
                            &nbsp;
                            <input id='image_input' type='file' onChange={this.fileChangeListener}/>                             
                        </Col>
                    </Row> 

                    </Form>
                    </Container>
                    <div>
                    <Footer/>
                    </div>
                </div>
        
        
        );
    }
}

export default PostJob;