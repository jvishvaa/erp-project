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
  DELETE_ROLE_REQUEST: 'DELETE_ROLE_REQUEST',
  DELETE_ROLE_SUCCESS: 'DELETE_ROLE_SUCCESS',
  DELETE_ROLE_FAILURE: 'DELETE_ROLE_FAILURE',
  SET_ROLE_NAME: 'SET_ROLE_NAME',
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
  DELETE_ROLE_REQUEST,
  DELETE_ROLE_SUCCESS,
  DELETE_ROLE_FAILURE,
  SET_ROLE_NAME,
} = roleManagementActions;

export const scopes = {
  my_branch: false,
  my_grade: false,
  my_section: false,
  my_subject: false,
  custom_branch: [],
  custom_grade: [],
  custom_section: [],
  custom_subject: [],
};

function transformModules(module, obj) {
  const clonedModule = JSON.parse(JSON.stringify(module));
  clonedModule.module_child = module.module_child.map((child) => ({ ...child, ...obj }));

  return clonedModule;
}

export const setRoleName = (data) => ({
  type: SET_ROLE_NAME,
  data,
});

export const fetchRoles = (params) => (dispatch) => {
  dispatch({ type: FETCH_ROLES_REQUEST });
  axios
    .get(`/erp_user/roles/?page=${params.page}&page_size=${params.limit}`)
    .then((response) => {
      const { result, current_page: page, limit, count } = response.data;
      dispatch({
        type: FETCH_ROLES_SUCCESS,
        data: result,
        page,
        limit,
        count,
      });
    })
    .catch(() => {
      dispatch({ type: FETCH_ROLES_FAILURE });
    });
};

export const searchRoles = (params) => (dispatch) => {
  dispatch({ type: FETCH_ROLES_REQUEST });
  axios
    .get(
      `/erp_user/role-search/?role_name=${params.roleName}&page=${params.page}&page_size=${params.limit}`
    )
    .then((response) => {
      const { result, current_page: page, limit, count } = response.data;
      dispatch({
        type: FETCH_ROLES_SUCCESS,
        data: result,
        page,
        limit,
        count,
      });
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
  return axios
    .get('/erp_user/branch/')
    .then((response) => {
      dispatch({
        type: FETCH_BRANCHES_SUCCESS,
        data: response.data.data,
      });
      return response.data.data;
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

export const fetchGrades = (branchIds, acadId) => {
  // console.log('fetching grades for branches ', branches);
  // const branchIds = branches.map((branch) => branch.id).join(',');

  // const branchIds = branches && branches.length > 0 ? branches[0].id : '';

  // if (!branchIds) {
  // return Promise.resolve(null);
  // }

  return axios
    .get(`/erp_user/grademapping/?branch_id=${branchIds}&session_year=${acadId}`)
    .then((response) => {
      if (response.data?.status_code === 200) return response.data.data;
      return [];
    })
    .catch(() => {
      return [];
    });
  // return Promise.resolve([]);
};

export const fetchSections = (branchIds, acadId, gradeIds) => {
  // const branchIds =
  //   branches && branches.length > 0 ? branches.map((branch) => branch.id).join(',') : '';
  // //   const branchIds = branches.id;
  // const gradeIds =
  //   grades && grades.length > 0 ? grades.map((grade) => grade.id).join(',') : '';

  return axios
    .get(
      `/erp_user/sectionmapping/?branch_id=${branchIds}&session_year=${acadId}&grade_id=${gradeIds}`
    )
    .then((response) => {
      if (response.data?.status_code === 200) return response.data.data;
      return [];
    })
    .catch(() => {
      return [];
    });
};

export const fetchSubjects = (branchIds, acadId, gradeIds, sectionIds) => {
  // const branchIds =
  //   branches && branches.length > 0 ? branches.map((branch) => branch.id).join(',') : '';
  // //   const branchIds = branches.id;
  // const gradeIds =
  //   grades && grades.length > 0 ? grades.map((grade) => grade.id).join(',') : '';
  // const sectionIds =
  //   sections && sections.length > 0
  //     ? sections.map((section) => section.id).join(',')
  //     : '';
  return axios
    .get(
      `/erp_user/subject/?branch=${branchIds}&session_year=${acadId}&grade=${gradeIds}&section=${sectionIds}`
    )
    .then((response) => {
      if (response.data?.status_code === 200) return response.data.data;
      return [];
    })
    .catch(() => {
      return [];
    });
};

export const createRole = (params) => (dispatch) => {
  dispatch({ type: CREATE_ROLES_REQUEST });
  return axios
    .post('/erp_user/create_role/', params)
    .then(() => {
      dispatch({ type: CREATE_ROLES_SUCCESS });
    })
    .catch(() => {
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
        roleName: response.data.role_name,
        roleId: response.data.role,
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
  return axios
    .post('/erp_user/update_role_module/', params)
    .then((response) => {
      dispatch({ type: EDIT_ROLES_SUCCESS });
      return response.data;
    })
    .catch((error) => {
      dispatch({ type: EDIT_ROLES_FAILURE });
      throw error;
    });
};

export const deleteRole = (params) => (dispatch, getState) => {
  dispatch({ type: DELETE_ROLE_REQUEST });
  const {
    roleManagement: { limit },
  } = getState();
  return axios
    .post(`/erp_user/delete_role/`, params)
    .then(() => {
      dispatch({ type: DELETE_ROLE_SUCCESS });
      dispatch(fetchRoles({ page: 1, limit }));
    })
    .catch(() => {
      dispatch({ type: DELETE_ROLE_FAILURE });
    });
};
