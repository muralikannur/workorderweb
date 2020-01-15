import React, { Component} from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { WO_STATUS,PATTERN_CODE } from './../../constants';
import XLSX from 'xlsx';
import { REMARKS, PROFILE_TYPE, EB_START_NUMBER} from './../../constants';
import { notify_error, notify_success, isEmptyOrSpaces }  from '../../util';

//Components
import WorkOrderItems from './WorkOrderItems';
import WorkOrderPreview from './WorkOrderPreview';
import MaterialMain from '../materials/MaterialMain';

//Actions
import { clearErrors } from '../../actions/errorActions';
import { saveWorkOrder } from '../../actions/woActions';
import { getMaterial } from '../../actions/materialActions';
import { saveItems } from '../../actions/woActions';
import { setCurrentItem, setCurrentRemark } from '../../actions/configActions';
import { isNull } from 'util';

class WorkOrderMain extends Component {

  constructor(props){
    super(props);
    this.state = {
      originalItems : []
    }
  }

  componentDidMount(){
    this.props.clearErrors();

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

      //this.disableEdit(this.props.wo.status);

      //If no materials added, open the Define Material popup
      // if(!this.props.material.materialCodes || this.props.material.materialCodes.length < 1){
      //   $('#btnMaterial').click();
      // }
      this.setState({originalItems:this.props.wo.woitems});
    },500)
  }

  componentWillReceiveProps(newProps) {
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

  saveWorkOrder = () => {
    if(!this.validate()){return;}
    this.props.saveWorkOrder(this.props.wo);
    this.setState({originalItems:this.props.wo.woitems});
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

  validate = () => {


    // let remarkItems = this.props.wo.woitems.filter(i => i.code == 100 && !i.remarks.includes(REMARKS.PATTERN)).map(i => i.itemnumber);;
    // if(remarkItems.length > 0){
    //   notify_error("Pattern not defined for the PATTERN item.\n" + remarkItems.join());
    //   return false;
    // }

    // remarkItems = this.props.wo.woitems.filter(i => i.code != 100 && i.remarks.includes(REMARKS.PATTERN)).map(i => i.itemnumber);;
    // if(remarkItems.length > 0){
    //   notify_error("Pattern defined for a non-PATTERN item.\n" + remarkItems.join());
    //   return false;
    // }



    //Exclude Pattern Main item (code=100) in validaton
    let items = this.props.wo.woitems.filter(i => i.itemnumber != 0 && i.code != 100);

    //MATERIAL NOT SELECTED
    let errItems = items.filter(i => i.code == 0).map(i => i.itemnumber);
    if(errItems.length > 0){
      notify_error("Material not selected for the following items..\n" + errItems.join());
      return false;
    }

    //INCORRECT HEIGHT
    errItems = items.filter(i => (i.height == '' || isNaN(i.height) || i.height < 1 )).map(i => i.itemnumber);
    if(errItems.length > 0){
      notify_error("Incorrect Height for the following items..\n" + errItems.join());
      return false;
    }

    //INCORRECT WIDTH
    errItems = items.filter(i => (i.width == '' || isNaN(i.width) || i.width < 1 || i.width > 3000)).map(i => i.itemnumber);
    if(errItems.length > 0){
      notify_error("Incorrect Width for the following items..\n" + errItems.join());
      return false;
    }

    //HEIGHT exceeds the limit
    errItems = items.filter(i => ( i.code != PATTERN_CODE && i.height > this.props.material.boards.find(b => b.boardNumber = (this.props.material.materialCodes.find(mc => mc.materialCodeNumber == i.code).board)).height)).map(i => i.itemnumber);
    if(errItems.length > 0){
      notify_error("Item Height is more than the Board Height for the following items..\n" + errItems.join());
      return false;
    }

    //WIDTH exceeds the limit
    errItems = items.filter(i => (i.code != PATTERN_CODE && i.width > this.props.material.boards.find(b => b.boardNumber = (this.props.material.materialCodes.find(mc => mc.materialCodeNumber == i.code).board)).width)).map(i => i.itemnumber);
    if(errItems.length > 0){
      notify_error("Item Width is more than the Board Board for the following items..\n" + errItems.join());
      return false;
    }



    //INCORRECT QUANTITY
    errItems = items.filter(i => (i.quantity == '' || isNaN(i.quantity) || i.quantity < 1 )).map(i => i.itemnumber);
    if(errItems.length > 0){
      notify_error("Incorrect Quantity for the following items..\n" + errItems.join());
      return false;
    }
    
    return true;
  }


  downloadCuttingList = () => {

    let wb =  {
      SheetNames : [],
      Sheets : {}
    }

    let items = this.props.wo.woitems;

    if(items.length == 0){
      alert('No Items entered');
      return
    }

    let cutting_list = [];
    let printItems = [];
    let eb_list = [];


    this.props.material.edgebands.map(eb => {
      let laminateName = '';
      let count = 0;

      if(eb.laminate > EB_START_NUMBER.PROFILE){ //200
        laminateName = 'E-Profile';
      } else if(eb.laminate > EB_START_NUMBER.BOARD){ //100
        let board = this.props.material.boards.find(b => b.boardNumber ==  (parseInt(eb.laminate) - EB_START_NUMBER.BOARD) )
        laminateName = board.type;
      }else { 
        let laminate = this.props.material.laminates.find(l => l.laminateNumber ==  eb.laminate )
        laminateName = laminate.code;
      }

      let eb_a_items = this.props.wo.woitems.filter(i => !isNaN(i.eb_a) && i.eb_a == eb.materialEdgeBandNumber);
      eb_a_items.map(i => {
        count += parseInt(i.height) * parseInt(i.quantity)
      })

      let eb_b_items = this.props.wo.woitems.filter(i => !isNaN(i.eb_b) && i.eb_b == eb.materialEdgeBandNumber);
      eb_b_items.map(i => {
        count += parseInt(i.width) * parseInt(i.quantity)
      })      

      let eb_c_items = this.props.wo.woitems.filter(i => !isNaN(i.eb_c) && i.eb_c == eb.materialEdgeBandNumber);
      eb_c_items.map(i => {
        count += parseInt(i.height) * parseInt(i.quantity)
      })

      let eb_d_items = this.props.wo.woitems.filter(i => !isNaN(i.eb_d) && i.eb_d == eb.materialEdgeBandNumber);
      eb_d_items.map(i => {
        count += parseInt(i.width) * parseInt(i.quantity)
      })    


      eb_list.push({
        LAM_BOARD:laminateName,
        THICK:  parseFloat(eb.eb_thickness),
        WIDTH:  parseInt(eb.eb_width),
        LENGTH:count
      })
    })


    items.map(i => {

      let refNo = i.parentId == 0 ? i.itemnumber : i.parentId;

      let matText = this.getMaterialCode(i);

      let qty = parseInt(i.quantity);
      if(i.ledgeType != 0){
        qty *= 2;
      }

      let cutting_Height = parseInt(i.height);
      let cutting_Width = parseInt(i.width);



      if(i.doubleThickWidth == 0 && i.ledgeType == 0){
        if(this.props.material.edgebands && this.props.material.edgebands.length > 0){
          
          if(i.eb_a && !isNaN(i.eb_a) &&  i.eb_a != 0) cutting_Width -= parseFloat(this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == i.eb_a).eb_thickness);
          if(i.eb_b && !isNaN(i.eb_b) &&  i.eb_b != 0) cutting_Height -= parseFloat(this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber ==  i.eb_b).eb_thickness);
          if(i.eb_c && !isNaN(i.eb_c) &&  i.eb_c != 0) cutting_Width -= parseFloat(this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == i.eb_c).eb_thickness);
          if(i.eb_d && !isNaN(i.eb_d) &&  i.eb_d != 0) cutting_Height -= parseFloat(this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == i.eb_d).eb_thickness);
        }
      }


      if(i.profileType != 0){
        if(this.props.material.profiles){
          let profile = this.props.material.profiles.find(p => p.profileNumber == i.profileType)
          if(profile && i.profileSide == 'H')
            cutting_Width -= parseInt(profile.height);
          if(profile && i.profileSide == 'W')
            cutting_Height -= parseInt(profile.height);
        }
      }

      let remarkData = this.getRemarkData(i);

      let grains = "";

      if(i.code != PATTERN_CODE){
        let mCode = this.props.material.materialCodes.find(m => m.materialCodeNumber == i.code);
        let board = this.props.material.boards.find(b => b.boardNumber == mCode.board);
        let laminate = this.props.material.laminates.find(l => l.laminateNumber == mCode.front_laminate);
        
        if(laminate && laminate.grains != "N"){
          grains = laminate.grains;
        } else if(board){
          grains = board.grains;
        }
      }



      const customerCode = this.props.wo.wonumber.substring(0,3);

      cutting_list.push({
        RefNo:customerCode + refNo,
        Delivery:'',
        ItemType:i.itemtype,
        A_Height: parseInt(i.height),
        A_Width:parseInt(i.width),
        C_Height: Math.round(cutting_Height),
        C_Width:  Math.round(cutting_Width),
        Qty:qty,
        Code:i.code,
        Grains: (grains == "H" || grains == "V" ? 'yes':'no'),
        EB_A:(i.eb_a != undefined && !isNaN(i.eb_a) && i.eb_a != 0) ? this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == i.eb_a).eb_thickness : 0,
        EB_B:(i.eb_b != undefined && !isNaN(i.eb_b) &&  i.eb_b != 0) ? this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == i.eb_b).eb_thickness : 0,
        EB_C:(i.eb_c != undefined && !isNaN(i.eb_c) &&  i.eb_c != 0) ? this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == i.eb_c).eb_thickness : 0,
        EB_D:(i.eb_d != undefined && !isNaN(i.eb_d) && i.eb_d != 0) ? this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == i.eb_d).eb_thickness : 0,
        Remark:remarkData,
        Material:matText,
        Comments:i.comments
      })

      //Items

      printItems.push({
        itemnumber: refNo,
        MaterialCode: '[' + i.code + '] ' + matText,
        ItemType:i.itemtype,
        Height: parseInt(i.height),
        Width:parseInt(i.width),
        Qty:qty,
        EB_A:(i.eb_a != undefined && !isNaN(i.eb_a) &&  i.eb_a != 0) ? this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == i.eb_a).eb_thickness : 0,
        EB_B:(i.eb_b != undefined && !isNaN(i.eb_b) &&  i.eb_b != 0) ? this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == i.eb_b).eb_thickness : 0,
        EB_C:(i.eb_c != undefined && !isNaN(i.eb_c) &&  i.eb_c != 0) ? this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == i.eb_c).eb_thickness : 0,
        EB_D:(i.eb_d != undefined && !isNaN(i.eb_d) &&  i.eb_d != 0) ? this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == i.eb_d).eb_thickness : 0,
        Remark:remarkData,
        Comments:i.comments
      })

    })

    console.log(eb_list);
    cutting_list = cutting_list.sort((a,b) => a.RefNo > b.RefNo ? 1  : -1 );
    const wsCuttingList = XLSX.utils.json_to_sheet(cutting_list);


    printItems = printItems.sort((a,b) => a.itemnumber > b.itemnumber ? 1  : -1 );
    const wsItems = XLSX.utils.json_to_sheet(printItems);

    const wsEBList = XLSX.utils.json_to_sheet(eb_list);


    wb.SheetNames.push('cutting_list')
    wb.Sheets['cutting_list'] = wsCuttingList

    wb.SheetNames.push('items')
    wb.Sheets['items'] =  wsItems

    wb.SheetNames.push('EdgeBands')
    wb.Sheets['EdgeBands'] =  wsEBList
    
    //https://github.com/protobi/js-xlsx

    wb["Sheets"]["cutting_list"]["!cols"] = [
      { wpx : 50 },
      { wpx : 100 },
      { wpx : 100 },
      { wpx : 50 },
      { wpx : 50 },
      { wpx : 50 },
      { wpx : 50 },
      { wpx : 50 },   
      { wpx : 50 },
      { wpx : 50 },
      { wpx : 50 },
      { wpx : 50 },
      { wpx : 50 },      
      { wpx : 50 }, 
      { wpx : 100 },      
      { wpx : 150 },     
      { wpx : 150 }     
    ];

    wb["Sheets"]["EdgeBands"]["!cols"] = [
      { wpx : 150 },
      { wpx : 100 },
      { wpx : 100 },
      { wpx : 100 } 
    ];

    // wb["Sheets"]["cutting_list"]["A1"].s = {
    //       border: {
    //         bottom: { style: "thin", color: { auto: 1} }
    //       },
    //       font: { sz: 16, bold: true, color: '#FF00FF' }
    //     };

        //var cell_address = {c:1, r:1};
        /* if an A1-style address is needed, encode the address */
        //var cell_ref = XLSX.utils.encode_cell(cell_address);
        //console.log(wb["Sheets"]["cutting_list"]["A1"]);


    const wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary', cellStyles: true})


    let url = window.URL.createObjectURL(new Blob([this.s2ab(wbout)], {type:'application/octet-stream'}))

    this.download(url, this.props.wo.wonumber + '.xlsx')
  }

  download = (url, name) => {
    let a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()

    window.URL.revokeObjectURL(url)
}


  s2ab = (s) => {
    const buf = new ArrayBuffer(s.length)

    const view = new Uint8Array(buf)

    for (let i=0; i !== s.length; ++i)
        view[i] = s.charCodeAt(i) & 0xFF

    return buf
}

getMaterialCode(i){
  if(i.code == PATTERN_CODE) return "PATTERN";
  

  const m = this.props.material.materialCodes.find(m => m.materialCodeNumber == i.code);
  if(!isEmptyOrSpaces(m.shortname)) return '[' + m.materialCodeNumber + '] ' + m.shortname;

  const b = this.props.material.boards.find(i => i.boardNumber == m.board);
  const fl = this.props.material.laminates.find(i => i.laminateNumber == m.front_laminate);
  const bl = this.props.material.laminates.find(i => i.laminateNumber == m.back_laminate);

  let matText =  (m.board == 0 ? 'No Board' : 'B: ' + b.type + ' - ' + b.thickness + 'mm (' + b.height + ' x ' +  b.width + ') - ' + b.grains);
  matText += (m.front_laminate == 0 ? '' : ', FL: ' + fl.code + ' - ' + fl.thickness + 'mm - ' + fl.grains);
  matText += (m.back_laminate == 0 ? '' : ', BL: ' + bl.code + ' - ' + bl.thickness + 'mm - ' + bl.grains);
  return matText;
}

getRemarkData(i){

  let remarkData = '';
  (i.remarks && i.remarks.length > 0) ?
  i.remarks.map( (id, index) => {

    switch(id){
      case REMARKS.PROFILE:
          const profile = this.props.material.profiles.find(p => p.profileNumber == i.profileType)
          remarkData = profile.type + ' - H: ' + profile.height + ' - W: ' + profile.width;
          break;
      case REMARKS.E_PROFILE:
          const eProfile = this.props.material.profiles.find(p => p.type == PROFILE_TYPE.E)
          if(eProfile)
            remarkData = eProfile.type + ' - H: ' + eProfile.height + ' - W: ' + eProfile.width;
          break;
      case REMARKS.DBLTHICK:
          remarkData = 'DBL THICK - ' + i.doubleThickWidth;
          break;       
      case REMARKS.SHAPE:
            remarkData = 'SHAPE - ' + i.shapeDetails.substring(0,15);
            break;                                
      case REMARKS.LEDGE:
            remarkData = i.ledgeType == "1" ? 'LEDGE' : 'C-LEDGE'
            break;   
          

    }
  }):
  remarkData = 'None';

  return remarkData;
    
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
            <div className="modal-content" style={{marginTop:"10px"}}>
              <div className="modal-header" style={{paddingTop:"2px",paddingBottom:"0px"}}>
                <h5 className="modal-title">Material Definition for Work Order {this.props.wo.wonumber}</h5>
                  <button id="btnCloseMaterialPopup" type="button" class="btn btn-light" data-dismiss="modal"> Back to Items <i class="icon-login"></i> </button>
              </div>
              <div className="modal-body" style={{paddingBottom:"0px"}}>
                <MaterialMain material={this.props.material} clearErrors={this.props.clearErrors} history={this.props.history} />
              </div>
              {/* <div className="modal-footer" style={{paddingTop:"0px",paddingBottom:"5px",display:"block"}}>
                <div style={{float:"left"}}>
                  <i>
                  <ol>
                    <li>Any modification or deletion of items will be saved only when <b>SAVE</b> button is clicked</li>
                    <li>Click on <b>Undo Changes</b> to cancel any modificaton/deletion made since last SAVE</li>
                    <li> <span style={{backgroundColor:"#FFB3B3"}}> &nbsp; This color &nbsp; </span>  indicats that the item is being reffered elsewhere. Be cautious while editing/deleting that item</li>
                  </ol>
                  </i>
                </div>
                    <div style={{cursor:"pointer", color:"#aaa", float:"right"}} onClick={()=>{this.resetMaterialChanges()}}><i className="icon-action-undo"></i> Undo Changes</div> &nbsp; 
              </div> */}
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
                    <button id="btnSaveWO" type="button" className="btn btn-success" style={{lineHeight:"1px"}} onClick={() => {this.saveWorkOrder();}}><i className="icon-doc" ></i>Save</button>
                    &nbsp; &nbsp;
                    <button id="btnSubmitWO" type="button" className="btn btn-secondary"  style={{lineHeight:"1px"}} onClick={() => {this.submitWorkOrder();}}><i className="icon-notebook" ></i>Submit</button>
                    &nbsp; &nbsp;
                    <button id="btnExport" type="button" className="btn btn-primary"  style={{lineHeight:"1px"}} onClick={() => {this.downloadCuttingList();}}><i className="icon-grid" ></i>Download</button>
                    &nbsp; &nbsp;                    
                  </td>
                </tr>
                </tbody>
              </table>
              <WorkOrderItems {...woItemsProps} validate={this.validate} saveWorkOrder={this.saveWorkOrder} />
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
  item: state.config.currentItem

});

export default connect(
  mapStateToProps,
  {clearErrors, saveWorkOrder, getMaterial, saveItems, setCurrentItem, setCurrentRemark}
)(WorkOrderMain);
