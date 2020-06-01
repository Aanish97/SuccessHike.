import React, {Component} from 'react'
import {Row, Col, Button, Container, Form, Dropdown, DropdownButton} from 'react-bootstrap'
import Navbar from './NavigationBar'
import Footer from './Footer'
import axios from 'axios'
import Cookies from 'js-cookie'

class PostBusiness extends Component {

    constructor(props) {
        super(props);
        this.state={    //state for storing data 
            edit_mode:false,
            admin:false,
            categories:[],

            username:'',
            business_name:'',
            business_type:'select type',
            business_contact:'',
            business_location:'',
            business_url:'',
            business_description:'',

            selectedFile:null
        };
    }

    componentDidMount()
    {
        axios.get("categories/") //get all categories
            .then(response => {
                console.log(response.data)
                this.setState({
                    categories: response.data
                });
            })

        if (this.props.location.state!=undefined)
        {
            const {business, admin} = this.props.location.state;
            /*setState() is usually asynchronous, which means that at the time you
             console.log the state, it's not updated yet. Try putting the log in 
             the callback of the setState() method. It is executed after the state
             change is complete
             
             this.setState({ dealersOverallTotal: total }, () => {
                console.log(this.state.dealersOverallTotal, 'dealersOverallTotal1');
            }); 
             */
            this.setState({ 
                edit_mode:true,

                business_name:business.business_name,
                business_type:business.business_type,
                business_contact:business.business_contact,
                business_location:business.business_location,
                business_url:business.business_url,
                business_description:business.business_description,
                selectedFile:business.image
            })
            if (admin==true)
            {
                this.setState({
                    admin:true,
                    username:business.business_of
                })
                return
            }
        }

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
                    this.state.username = response.data.username
                }
            })
        }
    }

    changehandler=(e)=>{    //this is the onchange listener of the form, gets the id and value from the Formcontrol and updates the state constantly
        this.setState({[e.target.id]:e.target.value})
    }

    go_to_db(form_data)
    {
        //axios.post("postbusiness/",this.state)
        axios({
            method: 'post',
            url: 'postbusiness/',
            data: form_data,
            headers: {
                "content-type": "multipart/form-data"
            }
        }).then(response => {

            console.log(response.data)
            if(response.data[0] == null) {
                if(this.state.edit_mode==true) {
                    alert('Business updated!')
                    if(this.state.admin)
                    {
                        this.props.history.push('/adminDashboard', { some: 'state' })                        
                        return
                    }
                    this.props.history.push('/Profile', { some: 'state' })
                }
                else {
                    alert('This business is already listed')
                }   
            }
            else
            {
                alert('Business Created')
                this.props.history.push('/Profile', { some: 'state' })
            }
        })
    }

    postbusiness() 
    {        
        var itms = [
                    this.state.business_name,
                    this.state.business_type,
                    this.state.business_description,
                    this.state.business_contact,
                    this.state.business_location,
                    this.state.business_url
                    ]
        for (var i = 0; i < itms.length; i++) 
        {
            if(itms[i] == '' || itms[i] == 'select type')
            {
                alert('Required Field left empty')
                return
            }
        }

        let form_data = new FormData()
        if(this.state.selectedFile !=null) 
        {
            form_data.append('business_name', this.state.business_name);
            form_data.append('business_type', this.state.business_type);
            form_data.append('business_description', this.state.business_description);
            form_data.append('business_contact', this.state.business_contact);
            form_data.append('business_location', this.state.business_location);
            form_data.append('business_url', this.state.business_url);
            form_data.append('image', this.state.selectedFile);
            form_data.append('username', this.state.username);
            form_data.append('edit_mode', this.state.edit_mode);
        }
        else
        {
            alert('Required Field left empty')
            return
        }

        this.go_to_db(form_data)
    }
   
    show_navbar_or_not()
    {
        if(this.state.admin)
        {
            return(<div>&nbsp;</div>)
        }
        else
        {
            return(<div><Navbar/></div>)
        }
    }

    handleSelect = (evtKey, evt) => {
        // Get the selectedIndex in the evtKey variable
        this.setState({
            business_type:evtKey
        })
    }

    show_type()
    {
        return(
            <DropdownButton onSelect={this.handleSelect} title={this.state.business_type} id="input-group-dropdown-2" variant='success'>
            {
                this.state.categories.map((data)=>{
                if(data.category_type=='Businesses') {
                    return (
                        <div>
                            <Dropdown.Item eventKey={data.category_name}>{data.category_name}</Dropdown.Item>
                        </div>
                    )}
                })
            }
            </DropdownButton>
        )   
    }

    fileChangeListener = event => {
        //console.log(event.target.files[0])
        
        let url
        URL.revokeObjectURL(url);
        url = URL.createObjectURL(event.target.files[0]);
        
        var img = document.getElementById('business_img')
        img.src = url
        //console.log(url)
        this.setState({
            selectedFile: event.target.files[0]
            })
    }

    render() {
        if(this.state.edit_mode==true) {
            var business_mode = 'Edit Business Details'
            var business_mode_btn = 'Update'

            //image field cannot be updated
            var _img_input = document.getElementById('image_input')
            _img_input.style.setProperty("display", "none");
            
            let start = this.state.selectedFile.indexOf('/static/frontend/media/businesses/')
            let end = this.state.selectedFile.length
            let url_business = '../..'+this.state.selectedFile.slice(start, end)
            
            var img = document.getElementById('business_img')
            img.src = url_business
        }
        else {
            var business_mode = 'Create Business'
            var business_mode_btn = 'Create Business'
        }

        return(
            
            <div>
                {this.show_navbar_or_not()}
            
            &nbsp;
            <Container>
                <Row>
                    <Col>
                        <h1>{business_mode}</h1>
                    </Col>
                    <Col style={{textAlign:'right', marginTop:'1%'}}>
                        <Button onClick={this.postbusiness.bind(this)} variant='danger'>{business_mode_btn}</Button>
                    </Col>
                </Row>
                    &nbsp;
                    
                    <Form style={{fontFamily:'poppins'}}>
                    
                    <Row>
                        <Col>
                        <Form.Group>
                            
                            <Form.Label>
                                <strong>Name of business </strong>
                                <nobr style={{color:'red'}}>*</nobr>
                            </Form.Label>
                            <Form.Control disabled={this.state.edit_mode} as="textarea" rows="1" onChange={this.changehandler} id='business_name' value={this.state.business_name}/>

                        </Form.Group>
                        </Col>
                        <Col>
                        <Form.Group>
                            <Form.Label>
                                <strong>Type of Business</strong>
                                <nobr style={{color:'red'}}>*</nobr>
                            </Form.Label>

                            {this.show_type()}
                        </Form.Group>
                        </Col>
                    </Row> 
                    
                    <Form.Group>
                        <Form.Label>
                            <strong>Business URL </strong>
                            <nobr style={{color:'red'}}>*</nobr>
                        </Form.Label>
                        <Form.Control as="textarea" rows="1" onChange={this.changehandler} id='business_url' value={this.state.business_url}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>
                            <strong>Business Location </strong>
                            <nobr style={{color:'red'}}>*</nobr>
                        </Form.Label>
                        <Form.Control as="textarea" rows="1" onChange={this.changehandler} id='business_location' value={this.state.business_location}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>
                            <strong>Add a description </strong>
                            <nobr style={{color:'red'}}>*</nobr>    
                        </Form.Label>
                        <Form.Control as="textarea" rows="4" onChange={this.changehandler} id='business_description' value={this.state.business_description}/>
                    </Form.Group>

                    <Row>
                        <Col>
                            <Form.Label>
                                <strong>Contact Information for the Business </strong>
                                <nobr style={{color:'red'}}>*</nobr>
                            </Form.Label>
                            <Form.Control as="textarea" rows="1" onChange={this.changehandler} id='business_contact' value={this.state.business_contact}/>
                        </Col> 
                        <Col>
                            <img id='business_img' placeholder='Upload image' style={{height:'180px', width:'220px'}}/>
                            &nbsp;
                            <input id='image_input' type='file' onChange={this.fileChangeListener}/>                             
                        </Col>
                    </Row>

                    </Form>

            </Container>
            <div>
            <Footer/>
            </div>
        </div>
        
        );
    }
}

export default PostBusiness;