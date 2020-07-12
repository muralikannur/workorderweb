import React, { PureComponent} from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import { notify_error, notify_success, isEmptyOrSpaces }  from '../../Utils/commonUtls';
import MaterialCodeDropDown from '../materials/MaterialCodeDropDown';

import { updateDoubleThick } from './remarksActions';

class RemarksDoubleThick extends PureComponent {
 
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
      this.setState({ doubleThickWidth : this.props.doubleThickWidth });
      this.setState({ doubleThickCode : this.props.doubleThickCode == 0 ? this.props.code : this.props.doubleThickCode });
      let dblSides = this.props.doubleThickSides || "ABCD";
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

    this.props.updateDoubleThick(this.state.doubleThickWidth,dblSides,this.state.doubleThickCode)


    $('#btnRemarksClose').click();
  }

  render() {

    
    this.height = 0
    this.width = 0;

    if(this.props.height){
      if(this.props.height != '')
        this.height = parseInt(this.props.height);
      if(this.props.width != '')
        this.width = parseInt(this.props.width);
    }

    return(
      <div>
          <div>
            <table>
              <tr>
                <td>
                  <h5>Material</h5>
                  <MaterialCodeDropDown onChange={this.onChange} codeName="doubleThickCode" codeValue={this.state.doubleThickCode}  excludeOnlyLaminate={true} /> 
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

const mapStateToProps = state => (
  {
    doubleThickCode:state.config.currentItem.doubleThickCode,
    doubleThickWidth:state.config.currentItem.doubleThickWidth,
    doubleThickSides:state.config.currentItem.doubleThickSides,
    height:state.config.currentItem.height,
    width:state.config.currentItem.width,
    code:state.config.currentItem.code
    
  }
);

export default connect(
  mapStateToProps,
  {updateDoubleThick},
  null
)(RemarksDoubleThick);
