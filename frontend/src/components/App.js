import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './Home'
import GridItem from './GridItem'
import Menu from './Menu'
import PaymentGateway from './PaymentGateway'
import Signup from './Signup'
import Login from './Login';
import Profile from './Profile';
import MainMenu from './MainMenu';
import SmallBusinessesDetails from './SmallBusinessesDetails';
import EventsDetails from './EventsDetails';
import PostEvent from './PostEvent';
import PostBusiness from './PostBusiness';
import PostJob from './PostJob';
import OppurtunitiesDetails from './OppurtunitiesDetails';
import adminDashboard from './adminDashboard';
import ChangePassword from './ChangePassword';

class App extends Component {
    render() {
              return (
            <div>
            <Router>
              <Switch>
                <Route path='/' exact component={Home}/>
                <Route path='/Home' exact component={Home}/>

                <Route path='/Login' exact component={Login}/>
                <Route path='/adminDashboard' exact component={adminDashboard}/>
                <Route path='/Menu' exact component={Menu}/>
                <Route path='/Signup' exact component={Signup}/>

                <Route path='/PostBusiness' exact component={PostBusiness}/>
                <Route path='/PostJob' exact component={PostJob}/>
                <Route path='/PostEvent' exact component={PostEvent}/>

                <Route path='/ChangePassword' exact component={ChangePassword}/>
                <Route path='/Profile' exact component={Profile}/>
                <Route path='/MainMenu' exact component={MainMenu}/>
                <Route path='/PaymentGateway' exact component={PaymentGateway}/>
              
                <Route path='/SmallBusinessesDetails' exact component={SmallBusinessesDetails}/>
                <Route path='/EventsDetails' exact component={EventsDetails}/>
                <Route path='/OppurtunitiesDetails' exact component={OppurtunitiesDetails}/>
                
              </Switch>
            </Router>
          </div>
        );
    }
}

export default App;
ReactDOM.render(<App />, document.getElementById('root'));