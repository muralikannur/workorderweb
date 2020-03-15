import React, { Component} from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { REMARKS, EB_START_NUMBER, PROFILE_TYPE} from '../../constants';
import { notify_error, notify_success, isEmptyOrSpaces }  from '../../Utils/commonUtls';
import { setDoubleThick }  from '../../Utils/remarksUtils';
import MaterialCodeDropDown from '../materials/MaterialCodeDropDown';
import { getNewWoItem }  from '../../Utils/woUtils';

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

  UpdateRemark(){
    if(parseInt(this.state.doubleThickWidth) < 50){
      notify_error('Width cannot be less than 50');
      return;
    }
    if(this.state.doubleThickCode == 0){
      notify_error('Select the Material for the Double Thick');
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

    let newItem1 = getNewWoItem() //JSON.parse(JSON.stringify(newItem));
    const {eb_a, eb_b, eb_c, eb_d, height, width, quantity} = newItem;
    newItem1 = {...newItem1, 
      itemnumber:0, 
      childNumber:1,
      code:this.state.doubleThickCode,
      parentId:this.props.item.itemnumber,
      eb_a, eb_b, eb_c, eb_d, height, width, quantity

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
                  <MaterialCodeDropDown onChange={this.onChange} codeName="doubleThickCode" codeValue={this.state.doubleThickCode} item={this.props.item} material={this.props.material}  excludeOnlyLaminate={true} /> 
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
            <button type="button" className="btn btn-success" onClick={() => {this.UpdateRemark()}}>Update</button>
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
