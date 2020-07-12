import React, { PureComponent} from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

import { resetpassword } from '../../actions/authActions';
import { clearErrors, returnErrors } from '../../actions/errorActions';
import * as qs from 'query-string';

class ResetPassword extends PureComponent {

  componentDidMount(){
    this.props.clearErrors();
  }

  state = {
    email: '',
    password: '',
    password2: '',
    code:''
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
 
  onSubmit = e => {
    e.preventDefault();

    const uid = qs.parse(this.props.location.search);
    if(!uid){
      this.props.returnErrors({msg:'UserId is missing...'});
      return;
    }
    const { code, email, password, password2 } = this.state;

    if(code == '' || email == '' || password ==''){
      this.props.returnErrors({msg:'All fields are mandatory'});
      return;
    }

    if(email.indexOf('@') == -1){
      this.props.returnErrors({msg:'Incorrect Email Address'});
      return;
    }

    if(password != password2){
      this.props.returnErrors({msg:'Password does not match'});
      return;
    }

    const newPassword = {
      uid,
      email,
      password,
      code
    };

    this.props.resetpassword(newPassword);
  };


  ToDashBoard = () => {
    const { history } = this.props;
    if(history) history.push('/wolist');
  }



  render() {
    if(this.props.isAuthenticated) this.ToDashBoard();
    return(
      <div className="container-scroller">
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper auth p-0 theme-two">
          <div className="row d-flex align-items-stretch">
            <div className="col-md-4 banner-section d-none d-md-flex align-items-stretch justify-content-center">
              <div className="slide-content" style={{backgroundImage:"url('images/sidebg.jpg')",borderRight:"#ccc 1px solid"}}>
              </div>
            </div>
            <div className="col-12 col-md-8 h-100 bg-white">
              <div className="auto-form-wrapper d-flex align-items-center justify-content-center flex-column">
                <div className="nav-get-started">
                  <Link className="btn get-started-btn" to="/login">LOG IN</Link> &nbsp; 
                  <Link className="btn get-started-btn" to="/register">REGISTER</Link>
                </div>
                <form action="#">
                  <h3 className="mr-auto">Password Reset</h3>
                  <p className="mb-5 mr-auto">Enter the follwoing details to reset your password. <i>
                      <br />1. Registered Email address.
                      <br />2. Verification code that is sent to your email.
                      <br />3. New Password that you wish to set for your account.</i></p>

                  {this.props.error.msg.msg ? (
                    <div className="alert alert-danger" role="alert">
                      {this.props.error.msg.msg}
                    </div>
                  ) : null}




                  <div className="form-group">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text"><i className="icon-envelope-open"></i></span>
                      </div>
                      <input type="text"  maxLength="100" onChange={this.onChange} className="form-control" placeholder="Email" name="email" id="email"  />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text"><i className="icon-lock"></i></span>
                      </div>
                      <input onChange={this.onChange}
                        type='text'
                        maxLength='100'
                        name='code'
                        id='code'
                        placeholder='Verification Code'
                        className='form-control'
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text"><i className="icon-lock"></i></span>
                      </div>
                      <input type="password"  maxLength="100" onChange={this.onChange} className="form-control" placeholder="New Password" name="password" id="password" />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text"><i className="icon-lock"></i></span>
                      </div>
                      <input type="password"  maxLength="100" onChange={this.onChange} className="form-control" placeholder="Confirm New Password"  name="password2" id="password2"  />
                    </div>
                  </div>
                  <div className="form-group">
                    <button  onClick={this.onSubmit} className="btn btn-primary submit-btn">RESET PASSWORD</button>
                  </div>
                </form>
              </div>
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
  error: state.error
});

export default connect(
  mapStateToProps,
  { resetpassword, clearErrors, returnErrors }
)(ResetPassword);
