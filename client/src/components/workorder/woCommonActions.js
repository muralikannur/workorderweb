
export const getGrains = (code) => (dispatch, getState) => {

    let material = getState().material;
    if(!material || material.materialCodes.length == 0) return '';

    let mCode = getState().material.materialCodes.find(m => m.materialCodeNumber == code);
    let board = getState().material.boards.find(b => b.boardNumber == mCode.board);
    let laminate = getState().material.laminates.find(l => l.laminateNumber == mCode.front_laminate);

    let grains = "";
    if(laminate && laminate.grains != "N"){
      grains = laminate.grains;
    } else if(board){
      grains = board.grains;
    }

    return grains;
};


export const getEBThickness = (id) => (dispatch, getState) =>{
    let edgebands = getState().material.edgebands;
    if(!edgebands || edgebands.length == 0) return 0;
    
    const eb = getState().material.edgebands.find(e => e.materialEdgeBandNumber == id);
    if(eb){
      return parseFloat(eb.eb_thickness);
    }
    return 0;
  }

  export const getEBWidth = (id) => (dispatch, getState) =>{
    let edgebands = getState().material.edgebands;
    console.log(edgebands);
    if(!edgebands || edgebands.length == 0) return 0;
    
    const eb = edgebands.find(e => e.materialEdgeBandNumber == id);
    console.log(eb);
    if(eb){
      return parseInt(eb.eb_width);
    }
    return 0;
  }