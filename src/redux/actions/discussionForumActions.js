import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';

export const types = {
  DISCUSSION_POST: 'DISCUSSION_POST',
  FILTER_DATA: 'FILTER_DATA',
  EDIT_CATEGORI_DATA: 'EDIT_CATEGORI_DATA',
  UPDATE_CATAGORY: 'UPDATE_CATAGORY',
  UPDATE_CATAGORY_SUCCESS: 'UPDATE_CATAGORY_SUCCESS',
  UPDATE_CATAGORY_FAILURE: 'UPDATE_CATAGORY_FAILURE',
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
  EDIT_DISCCUSION_POST: 'EDIT_DISCCUSION_POST',
  EDIT_DISCCUSION_POST_SUCCESS: 'EDIT_DISCCUSION_POST_SUCCESS',
  EDIT_DISCCUSION_POST_FAILURE: 'EDIT_DISCCUSION_POST_FAILURE',
  UPADATE_DISCCUSION_POST: 'UPADATE_DISCCUSION_POST',
  UPADATE_DISCCUSION_POST_SUCCESS: 'UPADATE_DISCCUSION_POST_SUCCESS',
  UPADATE_DISCCUSION_POST_FAILURE: 'UPADATE_DISCCUSION_POST_FAILURE',
};

const { 
  DISCUSSION_POST,
  FILTER_DATA,
  UPDATE_CATAGORY,
  UPDATE_CATAGORY_SUCCESS,
  UPDATE_CATAGORY_FAILURE,
  EDIT_CATEGORI_DATA,
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
  EDIT_DISCCUSION_POST,
  EDIT_DISCCUSION_POST_SUCCESS,
  EDIT_DISCCUSION_POST_FAILURE,
  UPADATE_DISCCUSION_POST,
  UPADATE_DISCCUSION_POST_SUCCESS,
  UPADATE_DISCCUSION_POST_FAILURE,
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

export const editCategoryDataAction = (data) => {
  return {
    type: EDIT_CATEGORI_DATA,
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

export const updateAllCategory = (params, id) => dispatch => {
  dispatch({type: UPDATE_CATAGORY});
  return axiosInstance.put(`/academic/${id}/update-category/`,params)
  .then((res) => {
    console.log(res.data);
    dispatch({ type: UPDATE_CATAGORY_SUCCESS, data: res.data.result});
  })
  .catch((error) => {
    dispatch({ type: UPDATE_CATAGORY_FAILURE, data: []});
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

export const editPostDataAction = postId => dispatch => {
  dispatch({ type: EDIT_DISCCUSION_POST});
  return axiosInstance.get(`/academic/${postId}/retrieve-post/`)
    .then((res) => {
      dispatch({ type: EDIT_DISCCUSION_POST_SUCCESS, data: res.data.result});
    })
    .catch((error) => {
      console.log(error)
      dispatch({ type: EDIT_DISCCUSION_POST_FAILURE, data: {}});
    });
}

export const editPostData = (params, postId) => dispatch => {
  dispatch({ type: UPADATE_DISCCUSION_POST});
  return axiosInstance.put(`/academic/${postId}/update-post/`, params)
  .then((res) => {
    dispatch({ type: UPADATE_DISCCUSION_POST_SUCCESS, data: res.data});
  })
  .catch((error) => {
    console.log(error);
    dispatch({ type: UPADATE_DISCCUSION_POST_FAILURE, data: {}});
  })
}