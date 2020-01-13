import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ToastContainer} from 'react-toastify';
import $ from 'jquery';

import { clearErrors } from '../../actions/errorActions';
//import { getAllCustomers, createCustomer, getCustomer } from '../../actions/woActions';
import { saveCustomer, getAllCustomers, getCustomer } from '../../actions/customerActions';


import CustomerDetails from './CustomerDetails';

class CustomerList extends Component {

  constructor(props){
    super(props);
    this.state = {
      currentCustomer:0
    }
  }
 
  componentDidMount(){
    // this.props.clearErrors();
    this.props.getAllCustomers();
  }

  toLoginPage = () => {
    const { history } = this.props;
    if(history) history.push('/login');
  }


  //----------- CREATE NEW WORK ORDER -----------------------------------//
  createCustomer = () => {

    let customerCode = prompt("Please enter 3 letter customer code (eg: ABY)", "");

    if(!customerCode) return;

    if(customerCode.length != 3 ){
      alert('Customer Code must be of 3 letters' );
      return;
    }

    const newWO = {
      user_id: this.props.user.id,
      //wonumber: this.props.user.name.toUpperCase() + this.getDateFormat()
      wonumber: customerCode.toUpperCase() + this.getDateFormat()
    }


    this.props.createCustomer(newWO);
    const { history } = this.props;
    if(history) history.push('/customer');
  }

  getDateFormat = () =>{
    var dateObj = new Date();
    var month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
    var date = ('0' + dateObj.getDate()).slice(-2);
    var year = dateObj.getFullYear().toString().substr(2,2);
    var shortDate = date + '' + month + '' + year;
    return shortDate;
  }
//-----------------------------------------------------------------------//

getCustomer = (id) => {
  if(id != 0 )  this.props.getCustomer(id);
  this.setState({currentCustomer:id})
  $('#btnCustomer').click();
}

  render() {

    if(!this.props.isAuthenticated) this.toLoginPage();
    return(
      <div className="content-wrapper"  style={{margin:"2px", maxWidth:"100%"}}>
         <ToastContainer />
        <CustomerDetails currentCustomer={this.state.currentCustomer} customer={this.props.customer} saveCustomer={this.props.saveCustomer} />
      <div className="card">
        <div className="card-body">
          <table style={{width:"100%", color:"#439aff"}}>
            <tbody>
            <tr>
              <td><h4 className="card-title">CUSTOMERS</h4></td>
              <td style={{textAlign:"right"}}>
              <button type="button" onClick={() => {this.getCustomer(0)}}  className="btn btn-success btn-sm" >Create New Customer</button>
                <button type="button" id="btnCustomer" style={{visibility:"hidden"}}  data-toggle="modal" data-target="#customerModal"></button>
              </td>
            </tr>
            </tbody>
          </table>
          
          <div className="row">
            <div className="col-12" >

            {(!this.props.customerlist || this.props.customerlist.length == 0) ? <h5>No Customers</h5> :
              <table className="table table-striped table-hover wolist" style={{border:"#CCC 1px solid", width:"100%"}}>
                <thead>
                  <tr>
                      <th>Customer Code</th>
                      <th>Contact Person</th>
                      <th>Phone Number</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.customerlist.map(cl => { return(
                    <tr onClick={() => {this.getCustomer(cl._id)}} key={cl._id}>
                      <td>{cl.customercode}</td>
                      <td>{cl.contactperson}</td>
                      <td>{cl.phone}</td>
                    </tr>
                  )})}
                </tbody>
              </table>
            }
            </div>
          </div>
        </div>
      </div>
    </div>
    )
    
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  customerlist: state.customerlist,
  customer: state.customer
});

export default connect(
  mapStateToProps,
  {saveCustomer, getAllCustomers, getCustomer},
  null
)(CustomerList);
