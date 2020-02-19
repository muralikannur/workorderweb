import $ from 'jquery';
import { toast } from 'react-toastify';


export const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const hasDuplicate = (items, keys) => {
  if(!items || items.length == 0 ) return false;
  let filtered = items.filter(
    (s => o =>
      (k => !s.has(k) && s.add(k))
        (keys.map(k => o[k]).join('|'))
    )
      (new Set)
  );
  if (filtered.length != items.length) {
    return true;
  }
  return false;
}


export const isEmptyOrSpaces = (str) => {
  str = $.trim(str);
  return ( str == '' || str == '0');
}




export const notify_error = (msg) => {
  toast.error(msg, {
    position: toast.POSITION.TOP_CENTER,
    autoClose:5000
    
  });
};

export const notify_success = (msg) => {
  toast.success(msg, {
    position: toast.POSITION.TOP_CENTER,
    autoClose:1000
  });
};


