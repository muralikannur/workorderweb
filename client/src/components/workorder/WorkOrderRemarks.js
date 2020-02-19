import React, { Component } from "react";
import { remarks } from '../../appConfig';
import { getRemarkData } from '../../Utils/woUtils';

class WorkOrderRemarks extends Component {

  render() {
    return <div> {this.props.item.remarks && this.props.item.remarks.length > 0 ? (
        this.props.item.remarks.map((id, index) => {
        let remarkName = remarks.find(r => r.id == id).name;
        let remarkData = getRemarkData(id, this.props.item, this.props.material);

        return (
          <div key={index} style={{ padding: "2px", margin: "2px", fontSize: "11px",display: "inline" }} >
            {index != 0 ? <br /> : null}
            <span
              style={{ cursor: "pointer", color: "navy" }}
              onClick={() => {
                this.props.showRemarkData(id);
              }}
            >
              {remarkData}
            </span>
            &nbsp;
            <i className="remove icon-close" title={this.REMOVE_REMARK_ICON_TITLE} style={{color: "red",cursor: "pointer",display: "inine",fontSize: "11px" }}
              onClick={() => {
                this.props.deleteRemark(id, remarkName, this.props.item.itemnumber);
              }}
            ></i>
          </div>
        );
      })
    ) : (
      <span> &nbsp; None</span>
    ) } 
    &nbsp; <i className="remove icon-plus" title="Add Remark" style={{color:"green", cursor:"pointer", display:"inline"}} onClick={()=>{this.props.addRemarkData()}}></i>
    </div>;
  }
}

export default WorkOrderRemarks;
