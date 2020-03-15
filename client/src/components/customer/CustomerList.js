import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ToastContainer} from 'react-toastify';
import $ from 'jquery';

import { clearErrors } from '../../actions/errorActions';
import { saveCustomer, getAllCustomers, setCustomer} from './customerActions';
import { getAllWorkOrders } from '../workorder/woActions';

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
    //this.props.getAllCustomers();
  }

  toLoginPage = () => {
    const { history } = this.props;
    if(history) history.push('/login');
  }

//-----------------------------------------------------------------------//

editCustomer = (customer) => {
    //this.props.getCustomer(id);
    if(customer == 0){
      this.setState({currentCustomer:0})
      this.props.setCustomer({});
    } else {
      this.setState({currentCustomer:customer._id})
      this.props.setCustomer(customer);
    }

    $('#btnCustomer').click();
}

showWorkOrders = (customer) => {
  this.props.setCustomer(customer);
  const { history } = this.props;
  if(history) history.push('/wolist');
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
              <button type="button" onClick={() => {this.editCustomer(0)}}  className="btn btn-success btn-sm" >Create New Customer</button>
                <button type="button" id="btnCustomer" style={{visibility:"hidden"}}  data-toggle="modal" data-target="#customerModal"></button>
              </td>
            </tr>
            </tbody>
          </table>
          
          <div className="row">
            <div className="col-12" >

            {(!this.props.customerlist || this.props.customerlist.length == 0) ? <h5>No Customers</h5> :
              <table className="table table-striped wolist" style={{border:"#CCC 1px solid", width:"100%"}}>
                <thead>
                  <tr>
                      <th>Customer Code</th>
                      <th>Contact Person</th>
                      <th>Phone Number</th>
                      <th></th>

                  </tr>
                </thead>
                <tbody>
                  {this.props.customerlist.map(cl => { return(
                    <tr key={cl._id}>
                      <td onClick={() => {this.showWorkOrders(cl)}}  >{cl.customercode}</td>
                      <td onClick={() => {this.showWorkOrders(cl)}}>{cl.contactperson}</td>
                      <td onClick={() => {this.showWorkOrders(cl)}}>{cl.phone}</td>
                      <td onClick={() => {this.editCustomer(cl)}}><i className="icon-doc" ></i></td>
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
  {saveCustomer, getAllCustomers, getAllWorkOrders, setCustomer},
  null
)(CustomerList);
