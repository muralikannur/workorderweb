import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { getGrains, getEBThickness } from './woCommonActions';

import { edgeBandThickness } from '../../appConfig';
import { PATTERN_CODE} from '../../constants';

class WorkOrderPreview extends PureComponent {


  render() {

    if(this.props.itemnumber == -1) return null;
    if(this.props.code == PATTERN_CODE) return null;


    this.marginL = this.props.getEBThickness(this.props.eb_a);
    this.marginT = this.props.getEBThickness(this.props.eb_b);
    this.marginR = this.props.getEBThickness(this.props.eb_c);
    this.marginB = this.props.getEBThickness(this.props.eb_d);

    let handleProfile = this.props.profiles.find(p => p.profileNumber == this.props.profileNumber)

    let isWidthHP = false, isHeightHP = false;
    if(handleProfile){
      if(this.props.profileSide == 'W'){
        this.marginB = Math.round(handleProfile.height / 8);
        isWidthHP = true;
      }
      if(this.props.profileSide == 'H'){
        this.marginR = Math.round(handleProfile.height / 8);
        isHeightHP = true;
      }
    }

    console.log(isHeightHP)


    this.height = 0
    this.width = 0;
    this.qty = 0;

    if(this.props.height != '')
      this.height = parseInt(this.props.height);
    if(this.props.width != '')
      this.width = parseInt(this.props.width);
    if(this.props.quantity != '')
      this.qty = parseInt(this.props.quantity);


    this.eb = new Map();

    edgeBandThickness.forEach(e => {
      this.eb.set(e, 0);
    })

    this.eb.set(this.marginL, this.eb.get(this.marginL) + (this.height * this.qty));
    this.eb.set(this.marginR, this.eb.get(this.marginR) + (this.height * this.qty));
    this.eb.set(this.marginT, this.eb.get(this.marginT) + (this.width * this.qty));
    this.eb.set(this.marginB, this.eb.get(this.marginB) + (this.width * this.qty));

    this.bg = ''
    if(this.props.code != 0 && this.props.code != PATTERN_CODE){

      let grains = this.props.getGrains(this.props.code);
     
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
                <b>PREVIEW </b>{(this.props.itemnumber != 0) ? ' Item # ' + this.props.itemnumber:''}
            </a>
            </h6>
          </div>
          <div id="collapse-2" className="collapse show" role="tabpanel" aria-labelledby="heading-2" data-parent="#accordion">
            <div className="card-body" style={{ padding: "0px" }}>
              <div className="w-100 mx-auto">
                <div className="card-body d-flex py-0" style={{ padding: "0px" }}>
                  {(this.props.itemnumber <= 0 || this.props.code == PATTERN_CODE) ? <div style={{ margin: "30px", color: "#ccc" }}>NO PREVIEW</div> :
                    <div className="previewItem">

                      {/* <span style={{ fontSize:"12px", color:"maroon" }}>  &nbsp; 
                        <b>H</b>: {this.height - (this.marginT + this.marginB)} &nbsp; 
                        <b>W</b>: {this.width - (this.marginL + this.marginR)}  &nbsp;  &nbsp;
                        <b>EB</b>: {Array.from(this.eb).map((k,i) => {
                          return (k[0] == 0 || k[1] == 0 ? null : <span key={i}>&nbsp;{numberWithCommas(k[1])}(<b>{k[0]}</b>), &nbsp;</span> ) })} 

                      </span> */}

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
                                background: `${this.bg}`,
                                borderRightColor: isHeightHP?'red':'maroon',
                                borderBottomColor: isWidthHP?'red':'maroon'
                              }}></div>
                            </td>
                            <td style={{ textAlign: "left", verticalAlign: "middle" }}>
                              <span style={{color: 'maroon', fontWeight: "bold" }}>C</span> &nbsp; 
                              <span style={{ color: "#aaa", fontSize: "small" }}>{this.height}</span> &nbsp; 
                              {isHeightHP?
                              <span style={{ color: "red", fontSize: "small" }}> ({handleProfile.height})</span>
                              :
                              <span style={{ color: "maroon", fontSize: "small" }}>{this.marginR > 0 ? ' (' + this.marginR + ')' : ''}</span>
                              }
                              
                            </td>
                          </tr>
                          <tr>
                            <td></td>
                            <td style={{ textAlign: "center", verticalAlign: "top" }}>
                              <span style={{ color: "maroon", fontWeight: "bold" }}>D</span> &nbsp; 
                              <span style={{ color: "#aaa", fontSize: "small" }}>{this.width}</span> &nbsp; 
                              {isWidthHP?
                              <span style={{ color: "red", fontSize: "small" }}> ({handleProfile.height})</span>
                              :
                              <span style={{ color: "maroon", fontSize: "small" }}>{this.marginB > 0 ? ' (' + this.marginB + ')' : ''}</span>
                              }
                            </td>
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


const mapStateToProps = state => (
  {

    profiles: state.material.profiles,

    itemnumber:state.config.currentItem.itemnumber,
    code:state.config.currentItem.code,
    height:state.config.currentItem.height,
    width:state.config.currentItem.width,
    quantity:state.config.currentItem.quantity,
    profileNumber:state.config.currentItem.profileNumber,
    profileSide:state.config.currentItem.profileSide,    
    eb_a : state.config.currentItem.eb_a,
    eb_b : state.config.currentItem.eb_b,
    eb_c : state.config.currentItem.eb_c,
    eb_d : state.config.currentItem.eb_d

  }
);

export default connect(
  mapStateToProps,
  {getGrains, getEBThickness},
  null
)(WorkOrderPreview);