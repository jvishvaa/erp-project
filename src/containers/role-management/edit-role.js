import React, { Component } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {
  fetchRoleDataById,
  fetchBranches,
  setEditRolePermissionsState,
  editRole,
  setModulePermissionsRequestData,
} from '../../redux/actions';
import ModuleCard from '../../components/module-card';

class EditRole extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      fetchRoleDataById,
      fetchBranches,
    } = this.props;
    console.log('fetch role data with id ', id);

    if (id) {
      console.log('fetch role data with id ', id);
      fetchRoleDataById(id);
    }

    fetchBranches();
  }

  alterEditRolePermissions = (module) => {
    const { modules, alterEditRolePermissionsState } = this.props;
    const moduleIndex = modules.findIndex((obj) => obj.id == module.id);
    const modulesArray = JSON.parse(JSON.stringify(modules));
    modulesArray[moduleIndex] = module;
    alterEditRolePermissionsState(modulesArray);
  };

  handleEditRole = () => {
    const { modulePermissionsRequestData, selectedRole, editRole } = this.props;
    const reqObj = {
      role_name: selectedRole.role_name || 'customrole_101',
      Module: modulePermissionsRequestData,
    };
    editRole(reqObj);
  };

  render() {
    const {
      selectedRole,
      modules,
      branches,
      modulePermissionsRequestData,
      setModulePermissionsRequestData,
    } = this.props;
    return (
      <div>
        <Grid container spacing={2} alignItems='center' style={{ padding: '2rem 0' }}>
          <Grid item>
            <TextField
              id='outlined-helperText'
              label='Role name'
              defaultValue=''
              variant='outlined'
              value={selectedRole?.role_name}
              disabled
            />
          </Grid>
          <Grid item>
            <Button onClick={this.handleEditRole}>Update Role</Button>
          </Grid>
        </Grid>
        <Typography>Number of modules</Typography>
        <Divider />
        <Grid container spacing={4} style={{ padding: '2rem 0' }}>
          {modules &&
            modules.map((module) => (
              <Grid item xs={12} sm={6} lg={4}>
                <ModuleCard
                  module={module}
                  alterCreateRolePermissions={this.alterEditRolePermissions}
                  branches={branches}
                  modulePermissionsRequestData={modulePermissionsRequestData}
                  setModulePermissionsRequestData={setModulePermissionsRequestData}
                />
              </Grid>
            ))}
        </Grid>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  modules: state.roleManagement.editRoleModulePermissionsState,
  selectedRole: state.roleManagement.selectedRole,
  branches: state.roleManagement.branches,
  modulePermissionsRequestData: state.roleManagement.modulePermissionsRequestData,
  roles: state.roleManagement.roles,
});

const mapDispatchToProps = (dispatch) => ({
  fetchRoleDataById: (params) => {
    dispatch(fetchRoleDataById(params));
  },
  fetchBranches: () => {
    dispatch(fetchBranches());
  },
  alterEditRolePermissionsState: (params) => {
    dispatch(setEditRolePermissionsState(params));
  },
  setModulePermissionsRequestData: (params) => {
    dispatch(setModulePermissionsRequestData(params));
  },
  editRole: (params) => {
    dispatch(editRole(params));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(EditRole);
