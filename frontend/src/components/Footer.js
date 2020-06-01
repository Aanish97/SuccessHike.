import React, {Component} from 'react';

import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";

class Footer extends Component{
  
    render() {
        return (
          
            <MDBFooter fixed='bottom' id='footer' className="font-small pt-4 mt-4">
            
            <MDBContainer fluid className="text-center text-md-left">
              <MDBRow>
              <MDBCol></MDBCol>
                <MDBCol><a style={{color:'white', textDecoration: 'none' }} href=""> About </a></MDBCol>
                <MDBCol><a style={{color:'white', textDecoration: 'none' }} href=""> Join </a></MDBCol>
                <MDBCol><a style={{color:'white', textDecoration: 'none' }} href=""> Videos </a></MDBCol>
                <MDBCol><a style={{color:'white', textDecoration: 'none' }} href=""> Blog </a></MDBCol>
                <MDBCol><a style={{color:'white', textDecoration: 'none' }} href=""> FAQ </a></MDBCol>
                <MDBCol><a style={{color:'white', textDecoration: 'none' }} href=""> Contact </a></MDBCol>
                <MDBCol><a style={{color:'white', textDecoration: 'none' }} href=""> Suggestions </a></MDBCol>
                <MDBCol></MDBCol>
                </MDBRow>
            </MDBContainer>
            <div className="footer-copyright text-center py-3">
              <MDBContainer fluid>
                &copy; {new Date().getFullYear()} Cookies Terms: <a style={{ textDecoration: 'none' }} href="https://www.mdbootstrap.com"> SuccessHike.com </a>
              </MDBContainer>
            </div>
          </MDBFooter>
        );
    }
}
export default Footer;