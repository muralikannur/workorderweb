import React, { Component} from 'react';
import { connect } from 'react-redux';

import $ from 'jquery';

import { hasDuplicate, isEmptyOrSpaces, notify_error, notify_success } from '../../Utils/commonUtls';
import { uniqueKeys } from '../../appConfig';
import { PROFILE_TYPE, EB_START_NUMBER } from '../../constants';

//Components
import  MaterialBoard  from './MaterialBoard';
import  MaterialLaminate  from './MaterialLaminate';
import  MaterialCode  from './MaterialCode';
import  MaterialProfile  from './MaterialProfile';
import  MaterialEdgeBand  from './MaterialEdgeBand';

//Actions
import { saveBoards, saveLaminates, saveMaterialEdgeBands, saveProfiles, saveMaterialCodes, saveMaterial } from './materialActions';

class MaterialMain extends Component {

  constructor(props){
    super(props);
    this.state = {
        currentTab:'boards',
        nextTab:'boards',
        isSaveClicked:false,
        isCancelClicked:false,
        originalMaterials:{}
    };
  }

  componentDidMount(){
    setTimeout(() => {
      this.setState({originalMaterials:this.props.material});
      if(this.props.materialTab != '')
        this.setState({nextTab:this.props.materialTab});
    },1000);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.materialTab != '' && nextProps.materialTab != this.state.currentTab)
      this.onTabChange({target:{id:nextProps.materialTab}})
  }

  onTabChange = (e) => {
    if(this.state.currentTab == e.target.id) return;
    this.setState({nextTab:e.target.id});
  }

  saveAllMaterials = () => {
    this.setState({isSaveClicked:true})
    this.setState({nextTab:'save'});    
  }

  cancelAllChanges = () => {
    if(window.confirm('Are you sure that you want to cancel all Material Definition changes you made since last Save??')){
      this.props.saveMaterial(this.state.originalMaterials, this.matCancelSuccess);
    }
  }  

  save = (data) => {

    if(data == 'changeTab'){
      if(this.state.nextTab != 'save'){
        this.setState({currentTab:this.state.nextTab, nextTab:''});
      }else{
        notify_success('Materials Definition Saved.');
        this.setState({isSaveClicked:false});
        this.setState({nextTab:''})
        this.setState({originalMaterials:this.props.material});
      }
      return;
    }

    //$('[id^=mat-row-]').css("background-color","#fff");
    $('tr').filter(function(){ return this.style && this.style.backgroundColor == 'rgb(255, 153, 153)'; }).css("background-color","#fff");

    switch(this.state.currentTab){
      case 'boards':
        if(!this.validateBoards(data)) return false;
        break;
      case 'laminates':
          if(!this.validateLaminates(data)) return false;
          break;
      case 'edgebands':
          if(!this.validateEdgeBands(data)) return false;
          break;     
      case 'profiles':
          if(!this.validateProfiles(data)) return false;
          break;             
      case 'materialCodes':
          if(!this.validateMaterialCodes(data)) return false;
          break;           
    }
    var nextTab = this.state.nextTab === 'save' ? this.state.currentTab : this.state.nextTab;
    this.setState({currentTab:nextTab, nextTab:''})

    window.setTimeout(() => {
      this.props.saveMaterial(this.props.material,this.matSaveSuccess);
    },100)


  }

  matSaveSuccess = () => {
    
    if(this.state.isSaveClicked) {
      window.setTimeout(() => {
        this.setState({originalMaterials:this.props.material});
      },100)
      
      notify_success('Materials Definition Saved.');
      this.setState({isSaveClicked:false});
    } 
  }

  matCancelSuccess = () => {
    this.setState({isCancelClicked:true}) 
    notify_success('Reverted Material Definition changes made since last Save');
    
    window.setTimeout(() => {
      this.setState({originalMaterials:this.props.material});
      this.setState({isCancelClicked:false}) ;
    },100)
    
  }  

  highlightError = (errItems, type, idName, isEB = false ) => {
    errItems.map(e => {$('#mat-row-' + type + (isEB? '-'+e.laminate +'-':'') + eval('e.' + idName)).css("background-color","#FF9999")});
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
        this.highlightError(errItems, 'board','boardNumber')
        notify_error("Type not selected for the board");
        return false;

      }

      //HEIGHT NOT GIVEN
      errItems = boards.filter(i => isEmptyOrSpaces(i.height));
      if(errItems.length > 0){
        this.highlightError(errItems,'board','boardNumber')
        notify_error("Height not given for the following board(s)..\n" + errItems.map(i => i.type).join());
        return false;
      }
      //WIDTH NOT GIVEN
      errItems = boards.filter(i => isEmptyOrSpaces(i.width));
      if(errItems.length > 0){
        this.highlightError(errItems,'board','boardNumber')
        notify_error("Width not given for the following board(s)..\n" + errItems.map(i => i.type).join());
        return false;
      }
      //THICKNESS NOT GIVEN
      errItems = boards.filter(i => isEmptyOrSpaces(i.thickness));
      if(errItems.length > 0){
        this.highlightError(errItems,'board','boardNumber')
        notify_error("Thickness not given for the following board(s)..\n" + errItems.map(i => i.type).join());
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
        this.highlightError(errItems,'laminate','laminateNumber');
        notify_error("Please select the Code/Shade for the laminate");
        return false;
      }

      //GRAINS NOT SELECTED
      errItems = laminates.filter(i => isEmptyOrSpaces(i.grains));
      if(errItems.length > 0){
        this.highlightError(errItems,'laminate','laminateNumber');
        notify_error("Please select the Grains for the laminate");
        return false;
      }

      //THICKNESS NOT GIVEN
      errItems = laminates.filter(i => isEmptyOrSpaces(i.thickness) || isNaN(i.thickness));
      if(errItems.length > 0){
        this.highlightError(errItems,'laminate','laminateNumber');
        notify_error("Incorrect or No Thickness given for the following laminate(s)..\n" + errItems.map(i => i.code).join());
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
    let errItems = materialEdgeBands.filter(i => i.laminate == '0' ||  i.eb_thickness == 0 ||  i.eb_width == 0 );
    if(errItems.length > 0){
      this.highlightError(errItems,'edgeband','materialEdgeBandNumber',true);
      notify_error("Thickness/Width not selected for the Edge Band");
      return false;
    }

    //EB THICKNESS .45 SHOULD HAVE ONLY 22 WIDTH
    errItems = materialEdgeBands.filter(i => i.eb_thickness == 0.45 &&  i.eb_width != 22);
    if(errItems.length > 0){
      this.highlightError(errItems,'edgeband','materialEdgeBandNumber',true);
      notify_error("Edge Band with .45 thick should be of 22 width. Error in following Item.. \n" + errItems.map(i => i.materialEdgeBandNumber).join());
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
      this.highlightError(errItems,'profile','profileNumber');
      notify_error("Please select the Type of the Profile" );
      return false;
    }

    //INVALID HEIGHT
    errItems = profiles.filter(i => i.height == 0);
    if(errItems.length > 0){
      this.highlightError(errItems,'profile','profileNumber');
      notify_error("Profile Height cannot be Zero" );
      return false;
    }

    //INVALID THICKNESS
    errItems = profiles.filter(i => i.width == 0);
    if(errItems.length > 0){
      this.highlightError(errItems,'profile','profileNumber');
      notify_error("Width cannot be Zero" );
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
      this.highlightError(errItems,'materialcode','materialCodeNumber');
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
                  style={{fontWeight:"bold",color:`${this.state.currentTab == "boards" ? "teal":"grey"}`}}  
                  onClick={(e) => this.onTabChange(e)} 
                  id="boards" 
                  href="#" 
                  data-toggle="tab" 
                  role="tab" 
                  aria-controls="board" 
                  aria-selected="true">
                    <i className="icon-screen-tablet"></i>Board (X)
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link"  
                  style={{fontWeight:"bold",color:`${this.state.currentTab == "laminates" ? "teal":"grey"}`}}  
                  onClick={(e) => this.onTabChange(e)}  
                  id="laminates" 
                  href="#" 
                  data-toggle="tab"  
                  role="tab" 
                  aria-controls="laminate" 
                  aria-selected="false">
                  <i className="icon-calendar"></i>Laminate (Y)
                </a>
              </li>

              <li className="nav-item">
                <a  className="nav-link"  
                style={{fontWeight:"bold",color:`${this.state.currentTab == "edgebands" ? "teal":"grey"}`}}  
                onClick={(e) => this.onTabChange(e)}  
                id="edgebands" 
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
                style={{fontWeight:"bold",color:`${this.state.currentTab == "profiles" ? "teal":"grey"}`}}  
                onClick={(e) => this.onTabChange(e)} 
                id="profiles" 
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
                style={{fontWeight:"bold",color:`${this.state.currentTab == "materialCodes" ? "teal":"grey"}`}} 
                onClick={(e) => this.onTabChange(e)}  
                id="materialCodes" 
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

                <br />
                <div>
                  <button type="button" className="btn btn-danger" onClick={()=>{this.cancelAllChanges()}}>Cancel All Changes</button> &nbsp; 
                </div>

              </li>
            </ul>
            <div className="tab-content col-md-10">
              <div className={`tab-pane fade ${this.state.currentTab == "boards" && "show active"}`} id="board" role="tabpanel" aria-labelledby="board">
                <MaterialBoard material={this.props.material} save={this.save} isCancelClicked={this.state.isCancelClicked} currentTab={this.state.currentTab} nextTab={this.state.nextTab}/>
              </div>
              <div className={`tab-pane fade ${this.state.currentTab == "laminates" && "show active"}`} id="laminate" role="tabpanel" aria-labelledby="laminate">
                <MaterialLaminate material={this.props.material} save={this.save} isCancelClicked={this.state.isCancelClicked} currentTab={this.state.currentTab} nextTab={this.state.nextTab}  />
              </div>
              <div className={`tab-pane fade ${this.state.currentTab == "edgebands" && "show active"}`}  id="edgeband" role="tabpanel" aria-labelledby="edgeband">
                  <MaterialEdgeBand  items={this.props.items} material={this.props.material} save={this.save} isCancelClicked={this.state.isCancelClicked} currentTab={this.state.currentTab} nextTab={this.state.nextTab}  />
              </div>  
              <div className={`tab-pane fade ${this.state.currentTab == "profiles" && "show active"}`}  id="profile" role="tabpanel" aria-labelledby="profile">
                  <MaterialProfile  items={this.props.items} material={this.props.material} save={this.save} isCancelClicked={this.state.isCancelClicked} currentTab={this.state.currentTab} nextTab={this.state.nextTab}  />
              </div>
              <div className={`tab-pane fade ${this.state.currentTab == "materialCodes" && "show active"}`}  id="materialcode" role="tabpanel" aria-labelledby="materialcode">
                  <MaterialCode  items={this.props.items}  material={this.props.material} save={this.save} isCancelClicked={this.state.isCancelClicked} currentTab={this.state.currentTab} nextTab={this.state.nextTab}  />
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
