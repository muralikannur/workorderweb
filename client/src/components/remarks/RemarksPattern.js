import React, { Component} from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { REMARKS, PATTERN_TYPE, PATTERN_CODE} from '../../constants';
import { notify_error } from '../../Utils/commonUtls';
import MaterialCodeDropDown from '../materials/MaterialCodeDropDown';
import { getNewWoItem, getEBThickness }  from '../../Utils/woUtils';
import { getPatternBoardSize, getPatternLaminateSize }  from '../../Utils/remarksUtils';

class RemarksPattern extends Component {
 
  constructor(props){
    super(props);
    this.state = {
      patternBoardCode:0,
      patternType:0,
      splitsCount:0,
      patternSplits:[],
      eb_a:0,eb_b:0,eb_c:0,eb_d:0


    }
    this.boardHeight = 0;
    this.boardWidth = 0;
  }
  componentDidMount(){
    console.log('Patern - mount');
    setTimeout(() => {
      this.updateState();
    },200
    )
  }

  updateState() {
    if(this.props.item){
      const item = this.props.item;
      this.setState({ patternType : item.patternType })
      this.setState({ patternSplits : item.patternSplits })
      this.setState({ splitsCount : item.patternSplits.length })
      this.setState({ patternBoardCode : item.patternBoardCode })

      if(this.props.material.edgebands){
        const edgebands = this.props.material.edgebands;
        this.setState({ eb_a : getEBThickness(item.eb_a,edgebands)});
        this.setState({ eb_b : getEBThickness(item.eb_b,edgebands)});
        this.setState({ eb_c : getEBThickness(item.eb_c,edgebands)});
        this.setState({ eb_d : getEBThickness(item.eb_d,edgebands)});
      }
      
    }
  }

  onPatternBoardCodeChange = (e) => {
    this.setState({patternBoardCode:e.target.value});
  }

  onPatternLaminateCodeChange = (e,splitId) => {
    let splitToModify = this.state.patternSplits.find(s => s.id == splitId);
    let splitUnModified = this.state.patternSplits.filter(s => s.id != splitId);
    splitToModify.code = e.target.value;
    this.setState({patternSplits:[...splitUnModified, splitToModify]});
  }

  onChange = (e,splitId) => {
    let { value, name } = e.target;

    if(name == 'patternType'){
      this.setState({patternType:value});
      if(value == PATTERN_TYPE.SPECIAL_DESIGN){
        this.setState({patternSplits:[]});
        this.setState({ splitsCount : 0 })
      }
    }

    if(name == 'splitsCount'){
      if(this.state.patternSplits.length != 0){
        if(!window.confirm('Changing the split count will reset the each split values. Do you want to continue ?')){
          return;
        }
      } 

      let splits = new Array(parseInt(value)).fill(null).map((a,i)=> ({id: i+1,code:0,height:0,eb:false}))

      this.setState({patternSplits:splits});
      this.setState({ splitsCount : splits.length })
      
    }


    
    if(name == 'height'){

      if(isNaN(value)) return;
      
      if(value != '')
        value = parseInt(value);
      else
        value = 0;
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
    }

  }

  getSplitSum(){
    let totalSliptHeight = 0;
    this.state.patternSplits.map(s => totalSliptHeight += parseInt(s.height));
    return totalSliptHeight;

  }

  splitEBChanged (e,splitId){

    let patternSplits = this.state.patternSplits;

    let splitToModify = patternSplits.find(s => s.id == splitId);
    splitToModify.eb = true;

    let splitUnModified = patternSplits.filter(s => s.id != splitId);
    let newSplits = [splitToModify];

    //Unset EB option from alredy selected Laminate, if any
    let splitWithEB = patternSplits.find(s => s.eb & s.id != splitId);
    if(splitWithEB) {
      splitWithEB.eb = false;
      newSplits.push(splitWithEB);
      splitUnModified = splitUnModified.filter(s => s.id != splitWithEB.id);
    } 

    newSplits = [...newSplits, ...splitUnModified];

    this.setState({patternSplits:newSplits});
  }
  
  UpdateRemark(){

    let itemHeight =parseInt(this.props.item.height);
    let itemWidth = parseInt(this.props.item.width);

    let totalSliptHeight = this.getSplitSum(); 

    if(this.state.patternBoardCode == 0){
      notify_error('Please select the Board');
      return;
    }

    if(this.state.patternType == 0){
      notify_error('Please select the Pattern Type');
      return;
    }

    if(this.state.patternType == PATTERN_TYPE.HORIZONTAL && totalSliptHeight != itemHeight){
      notify_error('Sum of splits height is not equal to item height');
      return;
    }

    if(this.state.patternType == PATTERN_TYPE.VERTICAL && totalSliptHeight != itemWidth){
      notify_error('Sum of splits width is not equal to item width');
      return;
    }

    let splitsWithoutCode = this.state.patternSplits.filter(s => s.code == 0);
    if(splitsWithoutCode.length > 0){
      notify_error('Code not selected for all the splits');
      return;
    }

    let splitsWithEB = this.state.patternSplits.filter(s => s.eb );
    if(splitsWithEB.length != 1){
      notify_error('Please select one laminate for Edge Band');
      return;
    }


    let newItem = JSON.parse(JSON.stringify(this.props.item));
    newItem = { ...newItem, patternBoardCode: this.state.patternBoardCode, patternType: this.state.patternType, patternSplits: this.state.patternSplits}
    let remarks = newItem.remarks;
    if(remarks.length == 0 || !remarks.includes(REMARKS.PATTERN)){
      remarks.push(REMARKS.PATTERN);
    }

    let patternBoard = getNewWoItem(); 

    patternBoard = {...patternBoard,
      itemnumber:0,
      parentId:this.props.item.itemnumber,
      height:this.boardHeight,
      width:this.boardWidth,
      quantity:this.props.item.quantity,
      code:this.state.patternBoardCode,
      childNumber:1,
      comments:'Pattern Board for Item #' + this.props.item.itemnumber
    }

    let splitItems = [];
    this.state.patternSplits.map((p,index) => {

      let  {height, width} = getPatternLaminateSize(
        this.props.item,
        this.props.material.edgebands, 
        p,
        this.state.patternSplits.length, 
        this.state.patternType, 
        patternBoard)

      let splitItem = JSON.parse(JSON.stringify(patternBoard));

      splitItem = {
        ...splitItem,
        code:p.code, 
        height, 
        width, 
        childNumber: index+2, 
        comments: 'Pattern Laminate - ' + (parseInt(index) + 1) + ' for Item #' + this.props.item.itemnumber
      } ;

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

    // let heightEB = 0;
    // let widthEB = 0;

    // widthEB += Math.round(this.state.eb_a);
    // widthEB += Math.round(this.state.eb_c);
    // heightEB += Math.round(this.state.eb_b);
    // heightEB += Math.round(this.state.eb_d);

    const boardSize = getPatternBoardSize(this.props.item,this.props.material.edgebands);
    this.boardHeight = boardSize.height;
    this.boardWidth = boardSize.width;


    let previewHeight = Math.floor(parseInt(itemHeight) / 10);
    let previewWidth = Math.floor(parseInt(itemWidth) / 10);

    let totalSliptHeight = this.getSplitSum();

    let mCodes = this.props.material.materialCodes.filter(mc => mc.board == 0 && mc.front_laminate != 0);
    if(!mCodes || mCodes.length == 0){
      return(<div>No Material Codes defined with only Laminates..</div>)
    }

    let colors = ['#555','#aaa','#999','#777','#333','#111','#eee','#ccc'];


    return(
      <div>
          <div>
            {/* <span style={{fontSize:"12px", float:"right"}}><b>Cutting Size:</b> Height: {this.boardHeight} &nbsp;  Width: {this.boardWidth}</span> */}


            <table style={{fontSize:"11px"}}>

              <tr>
                <td  style={{width:"30%"}}>
                  Board
                  <MaterialCodeDropDown onChange={this.onPatternBoardCodeChange} codeValue={this.state.patternBoardCode} item={this.props.item} material={this.props.material} excludeOnlyLaminate={true} />
                </td>
                <td style={{width:"30%"}}>
                  Pattern Type
                  <select style={{width:"150px"}}  id="patternType" name="patternType" value={this.state.patternType}  onChange={this.onChange} className="js-example-basic-single input-xs  w-100">
                  <option value="0"  >Select</option>
                  <option value={PATTERN_TYPE.HORIZONTAL} >HORIZONTAL</option>
                  <option value={PATTERN_TYPE.VERTICAL} >VERTICAL</option>
                  {/* <option value={PATTERN_TYPE.SPECIAL_DESIGN} >SPECIAL DESIGN</option>                   */}
                  </select>  
                </td>
                <td style={{width:"30%"}}>
                  Number of Laminates
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
              <tbody>

              <tr>
                <td  style={{width:"40%"}}>

                  <table  className="table  table-striped"  style={{ width:"100%", fontSize:"10px", border:"#ccc 1px solid", display:`${this.state.patternSplits.length > 0 ? "block" : "none"}`}}>
                  <tbody>
                    <tr style={{backgroundColor:"#ccc"}}>
                      <td>#</td><td>Laminate</td><td style={{width:"10px"}}>{this.state.patternType == PATTERN_TYPE.HORIZONTAL ? "Height" : "Width"}</td><td title="Edge Band" >EB</td>
                    </tr>
                  
                {
                    this.state.patternSplits.sort((a,b) => a.id > b.id ? 1 : -1 ).map((pattern,i) => {
                      return <tr key={i}>
                        <td>{pattern.id}</td>
                        <td>
                        <MaterialCodeDropDown codeValue={pattern.code} onChange={(e) => this.onPatternLaminateCodeChange(e,pattern.id)} item={this.props.item} material={this.props.material} onlyLaminate={true} />

                        </td>
                        <td>
                          <input type="text"  onChange={(e) => this.onChange(e,pattern.id)} className="form-control input-xs" maxLength="4" value={pattern.height}  id="height"  name="height"  />
                        </td>
                        <td style={{textAlign:"center", verticalAlign:"middle"}}>
                        <input type="radio" checked={pattern.eb?'checked':''}  id={'split_eb_' + pattern.id} onChange={(e) => {this.splitEBChanged(e,pattern.id)}} />
                        </td>
                      </tr>
                    })
                  }
                    <tr  style={{backgroundColor:"#ccc"}}>
                      <td></td><td >Balance</td><td>{parseInt( this.state.patternType == PATTERN_TYPE.HORIZONTAL ? this.props.item.height : this.props.item.width) - totalSliptHeight}</td><td></td>
                    </tr>
                    </tbody>
                  </table>

                </td>
                <td style={{width:"60%"}}>
                  <table style={{float:"right"}}>
                  <tbody>
                    <tr>
                      <td style={{textAlign:"center"}}><span style={{fontSize:'10px'}}>{this.props.item.width}</span></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        <div style={{border:"maroon 1px solid", margin:"0 auto",width:`${previewWidth}px`, height:`${previewHeight}px`}}>
                          {
                            this.state.patternSplits.filter(s => s.height > 0).map((split,i) => {
                              let sHeight = Math.ceil(parseInt(split.height) / 10);
                              let color = split.code == "0" ? '#fff' : colors[mCodes.findIndex(mc => mc.materialCodeNumber == split.code)];
                              return this.state.patternType == PATTERN_TYPE.HORIZONTAL  
                                ?<div key={i} style={{borderBottom:"maroon 1px solid",float:"right",width:"100%", height:`${sHeight}px`, backgroundColor:`${color}`}}></div>
                                :<div key={i} style={{borderRight:"maroon 1px solid",float:"left",width:`${sHeight - 1}px`, height:"100%", backgroundColor:`${color}`, clear:'none'}}></div>
                            })
                          }
                        </div>

                      </td>
                      <td> <span style={{fontSize:'10px'}}>{this.props.item.height}</span></td>
                    </tr>
                    </tbody>
                  </table>





                </td>

              </tr>
              </tbody>
            </table>

            <br />
            <span style={{color:'red', fontSize:'10px'}}>
              {
                (totalSliptHeight > itemHeight) ? 
                this.state.patternType == PATTERN_TYPE.HORIZONTAL ? 'Total split height is more than Item Height' : 'Total split width is more than Item Width'
                :''
              }
            </span>



 
            <hr />
            <div className="modal-footer" style={{paddingTop:"0px",paddingBottom:"5px",display:"block", textAlign:"right"}}>
            <button type="button" className="btn btn-success" onClick={() => {this.UpdateRemark()}}>Update</button>
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
