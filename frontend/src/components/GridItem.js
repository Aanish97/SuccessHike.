import React, {Component} from 'react';
import {Row, Container, Col} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import axios from 'axios'

class GridItem extends Component {

    constructor(props) 
    {
      super(props);
      this.state = {
          posts:[], //can be businesses, jobs, events
      }
    }

    componentDidMount()
    {
        var {type_menu} = this.props.type_menu //? this.props.type_name : 'Events';
        console.log('aanih'+type_menu)
        //type_name is actually coming via navigationbar->menu->griditem

        /*if type_menu does not have anything, it means you are directly 
        accessing this page, to avoid this uncomment the following condition
       
        if (type_menu == undefined)
        {
            type_menu = 'Events'
        }*/
        
        if (type_menu == 'Events') {
            this.get_posts_from_DB('getevents/')
        }
        else if(type_menu == 'Small Businesses') {
            this.get_posts_from_DB('getbusinesses/')
        }
        else {
            this.get_posts_from_DB(type_menu, 'getjobs/')
        }
    }

    items(count)
    {
        return(
            count < this.state.posts.length ?

            <Col id='black'>
                
                    <div id='boldDetails' style={{color: 'black' }}>{(this.state.posts[count].event_date.substring(0,10)).replace(/(\r\n|-|\r)/gm,"/")}</div>
                    <img class="hoverable" id='gridItemImgSize' src={'../../static/frontend/static/flowers.jpeg'}></img>
                    <p style={{ color: 'black' }}>{this.state.posts[count].event_name}</p>
                
            </Col>
            :
            <div/>
        )
    }

    get_posts_from_DB(ajax_call)
    {
        axios.post(ajax_call, this.state) //retrieve data for jobs
            .then(response => {
                this.setState({
                    posts: response.data
                });
                
            })
    }

    render() {
        var count = -1;
        
        return(

            <Container id='gridItemsFont'>
                {
                    [0,0,0,0,0,0,0,0].map((x)=>{
                        return(
                            <Row class='h-100 d-inline-block'>
                                {
                                    [0,0,0,0].map((x)=>{
                                        count+=1
                                        return(
                                            <div>
                                                {this.items(count)}
                                            </div>
                                        )                                        
                                    })
                                }
                            </Row>
                        )
                    })
                }
            </Container>
        );
    }
}

export default GridItem;