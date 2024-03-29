import React, { PureComponent} from 'react';
import { connect } from 'react-redux';
import { boardType } from '../../appConfig';
import { notify_error } from '../../Utils/commonUtls';

class MaterialBoard extends PureComponent {
  constructor(props){
      super(props);
      this.state = {
          currentItem:0,
          boards:[],
          loaded:false
      };
  }

  componentDidMount(){
    window.setTimeout(() => {
      this.setState({boards:this.props.boards});
    },1000)
  }

  componentWillReceiveProps(nextProps){

    if(!this.state.loaded){}

    if(nextProps.currentTab == 'boards' && (nextProps.nextTab != 'boards' && nextProps.nextTab != '')){
      if(nextProps.boards != this.state.boards){
        this.props.save(this.state.boards)
      } else {
        this.props.save('changeTab');
      }
    }

    if(this.props.isCancelClicked){
      this.setState({boards:this.props.boards});
    }
  }

  onItemClick = (i) => {
    this.setState({currentItem:i})
  }

  onChange = (e,i) => {

    if(this.state.currentItem == 0) return;
    const numberFields = ['boardNumber','height', 'width', 'thickness'];
    let { value, name } = e.target;
    let currentItemNumber = this.state.currentItem;

    if (numberFields.includes(name)) {
      if(isNaN(value))
       return;
      if(value != '')
        value = parseInt(value);
    }

    if(e.target.name == 'allowEdgeBand'){
      value = e.target.checked;
      currentItemNumber = i;
      this.setState({currentItem:i})
    } 

    var boards = this.state.boards;
    var board = boards.find(i => i.boardNumber == currentItemNumber);
    var newBoard = { ...board, [name]: value}

    boards = boards.filter(i => i.boardNumber != currentItemNumber)
    boards = [...boards,newBoard]
    this.setState({boards});
  }

  
  addItem = () => {
    const maxId = this.getMaxId();
    const newBoard = {
      boardNumber:maxId,
      type:0,
      height:2420,
      width:1210,
      thickness:6,
      grains:0,
      grade:'',
      company:'',
      allowEdgeBand:false
    }
    this.setState({boards: [...this.state.boards, newBoard], currentItem:maxId});
  }

  getMaxId = () => {
    let maxId = 1;
    if(this.state.boards.length > 0){
      let item = this.state.boards.sort((a, b) => (a.boardNumber < b.boardNumber) ? 1 : -1).slice(0, 1);
      maxId = parseInt((item[0].boardNumber)) + 1;
    }
    return maxId;
  }

  deleteItem = (id) => {

    this.setState({currentItem:id})
    setTimeout(() => {
      let boards = this.state.boards;
      let boardToDelete = boards.find(b => b.boardNumber == id);
      if(this.isUsed(id)){
        let msg = 'WARNING! This Board is used in the Material Code \n\n';
        msg += 'You cannot delete this Board ??\n\n';
        msg += boardToDelete.type + ' (' + boardToDelete.height + ' x ' + boardToDelete.width + ') - ' ;
        msg += boardToDelete.thickness + ' (' + boardToDelete.grains + ')'
        notify_error(msg);
        return;
      }
      let newBoards = boards.filter(board => board.boardNumber != id);
      this.setState({boards: newBoards, currentItem:0});
    },100
    )
  }

  isUsed = (id) => {
    if(this.props.materialCodes && this.props.materialCodes.find(mc => mc.board == id)){
      return true;
    }
    return false;
  }

  render() {
    return(
        <div className="row">
        <div className="col-md-12 pl-md-5">
        <h3 style={{color:"#7ed321", float:"left"}}>Board </h3>
        <table className="table">
          <thead>
        <tr  style={{padding:"0px"}}>
              <th>#</th>
              <th style={{width:"20%"}}> Type </th>
              <th style={{width:"8%"}}> Height </th>
              <th style={{width:"8%"}}> Width </th>
              <th style={{width:"4%"}}> Thickness </th>
              <th style={{width:"14%"}}> Grains </th>
              <th style={{width:"15%"}}> Grade/Shade </th>
              <th style={{width:"15%"}}> Company </th>
              <th style={{width:"10%"}}> EdgeBand </th>          
              <th style={{width:"5%"}}>  </th>

        </tr>
        </thead>
        <tbody>
        {this.state.boards.sort((a,b) => a.boardNumber > b.boardNumber ? 1  : -1 ).map( (board, i) => {
        return (

        <tr key={i} id={'mat-row-board' + board.boardNumber} onFocus={() => this.onItemClick(board.boardNumber)} onMouseDown={() => this.onItemClick(board.boardNumber)} onClick={() => this.onItemClick(board.boardNumber)} style={{backgroundColor:this.isUsed(board.boardNumber)?'yellow':'#fff'}}>
            <td>{board.boardNumber}</td>
            <td>
                <div className="form-group" style={{marginBottom:"0px"}}>
                    <select  onChange={this.onChange} defaultValue={board.type}  id="type" name="type" className="js-example-basic-single input-xs  w-100">
                    <option value="0">Select the Board Type</option>
                    {boardType.map( (e) => {
                    return (
                    <option value={e} key={e} >{e}</option>
                    )})}
                    </select>
                </div>
            </td>
            <td><input type="text" className="form-control input-xs" value={board.height} maxLength="4"  id="height"  name="height" onChange={this.onChange}  /></td>
            <td><input type="text" className="form-control input-xs" value={board.width} maxLength="4"  id="width"  name="width" onChange={this.onChange}  /></td>
            <td><input type="text" className="form-control input-xs" value={board.thickness} maxLength="2"  id="thickness"  name="thickness" onChange={this.onChange}  /></td>
            <td>
                <div className="form-group" style={{marginBottom:"0px"}}>
                    <select  onChange={this.onChange} defaultValue={board.grains}  id="grains" name="grains" className="js-example-basic-single input-xs  w-100">
                    <option value="0">Not Applicable</option>
                    <option value="N">No Grains</option>
                    <option value="H">Horizontal Grains</option>
                    <option value="V">Vertical Grains</option>
                    </select>
                </div>
            </td>            
            <td><input type="text"  maxLength="50" className="form-control input-xs" value={board.grade}  id="grade"  name="grade" onChange={this.onChange}  /></td>
            <td><input type="text"  maxLength="50" className="form-control input-xs" value={board.company}  id="company"  name="company" onChange={this.onChange}  /></td>
            <td><input type="checkbox" style={{fontSize:"8px", height:"15px"}} className="form-control input-xs" checked={board.allowEdgeBand && "checked"}  id="allowEdgeBand"  name="allowEdgeBand" onChange={(e) => {this.onChange(e,board.boardNumber)}}  /></td>

            <td>
            &nbsp;            
            <i className="remove icon-close" title="Remove" style={{color:"red", cursor:"pointer",paddingTop:"4px", display:"block", float:"right"}} onClick={()=>{this.deleteItem(board.boardNumber)}}></i>
            </td>

        </tr>)
        })}
        </tbody>
        </table>

        <span id="btnAddItem" className="btn btn-xs btn-rounded btn-outline-success mr-2" style={{cursor:"pointer", margin:"5px", fontWeight:"bold"}} onClick={()=>{this.addItem()}}>Add Board</span>
          <br/><br/>
        </div>
      </div>
    )
    
  }
}

const mapStateToProps = state => (
  {
    boards: state.material.boards,
    materialCodes: state.material.materialCodes,
  }
);

export default connect(
  mapStateToProps,
  null,
  null
)(MaterialBoard);
