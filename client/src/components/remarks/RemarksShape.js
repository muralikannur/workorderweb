import React, { Component} from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { REMARKS} from '../../constants';

class RemarksShape extends Component {
 
  constructor(props){
    super(props);
    this.state = {
      shapeDetails:80
    }
  }
  componentDidMount(){
    setTimeout(() => {
      this.updateState();
    },200
    )
  }

  updateState() {
    if(this.props.item != null && this.props.item.shapeDetails != "0"){
      this.setState({ shapeDetails : this.props.item.shapeDetails })
    }
  }

  onChange = (e) => {
    const { value, name } = e.target;
    this.setState({[name]:value});
  }

 
  UpdateRemark(){
       
    var newItem = { ...this.props.item, shapeDetails: this.state.shapeDetails}
    let remarks = this.props.item.remarks;
    if(remarks.length == 0 || !remarks.includes(REMARKS.SHAPE)){
      remarks.push(REMARKS.SHAPE);
      newItem = { ...newItem, remarks}
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
            <h5>Shape Details</h5>
            <input type="text" id="shapeDetails" name="shapeDetails" value={this.state.shapeDetails}  onChange={this.onChange} className="js-example-basic-single input-xs  w-100" />
            
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

RemarksShape.propTypes = {
  wo: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  saveItems: PropTypes.func.isRequired
}


export default RemarksShape;
