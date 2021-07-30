/* eslint-disable import/prefer-default-export */
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';

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
};

const { ACADEMIC_YEAR_LIST } = commonActions;

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
        const [current_academic_year = {}] = academicYearData || [];
        localStorage.setItem('acad_session', JSON.stringify(current_academic_year));
        dispatch({ type: ACADEMIC_YEAR_LIST, payload: academicYearData });
      }
    })
    .catch(() => {
      dispatch({ type: ACADEMIC_YEAR_LIST, payload: [] });
    });
};
