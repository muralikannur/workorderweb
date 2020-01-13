import React, { Component} from 'react';
import { connect } from 'react-redux';
import { clearErrors } from '../../actions/errorActions';

import Profile from './Profile';

class Settings extends Component {
 
  componentDidMount(){
    this.props.clearErrors();
  }

  ToLoginPage = () => {
    const { history } = this.props;
    if(history) history.push('/login');
   }
  render() {
    if(!this.props.isAuthenticated) {this.ToLoginPage(); return null};
    const {user} = this.props;
    return(

      <div className="col-md-12 grid-margin stretch-card">
      <div className="card" style={{marginTop:"15px"}}>
        <div className="card-body">
          <h4 className="card-title"><i className="icon-settings"></i> &nbsp; SETTINGS</h4>
          <div className="row ml-md-0 mr-md-0 vertical-tab tab-minimal">
            <ul className="nav nav-tabs col-md-2" style={{borderRight:"#eee 1px solid"}} role="tablist">
              <li className="nav-item">
                <a className="nav-link show active" id="tab-2-1" data-toggle="tab" href="#profile-2-1" role="tab" aria-controls="profile-2-1" aria-selected="true"><i className="icon-user"></i>Profile</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" style={{color:"#ddd"}}  id="tab-2-2" data-toggle="tab" href="#message-2-2" role="tab" aria-controls="message-2-2" aria-selected="false"><i className="icon-envelope"></i>Messages</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" style={{color:"#ddd"}}  id="tab-2-2" data-toggle="tab" href="#message-2-2" role="tab" aria-controls="message-2-2" aria-selected="false"><i className="icon-screen-desktop"></i>DashBoard</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" style={{color:"#ddd"}}  id="tab-2-2" data-toggle="tab" href="#message-2-2" role="tab" aria-controls="message-2-2" aria-selected="false"><i className="icon-book-open"></i>Accounts</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" style={{color:"#ddd"}}  id="tab-2-2" data-toggle="tab" href="#message-2-2" role="tab" aria-controls="message-2-2" aria-selected="false"><i className="icon-lock"></i>Change Password</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" style={{color:"#ddd"}}  id="tab-2-2" data-toggle="tab" href="#message-2-2" role="tab" aria-controls="message-2-2" aria-selected="false"><i className="icon-list"></i>Configuration</a>
              </li>



            </ul>
            <div className="tab-content col-md-10">
              <div className="tab-pane fade show active" id="profile-2-1" role="tabpanel" aria-labelledby="tab-2-1">

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
  user: state.auth.user
});

export default connect(
  mapStateToProps,
  {clearErrors}
)(Settings);
