import React, { Component} from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { REMARKS, PROFILE_TYPE} from '../../constants';

class RemarksLedge extends Component {
 
  constructor(props){
    super(props);
    this.state = {
      ledgeType:0
    }
  }
  componentDidMount(){
    setTimeout(() => {
      this.updateState();
    },200
    )
  }

  updateState() {
    if(this.props.item != null){
      this.setState({ ledgeType : this.props.item.ledgeType })
    }
  }

  onChange = (e) => {
    const { value, name } = e.target;
    this.setState({[name]:value});
  }
  
  UpdateRemark(){
    var newItem = { ...this.props.item, ledgeType: this.state.ledgeType}
    let remarks = this.props.item.remarks;
    if(remarks.length == 0 || !remarks.includes(REMARKS.LEDGE)){
      remarks.push(REMARKS.LEDGE);
      newItem = { ...newItem, remarks}
    }


    let items = this.props.wo.woitems.filter(i => i.itemnumber != this.props.item.itemnumber)
    items = [...items,newItem]
    this.props.saveItems(items);
    //this.props.setCurrentItem(newItem);
    $('#btnRemarksClose').click();
  }
  render() {
    return(
      <div>
          <div>
            <h5>Select the Ledge Type</h5>
            <select style={{width:"300px"}}  id="ledgeType" name="ledgeType" value={this.state.ledgeType}  onChange={this.onChange} className="js-example-basic-single input-xs  w-100">
            <option value="0" key="0" >Select...</option>
            <option value="1" key="1" >LEDGE</option>
            <option value="2" key="2" >C-LEDGE</option>
            
            </select>   
            <hr /><br />
            <div className="modal-footer" style={{paddingTop:"0px",paddingBottom:"5px",display:"block", textAlign:"right"}}>
            <button type="button" class="btn btn-success" onClick={() => {this.UpdateRemark()}}>Update</button>
            </div>   
          </div>   
         <br />

      </div>          

    )
    
  }
}

RemarksLedge.propTypes = {
  item: PropTypes.object.isRequired,
  wo: PropTypes.object.isRequired,
  material: PropTypes.object.isRequired,  
  saveItems: PropTypes.func.isRequired
}


export default RemarksLedge;
