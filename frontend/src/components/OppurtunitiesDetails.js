import React, {Component} from 'react';

import Navbar from './NavigationBar';
import {Container, Col, Row} from 'react-bootstrap'

class OppurtunitiesDetails extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {jobs} = this.props.location.state;
    
    let start = jobs.image.indexOf('/static/frontend/media/jobs/')
    let end = jobs.image.length
    let url_job = '../..'+jobs.image.slice(start, end)
    
    //name_of_job, type_of_job, contact_information, location_of_job, description_of_job, job_of
    
      return (
        <div>
          <Navbar/>
          <Container>
          <div style={{marginTop:'60px'}} />
            <Row>
              <Col>
              
              <img style={{height:'75%', width:'440px'}} src={url_job}></img>
              </Col>
              <Col>
                
                <h1>{jobs.name_of_job}</h1>
                
                <div id='boldDetails'>Type: </div>
                <p id='normalDetails'>{jobs.type_of_job}</p>

                <div id='boldDetails'>Contact: </div>
                <p id='normalDetails'>{jobs.contact_information}</p>

                <div id='boldDetails'>Location: </div>
                <p id='normalDetails'>{jobs.location_of_job}</p>

                <div id='boldDetails'>Details of what we have to offer: </div>
                <p id='normalDetails'>{jobs.description_of_job}</p>

                <p style={{textAlign:'right'}} id='normalDetails'>Posted by {jobs.job_of}</p>
                
              </Col>
            </Row>
          </Container>
        </div>
        );
    
    }
}

export default OppurtunitiesDetails;