import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../../store';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import Header from './Header';
import {LOGIN_SUCCESS} from '../../actions/types';




describe('<Header>', () => {
  it('renders user email', () => {

    const auth = {
        "token":"",
        "user":{
            "id":"5e1ad58c79748b3aa4e1b109",
            "name":"MUR",
            "email":"muralikannur@gmail.com"
        }
    }

    store.dispatch({
        type: LOGIN_SUCCESS,
        payload: auth
      });

    const wrapper = mount(<Provider store={store}><Header /></Provider>);
    wrapper.instance(); 

    expect(wrapper.find('#userEmail').text()).toEqual('muralikannur@gmail.com');
  });
});