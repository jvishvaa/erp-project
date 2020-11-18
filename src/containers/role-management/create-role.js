/* eslint-disable no-debugger */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {
  fetchBranches,
  fetchModules,
  setCreateRolePermissionsState,
  createRole,
  setModulePermissionsRequestData,
} from '../../redux/actions';
import styles from './useStyles';

import ModuleCard from '../../components/module-card';
import { AssignmentReturned } from '@material-ui/icons';
import Loading from '../../components/loader/loader';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

class CreateRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roleName: '',
      roleNameError: '',
      selectionError: '',
    };
  }

  componentDidMount() {
    const { fetchModules, fetchBranches } = this.props;
    fetchModules();
    fetchBranches();
  }

  handleRoleNameChange = (e) => {
    this.setState({ roleName: e.target.value });
  };

  alterCreateRolePermissions = (module) => {
    const { modules, alterCreateRolePermissionsState } = this.props;
    const moduleIndex = modules.findIndex((obj) => obj.id === module.id);
    const modulesArray = JSON.parse(JSON.stringify(modules));
    modulesArray[moduleIndex] = module;
    alterCreateRolePermissionsState(modulesArray);
  };

  handleCreateRole = () => {
    // eslint-disable-next-line camelcase
    const { history } = this.props;
    const { roleName } = this.state;
    const { modulePermissionsRequestData, createRole, modules } = this.props;

    // if (!reqObj.role_name) {
    //   this.setState({ roleNameError: 'Please enter a role name' });
    //   return;
    // }
    // if (!reqObj.Module.length) {
    //   this.setState({ roleNameError: '' });
    //   this.setState({ selectionError: 'Please select some role' });
    //   return;
    // }

    this.setState({ selectionError: '' });

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
        role_name: roleName,
        Module: requestData,
      };
      createRole(reqObj)
        .then(() => {
          history.push('/role-management');
        })
        .catch(() => {
          setAlert('error', 'Creation Failed');
        });
    } else {
      setAlert('error', 'Please select permissions for atleast one module');
    }
  };

  render() {
    const {
      modules,
      fetchingModules,
      branches,
      modulePermissionsRequestData,
      setModulePermissionsRequestData,
      classes,
    } = this.props;
    const { roleNameError, selectionError } = this.state;
    const modulesListing = () => {
      if (fetchingModules) return <Loading message='Loading modules...' />;
      if (modules?.length > 0) {
        return modules.map((module) => (
          <Grid item xs={12} sm={6} lg={12}>
            <ModuleCard
              module={module}
              alterCreateRolePermissions={this.alterCreateRolePermissions}
              branches={branches}
              modulePermissionsRequestData={modulePermissionsRequestData}
              setModulePermissionsRequestData={setModulePermissionsRequestData}
            />
          </Grid>
        ));
      }
      return 'No modules';
    };
    return (
      <div className={classes.root}>
        <Grid container spacing={4} alignItems='center' className={classes.formContainer}>
          <Grid item>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: 'red' }}>{roleNameError}</span>
              <TextField
                id='outlined-helperText'
                label='Role name'
                defaultValue=''
                variant='outlined'
                inputProps={{ maxLength: 20 }}
                onChange={this.handleRoleNameChange}
                color='secondary'
                size='small'
              />
            </div>
          </Grid>
          <Grid item>
            <Button onClick={this.handleCreateRole}>Add Role</Button>
          </Grid>
        </Grid>
        <Typography className={classes.sectionHeader}>Number of modules</Typography>
        <Divider className={classes.divider} />
        <span style={{ color: 'red' }}>{selectionError}</span>
        <Grid container spacing={4} className={classes.modulesContainer}>
          {modulesListing()}
        </Grid>
      </div>
    );
  }
}

CreateRole.contextType = AlertNotificationContext;

const mapStateToProps = (state) => ({
  modules: state.roleManagement.createRoleModulePermissionsState,
  fetchingModules: state.roleManagement.fetchingModules,
  branches: state.roleManagement.branches,
  modulePermissionsRequestData: state.roleManagement.modulePermissionsRequestData,
});

const mapDispatchToProps = (dispatch) => ({
  fetchModules: () => {
    dispatch(fetchModules());
  },
  fetchBranches: () => {
    dispatch(fetchBranches());
  },
  alterCreateRolePermissionsState: (params) => {
    dispatch(setCreateRolePermissionsState(params));
  },
  setModulePermissionsRequestData: (params) => {
    dispatch(setModulePermissionsRequestData(params));
  },
  createRole: (params) => {
    return dispatch(createRole(params));
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CreateRole));
