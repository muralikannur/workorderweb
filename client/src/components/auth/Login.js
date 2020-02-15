import React, { Component} from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

import { login } from '../../actions/authActions';
import { clearErrors, returnErrors } from '../../actions/errorActions';


class Login extends Component {

  componentDidMount(){
    this.props.clearErrors();

     const user = {
       email : 'muralikannur@gmail.com',
       password : 'murali123'
     };
     this.props.login(user);

  }

  state = {
    email: '',
    password: ''
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
 
  onSubmit = e => {
    e.preventDefault();
    const { email, password } = this.state;

    if(email == '' || password ==''){
      this.props.returnErrors({msg:'All fields are mandatory'});
      return;
    }

    if(email.indexOf('@') == -1){
      this.props.returnErrors({msg:'Incorrect Email Address'});
      return;
    }


    const user = {
      email,
      password
    };
    this.props.login(user);
  };

  ToDashBoard = () => {
    const { history } = this.props;
    if(history) history.push('/customerlist');
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
                  <p>Don't have an account?</p>
                  <Link className="btn get-started-btn" to="/register">REGISTER</Link>
                </div>
                <form action="#">
                  <h3 className="mr-auto">Login</h3>
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
                      <input
                        type='text'
                        maxLength='100'
                        name='email'
                        id='email'
                        placeholder='Email'
                        className='form-control'
                        onChange={this.onChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text"><i className="icon-lock"></i></span>
                      </div>
                      <input
                        type='password'
                        maxLength='100'
                        name='password'
                        id='password'
                        placeholder='Password'
                        className='form-control'
                        onChange={this.onChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <button onClick={this.onSubmit} className="btn btn-primary submit-btn">SIGN IN</button>
                    &nbsp; &nbsp;
                      <Link className="btn get-started-btn" to="/forgotpassword">Forgot Password?</Link>
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
  { login, clearErrors, returnErrors}
)(Login);
