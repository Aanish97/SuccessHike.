import React, {Component} from 'react';
import {Container, Col, Row, Form, Button} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import axios from 'axios'

import Navbar from './NavigationBar'
import facebook from '../../static/frontend/static/facebook.png'

class Signup extends Component{

    constructor(props) {
        super(props);

        this.state={    //state for storing data 
            //data from Database
            username: '',   
            password: '',
            repassword: '',
            first_name:'',
            last_name:'',
            update:false,
            //checking whether user exists or not
            checkUserExist: '',

        };
        self = this;    //inner this being stored in self variable
    }

    changehandler=(e)=>{    //this is the onchange listener of the form, gets the id and value from the Formcontrol and updates the state constantly
        this.setState({[e.target.id]:e.target.value})
    }

    validateEmail(email) 
    {
        if (email.includes('@'))
        {
            return (true)
        }
        alert("Invalid email address!")
        return (false)
    }

    validatePassword(password1, password2)
    {
        if(password1 !== password2)
        {
            alert("Password don't match!")
            return false
        }
        if(password1.length < 8)
        {
            alert("Minimum length of password is 8 characters!")
            return false
        }
        return true
    }

    post_data_backend()   //validated email and password from form
    {
        //using ajax axios to post data to django 
        
        axios.post("signup/",this.state)
		.then(response => {
            
            if(response.data[0] == null)
            {
                alert('User created')
                this.props.history.push('/Login')
            }
            else
            {
                alert('user already exists')
            }
        })

    }

    get_started() {    //function when get started button is clicked

        if(this.validateEmail(this.state.username) & this.validatePassword(this.state.password, this.state.repassword))
        {
            if(this.state.first_name!='' & this.state.last_name!='')
            {
                this.post_data_backend()
            }
            else
            {
                alert('name too short')
            }
        }
    }

    render() {
        return (

            <div>
                <Navbar/>
                <Container id='gridItemsFont' lg>

                    &nbsp;
                    <Row className="justify-content-md-center">
                        <Col lg="4">
                            <div id='center_align_text'><h1>SuccessHike.</h1></div>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col id='signup_or_login' lg="4">
                            <h2>Signup</h2>
                            </Col>
                    </Row>
                    <Row className="justify-content-lg-center">
                        <Col  className='rounded-secondary' lg="3">
                            <Form.Group>
                                <Form.Label></Form.Label>
                                <Form.Control type="text" placeholder="First Name" onChange={this.changehandler} id='first_name' value={this.state.first_name}/>
                            </Form.Group>
                        </Col>
                        <Col  className='rounded-secondary' lg="3">
                            <Form.Group>
                                <Form.Label></Form.Label>
                                <Form.Control type="text" placeholder="Last Name" onChange={this.changehandler} id='last_name' value={this.state.last_name}/>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="justify-content-lg-center">
                        <Col className='rounded-secondary' lg="6">
                        
                            <Form.Group controlId="email">
                                <Form.Control type="email" placeholder="Email" onChange={this.changehandler} id='username' value={this.state.username}/>
                            </Form.Group>

                            <Form.Group controlId="password">  
                                <Form.Control type="password" placeholder="Password" onChange={this.changehandler} id='password' value={this.state.password}/>
                            </Form.Group>

                            <Form.Group controlId="re_password">    
                                <Form.Control type="password" placeholder="Re-enter Password" onChange={this.changehandler} id='repassword' value={this.state.repassword}/>
                            </Form.Group>

                            &nbsp;
                                <Button onClick={this.get_started.bind(this)} variant="danger" type="submit" size='lg' block>
                                    &nbsp;  Get Started  &nbsp;
                                </Button>
                            
                            &nbsp;
                            <div id='center_align_text'>or</div>
                            &nbsp;
                            <Button id='facebookBtn' type="submit" size='lg' block>
                                <img id='facebookSize' src={facebook}></img>
                                &nbsp;  Login with Facebook &nbsp;
                            </Button>
                            
                        </Col>
                    </Row>
                    
                </Container>
            </div>
        );
    }
}
export default Signup;