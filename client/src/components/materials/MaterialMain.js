import React, { Component} from 'react';
import { connect } from 'react-redux';

import $ from 'jquery';

import { hasDuplicate, isEmptyOrSpaces, notify_error, notify_success } from '../../util';
import { uniqueKeys } from '../../appConfig';
import { PROFILE_TYPE, EB_START_NUMBER } from '../../constants';

//Components
import  MaterialBoard  from './MaterialBoard';
import  MaterialLaminate  from './MaterialLaminate';
import  MaterialCode  from './MaterialCode';
import  MaterialProfile  from './MaterialProfile';
import  MaterialEdgeBand  from './MaterialEdgeBand';

//Actions
import { saveBoards, saveLaminates, saveMaterialEdgeBands, saveProfiles, saveMaterialCodes, saveMaterial } from '../../actions/materialActions';

class MaterialMain extends Component {

  constructor(props){
    super(props);
    this.state = {
        currentTab:'tab-board',
        tabClicked:'tab-board',
        isSaveClicked:false
    };
  }


  onTabChange = (e) => {
    if(this.state.currentTab == e.target.id) return;
    this.setState({tabClicked:e.target.id})
  }

  saveAllMaterials = () => {
    this.setState({isSaveClicked:true})    
  }

  save = (type,data) => {

    //notify_success(type + ' - ' + data.length);

    if(this.state.isSaveClicked) {
      this.setState({isSaveClicked:false})
    }

    switch(type){
      case 'board':
        if(!this.validateBoards(data)) return false;
        break;
      case 'laminate':
          if(!this.validateLaminates(data)) return false;
          break;
      case 'edgeband':
          if(!this.validateEdgeBands(data)) return false;
          break;     
      case 'profile':
          if(!this.validateProfiles(data)) return false;
          break;             
      case 'materialcode':
          if(!this.validateMaterialCodes(data)) return false;
          break;           
    }
    
    this.setState({currentTab:this.state.tabClicked})

    //this.props.saveMaterial(this.props.material);

    setTimeout(() => {
      this.props.saveMaterial(this.props.material);
    },100)

    if(this.state.isSaveClicked) {
      notify_success('Materials Definition Saved.');
      //$('#btnCloseMaterialPopup').click();
    }
    return true;
  }


  validateBoards = (boards) => {


    if(boards.length > 0){

      //CHECK DUPLICATE ITEMS
      if (hasDuplicate(boards, uniqueKeys.board)) {
        notify_error("There are duplicate entries in the Boards. Please verify.");
        return false;
      }

      //TYPE NOT SELECTED
      let errItems = boards.filter(i => i.type == "0");
      if(errItems.length > 0){
        notify_error("Type not selected for the board");
        return false;
      }

      //HEIGHT NOT GIVEN
      errItems = boards.filter(i => isEmptyOrSpaces(i.height)).map(i => i.type);
      if(errItems.length > 0){
        notify_error("Height not given for the following board(s)..\n" + errItems.join());
        return false;
      }
      //WIDTH NOT GIVEN
      errItems = boards.filter(i => isEmptyOrSpaces(i.width)).map(i => i.type);
      if(errItems.length > 0){
        notify_error("Width not given for the following board(s)..\n" + errItems.join());
        return false;
      }
      //THICKNESS NOT GIVEN
      errItems = boards.filter(i => isEmptyOrSpaces(i.thickness)).map(i => i.type);
      if(errItems.length > 0){
        notify_error("Thickness not given for the following board(s)..\n" + errItems.join());
        return false;
      }
    }
    
    this.props.saveBoards(boards)
    return true;
  }
  
  validateLaminates = (laminates) => {

    if(laminates.length > 0){

      //CHECK DUPLICATE ITEMS
      if (hasDuplicate(laminates, uniqueKeys.laminate)) {
        notify_error("There are duplicate items. Please verify.");
        return false;
      }
      //CODE NOT GIVEN
      let errItems = laminates.filter(i => isEmptyOrSpaces(i.code));
      if(errItems.length > 0){
        notify_error("Please select the Code/Shade for the laminate");
        return false;
      }

      //GRAINS NOT SELECTED
      errItems = laminates.filter(i => isEmptyOrSpaces(i.grains));
      if(errItems.length > 0){
        notify_error("Please select the Grains for the laminate");
        return false;
      }

      //THICKNESS NOT GIVEN
      errItems = laminates.filter(i => isEmptyOrSpaces(i.thickness) || isNaN(i.thickness)).map(i => i.code);
      if(errItems.length > 0){
        notify_error("Incorrect or No Thickness given for the following laminate(s)..\n" + errItems.join());
        return false;
      }
    }

    this.props.saveLaminates(laminates);
    return true;
  }

  validateEdgeBands = (materialEdgeBands) => {

    //CHECK DUPLICATE ITEMS
    if (hasDuplicate(materialEdgeBands, uniqueKeys.edgebands)) {
      notify_error("There are duplicate entries in EdgeBands. Please verify.");
      return false;
    }

    //NOTHING SELECTED
    let errItems = materialEdgeBands.filter(i => i.laminate == '0' ||  i.eb_thickness == 0 ||  i.eb_width == 0 ).map(i => i.materialEdgeBandNumber);
    if(errItems.length > 0){
      notify_error("Thickness/Width not selected for the Edge Band");
      return false;
    }

    //EB THICKNESS .45 SHOULD HAVE ONLY 22 WIDTH
    errItems = materialEdgeBands.filter(i => i.eb_thickness == 0.45 &&  i.eb_width != 22).map(i => i.materialEdgeBandNumber);
    if(errItems.length > 0){
      notify_error("Edge Band with .45 thick should be of 22 width. Error in following Item.. \n" + errItems.join());
      return false;
    }

    this.props.saveMaterialEdgeBands(materialEdgeBands);
    return true;
  }

 
  validateProfiles = (profiles) => {

    //CHECK DUPLICATE ITEMS
    if (hasDuplicate(profiles, uniqueKeys.profile)) {
      notify_error("There are duplicate items. Please verify.");
      return false;
    }

    //TYPE NOT SELECTED
    let errItems = profiles.filter(i => i.type == "0");
    if(errItems.length > 0){
      notify_error("Please select the Type of the Profile" + errItems.join());
      return false;
    }

    this.props.saveProfiles(profiles);

    //If Edge Profile Save it in EdgeBands as well
    let profileEdgeBands = [];
    profiles.forEach(profile => {
      if(profile.type == PROFILE_TYPE.E){
        let newEdgeBand = {
          materialEdgeBandNumber:this.getMaxEdgeBandId(),
          laminate: EB_START_NUMBER.PROFILE + parseInt(profile.profileNumber),
          eb_thickness:profile.height,
          eb_width:profile.width,
        };
        profileEdgeBands.push(newEdgeBand);
      }
    });

    if(profileEdgeBands.length > 0){
      let allEdgeBands = [...this.props.material.edgebands, ...profileEdgeBands];
      this.props.saveMaterialEdgeBands(allEdgeBands);
    } 
    return true;
  }

  
  validateMaterialCodes = (materialCodes) => {

    //NOTHING SELECTED
    let errItems = materialCodes.filter(i => i.board == "0" && i.front_laminate == "0" && i.back_laminate == "0");
    if(errItems.length > 0){
      notify_error("Select any of the Board/Laminate combination.");
      return false;
    }
    
    //CHECK DUPLICATE ITEMS
    if (hasDuplicate(materialCodes, uniqueKeys.materialCode)) {
      notify_error("There are duplicate items. Please verify.");
      return false;
    }

    //BOTH BOARD AND LAMINATE SHOULD NOT HAVE GRAINS
    // errItems = materialCodes.filter(i => (i.board != "0" && i.front_laminate != "0") && this.props.material.boards.find(b => b.boardNumber == i.board).grains != "0");
    // if(errItems.length > 0){
    //   notify_error("Incorrect Board/Laminate combination. Board has built-in laminate." );
    //   return false;
    // }

    this.props.saveMaterialCodes(materialCodes);
    return true;
  }


  getMaxEdgeBandId = () => {
    let maxId = 1;
    if(this.props.material.edgebands.length > 0){
      let item = this.props.material.edgebands.sort((a, b) => (a.materialEdgeBandNumber < b.materialEdgeBandNumber) ? 1 : -1).slice(0, 1);
      maxId = (item[0].materialEdgeBandNumber) + 1;
    }
    return maxId;
  }


  render() {
    return(
      <div className="col-md-12 grid-margin stretch-card">
      
      <div className="card">
        <div className="card-body">
          <div id="tabs" className="row ml-md-0 mr-md-0 vertical-tab tab-minimal">
            <ul className="nav nav-tabs col-md-2 " role="tablist">

              <li className="nav-item">
                <a className="nav-link" 
                  style={{fontWeight:"bold",color:`${this.state.currentTab == "tab-board" ? "teal":"grey"}`}}  
                  onClick={(e) => this.onTabChange(e)} 
                  id="tab-board" 
                  href="#" 
                  data-toggle="tab" 
                  role="tab" 
                  aria-controls="board" 
                  aria-selected="true">
                    <i className="icon-screen-tablet"></i>Board
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link"  
                  style={{fontWeight:"bold",color:`${this.state.currentTab == "tab-laminate" ? "teal":"grey"}`}}  
                  onClick={(e) => this.onTabChange(e)}  
                  id="tab-laminate" 
                  href="#" 
                  data-toggle="tab"  
                  role="tab" 
                  aria-controls="laminate" 
                  aria-selected="false">
                  <i className="icon-calendar"></i>Laminate
                </a>
              </li>

              <li className="nav-item">
                <a  className="nav-link"  
                style={{fontWeight:"bold",color:`${this.state.currentTab == "tab-edgeband" ? "teal":"grey"}`}}  
                onClick={(e) => this.onTabChange(e)}  
                id="tab-edgeband" 
                data-toggle="tab" 
                href="#" 
                role="tab" 
                aria-controls="edgeband" 
                aria-selected="false">
                  <i className="icon-control-pause"></i>Edge Band
                </a>
              </li>  

              <li className="nav-item">
                <a className="nav-link"  
                style={{fontWeight:"bold",color:`${this.state.currentTab == "tab-profile" ? "teal":"grey"}`}}  
                onClick={(e) => this.onTabChange(e)} 
                id="tab-profile" 
                data-toggle="tab" 
                href="#" 
                role="tab" 
                aria-controls="profile" 
                aria-selected="false">
                  <i className="icon-drawer"></i>Profile
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link"  
                style={{fontWeight:"bold",color:`${this.state.currentTab == "tab-materialcode" ? "teal":"grey"}`}} 
                onClick={(e) => this.onTabChange(e)}  
                id="tab-materialcode" 
                data-toggle="tab" 
                href="#" 
                role="tab" 
                aria-controls="materialcode" 
                aria-selected="false">
                  <i className="icon-list"></i>X Y Combination
                </a>
              </li>
              <li>
                <br />
                <div>
                  <button type="button" className="btn btn-success" onClick={()=>{this.saveAllMaterials()}}>Save All Changes</button> &nbsp; 
                </div>
              </li>
            </ul>
            <div className="tab-content col-md-10">
              <div className={`tab-pane fade ${this.state.currentTab == "tab-board" && "show active"}`} id="board" role="tabpanel" aria-labelledby="board">
                <MaterialBoard isSaveClicked={this.state.isSaveClicked} save={this.save} tabClicked={this.state.tabClicked} material={this.props.material}/>
              </div>
              <div className={`tab-pane fade ${this.state.currentTab == "tab-laminate" && "show active"}`} id="laminate" role="tabpanel" aria-labelledby="laminate">
                <MaterialLaminate isSaveClicked={this.state.isSaveClicked}  save={this.save} tabClicked={this.state.tabClicked} material={this.props.material}  />
              </div>
              <div className={`tab-pane fade ${this.state.currentTab == "tab-edgeband" && "show active"}`}  id="edgeband" role="tabpanel" aria-labelledby="edgeband">
                  <MaterialEdgeBand isSaveClicked={this.state.isSaveClicked}   save={this.save} tabClicked={this.state.tabClicked} material={this.props.material} items={this.props.woitems} />
              </div>  
              <div className={`tab-pane fade ${this.state.currentTab == "tab-profile" && "show active"}`}  id="profile" role="tabpanel" aria-labelledby="profile">
                  <MaterialProfile isSaveClicked={this.state.isSaveClicked}   save={this.save} tabClicked={this.state.tabClicked} material={this.props.material} />
              </div>
              <div className={`tab-pane fade ${this.state.currentTab == "tab-materialcode" && "show active"}`}  id="materialcode" role="tabpanel" aria-labelledby="materialcode">
                  <MaterialCode isSaveClicked={this.state.isSaveClicked}   save={this.save} tabClicked={this.state.tabClicked} material={this.props.material} items={this.props.woitems}  />
              </div>
            
            </div>
          </div>

        </div>
      </div>

    </div>
    )
  }
}

export default connect(
  null,
  {saveBoards, saveLaminates, saveMaterialEdgeBands,  saveProfiles, saveMaterialCodes, saveMaterial}
)(MaterialMain);
