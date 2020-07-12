import React, { PureComponent} from 'react';
import { connect } from 'react-redux';
import { logout } from '../../actions/authActions';

class Header extends PureComponent {
 

    render() {
        const { user } = this.props;
        return(
            <nav className="navbar horizontal-layout col-lg-12 col-12 p-0">
            <div className="nav-top flex-grow-1">
                <div className="container d-flex flex-row h-100 align-items-center">
                <div className="text-center navbar-brand-wrapper d-flex align-items-center">
                  <div className="navbar-brand brand-logo" ><span style={{fontFamily:"Impact", fontSize:"32px", color:"#439aff"}}><span style={{color:"#fff"}}>W</span>ORK <span style={{color:"#fff"}}>O</span>RDER <span style={{color:"#fff"}}>W</span>EB</span></div>
                  <div className="navbar-brand brand-logo-mini" ><span style={{ color: "#fff",fontFamily:"Impact", fontSize:"32px" }}>WOW</span></div>
                </div>

                {!user ? null : 
                <div className="navbar-menu-wrapper d-flex align-items-center justify-content-between flex-grow-1">
                    
                    <ul className="navbar-nav navbar-nav-right mr-0 ml-auto">
                    <div className="badge badge-pill badge-success" style={{fontSize:"16px", fontWeight:"bold"}}><i className="icon-user ml-2"></i> &nbsp;  {this.props.customer.customercode}  &nbsp; </div>
                        <li className="nav-item nav-profile dropdown">
                            <a className="nav-link dropdown-toggle" href="#" data-toggle="dropdown" id="profileDropdown">
                            
                            &nbsp; 
                            <span id="userEmail" className="nav-profile-name"><b>{user.email}</b></span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="profileDropdown">

                            <a onClick={this.props.logout} href='#' className="dropdown-item">
                                <i className="icon-logout text-primary mr-2"></i>
                                Logout
                            </a>
                            </div>
                        </li>
                    </ul>
                    <button className="navbar-toggler align-self-center" type="button" data-toggle="minimize">
                    <span className="icon-menu text-dark"></span>
                    </button>
                </div>
                }
                </div>
            </div>
            </nav>
        )
    }
}

const mapStateToProps = state => ({
    user: state.auth.user,
    customer:state.customer
});

export default connect(mapStateToProps,{logout})(Header);
