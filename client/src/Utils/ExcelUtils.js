
  import XLSX from 'xlsx';
  import { EB_START_NUMBER ,PATTERN_CODE} from '../constants';
  import { getMaterialText, getRemarkData } from './woUtils';


  export const downloadCuttingList = (wo, material) => {

    let wb =  {
      SheetNames : [],
      Sheets : {}
    }

    let items = wo.woitems;

    if(items.length == 0){
      alert('No Items entered');
      return
    }

    let cutting_list = [];
    let printItems = [];
    let eb_list = [];


    material.edgebands.map(eb => {
      let laminateName = '';
      let count = 0;

      if(eb.laminate > EB_START_NUMBER.PROFILE){ //200
        laminateName = 'E-Profile';
      } else if(eb.laminate > EB_START_NUMBER.BOARD){ //100
        let board = material.boards.find(b => b.boardNumber ==  (parseInt(eb.laminate) - EB_START_NUMBER.BOARD) )
        if(board)
        laminateName = board.type;
      }else { 
        let laminate = material.laminates.find(l => l.laminateNumber ==  eb.laminate )
        laminateName = laminate.code;
      }

      let eb_a_items = wo.woitems.filter(i => !isNaN(i.eb_a) && i.eb_a == eb.materialEdgeBandNumber);
      eb_a_items.map(i => {
        count += parseInt(i.height) * parseInt(i.quantity)
      })

      let eb_b_items = wo.woitems.filter(i => !isNaN(i.eb_b) && i.eb_b == eb.materialEdgeBandNumber);
      eb_b_items.map(i => {
        count += parseInt(i.width) * parseInt(i.quantity)
      })      

      let eb_c_items = wo.woitems.filter(i => !isNaN(i.eb_c) && i.eb_c == eb.materialEdgeBandNumber);
      eb_c_items.map(i => {
        count += parseInt(i.height) * parseInt(i.quantity)
      })

      let eb_d_items = wo.woitems.filter(i => !isNaN(i.eb_d) && i.eb_d == eb.materialEdgeBandNumber);
      eb_d_items.map(i => {
        count += parseInt(i.width) * parseInt(i.quantity)
      })    


      eb_list.push({
        LAM_BOARD:laminateName,
        THICK:  parseFloat(eb.eb_thickness),
        WIDTH:  parseInt(eb.eb_width),
        LENGTH:count
      })
    })


    items.map(i => {

      let refNo = i.parentId == 0 ? i.itemnumber : i.parentId;
      let mat = material.materialCodes.find(m => m.materialCodeNumber == i.code);
      let matText = i.code == PATTERN_CODE ? "PATTERN" : getMaterialText(mat, material);

      let qty = parseInt(i.quantity);
      if(i.ledgeType != 0){
        qty *= 2;
      }

      let cutting_Height = parseInt(i.height);
      let cutting_Width = parseInt(i.width);



      if(i.doubleThickWidth == 0 && i.ledgeType == 0){
        if(material.edgebands && material.edgebands.length > 0){
          
          if(i.eb_a && !isNaN(i.eb_a) &&  i.eb_a != 0) cutting_Width -= parseFloat(material.edgebands.find(eb => eb.materialEdgeBandNumber == i.eb_a).eb_thickness);
          if(i.eb_b && !isNaN(i.eb_b) &&  i.eb_b != 0) cutting_Height -= parseFloat(material.edgebands.find(eb => eb.materialEdgeBandNumber ==  i.eb_b).eb_thickness);
          if(i.eb_c && !isNaN(i.eb_c) &&  i.eb_c != 0) cutting_Width -= parseFloat(material.edgebands.find(eb => eb.materialEdgeBandNumber == i.eb_c).eb_thickness);
          if(i.eb_d && !isNaN(i.eb_d) &&  i.eb_d != 0) cutting_Height -= parseFloat(material.edgebands.find(eb => eb.materialEdgeBandNumber == i.eb_d).eb_thickness);
        }
      }


      if(i.profileNumber != 0){
        if(material.profiles){
          let profile = material.profiles.find(p => p.profileNumber == i.profileNumber)
          if(profile && i.profileSide == 'H')
            cutting_Width -= parseInt(profile.height);
          if(profile && i.profileSide == 'W')
            cutting_Height -= parseInt(profile.height);
        }
      }

      let remarkData = '';

      i.remarks.map((id) => {
        remarkData += getRemarkData(id, i, material) + ', ';
      })



      let grains = "";

      if(i.code != PATTERN_CODE){
        let mCode = material.materialCodes.find(m => m.materialCodeNumber == i.code);
        let board = material.boards.find(b => b.boardNumber == mCode.board);
        let laminate = material.laminates.find(l => l.laminateNumber == mCode.front_laminate);
        
        if(laminate && laminate.grains != "N"){
          grains = laminate.grains;
        } else if(board){
          grains = board.grains;
        }
      }



      const customerCode = wo.wonumber.substring(0,3);

      cutting_list.push({
        RefNo:customerCode + refNo,
        Delivery:'',
        ItemType:i.itemtype,
        A_Height: parseInt(i.height),
        A_Width:parseInt(i.width),
        C_Height: Math.round(cutting_Height),
        C_Width:  Math.round(cutting_Width),
        Qty:qty,
        Code:i.code,
        Grains: (grains == "H" || grains == "V" ? 'yes':'no'),
        EB_A:(i.eb_a != undefined && !isNaN(i.eb_a) && i.eb_a != 0) ? material.edgebands.find(eb => eb.materialEdgeBandNumber == i.eb_a).eb_thickness : 0,
        EB_B:(i.eb_b != undefined && !isNaN(i.eb_b) &&  i.eb_b != 0) ? material.edgebands.find(eb => eb.materialEdgeBandNumber == i.eb_b).eb_thickness : 0,
        EB_C:(i.eb_c != undefined && !isNaN(i.eb_c) &&  i.eb_c != 0) ? material.edgebands.find(eb => eb.materialEdgeBandNumber == i.eb_c).eb_thickness : 0,
        EB_D:(i.eb_d != undefined && !isNaN(i.eb_d) && i.eb_d != 0) ? material.edgebands.find(eb => eb.materialEdgeBandNumber == i.eb_d).eb_thickness : 0,
        Remark:remarkData,
        Material:matText,
        Comments:i.comments
      })

      //Items

      printItems.push({
        itemnumber: refNo,
        MaterialCode: '[' + i.code + '] ' + matText,
        ItemType:i.itemtype,
        Height: parseInt(i.height),
        Width:parseInt(i.width),
        Qty:qty,
        EB_A:(i.eb_a != undefined && !isNaN(i.eb_a) &&  i.eb_a != 0) ? material.edgebands.find(eb => eb.materialEdgeBandNumber == i.eb_a).eb_thickness : 0,
        EB_B:(i.eb_b != undefined && !isNaN(i.eb_b) &&  i.eb_b != 0) ? material.edgebands.find(eb => eb.materialEdgeBandNumber == i.eb_b).eb_thickness : 0,
        EB_C:(i.eb_c != undefined && !isNaN(i.eb_c) &&  i.eb_c != 0) ? material.edgebands.find(eb => eb.materialEdgeBandNumber == i.eb_c).eb_thickness : 0,
        EB_D:(i.eb_d != undefined && !isNaN(i.eb_d) &&  i.eb_d != 0) ? material.edgebands.find(eb => eb.materialEdgeBandNumber == i.eb_d).eb_thickness : 0,
        Remark:remarkData,
        Comments:i.comments
      })

    })

    console.log(eb_list);
    cutting_list = cutting_list.sort((a,b) => a.RefNo > b.RefNo ? 1  : -1 );
    const wsCuttingList = XLSX.utils.json_to_sheet(cutting_list);


    printItems = printItems.sort((a,b) => a.itemnumber > b.itemnumber ? 1  : -1 );
    const wsItems = XLSX.utils.json_to_sheet(printItems);

    const wsEBList = XLSX.utils.json_to_sheet(eb_list);


    wb.SheetNames.push('cutting_list')
    wb.Sheets['cutting_list'] = wsCuttingList

    wb.SheetNames.push('items')
    wb.Sheets['items'] =  wsItems

    wb.SheetNames.push('EdgeBands')
    wb.Sheets['EdgeBands'] =  wsEBList
    
    //https://github.com/protobi/js-xlsx

    wb["Sheets"]["cutting_list"]["!cols"] = [
      { wpx : 50 },
      { wpx : 100 },
      { wpx : 100 },
      { wpx : 50 },
      { wpx : 50 },
      { wpx : 50 },
      { wpx : 50 },
      { wpx : 50 },   
      { wpx : 50 },
      { wpx : 50 },
      { wpx : 50 },
      { wpx : 50 },
      { wpx : 50 },      
      { wpx : 50 }, 
      { wpx : 100 },      
      { wpx : 150 },     
      { wpx : 150 }     
    ];

    wb["Sheets"]["EdgeBands"]["!cols"] = [
      { wpx : 150 },
      { wpx : 100 },
      { wpx : 100 },
      { wpx : 100 } 
    ];

    const wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary', cellStyles: true})

    const buf = new ArrayBuffer(wbout.length)
    const view = new Uint8Array(buf)

    for (let i=0; i !== wbout.length; ++i)
        view[i] = wbout.charCodeAt(i) & 0xFF

    let url = window.URL.createObjectURL(new Blob([buf], {type:'application/octet-stream'}))

    let a = document.createElement('a')
    a.href = url
    a.download = wo.wonumber + '.xlsx'
    a.click()

    window.URL.revokeObjectURL(url)

  };
