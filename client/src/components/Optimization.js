import React, { Component} from 'react';
import $ from 'jquery';

class Optimization extends Component {

  constructor(props){
    super(props);
    this.state = {
      ctx:null,
      items:[],
      xBalance:{},
      yBalance:{},
      currentItem:0
    }
  }


  componentDidMount(){
    this.updateCanvas() ;
  }

  getTestDataItems = () => {

    let items = [];
    let n = 0;

    for(let i=0; i < 2; i++, n++){
      items.push({n,r:false,h:Math.floor(Math.random() * 2 + 400),w:Math.floor(Math.random() * 3 + 100),x:-1,y:-1});
    }
    for(let i=0; i < 2; i++, n++){
      items.push({n,r:false,h:Math.floor(Math.random() * 2 + 100),w:Math.floor(Math.random() * 3 + 100),x:-1,y:-1});
    }
    for(let i=0; i < 4; i++, n++){
      items.push({n,r:false,h:Math.floor(Math.random() * 2 + 300),w:Math.floor(Math.random() * 3 + 150),x:-1,y:-1});
    }
    for(let a=0; a < 2; a++, n++){
      items.push({n,r:false,h:Math.floor(Math.random() * 2 + 250),w:Math.floor(Math.random() * 3 + 50),x:-1,y:-1});
    }
    for(let a=0; a < 2; a++, n++){
      items.push({n,r:false,h:Math.floor(Math.random() * 2 + 150),w:Math.floor(Math.random() * 3 + 10),x:-1,y:-1});
    }
    for(let b=0; b < 3; b++, n++){
      items.push({n,r:false,h:Math.floor(Math.random() * 2 + 200),w:Math.floor(Math.random() * 3 + 50),x:-1,y:-1});
    }
    for(let c=0; c < 4; c++, n++){
      items.push({n,r:false,h:Math.floor(Math.random() * 2 + 100),w:Math.floor(Math.random() * 3 + 50),x:-1,y:-1});
    }
    for(let d=0; d < 4; d++, n++){
      items.push({n,r:false,h:Math.floor(Math.random() * 2 + 30),w:Math.floor(Math.random() * 2 + 100),x:-1,y:-1});
    }
    for(let e=0; e < 3;e++, n++){
      items.push({n,r:false,h:Math.floor(Math.random() * 2 + 300),w:Math.floor(Math.random() * 2 + 20),x:-1,y:-1});
    }
    for(let i=0; i < 3; i++, n++){
      items.push({n,r:false,h:Math.floor(Math.random() * 2 + 200),w:Math.floor(Math.random() * 3 + 100),x:-1,y:-1});
    }
    for(let i=0; i < 4; i++, n++){
      items.push({n,r:false,h:Math.floor(Math.random() * 2 + 100),w:Math.floor(Math.random() * 3 + 150),x:-1,y:-1});
    }
    for(let a=0; a < 5; a++, n++){
      items.push({n,r:false,h:Math.floor(Math.random() * 2 + 350),w:Math.floor(Math.random() * 3 + 50),x:-1,y:-1});
    }
    for(let a=0; a < 2; a++, n++){
      items.push({n,r:false,h:Math.floor(Math.random() * 2 + 100),w:Math.floor(Math.random() * 3 + 10),x:-1,y:-1});
    }
    for(let b=0; b < 3; b++, n++){
      items.push({n,r:false,h:Math.floor(Math.random() * 2 + 50),w:Math.floor(Math.random() * 3 + 50),x:-1,y:-1});
    }
    for(let c=0; c < 4; c++, n++){
      items.push({n,r:false,h:Math.floor(Math.random() * 2 + 100),w:Math.floor(Math.random() * 3 + 150),x:-1,y:-1});
    }
    for(let d=0; d < 4; d++, n++){
      items.push({n,r:false,h:Math.floor(Math.random() * 2 + 30),w:Math.floor(Math.random() * 2 + 50),x:-1,y:-1});
    }
    for(let e=0; e < 3;e++, n++){
      items.push({n,r:false,h:Math.floor(Math.random() * 2 + 250),w:Math.floor(Math.random() * 2 + 20),x:-1,y:-1});
    }
    for(let c=0; c < 4; c++, n++){
      items.push({n,r:false,h:Math.floor(Math.random() * 2 + 20),w:Math.floor(Math.random() * 3 + 50),x:-1,y:-1});
    }
    for(let d=0; d < 4; d++, n++){
      items.push({n,r:false,h:Math.floor(Math.random() * 2 + 30),w:Math.floor(Math.random() * 2 + 100),x:-1,y:-1});
    }
    for(let e=0; e < 3;e++, n++){
      items.push({n,r:false,h:Math.floor(Math.random() * 2 + 50),w:Math.floor(Math.random() * 2 + 20),x:-1,y:-1});
    }

    return items;
  }

  
  drawText = (ctx,s,x,y) => {
    ctx.font = "normal 10px Arial";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#000";
    ctx.fillText(s,x+2,y+10)
    ctx.stroke();
    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 1;
  }

  fitInXBalance = (ctx,items, xBal, buffer) => {
    let newX = 0;  
    items.every(i => {
        if((i.h <= xBal.h && i.h >= xBal.h - buffer) && i.w <= xBal.w ){
            this.drawMultiItems(ctx,xBal,[i]);
            newX = i.w;
            return false;
        } else if((i.w <= xBal.h && i.w >= xBal.h - buffer) && i.h <= xBal.w ){
            i.r = true;
            this.drawMultiItems(ctx,xBal,[i]);
            newX = i.h;
            return false;
        }     
    })
    return newX;
  }

  fitInYBalance = (ctx,items, yBal, buffer) => {
    let newY = 0;
    items.every(i => {
        if((i.w <= yBal.w && i.w >= yBal.w - buffer) && i.h <= yBal.h ){
            this.drawMultiItems(ctx,yBal,[i]);
            newY = i.h
            return false;
        } else if((i.h <= yBal.w && i.h >= yBal.w - buffer) && i.w <= yBal.h ){
            i.r = true;
            this.drawMultiItems(ctx,yBal,[i]);
            newY = i.w;
            return false;
        }     
    })
    return newY;
  }


  fitTwoInXBalance = (ctx,items, xBal, splitCount) => {
    let newX = 0;  
    loop1:
    for(let buffer = 0; buffer<=5; buffer++){
      for(let a = 0; a < items.length; a++){
        for(let b = a+1; b < items.length; b++){
          if(items[a].w == items[b].w){

            if(splitCount == 2){
              let hSum = items[a].h + items[b].h;
              if( hSum <= xBal.h && hSum >= xBal.h - buffer){
                this.drawMultiItems(ctx,xBal,[items[a],items[b]]);
                newX = items[a].w;
                break loop1;
              }
            }else{

              for(let c = b+1; c < items.length; c++){
                if(items[a].w == items[c].w){
                  if(splitCount == 3){
                    let hSum = items[a].h + items[b].h + items[c].h;
                    if( hSum <= xBal.h && hSum >= xBal.h - buffer){
                      this.drawMultiItems(ctx,xBal,[items[a],items[b],items[c]]);
                      newX = items[a].w;
                      break loop1;
                    }
                  }
                }
              }

            }
            

          } else if(items[a].w == items[b].h){
            let hSum = items[a].h + items[b].w;
            if( hSum <= xBal.h && hSum >= xBal.h - buffer){
              items[b].r = true;
              this.drawMultiItems(ctx,xBal,[items[a],items[b]]);
              newX = items[a].w;
              break loop1;
            }
          }
        }
      }
    }
    return newX;
  }



  drawMultiItems = (ctx,bal,m) => {
    let yPos = bal.y;
    for(let i = 0; i < m.length; i++){
      m[i].x=bal.x;
      m[i].y=yPos; 
      let h = (i.r?m[i].w:m[i].h);
      let w = (i.r?m[i].h:m[i].w);
      this.drawItem(ctx,m[i],h,w);
      yPos += m[i].h;
    }

  }

  
  drawItem = (ctx,i,h,w) => {
    ctx.fillRect(i.x, i.y, w, h);
    ctx.strokeRect(i.x, i.y, w, h);
    this.drawText(ctx,i.n,i.x,i.y);
  }

  highlight = (i,f) => {
    let ctx = this.state.ctx;
    ctx.fillStyle = (f?"#fab958":"#fff");
    ctx.fillRect(i.x, i.y, (i.r?i.h:i.w), (i.r?i.w:i.h));
    ctx.strokeRect(i.x, i.y, (i.r?i.h:i.w), (i.r?i.w:i.h));
    this.drawText(ctx,i.n,i.x,i.y);
    ctx.stroke();

    if(f && this.state.currentItem != i.n){
      this.setState({currentItem:i.n})
    }
  }

  updateCanvas() {

    let items = this.getTestDataItems();;

    let board = {h:500, w:1000};

   

    const ctx = this.refs.canvas.getContext('2d');

    this.setState({ctx});
    ctx.beginPath();

    ctx.fillStyle = "#eee";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 5;
    ctx.fillRect(0, 0, board.w, board.h);
    ctx.strokeRect(0, 0, board.w, board.h);
    ctx.stroke();



    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 1;


    //Place first item on the top-left corner

    let itemArray = [];
    items.sort((a, b) => (parseInt(a.h) + parseInt(a.w) > parseInt(b.h) + parseInt(b.w)) ? -1 : 1).forEach(i => {
      itemArray.push(i.h + ' X ' + i.w)
    })
    $('#items').html(itemArray.join('<br />'));




    let firstItem = items.sort((a, b) => (parseInt(a.h) + parseInt(a.w) > parseInt(b.h) + parseInt(b.w)) ? -1 : 1)[0];



    firstItem.x=0;
    firstItem.y=0;   
    ctx.fillRect(firstItem.x, firstItem.y, firstItem.w, firstItem.h);
    ctx.strokeRect(firstItem.x, firstItem.y, firstItem.w, firstItem.h);
    this.drawText(ctx,firstItem.n,firstItem.x + 2,firstItem.y + 10);

    let xBalance = {h:firstItem.h,w:board.w-firstItem.w, x:firstItem.w, y:0}
    let yBalance = {h:board.h-firstItem.h,w:firstItem.w, x:0, y:firstItem.h}

    this.setState({xBalance,yBalance});
    

    for(let buffer =0; buffer <=5; buffer++){
        let newX = -1, newY=-1
        while(newX != 0 && newY !=0){
            newX = this.fitInXBalance(ctx,items.filter(i => i.x == -1),xBalance,buffer)
            if( newX != 0){
                xBalance.w -= newX;
                xBalance.x += newX;
            }
            newY = this.fitInYBalance(ctx,items.filter(i => i.x == -1),yBalance,buffer)
            if( newY != 0){
                yBalance.h -= newY;
                yBalance.y += newY;
            }
        }
    }


    let newX = -1;
    while(newX != 0){
      newX =  this.fitTwoInXBalance(ctx,items.filter(i =>  i.x == -1 && i.w <= xBalance.w), xBalance,2);
      if(newX != 0){
        xBalance.w -= newX;
        xBalance.x += newX;
      }
    }


    newX = -1;
    while(newX != 0){
      newX =  this.fitTwoInXBalance(ctx,items.filter(i =>  i.x == -1 && i.w <= xBalance.w), xBalance,3);
      if(newX != 0){
        xBalance.w -= newX;
        xBalance.x += newX;
      }
    }


    ctx.stroke();

    this.setState({items});
}

onMouseMove = (e)  => {
  let canvas = document.getElementById('wowCanvas');
  let rect = canvas.getBoundingClientRect();

  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  let item = this.state.items.find(i => (i.x < x && (i.x + i.w) > x) && (i.y < y && (i.y + i.h) > y) );

  if(item){
    if(this.state.currentItem != item.n){
      this.setState({currentItem:item.n})
    }
    console.log(item);
  }else{
    this.setState({currentItem:0})
  }

}


  render() {

    return(
      <table  style={{width:"100%"}}>
        <tr>
          <td style={{verticalAlign:"top", padding:"10px", width:"1050px"}}><canvas style={{cursor:"pointer"}} id="wowCanvas" onMouseMove={this.onMouseMove} ref="canvas" width={1000} height={500}/></td>
          <td style={{verticalAlign:"top", padding:"10px"}}>
            <table id="optiTable" style={{width:"100%"}} className="table table-hover">
              <thead>
              <tr>
                <th>#</th><th>H</th><th>W</th><th>x</th><th>y</th><th>r</th>
              </tr>
              </thead>
              <tbody>
              {this.state.items.sort((a,b) => a.x > b.x ? -1: 1).map((i) => {
                return(
                  <tr style={{backgroundColor:this.state.currentItem == i.n ?'#fab958':'#fff'}}
                      onMouseOver={() => {if(i.x != -1) this.highlight(i,true);}}
                      onMouseOut={() => {if(i.x != -1) this.highlight(i,false);}}>
                    <td>{i.n}</td><td>{i.h}</td><td>{i.w}</td><td>{i.x}</td><td>{i.y}</td><td>{(i.r?1:0)}</td>
                  </tr>);
              })}
              </tbody>
            </table>
          </td>
        </tr>
      </table>
    )
  }
}


export default Optimization;
