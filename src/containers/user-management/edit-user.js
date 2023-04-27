/* eslint-disable react/no-did-update-set-state */
/* eslint-disable camelcase */
/* eslint-disable no-nested-ternary */
import React, { Component, useContext } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { styles } from './useStyles';
import UserDetailsForm from './user-details-form';
import EditSchoolDetailsForm from './edit-school-details-form';
import GuardianDetailsForm from './guardian-details-form';
import { fetchUser, editUser } from '../../redux/actions';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import { getSteps, jsonToFormData } from './utils';
import CustomStepperConnector from '../../components/custom-stepper-connector';
import CustomStepperIcon from '../../components/custom-stepper-icon';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../Layout';
import { Button, Grid } from '@material-ui/core';
import './styles.scss';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import axios from 'v2/config/axios';
import Loader from 'components/loader/loader';

const BackButton = withStyles({
  root: {
    color: 'rgb(140, 140, 140)',
    backgroundColor: '#e0e0e0',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
})(Button);

const userLevel = JSON.parse(localStorage.getItem('userDetails'))?.user_level;
class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      showParentForm: false,
      showGuardianForm: false,
      loading: false,
      user: null,
      isNext: false,
      collectData: {},
      mappingBgsLength: 0,
      curentmappingBgsLength: 0,
      collectDataCount: 0,
      isEditable: false,
      isSuper: false,
      hasAddAccess: false,
      userLevel: '',
      designation: '',
      isOrchids : window.location.host.split('.')[0] === 'orchids' ||
      window.location.host.split('.')[0] === 'qa' || window.location.host.split('.')[0] === 'localhost:3000'
        ? true
        : false,
    };
  }

  componentDidMount() {
    this.fetchUserDetails();
    this.fetchEditAccessLevels();
  }

  componentDidUpdate(prevProps) {
    const { selectedUser } = this.props;
    if (prevProps.selectedUser !== selectedUser && selectedUser) {
      let details = JSON.parse(localStorage.getItem('userDetails'));
      if (!details?.is_superuser) {
        if (
          selectedUser?.user_level === 13 ||
          selectedUser?.user_level === '' ||
          selectedUser?.user_level === null ||
          selectedUser?.user_level === undefined
        ) {
          this.state.isEditable = true;
        }
      }
      if (details?.is_superuser) {
        this.state.isSuper = true;
      }
      this.setState({
        user: selectedUser,
        mappingBgsLength: selectedUser.mapping_bgs?.length,
        curentmappingBgsLength: selectedUser.mapping_bgs?.length,
      });
    }
  }

  toggleParentForm = (e) => {
    this.setState({ showParentForm: e.target.checked });
  };

  toggleGuardianForm = (e) => {
    this.setState({ showGuardianForm: e.target.checked });
  };

  handleReset = () => {
    this.setState({ activeStep: 0 });
  };

  handleNext = () => {
    this.setState((prevState) => ({ activeStep: prevState.activeStep + 1 }));
  };

  handleBack = () => {
    this.setState((prevState) => ({ activeStep: prevState.activeStep - 1 }));
  };

  handleCollectData = (details, index) => {
    console.log(details , 'details');
    const {
      academic_year = [],
      branch = [],
      grade = [],
      section = [],
      subjects = [],
    } = { ...details };
    this.setState({
      userLevel: details.userLevel,
      designation: details.designation
    })
    const {
      academic_year: academicYear = [],
      branch: collectedBranch = [],
      grade: collectedGrade = [],
      section: collectedSection = [],
      subjects: collectedSubjects = [],
    } = { ...this.state.collectData };
    const updatedCollectData = {
      academic_year: [...academicYear, academic_year],
      branch: [...collectedBranch, branch],
      grade: [...collectedGrade, grade],
      section: [...collectedSection, section],
      subjects: [...collectedSubjects, subjects],
    };
    const count = this.state.collectDataCount + 1;
    this.setState({
      collectData: updatedCollectData,
      collectDataCount: count,
    });
    if (count === this.state.mappingBgsLength) {
      this.setState({ collectData: [], collectDataCount: 0 });
      this.onSubmitSchoolDetails(updatedCollectData);
    }
  };

  onSubmitSchoolDetails = (details) => {
    console.log(details , 'sub');
    const { selectedUser } = this.props;
    this.state.user.mapping_bgs.forEach(({ is_delete }, index) => {
      if (is_delete) {
        // let spliceCount = index === this.state.mappingBgsLength - 1 ? 1 : 0;
        ['academic_year', 'grade', 'branch', 'section', 'subjects'].forEach((key) =>
          details[key].splice(index, 0, [])
        );
      }
    });
    if (selectedUser.parent.father_first_name) {
      this.setState({ showParentForm: true });
    }
    if (selectedUser.parent.guardian_first_name) {
      this.setState({ showGuardianForm: true });
    }
    this.setState((prevState) => ({
      isNext: !prevState.isNext,
      user: { ...prevState.user, ...details },
    }));
    this.handleNext();
  };

  onSubmitUserDetails = (details) => {
    const { showParentForm, showGuardianForm } = this.state;
    this.setState((prevState) => ({ user: { ...prevState.user, ...details } }));
    if (showParentForm || showGuardianForm) {
      this.handleNext();
    } else {
      this.onEditUser(false);
    }
  };

  onSubmitGuardianDetails = (details) => {
    this.setState(
      (prevState) => ({
        user: { ...prevState.user, parent: { ...prevState.user.parent, ...details } },
      }),
      () => {
        this.onEditUser(true);
      }
    );
  };

  onEditUser = (requestWithParentorGuradianDetails) => {
    this.setState({
      loading: true,
    });
    const { user } = this.state;
    const { editUser, history, selectedUser } = this.props;
    let requestObj = user;
    const {
      academic_year,
      branch,
      grade,
      section,
      subjects,
      first_name,
      middle_name,
      last_name,
      gender,
      date_of_birth,
      address,
      student_country_code,
      contact,
      email,
      profile,
      parent,
      erp_user,
    } = requestObj;
    const {
      id: parent_id,
      father_first_name,
      father_middle_name,
      father_last_name,
      father_email,
      father_country_code,
      father_mobile,
      father_photo,
      address: parent_address,
      mother_first_name,
      mother_middle_name,
      mother_last_name,
      mother_email,
      mother_country_code,
      mother_mobile,
      mother_photo,
      guardian_first_name,
      guardian_middle_name,
      guardian_last_name,
      guardian_email,
      guardian_country_code,
      guardian_mobile,
      guardian_photo,
    } = parent;

    const parentDetail = {};
    if (guardian_first_name) {
      Object.assign(parentDetail, {
        guardian_first_name,
        guardian_middle_name,
        guardian_last_name,
        guardian_email,
        address: parent_address || '',
        guardian_mobile: guardian_country_code + '-' + guardian_mobile,
      });
    }
    if (father_first_name || mother_first_name) {
      Object.assign(parentDetail, {
        id: parent_id,
        father_first_name,
        father_middle_name,
        father_last_name,
        father_email,
        father_mobile: father_country_code + '-' + father_mobile,
        address: parent_address,
        mother_first_name,
        mother_middle_name,
        mother_last_name,
        mother_email,
        mother_mobile: mother_country_code + '-' + mother_mobile,
      });
    }

    requestObj = {
      erp_id: selectedUser.erp_id,
      branch: branch
        .reduce((acc, subArr) => [...acc, ...subArr], [])
        .map(({ id }) => id)
        .filter((id, index, self) => self.indexOf(id) === index)
        .join(),
      section_mapping: section
        .reduce((acc, subArr) => [...acc, ...subArr], [])
        .map(({ item_id = '' }) => item_id)
        .filter(Boolean)
        .filter((id, index, self) => self.indexOf(id) === index)
        .join(),
      subjects: subjects
        .reduce((acc, subArr) => [...acc, ...subArr], [])
        .map(({ id = '' }) => id)
        .filter((id, index, self) => self.indexOf(id) === index)
        .join(),
      first_name,
      middle_name,
      last_name,
      gender,
      date_of_birth,
      address,
      contact: student_country_code + '-' + contact,
      email,
      erp_user,
      profile,
      father_photo,
      mother_photo,
      guardian_photo,
      parent: parentDetail,
    };
    if(this.state.isOrchids == true){
      requestObj['user_level'] = this.state.userLevel?.id
      if(this.state.userLevel?.id != 13){
        requestObj['designation'] = this.state.designation?.id
      }
    }
    if (!requestWithParentorGuradianDetails) {
      delete requestObj.parent;
      delete requestObj.father_photo;
      delete requestObj.mother_photo;
      delete requestObj.guardian_photo;
    }
    const { setAlert } = this.context;
    const requestObjFormData = jsonToFormData(requestObj);
    editUser(requestObjFormData)
      .then(() => {
        this.setState({ loading: false });
        history.push('/user-management/view-users');
        setAlert('success', 'User updated');
      })
      .catch(() => {
        this.setState({ loading: false });
        setAlert('error', 'User update failed');
      });
  };

  onSubmitForm = (details) => {
    this.onSubmitGuardianDetails(details);
  };

  fetchUserDetails() {
    const { fetchUser, match } = this.props;
    fetchUser(match.params.id);
  }
  fetchEditAccessLevels() {
    axios
      .get(`assessment/check-sys-config/?config_key=user_edit_access_levels`)
      .then((response) => {
        if (response.data.status_code == 200) {
          if (response?.data?.result.includes(String(userLevel))) {
            this.setState({ hasAddAccess: true });
          }
        }
      })
      .catch((error) => console.log('error', error));
  }

  handleAddMappingObject() {
    const { user } = this.state;
    let userObj = user;
    const clonedMappingObject = userObj.mapping_bgs[0];
    const modifiedMappingObject = {
      ...clonedMappingObject,
      academic_year: [],
      branch: [],
      grade: [],
      section: [],
      subjects: [],
      is_acad_disabled: true,
      is_delete: false,
    };
    const modifiedUserObject = {
      ...userObj,
      academic_year: [...userObj['academic_year'], []],
      branch: [...userObj['branch'], []],
      grade: [...userObj['grade'], []],
      section: [...userObj['section'], []],
      subjects: [...userObj['subjects'], []],
      mapping_bgs: [...userObj['mapping_bgs'], modifiedMappingObject],
    };
    this.setState((prevState) => ({
      user: modifiedUserObject,
      mappingBgsLength: prevState.mappingBgsLength + 1,
    }));
  }

  getUserDetails(user, index) {
    const details = {
      ...user,
      academic_year: user['academic_year'][index],
      branch: user['branch'][index],
      grade: user['grade'][index],
      section: user['section'][index],
      subjects: user['subjects'][index],
    };
    return details;
  }

  handleDeleteMappingObject(index) {
    const { user } = this.state;
    let userObj = user;
    userObj['mapping_bgs'][index]['is_delete'] = true;
    userObj['academic_year'].splice(index, 1, []);
    userObj['branch'].splice(index, 1, []);
    userObj['grade'].splice(index, 1, []);
    userObj['section'].splice(index, 1, []);
    userObj['subjects'].splice(index, 1, []);
    this.setState((prevState) => ({
      user: userObj,
      mappingBgsLength: prevState.mappingBgsLength - 1,
    }));
  }

  render() {
    const { activeStep, user, showParentForm, showGuardianForm } = this.state;
    const showParentOrGuardianForm = showParentForm || showGuardianForm;
    const steps = getSteps(showParentOrGuardianForm);
    const { classes, creatingUser, fetchingUserDetails, selectedUser } = this.props;

    return (
      <Layout>
        {this.state.loading == true ? <Loader /> : ''}
        <CommonBreadcrumbs
          componentName='User Management'
          childComponentName='Edit User'
        />
        <div className='edit-user-container'>
          {user ? (
            <>
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                className={`${classes.stepper} stepper`}
                connector={<CustomStepperConnector />}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel
                      StepIconComponent={CustomStepperIcon}
                      classes={{
                        alternativeLabel: classes.stepLabel,
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
              <div className={classes.formContainer}>
                {activeStep === 0 && (
                  <>
                    {this.state.user?.mapping_bgs?.length > 0 &&
                      this.state.user?.mapping_bgs.map(
                        ({ is_acad_disabled = false, is_delete = false }, index) =>
                          !is_delete && (
                            <EditSchoolDetailsForm
                              key={`edit_school_details_form_${index}`}
                              onSubmit={this.handleCollectData}
                              details={this.getUserDetails(user, index)}
                              isEdit={true}
                              isNext={this.state.isNext}
                              isAcadDisabled={is_acad_disabled}
                              index={index}
                              handleDelete={() => this.handleDeleteMappingObject(index)}
                              isEditable={this.state.isEditable}
                              currentFormLength={this.state.curentmappingBgsLength}
                              // selectedYearIds={this.state.selectedYearIds}
                            />
                          )
                      )}
                    <Grid container style={{ marginTop: '20px' }} spacing={3}>
                      <Grid item md={1}>
                        <BackButton
                          variant='contained'
                          color='primary'
                          style={{ color: 'rgb(140, 140, 140)' }}
                          onClick={() => {
                            this.props.history.push({
                              pathname: '/user-management/view-users',
                              state: {
                                isEdit: true,
                              },
                            });
                          }}
                        >
                          Back
                        </BackButton>
                      </Grid>
                      <Grid item md={1}>
                        <Button
                          className={classes.formActionButton}
                          variant='contained'
                          color='primary'
                          onClick={() => {
                            this.setState({ isNext: true });
                          }}
                        >
                          Next
                        </Button>
                      </Grid>

                      <Grid item md={8} />
                      <Grid item md={1}>
                        {this.state?.isSuper || this.state.hasAddAccess ? (
                          <Button
                            startIcon={<AddOutlinedIcon />}
                            variant='contained'
                            color='primary'
                            style={{ color: 'white' }}
                            size='medium'
                            title='Add'
                            onClick={() => this.handleAddMappingObject()}
                          >
                            Add
                          </Button>
                        ) : (
                          ''
                        )}
                      </Grid>
                    </Grid>
                  </>
                )}
                {activeStep === 1 && (
                  <UserDetailsForm
                    isEdit={true}
                    onSubmit={this.onSubmitUserDetails}
                    details={user}
                    handleBack={this.handleBack}
                    toggleParentForm={this.toggleParentForm}
                    toggleGuardianForm={this.toggleGuardianForm}
                    showParentForm={showParentForm}
                    showGuardianForm={showGuardianForm}
                    isSubmitting={creatingUser}
                  />
                )}
                {activeStep === 2 && selectedUser && (
                  <GuardianDetailsForm
                    onSubmit={this.onSubmitGuardianDetails}
                    details={user.parent}
                    handleBack={this.handleBack}
                    showParentForm={showParentForm}
                    showGuardianForm={showGuardianForm}
                    isSubmitting={creatingUser}
                  />
                )}
              </div>
            </>
          ) : fetchingUserDetails ? (
            'Loading'
          ) : (
            'Loading'
          )}
        </div>
      </Layout>
    );
  }
}

EditUser.contextType = AlertNotificationContext;

const mapStateToProps = (state) => ({
  creatingUser: state.userManagement.creatingUser,
  fetchingUserDetails: state.userManagement.fetchingUserDetails,
  selectedUser: state.userManagement.selectedUser,
});

const mapDispatchToProps = (dispatch) => ({
  fetchUser: (params) => {
    return dispatch(fetchUser(params));
  },
  editUser: (params) => {
    return dispatch(editUser(params));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EditUser));
