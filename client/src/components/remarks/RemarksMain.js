import React, { Component} from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { REMARKS, PATTERN_CODE } from './../../constants';
import { remarks } from '../../appConfig';
import RemarksProfile from './RemarksProfile';
import RemarksEdgeProfile from './RemarksEdgeProfile';
import RemarksDoubleThick from './RemarksDoubleThick';
import RemarksLedge from './RemarksLedge';
import RemarksShape from './RemarksShape';
import RemarksPattern from './RemarksPattern';
import RemarksGlass from './RemarksGlass';

class RemarksMain extends Component {
 
  constructor(props){
    super(props);
    this.state = {
      currentRemark:0
    }
  }

  componentWillReceiveProps(newProps){
    if(newProps.currentRemark != this.state.currentRemark)
      this.setState({currentRemark: newProps.currentRemark });
  }


  onRemarkChange = (e) => {
    const { value, name } = e.target;
    this.setState({[name]:value});
    this.props.setMaterialTab('');
    this.props.setCurrentRemark(value);

   }


showMaterialDefinition = () => {
  if(this.state.currentRemark == REMARKS.E_PROFILE || this.state.currentRemark == REMARKS.PROFILE){
   this.props.setMaterialTab('profiles');
  }

  $('#materialModal').appendTo("body");
  $('#btnMaterial').click();
 }

  render() {
    if(!this.props.item) return null;

    this.availableRemarks = remarks.map(x => x.id);
    if(this.props.item && this.props.item.remarks){
      let usedRemarks = new Set(this.props.item.remarks);
      if(this.props.item.code !== PATTERN_CODE) usedRemarks.add(REMARKS.PATTERN);
      this.availableRemarks = this.availableRemarks.filter(x => !usedRemarks.has(x));
    }




    return(
      <div>
        <div className="modal fade" id="remarksModal" tabIndex="-1" role="dialog" aria-labelledby="remarksModalLabel"  data-backdrop="static" data-keyboard="false"  >
          <div className="modal-dialog mt-0" >
            <div className="modal-content" style={{marginTop:"10px", zIndex:0}} >
              <div className="modal-header" style={{paddingTop:"2px",paddingBottom:"0px"}}>
                <h5 className="modal-title">Item #{this.props.item.itemnumber} : {this.props.currentRemark == 0 ? "Add New":""} Remark</h5>
                  
                  <button id="btnRemarksClose" type="button" className="btn btn-light" data-dismiss="modal"> Back <i className="icon-login"></i> </button>
              </div>
              <div className="modal-body" style={{paddingBottom:"0px"}}>
              {
              this.props.currentRemark == 0 ? 
              <div>
                <h5>Select the Remark Type </h5>
                <select onChange={this.onRemarkChange}   id="currentRemark" name="currentRemark" className="js-example-basic-single input-xs  w-100">
                <option selected value="0" key="0" >Select...</option>
                {this.availableRemarks.map( (ar) => {
                  return (
                    <option value={ar} key={ar} >{remarks.find(r => r.id == ar).name}</option>
                  )})}
                </select>
                </div>
              :
                <h4> {remarks.find(r => r.id == this.props.currentRemark).name}</h4>
              }

              <hr />
                {
                     this.state.currentRemark == REMARKS.PROFILE && <RemarksProfile item={this.props.item}  wo={this.props.wo} material={this.props.material}  saveItems={this.props.saveItems} setCurrentItem={this.props.setCurrentItem} />
                  || this.state.currentRemark == REMARKS.E_PROFILE && <RemarksEdgeProfile item={this.props.item}  wo={this.props.wo} material={this.props.material}  saveItems={this.props.saveItems} setCurrentItem={this.props.setCurrentItem}  />
                  || this.state.currentRemark == REMARKS.DBLTHICK && <RemarksDoubleThick item={this.props.item} wo={this.props.wo} saveItems={this.props.saveItems}  material={this.props.material}  />
                  || this.state.currentRemark == REMARKS.LEDGE && <RemarksLedge item={this.props.item} wo={this.props.wo} saveItems={this.props.saveItems} />
                  || this.state.currentRemark == REMARKS.SHAPE && <RemarksShape item={this.props.item} wo={this.props.wo} saveItems={this.props.saveItems} />
                  || this.state.currentRemark == REMARKS.PATTERN && <RemarksPattern item={this.props.item} wo={this.props.wo} saveItems={this.props.saveItems} material={this.props.material}  />
                  || this.state.currentRemark == REMARKS.GLASS && <RemarksGlass item={this.props.item} wo={this.props.wo} saveItems={this.props.saveItems} material={this.props.material}  />

                } 
                <span onClick={() => {this.showMaterialDefinition();}} style={{cursor:"pointer", color:"#555", fontSize:"12px"}}> <u>Material Definition</u> </span>
              </div>
            </div>
          </div>
        </div>
        
      </div>          
    )
  }
}

RemarksMain.propTypes = {
  item: PropTypes.object.isRequired,
  wo: PropTypes.object.isRequired,
  material: PropTypes.object.isRequired,  
  currentRemark: PropTypes.object.isRequired,    
  saveItems: PropTypes.func.isRequired
}

export default RemarksMain;
