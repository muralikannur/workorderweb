import React, { PureComponent} from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';

import { updateShape } from './remarksActions';

class RemarksShape extends PureComponent {

  UpdateRemark(){
    let value = $('#shapeDetails').val();
    this.props.updateShape(value);
    $('#btnRemarksClose').click();
  }

  render() {
    console.log('Shape - render');
    return(
      <div>
          <div>
            <h5>Shape Details</h5>
            <input type="text" id="shapeDetails" name="shapeDetails" defaultValue={this.props.shapeDetails}  className="js-example-basic-single input-xs  w-100" />
            
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
    shapeDetails: state.config.currentItem.shapeDetails,
  }
);

export default connect(
  mapStateToProps,
  {updateShape},
  null
)(RemarksShape);
