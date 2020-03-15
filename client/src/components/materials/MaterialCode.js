import React, { Component} from 'react';

class MaterialCode extends Component {
 
  constructor(props){
      super(props);
      this.state = {
          currentItem:0,
          materialCodes:[]
      };
  }

  componentDidMount(){
    window.setTimeout(() => {
      this.setState({materialCodes:this.props.material.materialCodes});
    },1000)
  }

  componentWillReceiveProps(nextProps){

    if(nextProps.currentTab == 'materialCodes' && (nextProps.nextTab != 'materialCodes' && nextProps.nextTab != '')){
      if(nextProps.material.materialCodes != this.state.materialCodes){
        this.props.save(this.state.materialCodes)
      } else {
        this.props.save('changeTab');
      }
    }

    if(this.props.isCancelClicked){
      this.setState({materialCodes:this.props.material.materialCodes});
    }
  }

  onItemClick = (i) => {
    this.setState({currentItem:i})
  }
  onChange = (e) => {
    if(this.state.currentItem == 0) return;

    const numberFields = ['materialCodeNumber', 'board', 'front_laminate','back_laminate'];
    let { value, name } = e.target;
    if (numberFields.includes(name)) { 
      if(isNaN(value))
        return;
      if(value != '')
        value = parseInt(value);
    }

    if(name=="eb_thickness") value = parseFloat(e.target.value);

    var materialCodes = this.state.materialCodes;
    var materialCode = materialCodes.find(i => i.materialCodeNumber == this.state.currentItem);
    var newMaterialCode = { ...materialCode, [name]: value}

    materialCodes = materialCodes.filter(i => i.materialCodeNumber != this.state.currentItem)
    materialCodes = [...materialCodes,newMaterialCode]
    this.setState({materialCodes});
  }

  
  addItem = () => {
    const maxId = this.getMaxId();
    const newMaterialCode = {
      materialCodeNumber:maxId,
      board:0,
      front_laminate:0,
      back_laminate:0,
      shortname:''
    }
    this.setState({materialCodes: [...this.state.materialCodes, newMaterialCode], currentItem:maxId});
    //this.props.saveItems( [...this.state.woitems, newItem]);
  }

  getMaxId = () => {
    let maxId = 1;
    if(this.state.materialCodes.length > 0){
      let item = this.state.materialCodes.sort((a, b) => (a.materialCodeNumber < b.materialCodeNumber) ? 1 : -1).slice(0, 1);
      maxId = (item[0].materialCodeNumber) + 1;
    }
    return maxId;
  }

  deleteItem = (id) => {
    this.setState({currentItem:id})
    setTimeout(() => {

      let materialCodes = this.state.materialCodes;
      if(this.isUsed(id)){
        let msg = 'WARNING! This Material Code is used in the Items \n\n';
        msg += 'You cannot delete this code \n\n';
        window.alert(msg);
        return;
      }
      var newMaterialCodes = materialCodes.filter(materialCode => materialCode.materialCodeNumber != id);
      this.setState({materialCodes: newMaterialCodes, currentItem:0});
    },100
    )
  }

  isUsed = (id) => {
    if(this.props.items && this.props.items.find(i => i.code == id)){
      return true;
    }
    return false;
  }
  render() {

    return(
        <div className="row">
        <div className="col-md-12 pl-md-5">
        <h3 style={{color:"#7ed321"}}>MaterialCode <span style={{color:"#fff"}}>{this.state.currentItem}</span></h3>
        <table className="table">
        <thead>
        <tr  style={{padding:"0px"}}>
              <th>Code</th>
              <th style={{width:"30%"}}> Board (X) </th>
              <th style={{width:"20%"}}> Front Laminate (Y) </th>
              <th style={{width:"20%"}}> Back Laminate (Y) </th>
              <th style={{width:"20%"}}> ShortName </th>    
              <th style={{width:"5%"}}>  </th>
        </tr>
        </thead>
        <tbody>
        {this.state.materialCodes.sort((a,b) => a.materialCodeNumber > b.materialCodeNumber ? 1  : -1 ).map( (materialCode, i) => {
        return (
        <tr key={i} id={'mat-row-materialcode' + materialCode.materialCodeNumber}  onClick={() => this.onItemClick(materialCode.materialCodeNumber)} onMouseDown={() => this.onItemClick(materialCode.materialCodeNumber)} onKeyDown={() => this.onItemClick(materialCode.materialCodeNumber)} onFocus={() => this.onItemClick(materialCode.materialCodeNumber)} style={{backgroundColor:this.isUsed(materialCode.materialCodeNumber)?'yellow':'#fff'}}>
            <td>{materialCode.materialCodeNumber}</td>
            <td>
                <div className="form-group" style={{marginBottom:"0px"}}>
                    <select  onChange={this.onChange} defaultValue={materialCode.board}  id="board" name="board" className="js-example-basic-single input-xs  w-100">
                    <option value="0"></option>
                    {this.props.material.boards.map( (e) => {
                    return (
                    <option value={e.boardNumber} key={e.boardNumber} >[{e.boardNumber}] {e.type} - {e.thickness}mm ({e.height} x {e.width}) {e.grade}  {e.company} </option>
                    )})}
                    </select>
                </div>
            </td>
            <td>
                <div className="form-group" style={{marginBottom:"0px"}}>
                    <select  onChange={this.onChange} defaultValue={materialCode.front_laminate}  id="front_laminate" name="front_laminate" className="js-example-basic-single input-xs  w-100">
                    <option value="0"></option>
                    {this.props.material.laminates.map( (e) => {
                    return (
                    <option value={e.laminateNumber} key={e.laminateNumber} >[{e.laminateNumber}] {e.code} - {e.thickness}mm - {e.grains} </option>
                    )})}
                    </select>
                </div>
            </td>
            <td>
                <div className="form-group" style={{marginBottom:"0px"}}>
                    <select  onChange={this.onChange} defaultValue={materialCode.back_laminate}  id="back_laminate" name="back_laminate" className="js-example-basic-single input-xs  w-100">
                    <option value="0"></option>
                    {this.props.material.laminates.map( (e) => {
                    return (
                    <option value={e.laminateNumber} key={e.laminateNumber} >{e.code} - {e.thickness}mm - {e.grains} </option>
                    )})}
                    </select>
                </div>
            </td>    
            <td><input type="text"  maxLength="50" className="form-control input-xs" value={materialCode.shortname}  id="shortname"  name="shortname" onChange={this.onChange}  /></td>
                   


            <td>
            &nbsp;            
            <i className="remove icon-close" title="Remove" style={{color:"red", cursor:"pointer",paddingTop:"4px", display:"block", float:"right"}} onClick={()=>{this.deleteItem(materialCode.materialCodeNumber)}}></i>
            </td>

        </tr>)
        })}
        </tbody>
        </table>

        <span id="btnAddItem" className="btn btn-xs btn-rounded btn-outline-success mr-2" style={{cursor:"pointer", margin:"5px", fontWeight:"bold"}} onClick={()=>{this.addItem()}}>Add Material Code</span>


        </div>
      </div>
    )
    
  }
}

export default MaterialCode;
