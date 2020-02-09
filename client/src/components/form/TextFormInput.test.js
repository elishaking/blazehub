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

/**
 * Find item with the specified attribute
 * @param {*} component 
 * @param {*} attrKey 
 * @param {*} attrVal 
 */
const findByAttr = (component, attrKey, attrVal) => component
  .find(`[${attrKey}='${attrVal}']`);

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

    it('should render without errors', () => {
      const component = findByTestAttr(wrapper, 'textFormInputComponent');

      expect(component.length).toEqual(1);
    });

    it('should have input', () => {
      const input = wrapper.find('input');

      expect(input.length).toEqual(1);
    });

    it('should have input with correct attributes', () => {
      const input = wrapper.find('input');

      expect(findByAttr(input, 'type', props.type).length).toEqual(1);
      expect(findByAttr(input, 'name', props.name).length).toEqual(1);
      expect(findByAttr(input, 'value', props.value).length).toEqual(1);
      expect(findByAttr(input, 'placeholder', props.placeholder).length).toEqual(1);
      expect(findByAttr(input, 'className', 'fill-parent error').length).toEqual(1);
    });
  });
});
