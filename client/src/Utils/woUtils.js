
import { REMARKS, PROFILE_TYPE, EB_START_NUMBER} from '../constants';
import { notify_error, notify_success, isEmptyOrSpaces }  from './commonUtls';
import propTypes from 'prop-types'

export const getMaterialText = (m, material) =>{
  if(!isEmptyOrSpaces(m.shortname)) return '[' + m.materialCodeNumber + '] ' + m.shortname;

  const b = material.boards.find(i => i.boardNumber == m.board);
  const fl = material.laminates.find(i => i.laminateNumber == m.front_laminate);
  const bl = material.laminates.find(i => i.laminateNumber == m.back_laminate);

  let matText =  (m.board == 0 ? 'No Board' : 'B: ' + b.type + ' - ' + b.thickness + 'mm (' + b.height + ' x ' +  b.width + ') - ' + b.grains);
  matText += (m.front_laminate == 0 ? '' : ', FL: ' + fl.code + ' - ' + fl.thickness + 'mm - ' + fl.grains);
  matText += (m.back_laminate == 0 ? '' : ', BL: ' + bl.code + ' - ' + bl.thickness + 'mm - ' + bl.grains);
  return matText;
}

export const getRemarkData = (id, item, material) =>{
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
      doubleThickCode:0
    }
  }