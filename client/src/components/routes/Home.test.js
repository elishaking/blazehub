import React from 'react';
import Home from './Home';
import { shallow } from 'enzyme';
import { findByTestAttr, findByAttr, testStore } from '../../tests/utils/testUtils';
import { firebaseMock } from '../../tests/utils/mocks';
import app from 'firebase/app';

const setUp = (initialState = {}) => {
  const store = testStore(initialState);
  const wrapper = shallow(<Home store={store} />)
    .childAt(0).dive();
  return wrapper;
};

describe('Home Component', () => {
  let wrapper;

  beforeEach(() => {
    // @ts-ignore
    app.database = firebaseMock();

    const initialState = {
      auth: {
        isAuthenticated: true,
        user: { name: "King" },
        errors: {}
      },
      profile: {
        avatar: "avatarDataUrl",
        coverPhoto: "coverPhotoDataUrl"
      }
    };

    wrapper = setUp(initialState);
  });

  it('should render without errors', () => {
    const component = findByTestAttr(wrapper, 'homeComponent');
    expect(component.length).toEqual(1);
  });

  // it('', () => {
  //   const createPostBtn = findByTestAttr(wrapper, 'createPostBtn');
  // });
});
