import React, { Component} from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { REMARKS, EB_START_NUMBER, PROFILE_TYPE} from '../../constants';
import { notify_error, notify_success }  from '../../util';

class RemarksDoubleThick extends Component {
 
  constructor(props){
    super(props);
    this.state = {
      doubleThickWidth:80
    }
  }
  componentDidMount(){
    setTimeout(() => {
      this.updateState();
    },200
    )
  }

  updateState() {
    if(this.props.item != null && this.props.item.doubleThickWidth != "0"){
      this.setState({ doubleThickWidth : this.props.item.doubleThickWidth })
    }
  }

  onChange = (e) => {
    const { value, name } = e.target;
    if(isNaN(value)) return;
    this.setState({[name]:value});
  }

  getEdgeBandNumber(){
    let mat = this.props.material.materialCodes.find(m => m.materialCodeNumber == this.props.item.code );
    if(mat){

      let lam = this.props.material.laminates.find(l => l.laminateNumber == mat.front_laminate);
      if(lam){
        let edgeband = this.props.material.edgebands.find(eb => eb.laminate == lam.laminateNumber && eb.eb_thickness == 0.45);
        if(edgeband) return edgeband.materialEdgeBandNumber;
      }

      let board = this.props.material.boards.find(b => b.boardNumber == mat.board);
      if(board){
        let edgeband = this.props.material.edgebands.find(eb => eb.laminate == EB_START_NUMBER.BOARD + parseInt(lam.laminateNumber)  && eb.eb_thickness == 0.45);
        if(edgeband) return edgeband.materialEdgeBandNumber;
      }  

      let eProfile = this.props.material.profiles.find(p => p.type == PROFILE_TYPE.E);
      if(eProfile){
        let edgeband = this.props.material.edgebands.find(eb => eb.laminate == EB_START_NUMBER.PROFILE + parseInt(eProfile.profileNumber)  && eb.eb_thickness == 0.45);
        if(edgeband) return edgeband.materialEdgeBandNumber;
      }      
      
      return 0;
      
    }
  }
 
  UpdateRemark(){
    if(parseInt(this.state.doubleThickWidth) < 80){
      notify_error('Width cannot be less than 80');
      return;
    }
    
    let ebNumber = this.getEdgeBandNumber();
    if(ebNumber == 0){
      notify_error('No Edge Band defined with 0.45 thickness');
      return;
    }


    var newItem = { ...this.props.item, doubleThickWidth: this.state.doubleThickWidth}
    let remarks = this.props.item.remarks;
    if(remarks.length == 0 || !remarks.includes(REMARKS.DBLTHICK)){
      remarks.push(REMARKS.DBLTHICK);
      newItem = { ...newItem, remarks}
    }



    let newItem1 = {...this.props.item, 
      itemnumber:0, 
      parentId:this.props.item.itemnumber, 
      remarks:[], 
      profileType:0,
      doubleThickWidth:0,
      width:this.state.doubleThickWidth,
      eb_a:ebNumber,eb_b:0,eb_c:0,eb_d:0,
      quantity:this.props.item.quantity * 2
    };


    let newItem2 = {...newItem1, 
      width:this.state.doubleThickWidth,
      height:this.props.item.width - (parseInt(this.state.doubleThickWidth)*2)
    };
 

    let items = this.props.wo.woitems.filter(i => i.itemnumber != this.props.item.itemnumber)
    items = items.filter(item => item.parentId != this.props.item.itemnumber);

    items = [...items,newItem,newItem1,newItem2]
    this.props.saveItems(items);

    $('#btnRemarksClose').click();
  }
  render() {
    return(
      <div>
          <div>
            <h5>Double Thick Width</h5>
            <input type="text" maxLength="3" id="doubleThickWidth" name="doubleThickWidth" value={this.state.doubleThickWidth}  onChange={this.onChange} className="js-example-basic-single input-xs  w-100" />
            
            <hr /><br />
            <div className="modal-footer" style={{paddingTop:"0px",paddingBottom:"5px",display:"block", textAlign:"right"}}>
            <button type="button" class="btn btn-success" onClick={() => {this.UpdateRemark()}}>Update</button>
            </div>   
          </div>
    
         <br />

      </div>          

    )
    
  }
}

RemarksDoubleThick.propTypes = {
  wo: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  material: PropTypes.object.isRequired,  
  saveItems: PropTypes.func.isRequired
}


export default RemarksDoubleThick;
