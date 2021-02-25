import { DISCUSSION_POST } from '../action/types';

const initialState = {
  post: {},
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case DISCUSSION_POST:
      return {
        post: action.payload,
      };
    default:
      return state;
  }
};

export default postReducer;
