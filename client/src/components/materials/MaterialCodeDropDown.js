import React, { Component } from "react";
import { getMaterialText }  from '../../Utils/woUtils';
import { PATTERN_CODE} from '../../constants';
class MaterialCodeDropDown extends Component {



  render() {

    let mCodes = this.props.material.materialCodes;
    if(this.props.onlyLaminate){
      mCodes = mCodes.filter(m => m.board == "0")
    } else if(this.props.onlyBoard){
      mCodes = mCodes.filter(m => m.front_laminate == "0" && m.back_laminate == "0")
    }else if(this.props.excludeOnlyLaminate){
      mCodes = mCodes.filter(m => m.board != "0" && m.back_laminate == "0")
    }


    return (
      <div className="form-group" style={{marginBottom:"0px"}}>
      <select id="code" onChange={(e) => {this.props.onChange(e,this.props.item.childNumber,this.props.item.parentId)}}  value={this.props.item.code}  name="code" className="js-example-basic-single input-xs  w-100">
      <option value="0">Select the Material</option>  
      {
        mCodes.sort((a,b) => a.materialCodeNumber > b.materialCodeNumber ? 1 : -1).map( (m) => {
        let matText =  getMaterialText(m, this.props.material);
        return (
          <option value={m.materialCodeNumber} key={m.materialCodeNumber} >{matText}</option>
        )})}
        {this.props.showPattern ? <option value={PATTERN_CODE}>PATTERN</option> : null}
      </select>
    </div>
    )
  }
}

export default MaterialCodeDropDown;
