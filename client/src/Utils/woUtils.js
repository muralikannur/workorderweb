
import { REMARKS, PROFILE_TYPE, EB_START_NUMBER, PATTERN_CODE} from '../constants';
import { notify_error, notify_success, isEmptyOrSpaces }  from './commonUtls';
import propTypes from 'prop-types'

export const getMaterialText = (m, material) =>{
  if(!isEmptyOrSpaces(m.shortname)) return '[' + m.materialCodeNumber + '] ' + m.shortname;

  const b = material.boards.find(i => i.boardNumber == m.board);
  const fl = material.laminates.find(i => i.laminateNumber == m.front_laminate);
  const bl = material.laminates.find(i => i.laminateNumber == m.back_laminate);

  let matText = '[' + m.materialCodeNumber + '] ' + (m.board == 0 || !b ? 'No Board' : 'B: ' + b.type + ' - ' + b.thickness + 'mm (' + b.height + ' x ' +  b.width + ') - ' + b.grains);
  matText += (m.front_laminate == 0 || !fl ? '' : ', FL: ' + fl.code + ' - ' + fl.thickness + 'mm - ' + fl.grains);
  matText += (m.back_laminate == 0 || !bl ? '' : ', BL: ' + bl.code + ' - ' + bl.thickness + 'mm - ' + bl.grains);
  return matText;
}

export const getEBText = (id, edgebands) => {
  const eb = edgebands.find(e => e.materialEdgeBandNumber == id);
  if(eb){
    return eb.eb_thickness + ' - ' + eb.eb_width;
  }
  return '';
}
export const getEBThickness = (id, edgebands) => {
  const eb = edgebands.find(e => e.materialEdgeBandNumber == id);
  if(eb){
    return parseFloat(eb.eb_thickness);
  }
  return 0;
}

export const getEBOptions = (item, material) => {
  //EDGE BAND OPTIONS----------------------------------------------------------------  
  let ebOptions = [{
    materialEdgeBandNumber:0,
    laminate:'0',
    eb_thickness:'',
    eb_width:'',
  }];

  if(item.code == PATTERN_CODE){
    if(item.patternSplits && item.patternSplits.length > 0){
      const splitEB = item.patternSplits.find(s => s.eb);
      if(splitEB){
        const mat = material.materialCodes.find(mc => mc.materialCodeNumber == splitEB.code);
        if(mat){
          const laminate = material.edgebands.filter(eb => eb.laminate == mat.front_laminate );
          ebOptions = [...ebOptions, ...laminate];
        }
      }
    }
    return ebOptions;
  }

  if(item.parentId != 0){
    const ebWithoutProfiles = material.edgebands.filter(e => e.laminate < EB_START_NUMBER.PROFILE )
    if(ebWithoutProfiles && ebWithoutProfiles.length > 0){
      ebOptions = [...ebOptions, ...ebWithoutProfiles];
    }
    return ebOptions;
  }

  // let ebWithoutProfiles = material.edgebands.filter(e => e.laminate < EB_START_NUMBER.PROFILE )
  // let childEBOptions = [...ebOptions, ...ebWithoutProfiles];

  let hasEProfile = false;

  //If Item has E-Profile selected, EB sides should be default to E-Profiles thicknes and width
  if(item.remarks.indexOf(REMARKS.E_PROFILE) != -1){
    let eProfile = material.profiles.find(p => p.type == PROFILE_TYPE.E)
    if(eProfile){
      let edgeband = material.edgebands.find(eb => eb.laminate == EB_START_NUMBER.PROFILE + parseInt(eProfile.profileNumber))
      if(edgeband){
        ebOptions = [edgeband]
        hasEProfile = true;
      }
    }
  }

  if(!hasEProfile){
    if(material.materialCodes){
      const mat = material.materialCodes.find(mc => mc.materialCodeNumber == item.code);
      if(mat){
        const laminate = material.edgebands.filter(eb => eb.laminate == mat.front_laminate );
        const board = material.edgebands.filter(eb => eb.laminate == parseInt(mat.board) + EB_START_NUMBER.BOARD);
        console.log(board)
        
        if(laminate || board){
          ebOptions = [...ebOptions, ...laminate, ...board];
        }
      } else if(item.code == PATTERN_CODE){
        ebOptions = [...ebOptions, ...material.edgebands];
      }
    }
  }

  return ebOptions;

}



export const getRemarkData = (id, item, material) =>{
    let remarkData = '';
    if(item.parentId !=0) return remarkData;

    switch(id){
      case REMARKS.PROFILE:
          remarkData = 'PROFILE';
          break;
      case REMARKS.E_PROFILE:
          remarkData = 'E_PROFILE';
          break;
      case REMARKS.DBLTHICK:
          remarkData = 'DBLTHICK';
          break;    
      case REMARKS.SHAPE:
          remarkData = 'SHAPE';
          break;                                
      case REMARKS.LEDGE:
          remarkData = item.ledgeType == "1" ? 'LEDGE' : 'C-LEDGE'
          break;  
      case REMARKS.GLASS:
          remarkData = 'GLASS';
          break;                              
      case REMARKS.PATTERN:
          remarkData = 'PATTERN';
          break;   
    }
    return remarkData;
      
  }

  
export const getRemarkDataDetails = (id, item, material) =>{
  let remarkData = '';
  if(item.parentId !=0) return remarkData;

  switch(id){
    case REMARKS.PROFILE:
        const profile = material.profiles.find(p => p.profileNumber == item.profileNumber)
        if(profile)
          remarkData = profile.type + ' - H: ' + profile.height + ' - W: ' + profile.width + '(' + item.profileSide + ')';
        break;
    case REMARKS.E_PROFILE:
        const eProfile = material.profiles.find(p => p.type == PROFILE_TYPE.E)
        if(eProfile)
          remarkData = eProfile.type + ' - H: ' + eProfile.height + ' - W: ' + eProfile.width;
        break;
    case REMARKS.DBLTHICK:
        remarkData = 'DBL THICK - ' + item.doubleThickWidth;
        break;    
    case REMARKS.SHAPE:
        remarkData = 'SHAPE - ' + item.shapeDetails.substring(0,15);
        break;                                
    case REMARKS.LEDGE:
        remarkData = item.ledgeType == "1" ? 'LEDGE' : 'C-LEDGE'
        break;  
    case REMARKS.GLASS:
        remarkData = 'GLASS - ' + item.glassWidth;
        break;                              
    case REMARKS.PATTERN:
        remarkData = 'PATTERN ' + item.patternSplits.length;
        break;   
  }

  return remarkData;
    
}

  export const Item = {
    itemnumber:propTypes.number.isRequired
  }

  

  export const getNewWoItem = (maxId) => {
    return {
      itemnumber:maxId,
      parentId:0,
      itemtype:'',
      height:'',
      width:'',
      quantity:'',
      eb_a:0,
      eb_b:0,
      eb_c:0,
      eb_d:0,
      code:0,
      remarks:[],
      comments:'',
      profileNumber:0,
      profileSide:'',
      doubleThickWidth:0,
      ledgeType:0,
      shapeDetails:'',
      patternType:0,
      glassWidth:0,
      patternSplits:[],
      patternBoardCode:0,
      doubleThickSides:'ABCD',
      doubleThickCode:0,
      ebCopied:false,
      childNumber:0
    }
  }