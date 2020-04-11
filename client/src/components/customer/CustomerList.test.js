import { shallow } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../../store';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import CustomerList from './CustomerList';
import {GET_CUSTOMER_LIST} from '../../actions/types';


describe('<CustomerList>', () => {

  it('renders customer list', () => {

    const customers = [
        {
            "_id":"",
            "customercode":"RMT",
            "companyname":"",
            "contactperson":"",
            "phone":"",
            "whatsapp":"",
            "email":"",
            "billing_address":"",
            "shipping_address":""
        }
    ]

    store.dispatch({
        type: GET_CUSTOMER_LIST,
        payload: customers
      });

    const wrapper = shallow(<Provider store={store}><CustomerList /></Provider>);
    wrapper.setProps({ customerlist:customers });

    wrapper.instance(); 

    console.log(wrapper.debug());

    expect(wrapper.find('.wolist')).toBeDefined();
    expect(wrapper.find('.wolist tbody tr')).toHaveLength(1);

  });




});