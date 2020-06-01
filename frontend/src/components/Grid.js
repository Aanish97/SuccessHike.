import React, {Component} from 'react';
import {Row, Container, Col} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import flower from '../../static/frontend/static/flowers.jpeg'

class GridComponent extends Component {

    constructor(props) {
      super(props);
    }

    makeItemLink(Pname)  {
        Pname = Pname.split(" ").join("");
        Pname = '/' + Pname + 'Details';
        return Pname;
    }

    render() {
        let date_time = '25-April-2020, 8:00pm';
        let desc = 'Mindship deep into health tech apps and market';
        
        let itemLink = this.makeItemLink(this.props.PageName);
        
        if (this.props.PageName != 'Events')
        {
            date_time ='';
        }
        return(
            
            <Container id='gridItemsFont'>
                <Row class='h-100 d-inline-block'>
            
                    <Col id='black' md>
                    <Link to={{pathname:itemLink, state: {PageName:this.props.PageName}}} style={{ textDecoration: 'none' }}>
                            <div id='boldDetails' style={{ color: 'black' }}>{date_time}</div>
                            <img class="hoverable" id='gridItemImgSize' src={flower}></img>
                            <p style={{ color: 'black' }}>{desc}</p>     
                        </Link>
                    </Col>
                    &nbsp;&nbsp;
                    <Col id='black' md>
                    <Link to={{pathname:itemLink, state: {PageName:this.props.PageName}}} style={{ textDecoration: 'none' }}>
                            <div id='boldDetails' style={{ color: 'black' }}>{date_time}</div>
                            <img class="hoverable" id='gridItemImgSize' src={flower}></img>
                            <p style={{ color: 'black' }}>{desc}</p>     
                        </Link>
                    </Col>
                    &nbsp;&nbsp;
                    <Col id='black' md>
                    <Link to={{pathname:itemLink, state: {PageName:this.props.PageName}}} style={{ textDecoration: 'none' }}>
                            <div id='boldDetails' style={{ color: 'black' }}>{date_time}</div>
                            <img class="hoverable" id='gridItemImgSize' src={flower}></img>
                            <p style={{ color: 'black' }}>{desc}</p>     
                        </Link>
                    </Col>
                    &nbsp;&nbsp;
                    <Col id='black' md>
                    <Link to={{pathname:itemLink, state: {PageName:this.props.PageName}}} style={{ textDecoration: 'none' }}>
                            <div id='boldDetails' style={{ color: 'black' }}>{date_time}</div>
                            <img class="hoverable" id='gridItemImgSize' src={flower}></img>
                            <p style={{ color: 'black' }}>{desc}</p>     
                        </Link>
                    </Col>
                    
                </Row>
                &nbsp;&nbsp;
            </Container>
        
        );
    }
}

export default GridComponent;