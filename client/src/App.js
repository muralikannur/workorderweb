import React, { Component } from 'react';
import { BrowserRouter, Route } from "react-router-dom";

import { Provider } from 'react-redux';
import store from './store';
import Header from './components/common/Header'
import Footer from './components/common/Footer'

import ProfileMain from './components/settings/Settings'
import WorkOrderMain from './components/workorder/WorkOrderMain'
import DashBoardMain from './components/dashboard/DashBoardMain'
import WorkOrderList from './components/workorder/WorkOrderList'
import CustomerList from './components/customer/CustomerList'

import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Activation from './components/auth/Activation'
import Settings from './components/settings/Settings';
import Verification from './components/auth/Verification';
import ResetPassword from './components/auth/ResetPassword';
import ForgotPassword from './components/auth/ForgotPassword';

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
        <Route path="/login" component={Login}></Route>
        <Route path="/register" component={Register}></Route>    
        <Route path="/activation" component={Activation}></Route>  
        <Route path="/verification" component={Verification}></Route>    
        <Route path="/resetpassword" component={ResetPassword}></Route>        
        <Route path="/forgotpassword" component={ForgotPassword}></Route>                   
          <div className="container-scroller">
            <Header />
            <div className="container-fluid page-body-wrapper">
              <div className="main-panel">
                <Route exact path="/" component={WorkOrderList}></Route>
                <Route path="/workorder" component={WorkOrderMain}></Route>
                <Route path="/wolist" component={WorkOrderList}></Route>
                <Route path="/customerlist" component={CustomerList}></Route>                
                <Route path="/settings" component={Settings}></Route>
                <Footer />
              </div>
            </div>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
