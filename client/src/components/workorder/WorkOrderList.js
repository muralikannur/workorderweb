import React, { Component} from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import { ToastContainer} from 'react-toastify';
import * as qs from 'query-string';
import { NavLink, Link } from "react-router-dom";

import WorkOrderDetails from './WorkOrderDetails';

import { clearErrors } from '../../actions/errorActions';
import { getAllWorkOrders, createWorkOrder, getWorkOrder, clearWorkOrder, updateWorkOrderList, updateStatus } from './woActions';
import { getMaterial, clearMaterial } from '../materials/materialActions';

import { setEditMode } from '../../actions/configActions';

import { WO_STATUS } from './../../constants';

class WorkOrderList extends Component {

  constructor(props){
    super(props);
    this.state = {
      client:'',
      billing_address1:'',
      billing_address2:'',
      billing_pin:'',
      billing_phone:'',
      billing_gst:'',
      shipping_address1:'',
      shipping_address2:'',
      shipping_pin:'',
      shipping_phone:'',
      shipping_gst:'',
      customercode:'',
      customer_id:'',
      materialWoId:0
    }
  }
 
  toLoginPage = () => {
    const { history } = this.props;
    if(history) history.push('/login');
  }

  deleteWorkOrder = (wonumber, id) =>{
    if(window.confirm('Do you want to Delete the Work Order ' + wonumber + '?')){
      this.props.updateStatus(id, wonumber, this.props.user.id, 'DELETED');
    }
  }

  removeWorkOrder = (wonumber, id) =>{
    if(window.confirm('Do you want to Permenently Delete the Work Order ' + wonumber + '?')){
      this.props.updateStatus(id, wonumber, this.props.user.id, 'REMOVED');
    }
  }

  restoreWorkOrder = (wonumber, id) =>{
    if(window.confirm('Do you want to Restore the Work Order ' + wonumber + '?')){
      this.props.updateStatus(id, wonumber, this.props.user.id, 'NEW');
    }
  }  

//-----------------------------------------------------------------------//

getWorkOrder = (id, status) => {
  this.props.getWorkOrder(id);
  this.props.getMaterial(id);

  this.props.setEditMode(status != WO_STATUS.DELETED);
  const { history } = this.props;
  if(history) history.push('/workorder');
}

  render() {

    if(!this.props.isAuthenticated) this.toLoginPage();

    let wolist = this.props.wolist;
    
    if(wolist && wolist.length != 0){
      if(this.props.customer && this.props.customer._id){
        wolist = wolist.filter(w => w.customer_id == this.props.customer._id && w.status != 'REMOVED')
      }
    }


    return(
      <div className="content-wrapper"  style={{margin:"2px", maxWidth:"100%"}}>
 <ToastContainer />
 <WorkOrderDetails user={this.props.user} customer ={this.props.customer} customerlist = {this.props.customerlist} wolist = {this.props.wolist} createWorkOrder={this.props.createWorkOrder}/>







      <div className="card">
        <div className="card-body">
          <table style={{width:"100%", color:"#439aff"}}>
            <tbody>
            <tr>
              <td  style={{width:"50%"}}><h4 id="woTitle" style={{color:"green"}} className="card-title">WORK ORDERS</h4> </td>
              <td>
                <nav>
                <NavLink to="/customerlist" className="nav-link"><i className="link-icon icon-people"></i> &nbsp; <span className="menu-title">Customers</span></NavLink>
                </nav>  
              </td>
              <td style={{textAlign:"right"}}>
                <button type="button"  data-toggle="modal" data-target="#newWoModal"  className="btn btn-success btn-fw"><i  className="icon-notebook"></i>Create New Work Order</button></td>
            </tr>
            </tbody>
          </table>
          
          <div className="row">
            <div className="col-12" >

            {(!wolist || wolist.length == 0) ? <h5>No Work Orders</h5> :
              <div>
              <table className="table table-striped table-hover wolist" style={{border:"#CCC 1px solid", width:"100%"}}>
                <thead>
                  <tr>
                      <th style={{width:"200px"}}>Order #</th>
                      <th style={{width:"200px"}}>Created On</th>
                      <th style={{width:"200px"}}>Client Name</th>
                      <th style={{width:"200px"}}>Status</th>
                      <th style={{width:"200px"}}>DELETE</th>
                  </tr>
                </thead>
                <tbody>
                  {wolist.filter(w => w.status != WO_STATUS.DELETED).map(wl => { return(
                    <tr key={wl._id}>
                      <td><a href="#"  onClick={() => {this.getWorkOrder(wl._id, wl.status)}} >{wl.wonumber}</a></td>
                      <td>{wl.date}</td>
                      <td>{wl.client}</td>
                      <td>{wl.status}</td>
                      <td><a href="#" onClick={() => {this.deleteWorkOrder(wl.wonumber,wl._id)}}>DELETE</a></td>                      
                    </tr>
                  )})}
                </tbody>
                </table>

                {wolist.filter(w => w.status == WO_STATUS.DELETED).length == 0 ? null :
                <div style={{marginTop:"30px"}}>
                  <h6 style={{color:"red"}}>DELETED WORK ORDERS</h6>

                  <table className="table table-striped table-hover wolist" style={{border:"#CCC 1px solid", width:"100%"}}>
                  <thead>
                    <tr>
                        <th style={{width:"200px"}}>Order #</th>
                        <th style={{width:"200px"}}>Created On</th>
                        <th style={{width:"200px"}}>Client Name</th>
                        <th style={{width:"200px"}}>Status</th>
                        <th style={{width:"100px"}}>RESTORE</th>
                        <th style={{width:"100px"}}>DELETE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wolist.filter(w => w.status == WO_STATUS.DELETED).map(wl => { return(
                      <tr key={wl._id}>
                        <td><a href="#"  onClick={() => {this.getWorkOrder(wl._id, wl.status)}} >{wl.wonumber}</a> </td>
                        <td>{wl.date}</td>
                        <td>{wl.client}</td>
                        <td>{wl.status}</td>
                        <td><a href="#" onClick={() => {this.restoreWorkOrder(wl.wonumber,wl._id)}}>RESTORE</a></td>  
                        <td><a href="#" onClick={() => {this.removeWorkOrder(wl.wonumber,wl._id)}}>DELETE</a></td>  
                      </tr>
                    )})}
                  </tbody>
                  </table>
                  </div>

                  }
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
  wolist: state.wolist,
  customerlist: state.customerlist,
  customer: state.customer

});

export default connect(
  mapStateToProps,
  {clearErrors,getAllWorkOrders, createWorkOrder, getWorkOrder, getMaterial, clearMaterial, clearWorkOrder, updateWorkOrderList,updateStatus,setEditMode}
)(WorkOrderList);
