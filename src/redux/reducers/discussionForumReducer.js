import { types } from '../actions/discussionForumActions';

const initialState = {
  post: {},
  filters: {
    year: '',
    branch: '',
    grade: '',
    section: '',
  },
  category_data: '',
  category_list: '',
  sub_category_list: '',
  sub_sub_category_list: '',
  categoryData: [],
  categoryList: [],
  subCategoryList: [],
  subSubCategoryList: [],

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
    case types.FETCH_CATEGORY_DATA:
      return {
        ...state,
        category_data: true
      }
    case types.FETCH_CATEGORY_DATA_SUCCESS:
      return {
        ...state,
        categoryData: action.data
      }
    case types.FETCH_CATEGORY_DATA_FAILURE:
      return {
        ...state,
        categoryData: action.data
      }
    
    case types.FETCH_CATEGORY_LIST:
      return {
        ...state,
        category_list: true
      }
    case types.FETCH_CATEGORY_LIST_SUCCESS:
      return {
        ...state,
        categoryList: action.data
      }
    case types.FETCH_CATEGORY_LIST_FAILURE:
      return {
        ...state,
        categoryList: action.data
      }
    
    case types.FETCH_SUB_CATEGORY_LIST:
      return {
        ...state,
        sub_category_list: true
      }
    case types.FETCH_SUB_CATEGORY_LIST_SUCCESS:
      return {
        ...state,
        subCategoryList: action.data
      }
    case types.FETCH_SUB_CATEGORY_LIST_FAILURE:
      return {
        ...state,
        subCategoryList: action.data
      }
    
    case types.FETCH_SUB_SUB_CATEGORY_LIST:
      return {
        ...state,
        sub_sub_category_list: true
      }
    case types.FETCH_SUB_SUB_CATEGORY_LIST_SUCCESS:
      return {
        ...state,
        subSubCategoryList: action.data
      }
    case types.FETCH_SUB_SUB_CATEGORY_LIST_FAILURE:
      return {
        ...state,
        subSubCategoryList: action.data
      }
    default:
      return state;
  }
};

export default discussionReducer;
