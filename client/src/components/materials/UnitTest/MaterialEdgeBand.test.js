import { shallow } from 'enzyme';
import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import MaterialEdgeBand from '../MaterialEdgeBand';

let wrapper;

describe('<MaterialEdgeBand>', () => {

  beforeEach(() => {

    const material = {
      "boards":[{"boardNumber":1,"type":"Plywood","height":2420,"width":1210,"thickness":16,"grains":0,"grade":"303","company":"Pride","allowEdgeBand":false}],
      "laminates":[{"laminateNumber":1,"code":".8 offwhite Virgo","thickness":".8","grains":"N"}],
      "materialCodes":[{"materialCodeNumber":1,"board":1,"front_laminate":1,"back_laminate":0,"shortname":"OSL-W"},{"materialCodeNumber":2,"board":1,"front_laminate":1,"back_laminate":1,"shortname":"BSL-W"},{"materialCodeNumber":3,"board":1,"front_laminate":2,"back_laminate":0,"shortname":"osl-11510"},{"materialCodeNumber":4,"board":1,"front_laminate":2,"back_laminate":2,"shortname":"BSL-11510"},{"materialCodeNumber":5,"board":1,"front_laminate":2,"back_laminate":1,"shortname":"11510+W"}],"profiles":[{"profileNumber":1,"type":"Handle Profile","height":35,"width":22},{"profileNumber":2,"type":"Edge Profile","height":1.3,"width":22}],
      "edgebands":[{"materialEdgeBandNumber":1,"laminate":1,"eb_thickness":2,"eb_width":45}],
      "profiles":[{"profileNumber":1,"type":"Handle Profile","height":35,"width":22}],
      "_id":"5e71c6e52230773567102109",
      "wo_id":"5e71c6e52230773567102108","__v":0
    }

    wrapper = shallow(<MaterialEdgeBand material={material} />);
    wrapper.setState({ materialEdgeBands: material.edgebands });
    wrapper.setProps({ material:material });
    wrapper.instance(); 
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders items', () => {
    expect(wrapper.find('#mat-row-edgeband-1-1')).toBeDefined();
  });

  it('add new item', () => {
    expect(wrapper.find('#mat-row-edgeband-1-2')).toBeDefined();
  });

  it('edit item', () => {
    wrapper.find('#eb_thickness').value = 1;
    setTimeout(function() {
      wrapper.update();
      expect(wrapper.state().materialEdgeBands[0].eb_thickness).toEqual(1);  
      done();
    }, 100);
  });
  
  it('remove item', () => {
    wrapper.find('.remove').simulate('click');
    setTimeout(function() {
      expect(wrapper.find('#mat-row-edgeband-1-1').exists()).toBeFalsy();
      done();
    }, 200);
  });




});