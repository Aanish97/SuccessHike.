import React, {Component} from 'react';

import Navbar from './NavigationBar';
import FooterComponent from './Footer';
import {Row, Col, Button, Badge, Form, Container} from 'react-bootstrap';
import * as axios from 'axios'
import Cookies from 'js-cookie'

class SmallBusinessesDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username:'',
      full_name:'',

      business_id : 0,
      nameOfBusiness : '',
      descriptionOfBusiness : '',
      locationOfBusiness : '',
      URLOfBusiness : '',
      businessContact : '',
      business_of : '',
      business_type : '',

      stats: [],
      like: false,
      comment: false,
      comment_text:'',
      no_cookie:false,
      total_like:0,
      total_comment:0,
    }
}

  componentDidMount()
  {
      var token = Cookies.get('token')
      
      if(token) { //user is logged in
          console.log('user is logged in')
          this.state.token = token    //setting token in state
          this.checkCookie(token)     //cross checking token with key in backend database
      }
      else {  //meaning there user is not login so display non login page of small businesses details 
        console.log('user is not logged in')
        var no_like_comment = document.getElementsByClassName('no_like_comment')[0];
        no_like_comment.style.setProperty("display", "block");
        
        this.setState({
          no_cookie:true
        })
      }

      this.get_all_stats()
      
      
  }

  get_all_stats()
  {
    axios.post("businessstats/",this.state)
      .then(response => {
          
          if(response.data == false) {
              console.log('no data retrieved')
          }
          else {
            console.log(response.data)
            this.setState({ stats:response.data }, () => {
              var x=0
              var y=0
              for (var i = 0; i < this.state.stats.length; i++) 
              {
                if(this.state.stats[i].like==true)
                {
                  x+=1//this.state.total_like+=1
                }
                if(this.state.stats[i].comment==true)
                {
                  y+=1//this.state.total_comment+=1
                }    
                //comparing username in records with username of logged in person
                  if(this.state.stats[i].username==this.state.username)
                  {
                    this.setState({
                      like:this.state.stats[i].like,
                      comment:this.state.stats[i].comment,
                      comment_text:this.state.stats[i].comment_text
                    }, () =>{})
                  }
              }
              this.setState({total_like:x, total_comment:y,})
          }, ()=>{}); 
          }
      })
  }

  checkCookie()
  {
      axios.post("cookies/",this.state)
      .then(response => {
          console.log(response.data.token)
          if(response.data.username == null) {
              return
          }
          else {
            this.setState({ 
              username : response.data.username,
              full_name : response.data.full_name }, () => {
                console.log(response.data)
            })
          }
      })
  }

  leave_like() {
    if(this.state.like==true){
      console.log('Already liked')
    }
    else if(this.state.no_cookie==true)
    {
      console.log('Not logged in')
    }
    else {
      console.log('Adding like')
      this.setState({like:true, total_like:this.state.total_like+1}, () => {
        axios.post("businessstats/",this.state)
        .then(response => {
            console.log(response.data)  //this should return true
            this.state.like = true
        })
      }) 
    }  
  }

  leave_comment() {
    if(this.state.comment==true){
      console.log('Already commented')
    }
    else if(this.state.no_cookie==true)
    {
      console.log('Not logged in')
    }
    else {
      console.log('Adding comment')
      this.setState({comment:true, total_comment:this.state.total_comment+1}, () => {
        axios.post("businessstats/",this.state)
        .then(response => {
            console.log(response.data)  //this should return true
            this.state.comment = true
        })
    })
    }
  }

  changehandler=(e)=>{    //this is the onchange listener of the form, gets the id and value from the Formcontrol and updates the state constantly
    this.setState({[e.target.id]:e.target.value})
  }
  
  render() {
    const {businesses} = this.props.location.state;
    //business_name, business_contact, business_description, business_location, business_of, business_url
    
    this.state.business_id = businesses.id
    this.state.nameOfBusiness = businesses.business_name
    this.state.descriptionOfBusiness = businesses.business_description
    this.state.locationOfBusiness = businesses.business_location
    this.state.URLOfBusiness = businesses.business_location
    this.state.businessContact = businesses.business_contact
    this.state.business_of = businesses.business_of
    this.state.business_type = businesses.business_type

    let start = businesses.image.indexOf('/static/frontend/media/businesses/')
    let end = businesses.image.length
    let url_business = '../..'+businesses.image.slice(start, end)
    
      return (
          <div>
            <Navbar/>

            <Container id='rowSpace'>
              <Row>
                <Col>
                <div style={{marginBottom:'30px'}}/>
                <img style={{height:'75%', width:'440px'}} src={url_business}></img>

                </Col>
                <Col id='normalDetails'>
                  <p>
                    <div className='no_like_comment' style={{display:'none'}}>Login to Like & comment<br/></div>
                    <Button disabled={this.state.no_cookie} onClick={this.leave_like.bind(this)} variant="primary">
                      Likes <Badge variant="light">{this.state.total_like}</Badge>
                      <span className="sr-only">unread messages</span>
                    </Button>
                    &nbsp;
                    <Button variant="danger" disabled>
                      Comments <Badge variant="light">{this.state.total_comment}</Badge>
                      <span className="sr-only">unread messages</span>
                    </Button>
                  </p>
                  <p><h1>{this.state.nameOfBusiness}</h1></p>
                  <p><strong>Contact: </strong>{this.state.businessContact}</p>
                  <p><strong>Category: </strong>{this.state.business_type}</p>
                  <p><strong>Details: </strong>{this.state.descriptionOfBusiness}</p>
                  <p><strong>Location: </strong>{this.state.locationOfBusiness}</p>
                  <p><strong>website link: </strong>{this.state.URLOfBusiness}</p>
                  <p style={{textAlign:'right'}}>Posted by {this.state.business_of}</p>

                  <p>
                    <Form>
                      <Form.Group controlId="exampleForm.ControlTextarea1">
                      <strong>Leave a comment</strong>
                        <Form.Control placeholder='Comment' as="textarea" rows="3" onChange={this.changehandler} id='comment_text' value={this.state.comment_text}/>  
                        
                        <Form.Label style={{margin:'1% 1% 0% 1%'}}>
                          <Button disabled={this.state.no_cookie} onClick={this.leave_comment.bind(this)} id = 'white' variant="danger" size='sm' >Comment</Button>
                        </Form.Label>
                      </Form.Group>
                      
                    </Form>
                  </p>
                  
                  <div  id='givemarginoftop'/>
                  {
                      this.state.stats.map((data)=>{
                          return(
                            data.comment==true?
                            <p><strong>{data.full_name} : </strong>{data.comment_text}</p>
                            :
                            <div/>
                          )                   
                      })
                  }
                  
                </Col>
              </Row>
            </Container>
            <FooterComponent/>

          </div>
        );
    
    }
}

export default SmallBusinessesDetails;