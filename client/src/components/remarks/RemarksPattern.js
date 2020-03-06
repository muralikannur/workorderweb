import React, { Component} from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { REMARKS, PATTERN_TYPE, PATTERN_CODE} from '../../constants';
import { notify_error } from '../../Utils/commonUtls';
import MaterialCodeDropDown from '../materials/MaterialCodeDropDown';

class RemarksPattern extends Component {
 
  constructor(props){
    super(props);
    this.state = {
      patternBoardCode:0,
      patternType:0,
      splitsCount:0,
      patternSplits:[]


    }
    this.boardHeight = 0;
    this.boardWidth = 0;
  }
  componentDidMount(){
    setTimeout(() => {
      this.updateState();
    },200
    )
  }

  updateState() {
    if(this.props.item != null){
      this.setState({ patternType : this.props.item.patternType })
      this.setState({ patternSplits : this.props.item.patternSplits })
      this.setState({ splitsCount : this.props.item.patternSplits.length })
      
    }
  }

  onPatternBoardCodeChange = (e) => {
    this.setState({patternBoardCode:e.target.value});
  }

  onChange = (e,splitId) => {
    const { value, name } = e.target;

    if(name == 'patternType'){
      this.setState({patternType:value});
    }

    if(name == 'splitsCount'){
      if(this.state.patternSplits.length != 0){
        if(!window.confirm('Changing the split count will reset the each split values. Do you want to continue ?')){
          return;
        }
      } 

      let itemHeight = parseInt(this.props.item.height);
      let splitHeight = Math.floor(itemHeight / value)
      let splits = new Array(parseInt(value)).fill(null).map((a,i)=> ({id: i+1,code:0,height:splitHeight}))

      this.setState({patternSplits:splits});
      this.setState({ splitsCount : splits.length })
      
    }

    if(name == 'code'){
      let splitToModify = this.state.patternSplits.find(s => s.id == splitId);
      let splitUnModified = this.state.patternSplits.filter(s => s.id != splitId);
      splitToModify.code = value;
      this.setState({patternSplits:[...splitUnModified, splitToModify]});
    }

    // if(name == 'patternBoardCode'){
    //   this.setState({patternBoardCode:value});
    // }
    
    if(name == 'height'){

      if(isNaN(value)) return;
      if(value != '')
        value = parseInt(value);
      let height = value;
      if(isNaN(height) || height < 0) return;

      // if(height >= parseInt(this.props.item.height)) {
      //   alert('Value exceeds the limit.');
      //   return;
      // };


      let splitToModify = this.state.patternSplits.find(s => s.id == splitId);
      let splitUnModified = this.state.patternSplits.filter(s => s.id != splitId);
      splitToModify.height = value;
      this.setState({patternSplits:[...splitUnModified, splitToModify]});
      console.log([...splitUnModified, splitToModify])
    }

  }

  getSplitSum(){
    let totalSliptHeight = 0;
    this.state.patternSplits.map(s => totalSliptHeight += parseInt(s.height));
    return totalSliptHeight;

  }
  
  UpdateRemark(){

    let itemHeight =parseInt(this.props.item.height);
    let itemWidth = parseInt(this.props.item.width);

    let totalSliptHeight = this.getSplitSum(); 

    if(totalSliptHeight != itemHeight){
      notify_error('Sum of splits height is not equal to item height');
      return;
    }

    let splitsWithoutCode = this.state.patternSplits.filter(s => s.code == 0);
    if(splitsWithoutCode.length > 0){
      notify_error('Code not selected for all the splits');
      return;
    }


    let newItem = JSON.parse(JSON.stringify(this.props.item));
    newItem = { ...newItem, patternType: this.state.patternType, patternSplits: this.state.patternSplits}
    let remarks = newItem.remarks;
    if(remarks.length == 0 || !remarks.includes(REMARKS.PATTERN)){
      remarks.push(REMARKS.PATTERN);
    }

    const patternBoard = {
      itemnumber:0,
      parentId:this.props.item.itemnumber,
      itemtype:'',
      height:this.boardHeight,
      width:this.boardWidth,
      quantity:this.props.item.quantity,
      eb_a:0,
      eb_b:0,
      eb_c:0,
      eb_d:0,
      code:this.state.patternBoardCode,
      remarks:[],
      profileNumber:0,
      doubleThickWidth:0,
      ledgeType:0,
      shapeDetails:'',
      patternType:0,
      glassWidth:0,
      patternSplits:[],
      patternBoardCode:0
    }

    let eb_a = 0;
    let eb_b = 0;
    let eb_c = 0;
    let eb_d = 0;

    if(this.props.item.eb_a) eb_a = parseFloat(this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == this.props.item.eb_a).eb_thickness || 0);
    if(this.props.item.eb_b) eb_b =parseFloat(this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == this.props.item.eb_b).eb_thickness || 0);
    if(this.props.item.eb_c) eb_c = parseFloat(this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == this.props.item.eb_c).eb_thickness || 0);
    if(this.props.item.eb_d) eb_d = parseFloat(this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == this.props.item.eb_d).eb_thickness || 0);


    let splitItems = [];
    this.state.patternSplits.map(p => {

      let height = parseInt(p.height);
      if(p.id == 1){
        height = Math.ceil(height + 5 - eb_b);
      }
      if(p.id == this.state.patternSplits.length){
        height = Math.ceil(height + 5 - eb_d);
      }

      let splitItem = {...patternBoard,code:p.code, height, width:this.boardWidth} ;
      splitItems.push(splitItem);
    })


    let items = this.props.wo.woitems.filter(i => i.itemnumber != this.props.item.itemnumber)
    items = items.filter(item => item.parentId != this.props.item.itemnumber);
    items = [...items, newItem, patternBoard, ...splitItems]
    this.props.saveItems(items);
    //this.props.setCurrentItem(newItem);
    $('#btnRemarksClose').click();
  }
  render() {

    let itemHeight =parseInt(this.props.item.height);
    let itemWidth = parseInt(this.props.item.width);

    let heightEB = 0;
    let widthEB = 0;

    let eb_a = this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == this.props.item.eb_a);
    if(eb_a){
      widthEB += Math.round(eb_a.eb_thickness);
    }
    let eb_c = this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == this.props.item.eb_c);
    if(eb_c){
      widthEB += Math.round(eb_c.eb_thickness);
    }
    let eb_b = this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == this.props.item.eb_b);
    if(eb_b){
      heightEB += Math.round(eb_b.eb_thickness);
    } 
    let eb_d = this.props.material.edgebands.find(eb => eb.materialEdgeBandNumber == this.props.item.eb_d);
    if(eb_d){
      heightEB += Math.round(eb_d.eb_thickness);
    } 

    this.boardHeight = itemHeight + 10 - heightEB;
    this.boardWidth = itemWidth + 10 - widthEB;


    let previewHeight = Math.floor(itemHeight / 10);
    let previewWidth = Math.floor(itemWidth / 10);

    let totalSliptHeight = this.getSplitSum();

    let mCodes = this.props.material.materialCodes.filter(mc => mc.board == 0 && mc.front_laminate != 0);
    if(!mCodes || mCodes.length == 0){
      return(<div>No Material Codes defined with only Laminates..</div>)
    }

    let colors = ['#555','#aaa','#999','#777','#333','#111','#eee','#ccc'];


    return(
      <div>
          <div>
            <span style={{fontSize:"12px", float:"right"}}><b>Cutting Size:</b> Height: {this.boardHeight} &nbsp;  Width: {this.boardWidth}</span>
            <div className="form-group" style={{marginBottom:"0px"}}>
              <b>Material: </b>
              <MaterialCodeDropDown onChange={this.onPatternBoardCodeChange} item={this.props.item} material={this.props.material} showPattern={true} excludeOnlyLaminate={true} />

              
              {/* <select id="code" onChange={this.onChange}  name="patternBoardCode" value={this.state.patternBoardCode} className="js-example-basic-single input-xs  w-100">
              <option value="0">Select the Material</option>  
              {
                this.props.material.materialCodes.sort((a,b) => a.materialCodeNumber > b.materialCodeNumber ? 1 : -1).map( (m) => {
                const b = this.props.material.boards.find(i => i.boardNumber == m.board);
                const fl = this.props.material.laminates.find(i => i.laminateNumber == m.front_laminate);
                const bl = this.props.material.laminates.find(i => i.laminateNumber == m.back_laminate);

                let matText = '[' + m.materialCodeNumber + '] ' + (m.board == 0 ? 'No Board' : 'B: ' + b.type + ' - ' + b.thickness + 'mm (' + b.height + ' x ' +  b.width + ') - ' + b.grains);
                matText += (m.front_laminate == 0 ? '' : ', FL: ' + fl.code + ' - ' + fl.thickness + 'mm - ' + fl.grains);
                matText += (m.back_laminate == 0 ? '' : ', BL: ' + bl.code + ' - ' + bl.thickness + 'mm - ' + bl.grains);

                return (
                  <option value={m.materialCodeNumber} key={m.materialCodeNumber} >{matText}</option>
                )})}
                <option value="{PATTERN_CODE}">PATTERN</option>
              </select> */}

            </div>


            <table>
            <tr>
                <td>
                </td>
                <td>

                </td>
              </tr>
            </table>

            <table>

              <tr>
                <td>
                  <b>Pattern Type</b>
                  <select style={{width:"150px"}}  id="patternType" name="patternType" value={this.state.patternType}  onChange={this.onChange} className="js-example-basic-single input-xs  w-100">
                  <option value="0"  >Select</option>
                  <option value={PATTERN_TYPE.HORIZONTAL} >HORIZONTAL</option>
                  <option value={PATTERN_TYPE.VERTICAL} >VERTICAL</option>
                  </select>  
                </td>
                <td>
                  <b>Number of Splits</b>
                  <select style={{width:"150px"}}  id="splitsCount" name="splitsCount" value={this.state.splitsCount}  onChange={this.onChange} className="js-example-basic-single input-xs  w-100">
                  <option value="0">Select</option>
                  {
                    [...Array(48).keys()].map(i => {
                      return <option value={i+2}>{i+2}</option>
                    })
                  }
                  </select>  
                </td>                
              </tr>
            </table>
            <br />

            <table style={{width:"100%"}}>

              <tr>
                <td  style={{width:"40%"}}>
                  <table className="table  table-striped"  style={{width:"100%", fontSize:"10px"}}>
                    <tr style={{fontWeight:"bold"}}>
                      <td>#</td><td>Laminate</td><td style={{width:"10px"}}>Height</td>
                    </tr>
                  
                {
                    this.state.patternSplits.sort((a,b) => a.id > b.id ? 1 : -1 ).map(pattern => {
                      return <tr>
                        <td>{pattern.id}</td>
                        <td>
                        <MaterialCodeDropDown onChange={this.onPatternBoardCodeChange} item={this.props.item} material={this.props.material} onlyLaminate={true} />

                          {/* <select  onChange={(e) => this.onChange(e,pattern.id)} value={pattern.code}  id="code" name="code" className="js-example-basic-single input-xs  w-100">
                            <option value="0">Select the Code</option>
                            {
                            mCodes.map( (mc) => {
                            return (
                              <option value={mc.materialCodeNumber}  key={mc.materialCodeNumber} >{this.props.material.laminates.find(l => l.laminateNumber == mc.front_laminate).code}</option>
                            )})
                            }
                          </select> */}
                        </td>
                        <td>
                          <input type="text"  onChange={(e) => this.onChange(e,pattern.id)} className="form-control input-xs" maxLength="4" value={pattern.height}  id="height"  name="height"  />
                        </td>
                      </tr>
                    })
                  }
                    <tr>
                      <td></td><td>Total</td><td>{totalSliptHeight}</td>
                    </tr>
                  </table>

                </td>
                <td style={{width:"60%", textAlign:"center"}}>
                <div style={{border:"maroon 1px solid",borderBottom:"#eee 0px solid", margin:"0 auto",width:`${previewWidth}px`, height:`${previewHeight}px`}}>
                  {
                    this.state.patternSplits.filter(s => s.height > 0).map(split => {
                      let sHeight = Math.ceil(parseInt(split.height) / 10)
                      let color = split.code == "0" ? '#fff' : colors[mCodes.findIndex(mc => mc.materialCodeNumber == split.code)];
                      return <div style={{borderBottom:"maroon 1px solid",width:"100%", height:`${sHeight}px`, backgroundColor:`${color}`}}></div>
                    })
                  }
                </div>
                </td>

              </tr>
            </table>

            <br />
            <span style={{color:'red', fontSize:'10px'}}>
              {
                (totalSliptHeight > itemHeight) ? 'Total split height is more than Item Height':''
              }
            </span>



 
            <hr />
            <div className="modal-footer" style={{paddingTop:"0px",paddingBottom:"5px",display:"block", textAlign:"right"}}>
            <button type="button" class="btn btn-success" onClick={() => {this.UpdateRemark()}}>Update</button>
            </div>   
          </div>
  
         <br />

      </div>          

    )
    
  }
}

RemarksPattern.propTypes = {
  item: PropTypes.object.isRequired,
  wo: PropTypes.object.isRequired,
  material: PropTypes.object.isRequired,  
  saveItems: PropTypes.func.isRequired
}


export default RemarksPattern;
