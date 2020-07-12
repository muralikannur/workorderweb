import React, { PureComponent} from 'react';
import { connect } from 'react-redux';
import { clearErrors } from '../../actions/errorActions';

class DashBoardRecentWO extends PureComponent {
 
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
      <div className="row">
      <div className="col-md-7 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Recent Work Orders</h4>
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Work Order #</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Date Submitted</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="disc bg-secondary"></div>
                  </td>
                  <td>
                    <h4 className="text-primary font-weight-normal">490-525-4779</h4>
                    <p className="text-muted mb-0">Online sale</p>
                  </td>
                  <td>
                    $41991
                  </td>
                  <td>
                    <p>27 Sep 2018</p>
                    <p className="text-muted mb-0">3 days ago</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="disc bg-secondary"></div>
                  </td>
                  <td>
                    <h4 className="text-primary font-weight-normal">490-525-4780</h4>
                    <p className="text-muted mb-0">Online sale</p>
                  </td>
                  <td>
                    $65789
                  </td>
                  <td>
                    <p>27 Sep 2018</p>
                    <p className="text-muted mb-0">2 days ago</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="disc bg-secondary"></div>
                  </td>
                  <td>
                    <h4 className="text-primary font-weight-normal">490-525-4781</h4>
                    <p className="text-muted mb-0">Offline sale</p>
                  </td>
                  <td>
                    $98076
                  </td>
                  <td>
                    <p>27 Sep 2018</p>
                    <p className="text-muted mb-0">4 days ago</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="disc bg-secondary"></div>
                  </td>
                  <td>
                    <h4 className="text-primary font-weight-normal">490-525-4782</h4>
                    <p className="text-muted mb-0">Online sale</p>
                  </td>
                  <td>
                    $67589
                  </td>
                  <td>
                    <p>27 Sep 2018</p>
                    <p className="text-muted mb-0">1 day ago</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="col-md-5 grid-margin stretch-card">
        <div className="card">
          <div className="card-body d-flex flex-column justify-content-between">
            <div>
              <h4 className="card-title">Revenue</h4>
              <h1>20009</h1>
              <p className="text-muted">5.6% change today</p>
            </div>
            <canvas id="sales-chart" className="mt-auto"></canvas> 
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
)(DashBoardRecentWO);
