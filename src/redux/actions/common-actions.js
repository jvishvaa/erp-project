/* eslint-disable import/prefer-default-export */
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
// import setDefaultYear from '../reducers/common-reducer'
const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

export const uploadFile = async (file) => {
  try {
    const response = await axiosInstance.post('/academic/upload-question-file/', file);
    return response.data.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const AssessuploadFile = async (file) => {
  try {
    const response = await axiosInstance.post('/academic/upload-question-file/', file);
    return response.data.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const uploadOMRFile = async (file) => {
  try {
    const response = await axiosInstance.post('/assessment/upload-omr-sheet/', file);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

let moduleId;

if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Ebook' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Ebook View') {
          moduleId = item.child_id;
        }
      });
    }
  });
}

export const commonActions = {
  ACADEMIC_YEAR_LIST: 'ACADEMIC_YEAR_LIST',
  MS_API: 'MS_API',
  SELECTED_YEAR: 'SELECTED_YEAR',
  ERP_CONFIG: 'ERP_CONFIG',
  SELECTED_BRANCH: 'SELECTED_BRANCH',
  BRANCH_LIST: 'BRANCH_LIST',
  SELECTED_VERSION: 'SELECTED_VERSION',
};

const {
  ACADEMIC_YEAR_LIST,
  SELECTED_YEAR,
  MS_API,
  ERP_CONFIG,
  SELECTED_BRANCH,
  BRANCH_LIST,
  SELECTED_VERSION,
} = commonActions;

const getDefaultYear = (data) => {
  return data.filter(({ is_current_session = false }) => Boolean(is_current_session))[0];
};

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
        const current_academic_year = getDefaultYear(academicYearData);
        if (!current_academic_year) {
          sessionStorage.setItem('acad_session', JSON.stringify(academicYearData[0]));
          sessionStorage.setItem('isSessionChanged', true);
        } else {
          sessionStorage.setItem('acad_session', JSON.stringify(current_academic_year));
          sessionStorage.setItem('isSessionChanged', true);
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
  dispatch({ type: SELECTED_YEAR, payload: data });
};

export const isMsAPI = () => (dispatch) => {
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
  let { token = null } = JSON.parse(localStorage.getItem('userDetails')) || {};
  if (!token) {
    return;
  }
  dispatch({ type: ERP_CONFIG, payload: false });
  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
  const branch = data?.role_details?.branch;
  let result = [];
  axiosInstance
    .get(endpoints.checkAcademicView.isAcademicView)
    .then((res) => {
      if (res?.data?.status_code === 200) {
        if (res?.data?.result[0] == 'True') {
          data['erp_config'] = true;
          localStorage.setItem('userDetails', JSON.stringify(data));
          dispatch({ type: ERP_CONFIG, payload: true });
        } else if (res?.data?.result[0] == 'False') {
          data['erp_config'] = false;
          localStorage.setItem('userDetails', JSON.stringify(data));
          dispatch({ type: ERP_CONFIG, payload: false });
        } else if (res?.data?.result[0]) {
          console.log(res.data.result[0], '  branchhh data ');
          console.log(branch, '  branchhh ');
          let resData = res?.data?.result[0];

          const selectedId = branch?.map((el) => el?.id);
          let checkData = resData?.some((item) => selectedId.includes(Number(item)));
          console.log(checkData, 'check');
          data['erp_config'] = checkData;
          localStorage.setItem('userDetails', JSON.stringify(data));
          dispatch({ type: ERP_CONFIG, payload: result });
        }
      }
    })
    .catch(() => {
      dispatch({ type: ERP_CONFIG, payload: false });
    });
};

export const currentSelectedBranch = (data) => (dispatch) => {
  dispatch({ type: SELECTED_BRANCH, payload: data });
};

export const fetchBranchList = (session_year) => (dispatch) => {
  sessionStorage.removeItem('branch_list');
  sessionStorage.removeItem('selected_branch');
  console.log('Branch Api Called');
  dispatch({ type: BRANCH_LIST, payload: [] });
  let url = `${endpoints?.academics?.branches}?session_year=${session_year}&module_id=${moduleId}`;
  return axiosInstance
    .get(url)
    .then((response) => {
      if (response?.data?.data?.results.length > 0) {
        let branchList = response?.data?.data?.results;
        if (response?.status > 199 && response?.status < 300 && branchList) {
          sessionStorage.setItem('branch_list', JSON.stringify(branchList));

          if (!sessionStorage.getItem('selected_branch')) {
            sessionStorage.setItem('selected_branch', JSON.stringify(branchList[0]));

            dispatch({ type: SELECTED_BRANCH, payload: branchList[0] });
            sessionStorage.setItem('isSessionChanged', false);
            window.location.reload();
          }

          dispatch({ type: BRANCH_LIST, payload: branchList });
        }
      }
    })
    .catch(() => {
      dispatch({ type: BRANCH_LIST, payload: [] });
    });
};

export const selectedVersion = (data) => (dispatch) => {
  console.log(data, 'SELECTED_VERSION');
  dispatch({ type: SELECTED_VERSION, payload: data });
};
