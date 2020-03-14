import React, { Component} from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { WO_STATUS,PATTERN_CODE } from './../../constants';

import { REMARKS, PROFILE_TYPE, EB_START_NUMBER} from './../../constants';
import { notify_error, notify_success, isEmptyOrSpaces }  from '../../Utils/commonUtls';
import { setDoubleThick }  from '../../Utils/remarksUtils';

//Components
import WorkOrderItems from './WorkOrderItems';
import WorkOrderPreview from './WorkOrderPreview';
import MaterialMain from '../materials/MaterialMain';

//Actions
import { clearErrors } from '../../actions/errorActions';
import { saveWorkOrder } from './woActions';
import { getMaterial, clearMaterial } from '../materials/materialActions';
import { saveItems, clearWorkOrder } from './woActions';
import { setCurrentItem, setCurrentRemark, setMaterialTab } from '../../actions/configActions';
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
      this.disableEdit(newProps.wo.status);
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
    if(status == WO_STATUS.SUBMITTED){
      $("#order-listing").find("*").attr("disabled", "disabled");
      $('td:nth-child(12),th:nth-child(12)').hide();
      $('#btnAddItem').hide();
      $('#btnSaveWO').hide();
      $('#btnSubmitWO').hide();
      $('#btnMaterial').hide();
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

    //UPDATE REMARKS - DOUBLE THICK
    
    let itemsWithDblThick = items.filter(i => ( i.parentId == 0 && i.doubleThickWidth != 0 ));
    if(itemsWithDblThick.length > 0){
      let isValid = true;
        itemsWithDblThick.map(i => {
          let child1 = items.find(c => ( c.parentId == i.itemnumber && c.childNumber == 1 ));
          let child2 = items.find(c => ( c.parentId == i.itemnumber && c.childNumber == 2 ));
          if(!setDoubleThick(i.doubleThickSides,i,child1,child2,i.doubleThickWidth)) 
            isValid = false;
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
      <div className="content-wrapper" style={{margin:"2px", maxWidth:"100%"}}>
          <ToastContainer />

        <div className="modal fade" id="materialModal" tabIndex="-1" role="dialog" aria-labelledby="materialModalLabel"  data-backdrop="static" data-keyboard="false">
          <div className="modal-dialog modal-lg mt-0" >
            <div className="modal-content" style={{marginTop:"10px", zIndex:2}} >
              <div className="modal-header" style={{paddingTop:"2px",paddingBottom:"0px"}}>
                <h5 className="modal-title">Material Definition for Work Order {this.props.wo.wonumber}</h5>
                  <button id="btnCloseMaterialPopup" type="button" class="btn btn-light" data-dismiss="modal"> Back to Items <i class="icon-login"></i> </button>
              </div>
              <div className="modal-body" style={{paddingBottom:"0px"}}>
                <MaterialMain materialTab={this.props.materialTab} items={this.props.wo.woitems} material={this.props.material} />
              </div>
            </div>
          </div>
        </div>


        <div className="row">
          <div className="col-md-9 grid-margin stretch-card" data-spy="affix" data-offset-top="90" >
            <div className="card">
              <table style={{width:"100%", color:"#439aff", borderBottom:"#ccc 1px solid"}}>
                <tbody>
                <tr>
                  <td><h2><span style={{color:"#439aff", fontFamily:"Open Sans", margin:"20px"}}>{this.props.wo.wonumber}</span> &nbsp; <label className="badge badge-warning" style={{lineHeight:"1em", fontSize:"10px"}}>{this.props.wo.status}</label></h2></td>
                    <td style={{ textAlign: "right" }}>
                    <button type="button" id="btnMaterial" className="btn btn-primary btn-sm" data-toggle="modal" data-target="#materialModal">Define Materials</button>
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    <button id="btnSaveWO" type="button" className="btn btn-success" style={{lineHeight:"1px"}} onClick={() => {this.saveWorkOrder(true);}}><i className="icon-doc" ></i>Save</button>
                    &nbsp; &nbsp;
                    <button id="btnSubmitWO" type="button" className="btn btn-secondary"  style={{lineHeight:"1px"}} onClick={() => {this.submitWorkOrder();}}><i className="icon-notebook" ></i>Submit</button>
                    &nbsp; &nbsp;
                    <button id="btnExport" type="button" className="btn btn-primary"  style={{lineHeight:"1px"}} onClick={() => {this.saveToExcel();}}><i className="icon-grid" ></i>Download</button>
                    &nbsp; &nbsp;                    
                  </td>
                </tr>
                </tbody>
              </table>
              <WorkOrderItems {...woItemsProps} setMaterialTab={this.props.setMaterialTab} validate={this.validate} cancelItems={this.cancelItems} saveWorkOrder={this.saveWorkOrder} />
            </div>
          </div>
          <div className="col-md-3 grid-margin">
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
  currentRemark:state.config.currentRemark

});

export default connect(
  mapStateToProps,
  {clearErrors, saveWorkOrder, getMaterial, saveItems, setCurrentItem, setCurrentRemark, setMaterialTab}
)(WorkOrderMain);
