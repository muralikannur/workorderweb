import React, { Component} from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import { remarks } from '../../appConfig';
import { REMARKS, PROFILE_TYPE, EB_START_NUMBER} from '../../constants';
import { notify_error, notify_success, isEmptyOrSpaces }  from '../../util';

//Components
import RemarksMain from '../remarks/RemarksMain';


class WorkOrderItems extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentItem:0,
      currentRemark:0,
      sortCol:'itemnumber',
      sortOrder:1,
      woitems:[],
      item:null
    };
  }

  componentDidMount(){
    console.log('LIFECYCLE: Workorder Items - componentDidMount');
    this.props.clearErrors();
    this.props.setCurrentItem(null);
    this.REMOVE_REMARK_ICON_TITLE = "Remove Remark";
  }

  componentWillReceiveProps(newProps){
    console.log('LIFECYCLE: Workorder Items - componentWillReceiveProps');
    this.setState({woitems: newProps.wo.woitems });
  }

  // headerClick = (col) => {
  //   if(this.state.sortCol == col){
  //     this.setState({sortOrder:this.state.sortOrder * -1})
  //   }else {
  //     this.setState({sortOrder:1, sortCol:col})
  //   }
  // }

  onItemClick = (e, i) => {

    if(e.target.title == this.REMOVE_REMARK_ICON_TITLE) return;


    this.setState({currentItem:i});
    let items = this.state.woitems;
    let item = items.find(item => item.itemnumber == i);
    this.props.setCurrentItem(item);
    this.setState({item});
  }

  deleteItem = (i) => {
    this.setState({currentItem:i})
    setTimeout(() => {
      if(window.confirm('Are you sure that you want to delete the Item # ' + i +' ??','Shape')){
        var items = this.state.woitems;
        var newItems = items.filter(item => item.itemnumber != i);
        this.setState({woitems: newItems, currentItem:0});
        this.props.setCurrentItem(null);
        this.setState({item:null});
        this.props.saveItems(newItems);
      }
    },100
    )
  }
  
  copyItem = (i) => {
    let items = this.state.woitems;
    let item = items.find(item => item.itemnumber == i);
    const maxId = this.getMaxId();
    let newItem = JSON.parse(JSON.stringify(item))
    newItem.itemnumber = maxId;

    let childItems = [];
    items.filter(i => i.parentId == item.itemnumber).map(child => {
      let newChild = JSON.parse(JSON.stringify(child));
      newChild.itemNumber = maxId;
      newChild.parentId = maxId;
      childItems.push(newChild)
    })

    this.setState({woitems: [...this.state.woitems, ...childItems, newItem]});
    this.props.saveItems( [...this.state.woitems, ...childItems, newItem]);
    setTimeout(() => {
      this.setState({currentItem:maxId})
    },100)
  }  

  copyAtoBCD = (i) => {
    let items = this.state.woitems;
    let item = items.find(item => item.itemnumber == i);

    if(item.eb_a == 0){
      notify_error('Select EdgeBand for A side');
      return;
    }

    item.eb_b = item.eb_a;
    if(item.profileSide != "H") item.eb_c = item.eb_a;
    if(item.profileSide != "W") item.eb_d = item.eb_a;

    let nonModifiedItems = items.filter(item => item.itemnumber != i);

    this.setState({woitems: [...nonModifiedItems, item]});
    this.props.saveItems( [...nonModifiedItems, item]);
  }  



  addItem = () => {
    if(this.props.material.materialCodes.length == 0){
      notify_error('Define Materials before adding the items');
      return;
    }

    if(this.state.currentItem != 0){
      if(!this.props.saveWorkOrder());
    }

    const maxId = this.getMaxId();
    const newItem = {
      itemnumber:maxId,
      parentId:0,
      itemtype:'',
      height:'',
      width:'',
      quantity:'',
      eb_a:0,
      eb_b:0,
      eb_c:0,
      eb_d:0,
      code:0,
      remarks:[],
      comments:'',
      profileType:0,
      profileSide:'',
      doubleThickWidth:0,
      ledgeType:0,
      shapeDetails:'',
      patternType:0,
      glassWidth:0,
      patternSplits:[],
      patternBoardCode:0,
      doubleThickSides:'ABCD',
      doubleThickCode:0
    }
    this.setState({woitems: [...this.state.woitems, newItem], currentItem:maxId});
    this.props.saveItems( [...this.state.woitems, newItem]);
  }

  getMaxId = () => {
    let maxId = 1;
    if(this.state.woitems.length > 0){
      let item = this.state.woitems.sort((a, b) => (a.itemnumber < b.itemnumber) ? 1 : -1).slice(0, 1);
      maxId = (item[0].itemnumber) + 1;
    }
    return maxId;
  }

  onChange = (e) => {
    if(this.state.currentItem == 0) return;
    const numberFields = ['height', 'width', 'quantity'];
    const floatFields = ['eb_a','eb_b','eb_c','eb_d'];

    let { value, name } = e.target;

    if (numberFields.includes(name) && isNaN(value)) { return;}

    if (floatFields.includes(name)) {
      value = Math.round(parseFloat(value));
    }
    
    
    

    var items = this.state.woitems;
    var item = items.find(i => i.itemnumber == this.state.currentItem);
    var newItem = { ...item, [name]: value}

    items = items.filter(i => i.itemnumber != this.state.currentItem)
    items = [...items,newItem]
    this.setState({woitems: items});
    this.props.saveItems(items);
  }

  getSortedItems = () => {
    const so = this.state.sortOrder;
    let items = this.state.woitems.filter(i => i.itemnumber != 0);
    items = items.sort((a,b) => a.itemnumber > b.itemnumber ? 1 : -1);

    // switch(this.state.sortCol){
    //   case 'itemnumber':{
    //     items = items.sort((a,b) => a.itemnumber > b.itemnumber ? 1 * so : -1 * so);
    //     break;
    //   }
    //   case 'code':{
    //     items = items.sort((a,b) => a.code > b.code ? 1 * so : -1 * so);
    //     break;
    //   }
    //   case 'itemtype':{
    //     items = items.sort((a,b) => a.itemtype > b.itemtype ? 1 * so : -1 * so);
    //     break;
    //   }
    //   case 'height':{
    //     items = items.sort((a,b) => a.height > b.height ? 1 * so : -1 * so);
    //     break;
    //   }
    //   case 'width':{
    //     items = items.sort((a,b) => a.width > b.width ? 1 * so : -1 * so);
    //     break;
    //   }
    //   case 'quantity':{
    //     items = items.sort((a,b) => a.quantity > b.quantity ? 1 * so : -1 * so);
    //     break;
    //   }
    // }
    return items;
  }


  //--------REMARKS-------------------------------------------------
  deleteRemark = (remarkId,remarkName,itemNumber) => {
    if(window.confirm('Are you sure that you want to delete ' + remarkName + ' from the Item # ' + itemNumber +' ??','Shape')){
      
      let items = this.state.woitems;
      let modifiedItem = items.find(item => item.itemnumber == itemNumber);
      let modifiedRemarks = this.removeItemFromArray(modifiedItem.remarks,remarkId);
      modifiedItem = {...modifiedItem,remarks:modifiedRemarks}

      let unModifiedItems = items.filter(item => item.itemnumber != itemNumber);
      switch(remarkId){
        case REMARKS.PROFILE:
          modifiedItem.profileType = 0;
          modifiedItem.profileSide= '';
          break;
        case REMARKS.E_PROFILE:
            modifiedItem.eb_a = 0;
            modifiedItem.eb_b = 0;
            modifiedItem.eb_c = 0;
            modifiedItem.eb_d = 0;
          break;
        case REMARKS.DBLTHICK:
            unModifiedItems = unModifiedItems.filter(item => item.parentId != itemNumber);
            modifiedItem.doubleThickWidth = 0;
            break;

        case REMARKS.LEDGE:
            modifiedItem.ledgeType = 0;
            break;
        case REMARKS.SHAPE:
            modifiedItem.shapeDetails = '';
            break;
        case REMARKS.PATTERN:
            unModifiedItems = unModifiedItems.filter(item => item.parentId != itemNumber);
            modifiedItem.patternSplits=[];
            modifiedItem.patternType = 0;
            break;
        case REMARKS.GLASS:
            modifiedItem.glassWidth = 0;
          break;


      }

      let newItems = [modifiedItem];
      if(unModifiedItems.length != 0){
        newItems = [modifiedItem, ...unModifiedItems];
      }
      this.setState({woitems: newItems});
      this.props.saveItems(newItems);

      this.props.setCurrentItem(modifiedItem);
      this.setState({item:modifiedItem});
    }
  }

  removeItemFromArray = (arr, item) => {
    if(!arr || !arr.length || arr.length == 0) return [];
    for( var i = 0; i < arr.length; i++){ 
      if ( arr[i] === item) {
        arr.splice(i, 1); 
      }
   }
   return arr;
  }

  showRemarkData = (id) => {
    this.setState({currentRemark:id});
    this.props.setCurrentRemark(id);
    $('#btnRemarks').click();
    
  }
  
  addRemarkData = () => {
    if(!this.props.validate()){
      return;
    }
    this.setState({currentRemark:0});
    this.props.setCurrentRemark(0);
    $("#currentRemark").val("0").attr("selected","selected");
    $('#btnRemarks').click();
  }

  getMaterialText(m){
    if(!m) return;
    if(!isEmptyOrSpaces(m.shortname)) return '[' + m.materialCodeNumber + '] ' + m.shortname;

    const b = (m.board != 0 ? this.props.material.boards.find(i => i.boardNumber == m.board) : null);
    const fl =(m.front_laminate != 0 ?  this.props.material.laminates.find(i => i.laminateNumber == m.front_laminate): null);
    const bl = (m.back_laminate != 0 ? this.props.material.laminates.find(i => i.laminateNumber == m.back_laminate): null);

    let matText = '[' + m.materialCodeNumber + '] ' + (m.board == 0 ? 'No Board' : 'B: ' + b.type + ' - ' + b.thickness + 'mm (' + b.height + ' x ' +  b.width + ') - ' + b.grains);
    matText += (m.front_laminate == 0 ? '' : ', FL: ' + fl.code + ' - ' + fl.thickness + 'mm - ' + fl.grains);
    matText += (m.back_laminate == 0 ? '' : ', BL: ' + bl.code + ' - ' + bl.thickness + 'mm - ' + bl.grains);
    return matText;
  }

  onChildCodeChange = (e,cNo,iNo) =>{
    var items = this.state.woitems;
    var item = items.find(i => i.itemnumber == iNo && i.childNumber == cNo);
    var newItem = { ...item, childCode: e.target.value}

    items = items.filter(i => (i.itemnumber != iNo && i.childNumber != cNo))
    items = [...items,newItem]
    this.setState({woitems: items});
    //this.props.saveItems(items);
  }

  render() {

    if(!this.props.material || !this.props.material.materialCodes || this.props.material.materialCodes.length == 0) return null

    this.colNames = [
      {n:'itemnumber',t:'#',c:'pointer',w:2},
      {n:'code',t:'Material',c:'pointer',w:15},
      {n:'itemtype',t:'Type',c:'pointer',w:10},
      {n:'height',t:'Height',c:'pointer',w:5},
      {n:'width',t:'Width',c:'pointer',w:5},
      {n:'quantity',t:'Qty',c:'pointer',w:4},
      {n:'remark',t:'Remarks',c:'',w:16},
      {n:'eb_a',t:'EB-A',c:'',w:7},
      {n:'',t:'',c:'',w:2},
      {n:'eb_b',t:'EB-B',c:'',w:7},
      {n:'eb_c',t:'EB-C',c:'',w:7},
      {n:'eb_d',t:'EB-D',c:'',w:7},
      {n:'comments',t:'Comments',c:'',w:7}

      ];

    return(
      <div>
        <RemarksMain item={this.state.item} currentRemark={this.state.currentRemark} wo={this.props.wo} material={this.props.material} saveItems={this.props.saveItems}/>
        <button type="button" id="btnRemarks"  data-toggle="modal" data-target="#remarksModal" style={{visibility:"hidden"}}></button>
        <table id="order-listing" className="table stripped" >
          <thead>
            <tr>
                {this.colNames.map((c,i) => {
                  return (
                    <th key={i} style={{width:`${c.w}%`}}>{c.t}</th>
                  )
                })}
                <th> &nbsp; </th>
            </tr>
          </thead>
          {this.getSortedItems().map( (item) => {

          //EDGE BAND OPTIONS----------------------------------------------------------------  
          let ebOptions = [{
            materialEdgeBandNumber:0,
            laminate:'0',
            eb_thickness:'',
            eb_width:'',
          }];

          let hasEProfile = false;

          //If Item has E-Profile selected, EB sides should be default to E-Profiles thicknes and width
          if(item.remarks.indexOf(REMARKS.E_PROFILE) != -1){
            let eProfile = this.props.material.profiles.find(p => p.type == PROFILE_TYPE.E)
            if(eProfile){
              let edgeband = this.props.material.edgebands.find(eb => eb.laminate == EB_START_NUMBER.PROFILE + parseInt(eProfile.profileNumber))
              if(edgeband){
                ebOptions = [edgeband]
                hasEProfile = true;
              }
            }
          }

          if(!hasEProfile){
            if(this.props.material.materialCodes){
              const mat = this.props.material.materialCodes.find(mc => mc.materialCodeNumber == item.code);
              if(mat){
                const laminate = this.props.material.edgebands.filter(eb => eb.laminate == mat.front_laminate );
                const board = this.props.material.edgebands.filter(eb => eb.laminate == parseInt(mat.board) + EB_START_NUMBER.BOARD);
                
                if(laminate || board){
                  ebOptions = [ebOptions, ...laminate, ...board];
                }
              } else if(item.code == "100"){
                ebOptions = [ebOptions, ...this.props.material.edgebands];
              }
            }
          }

          let handleProfile = this.props.material.profiles.find(p => p.profileNumber == item.profileType)

          return (
            <tbody>
            <tr id={'item-row-' + item.itemnumber}  key={item.itemnumber}  onClick={(e) => this.onItemClick(e,item.itemnumber)} onMouseDown={(e) => this.onItemClick(e,item.itemnumber)} onKeyDown={(e) => this.onItemClick(e,item.itemnumber)} onFocus={(e) => this.onItemClick(e,item.itemnumber)} style={{backgroundColor:`${item.itemnumber == this.state.currentItem ? "#b5d1ff" : "#eee"}`}} >
                <td style={{fontWeight:"bold", textAlign:"center"}}>{item.itemnumber}</td>
                <td>
                  <div className="form-group" style={{marginBottom:"0px"}}>
                    <select id="code" onChange={this.onChange}  value={item.code}  name="code" className="js-example-basic-single input-xs  w-100">
                    <option value="0">Select the Material</option>  
                    {
                      this.props.material.materialCodes.sort((a,b) => a.materialCodeNumber > b.materialCodeNumber ? 1 : -1).map( (m) => {
                      let matText =  this.getMaterialText(m);
                      return (
                        <option value={m.materialCodeNumber} key={m.materialCodeNumber} >{matText}</option>
                      )})}
                      <option value="100">PATTERN</option>
                    </select>
                  </div>


                </td>
                <td><input type="text" className="form-control input-xs" value={item.itemtype}  id="itemtype"  name="itemtype" onChange={this.onChange}  /></td>
                <td><input type="text" className="form-control input-xs" maxLength="4" value={item.height}  id="height"  name="height" onChange={this.onChange}  /></td>
                <td><input type="text" className="form-control input-xs" maxLength="4" value={item.width}  id="width"  name="width" onChange={this.onChange}  /></td>
                <td><input type="text" className="form-control input-xs" maxLength="4" value={item.quantity}  id="quantity"  name="quantity" onChange={this.onChange}  /></td>
                <td>
                  {
                    (item.remarks && item.remarks.length > 0) ?
                    item.remarks.map( (id, index) => {
                      let remarkName = remarks.find(r => r.id == id).name;
                      let remarkData = '';

                      switch(id){
                        case REMARKS.PROFILE:
                            const profile = this.props.material.profiles.find(p => p.profileNumber == item.profileType)
                            if(profile)
                              remarkData = profile.type + ' - H: ' + profile.height + ' - W: ' + profile.width + '(' + item.profileSide + ')';
                            break;
                        case REMARKS.E_PROFILE:
                            const eProfile = this.props.material.profiles.find(p => p.type == PROFILE_TYPE.E)
                            if(eProfile)
                              remarkData = eProfile.type + ' - H: ' + eProfile.height + ' - W: ' + eProfile.width;
                            break;
                        case REMARKS.DBLTHICK:
                            remarkData = 'DBL THICK - ' + item.doubleThickWidth;
                            break;    
                        case REMARKS.SHAPE:
                            remarkData = 'SHAPE - ' + item.shapeDetails.substring(0,15);
                            break;                                
                        case REMARKS.LEDGE:
                            remarkData = item.ledgeType == "1" ? 'LEDGE' : 'C-LEDGE'
                            break;  
                        case REMARKS.GLASS:
                            remarkData = 'GLASS - ' + item.glassWidth;
                            break;                              
                        case REMARKS.PATTERN:
                            remarkData = 'PATTERN ' + item.patternSplits.length;
                            break;   
                      }

                      return (
                        <div key={index} style={{padding:"2px",margin:"2px",fontSize:"11px", display:"inline"}}>{(index != 0?<br />:null)}<span style={{cursor:"pointer", color:"navy"}} onClick={()=>{this.showRemarkData(id)}}>{remarkData}</span> &nbsp; <i className="remove icon-close" title={this.REMOVE_REMARK_ICON_TITLE} style={{color:"red", cursor:"pointer", display:"inine", fontSize:"11px"}} onClick={()=>{this.deleteRemark(id, remarkName, item.itemnumber)}}></i></div>
                  )})
                :
                <span> &nbsp; None</span>
                }
                  &nbsp; <i className="remove icon-plus" title="Add Remark" style={{color:"green", cursor:"pointer", display:"inline"}} onClick={()=>{this.addRemarkData()}}></i>

                </td>
                
                <td>
                  <div className="form-group" style={{marginBottom:"0px"}}>
                    <select  onChange={this.onChange} value={item.eb_a}  id="eb_a" name="eb_a" className="js-example-basic-single input-xs w-100" > 
                    {
                      ebOptions.map( (e) => {
                        return (
                          <option value={e.materialEdgeBandNumber}  key={e.materialEdgeBandNumber} >{e.eb_thickness} - {e.eb_width}</option>
                        )})
                    }
                    </select>
                    
                  </div>
                </td>
                <td><i className="icon icon-arrow-right-circle" title="Copy to BCD" style={{color:"blue", cursor:"pointer",paddingTop:"4px", display:"block", float:"left"}} onClick={()=>{this.copyAtoBCD(item.itemnumber)}}></i> </td>
                <td>
                  <div className="form-group" style={{marginBottom:"0px"}}>
                    <select id="eb_b"  onChange={this.onChange} value={item.eb_b}  name="eb_b" className="js-example-basic-single input-xs  w-100">
                    {
                      ebOptions.map( (e) => {
                        return (
                          <option value={e.materialEdgeBandNumber}  key={e.materialEdgeBandNumber} >{e.eb_thickness} - {e.eb_width}</option>
                        )})
                    }
                    </select>
                  </div>
                </td>
                <td>
                  <div className="form-group" style={{marginBottom:"0px"}}>
                    {
                      (handleProfile && item.profileSide == 'H') ? <input type="text" className="form-control input-xs" maxLength="4" value={' HP  ' + handleProfile.height}  disabled /> :
                      <select id="eb_c"  onChange={this.onChange}  value={item.eb_c} name="eb_c" className="js-example-basic-single input-xs  w-100">
                      {
                        ebOptions.map( (e) => {
                          return (
                            <option value={e.materialEdgeBandNumber}  key={e.materialEdgeBandNumber} >{e.eb_thickness} - {e.eb_width}</option>
                          )})
                      }
                      </select>
                    }

                  </div>
                </td>
                <td>
                  <div className="form-group" style={{marginBottom:"0px"}}>
                    {
                      (handleProfile && item.profileSide == 'W') ? <input type="text" className="form-control input-xs" maxLength="4" value={' HP  ' + handleProfile.height}  disabled /> :

                      <select id="eb_d"  onChange={this.onChange}  value={item.eb_d} name="eb_d" className="js-example-basic-single input-xs  w-100">
                        {
                          ebOptions.map( (e) => {
                            return (
                              <option value={e.materialEdgeBandNumber}  key={e.materialEdgeBandNumber} >{e.eb_thickness} - {e.eb_width}</option>
                            )})
                        }
                      </select>
                    }
                  </div>
                </td>
                <td><input type="text" className="form-control input-xs" value={item.comments}  id="comments"  name="comments" onChange={this.onChange}  /></td>
                <td>
                <i className="icon icon-layers" title="Make a Copy" style={{color:"blue", cursor:"pointer",paddingTop:"4px", display:"block", float:"left"}} onClick={()=>{this.copyItem(item.itemnumber)}}></i> &nbsp; 
                <i className="remove icon-close" title="Remove" style={{color:"red", cursor:"pointer",paddingTop:"4px", display:"block", float:"right"}} onClick={()=>{this.deleteItem(item.itemnumber)}}></i>
                </td>
            </tr>  
            {this.state.woitems.filter(i => i.parentId == item.itemnumber).map(child => {


                let dblThickMat = this.props.material.materialCodes.find(mc => mc.materialCodeNumber == item.doubleThickCode);


              return(
                <tr style={{backgroundColor:"#ddd", color:"#555", padding:"2px"}}>
                <td style={{fontWeight:"bold", textAlign:"center"}}>{item.itemnumber}</td>
                <td>
                  <div className="form-group" style={{marginBottom:"0px"}}>
                    <select id="code" onChange={(e) => this.onChildCodeChange(e,child.childNumber,item.itemnumber)}  value={child.code}  name="childCode" className="js-example-basic-single input-xs  w-100">
                    <option value="0">Select the Material</option>  
                    {
                      this.props.material.materialCodes.sort((a,b) => a.materialCodeNumber > b.materialCodeNumber ? 1 : -1).map( (m) => {
                      let matText =  this.getMaterialText(m);
                      return (
                        <option value={m.materialCodeNumber} key={m.materialCodeNumber} >{matText}</option>
                      )})}
                    </select>
                  </div>  
                </td>                
                <td></td>
                <td>{child.height}</td>
                <td>{child.width}</td>
                <td>{child.quantity}</td>
                <td></td>
                <td>{this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == child.eb_a) ? this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == child.eb_a).eb_thickness : 0}</td>
                <td>{this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == child.eb_b) ? this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == child.eb_b).eb_thickness : 0}</td>
                <td>{this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == child.eb_c) ? this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == child.eb_c).eb_thickness : 0}</td>
                <td>{this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == child.eb_d) ? this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == child.eb_d).eb_thickness : 0}</td>
                <td></td>
              </tr>
              );
            })}

          </tbody>
            )   


          })}



      </table>
      <span id="btnAddItem" className="btn btn-xs btn-rounded btn-outline-success mr-2" style={{cursor:"pointer", margin:"5px", fontWeight:"bold"}} onClick={()=>{this.addItem()}}>Add Item</span>
      &nbsp; 
      <span id="btnCancelItems" className="btn btn-xs btn-rounded btn-outline-danger mr-2" style={{cursor:"pointer", margin:"5px", fontWeight:"bold", "float":"right"}} onClick={()=>{this.props.cancelItems()}}>Cancel Changes</span>
    </div>
    )
    
  }
}

WorkOrderItems.propTypes = {
  wo: PropTypes.object.isRequired,
  material: PropTypes.object.isRequired,
  saveItems: PropTypes.func.isRequired, 
  setCurrentItem: PropTypes.func.isRequired, 
  setCurrentRemark: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired
}

export default WorkOrderItems;

