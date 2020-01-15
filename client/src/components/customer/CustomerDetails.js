import React, { Component} from 'react';
import PropTypes from 'prop-types';
import { notify_error } from '../../util';
import $ from 'jquery';


class CustomerDetails extends Component {
 
  constructor(props){
    super(props);
    this.state = {
      customercode:'',
      companyname:'',
      contactperson:'',
      phone:'',
      whatsapp:'',
      email:'',
      billing_address:'',
      shipping_address:''
    }
  }


  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.currentCustomer != 0 && nextProps.customer.customercode != this.state.customercode){
      const { customercode,companyname,contactperson, phone, whatsapp, email, billing_address, shipping_address } = nextProps.customer;
      this.setState({ customercode,companyname,contactperson, phone, whatsapp, email, billing_address, shipping_address })
    } 
    return true;
  }


  onChange = (e) => {
    const { value, name } = e.target;
    this.setState({[name]:value});

  }

  onSubmit = e => {
    e.preventDefault();
    
    let { customercode,companyname,contactperson, phone, whatsapp, email, billing_address, shipping_address } = this.state;
    

    if(customercode.length != 3){
      notify_error("Customer Code must be a 3 letter code");
      return;
    }

    if(phone == '' || email == '' || whatsapp == '' ){
      notify_error("Please enter mandatory fields");
      return;
    }

    if(email.indexOf('@') == -1){
      notify_error('Incorrect Email Address');
      return;
    }

    customercode = customercode.toUpperCase();
    const newCustomer = {customercode,companyname,contactperson, phone, whatsapp, email, billing_address, shipping_address };

      this.props.saveCustomer(newCustomer, this.props.currentCustomer);
      $('#btnCustomersClose').click();

  };


  render() {
    return(
      <div>
        <div className="modal fade" id="customerModal" tabIndex="-1" role="dialog" aria-labelledby="customersModalLabel"  data-backdrop="static" data-keyboard="false">
          <div className="modal-dialog modal-lg mt-0" >
            <div className="modal-content" style={{marginTop:"10px"}}>
              <div className="modal-header" style={{paddingTop:"2px",paddingBottom:"0px"}}>
                <h5 className="modal-title">{this.props.currentCustomer == 0 ? "Add New ":"Edit "} Customer</h5>
                  <button id="btnCustomersClose" type="button" className="btn btn-light" data-dismiss="modal"> Back to Customer List <i className="icon-login"></i> </button>
              </div>
              <div className="modal-body" style={{paddingBottom:"0px"}}>

              <form className="forms-sample" style={{width:"90%",margin:"0 auto"}} >
                  <div className="form-group row">
                  <label htmlFor="customercode" className="col-sm-3 col-form-label">Customer Code <span style={{color:'red'}}>*</span></label>
                  <div className="col-sm-9">
                      {this.props.currentCustomer == 0 ? 
                        <input type="text" maxLength="3" onChange={ (e) => this.onChange(e)} value={this.state.customercode}   className="form-control" id="customercode" name="customercode" placeholder="Customer Ccode"/>
                      :
                      <div style={{padding:"2px", fontWeight:"bold"}}>{this.state.customercode}</div>
                      }

                  </div>
                  </div>

                  <div className="form-group row">
                  <label htmlFor="contactperson" className="col-sm-3 col-form-label">Contact Person</label>
                  <div className="col-sm-9">
                      <input type="text" onChange={ (e) => this.onChange(e)} value={this.state.contactperson}   className="form-control" id="contactperson" name="contactperson" placeholder="Contact Person"/>
                  </div>
                  </div>

                  <div className="form-group row">
                  <label htmlFor="companyname" className="col-sm-3 col-form-label">Company Name </label>
                  <div className="col-sm-9">
                      <input type="text" onChange={ (e) => this.onChange(e)} value={this.state.companyname}   className="form-control" id="companyname" name="companyname" placeholder="Company Name"/>
                  </div>
                  </div>

                  <div className="form-group row">
                  <label htmlFor="phone" className="col-sm-3 col-form-label">Phone <span style={{color:'red'}}>*</span></label>
                  <div className="col-sm-9">
                      <input type="text" onChange={ (e) => this.onChange(e)} value={this.state.phone} className="form-control" id="phone" name="phone" placeholder="Phone"/>
                  </div>
                  </div>
                  <div className="form-group row">
                  <label htmlFor="whatsapp" className="col-sm-3 col-form-label">WhatsApp Number <span style={{color:'red'}}>*</span></label>
                  <div className="col-sm-9">
                      <input type="text" onChange={ (e) => this.onChange(e)} value={this.state.whatsapp}  className="form-control" id="whatsapp" name="whatsapp" placeholder="WhatsApp Number"/>
                  </div>
                  </div>
                  <div className="form-group row">
                  <label htmlFor="whatsapp" className="col-sm-3 col-form-label">Email <span style={{color:'red'}}>*</span></label>
                  <div className="col-sm-9">
                      <input type="text" onChange={ (e) => this.onChange(e)} value={this.state.email}  className="form-control" id="email" name="email" placeholder="Email"/>
                  </div>
                  </div>
                  <div className="form-group row">
                  <label htmlFor="billing_address" className="col-sm-3 col-form-label">Billing Address</label>
                  <div className="col-sm-9">
                      <input type="text" onChange={ (e) => this.onChange(e)} value={this.state.billing_address}   className="form-control" id="billing_address" name="billing_address" placeholder="Billing Address"/>
                  </div>
                  </div>
                  <div className="form-group row">
                  <label htmlFor="shipping_address" className="col-sm-3 col-form-label">Shipping Address</label>
                  <div className="col-sm-9">
                      <input type="text" onChange={ (e) => this.onChange(e)} value={this.state.shipping_address}  className="form-control" id="shipping_address" name="shipping_address" placeholder="Billing Address"/>
                  </div>
                  </div>                    


                  <button style={{float:"right", padding:"10px"}}  onClick={ (e) => this.onSubmit(e)} className="btn btn-primary submit-btn">Submit</button>
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

// CustomersMain.propTypes = {
//   cus: PropTypes.object.isRequired,
//   wo: PropTypes.object.isRequired,
//   material: PropTypes.object.isRequired,  
//   currentCustomer: PropTypes.object.isRequired,    
//   saveCustomer: PropTypes.func.isRequired
// }

export default CustomerDetails;
