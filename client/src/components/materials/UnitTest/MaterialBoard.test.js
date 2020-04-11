import { shallow } from 'enzyme';
import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import MaterialBoard from '../MaterialBoard';

let wrapper;

describe('<MaterialBoard>', () => {

  beforeEach(() => {

    const material = {
      "boards":[{"boardNumber":1,"type":"Plywood","height":2420,"width":1210,"thickness":16,"grains":0,"grade":"303","company":"Pride","allowEdgeBand":false}],
      "laminates":[{"laminateNumber":1,"code":".8 offwhite Virgo","thickness":".8","grains":"N"},{"laminateNumber":2,"code":"11510","thickness":".8","grains":"H"}],
      "materialCodes":[{"materialCodeNumber":1,"board":1,"front_laminate":1,"back_laminate":0,"shortname":"OSL-W"},{"materialCodeNumber":2,"board":1,"front_laminate":1,"back_laminate":1,"shortname":"BSL-W"},{"materialCodeNumber":3,"board":1,"front_laminate":2,"back_laminate":0,"shortname":"osl-11510"},{"materialCodeNumber":4,"board":1,"front_laminate":2,"back_laminate":2,"shortname":"BSL-11510"},{"materialCodeNumber":5,"board":1,"front_laminate":2,"back_laminate":1,"shortname":"11510+W"}],"profiles":[{"profileNumber":1,"type":"Handle Profile","height":35,"width":22},{"profileNumber":2,"type":"Edge Profile","height":1.3,"width":22}],
      "edgebands":[{"materialEdgeBandNumber":6,"laminate":2,"eb_thickness":2,"eb_width":45},{"materialEdgeBandNumber":5,"laminate":2,"eb_thickness":2,"eb_width":22},{"materialEdgeBandNumber":4,"laminate":2,"eb_thickness":0.45,"eb_width":22},{"materialEdgeBandNumber":2,"laminate":2,"eb_thickness":0.8,"eb_width":30},{"materialEdgeBandNumber":7,"laminate":1,"eb_thickness":0.45,"eb_width":22}],
      "profiles":[{"profileNumber":1,"type":"Handle Profile","height":35,"width":22}],
      "_id":"5e71c6e52230773567102109",
      "wo_id":"5e71c6e52230773567102108","__v":0
    }

    wrapper = shallow(<MaterialBoard material={material} />);
    wrapper.setState({ boards: material.boards });
    wrapper.setProps({ material:material });
    wrapper.instance(); 
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders items', () => {
    expect(wrapper.find('.table')).toBeDefined();
    expect(wrapper.find('.table tbody tr')).toHaveLength(1);
  });

  it('add new item', () => {
    wrapper.find('#btnAddItem').simulate('click');
    expect(wrapper.find('.table tbody tr')).toHaveLength(2);
  });

  it('edit item', () => {
    wrapper.find('#height').value = 1;
    setTimeout(function() {
      wrapper.update();
      expect(wrapper.state().boards[0].height).toEqual(1);  
      done();
    }, 100);
  });
  
  it('remove item', () => {
    wrapper.find('.remove').simulate('click');
    setTimeout(function() {
      expect(wrapper.find('.table tbody tr')).toHaveLength(0);
      done();
    }, 200);
  });




});