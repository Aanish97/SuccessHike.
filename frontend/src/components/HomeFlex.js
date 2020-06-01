import React, {Component} from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import {Link} from 'react-router-dom'
import Nav from 'react-bootstrap/Nav'
import flower from '../../static/frontend/static/flowers.jpeg'


class FlexComponent extends Component{
  
    render() {
    
        return(
            <Container id='rowSpace'>
                <Row>
                    <Col id='flex' lg={7}>
                        <p>Welcome to SuccessHike, where we list</p>
                        <p>Small business, events, and opportunities.</p>
                        &nbsp;
                      </Col>
                      <Col>
                        <Link to="/Signup" style={{textDecoration: 'none' }}>   
                            <Button variant='danger' size='lg' block>
                                Join Our Platform                    
                            </Button>
                        </Link>

                    </Col>
                    
                    
                </Row>

                <Row id='flex'>
                    <p>
                        <Nav.Link style={{color:'black', textDecoration: 'none' }} as={Link} to={{pathname:"/MainMenu", state: {PageName:'Small Businesses'}}}>
                            <img class="hoverable" id='profilePicture' src={'../../static/frontend/static/search_icon.png'}/>
                            Minimize your Recommendations List! Find a small business that fits your need
                        </Nav.Link>
                    </p>
                    
                    <p>
                        <Nav.Link style={{color:'black', textDecoration: 'none' }} as={Link} to={{pathname:"/MainMenu", state: {PageName:'Events'}}}>
                            <img class="hoverable" id='profilePicture' src={'../../static/frontend/static/search_icon.png'}/>
                            Find Local Events and Grab Tickets! Conveniently be more social.
                        </Nav.Link>
                    </p>
                    
                    <p>
                    <Nav.Link style={{color:'black', textDecoration: 'none' }} as={Link} to={{pathname:"/MainMenu", state: {PageName:'Oppurtunities'}}}>
                        <img class="hoverable" id='profilePicture' src={'../../static/frontend/static/search_icon.png'}/>
                        Find Volunteer, Job and Franchising Opportunities! Make the world a better place.
                    </Nav.Link>
                    </p>
                </Row>
            </Container>
        );
    }
}
export default FlexComponent;


