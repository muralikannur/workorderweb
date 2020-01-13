import React, { Component} from 'react';

import { edgeBandThickness, edgeBandWidth } from '../../appConfig';
import { EB_START_NUMBER } from '../../constants';

class MaterialEdgeBand extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentItem:0,
            materialEdgeBands:[],
            tabClicked:'tab-board',
            isLoaded:false,
            saveClicked:false
        };
    }

  componentWillReceiveProps(newProps){
    if(newProps.material.edgebands  && (this.state.materialEdgeBands.length == 0 & !this.state.isLoaded) ){
      this.setState({materialEdgeBands: newProps.material.edgebands })
      this.setState({isLoaded:true})
    }

    if(newProps.isSaveClicked && !this.state.saveClicked && this.state.tabClicked == 'tab-edgeband'){
      this.setState({saveClicked: true});
      this.props.save('edgeband',this.state.materialEdgeBands)
      return;
    }
    if(!newProps.isSaveClicked){
      this.setState({saveClicked: false});
    }

    if(newProps.tabClicked != this.state.tabClicked){
      if(this.state.tabClicked == 'tab-edgeband' || this.state.tabClicked == ''){
        if(newProps.tabClicked != '' && newProps.tabClicked != 'tab-edgeband')  {
          this.tabChanged(newProps.tabClicked);
          return;
        }
      }
    }
    this.setState({tabClicked: newProps.tabClicked});

    
  }

  tabChanged = (tabClicked) => {
    if(this.props.save('edgeband',this.state.materialEdgeBands)){
      this.setState({tabClicked});
    }
  }

  onItemClick = (i) => {
    this.setState({currentItem:i})
  }
  onChange = (e) => {
    let { value, name } = e.target;

    if(name=="eb_thickness") value = parseFloat(e.target.value);
    if(name=="eb_width") value = parseInt(e.target.value);

    var materialEdgeBands = this.state.materialEdgeBands;
    var materialEdgeBand = materialEdgeBands.find(i => i.materialEdgeBandNumber == this.state.currentItem);
    var newMaterialEdgeBand = { ...materialEdgeBand, [name]: value}

    materialEdgeBands = materialEdgeBands.filter(i => i.materialEdgeBandNumber != this.state.currentItem)
    materialEdgeBands = [...materialEdgeBands,newMaterialEdgeBand]
    this.setState({materialEdgeBands});
  }

  
  addItem = (laminateNumber) => {
    const maxId = this.getMaxId();
    const newMaterialEdgeBand = {
      materialEdgeBandNumber:maxId,
      laminate:laminateNumber,
      eb_thickness:'',
      eb_width:'',
    }
    this.setState({materialEdgeBands: [...this.state.materialEdgeBands, newMaterialEdgeBand], currentItem:maxId});
    //this.props.saveItems( [...this.state.woitems, newItem]);
  }

  getMaxId = () => {
    let maxId = 1;
    if(this.state.materialEdgeBands.length > 0){
      let item = this.state.materialEdgeBands.sort((a, b) => (a.materialEdgeBandNumber < b.materialEdgeBandNumber) ? 1 : -1).slice(0, 1);
      maxId = (item[0].materialEdgeBandNumber) + 1;
    }
    return maxId;
  }

  deleteItem = (id) => {
    this.setState({currentItem:id})
    setTimeout(() => {
      let edgebands = this.state.materialEdgeBands;
      let isDelete = false;
      if(this.isUsed(id)){
        let msg = 'WARNING! This Edge Band is used in the Items \n\n';
        msg += 'Are you sure that you want to delete this ??\n\n';
        if(window.confirm(msg,'Shape')){
          isDelete = true
        }
      } else {
        isDelete = true
      }
      if(isDelete){
        var newMaterialEdgeBands = edgebands.filter(materialEdgeBand => materialEdgeBand.materialEdgeBandNumber != id);
        this.setState({materialEdgeBands: newMaterialEdgeBands, currentItem:0});
      }

    },100
    )
  }


  ToLoginPage = () => {
    const { history } = this.props;
    if(history) history.push('/login');
   }
   
  isUsed = (id) => {
    if(id == 0) return false;
    if(this.props.items && this.props.items.find(i => i.eb_a == id || i.eb_b == id || i.eb_c == id || i.eb_d == id )){
      return true;
    }
    return false;
  }
  render() {
    if((!this.props.material.laminates || this.props.material.laminates.length == 0) && (!this.props.material.boards || !this.props.material.boards.find(b => b.allowEdgeBand))) {return <h5>No Laminates defined.</h5>};
    return(
        <div className="row">
        <div className="col-md-12 pl-md-5">
        <h3 style={{color:"#7ed321"}}>Edge Band <span style={{color:"#fff"}}>{this.state.currentItem}</span></h3>
        <table className="table" style={{border:"#ccc 1px solid", width:"50%"}}>
        {/* <tr  style={{padding:"0px"}}>
              <th style={{width:"20%", backgroundColor:"#ddd"}}> Laminate</th>
              <th style={{width:"80%", backgroundColor:"#ddd"}}> Edge Bands</th>
        </tr> */}

        

        {
            this.props.material.laminates.sort((a,b) => a.laminateNumber > b.laminateNumber ? 1  : -1 ).map( (laminate) => {
            return (
            <tr >
              <td style={{backgroundColor:"#eee", lineHeight:"5", fontWeight:"bold", padding:"5px", border:"#ccc 1px solid", textAlign:"center", width:"600px"}}>{laminate.code} {laminate.thickness} ({laminate.grains})</td>
              <td>   
                  <table className="table" style={{width:"300px"}}>
                  <tr  style={{lineHeight:"1", fontWeight:"normal"}}>
                        <th style={{width:"5%"}}>#</th>
                        <th style={{width:"40%"}}> Thickness</th>
                        <th style={{width:"40%"}}> Width</th>
                        <th style={{width:"15%"}}></th>
                  </tr>
                  {this.state.materialEdgeBands.filter(eb => eb.laminate == laminate.laminateNumber).sort((a,b) => a.materialEdgeBandNumber > b.materialEdgeBandNumber ? 1  : -1 ).map( (materialEdgeBand, i) => {
                  return (
                  <tr  onClick={() => this.onItemClick(materialEdgeBand.materialEdgeBandNumber)}  style={{backgroundColor:this.isUsed(laminate.laminateNumber)?'#FFB3B3':'#fff'}}>
                      <td style={{textAlign:"center"}}>{i + 1}</td>
                      <td>
                          <div className="form-group" style={{marginBottom:"0px"}}>
                              <select  onChange={this.onChange} defaultValue={materialEdgeBand.eb_thickness}  id="eb_thickness" name="eb_thickness" className="js-example-basic-single input-xs  w-100">
                              {edgeBandThickness.map( (e) => {
                              return (
                              <option value={e} key={e} >{e}</option>
                              )})}
                              </select>
                          </div>
                      </td>
                      <td>
                          <div className="form-group" style={{marginBottom:"0px"}}>
                              <select  onChange={this.onChange} defaultValue={materialEdgeBand.eb_width}  id="eb_width" name="eb_width" className="js-example-basic-single input-xs  w-100">
                              {edgeBandWidth.map( (e) => {
                              return (
                              <option value={e} key={e} >{e}</option>
                              )})}
                              </select>
                          </div>
                      </td>


                      <td>
                      &nbsp;            
                      <i className="remove icon-close" title="Remove" style={{color:"red", cursor:"pointer",paddingTop:"4px", display:"block", float:"right"}} onClick={()=>{this.deleteItem(materialEdgeBand.materialEdgeBandNumber, i+1)}}></i>
                      </td>

                  </tr>)
                  })} 
                </table>

                <span id="btnAddItem" className="btn btn-xs btn-rounded btn-outline-success mr-2" style={{cursor:"pointer", margin:"5px", fontWeight:"bold"}} onClick={()=>{this.addItem(laminate.laminateNumber)}}> Add </span>

              </td>       
            </tr>)
            })}



{
            this.props.material.boards.filter(b => b.allowEdgeBand).sort((a,b) => a.boardNumber > b.boardNumber ? 1  : -1 ).map( (board) => {
            return (
            <tr >
              <td style={{backgroundColor:"#eee", lineHeight:"5", fontWeight:"bold", padding:"5px", border:"#ccc 1px solid", textAlign:"center", width:"600px"}}>{board.type} - ( {board.height} x {board.width})</td>
              <td>   
                  <table className="table" style={{width:"300px"}}>
                  <tr  style={{lineHeight:"1", fontWeight:"normal"}}>
                        <th style={{width:"5%"}}>#</th>
                        <th style={{width:"40%"}}> Thickness</th>
                        <th style={{width:"40%"}}> Width</th>
                        <th style={{width:"15%"}}></th>
                  </tr>
                  {this.state.materialEdgeBands.filter(eb => eb.laminate == parseInt(board.boardNumber) + EB_START_NUMBER.BOARD).sort((a,b) => a.materialEdgeBandNumber > b.materialEdgeBandNumber ? 1  : -1 ).map( (materialEdgeBand, i) => {
                  return (
                  <tr  onClick={() => this.onItemClick(materialEdgeBand.materialEdgeBandNumber)}  style={{backgroundColor:this.isUsed(parseInt(board.boardNumber) + EB_START_NUMBER.BOARD)?'#FFB3B3':'#fff'}}>
                      <td style={{textAlign:"center"}}>{i + 1}</td>
                      <td>
                          <div className="form-group" style={{marginBottom:"0px"}}>
                              <select  onChange={this.onChange} defaultValue={materialEdgeBand.eb_thickness}  id="eb_thickness" name="eb_thickness" className="js-example-basic-single input-xs  w-100">
                              {edgeBandThickness.map( (e) => {
                              return (
                              <option value={e} key={e} >{e}</option>
                              )})}
                              </select>
                          </div>
                      </td>
                      <td>
                          <div className="form-group" style={{marginBottom:"0px"}}>
                              <select  onChange={this.onChange} defaultValue={materialEdgeBand.eb_width}  id="eb_width" name="eb_width" className="js-example-basic-single input-xs  w-100">
                              {edgeBandWidth.map( (e) => {
                              return (
                              <option value={e} key={e} >{e}</option>
                              )})}
                              </select>
                          </div>
                      </td>


                      <td>
                      &nbsp;            
                      <i className="remove icon-close" title="Remove" style={{color:"red", cursor:"pointer",paddingTop:"4px", display:"block", float:"right"}} onClick={()=>{this.deleteItem(materialEdgeBand.materialEdgeBandNumber, i+1)}}></i>
                      </td>

                  </tr>)
                  })} 
                </table>

                <span id="btnAddItem" className="btn btn-xs btn-rounded btn-outline-success mr-2" style={{cursor:"pointer", margin:"5px", fontWeight:"bold"}} onClick={()=>{this.addItem(parseInt(board.boardNumber) + EB_START_NUMBER.BOARD)}}> Add </span>

              </td>       
            </tr>)
            })}


        </table>


        </div>
      </div>
    )
    
  }
}


export default MaterialEdgeBand;
