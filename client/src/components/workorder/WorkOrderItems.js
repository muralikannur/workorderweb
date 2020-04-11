import React, { Component} from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import { REMARKS, PROFILE_TYPE, EB_START_NUMBER,PATTERN_CODE, PATTERN_TYPE} from '../../constants';
import { notify_error}  from '../../Utils/commonUtls';
import { getMaterialText, getNewWoItem, getEBOptions, getEBThickness }  from '../../Utils/woUtils';


//Components
import RemarksMain from '../remarks/RemarksMain';
import WorkOrderRemarks from './WorkOrderRemarks';
import WorkOrderEdgeBand from './WorkOrderEdgeBand';
import WorkOrderChild from './WorkOrderChild';
import MaterialCodeDropDown from '../materials/MaterialCodeDropDown';


class WorkOrderItems extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentItem:0,
      sortCol:'itemnumber',
      sortOrder:1,
      woitems:[],
      item:null,
      selectedItems:[],
      filteredItems:[],
      filterCode:"0"
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
    if(this.state.filterCode != "0"){
      let items = newProps.wo.woitems.filter(i => i.itemnumber != 0 && i.code == this.state.filterCode);
      this.setState({filteredItems: items });
    }else {
      this.setState({filteredItems: newProps.wo.woitems });
    }

  }

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
        var newItems = items.filter(item => item.itemnumber != i && item.parentId != i);
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

  copyAtoBCD = (item) => {

    let items = this.state.woitems;
    let parentItem = items.find(i => i.itemnumber == item.parentId)

    if(!item.ebCopied){
      // if(item.eb_a == 0){
      //   notify_error('Select EdgeBand for A side');
      //   return;
      // }
  
      if(item.childNumber == 0){
        item.eb_b = item.eb_a;
        if(item.profileSide != "H") item.eb_c = item.eb_a;
        if(item.profileSide != "W") item.eb_d = item.eb_a;
      } else {
        if(parentItem){
          let sides = parentItem.doubleThickSides
          if(sides.includes('B')) item.eb_b = item.eb_a;
          if(sides.includes('C')) item.eb_c = item.eb_a;
          if(sides.includes('D')) item.eb_d = item.eb_a;
        }
      }


    } else {
      item.eb_b = 0;
      if(item.profileSide != "H") item.eb_c = 0;
      if(item.profileSide != "W") item.eb_d = 0;
    }

    item.ebCopied = !item.ebCopied;

    let nonModifiedItems = items.filter(i => i != item);

    this.setState({woitems: [...nonModifiedItems, item]});
    this.props.saveItems( [...nonModifiedItems, item]);

    
  }  



  addItem = () => {
    if(this.props.material.materialCodes.length == 0){
      notify_error('Define Materials before adding the items');
      return;
    }

    if(this.state.currentItem != 0){
      if(!this.props.saveWorkOrder()){
        return;
      }
    }

    const maxId = this.getMaxId();
    const newItem = getNewWoItem(maxId);
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
    const numberFields = ['height', 'width', 'quantity', 'code'];
    const floatFields = ['eb_a','eb_b','eb_c','eb_d'];

    let { value, name } = e.target;

    if (floatFields.includes(name) && value == 'New...') {
      this.props.setMaterialTab('edgebands');
      $('#materialModal').appendTo("body");
      $('#btnMaterial').click();
      return;
    }

    if (numberFields.includes(name)) {
      if(isNaN(value))
       return;
      if(value != '')
       value = parseInt(value);
    }

    if (floatFields.includes(name)) {
      value = Math.round(parseFloat(value));
    }

    var items = this.state.woitems;
    var item = items.find(i => i.itemnumber == this.state.currentItem);
    items = items.filter(i => i.itemnumber != this.state.currentItem)

    // let isChildModified = false;
    // let newChildItem = {};

    // if(item.remarks.includes(REMARKS.PATTERN)){
      
    //   if(item.patternType == PATTERN_TYPE.HORIZONTAL){
    //     if(name == "eb_b"){
    //       newChildItem = this.getPatternLamSize(value, item, items, item.patternType, 2)
    //       isChildModified = true;
    //     }
    //     if(name == "eb_d"){
    //       newChildItem = this.getPatternLamSize(value, item, items, item.patternType, item.patternSplits.length + 1)
    //       isChildModified = true;
    //     }
    //   }
    //   if(item.patternType == PATTERN_TYPE.VERTICAL){
    //     if(name == "eb_a"){
    //       newChildItem = this.getPatternLamSize(value, item, items, item.patternType, 2)
    //       isChildModified = true;
    //     }
    //     if(name == "eb_c"){
    //       newChildItem = this.getPatternLamSize(value, item, items, item.patternType, item.patternSplits.length + 1)
    //       isChildModified = true;
    //     }
    //   }
    // }
    var newItem = { ...item, [name]: value}
    items = [...items,newItem]

    // if(isChildModified){
      
    //   items = items.filter(i => i.parentId != newChildItem.parentId || i.childNumber != newChildItem.childNumber);
    //   items = [...items,newChildItem]
    // }

    this.setState({woitems: items});
    this.props.saveItems(items);
  }

  getPatternLamSize(value, item, items, patternType, pos){
    let eb = getEBThickness(value,this.props.material.edgebands);
    let childItem = items.find(i => i.parentId == item.itemnumber && i.childNumber == pos);
    let splitHeight = item.patternSplits.find(s=> s.id == pos - 1).height;

    

    if(patternType == PATTERN_TYPE.HORIZONTAL)
      childItem = {...childItem, height:Math.ceil(splitHeight + 5 - eb) }
    else
      childItem = {...childItem, width:Math.ceil(splitHeight + 5 - eb) }

      console.log(childItem);
    return childItem;
  }

  itemCheckBoxClicked = (e) => {
    let {value, checked} = e.target;

    if(value == "0"){
      
      let selectedItems;
      if(checked){
        selectedItems = this.state.filteredItems.map(i => i.itemnumber);
        $('[id^=chk]').prop('checked',true);
      } else {
        selectedItems = [];
        $('[id^=chk]').prop('checked',false);
      }
      this.setState({selectedItems})
    } else{
      value = parseInt(value);
      let selectedItems = this.state.selectedItems;
      if(checked){
        selectedItems.push(value)
      } else {
        selectedItems = selectedItems.filter(i => i != value);
      }
      this.setState({selectedItems})
    }
  }

  deleteSelectedItems = () => {
    if(window.confirm('Do you want to Delete selected Items?')){
      let selected = this.state.selectedItems;
      var items = this.state.woitems;
      var newItems = [];
      items.map(i => {
        if(i.itemnumber != 0 && !selected.includes(i.itemnumber))
          newItems.push(i);
        if(i.itemnumber == 0 && !selected.includes(i.parentId))
          newItems.push(i);
      })

      this.setState({woitems: newItems, currentItem:0});
      this.props.setCurrentItem(null);
      this.setState({item:null});
      this.props.saveItems(newItems);

      $('[id^=chk]').prop('checked',false);
      this.setState({selectedItems:[]})

    }
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
          modifiedItem.profileNumber = 0;
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
    this.props.setCurrentRemark(id);
    $('#btnRemarks').click();
    
  }
  
  addRemarkData = () => {
    if(!this.props.validate()){
      return;
    }
    this.props.setCurrentRemark(0);
    $("#currentRemark").val("0").attr("selected","selected");
    window.setTimeout(() => {
      $('#btnRemarks').click();
    },100)
    
  }

  onChildValueChange = (e,cNo,iNo) =>{

    if (e.target.value == 'New...') {
      this.props.setMaterialTab('edgebands');
      $('#materialModal').appendTo("body");
      $('#btnMaterial').click();
      return;
    }

    var items = this.state.woitems;
    var item = items.find(i => i.parentId == iNo && i.childNumber == cNo);
    var newItem = { ...item, [e.target.name]: e.target.value}

    items = items.filter(i => (i.parentId != iNo || i.childNumber != cNo))
    items = [...items,newItem]
    this.setState({woitems: items});
    this.props.saveItems(items);
  }

  filterByCode = (e) => {
    const code = e.target.value;
    if(code != "0"){
      let items = this.state.woitems.filter(i => i.itemnumber != 0 && i.code == code);
      this.setState({filteredItems: items });
    }else {
      this.setState({filteredItems: this.state.woitems });
    }
    this.setState({filterCode: code});
    $('[id^=chk]').prop('checked',false);
    this.setState({selectedItems:[]})
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
      {n:'remark',t:'Remarks',c:'',w:12},
      {n:'eb_a',t:'EB-A',c:'',w:8},
      {n:'',t:'',c:'',w:2},
      {n:'eb_b',t:'EB-B',c:'',w:8},
      {n:'eb_c',t:'EB-C',c:'',w:8},
      {n:'eb_d',t:'EB-D',c:'',w:8},
      {n:'comments',t:'Comments',c:'',w:7}

      ];

    return(
      <div>
        <table>
          <tr>
            <td style={{width:"170px", backgroundColor:"lightblue"}}>
            {this.state.woitems.length > 0 ?
              <span style={{color:"#555", fontSize:"12px", fontWeight:"bold"}}> &nbsp; Filter by Material Code</span>
               :null}
            </td>
            <td style={{width:"150px", backgroundColor:"lightblue", paddingRight:"5px"}}>
            {this.state.woitems.length > 0 ?
              <MaterialCodeDropDown onChange={this.filterByCode} item={this.state.woitems[0]}  codeValue={this.state.filterCode} material={this.props.material} showPattern={true} excludeOnlyLaminate={true} />
               :null}
            </td>
            <td style={{width:"50px"}}>

            </td>
            <td>
            {this.state.selectedItems.length > 0 ?
            <button onClick={this.deleteSelectedItems} class="btn-danger">Delete selected {this.state.selectedItems.length} item(s)</button>
            :null}
            </td>
          </tr>
        </table>


        <table id="order-listing" className="table stripped" >
          <thead>
            <tr style={{fontSize:'12px', backgroundColor:'navy', color:"#fff"}}>
            <td style={{textAlign:"center", width:'10px'}}><input type="checkbox" value="0" onClick={this.itemCheckBoxClicked}></input></td>
            <td style={{textAlign:'left',width:'20px'}} >#</td>
            <td style={{textAlign:'left',width:'100px'}}>Material</td>
            <td style={{textAlign:'left',width:'100px'}}>Type</td>
            <td style={{textAlign:'left',width:'50px'}}>Height</td>
            <td style={{textAlign:'left',width:'50px'}}>Width</td>
            <td style={{textAlign:'left',width:'40px'}}>Qty</td>
            <td style={{textAlign:'left',width:'120px'}}>Remarks</td>
            <td style={{textAlign:'left',width:'80px'}}>EB-A</td>
            <td style={{textAlign:'left',width:'20px'}}></td>
            <td style={{textAlign:'left',width:'80px'}}>EB-B</td>
            <td style={{textAlign:'left',width:'80px'}}>EB-C</td>
            <td style={{textAlign:'left',width:'80px'}}>EB-D</td>
            <td style={{textAlign:'left',width:'70px'}}>Comments</td>
            <td style={{textAlign:'left',width:'40px'}}></td>

            </tr>
          </thead>
        </table>
        <div  style={{height: "500px", overflowY:"scroll", overflowX:"hidden"}}>
        <table id="order-listing" className="table stripped" >

          {this.state.filteredItems.sort((a,b) => a.itemnumber > b.itemnumber ? 1 : -1).map( (item, i) => {

          let ebOptions = getEBOptions(item, this.props.material);
          console.log(ebOptions);

          let handleProfile = this.props.material.profiles.find(p => p.profileNumber == item.profileNumber)
          let childitems = this.state.woitems.filter(i => i.parentId == item.itemnumber)
          
          return (
            <tbody key={item.itemnumber}>
            <tr id={'item-row-' + item.itemnumber}    onClick={(e) => this.onItemClick(e,item.itemnumber)} onMouseDown={(e) => this.onItemClick(e,item.itemnumber)} onKeyDown={(e) => this.onItemClick(e,item.itemnumber)} onFocus={(e) => this.onItemClick(e,item.itemnumber)} style={{backgroundColor:`${item.itemnumber == this.state.currentItem ? "#b5d1ff" : "#eee"}`}} >
                <td style={{textAlign:"center", width:'10px'}}><input type="checkbox" id={"chk"+item.itemnumber} value={item.itemnumber} onClick={this.itemCheckBoxClicked}></input></td>
                <td style={{textAlign:'left',fontWeight:"bold", textAlign:"center", width:'20px'}}>{item.itemnumber}</td>
                <td style={{textAlign:'left',width:'100px'}}><MaterialCodeDropDown onChange={this.onChange} item={item} material={this.props.material} showPattern={true} excludeOnlyLaminate={true} /> </td>
                <td style={{textAlign:'left',width:'100px'}}><input type="text" className="form-control input-xs" value={item.itemtype}  id="itemtype"  name="itemtype" onChange={this.onChange}  /></td>
                <td style={{textAlign:'left',width:'50px'}}><input type="text" className="form-control input-xs" maxLength="4" value={item.height}  id="height"  name="height" onChange={this.onChange}  /></td>
                <td style={{textAlign:'left',width:'50px'}}><input type="text" className="form-control input-xs" maxLength="4" value={item.width}  id="width"  name="width" onChange={this.onChange}  /></td>
                <td style={{textAlign:'left',width:'40px'}}><input type="text" className="form-control input-xs" maxLength="4" value={item.quantity}  id="quantity"  name="quantity" onChange={this.onChange}  /></td>
                <td style={{textAlign:'left',width:'120px'}}><WorkOrderRemarks  item={item} material={this.props.material} deleteRemark={this.deleteRemark} addRemarkData={this.addRemarkData} showRemarkData={this.showRemarkData} /></td>
                <td style={{textAlign:'left',width:'80px'}}><WorkOrderEdgeBand setMaterialTab={this.props.setMaterialTab} ebOptions={ebOptions} EBvalue={item.eb_a} EBname="eb_a" onChange={this.onChange} handleProfile={handleProfile} profileSide={item.profileSide}   /></td>
                <td style={{textAlign:'left',width:'20px'}}><i className={item.ebCopied?"icon icon-arrow-left-circle":"icon icon-arrow-right-circle"} title="Copy to BCD" style={{color:"blue", cursor:"pointer",paddingTop:"4px", display:"block", float:"left"}} onClick={()=>{this.copyAtoBCD(item)}}></i> </td>
                <td style={{textAlign:'left',width:'80px'}}><WorkOrderEdgeBand setMaterialTab={this.props.setMaterialTab} ebOptions={ebOptions} EBvalue={item.eb_b} EBname="eb_b" onChange={this.onChange} handleProfile={handleProfile} profileSide={item.profileSide}   /></td>
                <td style={{textAlign:'left',width:'80px'}}><WorkOrderEdgeBand setMaterialTab={this.props.setMaterialTab} ebOptions={ebOptions} EBvalue={item.eb_c} EBname="eb_c" onChange={this.onChange} handleProfile={handleProfile} profileSide={item.profileSide}   /></td>
                <td style={{textAlign:'left',width:'80px'}}><WorkOrderEdgeBand setMaterialTab={this.props.setMaterialTab} ebOptions={ebOptions} EBvalue={item.eb_d} EBname="eb_d" onChange={this.onChange} handleProfile={handleProfile} profileSide={item.profileSide}   /></td>
                <td style={{textAlign:'left',width:'70px'}}><input type="text" className="form-control input-xs" value={item.comments}  id="comments"  name="comments" onChange={this.onChange}  /></td>
                <td style={{textAlign:'left',width:'40px'}}>
                <i className="icon icon-layers" title="Make a Copy" style={{color:"blue", cursor:"pointer",paddingTop:"4px", display:"block", float:"left"}} onClick={()=>{this.copyItem(item.itemnumber)}}></i> &nbsp; 
                <i className="remove icon-close" title="Remove" style={{color:"red", cursor:"pointer",paddingTop:"4px", display:"block", float:"right"}} onClick={()=>{this.deleteItem(item.itemnumber)}}></i>
                </td>
            </tr>  

            {childitems && childitems.length > 0 ?
              <WorkOrderChild 
                item={item} 
                childitems={childitems} 
                material={this.props.material} 
                onChange={this.onChildValueChange} 
                copyAtoBCD={this.copyAtoBCD}
              />
            : null }

            

          </tbody>
            )   
           


          })}


      </table>
      </div>
      <span id="btnAddItem" className="btn btn-xs btn-rounded btn-outline-success mr-2" style={{cursor:"pointer", margin:"5px", fontWeight:"bold"}} onClick={()=>{this.addItem()}}>Add Item</span>
      &nbsp; 
      <span id="btnCancelItems" className="btn btn-xs btn-rounded btn-outline-danger mr-2" style={{cursor:"pointer", margin:"5px", fontWeight:"bold", "float":"right"}} onClick={()=>{this.props.cancelItems()}}>Cancel Changes</span>
      
      <RemarksMain setMaterialTab={this.props.setMaterialTab} item={this.state.item} currentRemark={this.props.currentRemark} setCurrentRemark={this.props.setCurrentRemark} wo={this.props.wo} material={this.props.material} saveItems={this.props.saveItems} setCurrentItem={this.props.setCurrentItem}/>
        <button type="button" id="btnRemarks"  data-toggle="modal" data-target="#remarksModal" style={{visibility:"hidden"}}></button>

    
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

