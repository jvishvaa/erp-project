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
  SELECTED_YEAR: 'SELECTED_YEAR',
  ERP_CONFIG: 'ERP_CONFIG'
};

const { ACADEMIC_YEAR_LIST,SELECTED_YEAR, MS_API, ERP_CONFIG } = commonActions;

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
        if(!current_academic_year){
          sessionStorage.setItem('acad_session', JSON.stringify(academicYearData[0]));
        }else{
          sessionStorage.setItem('acad_session', JSON.stringify(current_academic_year));
        }
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

export const erpConfig = () => (dispatch) => {
  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
    const { branch } = data?.role_details;
    let result = [];
    axiosInstance
      .get(endpoints.checkAcademicView.isAcademicView)
      .then((res) => {
        if (res?.data?.status_code === 200) {
          if (res?.data?.result == 'True') {
            data['erp_config']=true
            localStorage.setItem('userDetails', JSON.stringify(data)); 
            dispatch({ type: ERP_CONFIG, payload: true });
          } else if (res?.data?.result == 'False') {
            data['erp_config']=false
            localStorage.setItem('userDetails', JSON.stringify(data)); 
            dispatch({ type: ERP_CONFIG, payload: false });
          } else if (res?.data?.result.length > 0) {
            branch.forEach((element) => {
              if (res.data.result[0].toString().includes(element.id)) {
                result.push(element.id);
              }
            });
            data['erp_config']=result
            localStorage.setItem('userDetails', JSON.stringify(data)) 
            dispatch({ type: ERP_CONFIG, payload: result });
          }
        }
      })
      .catch(() => {
      dispatch({ type: ERP_CONFIG, payload: false });
    });
}
