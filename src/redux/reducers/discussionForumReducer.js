import { types } from '../actions/discussionForumActions';

const initialState = {
  post: {},
  filters: {
    year: '',
    branch: '',
    grade: '',
    section: '',
  },
  categoryList: [],
  category_list: '',

};

const discussionReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.DISCUSSION_POST:
      return {
        post: action.payload,
      };
    case types.FILTER_DATA:
      return {
        filters: {
          year: '',
          branch: '',
          grade: '',
          section: '',
        },
      };
    case types.FETCH_SUB_SUB_CATEGORY_LIST:
      return {
        category_list: true
      }
    case types.FETCH_SUB_SUB_CATEGORY_LIST_SUCCESS:
      return {
        categoryList: action.data
      }
    case types.FETCH_SUB_SUB_CATEGORY_LIST_FAILURE:
      return {
        categoryList: action.data
      }
    default:
      return state;
  }
};

export default discussionReducer;
