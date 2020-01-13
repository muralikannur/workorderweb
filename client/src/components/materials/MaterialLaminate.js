import React, { Component} from 'react';

class MaterialLaminate extends Component {
 
  constructor(props){
    super(props);
    this.state = {
        currentItem:0,
        laminates:[],
        tabClicked:'tab-board',
        isLoaded:false,
        saveClicked:false
    };
  }

  componentWillReceiveProps(newProps){
    if(newProps.material.laminates  && (this.state.laminates.length == 0 & !this.state.isLoaded) ){
      this.setState({laminates: newProps.material.laminates })
      this.setState({isLoaded:true})
    }

    if(newProps.isSaveClicked && !this.state.saveClicked && this.state.tabClicked == 'tab-laminate'){
      this.setState({saveClicked: true});
      this.props.save('laminate',this.state.laminates)
      return;
    }
    if(!newProps.isSaveClicked){
      this.setState({saveClicked: false});
    }
      
    if(newProps.tabClicked != this.state.tabClicked){
      if(this.state.tabClicked == 'tab-laminate' || this.state.tabClicked == ''){
        if(newProps.tabClicked != '' && newProps.tabClicked != 'tab-laminate')  {
          this.tabChanged(newProps.tabClicked);
        } 
      }
    }

    this.setState({tabClicked: newProps.tabClicked})
    
  }
  
  tabChanged = (tabClicked) => {
      if(this.props.save('laminate',this.state.laminates)){
        this.setState({tabClicked})
      }
  }

  onItemClick = (i) => {
    this.setState({currentItem:i})
  }

  onChange = (e) => {
    const numberFields = ['height', 'width'];
    let { value, name } = e.target;
    if (numberFields.includes(name) && isNaN(value)) { return;}

    if(name=="eb_thickness") value = parseFloat(e.target.value);

    var laminates = this.state.laminates;
    var laminate = laminates.find(i => i.laminateNumber == this.state.currentItem);
    var newLaminate = { ...laminate, [name]: value}

    laminates = laminates.filter(i => i.laminateNumber != this.state.currentItem)
    laminates = [...laminates,newLaminate]
    this.setState({laminates});
  }

  
  addItem = () => {
    const maxId = this.getMaxId();
    const newLaminate = {
      laminateNumber:maxId,
      code:'',
      thickness:'',
      grains:''
    }
    this.setState({laminates: [...this.state.laminates, newLaminate], currentItem:maxId});
    //this.props.saveItems( [...this.state.woitems, newItem]);
  }

  getMaxId = () => {
    let maxId = 1;
    if(this.state.laminates.length > 0){
      let item = this.state.laminates.sort((a, b) => (a.laminateNumber < b.laminateNumber) ? 1 : -1).slice(0, 1);
      maxId = (item[0].laminateNumber) + 1;
    }
    return maxId;
  }

  deleteItem = (id) => {
    this.setState({currentItem:id})
    setTimeout(() => {

      let laminates = this.state.laminates;
      let laminateToDelete = laminates.find(b => b.laminateNumber == id);
      let isDelete = false;
      if(this.isUsed(id)){
        let msg = 'WARNING! This Laminate is used in the Material Code or Edge Band \n\n';
        msg += 'Are you sure that you want to delete this Laminate ??\n\n';
        msg += laminateToDelete.code + ' - ' + laminateToDelete.thickness + ' ( ' + laminateToDelete.grains + ' )' ;
        if(window.confirm(msg,'Shape')){
          isDelete = true
        }
      } else {
        isDelete = true
      }
      if(isDelete){
        var newLaminates = laminates.filter(laminate => laminate.laminateNumber != id);
        this.setState({laminates: newLaminates, currentItem:0});
      }
    },100
    )
  }


  isUsed = (id) => {
    if(this.props.material.materialCodes && this.props.material.materialCodes.find(mc => mc.front_laminate == id ||  mc.back_laminate == id)){
      return true;
    }
    if(this.props.material.edgebands && this.props.material.edgebands.find(eb => eb.laminate == id )){
      return true;
    }
    return false;
  }
  render() {
    return(
        <div className="row">
        <div className="col-md-12 pl-md-5">
        <h3 style={{color:"#7ed321"}}>Laminate <span style={{color:"#fff"}}>{this.state.currentItem}</span></h3>
        <table className="table">
        <thead>
        <tr  style={{padding:"0px"}}>
              <th> # </th>
              <th style={{width:"50%"}}> Shade/Code </th>
              <th style={{width:"25%"}}> Thickness </th>
              <th style={{width:"20%"}}> Grains </th>
              <th style={{width:"5%"}}>  </th>

        </tr>
        </thead>
        {
        this.state.laminates.sort((a,b) => a.laminateNumber > b.laminateNumber ? 1  : -1 ).map( (laminate, i) => {
        return (
        <tr  onClick={() => this.onItemClick(laminate.laminateNumber)} style={{backgroundColor:this.isUsed(laminate.laminateNumber)?'#FFB3B3':'#fff'}}>
            <td>{i+1}</td>
            <td><input type="text" className="form-control input-xs" value={laminate.code} maxLength="20"  id="code"  name="code" onChange={this.onChange}  /></td>
            <td><input type="text" className="form-control input-xs" value={laminate.thickness} maxLength="4"  id="thickness"  name="thickness" onChange={this.onChange}  /></td>

            <td>
                <div className="form-group" style={{marginBottom:"0px"}}>
                    <select  onChange={this.onChange} defaultValue={laminate.grains}  id="grains" name="grains" className="js-example-basic-single input-xs  w-100">
                    <option value=""></option>
                    <option value="N">No Grains</option>
                    <option value="H">Horizontal Grains</option>
                    <option value="V">Vertical Grains</option>
                    </select>
                </div>
            </td>            
            <td>
            &nbsp;            
            <i className="remove icon-close" title="Remove" style={{color:"red", cursor:"pointer",paddingTop:"4px", display:"block", float:"right"}} onClick={()=>{this.deleteItem(laminate.laminateNumber)}}></i>
            </td>

        </tr>)
        })}

        </table>

        <span id="btnAddItem" className="btn btn-xs btn-rounded btn-outline-success mr-2" style={{cursor:"pointer", margin:"5px", fontWeight:"bold"}} onClick={()=>{this.addItem()}}>Add Laminate</span>


        </div>
      </div>
    )
    
  }
}

export default MaterialLaminate;

