import React from 'react';
import { shallow } from 'enzyme';
import { DateFormInput } from './DateFormInput';
import { findByAttr, findByTestAttr } from '../../tests/utils/testUtils';

/**
 * Shallow render component with props
 * @param {{
      name: string;
      placeholder: string;
      onChange: Function;
      error: string;
      value?: string;
    }} props 
 */
const setUp = (props) => shallow(<DateFormInput {...props} />);

describe('TextFormInput Component', () => {
  describe('With Props', () => {
    const props = {
      name: 'date',
      placeholder: 'date',
      onChange: () => { console.log('changed') },
      error: 'date required',
      value: '',
    };
    const wrapper = setUp(props);

    it('should render without errors', () => {
      const component = findByTestAttr(wrapper, 'dateFormInputComponent');

      expect(component.length).toEqual(1);
    });

    it('should have input', () => {
      const input = wrapper.find('input');

      expect(input.length).toEqual(1);
    });

    it('should have input with correct attributes', () => {
      const input = wrapper.find('input');

      expect(findByAttr(input, 'type', 'date').length).toEqual(1);
      expect(findByAttr(input, 'name', props.name).length).toEqual(1);
      expect(findByAttr(input, 'value', props.value).length).toEqual(1);
      expect(findByAttr(input, 'placeholder', props.placeholder).length).toEqual(1);
      expect(findByAttr(input, 'className', 'fill-parent error').length).toEqual(1);
    });

    it('should have error element (represented by small tag)', () => {
      const small = wrapper.find('small');

      expect(small.length).toEqual(1);
    });
  });
});
