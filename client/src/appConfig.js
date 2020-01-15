import { REMARKS, PROFILE_TYPE} from './constants';


export const edgeBandThickness = [0,0.45, 0.8,1, 1.3, 2]; 
export const edgeBandWidth = [0,22,30,45]; 

export const boardType = ['Plywood','MDF','PVC','Particle Board']; 

export const profileType = [PROFILE_TYPE.H, PROFILE_TYPE.E]; 


export const uniqueKeys = {
  item: ['itemtype', 'code', 'height', 'width', 'eb_a', 'eb_b', 'eb_c', 'eb_d', 'remarks'],
  board: ['type','height','width','thickness','grains','grade','company'],
  laminate:['code','thickness','grains'],
  materialCode:['board','front_laminate','back_laminate'],
  profile:['type','height','width'],
  edgebands:['laminate','eb_thickness','eb_width'],  
};

export const threshold = {
  maxHeight: 5000,
  minHeight: 10,
  maxWidth: 5000,
  minWidth: 10,
  maxQuantity: 10000,
  minQuantity: 1
};

export const remarks = [
  {id:REMARKS.PROFILE,name:'Handle Profile'},
  {id:REMARKS.E_PROFILE,name:'Edge Profile'},
  {id:REMARKS.GLASS,name:'Glass'},
  {id:REMARKS.DBLTHICK,name:'Double Thick'}, 
  {id:REMARKS.LEDGE,name:'Ledge'},
  {id:REMARKS.SHAPE,name:'Shape'}, 
  {id:REMARKS.PATTERN,name:'Pattern'}
];

