import React, { PureComponent} from 'react';
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
import WorkOrderDetails from './WorkOrderDetails';

//Actions
import { clearErrors } from '../../actions/errorActions';
import { saveWorkOrder, updateStatus, updateAddress } from './woActions';
import { getEBWidth } from './woCommonActions';
import { getMaterial, clearMaterial, saveMaterial, copyMaterial } from '../materials/materialActions';
import { saveItems, clearWorkOrder } from './woActions';
import { setCurrentItem, setCurrentRemark, setMaterialTab } from '../../actions/configActions';

import { downloadCuttingList } from '../../Utils/ExcelUtils';

class WorkOrderMain extends PureComponent {

  constructor(props){
    super(props);
    this.state = {
      originalItems : [],
      originalMaterials : {},
      billing_address:'',
      shipping_address:'',
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
      this.setState({originalItems: JSON.parse(JSON.stringify(this.props.wo.woitems))});
    },1000);
  }

  componentWillReceiveProps(newProps) {
    console.log('LIFECYCLE: Workorder Main - componentWillReceiveProps');
    if (newProps.wo.status != this.props.wo.status) {
      window.setTimeout(() => {
        this.disableEdit(newProps.wo.status);
      },100)
      
    }
    if (newProps.wo.billing_address != this.state.billing_address) {
        this.setState({billing_address:newProps.wo.billing_address});      
    }
    if (newProps.wo.shipping_address != this.state.shipping_address) {
      this.setState({shipping_address:newProps.wo.shipping_address});      
    }
    
  }

  componentWillUnmount() {
    this.unblock();
  }

  onChange = (e) => {
    const { value, name } = e.target;
    this.setState({[name]:value});
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
      this.setState({originalItems:JSON.parse(JSON.stringify(this.props.wo.woitems))});
    }
  }

  updateAddress = (address) => {
      this.props.updateAddress(
        this.props.wo._id,
        this.props.user.id, 
        address.client,
        address.billing_address1,
        address.billing_address2,
        address.billing_pin,
        address.billing_phone,
        address.billing_gst,
        address.shipping_address1,
        address.shipping_address2,
        address.shipping_pin,
        address.shipping_phone,
        address.shipping_gst,
        address.ship_to_billing
      );
  }

  restoreWorkOrder = () =>{
    if(window.confirm('Do you want to Restore this Work Order?')){
      this.props.updateStatus(this.props.wo._id, this.props.wo.wonumber, this.props.user.id, 'NEW');
      const { history } = this.props;
      if(history) history.push('/wolist');
    }
  }

  saveWorkOrder = (resetOriginalItems = false) => {
    if(!this.validate()){return false;}
    this.props.saveWorkOrder(this.props.wo, resetOriginalItems);
    if(resetOriginalItems){
      this.setState({originalItems:JSON.parse(JSON.stringify(this.props.wo.woitems))});
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
    // if(status == WO_STATUS.SUBMITTED || status == WO_STATUS.DELETED){
    //   $("#order-listing").find("*").attr("disabled", "disabled");
    //   $('td:nth-child(12),th:nth-child(12)').hide();
    //   $('#btnAddItem').hide();
    //   $('#btnSaveWO').hide();
    //   $('#btnSubmitWO').hide();
    //   $('#btnMaterial').hide();
    //   $('#btnExport').hide();
    // }

    // if(status == WO_STATUS.DELETED){
    //   $('#btnRestore').show();
    //  // $('#btnDelete').hide();
    // } else {
    //   $('#btnRestore').hide();
    // //  $('#btnDelete').show();
    // }
  }

  highlightError = (errItems) => {
    errItems.map(e => {$('#item-row-' + e).css("background-color","#FF9999")});
  }



  validate = () => {



    //Exclude Pattern Main item (code=100) in validaton
    let items = this.props.wo.woitems;
    let errItems = [];
    items.map(e => {$('#item-row-' + e.itemnumber).css("background-color","#fff")});

    //MATERIAL NOT SELECTED
    let errItemsParent = items.filter(i => i.code == 0 && i.itemnumber != 0).filter(i => i.code != PATTERN_CODE ).map(i => i.itemnumber);
    let errItemsChild = items.filter(i => i.code == 0 && i.parentId != 0).filter(i => i.code != PATTERN_CODE ).map(i => i.parentId);


    if(errItems.length > 0){
      this.highlightError(errItems);
      notify_error("Material not selected for the following items..\n" + [...errItemsParent, ...errItemsChild].join());
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
    
    let itemsWithDblThick = items.filter(i => ( i.parentId == 0 && i.remarks.includes(REMARKS.DBLTHICK)));
    if(itemsWithDblThick.length > 0){
        itemsWithDblThick.map(i => {
          let child1 = items.find(c => ( c.parentId == i.itemnumber && c.childNumber == 1 ));
          let child2 = items.find(c => ( c.parentId == i.itemnumber && c.childNumber == 2 ));
          let child3 = items.find(c => ( c.parentId == i.itemnumber && c.childNumber == 3 ));
          let child4 = items.find(c => ( c.parentId == i.itemnumber && c.childNumber == 4 ));
          if(!setDoubleThick(i.doubleThickSides,i,child1,child2,child3,child4,i.doubleThickData)) {
            notify_error('Error while setting Double Thick for Item #' + i.itemnumber);
            isValid = false;
            return;
          }

          if(i.doubleThickSides.includes('A') && (i.eb_a != 0 && this.props.getEBWidth(i.eb_a) != 45)) isValid = false;
          if(i.doubleThickSides.includes('B') && (i.eb_b != 0 && this.props.getEBWidth(i.eb_b) != 45)) isValid = false;
          if(i.doubleThickSides.includes('C') && (i.eb_c != 0 && this.props.getEBWidth(i.eb_c) != 45)) isValid = false;
          if(i.doubleThickSides.includes('D') && (i.eb_d != 0 && this.props.getEBWidth(i.eb_d) != 45)) isValid = false;

          if(!isValid) {
            notify_error('For Double Thick, edgeband width should be 45. Item #' + i.itemnumber);
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


        {/* Modal - Material Definition */}
        <div className="modal fade" id="materialModal" tabIndex="-1" role="dialog" aria-labelledby="materialModalLabel"  data-backdrop="static" data-keyboard="false">
          <div className="modal-dialog modal-lg mt-0" >
            <div className="modal-content" style={{marginTop:"10px", zIndex:2}} >
              <div className="modal-header" style={{paddingTop:"2px",paddingBottom:"0px"}}>
                <table style={{width:"100%"}}>
                  <tbody>
                  <tr>
                    <td style={{width:"600px"}}>
                    <h5 className="modal-title">Material Definition for Work Order {this.props.wo.wonumber}</h5>
                    </td>

                    <td  style={{textAlign:"right"}}>
                    <button id="btnCloseMaterialPopup" type="button" className="btn btn-light" data-dismiss="modal"> Back to Items <i className="icon-login"></i> </button>
                    </td>
                  </tr>
                  </tbody>
                </table>
                  
              </div>
              <div className="modal-body" style={{paddingBottom:"0px"}}>
                <MaterialMain woId={this.props.wo._id} />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Edit Work Order Details */}
        <WorkOrderDetails edit={true} updateAddress={this.updateAddress} user={this.props.user} wo ={this.props.wo} customerlist = {[]} wolist = {[]} createWorkOrder={this.props.createWorkOrder}/>


        <nav className="navbar horizontal-layout col-lg-12 col-12 p-0">
        <div className="nav-bottom">
          <div style={{marginLeft:"0px", width:"100%"}}>
          <div data-spy="affix" data-offset-top="90">
              <table style={{width:"100%", color:"#439aff", borderBottom:"#ccc 1px solid"}}>
                <tbody>
                <tr>
                  <td ><div style={{color:"#439aff", fontFamily:"Verdana", fontSize:"26px", padding:"5px", fontWeight:"bold"}}>{this.props.wo.wonumber}</div> </td>
                    <td style={{ textAlign: "left" }}>
                    {this.props.editMode ?
                      <div>
                        <button type="button" id="btnMaterial" className="btn btn-primary" style={{marginLeft:"20px"}}  data-toggle="modal" data-target="#materialModal">Define Materials</button>
                        <button id="btnSaveWO" type="button" className="btn btn-success" style={{lineHeight:"1px",marginLeft:"20px"}} onClick={() => {this.saveWorkOrder(true);}}><i className="icon-doc" ></i>Save</button>
                        <button id="btnExport" type="button" className="btn btn-primary"  style={{lineHeight:"1px",marginLeft:"20px"}} onClick={() => {this.saveToExcel();}}><i className="icon-grid" ></i>Download</button>
                      </div>
                    :
                      <button id="btnRestore" type="button" className="btn btn-success"  style={{lineHeight:"1px"}} onClick={() => {this.restoreWorkOrder();}}><i className="icon-reload" ></i>Restore</button>
                    }

                  </td>
                  <td style={{width:"200px"}}>

                  <button type="button"  data-toggle="modal" data-target="#newWoModal"  className="btn btn-success btn-fw"><i  className="icon-notebook"></i>Edit Address</button>

                  {/* <nav>
                    <NavLink className="nav-link" data-toggle="modal" data-target="#modalWODetails"><i className="link-icon icon-list"></i> &nbsp; <span className="menu-title">Edit Address</span></NavLink>
                    </nav> */}
                  </td>
                  <td style={{width:"200px"}}>
                    <nav>
                    <NavLink to="/wolist" className="nav-link"><i className="link-icon icon-list"></i> &nbsp; <span className="menu-title">Work Orders</span></NavLink>
                    </nav>
                
                  </td>
                  <td style={{width:"200px"}}>
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
              <WorkOrderItems {...woItemsProps} setMaterialTab={this.props.setMaterialTab} validate={this.validate} cancelItems={this.cancelItems} saveWorkOrder={this.saveWorkOrder} editMode={this.props.editMode} />
            </div>
          </div>
          
          <div className="col-md-3 grid-margin container-fluid" >
          {/* style={{position:"fixed",zIndex:"1050", margin:"0 auto", right:"0"}} */}
            <WorkOrderPreview />
          </div>
        </div>

      </div>
    )
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  wo: state.wo,
  material: state.material,
  item: state.config.currentItem,
  materialTab:state.config.materialTab,
  currentRemark:state.config.currentRemark,
  wolist: state.wolist,
  editMode: state.config.editMode
});

export default connect(
  mapStateToProps,
  {clearErrors, saveWorkOrder, getMaterial, saveItems, setCurrentItem, setCurrentRemark, setMaterialTab, updateStatus, updateAddress, getEBWidth}
)(WorkOrderMain);
