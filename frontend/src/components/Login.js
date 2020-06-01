import React, {Component} from 'react'
import {Container, Col, Row, Form, Button} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import Navbar from './NavigationBar'
import facebook from '../../static/frontend/static/facebook.png'
import * as axios from 'axios'
import Cookies from 'js-cookie'
import FacebookLogin from 'react-facebook-login'; // npm install react-facebook-login

class Login extends Component{

    constructor(props) {
        super(props);

        this.state={    //state for storing data
            //data from Database
            username: '',
            password: '',
            update:false,
            token: '',
            //checking whether user exists or not
            checkUserExist: '',
        };
        self = this;    //inner this being stored in self variable
    }

    componentDidMount()
    {
        var token = Cookies.get('token')
        
        if(token)
        {
            this.state.token = token    //setting token in state
            this.checkCookie(token)     //cross checking token with key in backend database
        }
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

    validatePassword(password1)
    {
        if(password1.length < 8)
        {
            return false
        }
        return true
    }

    logging_in()
    {
        //using ajax axios to post data to django
       
        axios.post("login/",this.state)
		.then(response => {

            var fname = response.data.first_name
            var lname = response.data.last_name
            
            if(fname == null & lname==null)
            {
                alert('User Does not exist')
            }
            else
            {
                //setting up the cookie token, cookie will expire in 7 days
                Cookies.set('token', response.data.token,{ expires: 7 })
                //the json being passed is not being used in the profile
                this.props.history.push('/Profile', { username: this.state.username, first_name: fname, last_name: lname })
            }
        })
    }

    login_to_profile() {    //function when get started button is clicked
        
        if(this.validateEmail(this.state.username) & this.validatePassword(this.state.password))
        {
            this.logging_in()
        }
    }

    //validating username token incase user tries to be smarty pants
    checkCookie()
    {
        axios.post("cookies/",this.state)
		.then(response => {

            console.log(response.data.token)
            if(response.data.username == null)
            {
                console.log('No cookie is set')
            }
            else
            {
                this.state.username = response.data.username
                this.state.password = response.data.password
                this.logging_in()
            }
        })
    }

    responseFacebook = response => {
        console.log('Hello')
        console.log(response)//.name+' ' + response.email)
        /*this.setState({
            name: response.name,
            email: response.email,
        });

        axios.post("loginfb/", this.state)
		.then(response => {
            console.log(response)
            Cookies.set('token', response.data.token,{ expires: 7 })
            this.props.history.push('/Profile', { username: this.state.email, first_name: this.state.name, last_name: '' })
            
        });*/
    }
    
    facebook_btn_click = () => console.log("Facebook Button Clicked");

    render() {

        let facebookData = (
            <FacebookLogin
                appId="622940614968348"
                autoLoad={true}
                fields="email"
                callback={this.responseFacebook.bind(this)} 
                cssClass="fb-btn"/>
                );

        return (
            <div>
                <Navbar/>
                <Container id='gridItemsFont' md>
                    &nbsp;
                    <Row className="justify-content-md-center">
                        <Col lg="4">
                            <div id='center_align_text'><h1>SuccessHike.</h1></div>
                        </Col>
                    </Row>

                    <div className='container-login'>

                        <Row className="justify-content-md-center">
                            <Col id='Login_or_login' lg="4">
                                <div id='center_align_text'><h2>Login</h2></div>
                            </Col>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Col className='rounded-secondary' lg="4">
                            &nbsp;
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email/Username</Form.Label>
                                    <Form.Control type="email" placeholder="Email" onChange={this.changehandler} id='username' value={this.state.username}/>
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" onChange={this.changehandler} id='password' value={this.state.password}/>
                                </Form.Group>
                                &nbsp;

                                <Button onClick={this.login_to_profile.bind(this)} variant="danger" type="submit" size='lg' block>
                                    Login
                                </Button>
                                &nbsp;
                                <div>{facebookData}</div>
                            
                                &nbsp;
                                <div id='center_align_text'>or</div>
                                &nbsp;
                                <Link to='/Signup' style={{ textDecoration: 'none' }}>
                                    <button className= "btn btn-block btn-lg btn-outline-info" size='lg' block>Sign up</button>
                                </Link>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>
        );
    }
}
export default Login;