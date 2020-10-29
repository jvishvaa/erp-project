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

class CreateRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roleName: '',
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
    const { modulePermissionsRequestData, createRole } = this.props;
    const reqObj = {
      role_name: roleName,
      Module: modulePermissionsRequestData,
    };
    createRole(reqObj)
      .then(() => {
        history.push('/role-management');
      })
      .catch(() => {});
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
    const modulesListing = () => {
      if (fetchingModules) return 'Loading.....';
      if (modules?.length > 0) {
        return modules.map((module) => (
          <Grid item xs={12} sm={6} lg={4}>
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
        <Grid container spacing={2} alignItems='center' style={{ padding: '2rem 0' }}>
          <Grid item>
            <TextField
              id='outlined-helperText'
              label='Role name'
              defaultValue=''
              variant='outlined'
              onChange={this.handleRoleNameChange}
              color='secondary'
            />
          </Grid>
          <Grid item>
            <Button onClick={this.handleCreateRole}>Add Role</Button>
          </Grid>
        </Grid>
        <Typography className={classes.sectionHeader}>Number of modules</Typography>
        <Divider />

        <Grid container spacing={4} style={{ padding: '2rem 0' }}>
          {modulesListing()}
        </Grid>
      </div>
    );
  }
}

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
