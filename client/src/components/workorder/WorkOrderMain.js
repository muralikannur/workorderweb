import React, { Component} from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NavLink, Link } from "react-router-dom";

import { WO_STATUS,PATTERN_CODE, PATTERN_TYPE } from './../../constants';

import { REMARKS, PROFILE_TYPE, EB_START_NUMBER} from './../../constants';
import { notify_error, notify_success, isEmptyOrSpaces }  from '../../Utils/commonUtls';
import { setDoubleThick, getPatternBoardSize, setPatternLaminateSize }  from '../../Utils/remarksUtils';

//Components
import WorkOrderItems from './WorkOrderItems';
import WorkOrderPreview from './WorkOrderPreview';
import MaterialMain from '../materials/MaterialMain';

//Actions
import { clearErrors } from '../../actions/errorActions';
import { saveWorkOrder } from './woActions';
import { getMaterial, clearMaterial, saveMaterial, copyMaterial } from '../materials/materialActions';
import { saveItems, clearWorkOrder } from './woActions';
import { setCurrentItem, setCurrentRemark, setMaterialTab } from '../../actions/configActions';
import { updateWorkOrderList } from './woActions';

import { downloadCuttingList } from '../../Utils/ExcelUtils';

class WorkOrderMain extends Component {

  constructor(props){
    super(props);
    this.state = {
      originalItems : [],
      originalMaterials : {}
    }
  }

  componentDidMount(){
    this.props.clearErrors();

    console.log('workorder main mount');

    //CONFIRM EXIT WHEN THERE ARE UNSAVED CHANGES
    this.unblock = this.props.history.block(targetLocation => {
      if(JSON.stringify(this.state.originalItems) !== JSON.stringify(this.props.wo.woitems)){
        if(!window.confirm('There are changes made to Items. Are you sure you want to leave this page?')){
          return false;
        }
      }


      return true;

    });

    setTimeout(() => {
      this.setState({originalItems:this.props.wo.woitems});
    },1000);
  }

  componentWillReceiveProps(newProps) {
    console.log('LIFECYCLE: Workorder Main - componentWillReceiveProps');
    if (newProps.wo.status != this.props.wo.status) {
      window.setTimeout(() => {
        this.disableEdit(newProps.wo.status);
      },100)
      
    }
  }

  componentWillUnmount() {
    this.unblock();
  }

  submitWorkOrder = () => {
    //NO ITEMS ADDED
    if(this.props.wo.woitems.length == 0){
      notify_error('No items added');
      return false;
    }
    if(!this.validate()){return;}
    if(window.confirm('Are you sure that you have entered all the items and ready to Submit the Work Order?')){
      this.props.saveWorkOrder({...this.props.wo,status:WO_STATUS.SUBMITTED});
      this.setState({originalItems:this.props.wo.woitems});
    }
  }

  deleteWorkOrder = () =>{
    if(window.confirm('Do you want to Delete this Work Order?')){
      this.props.saveWorkOrder({...this.props.wo,status:WO_STATUS.DELETED});
      this.props.updateWorkOrderList(this.props.wo.wonumber,WO_STATUS.DELETED);      
      const { history } = this.props;
      if(history) history.push('/wolist');
    }
  }

  restoreWorkOrder = () =>{
    if(window.confirm('Do you want to Restore this Work Order?')){
      this.props.saveWorkOrder({...this.props.wo,status:WO_STATUS.NEW});
      this.props.updateWorkOrderList(this.props.wo.wonumber,WO_STATUS.NEW);
      const { history } = this.props;
      if(history) history.push('/wolist');
    }
  }

  saveWorkOrder = (resetOriginalItems = false) => {
    if(!this.validate()){return false;}
    this.props.saveWorkOrder(this.props.wo, resetOriginalItems);
    if(resetOriginalItems){
      this.setState({originalItems:this.props.wo.woitems});
    }
    return true;
  }

  saveToExcel = () => {
    //NO ITEMS ADDED
    if(this.props.wo.woitems.length == 0){
      notify_error('No items added');
      return false;
    }
    if(!this.validate()){return false;}
    downloadCuttingList(this.props.wo, this.props.material);
  }  

  cancelItems = () => {
    if(window.confirm('Are you sure that you want to cancel all the changes made in Work Order Items since last Save?')){
      this.props.saveWorkOrder({...this.props.wo,woitems:this.state.originalItems},true);
    }
  }

  resetMaterialChanges = () => {
    if(window.confirm('Changes made in this Material Definition Window, since last Save, will be cancelled. Are you sure?')){
      this.props.getMaterial(this.props.wo._id);
    }
  }

  disableEdit = (status) => {
    if(status == WO_STATUS.SUBMITTED || status == WO_STATUS.DELETED){
      $("#order-listing").find("*").attr("disabled", "disabled");
      $('td:nth-child(12),th:nth-child(12)').hide();
      $('#btnAddItem').hide();
      $('#btnSaveWO').hide();
      $('#btnSubmitWO').hide();
      $('#btnMaterial').hide();
      $('#btnExport').hide();
    }

    if(status == WO_STATUS.DELETED){
      $('#btnRestore').show();
      $('#btnDelete').hide();
    } else {
      $('#btnRestore').hide();
      $('#btnDelete').show();
    }
  }

  highlightError = (errItems) => {
    errItems.map(e => {$('#item-row-' + e).css("background-color","#FF9999")});
  }



  validate = () => {



    //Exclude Pattern Main item (code=100) in validaton
    let items = this.props.wo.woitems;

    items.map(e => {$('#item-row-' + e.itemnumber).css("background-color","#fff")});

    //MATERIAL NOT SELECTED
    let errItems = items.filter(i => i.code == 0).map(i => i.itemnumber);
    if(errItems.length > 0){
      this.highlightError(errItems);
      notify_error("Material not selected for the following items..\n" + errItems.join());
      return false;
    }

    //INCORRECT HEIGHT
    errItems = items.filter(i => ( i.code != PATTERN_CODE &&  (i.height == '' || isNaN(i.height) || i.height < 1 ))).map(i => i.itemnumber);
    if(errItems.length > 0){
      this.highlightError(errItems);
      notify_error("Incorrect Height for the following items..\n" + errItems.join());
      return false;
    }

    //INCORRECT WIDTH
    errItems = items.filter(i => (i.width == '' || isNaN(i.width) || i.width < 1 || i.width > 3000)).map(i => i.itemnumber);
    if(errItems.length > 0){
      this.highlightError(errItems);
      notify_error("Incorrect Width for the following items..\n" + errItems.join());
      return false;
    }

    //HEIGHT exceeds the limit
    errItems = items.filter(i => ( i.code != PATTERN_CODE && i.parentId == 0 && i.height > this.props.material.boards.find(b => b.boardNumber = (this.props.material.materialCodes.find(mc => mc.materialCodeNumber == i.code).board)).height)).map(i => i.itemnumber);
    if(errItems.length > 0){
      this.highlightError(errItems);
      notify_error("Item Height is more than the Board Height for the following items..\n" + errItems.join());
      return false;
    }

    //WIDTH exceeds the limit
    errItems = items.filter(i => (i.code != PATTERN_CODE && i.parentId == 0 && i.width > this.props.material.boards.find(b => b.boardNumber = (this.props.material.materialCodes.find(mc => mc.materialCodeNumber == i.code).board)).width)).map(i => i.itemnumber);
    if(errItems.length > 0){
      this.highlightError(errItems);
      notify_error("Item Width is more than the Board Board for the following items..\n" + errItems.join());
      return false;
    }

    //INCORRECT QUANTITY
    errItems = items.filter(i => (i.quantity == '' || isNaN(i.quantity) || i.quantity < 1 )).map(i => i.itemnumber);
    if(errItems.length > 0){
      this.highlightError(errItems);
      notify_error("Incorrect Quantity for the following items..\n" + errItems.join());
      return false;
    }

    //************ REMARKS ***********************/
    let isValid = true;
    // DOUBLE THICK
    
    let itemsWithDblThick = items.filter(i => ( i.parentId == 0 && i.doubleThickWidth != 0 ));
    if(itemsWithDblThick.length > 0){
        itemsWithDblThick.map(i => {
          let child1 = items.find(c => ( c.parentId == i.itemnumber && c.childNumber == 1 ));
          let child2 = items.find(c => ( c.parentId == i.itemnumber && c.childNumber == 2 ));
          if(!setDoubleThick(i.doubleThickSides,i,child1,child2,i.doubleThickWidth)) {
            notify_error('Error while setting Double Thick for Item #' + i.itemnumber);
            isValid = false;
            return;
          }
        })
        if(!isValid) return false;
    }

    //UPDATE REMARKS - PATTERN
    
    let itemsWithPattern = items.filter(i => ( i.parentId == 0 && i.code == PATTERN_CODE ));
    if(itemsWithPattern.length > 0){
      itemsWithPattern.map(i => {
          if(i.patternType == PATTERN_TYPE.HORIZONTAL){
            let expectedSize = getPatternBoardSize(i, this.props.material.edgebands);
            let patternBoard = items.find(c => ( c.parentId == i.itemnumber && c.childNumber == 1 ));
            if(expectedSize.height != patternBoard.height || expectedSize.width != patternBoard.width){
              notify_error('Please correct the Pattern size of Item #' + i.itemnumber);
              isValid = false;
              return;
            }

            // let patterLaminates = items.filter(c => ( c.parentId == i.itemnumber && c.childNumber != 1 ));
            // patterLaminates.map((p,index) => {
            //   const  {height, width} = getPatternLaminateSize(i,this.props.material.edgebands, p,patterLaminates.length, i.patternType);
            //   if(p.height !== height && p.width !== width){
            //     notify_error('Please correct the Pattern Laminate size of Item #' + i.itemnumber);
            //     isValid = false;
            //     return;
            //   }
            // })  
          }

        })
        if(!isValid) return false;
    }    
    

    return true;
  }




  toLoginPage = () => {
    const { history } = this.props;
    if(history) history.push('/login');
  }

  render() {

    if(!this.props.isAuthenticated) this.toLoginPage();

    if(!this.props.wo ) return(<h4>Click on "Create New Work Order" button to create Work Order </h4>)

    let {isAuthenticated, item, saveWorkOrder, getMaterial, ...woItemsProps} = this.props; // eslint-disable-line

    return(
      <div className="content-wrapper" style={{margin:"2px", maxWidth:"100%", paddingTop:"0px"}}>
          <ToastContainer />

        <div className="modal fade" id="materialModal" tabIndex="-1" role="dialog" aria-labelledby="materialModalLabel"  data-backdrop="static" data-keyboard="false">
          <div className="modal-dialog modal-lg mt-0" >
            <div className="modal-content" style={{marginTop:"10px", zIndex:2}} >
              <div className="modal-header" style={{paddingTop:"2px",paddingBottom:"0px"}}>
                <table style={{width:"100%"}}>
                  <tr>
                    <td style={{width:"600px"}}>
                    <h5 className="modal-title">Material Definition for Work Order {this.props.wo.wonumber}</h5>
                    </td>

                    <td  style={{textAlign:"right"}}>
                    <button id="btnCloseMaterialPopup" type="button" className="btn btn-light" data-dismiss="modal"> Back to Items <i className="icon-login"></i> </button>
                    </td>
                  </tr>
                </table>
                  
              </div>
              <div className="modal-body" style={{paddingBottom:"0px"}}>
                <MaterialMain materialTab={this.props.materialTab} items={this.props.wo.woitems} material={this.props.material} wolist={this.props.wolist} woId={this.props.wo._id} />
              </div>
            </div>
          </div>
        </div>

        <nav className="navbar horizontal-layout col-lg-12 col-12 p-0">
        <div className="nav-bottom">
          <div style={{marginLeft:"0px", width:"100%"}}>
          <div data-spy="affix" data-offset-top="90">
              <table style={{width:"100%", color:"#439aff", borderBottom:"#ccc 1px solid"}}>
                <tbody>
                <tr>
                  <td ><div style={{color:"#439aff", fontFamily:"Verdana", fontSize:"26px", padding:"5px", fontWeight:"bold"}}>{this.props.wo.wonumber}</div> </td>
                    <td style={{ textAlign: "right" }}>
                    <button type="button" id="btnMaterial" className="btn btn-primary btn-sm" data-toggle="modal" data-target="#materialModal">Define Materials</button>
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    <button id="btnSaveWO" type="button" className="btn btn-success" style={{lineHeight:"1px"}} onClick={() => {this.saveWorkOrder(true);}}><i className="icon-doc" ></i>Save</button>
                    &nbsp; &nbsp;
                    {/* <button id="btnSubmitWO" type="button" className="btn btn-secondary"  style={{lineHeight:"1px"}} onClick={() => {this.submitWorkOrder();}}><i className="icon-notebook" ></i>Submit</button>
                    &nbsp; &nbsp; */}
                        
                    <button id="btnExport" type="button" className="btn btn-primary"  style={{lineHeight:"1px"}} onClick={() => {this.saveToExcel();}}><i className="icon-grid" ></i>Download</button>
                    &nbsp; &nbsp;    

                     <button id="btnDelete" type="button" className="btn btn-danger"  style={{lineHeight:"1px"}} onClick={() => {this.deleteWorkOrder();}}><i className="icon-close" ></i>Delete</button>
                     <button id="btnRestore" type="button" className="btn btn-success"  style={{lineHeight:"1px"}} onClick={() => {this.restoreWorkOrder();}}><i className="icon-reload" ></i>Restore</button>
                    &nbsp; &nbsp;                      &nbsp; &nbsp;        



                  </td>
                  <td >
                    <nav>
                    <NavLink to="/wolist" className="nav-link"><i className="link-icon icon-list"></i> &nbsp; <span className="menu-title">Work Orders</span></NavLink>
                    </nav>
                
                  </td>
                  <td>
                    <nav>
                    <NavLink to="/customerlist" className="nav-link"><i className="link-icon icon-people"></i> &nbsp; <span className="menu-title">Customers</span></NavLink>
                    </nav>                      
                  </td>


                </tr>
                </tbody>
              </table>
          </div>

          </div>
        </div>
        </nav>


        <div className="row">


          <div className="col-md-9 grid-margin stretch-card" data-spy="affix" data-offset-top="90" >
            <div className="card">
              <WorkOrderItems {...woItemsProps} setMaterialTab={this.props.setMaterialTab} validate={this.validate} cancelItems={this.cancelItems} saveWorkOrder={this.saveWorkOrder} />
            </div>
          </div>
          
          <div className="col-md-3 grid-margin container-fluid" >
          {/* style={{position:"fixed",zIndex:"1050", margin:"0 auto", right:"0"}} */}
            <WorkOrderPreview item={this.props.item} material={this.props.material} clearErrors={this.props.clearErrors} />
          </div>
        </div>

      </div>
    )
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  wo: state.wo,
  material: state.material,
  item: state.config.currentItem,
  materialTab:state.config.materialTab,
  currentRemark:state.config.currentRemark,
  wolist: state.wolist,

});

export default connect(
  mapStateToProps,
  {clearErrors, saveWorkOrder, getMaterial, saveItems, setCurrentItem, setCurrentRemark, setMaterialTab, updateWorkOrderList}
)(WorkOrderMain);
