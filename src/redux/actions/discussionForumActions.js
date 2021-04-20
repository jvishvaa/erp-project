import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';

export const types = {
  DISCUSSION_POST: 'DISCUSSION_POST',
  FILTER_DATA: 'FILTER_DATA',
  CREATE_CATEGORY: 'CREATE_CATEGORY',
  CREATE_CATEGORY_SUCCESS: 'CREATE_CATEGORY_SUCCESS',
  CREATE_CATEGORY_FAILURE: 'CREATE_CATEGORY_FAILURE',
  FETCH_CATEGORY_DATA: 'FETCH_CATEGORY_DATA',
  FETCH_CATEGORY_LIST: 'FETCH_CATEGORY_LIST',
  FETCH_SUB_CATEGORY_LIST: 'FETCH_SUB_CATEGORY_LIST',
  FETCH_SUB_SUB_CATEGORY_LIST: 'FETCH_SUB_SUB_CATEGORY_LIST',
  FETCH_CATEGORY_DATA_SUCCESS: 'FETCH_CATEGORY_DATA_SUCCESS',
  FETCH_CATEGORY_DATA_FAILURE: 'FETCH_CATEGORY_DATA_FAILURE',
  FETCH_CATEGORY_LIST_SUCCESS: 'FETCH_CATEGORY_LIST_SUCCESS',
  FETCH_CATEGORY_LIST_FAILURE: 'FETCH_CATEGORY_LIST_FAILURE',
  FETCH_SUB_CATEGORY_LIST_SUCCESS: 'FETCH_SUB_CATEGORY_LIST_SUCCESS',
  FETCH_SUB_CATEGORY_LIST_FAILURE: 'FETCH_SUB_CATEGORY_LIST_FAILURE',
  FETCH_SUB_SUB_CATEGORY_LIST_SUCCESS: 'FETCH_SUB_SUB_CATEGORY_LIST_SUCCESS',
  FETCH_SUB_SUB_CATEGORY_LIST_FAILURE: 'FETCH_SUB_SUB_CATEGORY_LIST_FAILURE',
};

const { 
  DISCUSSION_POST,
  FILTER_DATA,
  CREATE_CATEGORY,
  CREATE_CATEGORY_SUCCESS,
  CREATE_CATEGORY_FAILURE,
  FETCH_CATEGORY_DATA,
  FETCH_CATEGORY_DATA_SUCCESS,
  FETCH_CATEGORY_DATA_FAILURE,
  FETCH_CATEGORY_LIST,
  FETCH_CATEGORY_LIST_SUCCESS,
  FETCH_CATEGORY_LIST_FAILURE,
  FETCH_SUB_CATEGORY_LIST,
  FETCH_SUB_CATEGORY_LIST_SUCCESS,
  FETCH_SUB_CATEGORY_LIST_FAILURE,
  FETCH_SUB_SUB_CATEGORY_LIST,
  FETCH_SUB_SUB_CATEGORY_LIST_SUCCESS,
  FETCH_SUB_SUB_CATEGORY_LIST_FAILURE,
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

export const createAllCategory = params => dispatch => {
  dispatch({type: CREATE_CATEGORY});
  return axiosInstance.post(`${endpoints.discussionForum.PostCategory}`,params)
  .then((res) => {
    console.log(res.data);
    dispatch({ type: CREATE_CATEGORY_SUCCESS, data: res.data.result});
  })
  .catch((error) => {
    dispatch({ type: CREATE_CATEGORY_FAILURE, data: []});
    throw error;
  });
}

export const fetchCategoryData = params => dispatch => {
  dispatch({ type: FETCH_CATEGORY_DATA});
  if(params){
    return axiosInstance.get(`${endpoints.discussionForum.categoryList}?category_id=${params}&category_type=3`)
    .then((res) => {
      dispatch({ type: FETCH_CATEGORY_DATA_SUCCESS, data: res.data.result});
    })
    .catch((error) => {
      dispatch({ type: FETCH_CATEGORY_DATA_FAILURE, data: []});
      throw error;
    });
  }
  else {
    return axiosInstance.get(`${endpoints.discussionForum.categoryList}?category_type=3`)
    .then((res) => {
      dispatch({ type: FETCH_CATEGORY_DATA_FAILURE, data: res.data.result});
    })
    .catch((error) => {
      dispatch({ type: FETCH_CATEGORY_DATA_FAILURE, data: []});
      throw error;
    });
  }
}

export const fetchSubSubCategoryList = params => dispatch => {
  dispatch({ type: FETCH_SUB_SUB_CATEGORY_LIST});
  return axiosInstance.get(`${endpoints.discussionForum.categoryList}?category_id=${params}&category_type=3`)
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
    dispatch({ type: FETCH_CATEGORY_LIST_SUCCESS, data: res.data.result});
  })
  .catch((error) => {
    dispatch({ type: FETCH_CATEGORY_LIST_FAILURE, data: []});
    throw error;
  });
}

export const fetchSubCategory = params => dispatch => {
  dispatch({ type: FETCH_SUB_CATEGORY_LIST});
  return axiosInstance.get(`${endpoints.discussionForum.categoryList}?category_id=${params}&category_type=2`)
  .then((res) => {
    dispatch({ type: FETCH_SUB_CATEGORY_LIST_SUCCESS, data: res.data.result});
  })
  .catch((error) => {
    dispatch({ type: FETCH_SUB_CATEGORY_LIST_FAILURE, data: []});
    throw error;
  });
}