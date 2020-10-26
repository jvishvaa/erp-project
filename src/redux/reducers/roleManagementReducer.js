import { roleManagementActions } from '../actions';

const INITIAL_STATE = {
  roles: [],
  fetchingRoles: false,
  selectedRole: null,
  modules: [],
  fetchingModules: false,
  createRoleModulePermissionsState: [], // for keeping state when creating
  branches: [],
  grades: [],
  sections: [],
  modulePermissionsRequestData: [], // for keeping the request data format for module permissions when creating and editing a role
  fetchingRoleDataByName: false,
  editRoleModulePermissionsState: [], // for keeping state when editing
};
export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case roleManagementActions.FETCH_ROLES_REQUEST:
      return { ...state, fetchingRoles: true };
    case roleManagementActions.FETCH_ROLES_FAILURE:
      return { ...state, fetchingRoles: false };
    case roleManagementActions.FETCH_ROLES_SUCCESS:
      return { ...state, roles: action.data, fetchingRoles: false };
    case roleManagementActions.SET_SELECTED_ROLE:
      return { ...state, selectedRole: action.data };
    case roleManagementActions.FETCH_MODULES_REQUEST:
      return { ...state, fetchingModules: true };
    case roleManagementActions.FETCH_MDOULES_FAILURE:
      return { ...state, fetchingModules: false };
    case roleManagementActions.FETCH_MODULES_SUCCESS:
      return {
        ...state,
        modules: action.data,
        fetchingModules: false,
        createRoleModulePermissionsState: action.transformedModules,
        modulePermissionsRequestData: [],
      };
    case roleManagementActions.SET_CREATE_ROLE_PERMISSIONS:
      return { ...state, createRoleModulePermissionsState: action.data };
    case roleManagementActions.SET_EDIT_ROLE_PERMISSIONS:
      return { ...state, editRoleModulePermissionsState: action.data };
    case roleManagementActions.FETCH_BRANCHES_SUCCESS:
      return { ...state, branches: action.data };
    case roleManagementActions.SET_MODULE_PERMISSIONS_REQUEST_DATA:
      return { ...state, modulePermissionsRequestData: action.data };

    case roleManagementActions.FETCH_BRANCHES_REQUEST:
      return { ...state, fetchingRoleDataByName: true };
    case roleManagementActions.FETCH_ROLE_DATA_BY_ID_SUCCESS:
      return {
        ...state,
        fetchingRoleDataByName: false,
        editRoleModulePermissionsState: action.modulePermissions,
        modulePermissionsRequestData: [], // for reseting the request data
      };

    default:
      return state;
  }
}
