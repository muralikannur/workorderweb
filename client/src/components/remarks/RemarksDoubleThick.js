import React, { Component} from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { REMARKS, EB_START_NUMBER, PROFILE_TYPE} from '../../constants';
import { stringify } from 'querystring';
import { notify_error, notify_success, isEmptyOrSpaces }  from '../../Utils/commonUtls';
import { setDoubleThick }  from '../../Utils/remarksUtils';
import MaterialCodeDropDown from '../materials/MaterialCodeDropDown';

class RemarksDoubleThick extends Component {
 
  constructor(props){
    super(props);
    this.state = {
      doubleThickWidth:50,
      doubleThickCode:0,
      A:true,
      B:true,
      C:true,
      D:true
    }
  }
  componentDidMount(){
    setTimeout(() => {
      this.updateState();
    },200
    )
  }

  updateState() {
    //if(this.props.item != null && this.props.item.doubleThickWidth != "0"){
      this.setState({ doubleThickWidth : this.props.item.doubleThickWidth });
      this.setState({ doubleThickCode : this.props.item.doubleThickCode == 0 ? this.props.item.code : this.props.item.doubleThickCode });
      let dblSides = this.props.item.doubleThickSides || "ABCD";
      this.setState({ A : dblSides.includes("A") });
      this.setState({ B : dblSides.includes("B") });
      this.setState({ C : dblSides.includes("C") });
      this.setState({ D : dblSides.includes("D") });
    //}
  }

  onChange = (e) => {
    let { value, name } = e.target;
    if(isNaN(value)) return;
    if(value != '') value = parseInt(value);
    this.setState({[name]:value});
  }

  getEdgeBandNumber(){

    let mat = this.props.material.materialCodes.find(m => m.materialCodeNumber == this.state.doubleThickCode );
    if(mat){

      let lam = this.props.material.laminates.find(l => l.laminateNumber == mat.front_laminate);
      if(lam){
        let edgeband = this.props.material.edgebands.find(eb => eb.laminate == lam.laminateNumber && eb.eb_thickness == 0.45);
        if(edgeband) return edgeband.materialEdgeBandNumber;
      }
      let board = this.props.material.boards.find(b => b.boardNumber == mat.board);
      if(board){
        let edgeband = this.props.material.edgebands.find(eb => eb.laminate == EB_START_NUMBER.BOARD + parseInt(board.boardNumber)  && eb.eb_thickness == 0.45);
        if(edgeband) return edgeband.materialEdgeBandNumber;
      }  



      let eProfile = this.props.material.profiles.find(p => p.type == PROFILE_TYPE.E);
      if(eProfile){
        let edgeband = this.props.material.edgebands.find(eb => eb.laminate == EB_START_NUMBER.PROFILE + parseInt(eProfile.profileNumber)  && eb.eb_thickness == 0.45);
        if(edgeband) return edgeband.materialEdgeBandNumber;
      }      
      
     
    }
  }
 
  UpdateRemark(){
    if(parseInt(this.state.doubleThickWidth) < 50){
      notify_error('Width cannot be less than 50');
      return;
    }
    if(this.state.doubleThickCode == 0){
      notify_error('Select the Material for the Double Thick');
      return;
    }
    
     let ebNumber = this.getEdgeBandNumber();
    if(ebNumber == 0){
      notify_error('No Edge Band defined with 0.45 thickness');
      return;
    }

    let dblSides = "";
    if(this.state.A) dblSides += "A";
    if(this.state.B) dblSides += "B";
    if(this.state.C) dblSides += "C";
    if(this.state.D) dblSides += "D";

    if(dblSides == ""){
      notify_error('No sides selected for Double Thick');
      return;
    }

    let newItem = JSON.parse(JSON.stringify(this.props.item));

    newItem = { ...newItem, doubleThickWidth: this.state.doubleThickWidth, doubleThickSides: dblSides}
    let remarks = newItem.remarks;
    if(remarks.length == 0 || !remarks.includes(REMARKS.DBLTHICK)){
      remarks.push(REMARKS.DBLTHICK);
    }

    let newItem1 = JSON.parse(JSON.stringify(newItem));

    newItem1 = {...newItem1, 
      itemnumber:0, 
      code:this.state.doubleThickCode,
      parentId:this.props.item.itemnumber, 
      remarks:[], 
      profileNumber:0,
      doubleThickWidth:0,
      doubleThickSides:"",
      eb_a:ebNumber,eb_b:0,eb_c:0,eb_d:0,
      quantity:0,
      childNumber:1
    };

    let newItem2 = JSON.parse(JSON.stringify(newItem1));
    newItem2 = {...newItem2, 
      childNumber:2
    };

    if(!setDoubleThick(dblSides, this.props.item, newItem1, newItem2, this.state.doubleThickWidth)){
      return;
    }

    let items = this.props.wo.woitems.filter(i => i.itemnumber != this.props.item.itemnumber)
    items = items.filter(item => item.parentId != this.props.item.itemnumber);

    items = [...items,newItem]

    if(newItem1.quantity != 0){
      items = [...items,newItem1]
    }
    if(newItem2.quantity != 0){
      items = [...items,newItem2]
    }

    this.props.saveItems(items);

    $('#btnRemarksClose').click();
  }

  

  getMaterialText(m){

    if(!isEmptyOrSpaces(m.shortname)) return '[' + m.materialCodeNumber + '] ' + m.shortname;

    const b = (m.board != 0 ? this.props.material.boards.find(i => i.boardNumber == m.board) : null);
    const fl =(m.front_laminate != 0 ?  this.props.material.laminates.find(i => i.laminateNumber == m.front_laminate): null);
    const bl = (m.back_laminate != 0 ? this.props.material.laminates.find(i => i.laminateNumber == m.back_laminate): null);

    let matText = '[' + m.materialCodeNumber + '] ' + (m.board == 0 ? 'No Board' : 'B: ' + b.type + ' - ' + b.thickness + 'mm (' + b.height + ' x ' +  b.width + ') - ' + b.grains);
    matText += (m.front_laminate == 0 ? '' : ', FL: ' + fl.code + ' - ' + fl.thickness + 'mm - ' + fl.grains);
    matText += (m.back_laminate == 0 ? '' : ', BL: ' + bl.code + ' - ' + bl.thickness + 'mm - ' + bl.grains);
    return matText;
  }


  render() {

    
    this.height = 0
    this.width = 0;

    if(this.props.item){
      if(this.props.item.height != '')
        this.height = parseInt(this.props.item.height);
      if(this.props.item.width != '')
        this.width = parseInt(this.props.item.width);
    }

    return(
      <div>
          <div>
            <table>
              <tr>
                <td>
                  <h5>Material</h5>
                  <div className="form-group" style={{marginBottom:"0px"}}>
                      <select id="childcode" onChange={this.onChange}  value={this.state.doubleThickCode}  name="doubleThickCode" className="js-example-basic-single input-xs  w-100">
                      {
                        this.props.material.materialCodes.sort((a,b) => a.materialCodeNumber > b.materialCodeNumber ? 1 : -1).map( (m) => {
                        let matText =  this.getMaterialText(m);
                        return (
                          <option value={m.materialCodeNumber} key={m.materialCodeNumber} >{matText}</option>
                        )})}
                      </select>
                    </div>
                </td>
                <td>
                  <h5>Width</h5>
                  <input type="text" maxLength="3" id="doubleThickWidth" name="doubleThickWidth" value={this.state.doubleThickWidth}  onChange={this.onChange} className="js-example-basic-single input-xs  w-100" />
 
                </td>
              </tr>
            </table>

           
            <hr />
            
            <table>
                        <tbody>
                          <tr>
                            <td></td>
                            <td style={{ textAlign: "center", verticalAlign: "bottom" }}><b>B</b> - {this.width} <input type="checkbox" id = "dblB" checked={this.state.B} onClick={() => {this.setState({ B : !this.state.B })}} /></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td style={{ textAlign: "right", verticalAlign: "middle" }}><b>A</b> - {this.height} <input type="checkbox" id = "dblA" checked={this.state.A} onClick={() => {this.setState({ A : !this.state.A })}} /></td>
                            <td>
                              <div style={{
                                margin: "0 auto",
                                width: `${Math.round(this.width / 10)}px`,
                                height: `${Math.round(this.height / 10)}px`,
                                border: '#555 1px solid'
                              }}></div>
                            </td>
                            <td style={{ textAlign: "left", verticalAlign: "middle" }}><b>C</b> - {this.height} <input type="checkbox" id = "dblC" checked={this.state.C} onClick={() => {this.setState({ C : !this.state.C })}} /></td>
                          </tr>
                          <tr>
                            <td></td>
                            <td style={{ textAlign: "center", verticalAlign: "top" }}><b>D</b> - {this.width} <input type="checkbox" id = "dblD" checked={this.state.D} onClick={() => {this.setState({ D : !this.state.D })}} /></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
            
            <br />
            <div className="modal-footer" style={{paddingTop:"0px",paddingBottom:"5px",display:"block", textAlign:"right"}}>
            <button type="button" class="btn btn-success" onClick={() => {this.UpdateRemark()}}>Update</button>
            </div>   
          </div>
    
         <br />

      </div>          

    )
    
  }
}

RemarksDoubleThick.propTypes = {
  wo: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  material: PropTypes.object.isRequired,  
  saveItems: PropTypes.func.isRequired
}


export default RemarksDoubleThick;
