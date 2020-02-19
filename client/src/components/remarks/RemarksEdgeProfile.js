import React, { Component} from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { REMARKS, PROFILE_TYPE, EB_START_NUMBER} from '../../constants';

class RemarksEdgeProfile extends Component {
 
  constructor(props){
    super(props);
    this.state = {
      profileNumber:0
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
      this.setState({ profileNumber : this.props.item.profileNumber })
    }
  }

  onChange = (e) => {
    const { value, name } = e.target;
    this.setState({[name]:value});
  }
  
  UpdateRemark(){
    let newItem = JSON.parse(JSON.stringify(this.props.item));
    let remarks = newItem.remarks;
    if(remarks.length == 0 || !remarks.includes(REMARKS.E_PROFILE)){
      remarks.push(REMARKS.E_PROFILE);
    }

    //If E-Profile selected, update the Item's EB sides as E-Profile's thickness
    let profile = this.props.material.profiles.find(p => p.profileNumber == this.state.profileNumber)
    if(profile && profile.type == PROFILE_TYPE.E){
      let edgeband = this.props.material.edgebands.find(eb => eb.laminate == EB_START_NUMBER.PROFILE + parseInt(this.state.profileNumber))
      if(edgeband){
        newItem.profileNumber = profile.profileNumber;
        newItem.eb_a = edgeband.materialEdgeBandNumber;
        newItem.eb_b = edgeband.materialEdgeBandNumber;
        if(newItem.profileSide != 'H') newItem.eb_c = edgeband.materialEdgeBandNumber;
        if(newItem.profileSide != 'W') newItem.eb_d = edgeband.materialEdgeBandNumber;
      }
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
          {(this.props.material.profiles && this.props.material.profiles.filter(p => p.type == PROFILE_TYPE.E).length > 0) ? 
          <div>
            <h5>Select the Profile Type</h5>
            <select style={{width:"300px"}}  id="profileNumber" name="profileNumber" value={this.state.profileNumber}  onChange={this.onChange} className="js-example-basic-single input-xs  w-100">
            <option value="0" key="0" >Select...</option>
            {this.props.material.profiles.filter(p => p.type == PROFILE_TYPE.E).map( (e) => {
              return (
                <option value={e.profileNumber} key={e.profileNumber} >{e.type} - H:{e.height} - W:{e.width}</option>
              )})}
            </select>   
            <hr /><br />
            <div className="modal-footer" style={{paddingTop:"0px",paddingBottom:"5px",display:"block", textAlign:"right"}}>
            <button type="button" class="btn btn-success" onClick={() => {this.UpdateRemark()}}>Update</button>
            </div>   
          </div>
          : <div><h5>No Edge Profiles defined</h5> <p>Define the Profiles in the Define Material section.</p> 
          </div>    
          }      

      </div>          

    )
    
  }
}

RemarksEdgeProfile.propTypes = {
  item: PropTypes.object.isRequired,
  wo: PropTypes.object.isRequired,
  material: PropTypes.object.isRequired,  
  saveItems: PropTypes.func.isRequired
}


export default RemarksEdgeProfile;
