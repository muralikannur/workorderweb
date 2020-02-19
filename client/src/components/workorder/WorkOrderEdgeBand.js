import React, { Component } from "react";
import $ from 'jquery';

class WorkOrderEdgeBand extends Component {



  render() {

    let isProfile = false;
    if(this.props.handleProfile){
      if(this.props.EBname == "eb_c"){
        if(this.props.profileSide == 'H'){
          isProfile = true;
        }
      }
      if(this.props.EBname == "eb_d"){
        if(this.props.profileSide == 'W'){
          isProfile = true;
        }
      }
    }

    return (
      <div className="form-group" style={{marginBottom:"0px"}}>
      {
        isProfile ? <input type="text" className="form-control input-xs" maxLength="4" value={' HP  ' + this.props.handleProfile.height}  disabled /> :

        <select id={this.props.EBname} onChange={this.props.onChange}  value={this.props.EBvalue} name={this.props.EBname} className="js-example-basic-single input-xs  w-100">
          {
            this.props.ebOptions.map( (e) => {
              return (
                <option value={e.materialEdgeBandNumber}  key={e.materialEdgeBandNumber} >{e.eb_thickness} - {e.eb_width}</option>
              )})
          }
          <option id="0">New...</option>
        </select>
      }
    </div>
    )
  }
}

export default WorkOrderEdgeBand;
