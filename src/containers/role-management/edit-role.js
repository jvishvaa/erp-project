import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Skeleton } from '@material-ui/lab';
import {
  fetchRoleDataById,
  fetchBranches,
  setEditRolePermissionsState,
  editRole,
  setModulePermissionsRequestData,
  setRoleName,
} from '../../redux/actions';
import styles from './useStyles';

import ModuleCard from '../../components/module-card';

class EditRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roleName: '',
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      fetchRoleDataById,
      fetchBranches,
    } = this.props;

    if (id) {
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
    const {
      modulePermissionsRequestData,
      editRole,
      history,
      roleId,
      roleName,
    } = this.props;
    const reqObj = {
      role_id: roleId,
      role_name: roleName,
      Module: modulePermissionsRequestData,
    };
    editRole(reqObj)
      .then(() => {
        history.push('/role-management');
      })
      .catch(() => {});
  };

  onChangeRoleName = (e) => {
    // this.setState({ roleName: e.target.value });
    const { setRoleName } = this.props;
    setRoleName(e.target.value);
  };

  render() {
    const {
      fetchingRoleDataById,
      modules,
      branches,
      modulePermissionsRequestData,
      setModulePermissionsRequestData,
      classes,
    } = this.props;
    // let roleName;
    // if (modules) {
    //   if (modules.length > 0) {
    //     roleName = modules[0].role_name;
    //   }
    // }

    const { roleName } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={2} alignItems='center' style={{ padding: '2rem 0' }}>
          <Grid item>
            {fetchingRoleDataById ? (
              <Skeleton />
            ) : (
              <TextField
                id='outlined-helperText'
                label='Role name'
                defaultValue=''
                variant='outlined'
                value={roleName}
                onChange={this.onChangeRoleName}
              />
            )}
          </Grid>
          <Grid item>
            <Button onClick={this.handleEditRole}>Update Role</Button>
          </Grid>
        </Grid>
        <Typography className={classes.sectionHeader}>Number of modules</Typography>
        <Divider />
        <Grid container spacing={4} style={{ padding: '2rem 0' }}>
          {modules &&
            modules.map((module) => (
              <Grid item xs={12} sm={6} lg={12}>
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
  fetchingRoleDataById: state.roleManagement.fetchingRoleDataById,
  roleName: state.roleManagement.roleName,
  roleId: state.roleManagement.roleId,
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
    return dispatch(editRole(params));
  },
  setRoleName: (params) => {
    return dispatch(setRoleName(params));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EditRole));
