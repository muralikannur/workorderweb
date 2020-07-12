import React, { PureComponent} from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import { notify_error } from '../../Utils/commonUtls';

import { updateGlass } from './remarksActions';


class RemarksGlass extends PureComponent {
 
  UpdateRemark(){
    let value = $('#glassWidth').val();
    if(value == '' || isNaN(value)){
      notify_error('Incorrect Glass Width');
      return;
    }
    this.props.updateGlass(value);
    $('#btnRemarksClose').click();
  }
  render() {
    return(
      <div>
          <div>
            <h5>Border Width</h5>
            <input type="text" maxLength="3" id="glassWidth" name="glassWidth"  defaultValue={this.props.glassWidth} className="js-example-basic-single input-xs  w-100" />
            
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
    glassWidth: state.config.currentItem.glassWidth,
  }
);

export default connect(
  mapStateToProps,
  {updateGlass},
  null
)(RemarksGlass);
