import React, { PureComponent } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from 'react-redux';

import store from './store';
import Header from './components/common/Header'
import Footer from './components/common/Footer'

import WorkOrderMain from './components/workorder/WorkOrderMain'
import WorkOrderList from './components/workorder/WorkOrderList'
import CustomerList from './components/customer/CustomerList'

import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Activation from './components/auth/Activation'
import Settings from './components/settings/Settings';
import Verification from './components/auth/Verification';
import ResetPassword from './components/auth/ResetPassword';
import ForgotPassword from './components/auth/ForgotPassword';

class App extends PureComponent {

  

  render() {
    const reload = () => window.location.reload();
    return (
      <Provider store={store}>
        <BrowserRouter>
           
          <div className="container-scroller">
            <Header />
            <div className="container-fluid page-body-wrapper">
              <div className="main-panel">
                <Route exact path="/" component={CustomerList}></Route>
                <Route path="/workorder" component={WorkOrderMain}></Route>
                <Route path="/wolist" component={WorkOrderList}></Route>
                <Route path="/customerlist" component={CustomerList}></Route>                
                <Route path="/settings" component={Settings}></Route>
              </div>
            </div>
          </div>
          <Route path="/login" component={Login}></Route>
          <Route path="/register" component={Register}></Route>    
          <Route path="/activation" component={Activation}></Route>  
          <Route path="/verification" component={Verification}></Route>    
          <Route path="/resetpassword" component={ResetPassword}></Route>        
          <Route path="/forgotpassword" component={ForgotPassword}></Route>
          <Route path="/opt" onEnter={reload} />        

          <Footer />
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
