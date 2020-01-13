import React, { Component} from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { REMARKS, PROFILE_TYPE} from './../../constants';

class RemarksProfile extends Component {
 
  constructor(props){
    super(props);
    this.state = {
      profileType:0
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
      this.setState({ profileType : this.props.item.profileType })
    }
  }

  onChange = (e) => {
    const { value, name } = e.target;
    this.setState({[name]:value});
  }
  
  UpdateRemark(){
    var newItem = { ...this.props.item, profileType: this.state.profileType}
    let remarks = this.props.item.remarks;
    if(remarks.length == 0 || !remarks.includes(REMARKS.PROFILE)){
      remarks.push(REMARKS.PROFILE);
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
          {(this.props.material.profiles && this.props.material.profiles.length > 0) ? 
          <div>
            <h5>Select the Profile Type</h5>
            <select style={{width:"300px"}}  id="profileType" name="profileType" value={this.state.profileType}  onChange={this.onChange} className="js-example-basic-single input-xs  w-100">
            <option value="0" key="0" >Select...</option>
            {this.props.material.profiles.filter(p => p.type != PROFILE_TYPE.E).map( (e) => {
              return (
                <option value={e.profileNumber} key={e.profileNumber} >{e.type} - H:{e.height} - W:{e.width}</option>
              )})}
            </select>   
            <hr /><br />
            <div className="modal-footer" style={{paddingTop:"0px",paddingBottom:"5px",display:"block", textAlign:"right"}}>
            <button type="button" class="btn btn-success" onClick={() => {this.UpdateRemark()}}>Update</button>
            </div>   
          </div>
          : <div><h5>No Profiles defined</h5> <p>Define the Profiles in the Define Material section.</p> </div>    
          }      
         <br />

      </div>          

    )
    
  }
}

RemarksProfile.propTypes = {
  item: PropTypes.object.isRequired,
  wo: PropTypes.object.isRequired,
  material: PropTypes.object.isRequired,  
  saveItems: PropTypes.func.isRequired
}


export default RemarksProfile;
