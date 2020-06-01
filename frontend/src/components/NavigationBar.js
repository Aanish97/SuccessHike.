import React, {Component} from 'react';
import {Nav, Navbar, Form, Button, FormControl, Dropdown, OverlayTrigger, Popover} from 'react-bootstrap'
import {Link, withRouter} from 'react-router-dom'
import * as axios from 'axios'
import Cookies from 'js-cookie'

class NavigationBar extends Component{
  
    constructor(props) 
    {
      super(props);

      this.state={    //state for storing data 
          //data from Database
          username: '',   
          password: '',
          token: '',
          first_name:'',
          //checking whether user exists or not
          checkUserExist: '',

      };
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

    checkCookie()
    {
        axios.post("cookies/",this.state)
		    .then(response => {

            console.log(response.data.token)
            if(response.data.username == null)
            {
                alert('No cookie is set')
            }
            else
            {
              this.setState({
                username : response.data.username,
                password : response.data.password,
                first_name : response.data.first
              }, ()=>{})
            }
        })
    }

    dropDownMenu()
    {
      return(
        <div>
          <Dropdown.Item>Profile</Dropdown.Item>
          <Dropdown.Item>Signout</Dropdown.Item>
        </div>
      )
    }

    signout_remove_cookie()
    {
        Cookies.remove('token')
        this.props.history.push('/Login', {username: this.state.username})
    }

    go_to_profile()
    {
      this.props.history.push('/Profile', {username: this.state.username})
    }

  render() {
    
    return (
        
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        
        <Navbar.Brand as={Link} to="/">SuccessHike.</Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            
              <Nav.Link as={Link} to="/">Home</Nav.Link>
            
              <Nav.Link as={Link} 
                to={{pathname:"/Menu", state: {type_menu:'Small Businesses'}}}>
                Small Businesses
              </Nav.Link>

              <Nav.Link as={Link} to={{pathname:"/Menu", state: {type_menu:'Events'}}}>
                Events
              </Nav.Link>

              <Nav.Link as={Link} to={{pathname:"/Menu", state: {type_menu:'Oppurtunities'}}}>
                Oppurtunities
              </Nav.Link>

          </Nav>
          {
            this.state.token=='' ?

                <Link to="/Login" style={{textDecoration: 'none' }}>
                  <Button id = 'white' variant="link" size='sm' style={{ textDecoration: 'none' }}>Login</Button>
                </Link>
             
            :
             
            <OverlayTrigger
              trigger="click"
              key= 'bottom'
              placement='bottom'
              overlay={
                <Popover id={`popover-positioned-bottom`}>
                  
                  <Popover.Content>
                  <Button onClick={this.go_to_profile.bind(this)} id = 'white' variant="success" size='sm' style={{ textDecoration: 'none' }}>Profile</Button>
                  
                  <Button onClick={this.signout_remove_cookie.bind(this)} id = 'white' variant="danger" size='sm' style={{ textDecoration: 'none' }}>Signout</Button>
                  </Popover.Content>
                </Popover>
              }
            >
              <div style={{color:'white'}}>Hi {this.state.first_name}</div>
            </OverlayTrigger>

          }
          
        </Navbar.Collapse>
      </Navbar>
      );
    }
}
export default withRouter(NavigationBar);