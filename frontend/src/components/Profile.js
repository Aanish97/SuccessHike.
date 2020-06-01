import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Col, Row, Button, ListGroup, Nav, Tabs, Tab} from 'react-bootstrap';
import ExampleComponent from "react-rounded-image";     // npm install --save react-rounded-image
import Navbar from './NavigationBar';
import Footer from './Footer';

import axios from 'axios'
import Cookies from 'js-cookie'

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editModeEnabled: false,

            username: ' -- ',
            password:'',
            token:'',
            selectedFile:'',

            name: '',
            description: 'I own a petrol pump. You are all Peasants',
            initial: 'I own a petrol pump. You are all Peasants',

            businesses:[],
            events:[],
            jobs:[],

            flag:0
        }

    }
    checkCookie()
    {
        axios.post("cookies/",this.state)
		.then(response => {

            //console.log(response.data.token)
            if(response.data.username == null)
            {
                console.log('no cookies set')
            }
            else
            {
                this.setState({
                    username : response.data.username,
                    password : response.data.password,
                    name : response.data.full_name,
                  }, ()=>{})
            
                if (response.data.selectedFile!=null)
                {
                    let start = response.data.selectedFile.indexOf('/static/frontend/media/users/')
                    let end = response.data.selectedFile.length
                    let url_profile = '../..'+response.data.selectedFile.slice(start, end)
                    
                    this.setState({
                        selectedFile : url_profile,
                    }, ()=>{
                        var img = document.getElementById('profile_img')
                        img.src = this.state.selectedFile
                    })
                }
                else
                {
                    this.setState({
                        selectedFile : '../../static/frontend/static/user.png',
                    }, ()=>{
                        var img = document.getElementById('profile_img')
                        img.src = this.state.selectedFile
                    })
                }

                axios.post("geteventsusers/", this.state) //retrieve data for events
                .then(response => {
                    this.setState({
                        events: response.data
                    });
                    //console.log(response.data)
                })

                axios.post("getjobsusers/", this.state) //retrieve data for jobs
                .then(response => {
                    this.setState({
                        jobs: response.data
                    });
                    //console.log(response.data)
                })

                axios.post("getbusinessesusers/", this.state) //retrieve data for businsses
                .then(response => {
                    this.setState({
                        businesses: response.data
                    });
                    //console.log(response.data)
                })
            }
        })

        
    }

    componentDidMount() {    //runs in start like a constructor
        var token = Cookies.get('token')

        if(token)
        {
            this.state.token = token    //setting token in state
            this.checkCookie(token)     //cross checking token with key in backend database
        }

        return
    }

    editDescription() {
        var x = document.getElementsByClassName('edit-desc-btn')[1];        
        if (x.style.getPropertyValue("display") === "none") {       //cross not visible
            x.style.setProperty("display", "block");
            this.setState({
                editImgURL: 'https://cdn2.iconfinder.com/data/icons/flat-ui-icons-24-px/24/checkmark-24-512.png',
            })
        } else {            
            this.setState({
                description: this.state.initial,
                editImgURL: "https://i.pinimg.com/originals/46/93/ba/4693ba7c63042a6950658d434ca8e55d.png",
            })
            x.style.setProperty("display", "none");
        }

        this.setState({
            editModeEnabled: !this.state.editModeEnabled
        });        
    }

    descriptionChange(event) {
        const inputName = event.target.value;
        
            this.setState({
                initial: inputName,           
         })
       }

    cancelDescChange(event) {
        var x = document.getElementsByClassName('user-desc');
        event.target.style.setProperty("display", "none");
            this.setState({
                editModeEnabled: !this.state.editModeEnabled,
                initial: this.state.description,
                editImgURL: "https://i.pinimg.com/originals/46/93/ba/4693ba7c63042a6950658d434ca8e55d.png",
        });
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
    
    changePassword()
    {
        this.props.history.push('/ChangePassword', { some: 'state' })
    }

    fileChangeListener = event => {
        //console.log(event.target.files[0])
        
        let url
        URL.revokeObjectURL(url);
        url = URL.createObjectURL(event.target.files[0]);
        
        var img = document.getElementById('profile_img')
        img.src = url
        //console.log(url)
        this.setState({
            selectedFile: event.target.files[0]
            })
    }
    
    imgUploadListener = event => {
        //console.log(event.target.files[0])
        let form_data = new FormData()
        if(this.state.selectedFile !=null) 
        {
            form_data.append('image', this.state.selectedFile);
            form_data.append('username', this.state.username);
        }
        
        axios({
            method: 'post',
            url: 'uploadprofile/',
            data: form_data,
            headers: {
                "content-type": "multipart/form-data"
            }
            }).then(response => {
                alert('Profile Image uploaded')
            })
                
    }

    render() {
        /*if(this.state.selectedFile!=null)
        {
            let start = this.state.selectedFile.indexOf('/static/frontend/media/users/')
            let end = this.state.selectedFile.length
            let profile_url = '../..'+this.state.selectedFile.slice(start, end)

            var img = document.getElementById('profile_img')
            img.src = profile_url
        }*/
        return (
            <div>
                <Navbar/>

                <Container id='gridItemsFont'>
                &nbsp;
                    <Row>
                        <Button onClick={this.changePassword.bind(this)} variant='danger' size='sm' style={{width:"auto", margin: '0 0 -2% 83%'}}>Change Password</Button>
                    </Row>
                    
                    <Row>
                        <Col md="auto" >
                            <img id="profile_img" style={{verticalAlign:'middle', width:'220px', height:'220px', borderRadius:"50%"}} alt="Avatar" />
                        </Col>

                        <Col>
                            &nbsp;
                            <h3 id='boldDetails'>{this.state.name}</h3>
                            <input id='profile_img_input' type='file' onChange={this.fileChangeListener}/>
                            <Button onClick={this.imgUploadListener} variant='info' >Save Image</Button>
                        </Col>
                       
                    &nbsp;
                    </Row>

                    <Row style={{marginTop: '2%',marginBottom: '1%'}} block>                      
                        <Col>                        
                    
                        <Tabs defaultActiveKey="My Jobs" transition={false} block>
                            
                            <Tab eventKey="My Events" title="My Events">
                                
                                <Link to='/PostEvent'>
                                    <Button variant='success' size='sm' style={{width:"auto", margin: '1% 0 0 87%'}}>Post Event</Button>
                                </Link>
                                <ListGroup variant="flush" block>
                                    {
                                        this.state.events.map((data)=>{
                                            //console.log(data)
                                            return(
                                                <ListGroup.Item>
                                                <Row block>
                                                    <Col>
                                                        <strong>{data.event_name}</strong>
                                                    </Col>
                                                    
                                                    <Col style={{alignContent:'right'}}>
                                                        <strong>${data.event_price}</strong>
                                                    </Col>
                                                </Row>
                                                    <div block>{data.event_description}</div>

                                                    <Button onClick={this.deleteItem.bind(this, 'events', data.id)} variant='danger' size='sm' > delete</Button>
                                                    &nbsp;

                                                    <Link to={{ pathname: '/PostEvent', state: {event:data, admin:false} }}>
                                                        <Button variant='secondary' size='sm'> edit</Button>
                                                    </Link>

                                                </ListGroup.Item>
                                            )  
                                        })
                                    }
                                </ListGroup>
                            </Tab>

                            <Tab eventKey="My Jobs" title="My Jobs">
                               &nbsp;
                                <Link to='/PostJob'>
                                    <Button variant='success' size='sm' style={{width:"auto", margin: '1% 0 0 87%'}}>Post Job</Button>
                                </Link>
                                <ListGroup variant="flush" block>
                                    {
                                        this.state.jobs.map((data)=>{
                                            //console.log(data)
                                            return(
                                                <ListGroup.Item>
                                                <Row block>
                                                    <Col>
                                                        <strong>{data.name_of_job}</strong>
                                                    </Col>
                                                    
                                                    <Col style={{alignContent:'right'}}>
                                                        <strong>{data.type_of_job}</strong>
                                                    </Col>
                                                </Row>
                                                    
                                                    <div block>{data.description_of_job}</div>
                                                    <Button onClick={this.deleteItem.bind(this, 'jobs', data.id)} variant='danger' size='sm'>delete</Button>

                                                    &nbsp;
                                                    <Link to={{ pathname: '/PostJob', state: {job:data, admin:false} }}>
                                                        <Button variant='secondary' size='sm'> edit</Button>
                                                    </Link>

                                                </ListGroup.Item>
                                            )
                                        })
                                    }
                                </ListGroup>
                            </Tab>

                            <Tab eventKey="My Businesses" title="My Businesses">
                               &nbsp;
                                <Link to='/PostBusiness'>
                                    <Button variant='success' size='sm' style={{width:"auto", margin: '1% 0 0 87%'}}>Post Businesss</Button>
                                </Link>
                                <ListGroup variant="flush" block>
                                    {
                                        this.state.businesses.map((data)=>{
                                            //console.log(data)
                                            return(
                                                <ListGroup.Item>
                
                                                <Row block>
                                                    <Col>
                                                        <strong>{data.business_name}</strong>
                                                    </Col>
                                                    
                                                    <Col style={{alignContent:'right'}}>
                                                        <strong>{data.business_contact}</strong>
                                                    </Col>
                                                </Row>
                                                    
                                                    <div block>{data.business_description}</div>
                                                    <Button onClick={this.deleteItem.bind(this, 'businesses', data.id)} variant='danger' size='sm'>delete</Button>
                                                    
                                                    &nbsp;
                                                    <Link to={{ pathname: '/PostBusiness', state: {business:data, admin:false} }}>
                                                        <Button variant='secondary' size='sm'> edit</Button>
                                                    </Link>

                                                </ListGroup.Item>
                                            )
                                        })
                                    }
                                </ListGroup>
                            </Tab>
                        
                        </Tabs>
                        
                        </Col>
                    </Row>

                </Container>
                <Footer/>
            </div>
        );
    }
}
export default Profile;