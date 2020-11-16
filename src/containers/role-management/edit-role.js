import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Skeleton } from '@material-ui/lab';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
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
import Loading from '../../components/loader/loader';

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
      modules,
    } = this.props;
    const requestData = [];

    modules.forEach((module) => {
      module.module_child.forEach((subModule) => {
        // const index = modulePermissionsRequestData.findIndex(
        //   (obj) => obj.modules_id == subModule.module_child_id
        // );
        // if (index === -1) {
        const currentSubModule = subModule;
        const includeInRequest = Object.keys(currentSubModule).some((key) => {
          if (key.includes('my_')) {
            if (currentSubModule[key]) {
              console.log(
                'included in request because non custom scope is true',
                currentSubModule
              );

              return true;
            }
          }
          if (key.includes('custom_')) {
            if (currentSubModule[key].length > 0) {
              console.log(
                'included in request because custom scope is true',
                currentSubModule
              );

              return true;
            }
          }
          return false;
        });
        if (includeInRequest) {
          const reqObj = {
            modules_id: currentSubModule.module_child_id,
            my_branch: currentSubModule.my_branch,
            my_grade: currentSubModule.my_grade,
            my_section: currentSubModule.my_section,
            my_subject: currentSubModule.my_subject,
            custom_grade: currentSubModule.custom_grade.map((grade) => grade.id),
            custom_section: currentSubModule.custom_section.map((section) => section.id),
            custom_branch: currentSubModule.custom_branch.map((branch) => branch.id),
            custom_subject: currentSubModule.custom_subject.map((subject) => subject.id),
          };
          requestData.push(reqObj);
          // }
          // const reqObj = {
          //   modules_id: subModule.module_child_id,
          //   my_branch: subModule.my_branch,
          //   my_grade: subModule.my_grade,
          //   my_section: subModule.my_section,
          //   my_subject: subModule.my_subject,
          //   custom_grade: subModule.custom_grade.map((grade) => grade.id),
          //   custom_section: subModule.custom_section.map((section) => section.id),
          //   custom_branch: subModule.custom_branch.map((branch) => branch.id),
          //   custom_subject: subModule.custom_subject.map((subject) => subject.id),
          // };
          // requestData.push(reqObj);
        }
      });
    });
    const { setAlert } = this.context;

    if (requestData.length > 0) {
      const reqObj = {
        role_id: roleId,
        role_name: roleName,
        Module: requestData,
      };
      editRole(reqObj)
        .then(() => {
          history.push('/role-management');
        })
        .catch((error) => {
          console.log('update role error ', error);
          setAlert('error', 'Update failed');
        });
    } else {
      setAlert('error', 'Please select permissions for atleast one module');
    }
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
                inputProps={{ maxLength: 20 }}
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
          {fetchingRoleDataById && <Loading message='loading modules ...' />}
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
EditRole.contextType = AlertNotificationContext;

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EditRole));
