import React, {Component} from 'react';

//these are the react components
import {Carousel} from 'react-bootstrap'
import Navbar from './NavigationBar';
import HomeFlex from './HomeFlex';
import Footer from './Footer';

class Home extends Component{
  
   render() {
        return (
            <div>
                <Navbar/>

                <Carousel style={{fontFamily:'poppins'}}>
                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    style={{width:'auto', height:'620px'}}
                    src={'../../static/frontend/static/footbal_game.jpg'}
                    alt="First slide"
                    />
                    <Carousel.Caption>
                    <h3>Here we are a Family</h3>
                    <p style={{fontSize:'20px'}}>You have a quality or ability that makes you important, attractive, or useful.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    style={{width:'auto', height:'620px'}}
                    src={'../../static/frontend/static/the_sea.jpg'}
                    alt="Third slide"
                    />

                    <Carousel.Caption>
                    <h3>Offering more Jobs than before</h3>
                    <p style={{fontSize:'20px'}}>We have oppurtunities which might last years to come.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    style={{width:'auto', height:'620px'}}
                    src={'../../static/frontend/static/working.jpg'}
                    alt="Third slide"
                    />

                    <Carousel.Caption>
                    <h3>A Platform to create small Businesses & Events</h3>
                    <p style={{fontSize:'20px'}}>Offering to create Businesses & conduct Events.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                </Carousel>

                <br/>

                &nbsp;

                <HomeFlex/>

                <Footer/>

            </div>
        );
    }
}
export default Home;