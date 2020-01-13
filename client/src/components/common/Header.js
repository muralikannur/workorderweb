import React, { Component} from 'react';
import { connect } from 'react-redux';
import { NavLink, Link } from "react-router-dom";
import { logout } from '../../actions/authActions';

class Header extends Component {
 
    render() {
        const { user } = this.props;
        return(
            <nav className="navbar horizontal-layout col-lg-12 col-12 p-0">
            <div className="nav-top flex-grow-1">
                <div className="container d-flex flex-row h-100 align-items-center">
                <div className="text-center navbar-brand-wrapper d-flex align-items-center">
                  <a className="navbar-brand brand-logo" href="index.html"><span style={{fontFamily:"Impact", fontSize:"32px"}}><span style={{color:"#fff"}}>W</span>ORK <span style={{color:"#fff"}}>O</span>RDER <span style={{color:"#fff"}}>W</span>EB</span></a>
                  <a className="navbar-brand brand-logo-mini" href="index.html"><span style={{ color: "#fff",fontFamily:"Impact", fontSize:"32px" }}>WOW</span></a>
                </div>

                {!user ? null : 
                <div className="navbar-menu-wrapper d-flex align-items-center justify-content-between flex-grow-1">
                    <ul className="navbar-nav navbar-nav-right mr-0 ml-auto">
                        <li className="nav-item nav-profile dropdown">
                            <a className="nav-link dropdown-toggle" href="#" data-toggle="dropdown" id="profileDropdown">
                            <div className="badge badge-pill badge-success" style={{fontSize:"16px", fontWeight:"bold"}}><i className="icon-user ml-2"></i> &nbsp;  {user.name}  &nbsp; </div>
                            &nbsp; 
                            <span className="nav-profile-name">{user.email}</span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="profileDropdown">
                            {/* <Link to="/settings" className="dropdown-item">
                                <i className="icon-settings text-primary mr-2"></i>
                                Settings
                            </Link>
                            <div className="dropdown-divider"></div> */}
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
            <div className="nav-bottom">
                <div className="container">
                    <nav>
                        <ul className="nav" style={{fontWeight:"bold"}}>
                            <li className="nav-item">
                                <NavLink to="/wolist" className="nav-link"><i className="link-icon icon-screen-tablet"></i> &nbsp; <span className="menu-title">Work Orders</span></NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/customerlist" className="nav-link"><i className="link-icon icon-people"></i> &nbsp; <span className="menu-title">Customers</span></NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            </nav>
        )
    }
}

const mapStateToProps = state => ({
    user: state.auth.user
});

export default connect(mapStateToProps,{logout})(Header);
