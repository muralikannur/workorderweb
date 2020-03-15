import React, { Component} from 'react';

import { REMARKS, EB_START_NUMBER} from '../../constants';
import { getMaterialText, getEBText }  from '../../Utils/woUtils';

//Components
import WorkOrderEdgeBand from './WorkOrderEdgeBand';
import MaterialCodeDropDown from '../materials/MaterialCodeDropDown';


class WorkOrderChild extends Component {


  render() {

    if(!this.props.childitems || this.props.childitems.length == 0) return <tr><td>no child</td></tr>;

          //EDGE BAND OPTIONS----------------------------------------------------------------  
          let ebOptions = [{
            materialEdgeBandNumber:0,
            laminate:'0',
            eb_thickness:'',
            eb_width:'',
          }];

          let ebWithoutProfiles = this.props.material.edgebands.filter(e => e.laminate < EB_START_NUMBER.PROFILE )
          let childEBOptions = [...ebOptions, ...ebWithoutProfiles];

          let [editA, editB, editC, editD, editCode] = Array(4).fill(false);

          let item = this.props.item;
          if(item.remarks.includes(REMARKS.DBLTHICK)){
              editCode = true;
              if(item.doubleThickSides.includes('A')) editA = true;
              if(item.doubleThickSides.includes('B')) editB = true;
              if(item.doubleThickSides.includes('C')) editC = true;
              if(item.doubleThickSides.includes('D')) editD = true;
          }
                      
          

          return(
            this.props.childitems.sort((a,b) => a.childNumber > b.childNumber ? 1 : -1)
              .map((child,i) => {

                let mCode = this.props.material.materialCodes.find(m => m.materialCodeNumber == child.code);

                return(
              
                <tr key={i} style={{backgroundColor:"#ddd", color:"#555", padding:"2px"}}>
                <td style={{backgroundColor:"#fff"}}></td>
                <td>
                {editCode?
                    <MaterialCodeDropDown onChange={this.props.onChange} item={child} material={this.props.material}  excludeOnlyLaminate={true} /> 
                    :
                    <input type="text" value={getMaterialText(mCode,this.props.material)} className="form-control input-xs" disabled  />
                }
                </td>                
                <td></td>
                <td>{child.height}</td>
                <td>{child.width}</td>
                <td>{child.quantity}</td>
                <td></td>
                <td>
                {editA?
                    <WorkOrderEdgeBand item={child} material={this.props.material} setMaterialTab={this.props.setMaterialTab} ebOptions={childEBOptions} EBvalue={child.eb_a} EBname="eb_a" onChange={this.props.onChange} />
                    :
                    <input type="text" className="form-control input-xs" disabled value={getEBText(child.eb_a,this.props.material.edgebands)} />
                }

                </td>
                <td>
                {editA?
                    <i className={child.ebCopied?"icon icon-arrow-left-circle":"icon icon-arrow-right-circle"} title="Copy to BCD" style={{color:"blue", cursor:"pointer",paddingTop:"4px", display:"block", float:"left"}} onClick={()=>{this.props.copyAtoBCD(child)}}></i>
                :null
                
                }
                </td>
                <td>
                {editB?
                    <WorkOrderEdgeBand item={child} material={this.props.material} setMaterialTab={this.props.setMaterialTab} ebOptions={childEBOptions} EBvalue={child.eb_b} EBname="eb_b" onChange={this.props.onChange} />
                    :
                    <input type="text" className="form-control input-xs" disabled  value={getEBText(child.eb_b,this.props.material.edgebands)}  />
                }
                </td>
                <td>
                {editC?
                    <WorkOrderEdgeBand item={child} material={this.props.material} setMaterialTab={this.props.setMaterialTab} ebOptions={childEBOptions} EBvalue={child.eb_c} EBname="eb_c" onChange={this.props.onChange} />
                    :
                    <input type="text" className="form-control input-xs" disabled  value={getEBText(child.eb_c,this.props.material.edgebands)}  />
                }
                </td>
                <td>
                {editD?
                    <WorkOrderEdgeBand item={child} material={this.props.material} setMaterialTab={this.props.setMaterialTab} ebOptions={childEBOptions} EBvalue={child.eb_d} EBname="eb_d" onChange={this.props.onChange} />
                    :
                    <input type="text" className="form-control input-xs" disabled  value={getEBText(child.eb_d,this.props.material.edgebands)}  />
                }
                </td>
                <td><input type="text" className="form-control input-xs" value={child.comments}  id="comments"  name="comments" onChange={(e) => {this.props.onChange(e,child.childNumber, this.props.item.itemnumber)}}  /></td>
                <td></td>
              </tr>
                )
          })

        );
    
  }
}


export default WorkOrderChild;

