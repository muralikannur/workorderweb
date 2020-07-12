import React, { PureComponent} from 'react';
import { connect } from 'react-redux';
import { clearErrors } from '../../actions/errorActions';

import DashBoardRecentWO from './DashBoardRecentWO';

class DashBoardMain extends PureComponent {
 
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
        <div className="content-wrapper">
          <DashBoardRecentWO />
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
)(DashBoardMain);
