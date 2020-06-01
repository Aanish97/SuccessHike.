import React, {Component} from 'react';
import {CardElement, injectStripe, Elements, StripeProvider} from 'react-stripe-elements'
import Navbar from './NavigationBar';
import { Link, withRouter } from "react-router-dom";
import {Toast, Container, Col, Button} from 'react-bootstrap'
import Cookies from 'js-cookie'
import axios from 'axios'

class PaymentGateway extends Component{
  
    constructor(props) {
        super(props);
        this.state = {
            username:'',
            loading: false,
            error: null,
            success: false,

            event_id:-1,
            event_name:'',
            event_price:0,
        }        
    }

    componentDidMount() {

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

        const {event} = this.props.location.state;
        this.setState({
            event_id: event.id,
            event_name: event.event_name,
            event_price: event.event_price,
        })    
    }

    submit = (ev) => {
        ev.preventDefault()
        this.setState({loading: true})

        if(this.props.stripe) {
            this.props.stripe.createToken().then(result => {
                if(result.error) {
                    this.setState({error: result.error.message, loading: false});
                } else {
                    axios.post("pay/", 
                    {   stripe_token: result.token.id, 
                        event_name:this.state.event_name, 
                        username:this.state.username, 
                        event_price:this.state.event_price, 
                        event_id: this.state.event_id
                    })
                    .then(response => {
                        this.setState({
                            loading: false,
                            success: true
                        });
                    }).catch(err => {
                        this.setState({
                            loading: false,
                            error: err
                        });
                    })    
                }
            })
        } else {
            console.log('Stripe is not loaded')
        }
        
    }

    render() {
        
        const {error, loading, success} = this.state
        return (
            <div>
                {
                    error && (
                        <div style={{backgroundColor:'#d63447', color:'white'}}>
                            <div>Your payment was unsuccessful!</div>
                            &nbsp;
                            <p>{JSON.stringify(error)}</p>
                        </div>
                    )
                }
                {
                    success && (
                    <div style={{backgroundColor:'#21bf73', color:'white'}}>
                        Your payment was successful! Check email, return to Profile
                    </div>                    
                    )
                }
                <Col style={{backgroundColor:'#D3D3D3', borderRadius:'25px 25px 25px 25px'}} md={{ span: 4, offset: 4 }}>
                    &nbsp;
                    <p>Would you like to complete the purchase?</p>
                    <div style={{marginBottom:'30px'}}/>
                    
                    <p style={{textAlign:'left'}}><strong>Event name: </strong>{this.state.event_name}</p>
                    <p style={{textAlign:'left'}}><strong>Event Price: </strong>{this.state.event_price}</p>
                    <div style={{marginBottom:'30px'}}/>
                    
                    <CardElement/>
                    <div style={{marginBottom:'30px'}}/>
                    
                    <Button loading={loading} disabled={loading} variant='success' onClick={this.submit}>Pay</Button>
                    <div style={{marginBottom:'7px'}}/>
                    &nbsp;
                </Col>
            </div>
        );
    }
}

const InjectedForm = withRouter(injectStripe(PaymentGateway));

const WrappedForm = () => (
    <div>
        <Navbar/>
        <Container  style={{fontFamily:'Poppins', textAlign:'center'}}>
        <StripeProvider apiKey='pk_test_DhFwvFhSephI3RSKvH1NPqlc003ZFYT3do'>
            <div>
                &nbsp;
                <h3 style={{marginBottom:'60px'}}>Complete your Order</h3>
                <Elements>
                    <InjectedForm/>
                </Elements>
            </div>    
        </StripeProvider>
        </Container>
    </div>
);

export default WrappedForm;