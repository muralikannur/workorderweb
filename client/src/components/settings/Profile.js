import React, { Component} from 'react';
import { connect } from 'react-redux';
import { clearErrors } from '../../actions/errorActions';
import { saveProfile } from '../../actions/profileActions';

class Profile extends Component {
 
  componentDidMount(){
    this.props.clearErrors();

    setTimeout(() => {
      const { contactperson, phone, whatsapp, billing_address, shipping_address } = this.props.profile;
      this.setState({ contactperson, phone, whatsapp, billing_address, shipping_address });
    },200)


  }

  state = {
    contactperson:'',
    phone: '',
    whatsapp: '',
    billing_address: '',
    shipping_address: ''
  };


  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const { contactperson, phone, whatsapp, billing_address, shipping_address } = this.state;

    const newProfile = {
      userid:this.props.user.id,
      contactperson, 
      phone, 
      whatsapp, 
      billing_address, 
      shipping_address
    };

    this.props.saveProfile(newProfile);
  };



  ToLoginPage = () => {
    const { history } = this.props;
    if(history) history.push('/login');
   }
  render() {
    //if(!this.props.isAuthenticated) {this.ToLoginPage(); return null};
    return(
        <div className="card">
            <div className="card-body">
                <h5>User Profile</h5> <br />

                <form className="forms-sample">
                    <div className="form-group row">
                    <label htmlFor="contactperson" className="col-sm-3 col-form-label">Contact Person</label>
                    <div className="col-sm-9">
                        <input type="text" onChange={ (e) => this.onChange(e)} value={this.state.contactperson}   className="form-control" id="contactperson" name="contactperson" placeholder="Contact Person"/>
                    </div>
                    </div>
                    <div className="form-group row">
                    <label htmlFor="phone" className="col-sm-3 col-form-label">Phone</label>
                    <div className="col-sm-9">
                        <input type="text" onChange={ (e) => this.onChange(e)} value={this.state.phone} className="form-control" id="phone" name="phone" placeholder="Phone"/>
                    </div>
                    </div>
                    <div className="form-group row">
                    <label htmlFor="whatsapp" className="col-sm-3 col-form-label">WhatsApp Number</label>
                    <div className="col-sm-9">
                        <input type="text" onChange={ (e) => this.onChange(e)} value={this.state.whatsapp}  className="form-control" id="whatsapp" name="whatsapp" placeholder="WhatsApp Number"/>
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


                    <button className="btn btn-primary submit-btn">Submit</button>
                </form>
            </div>
      </div>

    )
    
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  {clearErrors, saveProfile}
)(Profile);
