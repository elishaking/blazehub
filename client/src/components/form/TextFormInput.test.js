import React from 'react';
import { shallow } from 'enzyme';
import { TextFormInput, TextAreaFormInput } from './TextFormInput';
import { findByAttr, findByTestAttr } from '../../tests/utils/testUtils';

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
const setUp = (props) => shallow(
  props.type ? <TextFormInput {...props} /> : <TextAreaFormInput {...props} />
);

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

    it('should have error element (represented by small tag)', () => {
      const small = wrapper.find('small');

      expect(small.length).toEqual(1);
    });
  });
});

describe('TextAreaFormInput Component', () => {
  describe('With Props', () => {
    const props = {
      type: '',
      name: 'description',
      placeholder: 'description',
      onChange: () => { console.log('changed') },
      error: 'description required',
      value: '',
    };
    const wrapper = setUp(props);

    it('should render without errors', () => {
      const component = findByTestAttr(wrapper, 'textAreaFormInputComponent');

      expect(component.length).toEqual(1);
    });

    it('should have input', () => {
      const textarea = wrapper.find('textarea');

      expect(textarea.length).toEqual(1);
    });

    it('should have input with correct attributes', () => {
      const textarea = wrapper.find('textarea');

      expect(findByAttr(textarea, 'name', props.name).length).toEqual(1);
      expect(findByAttr(textarea, 'value', props.value).length).toEqual(1);
      expect(findByAttr(textarea, 'placeholder', props.placeholder).length).toEqual(1);
      expect(findByAttr(textarea, 'className', 'fill-parent error').length).toEqual(1);
      expect(textarea.find(`[rows=3]`).length).toEqual(1);
    });

    it('should have error element (represented by small tag)', () => {
      const small = wrapper.find('small');

      expect(small.length).toEqual(1);
    });
  });
});
