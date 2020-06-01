import React, {Component} from 'react';

import Navbar from './NavigationBar';
import Footer from './Footer';
import Grid from './Grid';

import {Button, Row, Col, Container} from 'react-bootstrap'

class MainMenu extends Component {

  constructor(props) {
    super(props);
  }
  refreshPage()
  { 
    //window.location.reload(true);
  }

  render() {

    let {PageName} = this.props.location.state;
    let changedPageName = PageName;
    let randomCategory;
    
    if(changedPageName == 'Events')
    {
      changedPageName = 'Upcoming ' + PageName;
      randomCategory = 'Networking Events';
    }
    else if(changedPageName == 'Small Businesses')
    {
      changedPageName = 'List of ' + PageName;
      randomCategory = 'Graphic Designing';
    }
    else
    {
      changedPageName = 'List of ' + PageName;
      randomCategory = 'Franchise Oppurtunities';
    }

        return (
            <div>
              {this.refreshPage()}
              <Navbar/>
           
              <Container>
                <Row>
                  <Col> 
                  <h2 id='headings'>{changedPageName}</h2>
                  </Col>
                  &nbsp;
                  <Grid PageName={PageName}/>
                  
                </Row>
              
                <Row>
                  <Col md={4}>
                    <h2 id='headings'>{randomCategory}</h2>
                  </Col>
        
                  <Col md={{ span: 4, offset: 4 }}>
                    <h2 id='headingsRight'>
                      <Button variant="danger" size='md'>See All {PageName}</Button>
                    </h2>
                  </Col>

                </Row>
               </Container> 
               <Grid PageName={PageName}/>
                <Footer/>
            </div>
        )   
    }
}

export default MainMenu;