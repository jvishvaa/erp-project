/* eslint-disable import/prefer-default-export */
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
// import setDefaultYear from '../reducers/common-reducer'

export const uploadFile = async (file) => {
  try {
    const response = await axiosInstance.post('/academic/upload-question-file/', file);
    return response.data.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const commonActions = {
  ACADEMIC_YEAR_LIST: 'ACADEMIC_YEAR_LIST',
  MS_API: 'MS_API',
  SELECTED_YEAR: 'SELECTED_YEAR'
};

const { ACADEMIC_YEAR_LIST,SELECTED_YEAR, MS_API } = commonActions;

const getDefaultYear = (data) =>{
  return data.filter(({is_current_session=false}) =>Boolean(is_current_session))[0] 
}

export const fetchAcademicYearList = (moduleId) => (dispatch) => {
  dispatch({ type: ACADEMIC_YEAR_LIST, payload: [] });
  let url = endpoints.userManagement.academicYear;
  if (moduleId) url += `?module_id=${moduleId}`;
  return axiosInstance
    .get(url)
    .then((response) => {
      const { data = {} } = response || {};
      const { status_code, data: academicYearData = [] } = data || {};
      if (status_code > 199 && status_code < 300) {
        const current_academic_year = getDefaultYear(academicYearData) ;
        sessionStorage.setItem('acad_session', JSON.stringify(current_academic_year));
        sessionStorage.setItem('acad_session_list', JSON.stringify(academicYearData));
        // dispatch({type: SELECTED_YEAR, payload: current_academic_year})
        dispatch({ type: ACADEMIC_YEAR_LIST, payload: academicYearData });
      }
    })
    .catch(() => {
      dispatch({ type: ACADEMIC_YEAR_LIST, payload: [] });
    });
};

export const currentSelectedYear = (data) => (dispatch) => {
  dispatch({type: SELECTED_YEAR, payload: data})
}

export const isMsAPI = () => (dispatch)  =>{
  let { token = null } = JSON.parse(localStorage.getItem('userDetails')) || {};
  if (!token) {
    return;
  }
  dispatch({ type: MS_API, payload: false });
  axiosInstance
    .get(`/erp_user/oncls-ms-config/`)
    .then((response) => {
      localStorage.setItem('isMsAPI', response?.data?.result[0]);
      response?.data?.result[0]
        ? localStorage.setItem('launchDate', response?.data?.result[1])
        : localStorage.removeItem('launchDate');
      dispatch({ type: MS_API, payload: response?.data?.result[0] });
    })
    .catch(() => {
      dispatch({ type: MS_API, payload: false });
    });
};
