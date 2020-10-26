import axios from '../../config/axios';

export const roleManagementActions = {
  FETCH_ROLES_REQUEST: 'FETCH_ROLES_REQUEST',
  FETCH_ROLES_SUCCESS: 'FETCH_ROLES_SUCCESS',
  FETCH_ROLES_FAILURE: 'FETCH_ROLES_FAILURE',
  SET_SELECTED_ROLE: 'SET_SELECTED_ROLE',
  FETCH_MODULES_REQUEST: 'FETCH_MODULES_REQUEST',
  FETCH_MODULES_SUCCESS: 'FETCH_MODULES_SUCCESS',
  FETCH_MODULES_FAILURE: 'FETCH_MODULES_FAILURE',
  SET_CREATE_ROLE_PERMISSIONS: 'SET_CREATE_ROLE_PERMISSIONS',
  FETCH_BRANCHES_REQUEST: 'FETCH_BRANCHES_REQUEST',
  FETCH_BRANCHES_SUCCESS: 'FETCH_BRANCHES_SUCCESS',
  FETCH_BRANCHES_FAILURE: 'FETCH_BRANCHES_FAILURE',
  SET_MODULE_PERMISSIONS_REQUEST_DATA: 'SET_MODULE_PERMISSIONS_REQUEST_DATA',
  FETCH_ROLE_DATA_BY_ID_REQUEST: 'FETCH_ROLE_DATA_BY_ID_REQUEST',
  FETCH_ROLE_DATA_BY_ID_SUCCESS: 'FETCH_ROLE_DATA_BY_ID_SUCCESS',
  FETCH_ROLE_DATA_BY_ID_FAILURE: 'FETCH_ROLE_DATA_BY_ID_FAILURE',
  SET_EDIT_ROLE_PERMISSIONS: 'SET_EDIT_ROLE_PERMISSIONS',
  EDIT_ROLES_REQUEST: 'EDIT_ROLES_REQUEST',
  EDIT_ROLES_SUCCESS: 'EDIT_ROLES_SUCCESS',
  EDIT_ROLES_FAILURE: 'EDIT_ROLES_FAILURE',
  CREATE_ROLES_REQUEST: 'CREATE_ROLES_REQUEST',
  CREATE_ROLES_SUCCESS: 'CREATE_ROLES_SUCCESS',
  CREATE_ROLES_FAILURE: 'CREATE_ROLES_FAILURE',
};

const {
  FETCH_ROLES_REQUEST,
  FETCH_ROLES_SUCCESS,
  FETCH_ROLES_FAILURE,
  SET_SELECTED_ROLE,
  FETCH_MODULES_REQUEST,
  FETCH_MODULES_SUCCESS,
  FETCH_MODULES_FAILURE,
  SET_CREATE_ROLE_PERMISSIONS,
  FETCH_BRANCHES_REQUEST,
  FETCH_BRANCHES_SUCCESS,
  FETCH_BRANCHES_FAILURE,
  SET_MODULE_PERMISSIONS_REQUEST_DATA,
  FETCH_ROLE_DATA_BY_ID_REQUEST,
  FETCH_ROLE_DATA_BY_ID_SUCCESS,
  FETCH_ROLE_DATA_BY_ID_FAILURE,
  SET_EDIT_ROLE_PERMISSIONS,
  EDIT_ROLES_REQUEST,
  EDIT_ROLES_SUCCESS,
  EDIT_ROLES_FAILURE,
  CREATE_ROLES_REQUEST,
  CREATE_ROLES_SUCCESS,
  CREATE_ROLES_FAILURE,
} = roleManagementActions;

export const scopes = {
  my_branch: false,
  my_grade: false,
  my_section: false,
  custom_branch: [],
  custom_grade: [],
  custom_section: [],
};

function transformModules(module, obj) {
  const clonedModule = JSON.parse(JSON.stringify(module));
  clonedModule.module_child = module.module_child.map((child) => ({ ...child, ...obj }));

  return clonedModule;
}

export const fetchRoles = () => (dispatch) => {
  dispatch({ type: FETCH_ROLES_REQUEST });
  axios
    .get('/erp_user/roles/')
    .then((response) => {
      dispatch({ type: FETCH_ROLES_SUCCESS, data: response.data.result });
    })
    .catch(() => {
      dispatch({ type: FETCH_ROLES_FAILURE });
    });
};

export const fetchModules = () => (dispatch) => {
  dispatch({ type: FETCH_MODULES_REQUEST });
  axios
    .get('/erp_user/list_module/')
    .then((response) => {
      const transformedModules = response.data.result.map((module) =>
        transformModules(module, scopes)
      );
      dispatch({
        type: FETCH_MODULES_SUCCESS,
        data: response.data.result,
        transformedModules,
      });
    })
    .catch(() => {
      dispatch({ type: FETCH_MODULES_FAILURE });
    });
};

export const fetchBranches = () => (dispatch) => {
  dispatch({ type: FETCH_BRANCHES_REQUEST });
  axios
    .get('/erp_user/branch/')
    .then((response) => {
      dispatch({
        type: FETCH_BRANCHES_SUCCESS,
        data: response.data.data,
      });
    })
    .catch(() => {
      dispatch({ type: FETCH_BRANCHES_FAILURE });
    });
};

export const setSelectedRole = (role) => ({
  type: SET_SELECTED_ROLE,
  data: role,
});

export const setCreateRolePermissionsState = (params) => ({
  type: SET_CREATE_ROLE_PERMISSIONS,
  data: params,
});

export const fetchGrades = (branches) => {
  // const branchIds = branches.map((branch) => branch.id).join(',');
  const branchIds = branches.id;

  return axios
    .get(`/erp_user/grademapping/?branch_id=${branchIds}`)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log('error in fetching grades', error));
};

export const fetchSections = (branches, grades) => {
  const branchIds = branches.map((branch) => branch.id).join(',');
  //   const branchIds = branches.id;
  const gradeIds = grades.map((grade) => grade.grade_id).join(',');

  return axios
    .get(`/erp_user/sectionmapping/?branch_id=${branchIds}&grade_id=${gradeIds}`)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => console.log('error in fetching sections', error));
};

export const createRole = (params) => (dispatch) => {
  dispatch({ type: CREATE_ROLES_REQUEST });
  axios
    .post('/erp_user/create_role/', params)
    .then((response) => {
      console.log(response.data);
      dispatch({ type: CREATE_ROLES_SUCCESS });
    })
    .catch((error) => {
      console.log('error role in creation ', error);
      dispatch({ type: CREATE_ROLES_FAILURE });
    });
};

export const setModulePermissionsRequestData = (params) => ({
  type: SET_MODULE_PERMISSIONS_REQUEST_DATA,
  data: params,
});

export const fetchRoleDataById = (params) => (dispatch) => {
  dispatch({ type: FETCH_ROLE_DATA_BY_ID_REQUEST });
  axios
    .get(`/erp_user/roles/?role=${params}`)
    .then((response) => {
      dispatch({
        type: FETCH_ROLE_DATA_BY_ID_SUCCESS,
        modulePermissions: response.data.result,
        data: response.data.result,
      });
    })
    .catch(() => {
      dispatch({ type: FETCH_ROLE_DATA_BY_ID_FAILURE });
    });
};

export const setEditRolePermissionsState = (params) => ({
  type: SET_EDIT_ROLE_PERMISSIONS,
  data: params,
});

export const editRole = (params) => (dispatch) => {
  dispatch({ type: EDIT_ROLES_REQUEST });
  console.log('edit role', params);
  return axios
    .post('/erp_user/create_role/', params)
    .then(() => {
      dispatch({ type: EDIT_ROLES_SUCCESS });
    })
    .catch((error) => {
      dispatch({ type: EDIT_ROLES_FAILURE });
      console.log('error role edit ', error);
    });
};
