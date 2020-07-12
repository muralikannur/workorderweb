import React, { PureComponent} from 'react';
import { connect } from 'react-redux';

class MaterialLaminate extends PureComponent {
 
  constructor(props){
    super(props);
    this.state = {
        currentItem:0,
        laminates:[]
    };
  }

  componentDidMount(){
    window.setTimeout(() => {
      this.setState({laminates:this.props.laminates});
    },1000)
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.currentTab == 'laminates' && (nextProps.nextTab != 'laminates' && nextProps.nextTab != '')){
      if(nextProps.laminates != this.state.laminates){
        this.props.save(this.state.laminates)
      } else {
        this.props.save('changeTab');
      }
    }

    if(this.props.isCancelClicked){
      this.setState({laminates:this.props.laminates});
    }
  }

  onItemClick = (i) => {
    this.setState({currentItem:i})
  }

  onChange = (e) => {
    if(this.state.currentItem == 0) return;
    const numberFields = ['laminateNumber','height', 'width'];
    let { value, name } = e.target;
    if (numberFields.includes(name)) { 
      if(isNaN(value))
        return;
      if(value != '')
        value = parseInt(value);
    }

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
      if(this.isUsed(id)){
        let msg = 'WARNING! This Laminate is used in the Material Code or Edge Band \n\n';
        msg += 'You cannot delete this Laminate.\n\n';
        msg += laminateToDelete.code + ' - ' + laminateToDelete.thickness + ' ( ' + laminateToDelete.grains + ' )' ;
        window.alert(msg)
        return;
      }
      var newLaminates = laminates.filter(laminate => laminate.laminateNumber != id);
      this.setState({laminates: newLaminates, currentItem:0});
    },100
    )
  }


  isUsed = (id) => {
    if(this.props.materialCodes && this.props.materialCodes.find(mc => mc.front_laminate == id ||  mc.back_laminate == id)){
      return true;
    }
    if(this.props.edgebands && this.props.edgebands.find(eb => eb.laminate == id )){
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
        <tbody>
        {
        this.state.laminates.sort((a,b) => a.laminateNumber > b.laminateNumber ? 1  : -1 ).map( (laminate, i) => {
        return (
        <tr key={i} id={'mat-row-laminate' + laminate.laminateNumber}   onClick={() => this.onItemClick(laminate.laminateNumber)} onMouseDown={() => this.onItemClick(laminate.laminateNumber)} onKeyDown={() => this.onItemClick(laminate.laminateNumber)}  onFocus={() => this.onItemClick(laminate.laminateNumber)}  style={{backgroundColor:this.isUsed(laminate.laminateNumber)?'yellow':'#fff'}}>
            <td>{laminate.laminateNumber}</td>
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
        </tbody>
        </table>

        <span id="btnAddItem" className="btn btn-xs btn-rounded btn-outline-success mr-2" style={{cursor:"pointer", margin:"5px", fontWeight:"bold"}} onClick={()=>{this.addItem()}}>Add Laminate</span>


        </div>
      </div>
    )
    
  }
}


const mapStateToProps = state => (
  {
    laminates: state.material.laminates,
    materialCodes: state.material.materialCodes,
    edgebands: state.material.edgebands
  }
);

export default connect(
  mapStateToProps,
  null,
  null
)(MaterialLaminate);