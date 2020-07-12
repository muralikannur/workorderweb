import React, { PureComponent} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { notify_error,isEmptyOrSpaces } from '../../Utils/commonUtls';

class WorkOrderDetails extends PureComponent {
 
  constructor(props){
    super(props);
    this.state = {
        client:'',
        project:'',
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
        materialWoId:0,
        isCopiedFromWO:false,
        ship_to_billing:true
    }
  }

  componentDidMount(){
    console.log('LIFECYCLE: Workorder List - componentDidMount');
    // this.props.clearErrors();
    // this.props.clearMaterial();
    // this.props.clearWorkOrder();
    let customer = this.props.customer;
    if(customer){
      this.setCustomer(customer);
    }

    this.setAddress();
    
  }

  componentWillReceiveProps(newProps){
    console.log('LIFECYCLE: Workorder List - componentWillReceiveProps');
    if(!this.state.isCopiedFromWO && newProps.edit && newProps.wo  && newProps.wo.client){
      console.log(newProps.wo);
        this.setCustomerFromWO(newProps.wo);
        this.setState({isCopiedFromWO:true})
        this.setAddress();
    } else {
        if(newProps.customer){
            this.setCustomer(newProps.customer);
          }
    }

    
  }

  setAddress = () => {
    window.setTimeout(() => {
      if(this.state.ship_to_billing)  {
        //$("#ship_to_billing").attr("checked","checked");
        this.setShippingAddress();
        $("#divShippingAddress").hide();
      } else {
        //$("#ship_to_billing").attr("checked","");
        $("#divShippingAddress").show();
      };
    },10)
  }

  setCustomerFromWO = (wo) => {
    this.setState({
        client:wo.client,
        project:wo.project,
        billing_address1:wo.billing_address1,
        billing_address2:wo.billing_address2,
        billing_pin:wo.billing_pin,
        billing_phone:wo.billing_phone,
        billing_gst:wo.billing_gst,
        shipping_address1:wo.shipping_address1,
        shipping_address2:wo.shipping_address2,
        shipping_pin:wo.shipping_pin,
        shipping_phone:wo.shipping_phone,
        shipping_gst:wo.shipping_gst,
        customer_id:wo.customer_id,
        ship_to_billing:wo.ship_to_billing
    
    });
    if(wo.ship_to_billing){
      this.setShippingAddress();
    }
  }

  setCustomer = (customer) => {
    this.setState({
      client:customer.companyname,
      billing_address1:customer.address1,
      billing_address2:customer.address2,
      billing_pin:customer.pin,
      billing_phone:customer.phone,
      billing_gst:customer.gst,
      customercode:customer.customercode,
      customer_id:customer._id,
    
    });
  }

  setShippingAddress = () =>{
    this.setState({
      shipping_address1:this.state.billing_address1,
      shipping_address2:this.state.billing_address2,
      shipping_pin:this.state.billing_pin,
      shipping_phone:this.state.billing_phone,
      shipping_gst:this.state.billing_gst,
    });
  }

  toggleShippingAddress = (e) => {
    if(e.target.checked){
      this.setState({ship_to_billing:true});
      $("#divShippingAddress").hide();
      this.setShippingAddress();
    } else {
      this.setState({ship_to_billing:false});
      $("#divShippingAddress").show();
    }
  } 

  onChange = (e) => {
    const { value, name } = e.target;
    this.setState({[name]:value});
  }

  onCodeChange = (e) => {
    
    let code = e.target.value;
    let customer = this.props.customerlist.find(c => c.customercode == code);
    if(customer){
      this.setCustomer(customer);
    }

  }

  closeWindow = (e) => {
    e.preventDefault();
    this.setState({isCopiedFromWO:false});
    $('#btnCreateWorkOrderClose').click();
  }

  //----------- CREATE NEW WORK ORDER -----------------------------------//
  saveWorkOrder = (e) => {


    e.preventDefault();

    if(this.state.client == "" || this.state.client == 0 ){
      notify_error('Please enter Client Name');
      return;
    }

    if(this.state.project == "" || this.state.project == 0 ){
      notify_error('Please enter Project Name');
      return;
    }



     if(isEmptyOrSpaces(this.state.billing_address1) || 
        isEmptyOrSpaces(this.state.billing_address2)|| 
        isEmptyOrSpaces(this.state.billing_pin)|| 
        isEmptyOrSpaces(this.state.billing_phone)|| 
        isEmptyOrSpaces(this.state.billing_gst)){
    notify_error('Please enter complete Billing Address');
    return;
    }

    if(this.state.ship_to_billing)  {
      this.setShippingAddress();
    }

     if(isEmptyOrSpaces(this.state.shipping_address1) || 
        isEmptyOrSpaces(this.state.shipping_address2)|| 
        isEmptyOrSpaces(this.state.shipping_pin)|| 
        isEmptyOrSpaces(this.state.shipping_phone)|| 
        isEmptyOrSpaces(this.state.shipping_gst)){
    notify_error('Please enter complete Shipping Address');
    return;
    }

    window.setTimeout(() => {
      this.upsertWO();
    },100)





  }

  upsertWO = () =>{

    if(this.props.edit){
      this.props.updateAddress({
          client:this.state.client,
          project:this.state.project,
          billing_address1:this.state.billing_address1,
          billing_address2:this.state.billing_address2,
          billing_pin:this.state.billing_pin, 
          billing_phone:this.state.billing_phone, 
          billing_gst:this.state.billing_gst,
          shipping_address1:this.state.shipping_address1,
          shipping_address2:this.state.shipping_address2, 
          shipping_pin:this.state.shipping_pin,
          shipping_phone:this.state.shipping_phone, 
          shipping_gst:this.state.shipping_gst,
          ship_to_billing:this.state.ship_to_billing
      });

      this.setState({isCopiedFromWO:false});
      $('#btnCreateWorkOrderClose').click();
  }
  else{
      const customerCode = this.state.customercode;
      const materialWoId = this.state.materialWoId;
  
      if(customerCode == "" || customerCode == 0 ){
        notify_error('Please select a customer');
        return;
      }
  
      const newWO = {
        user_id: this.props.user.id,
        customer_id:this.state.customer_id,
        wonumber: customerCode.toUpperCase() + ' ' + this.getDateFormat() + '-',
        materialWoId,
        client:this.state.client,
        project:this.state.project,
        billing_address1:this.state.billing_address1,
        billing_address2:this.state.billing_address2,
        billing_pin:this.state.billing_pin,
        billing_phone:this.state.billing_phone,
        billing_gst:this.state.billing_gst,
        shipping_address1:this.state.shipping_address1,
        shipping_address2:this.state.shipping_address2,
        shipping_pin:this.state.shipping_pin,
        shipping_phone:this.state.shipping_phone,
        shipping_gst:this.state.shipping_gst,
        ship_to_billing:this.state.ship_to_billing
      }
  
      this.props.createWorkOrder(newWO);

      this.setState({isCopiedFromWO:false});
      $('#btnCreateWorkOrderClose').click();
  
      const { history } = this.props;
      if(history) history.push('/workorder');
  }
  }

  getDateFormat = () =>{
    var dateObj = new Date();
    var month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
    var date = ('0' + dateObj.getDate()).slice(-2);
    var year = dateObj.getFullYear().toString().substr(2,2);
    var shortDate = date + '' + month + '' + year;
    return shortDate;
  }
  

  render() {
    return(
      <div>
        <div className="modal fade" id="newWoModal" tabIndex="-1" role="dialog" aria-labelledby="newWoModalLabel"  data-backdrop="static" data-keyboard="false">
          <div className="modal-dialog modal-lg mt-0" >
            <div className="modal-content" style={{marginTop:"10px"}}>
              <div className="modal-header" style={{paddingTop:"2px",paddingBottom:"0px"}}>
                <h5 className="modal-title"> {this.props.edit? 'Update ' : 'Create New '} Work Order</h5>
                  <button style={{width:"1px"}} id="btnCreateWorkOrderClose" type="button" className="btn btn-light" data-dismiss="modal"></button>
              </div>
              <div className="modal-body" style={{paddingBottom:"0px"}}>

              <form className="forms-sample" style={{width:"90%",margin:"0 auto"}} >
                  <div style={{display:`${this.props.edit?'none':'flex'}`}} className="form-group row">
                  <label htmlFor="customer_id" className="col-sm-3 col-form-label">Select the Customer</label>
                  <div className="col-sm-9">
                    <select id="customercode" name="customercode" value={this.state.customercode} className="js-example-basic-single input-xs" style={{width:"200px"}} onChange={ (e) => this.onCodeChange(e)} >
                      <option id="0">Select Customer...</option>
                      {this.props.customerlist.map(cl => { return(
                        <option value={cl.customercode} key={cl.customercode}>{cl.customercode}</option>
                      )})}
                    </select>
                  </div>
                  </div>

                  <div className="form-group row">
                  <label className="col-sm-3 col-form-label">Client Name</label>
                  <div className="col-sm-9">
                      <input style={{width:"400px"}} type="text" onChange={ (e) => this.onChange(e)} value={this.state.client}  className="form-control" id="client" name="client" placeholder="Client Name"/>
                  </div>
                  </div>

                  <div className="form-group row">
                  <label className="col-sm-3 col-form-label">Project Name <span style={{color:'red'}}>*</span></label>
                  <div className="col-sm-9">
                      <input style={{width:"400px"}} type="text" onChange={ (e) => this.onChange(e)} value={this.state.project}  className="form-control" id="project" name="project" placeholder="Project Name"/>
                  </div>
                  </div>                  

                  <div className="form-group row">
                  <label className="col-sm-3 col-form-label">Billing Address</label>
                  
                  <div className="col-sm-9">
                      <input style={{width:"500px"}} type="text" onChange={ (e) => this.onChange(e)} value={this.state.billing_address1}  className="form-control" id="billing_address1" name="billing_address1" placeholder="Address1"/>
                      <input style={{width:"500px"}} type="text" onChange={ (e) => this.onChange(e)} value={this.state.billing_address2}  className="form-control" id="billing_address2" name="billing_address2" placeholder="Address2"/>
                      
                      <div className="form-group row" style={{margin:'0px'}}>
                        <label className="col-sm-1 col-form-label">PIN</label>
                        <input style={{width:"425px"}} type="text" onChange={ (e) => this.onChange(e)} value={this.state.billing_pin}  className="form-control" id="billing_pin" name="billing_pin" placeholder="PIN"/>
                      </div>
                      <div className="form-group row" style={{margin:'0px'}}>
                        <label className="col-sm-1 col-form-label">Phone</label>
                        <input style={{width:"425px"}} type="text" onChange={ (e) => this.onChange(e)} value={this.state.billing_phone}  className="form-control" id="billing_phone" name="billing_phone" placeholder="Phone"/>
                      </div>
                      <div className="form-group row" style={{margin:'0px'}}>
                        <label className="col-sm-1 col-form-label">GST</label>
                        <input style={{width:"425px"}} type="text" onChange={ (e) => this.onChange(e)} value={this.state.billing_gst}  className="form-control" id="billing_gst" name="billing_gst" placeholder="GST"/>
                      </div>
                  </div>
                  </div>

                  <div className="form-group row">
                    <div  className="col-sm-6 col-form-label" >
                    <input type="checkbox" checked={this.state.ship_to_billing ? 'checked' : ''}  onClick={ (e) => this.toggleShippingAddress(e)} id="ship_to_billing" name="ship_to_billing" /> <label className="col-form-label" style={{display:'inline'}}> Shipping Address is same as Billing Address</label>
                    </div>
                  </div>
                  <div className="form-group row">
                  <label className="col-sm-3 col-form-label"></label>
                  <div className="col-sm-9" id="divShippingAddress" >
                      <input style={{width:"500px"}} type="text" onChange={ (e) => this.onChange(e)} value={this.state.shipping_address1}  className="form-control" id="shipping_address1" name="shipping_address1" placeholder="Address1"/>
                      <input style={{width:"500px"}} type="text" onChange={ (e) => this.onChange(e)} value={this.state.shipping_address2}  className="form-control" id="shipping_address2" name="shipping_address2" placeholder="Address2"/>
                      <div className="form-group row" style={{margin:'0px'}}>
                        <label className="col-sm-1 col-form-label">PIN</label>
                        <input style={{width:"425px"}} type="text" onChange={ (e) => this.onChange(e)} value={this.state.shipping_pin}  className="form-control" id="shipping_pin" name="shipping_pin" placeholder="PIN"/>
                      </div>
                      <div className="form-group row" style={{margin:'0px'}}>
                        <label className="col-sm-1 col-form-label">Phone</label>
                        <input style={{width:"425px"}} type="text" onChange={ (e) => this.onChange(e)} value={this.state.shipping_phone}  className="form-control" id="shipping_phone" name="shipping_phone" placeholder="Phone"/>
                      </div>
                      <div className="form-group row" style={{margin:'0px'}}>
                        <label className="col-sm-1 col-form-label">GST</label>
                        <input style={{width:"425px"}} type="text" onChange={ (e) => this.onChange(e)} value={this.state.shipping_gst}  className="form-control" id="shipping_gst" name="shipping_gst" placeholder="GST"/>
                      </div>
                  </div>
                  </div>        

                  <div style={{display:`${this.props.edit?'none':'flex'}`}}  className="form-group row">
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
                  <button style={{float:"right", margin:'10px',padding:"10px"}}  onClick={ (e) => this.closeWindow(e)} className="btn btn-secondary"> Cancel </button>
                  <button style={{float:"right", margin:'10px',padding:"10px"}}  onClick={ (e) => this.saveWorkOrder(e)} className="btn btn-primary submit-btn"> {this.props.edit?  ' Update ':' Create '}</button>
                 
              </form>
                  <br /><br />
              </div>
            </div>
          </div>
        </div>
      </div>          
    )
  }
}


export default WorkOrderDetails;

