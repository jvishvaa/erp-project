import { types } from '../actions';

const initialState = {
  post: {},
  filters: {
    year: '',
    branch: '',
    grade: '',
    section: '',
  },
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.DISCUSSION_POST:
      return {
        post: action.payload,
      };
    default:
      return state;
  }
};

export default postReducer;
