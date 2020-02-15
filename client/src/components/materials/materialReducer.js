import {
  GET_MATERIAL,
  SAVE_EDGEBANDS,
  SAVE_BOARDS,
  SAVE_LAMINATES,
  SAVE_MATERIALCODES,
  SAVE_PROFILES
} from '../../actions/types';

export default function(state = {}, action) {
  switch (action.type) {
    case  GET_MATERIAL:
      return action.payload;
    case  SAVE_BOARDS:
      let materialWithUpdatedBoards = {...state,boards:action.payload}
      return materialWithUpdatedBoards;      
    case  SAVE_LAMINATES:
      let materialWithUpdatedLaminates = {...state,laminates:action.payload}
      return materialWithUpdatedLaminates;  
    case  SAVE_MATERIALCODES:
      let materialWithUpdatedCodes = {...state,materialCodes:action.payload}
      return materialWithUpdatedCodes;      
    case  SAVE_PROFILES:
      let materialWithUpdatedProfiles = {...state,profiles:action.payload}
      return materialWithUpdatedProfiles;   
    case  SAVE_EDGEBANDS:
      let materialWithUpdatedEdgebands = {...state,edgebands:action.payload}
      return materialWithUpdatedEdgebands;              
    default:
      return state;
  }
}
