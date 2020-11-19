import React, { PureComponent} from 'react';
import { connect } from 'react-redux';
import { ToastContainer} from 'react-toastify';
import $ from 'jquery';

import { clearErrors } from '../../actions/errorActions';
import { saveCustomer, getAllCustomers, setCustomer, getCustomerCode, updateCustomerStatus} from './customerActions';
import { getAllWorkOrders, clearWorkOrder } from '../workorder/woActions';
import { clearMaterial } from '../materials/materialActions';
import CustomerDetails from './CustomerDetails';

class CustomerList extends PureComponent {

  constructor(props){
    super(props);
    this.state = {
      currentCustomer:0
    }
  }
 
  componentDidMount(){
    this.props.clearMaterial();
    this.props.clearWorkOrder();
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

deleteCustomer = (code, id) =>{
  if(window.confirm('Do you want to Delete the Customer ' + code + '?')){
    this.props.updateCustomerStatus(id, code, 'Deleted');
  }
}

removeCustomer = (code, id) =>{
  if(window.confirm('Do you want to Permenently Delete the Customer ' + code + '?')){
    this.props.updateCustomerStatus(id, code, 'Removed');
  }
}

restoreCustomer = (code, id) =>{
  if(window.confirm('Do you want to Restore the Customer ' + code + '?')){
    this.props.updateCustomerStatus(id, code, 'Active');
  }
}  


  render() {

    if(!this.props.isAuthenticated) this.toLoginPage();
    return(
      <div className="content-wrapper"  style={{margin:"2px", maxWidth:"100%"}}>
         <ToastContainer />
        <CustomerDetails currentCustomer={this.state.currentCustomer} customer={this.props.customer} saveCustomer={this.props.saveCustomer} getCustomerCode={this.props.getCustomerCode} />
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
            <div>
              <table className="table table-striped wolist" style={{border:"#CCC 1px solid", width:"100%"}}>
                <thead>
                  <tr>
                      <th style={{width:"10%"}}>Customer Code</th>
                      <th style={{width:"30%"}}>Customer Name</th>
                      <th style={{width:"30%"}}>Phone Number</th>
                      <th style={{width:"15%"}}>EDIT</th>
                      <th style={{width:"15%"}}>DELETE</th>

                  </tr>
                </thead>
                <tbody>
                  {this.props.customerlist.filter(c => c.status == 'Active').map(cl => { return(
                    <tr key={cl._id}>
                      <td onClick={() => {this.showWorkOrders(cl)}}  >{cl.customercode}</td>
                      <td onClick={() => {this.showWorkOrders(cl)}}>{cl.companyname}</td>
                      <td onClick={() => {this.showWorkOrders(cl)}}>{cl.phone}</td>
                      <td><a href="#" onClick={() => {this.editCustomer(cl)}}><i className="icon-doc" ></i> edit</a></td>
                      <td><a href="#" onClick={() => {this.deleteCustomer(cl.customercode, cl._id)}}>DELETE</a></td> 
                    </tr>
                  )})}
                </tbody>
              </table>


              <div style={{marginTop:"30px"}}>
              <h6 style={{color:"red"}}>DELETED CUSTOMERS</h6>
              <table className="table table-striped wolist" style={{border:"#CCC 1px solid", width:"100%"}}>
              <thead>
                <tr>
                    <th style={{width:"10%"}}>Customer Code</th>
                    <th style={{width:"30%"}}>Customer Name</th>
                    <th style={{width:"30%"}}>Phone Number</th>
                    <th style={{width:"15%"}}>RESTORE</th>
                    <th style={{width:"15%",color:"red"}}>REMOVE</th>

                </tr>
              </thead>
              <tbody>
                {this.props.customerlist.filter(c => c.status == 'Deleted').map(cl => { return(
                  <tr key={cl._id}>
                    <td onClick={() => {this.showWorkOrders(cl)}}  >{cl.customercode}</td>
                    <td onClick={() => {this.showWorkOrders(cl)}}>{cl.companyname}</td>
                    <td onClick={() => {this.showWorkOrders(cl)}}>{cl.phone}</td>
                    <td><a href="#" onClick={() => {this.restoreCustomer(cl.customercode, cl._id)}}>RESTORE</a></td>
                    <td style={{color:"red"}}><a href="#" onClick={() => {this.removeCustomer(cl.customercode, cl._id)}}>REMOVE</a></td> 
                  </tr>
                )})}
              </tbody>
              </table>
              </div>
            </div>

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
  {saveCustomer, getAllCustomers, getAllWorkOrders, setCustomer, getCustomerCode, updateCustomerStatus, clearMaterial, clearWorkOrder},
  null
)(CustomerList);
