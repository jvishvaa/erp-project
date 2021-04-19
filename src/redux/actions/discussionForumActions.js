import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';

export const types = {
  DISCUSSION_POST: 'DISCUSSION_POST',
  FILTER_DATA: 'FILTER_DATA',
  FETCH_CATEGORY_LIST: 'FETCH_CATEGORY_LIST',
  FETCH_SUB_CATEGORY_LIST: 'FETCH_SUB_CATEGORY_LIST',
  FETCH_SUB_SUB_CATEGORY_LIST: 'FETCH_SUB_SUB_CATEGORY_LIST',

  FETCH_CATEGORY_SUCCESS: 'FETCH_CATEGORY_SUCCESS',
  FETCH_CATEGORY_FAILURE: 'FETCH_CATEGORY_FAILURE',
  FETCH_SUB_CATEGORY_LIST_SUCCESS: 'FETCH_SUB_CATEGORY_LIST_SUCCESS',
  FETCH_SUB_CATEGORY_LIST_FAILURE: 'FETCH_SUB_CATEGORY_LIST_FAILURE',
  FETCH_SUB_SUB_CATEGORY_LIST_SUCCESS: 'FETCH_SUB_SUB_CATEGORY_LIST_SUCCESS',
  FETCH_SUB_SUB_CATEGORY_LIST_FAILURE: 'FETCH_SUB_SUB_CATEGORY_LIST_FAILURE',

  FETCH_CATEGORY_LIST_SUCCESS: 'FETCH_CATEGORY_LIST_SUCCESS',
  FETCH_CATEGORY_LIST_FAILURE: 'FETCH_CATEGORY_LIST_FAILURE',

};

const { 
  DISCUSSION_POST,
  FILTER_DATA,
  FETCH_CATEGORY_LIST,
  FETCH_CATEGORY_LIST_SUCCESS,
  FETCH_SUB_SUB_CATEGORY_LIST,
  FETCH_SUB_SUB_CATEGORY_LIST_SUCCESS,
  FETCH_SUB_SUB_CATEGORY_LIST_FAILURE,
  FETCH_CATEGORY_LIST_FAILURE,
  FETCH_CATEGORY_SUCCESS,
  FETCH_CATEGORY_FAILURE
} = types;

export const postAction = (data) => {
  return {
    type: DISCUSSION_POST,
    payload: data,
  };
};

export const filterDataAction = (data) => {
  return {
    type: FILTER_DATA,
    payload: data,
  }
}

export const fetchCategoryList = params => dispatch => {
  dispatch({ type: FETCH_SUB_SUB_CATEGORY_LIST});
  return axiosInstance.get(`${endpoints.discussionForum.categoryList}?category_type=3`)
  .then((res) => {
    dispatch({ type: FETCH_SUB_SUB_CATEGORY_LIST_SUCCESS, data: res.data.result});
  })
  .catch((error) => {
    dispatch({ type: FETCH_SUB_SUB_CATEGORY_LIST_FAILURE, data: []});
    throw error;
  });
}

export const fetchCategory = params => dispatch => {
  dispatch({ type: FETCH_CATEGORY_LIST});
  return axiosInstance.get(`${endpoints.discussionForum.categoryList}?category_type=1`)
  .then((res) => {
    dispatch({ type: FETCH_CATEGORY_SUCCESS, data: res.data.result});
  })
  .catch((error) => {
    dispatch({ type: FETCH_CATEGORY_FAILURE, data: []});
    throw error;
  });
}

export const fetchSubCategory = params => dispatch => {
  dispatch({ type: FETCH_CATEGORY_LIST});
  return axiosInstance.get(`${endpoints.discussionForum.categoryList}?category_type=2`)
  .then((res) => {
    dispatch({ type: FETCH_CATEGORY_SUCCESS, data: res.data.result});
  })
  .catch((error) => {
    dispatch({ type: FETCH_CATEGORY_FAILURE, data: []});
    throw error;
  });
}