import React, { Component} from 'react';
import { profileType } from '../../appConfig';
import { PROFILE_TYPE } from '../../constants';
import { notify_error } from '../../util';

class MaterialProfile extends Component {
 
    constructor(props){
        super(props);
        this.state = {
            currentItem:0,
            profiles:[]
        };
    }

    componentDidMount(){
      window.setTimeout(() => {
        this.setState({profiles:this.props.material.profiles});
      },1000)
    }
  
    componentWillReceiveProps(nextProps){
  
      if(nextProps.currentTab == 'profiles' && (nextProps.nextTab != 'profiles' && nextProps.nextTab != '')){
        if(nextProps.material.profiles != this.state.profiles){
          this.props.save(this.state.profiles)
        } else {
          this.props.save('changeTab');
        }
      }
  
      if(this.props.isCancelClicked){
        this.setState({profiles:this.props.material.profiles});
      }
    }
  
  onItemClick = (i) => {
    this.setState({currentItem:i})
  }

  isUsed = (id) => {
    if(id == 0) return false;
    if(this.props.items && this.props.items.find(i => i.profileNumber == id)){
      return true;
    }
    return false;
  }

  onChange = (e) => {
    if(this.state.currentItem == 0) return;
    const numberFields = ['height', 'width'];
    const { value, name } = e.target;

    if (numberFields.includes(name) && isNaN(value)) { return;}

    var profiles = this.state.profiles;
    var profile = profiles.find(i => i.profileNumber == this.state.currentItem);
    var newProfile = { ...profile, [name]: value}

    if(value == PROFILE_TYPE.E){
      newProfile.height = 1.3;
    } else {
      newProfile.height = 35;
    }

    profiles = profiles.filter(i => i.profileNumber != this.state.currentItem)
    profiles = [...profiles,newProfile]
    this.setState({profiles});
  }

  
  addItem = () => {
    const maxId = this.getMaxId();
    const newProfile = {
      profileNumber:maxId,
      type:'0',
      height:'',
      width:'22'
    }
    this.setState({profiles: [...this.state.profiles, newProfile], currentItem:maxId});
    //this.props.saveItems( [...this.state.woitems, newItem]);
  }

  getMaxId = () => {
    let maxId = 1;
    if(this.state.profiles.length > 0){
      let item = this.state.profiles.sort((a, b) => (a.profileNumber < b.profileNumber) ? 1 : -1).slice(0, 1);
      maxId = (item[0].profileNumber) + 1;
    }
    return maxId;
  }



  deleteItem = (i) => {
    this.setState({currentItem:i})
    setTimeout(() => {
      //TODO: check whether it is already used in the material code
      if(window.confirm('Are you sure that you want to delete the Profile # ' + i +' ??','Shape')){
        var profiles = this.state.profiles;
        if(this.isUsed(i)){
          let msg = 'WARNING! This Profile is used in the Item \n\n';
          msg += 'You cannot delete this Profile\n';
          notify_error(msg);
          return;
        }

        var newProfiles = profiles.filter(profile => profile.profileNumber != i);
        this.setState({profiles: newProfiles, currentItem:0});
      }
    },100
    )
  }


  render() {

    return(
        <div className="row">
        <div className="col-md-12 pl-md-5">
        <h3 style={{color:"#7ed321"}}>Profile <span style={{color:"#fff"}}>{this.state.currentItem}</span> </h3>
        <table className="table">
          <thead>
        <tr  style={{padding:"0px"}}>
              <th> # </th>
              <th style={{width:"30%"}}> Profile Type </th>
              <th style={{width:"30%"}}> Profile Height/Thickness </th>
              <th style={{width:"30%"}}> Edge Width  </th>
              <th style={{width:"5%"}}>  </th>

        </tr>
        </thead>
        {this.state.profiles.sort((a,b) => a.profileNumber > b.profileNumber ? 1  : -1 ).map( (profile) => {
        return (
        <tr  id={'mat-row-profile' + profile.profileNumber}  onClick={() => this.onItemClick(profile.profileNumber)} onMouseDown={() => this.onItemClick(profile.profileNumber)} onKeyDown={() => this.onItemClick(profile.profileNumber)} onFocus={() => this.onItemClick(profile.profileNumber)} style={{backgroundColor:this.isUsed(profile.profileNumber)?'yellow':'#fff'}}>
            <td>{profile.profileNumber}</td>
            <td>
                <div className="form-group" style={{marginBottom:"0px"}}>
                    <select  onChange={this.onChange} defaultValue={profile.type}  id="type" name="type" className="js-example-basic-single input-xs  w-100">
                    <option value="0">Select the Profile Type</option>
                    {profileType.map( (e) => {
                    return (
                    <option value={e} key={e} >{e}</option>
                    )})}
                    </select>
                </div>
            </td>
            <td><input type="text" className="form-control input-xs" value={profile.height} maxLength="4"  id="height"  name="height" onChange={this.onChange}  /></td>
            <td><input type="text" className="form-control input-xs" value={profile.width} maxLength="4"  id="width"  name="width" onChange={this.onChange}  /></td>
            <td>
            &nbsp;            
            <i className="remove icon-close" title="Remove" style={{color:"red", cursor:"pointer",paddingTop:"4px", display:"block", float:"right"}} onClick={()=>{this.deleteItem(profile.profileNumber)}}></i>
            </td>

        </tr>)
        })}

        </table>

        <span id="btnAddItem" className="btn btn-xs btn-rounded btn-outline-success mr-2" style={{cursor:"pointer", margin:"5px", fontWeight:"bold"}} onClick={()=>{this.addItem()}}>Add Profile</span>


        </div>
      </div>
    )
    
  }
}


export default MaterialProfile;
