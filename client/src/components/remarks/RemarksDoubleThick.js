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
      doubleThickWidthA:50,
      doubleThickCodeA:0,
      doubleThickWidthB:50,
      doubleThickCodeB:0,
      doubleThickWidthC:50,
      doubleThickCodeC:0,
      doubleThickWidthD:50,
      doubleThickCodeD:0,
      A:true,
      B:true,
      C:true,
      D:true,
      sameThickness:true
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

      let dblSides = this.props.doubleThickSides || "ABCD";

      if(this.props.doubleThickData){
        if(dblSides.includes('A')){
          if(this.props.doubleThickData.A){
            this.setState({ doubleThickWidthA : this.props.doubleThickData.A.thick });
            this.setState({ doubleThickCodeA : this.props.doubleThickData.A.code == 0 ? this.props.code : this.props.doubleThickData.A.code });
          } else {
            this.setState({ doubleThickCodeA : this.props.code});
          }
        }
        if(dblSides.includes('B')){
          if(this.props.doubleThickData.B){
          this.setState({ doubleThickWidthB : this.props.doubleThickData.B.thick });
          this.setState({ doubleThickCodeB : this.props.doubleThickData.B.code == 0 ? this.props.code : this.props.doubleThickData.B.code });
          } else {
            this.setState({ doubleThickCodeB : this.props.code});
          }
        }
        if(dblSides.includes('C')){
          if(this.props.doubleThickData.C){
          this.setState({ doubleThickWidthC : this.props.doubleThickData.C.thick });
          this.setState({ doubleThickCodeC : this.props.doubleThickData.C.code == 0 ? this.props.code : this.props.doubleThickData.C.code });
          } else {
            this.setState({ doubleThickCodeC : this.props.code});
          }
        }
        if(dblSides.includes('D')){
          if(this.props.doubleThickData.D){
          this.setState({ doubleThickWidthD : this.props.doubleThickData.D.thick });
          this.setState({ doubleThickCodeD : this.props.doubleThickData.D.code == 0 ? this.props.code : this.props.doubleThickData.D.code });
          } else {
            this.setState({ doubleThickCodeD : this.props.code});
          }
        }

      } else {
        this.setState({ 
          doubleThickCodeA : this.props.code,
          doubleThickCodeB : this.props.code,
          doubleThickCodeC : this.props.code,
          doubleThickCodeD : this.props.code
        });
      }

 
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

    if(name == 'doubleThickWidthA' && this.state.sameThickness){
      this.setState({doubleThickWidthB:value,doubleThickWidthC:value,doubleThickWidthD:value});
    }
  }

  onSideChange = (side) => {
    switch (side) {
      case 'A':
        if(!this.props.doubleThickSides.includes(side)){
          this.setState({ doubleThickCodeA : this.props.code, doubleThickWidthA: 50 })
        }
        this.setState({ A : !this.state.A })
        break;
      case 'B':
        if(!this.props.doubleThickSides.includes(side)){
          this.setState({ doubleThickCodeB : this.props.code, doubleThickWidthA: 50 })
        }
        this.setState({ B : !this.state.B })
        break;
      case 'C':
        if(!this.props.doubleThickSides.includes(side)){
          this.setState({ doubleThickCodeC : this.props.code, doubleThickWidthA: 50 })
        }
        this.setState({ C : !this.state.C })
        break;
      case 'D':
        if(!this.props.doubleThickSides.includes(side)){
          this.setState({ doubleThickCodeD : this.props.code, doubleThickWidthA: 50 })
        }
        this.setState({ D : !this.state.D })
        break;       
        
    }
  }

  UpdateRemark(){

    let doubleThickData = {};

    let dblSides = "";
    if(this.state.A) dblSides += "A";
    if(this.state.B) dblSides += "B";
    if(this.state.C) dblSides += "C";
    if(this.state.D) dblSides += "D";

    if(dblSides == ""){
      notify_error('No sides selected for Double Thick');
      return;
    }

    if(this.state.A){
      if(parseInt(this.state.doubleThickWidthA) < 50){
        notify_error('Side A - Width cannot be less than 50');
        return;
      }
      if(this.state.doubleThickCodeA == 0){
        notify_error('Side A - Select the Material for the Double Thick');
        return;
      }
      doubleThickData.A = {code:this.state.doubleThickCodeA, thick:this.state.doubleThickWidthA};

    }
    if(this.state.B){
      if(parseInt(this.state.doubleThickWidthB) < 50){
        notify_error('Side B - Width cannot be less than 50');
        return;
      }
      if(this.state.doubleThickCodeB == 0){
        notify_error('Side B - Select the Material for the Double Thick');
        return;
      }
      doubleThickData.B = {code:this.state.doubleThickCodeB, thick:this.state.doubleThickWidthB};
    }
    if(this.state.C){
      if(parseInt(this.state.doubleThickWidthC) < 50){
        notify_error('Side C - Width cannot be less than 50');
        return;
      }
      if(this.state.doubleThickCodeC == 0){
        notify_error('Side C - Select the Material for the Double Thick');
        return;
      }
      doubleThickData.C = {code:this.state.doubleThickCodeC, thick:this.state.doubleThickWidthC};
    }
    if(this.state.D){
      if(parseInt(this.state.doubleThickWidthD) < 50){
        notify_error('Side D - Width cannot be less than 50');
        return;
      }
      if(this.state.doubleThickCodeD == 0){
        notify_error('Side D - Select the Material for the Double Thick');
        return;
      }
      doubleThickData.D = {code:this.state.doubleThickCodeD, thick:this.state.doubleThickWidthD};
    }





    this.props.updateDoubleThick(doubleThickData,dblSides)


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
            <table className="table stripped">
              <thead style={{fontSize:"12px"}}>
                <th>Side</th>
                <th style={{width:"60%"}}>Material</th>
                <th>Thickness <br /><span style={{fontSize:"10px"}}><input type="checkbox" onChange={()=>{this.setState({sameThickness:!this.state.sameThickness})}} checked={this.state.sameThickness ? 'checked' : ''} /> Same for all</span></th>
              </thead>
              <tbody>
              <tr style={{visibility:this.state.A?'visible':'hidden'}}>
                <td>
                  <span>A</span>
                </td>
                <td>
                  <MaterialCodeDropDown onChange={this.onChange} codeName="doubleThickCodeA" codeValue={this.state.doubleThickCodeA}  excludeOnlyLaminate={true} /> 
                </td>
                <td>
                  <input type="text" maxLength="3" id="doubleThickWidthA" name="doubleThickWidthA" value={this.state.doubleThickWidthA}  onChange={this.onChange} className="js-example-basic-single input-xs  w-100" />
                </td>
              </tr>
              <tr style={{visibility:this.state.B?'visible':'hidden'}}>
                <td>
                  <span>B</span>
                </td>
                <td>
                  <MaterialCodeDropDown onChange={this.onChange} codeName="doubleThickCodeB" codeValue={this.state.doubleThickCodeB}  excludeOnlyLaminate={true} /> 
                </td>
                <td>
                  <input disabled={this.state.sameThickness ? 'disabled' : ''} type="text" maxLength="3" id="doubleThickWidthB" name="doubleThickWidthB" value={this.state.doubleThickWidthB}  onChange={this.onChange} className="js-example-basic-single input-xs  w-100" />
                </td>
              </tr>
              <tr style={{visibility:this.state.C?'visible':'hidden'}}>
                <td>
                  <span>C</span>
                </td>
                <td>
                  <MaterialCodeDropDown onChange={this.onChange} codeName="doubleThickCodeC" codeValue={this.state.doubleThickCodeC}  excludeOnlyLaminate={true} /> 
                </td>
                <td>
                  <input disabled={this.state.sameThickness ? 'disabled' : ''} type="text" maxLength="3" id="doubleThickWidthC" name="doubleThickWidthC" value={this.state.doubleThickWidthC}  onChange={this.onChange} className="js-example-basic-single input-xs  w-100" />
                </td>
              </tr>
              <tr style={{visibility:this.state.D?'visible':'hidden'}}>
                <td>
                  <span>D</span>
                </td>
                <td>
                  <MaterialCodeDropDown onChange={this.onChange} codeName="doubleThickCodeD" codeValue={this.state.doubleThickCodeD}  excludeOnlyLaminate={true} /> 
                </td>
                <td>
                  <input disabled={this.state.sameThickness ? 'disabled' : ''} type="text" maxLength="3" id="doubleThickWidthD" name="doubleThickWidthD" value={this.state.doubleThickWidthD}  onChange={this.onChange} className="js-example-basic-single input-xs  w-100" />
                </td>
              </tr>
              </tbody>






            </table>

           
            <hr />
            
            <table>
              <tbody>
                <tr>
                  <td></td>
                  <td style={{ textAlign: "center", verticalAlign: "bottom" }}><b>B</b> - {this.width} <input type="checkbox" id = "dblB" checked={this.state.B} onClick={() => {this.onSideChange('B')}} /></td>
                  <td></td>
                </tr>
                <tr>
                  <td style={{ textAlign: "right", verticalAlign: "middle" }}><b>A</b> - {this.height} <input type="checkbox" id = "dblA" checked={this.state.A} onClick={() => {this.onSideChange('A')}} /></td>
                  <td>
                    <div style={{
                      margin: "0 auto",
                      width: `${Math.round(this.width / 10)}px`,
                      height: `${Math.round(this.height / 10)}px`,
                      border: '#555 1px solid'
                    }}></div>
                  </td>
                  <td style={{ textAlign: "left", verticalAlign: "middle" }}><b>C</b> - {this.height} <input type="checkbox" id = "dblC" checked={this.state.C} onClick={() => {{this.onSideChange('C')}}} /></td>
                </tr>
                <tr>
                  <td></td>
                  <td style={{ textAlign: "center", verticalAlign: "top" }}><b>D</b> - {this.width} <input type="checkbox" id = "dblD" checked={this.state.D} onClick={() => {{this.onSideChange('D')}}} /></td>
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
    doubleThickData:state.config.currentItem.doubleThickData,
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
