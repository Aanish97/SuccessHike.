import React, {Component} from 'react';
import {Container, Col, Row, Form, Spinner, Button} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import Navbar from './NavigationBar';
import Profile from './Profile';
import * as axios from 'axios'
import Cookies from 'js-cookie'

class ChangePassword extends Component{

    constructor(props) {
        super(props);

        this.state={    //state for storing data 
            //data from Database
            username:'',
            password: '',
            repassword: '',
            update:true,
            password_token: '',
            load:'',
        };
        self = this;    //inner this being stored in self variable
    }

    getToken() {
        
        //this will send the email at username's email
        axios.post("sendemail/",this.state)
            .then(response => {
            if(response.data != false) {
                console.log('email sent')
                var _email = document.getElementsByClassName('email-block')[0];
                var _token = document.getElementsByClassName('token-block')[0];
                _email.style.setProperty("display", "none");
                _token.style.setProperty("display", "block");
                
            }
            else {
                alert('No such account found')
            }
            
        })
    }

    validateToken() {
        axios.post("sendemail/",this.state)
        .then(response => {
            if(response.data == true) {
                var _token = document.getElementsByClassName('token-block')[0];
                var _password = document.getElementsByClassName('password-block')[0];
                _token.style.setProperty("display", "none");
                _password.style.setProperty("display", "block");            
            }
            else {
                alert('Incorrect token entered')
            }
        })
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

    cookie_creation()
    {
        axios.post("login/",this.state)
		.then(response => {
            //setting up the cookie token, cookie will expire in 7 days
            Cookies.set('token', response.data.token,{ expires: 7 })
            //the json being passed is not being used in the profile
            this.props.history.push('/Profile', { some: 'state' })
            alert('Password Changed')
        })
    }

    chngPassword()
    {
        axios.post("signup/",this.state)
        .then(response => {
            if(response.data == true) {
                this.cookie_creation()                
            }
            else {
                this.props.history.push('/Profile', { some: 'state' })
                alert('Password could not be changed')
            }
        })
    }

    changehandler=(e)=>{    //this is the onchange listener of the form, gets the id and value from the Formcontrol and updates the state constantly
        this.setState({[e.target.id]:e.target.value})
    }

    render() {

        return (
            <div>
                <Navbar/>
                <Container id='gridItemsFont' md>
                    &nbsp;
                    <div className='container-login'>

                        
                        <Row className="justify-content-md-center">
                            <Col id='Login_or_login' lg="4">
                                <div id='center_align_text'><h2>Change Password</h2></div>
                            </Col>
                        </Row>

                        <div className="email-block">
                            <Row className="justify-content-md-center">
                                <Col className='rounded-secondary' lg="4">
                                &nbsp;     
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Enter Email</Form.Label>
                                        <Form.Control type="email" placeholder="Email" onChange={this.changehandler} id='username' value={this.state.username}/>
                                    </Form.Group>

                                    <Button variant="danger" type="submit" size='lg' block onClick={this.getToken.bind(this)}>
                                        &nbsp;Get Token&nbsp;
                                    </Button>
                                    &nbsp;
                                    <h4 className='loading' style={{textAlign:'center', display: "none"}}>{this.state.load}</h4>
                                </Col>
                            </Row>
                        </div>
                        
                        <div className="token-block" style={{display: "none"}}>
                            <Row className="justify-content-md-center">
                            <Col className='rounded-secondary' lg="4">
                            &nbsp;     
                                <p>A token has been sent to you via email.</p>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Enter Token </Form.Label>
                                    <Form.Control placeholder="Token" onChange={this.changehandler} id='password_token' value={this.state.password_token}/>
                                </Form.Group>

                                <Button variant="danger" type="submit" size='lg' block onClick={this.validateToken.bind(this)}>
                                    &nbsp;Submit&nbsp;
                                </Button>
                            
                            </Col>
                        </Row>
                        </div>

                        <div className="password-block" style={{display: "none"}}>
                            <Row className="justify-content-md-center">
                            <Col className='rounded-secondary' lg="4">
                            &nbsp;     
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Enter Password </Form.Label>
                                    <Form.Control placeholder="Password" onChange={this.changehandler} id='password' type="password" value={this.state.password}/>
                                </Form.Group>
                                
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Re-enter Password </Form.Label>
                                    <Form.Control placeholder="Password" onChange={this.changehandler} id='repassword' type="password" value={this.state.repassword}/>
                                </Form.Group>

                                <Button variant="danger" type="submit" size='lg' onClick={this.chngPassword.bind(this)} block>
                                    &nbsp;Change Password&nbsp;
                                </Button>
                            
                            </Col>
                        </Row>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

}
export default ChangePassword;