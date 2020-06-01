import React, {Component} from 'react';

import Navbar from './NavigationBar';
import {Button, Container, Row, Col} from 'react-bootstrap';
import {Link} from 'react-router-dom'
import * as axios from 'axios'
import Cookies from 'js-cookie'

class EventsDetails extends Component {

  constructor(props) {
    super(props);
    this.state ={
      username:''
    }
  }
  componentDidMount()
  {
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
                    this.setState({
                      username : response.data.username
                    }, ()=>{})
                    
                }
            })
        }
  }
  render() {
    const {event} = this.props.location.state;
    let start = event.image.indexOf('/static/frontend/media/events/')
    let end = event.image.length
    let url_event = '../..'+event.image.slice(start, end)
    
    //event_name, event_price, event_date, event_contact, event_description, event_of
      return (
          <div>
            <Navbar/>
            <Container>
            
            <div style={{marginTop:'60px'}} />
              
              <Row>
                <Col>
                  <img style={{height:'75%', width:'440px'}} src={url_event}></img>
                </Col>
                
                <Col>
              
                  <h1>{event.event_name}</h1>
                  
                  <div id='boldDetails'>Date & Time: </div>
                  
                  <p id='normalDetails'>{(event.event_date.substring(0,10)).replace(/(\r\n|-|\r)/gm,"/")}</p>
    
                  <div id='boldDetails'>Contact: </div>
                  <p id='normalDetails'>{event.event_contact}</p>

                  <div id='boldDetails'>Price: </div>
                  <p id='normalDetails'>${event.event_price}</p>
                  
                  <div id='boldDetails'>Details of what we have to offer: </div>
                  <p id='normalDetails'>{event.event_description}</p>
                  
                  <p style={{textAlign:'right'}} id='normalDetails'>Posted by {event.event_of}</p>

                  {
                    
                    this.state.username!=''?
                    <Link to={{ pathname: '/PaymentGateway', state: {event:event} }}>
                      <Button id = 'white' variant="danger" size='lg'>Register</Button>
                    </Link>

                    :
                    <div/>
                  }
                </Col>

              </Row>
              
            </Container>
          </div>
        );
    
    }
}

export default EventsDetails;