import React, { PureComponent} from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import { notify_error } from '../../Utils/commonUtls';
import { updateProfile } from './remarksActions';
import { PROFILE_TYPE} from '../../constants';

class RemarksProfile extends PureComponent {
 
  constructor(props){
    super(props);
    this.state = {
      profileNumber:0,
      profileSide:''
    }
  }

  UpdateRemark(){

    let profileSide = $('#profileSide').val();
    let profileNumber = $('#profileNumber').val()

    if(profileSide == ''){
      notify_error('Please select the Profile Side');
      return;
    }
    if(profileNumber == '0'){
      notify_error('Please select the Profile Type');
      return;
    }
    this.props.updateProfile(profileNumber, profileSide);
    $('#btnRemarksClose').click();
  }
  render() {
    return(
      <div>
          {(this.props.profiles && this.props.profiles.filter(p => p.type == PROFILE_TYPE.H).length > 0) ? 
          <div>
            <table style={{width:"100%"}}>
              <tr>
                <td>
                  <h6>Select the Profile Type</h6>
                  <select style={{width:"300px"}}  id="profileNumber" name="profileNumber" defaultValue={this.props.profileNumber}  className="js-example-basic-single input-xs  w-100">
                  <option value="0" key="0" >Select...</option>
                  {this.props.profiles.filter(p => p.type != PROFILE_TYPE.E).map( (e) => {
                    return (
                      <option value={e.profileNumber} key={e.profileNumber} >{e.type} - H:{e.height} - W:{e.width}</option>
                    )})}
                  </select> 
                </td>
                <td>
                  <h6>Select the side</h6>
                  <select style={{width:"300px"}}  id="profileSide" name="profileSide" defaultValue={this.props.profileSide}  className="js-example-basic-single input-xs  w-100">
                    <option value="" key="" >Select...</option>
                    <option value="H" key="H" >Height</option>
                    <option value="W" key="W" >Width</option>
                  </select> 
                </td>
              </tr>
            </table>
  
            <hr /><br />
            <div className="modal-footer" style={{paddingTop:"0px",paddingBottom:"5px",display:"block", textAlign:"right"}}>
            <button type="button" className="btn btn-success" onClick={() => {this.UpdateRemark()}}>Update</button>
            </div>   
          </div>
          : <div><h5>No Hand Profiles defined</h5> <p>Define the Profiles in the Define Material section.</p> </div>    
          }      
         <br />

      </div>          

    )
    
  }
}

const mapStateToProps = state => (
  {
    profileNumber:state.config.currentItem.profileNumber,
    profileSide:state.config.currentItem.profileSide,
    profiles:state.material.profiles
  }
);

export default connect(
  mapStateToProps,
  {updateProfile},
  null
)(RemarksProfile);
