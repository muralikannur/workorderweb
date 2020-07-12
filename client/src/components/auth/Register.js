import React, { PureComponent} from 'react';
import { connect } from 'react-redux';

import { register } from '../../actions/authActions';
import { clearErrors, returnErrors } from '../../actions/errorActions';

import { Link } from "react-router-dom";

class Register extends PureComponent {

  componentDidMount(){
    this.props.clearErrors();
  }

  state = {
    name:'',
    email: '',
    password: '',
    password2: ''
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
 
  onSubmit = e => {
    e.preventDefault();

    const { name, email, password, password2 } = this.state;

    if(name == '' || email == '' || password ==''){
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

    const newUser = {
      name,
      email,
      password
    };

    this.props.register(newUser);
  };


  render() {
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
                  <p>Already have an account?</p>
                  <Link className="btn get-started-btn" to="/login">LOG IN</Link>
                </div>
                <form action="#">
                  <h3 className="mr-auto">Register</h3>
                  <p className="mb-5 mr-auto">Enter your details below.</p>

                  {this.props.error.msg.msg ? (
                    <div className="alert alert-danger" role="alert">
                      {this.props.error.msg.msg}
                    </div>
                  ) : null}

                  <div className="form-group">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text"><i className="icon-user"></i></span>
                      </div>
                      <input type="text" maxLength="100" onChange={this.onChange} className="form-control" placeholder="User Name" name="name" id="name"  />
                    </div>
                  </div>
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
                      <input type="password"  maxLength="100" onChange={this.onChange} className="form-control" placeholder="Password" name="password" id="password" />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text"><i className="icon-lock"></i></span>
                      </div>
                      <input type="password"  maxLength="100" onChange={this.onChange} className="form-control" placeholder="Confirm Password"  name="password2" id="password2"  />
                    </div>
                  </div>
                  <div className="form-group">
                    <button  onClick={this.onSubmit} className="btn btn-primary submit-btn">REGISTER</button>
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
  error: state.error
});

export default connect(
  mapStateToProps,
  { register, clearErrors, returnErrors }
)(Register);
