import React, { Component} from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import { ToastContainer} from 'react-toastify';

import { clearErrors } from '../../actions/errorActions';
import { getAllWorkOrders, createWorkOrder, getWorkOrder } from '../../actions/woActions';
import { getMaterial } from '../../actions/materialActions';
import { getAllCustomers } from '../../actions/customerActions';
import { notify_error } from '../../util';

class WorkOrderList extends Component {

  constructor(props){
    super(props);
    this.state = {
      billing_address:'',
      shipping_address:'',
      customercode:'',
      materialWoId:0
    }
  }
 
  componentDidMount(){
    this.props.clearErrors();
    this.props.getAllWorkOrders();
    this.props.getAllCustomers();
  }

  onChange = (e) => {
    const { value, name } = e.target;
    this.setState({[name]:value});
  }

  onCodeChange = (e) => {
    
    let code = e.target.value;
    let customer = this.props.customerlist.find(c => c.customercode == code);
    if(customer){
      this.setState({billing_address:customer.billing_address});
      this.setState({shipping_address:customer.shipping_address});
      this.setState({customercode:code});
    }

  }

  toLoginPage = () => {
    const { history } = this.props;
    if(history) history.push('/login');
  }


  //----------- CREATE NEW WORK ORDER -----------------------------------//
  saveWorkOrder = (e) => {

    e.preventDefault();

    const customerCode = this.state.customercode;
    const materialWoId = this.state.materialWoId;

    if(customerCode == "" || customerCode == 0 ){
      notify_error('Please select a customer');
      return;
    }


    const newWO = {
      user_id: this.props.user.id,
      wonumber: customerCode.toUpperCase() + ' ' + this.getDateFormat() + '-',
      materialWoId,
      billing_address:this.state.billing_address,
      shipping_address:this.state.shipping_address
    }


    this.props.createWorkOrder(newWO);

    $('#btnCreateWorkOrderClose').click();


    const { history } = this.props;
    if(history) history.push('/workorder');
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

getWorkOrder = (id) => {
  this.props.getWorkOrder(id);
  this.props.getMaterial(id);
  const { history } = this.props;
  if(history) history.push('/workorder');
}

  render() {

    if(!this.props.isAuthenticated) this.toLoginPage();
    return(
      <div className="content-wrapper"  style={{margin:"2px", maxWidth:"100%"}}>
 <ToastContainer />
        <div className="modal fade" id="newWoModal" tabIndex="-1" role="dialog" aria-labelledby="newWoModalLabel"  data-backdrop="static" data-keyboard="false">
          <div className="modal-dialog modal-lg mt-0" >
            <div className="modal-content" style={{marginTop:"10px"}}>
              <div className="modal-header" style={{paddingTop:"2px",paddingBottom:"0px"}}>
                <h5 className="modal-title">Create New Work Order</h5>
                  <button id="btnCreateWorkOrderClose" type="button" className="btn btn-light" data-dismiss="modal"> Back to Work Order List <i className="icon-login"></i> </button>
              </div>
              <div className="modal-body" style={{paddingBottom:"0px"}}>

              <form className="forms-sample" style={{width:"90%",margin:"0 auto"}} >
                  <div className="form-group row">
                  <label htmlFor="customercode" className="col-sm-3 col-form-label">Select the Customer</label>
                  <div className="col-sm-9">
                    <select id="customercode" className="js-example-basic-single input-xs" style={{width:"200px"}} onChange={ (e) => this.onCodeChange(e)} >
                      <option id="0">Select Customer...</option>
                      {this.props.customerlist.map(cl => { return(
                        <option value={cl.customercode} key={cl.customercode}>{cl.customercode}</option>
                      )})}
                    </select>
                  </div>
                  </div>



                  <div className="form-group row">
                  <label htmlFor="billing_address" className="col-sm-3 col-form-label">Billing Address</label>
                  <div className="col-sm-9">
                      <input type="text" onChange={ (e) => this.onChange(e)} value={this.state.billing_address}  className="form-control" id="billing_address" name="billing_address" placeholder="Billing Address"/>
                  </div>
                  </div>
                  <div className="form-group row">
                  <label htmlFor="shipping_address" className="col-sm-3 col-form-label">Shipping Address</label>
                  <div className="col-sm-9">
                      <input type="text" onChange={ (e) => this.onChange(e)} value={this.state.shipping_address}  className="form-control" id="shipping_address" name="shipping_address" placeholder="Billing Address"/>
                  </div>
                  </div>        

                  <div className="form-group row">
                  <label className="col-sm-3 col-form-label">Copy Material Definition from</label>
                  <div className="col-sm-6">

                  <select id="materialWoId" name="materialWoId" className="js-example-basic-single input-xs" style={{width:"500px"}} onChange={ (e) => this.onChange(e)} >
                      <option id="0">Select WorkOrder</option>
                      {this.props.wolist.map(wl => { return(
                        <option value={wl._id} key={wl._id}>{wl.wonumber}</option>
                      )})}
                    </select>
                      
                  </div>
                  
                  </div>            

                  <button style={{float:"right", padding:"10px"}}  onClick={ (e) => this.saveWorkOrder(e)} className="btn btn-primary submit-btn">Create</button>
              </form>
                  <br /><br />
              </div>
            </div>
          </div>
        </div>







      <div className="card">
        <div className="card-body">
          <table style={{width:"100%", color:"#439aff"}}>
            <tbody>
            <tr>
              <td><h4 className="card-title">WORK ORDERS</h4></td>
              
              <td style={{textAlign:"right"}}><button type="button"  data-toggle="modal" data-target="#newWoModal"  className="btn btn-success btn-fw"><i  className="icon-notebook"></i>Create New Work Order</button></td>
            </tr>
            </tbody>
          </table>
          
          <div className="row">
            <div className="col-12" >

            {(!this.props.wolist || this.props.wolist.length == 0) ? <h5>No Work Orders</h5> :
              <table className="table table-striped table-hover wolist" style={{border:"#CCC 1px solid", width:"100%"}}>
                <thead>
                  <tr>
                      <th>Order #</th>
                      <th>Created On</th>
                      <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.wolist.map(wl => { return(
                    <tr onClick={() => {this.getWorkOrder(wl._id)}} key={wl._id}>
                      <td>{wl.wonumber}</td>
                      <td>{wl.date}</td>
                      <td>{wl.status}</td>
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
  wolist: state.wolist,
  customerlist: state.customerlist

});

export default connect(
  mapStateToProps,
  {clearErrors,getAllWorkOrders, createWorkOrder, getWorkOrder, getMaterial, getAllCustomers}
)(WorkOrderList);
