import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { edgeBandThickness } from '../../appConfig';
import { numberWithCommas } from '../../Utils/commonUtls';
import { getEBThickness }  from '../../Utils/woUtils';

class WorkOrderPreview extends Component {

  componentDidMount() {
    this.props.clearErrors();
  }

  render() {

    if(!this.props.item) return null;
    if(this.props.item.code == 1000) return null;


    this.marginL = getEBThickness(this.props.item.eb_a,this.props.material.edgebands);
    this.marginT = getEBThickness(this.props.item.eb_b,this.props.material.edgebands);
    this.marginR = getEBThickness(this.props.item.eb_c,this.props.material.edgebands);
    this.marginB = getEBThickness(this.props.item.eb_d,this.props.material.edgebands);

    this.height = 0
    this.width = 0;
    this.qty = 0;

    if(this.props.item){
      if(this.props.item.height != '')
        this.height = parseInt(this.props.item.height);
      if(this.props.item.width != '')
        this.width = parseInt(this.props.item.width);
      if(this.props.item.quantity != '')
        this.qty = parseInt(this.props.item.quantity);

    }

    this.eb = new Map();

    edgeBandThickness.forEach(e => {
      this.eb.set(e, 0);
    })

    this.eb.set(this.marginL, this.eb.get(this.marginL) + (this.height * this.qty));
    this.eb.set(this.marginR, this.eb.get(this.marginR) + (this.height * this.qty));
    this.eb.set(this.marginT, this.eb.get(this.marginT) + (this.width * this.qty));
    this.eb.set(this.marginB, this.eb.get(this.marginB) + (this.width * this.qty));

    this.bg = ''
    if(this.props.item && this.props.item.code != 0 && this.props.item.code != 100 && this.props.material.materialCodes && this.props.material.materialCodes.length > 0){
      let mCode = this.props.material.materialCodes.find(m => m.materialCodeNumber == this.props.item.code);
      let board = this.props.material.boards.find(b => b.boardNumber == mCode.board);
      let laminate = this.props.material.laminates.find(l => l.laminateNumber == mCode.front_laminate);

      let grains = "";
      if(laminate && laminate.grains != "N"){
        grains = laminate.grains;
      } else if(board){
        grains = board.grains;
      }

      if(grains == "V"){
        this.bg = 'repeating-linear-gradient(to right, #eee, #999 3px, #ccc 3px, #fff 3px)';
      } else if(grains == "H"){
        this.bg = 'repeating-linear-gradient(to bottom, #eee, #999 3px, #ccc 3px, #fff 3px)';
      }
    }

    return (
      <div className="accordion" id="accordion" role="tablist">
        <div className="card">
          <div className="card-header" role="tab" id="heading-2">
            <h6 className="mb-0">
              <a data-toggle="collapse" href="#collapse-2" aria-expanded="true" aria-controls="collapse-2">
                PREVIEW
            </a>
            </h6>
          </div>
          <div id="collapse-2" className="collapse show" role="tabpanel" aria-labelledby="heading-2" data-parent="#accordion">
            <div className="card-body" style={{ padding: "0px" }}>
              <div className="w-100 mx-auto">
                <div className="card-body d-flex py-0" style={{ padding: "0px" }}>
                  {(!this.props.item || this.props.item.itemnumber == 0 || this.props.item.code == 100) ? <div style={{ margin: "30px", color: "#ccc" }}>NO PREVIEW</div> :
                    <div className="previewItem">

                      <span style={{ fontSize:"12px", color:"maroon" }}>  &nbsp; 
                        <b>H</b>: {this.height - (this.marginT + this.marginB)} &nbsp; 
                        <b>W</b>: {this.width - (this.marginL + this.marginR)}  &nbsp;  &nbsp;
                        <b>EB</b>: {Array.from(this.eb).map((k) => {
                          return (k[0] == 0 || k[1] == 0 ? null : <span>&nbsp;{numberWithCommas(k[1])}(<b>{k[0]}</b>), &nbsp;</span> ) })} 

                      </span>

                      <table style={{ width: "100%" }}>
                        <tbody>
                          <tr>
                            <td></td>
                            <td style={{ textAlign: "center", verticalAlign: "bottom" }}><span style={{ color: "maroon", fontWeight: "bold" }}>B</span> &nbsp; <span style={{ color: "#aaa", fontSize: "small" }}>{this.width}</span> &nbsp; <span style={{ color: "maroon", fontSize: "small" }}>{this.marginT > 0 ? ' (' + this.marginT + ')' : ''}</span></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td style={{ textAlign: "right", verticalAlign: "middle" }}><span style={{ color: "maroon", fontWeight: "bold" }}>A</span> &nbsp; <span style={{ color: "#aaa", fontSize: "small" }}>{this.height}</span> &nbsp; <span style={{ color: "maroon", fontSize: "small" }}>{this.marginL > 0 ? ' (' + this.marginL + ')' : ''}</span></td>
                            <td>
                              <div style={{
                                margin: "0 auto",
                                width: `${Math.round(this.width / 10)}px`,
                                height: `${Math.round(this.height / 10)}px`,
                                borderLeftWidth: `${this.marginL * 2}px`,
                                borderTopWidth: `${this.marginT * 2}px`,
                                borderRightWidth: `${this.marginR * 2}px`,
                                borderBottomWidth: `${this.marginB * 2}px`,
                                background: `${this.bg}`
                              }}></div>
                            </td>
                            <td style={{ textAlign: "left", verticalAlign: "middle" }}><span style={{ color: "maroon", fontWeight: "bold" }}>C</span> &nbsp; <span style={{ color: "#aaa", fontSize: "small" }}>{this.height}</span> &nbsp; <span style={{ color: "maroon", fontSize: "small" }}>{this.marginR > 0 ? ' (' + this.marginR + ')' : ''}</span></td>
                          </tr>
                          <tr>
                            <td></td>
                            <td style={{ textAlign: "center", verticalAlign: "top" }}><span style={{ color: "maroon", fontWeight: "bold" }}>D</span> &nbsp; <span style={{ color: "#aaa", fontSize: "small" }}>{this.width}</span> &nbsp; <span style={{ color: "maroon", fontSize: "small" }}>{this.marginB > 0 ? ' (' + this.marginB + ')' : ''}</span></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  }
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    )

  }
}

WorkOrderPreview.propTypes = {
  item: PropTypes.object.isRequired,
  material: PropTypes.object.isRequired,
  clearErrors: PropTypes.func.isRequired
}

export default WorkOrderPreview;
