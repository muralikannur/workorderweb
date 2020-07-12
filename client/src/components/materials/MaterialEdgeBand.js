import React, { PureComponent} from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect'

import { edgeBandThickness, edgeBandWidth } from '../../appConfig';
import { EB_START_NUMBER } from '../../constants';

class MaterialEdgeBand extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            currentItem:0,
            materialEdgeBands:[]
        };
    }

    componentDidMount(){
      window.setTimeout(() => {
        this.setState({materialEdgeBands:this.props.edgebands});
      },1000)
    }
  
    componentWillReceiveProps(nextProps){
  
      if(nextProps.currentTab == 'edgebands' && (nextProps.nextTab != 'edgebands' && nextProps.nextTab != '')){
        if(nextProps.edgebands != this.state.materialEdgeBands){
          this.props.save(this.state.materialEdgeBands)
        } else {
          this.props.save('changeTab');
        }
      }
  
      if(this.props.isCancelClicked){
        this.setState({materialEdgeBands:this.props.edgebands});
      }
    }
  

  onItemClick = (i) => {
    this.setState({currentItem:i})
  }
  onChange = (e) => {
    let { value, name } = e.target;
    const numberFields = ['materialEdgeBandNumber','eb_width', 'laminate'];
    const floatFields = ['eb_thickness']

    if (numberFields.includes(name)) {
      if(isNaN(value))
       return;
      if(value != '')
        value = parseInt(value);
    }

    if (floatFields.includes(name)) {
      if(isNaN(value))
       return;
      if(value != '')
       value = parseInt(value);
    }

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
      if(this.isUsed(id)){
        let msg = 'WARNING! This Edge Band is used in the Items \n\n';
        msg += 'You cannot delete this edgeband.\n';
        window.alert(msg);
        return;
      } 
        var newMaterialEdgeBands = edgebands.filter(materialEdgeBand => materialEdgeBand.materialEdgeBandNumber != id);
        this.setState({materialEdgeBands: newMaterialEdgeBands, currentItem:0});

    },100
    )
  }


  ToLoginPage = () => {
    const { history } = this.props;
    if(history) history.push('/login');
   }
   
  isUsed = (id) => {
    if(id == 0) return false;
    if(this.props.usedEdgeBands.includes(id)){
      return true;
    }
    return false;
  }
  render() {
    if(!this.props.enableEB) {return <h5>No Laminates defined.</h5>};
    return(
        <div className="row">
        <div className="col-md-12 pl-md-5">
        <h3 style={{color:"#7ed321"}}>Edge Band <span style={{color:"#fff"}}>{this.state.currentItem}</span></h3>
        <table className="table" style={{border:"#ccc 1px solid", width:"90%"}}>
        {/* <tr  style={{padding:"0px"}}>
              <th style={{width:"20%", backgroundColor:"#ddd"}}> Laminate</th>
              <th style={{width:"80%", backgroundColor:"#ddd"}}> Edge Bands</th>
        </tr> */}

        <tbody>

        {
            this.props.laminates.sort((a,b) => a.laminateNumber > b.laminateNumber ? 1  : -1 ).map( (laminate, lNo) => {
            return (
            <tr key={lNo}>
              <td style={{backgroundColor:"#eee", lineHeight:"2", padding:"5px", border:"#ccc 1px solid", textAlign:"left"}}>LAMINATE <br/>{laminate.laminateNumber}: {laminate.code} {laminate.thickness} mm ({laminate.grains})</td>
              <td>   
                  <table className="table" style={{width:"300px"}}>
                    <tbody>
                  <tr  style={{lineHeight:"1", fontWeight:"normal"}}>
                        <th style={{width:"5%"}}>#</th>
                        <th style={{width:"40%"}}> Thickness</th>
                        <th style={{width:"40%"}}> Width</th>
                        <th style={{width:"15%"}}></th>
                  </tr>
                  {this.state.materialEdgeBands.filter(eb => eb.laminate == laminate.laminateNumber).sort((a,b) => a.materialEdgeBandNumber > b.materialEdgeBandNumber ? 1  : -1 ).map( (materialEdgeBand, i) => {
                  return (
                  <tr  key={i} id={'mat-row-edgeband-' + materialEdgeBand.laminate + '-' + materialEdgeBand.materialEdgeBandNumber}   onClick={() => this.onItemClick(materialEdgeBand.materialEdgeBandNumber)}  style={{backgroundColor:this.isUsed(materialEdgeBand.materialEdgeBandNumber)?'yellow':'#fff'}}>
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
                  </tbody>
                </table>

                <span id="btnAddItem" className="btn btn-xs btn-rounded btn-outline-success mr-2" style={{cursor:"pointer", margin:"5px", fontWeight:"bold"}} onClick={()=>{this.addItem(laminate.laminateNumber)}}> Add </span>

              </td>       
            </tr>)
            })}



{
            this.props.boards.filter(b => b.allowEdgeBand).sort((a,b) => a.boardNumber > b.boardNumber ? 1  : -1 ).map( (board, bNo) => {
            return (
            <tr key={bNo}>
              <td style={{backgroundColor:"#eee", lineHeight:"2", padding:"5px", border:"#ccc 1px solid", textAlign:"left"}}>BOARD:<br />{board.boardNumber}: {board.type} {board.thickness} mm - ( {board.height} x {board.width}) - {board.grade} {board.company}</td>
              <td>   
                  <table className="table" style={{width:"300px"}}>
                    <tbody>
                  <tr  style={{lineHeight:"1", fontWeight:"normal"}}>
                        <th style={{width:"5%"}}>#</th>
                        <th style={{width:"40%"}}> Thickness</th>
                        <th style={{width:"40%"}}> Width</th>
                        <th style={{width:"15%"}}></th>
                  </tr>
                  {this.state.materialEdgeBands.filter(eb => eb.laminate == parseInt(board.boardNumber) + EB_START_NUMBER.BOARD).sort((a,b) => a.materialEdgeBandNumber > b.materialEdgeBandNumber ? 1  : -1 ).map( (materialEdgeBand, i) => {
                  return (
                  <tr key={i}  id={'mat-row-edgeband-' + materialEdgeBand.laminate + '-' + materialEdgeBand.materialEdgeBandNumber}   onClick={() => this.onItemClick(materialEdgeBand.materialEdgeBandNumber)}  style={{backgroundColor:this.isUsed(materialEdgeBand.materialEdgeBandNumber)?'yellow':'#fff'}}>
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
                  </tbody>
                </table>

                <span id="btnAddItem" className="btn btn-xs btn-rounded btn-outline-success mr-2" style={{cursor:"pointer", margin:"5px", fontWeight:"bold"}} onClick={()=>{this.addItem(parseInt(board.boardNumber) + EB_START_NUMBER.BOARD)}}> Add </span>

              </td>       
            </tr>)
            })}

        </tbody>
        </table>


        </div>
      </div>
    )
    
  }
}

const enableEdgeBand  = createSelector(
  [
    (state) => state.material.laminates,
    (state) => state.material.boards,
  ],
  (laminates, boards) => {

    if((!laminates || laminates.length == 0) && (!boards || !boards.find(b => b.allowEdgeBand))){
      return false;
    }
    return true;

  }
)

const getUsedEdgeBands = createSelector(
  [(state) => state.wo.woitems],
  (items) => {
    let usedEdgeBands = [];
    items.map(i => {
      if(i.eb_a != 0 && !usedEdgeBands.includes(i.eb_a)){
        usedEdgeBands.push(parseInt(i.eb_a));
      }
      if(i.eb_b != 0 && !usedEdgeBands.includes(i.eb_b)){
        usedEdgeBands.push(parseInt(i.eb_b));
      }
      if(i.eb_c != 0 && !usedEdgeBands.includes(i.eb_c)){
        usedEdgeBands.push(parseInt(i.eb_c));
      }
      if(i.eb_d != 0 && !usedEdgeBands.includes(i.eb_d)){
        usedEdgeBands.push(parseInt(i.eb_d));
      }
    })
    return usedEdgeBands;
  }
)

const mapStateToProps = state => (
  {
    edgebands: state.material.edgebands,
    laminates: state.material.laminates,
    boards: state.material.boards,
    usedEdgeBands: getUsedEdgeBands(state),
    enableEB: enableEdgeBand(state)    
  }
);

export default connect(
  mapStateToProps,
  null,
  null
)(MaterialEdgeBand);
