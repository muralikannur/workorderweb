import React, { Component} from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { REMARKS, EB_START_NUMBER, PROFILE_TYPE} from '../../constants';
import { notify_error, notify_success }  from '../../Utils/commonUtls';

class RemarksGlass extends Component {
 
  constructor(props){
    super(props);
    this.state = {
      glassWidth:70
    }
  }
  componentDidMount(){
    setTimeout(() => {
      this.updateState();
    },200
    )
  }

  updateState() {
    if(this.props.item != null && this.props.item.glassWidth != "0"){
      this.setState({ glassWidth : this.props.item.glassWidth })
    }
  }

  onChange = (e) => {
    const { value, name } = e.target;
    if(isNaN(value)) return;
    this.setState({[name]:value});
  }

  UpdateRemark(){
    if(parseInt(this.state.glassWidth) < 10){
      notify_error('Width cannot be less than 10');
      return;
    }
    
    let newItem = JSON.parse(JSON.stringify(this.props.item));
    newItem.glassWidth = this.state.glassWidth;
    let remarks = newItem.remarks;
    if(remarks.length == 0 || !remarks.includes(REMARKS.GLASS)){
      remarks.push(REMARKS.GLASS);
    }

    let items = this.props.wo.woitems.filter(i => i.itemnumber != this.props.item.itemnumber)

    items = [...items,newItem]
    this.props.saveItems(items);

    $('#btnRemarksClose').click();
  }
  render() {
    return(
      <div>
          <div>
            <h5>Border Width</h5>
            <input type="text" maxLength="3" id="glassWidth" name="glassWidth" value={this.state.glassWidth}  onChange={this.onChange} className="js-example-basic-single input-xs  w-100" />
            
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

RemarksGlass.propTypes = {
  wo: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  material: PropTypes.object.isRequired,  
  saveItems: PropTypes.func.isRequired
}


export default RemarksGlass;
