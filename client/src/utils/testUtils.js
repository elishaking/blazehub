import { ShallowWrapper } from 'enzyme';

/**
 * Find component with the specified test attribute
 * @param {ShallowWrapper} component 
 * @param {string} attr 
 */
export const findByTestAttr = (component, attr) => component
  .find(`[data-test='${attr}']`);

/**
 * Find item with the specified attribute
 * @param {ShallowWrapper} component 
 * @param {string} attrKey 
 * @param {string} attrVal 
 */
export const findByAttr = (component, attrKey, attrVal) => component
  .find(`[${attrKey}='${attrVal}']`);