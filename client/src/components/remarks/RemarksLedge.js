import React, { PureComponent} from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import { notify_error } from '../../Utils/commonUtls';

import { updateLedge } from './remarksActions';



class RemarksLedge extends PureComponent {
   
  UpdateRemark(){
    let value = $('#ledgeType').val();
    if(value == "0"){
      notify_error('Please select a Ledge Type.');
      return;
    }
    this.props.updateLedge(value);
    $('#btnRemarksClose').click();
  }
  
  render() {
    return(
      <div>
          <div>
            <h5>Select the Ledge Type</h5>
            <select style={{width:"300px"}}  id="ledgeType" name="ledgeType"  defaultValue={this.props.ledgeType}  className="js-example-basic-single input-xs  w-100">
            <option value="0" key="0" >Select...</option>
            <option value="1" key="1" >LEDGE</option>
            <option value="2" key="2" >C-LEDGE</option>
            
            </select>   
            <hr /><br />
            <div className="modal-footer" style={{paddingTop:"0px",paddingBottom:"5px",display:"block", textAlign:"right"}}>
            <button type="button" className="btn btn-success" onClick={() => {this.UpdateRemark()}}>Update</button>
            </div>   
          </div>   
         <br />

      </div>          

    )
    
  }
}

const mapStateToProps = state => (
  {
    ledgeType: state.config.currentItem.ledgeType,
  }
);

export default connect(
  mapStateToProps,
  {updateLedge},
  null
)(RemarksLedge);
