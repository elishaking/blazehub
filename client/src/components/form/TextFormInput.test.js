import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { TextFormInput } from './TextFormInput';

/**
 * Shallow render component with props
 * @param {{
      type: string;
      name: string;
      placeholder: string;
      onChange: Function;
      error: string;
      value?: string;
    }} props 
 */
const setUp = (props) => shallow(<TextFormInput {...props} />);

/**
 * Find component with the specified test attribute
 * @param {ShallowWrapper} component 
 * @param {string} attr 
 */
const findByTestAttr = (component, attr) => component
  .find(`[data-test='${attr}']`);

describe('TextFormInput Component', () => {
  describe('With Props', () => {
    const props = {
      type: 'text',
      name: 'email',
      placeholder: 'email',
      onChange: () => { console.log('changed') },
      error: 'email required',
      value: '',
    };
    const wrapper = setUp(props);
    console.log(wrapper.debug());

    it('should render without errors', () => {
      const component = findByTestAttr(wrapper, 'textFormInputComponent');

      expect(component.length).toEqual(1);
    });
  });

});
