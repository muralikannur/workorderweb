import React, { PureComponent } from "react";
import $ from 'jquery';

import {EB_START_NUMBER} from '../../constants'

class WorkOrderEdgeBand extends PureComponent {



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

    let titleText = '';

    return (
      <div className="form-group" style={{marginBottom:"0px"}}>
      {
        isProfile ? <input type="text" className="form-control input-xs" maxLength="4" value={' HP  ' + this.props.handleProfile.height}  disabled /> :

        <select id={this.props.EBname} onChange={ (e) => this.props.onChange(e,(this.props.item ? this.props.item.childNumber : null),(this.props.item ? this.props.item.parentId:null))}  value={this.props.EBvalue} name={this.props.EBname} className="js-example-basic-single input-xs  w-100">
          {
            
            this.props.ebOptions.map( (e) => {
              titleText = '';
              if(this.props.item){
                if(e.laminate >= EB_START_NUMBER.BOARD){
                  let b =  this.props.material.boards.find(b => b.boardNumber == e.laminate - EB_START_NUMBER.BOARD )
                  if(b){
                    titleText = b.type;
                  }
                }
                else{
                  let l =  this.props.material.laminates.find(l => l.laminateNumber == e.laminate)
                  if(l){
                    titleText = l.code;
                  }
                }
              }
              
              return (
              <option title={titleText} value={e.materialEdgeBandNumber}  key={e.materialEdgeBandNumber} > {e.laminate > 200 ? 'EP:' : ''} {e.eb_thickness} - {e.eb_width}</option>
              )})
          }
          {/* <option id="0">New...</option> */}
        </select>
      }
    </div>
    )
  }
}

export default WorkOrderEdgeBand;
