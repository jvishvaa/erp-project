/* eslint-disable camelcase */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { styles } from './useStyles';
import UserDetailsForm from './user-details-form';
import SchoolDetailsForm from './school-details-form';
import GuardianDetailsForm from './guardian-details-form';
import { fetchUser, editUser } from '../../redux/actions';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import { getSteps, jsonToFormData } from './utils';

class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      showParentForm: false,
      showGuardianForm: false,
      user: {
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        academic_year: '',
        branch: '',
        grade: [],
        section: [],
        subjects: [],
        contact: '',
        date_of_birth: '',
        gender: '',
        profile: '',
        address: '',
        parent: {
          father_first_name: '',
          father_last_name: '',
          mother_first_name: '',
          mother_last_name: '',
          mother_middle_name: '',
          father_middle_name: '',
          father_email: '',
          mother_email: '',
          father_mobile: '',
          mother_mobile: '',
          mother_photo: '',
          father_photo: '',
          address: '',
          guardian_first_name: '',
          guardian_middle_name: '',
          guardian_last_name: '',
          guardian_email: '',
          guardian_mobile: '',
        },
      },
    };
  }

  componentDidMount() {
    this.fetchUserDetails();
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

  onSubmitSchoolDetails = (details) => {
    console.log('school details!!', details);
    const { selectedUser } = this.props;
    if (selectedUser.parent.father_first_name) {
      this.setState({ showParentForm: true });
    }
    if (selectedUser.parent.guardian_first_name) {
      this.setState({ showGuardianForm: true });
    }
    this.setState((prevState) => ({ user: { ...prevState.user, ...details } }));
    this.handleNext();
  };

  onSubmitUserDetails = (details) => {
    console.log('user details!!', details);
    const { showParentForm, showGuardianForm } = this.state;
    this.setState((prevState) => ({ user: { ...prevState.user, ...details } }));
    if (showParentForm || showGuardianForm) {
      this.handleNext();
    } else {
      this.onEditUser(false);
    }
  };

  onSubmitGuardianDetails = (details) => {
    console.log('guardian details!!', details);

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
    const { user } = this.state;
    const { editUser, history, selectedUser } = this.props;
    console.log('user ', user);
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
      contact,
      email,
      profile,
      parent,
    } = requestObj;
    console.log('profile ', profile);
    const {
      father_first_name,
      father_middle_name,
      father_last_name,
      father_email,
      father_mobile,
      father_photo,
      address: parent_address,
      mother_first_name,
      mother_middle_name,
      mother_last_name,
      mother_email,
      mother_mobile,
      mother_photo,
      guardian_first_name,
      guardian_middle_name,
      guardian_last_name,
      guardian_email,
      guardian_mobile,
    } = parent;
    requestObj = {
      erp_id: selectedUser.erp_id,
      academic_year: academic_year.id,
      branch: branch.id,
      grade: grade.map((grade) => grade.id).join(),
      section: section.map((section) => section.id).join(),
      subjects: subjects.map((sub) => sub.id).join(),
      first_name,
      middle_name,
      last_name,
      gender,
      date_of_birth,
      address,
      contact,
      email,
      profile,
      father_photo,
      mother_photo,
      parent: {
        id: selectedUser.parent.id,
        father_first_name,
        father_middle_name,
        father_last_name,
        father_email,
        father_mobile,
        address: parent_address,
        mother_first_name,
        mother_middle_name,
        mother_last_name,
        mother_email,
        mother_mobile,
        guardian_first_name,
        guardian_middle_name,
        guardian_last_name,
        guardian_email,
        guardian_mobile,
      },
    };

    if (!requestWithParentorGuradianDetails) {
      delete requestObj.parent;
      delete requestObj.father_photo;
      delete requestObj.mother_photo;
    }
    const { setAlert } = this.context;
    const requestObjFormData = jsonToFormData(requestObj);

    console.log('requestObject ', requestObjFormData);
    editUser(requestObjFormData)
      .then(() => {
        history.push('/user-management');
        setAlert('success', 'User updated');
      })
      .catch(() => {
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

  render() {
    const { activeStep, user, showParentForm, showGuardianForm } = this.state;
    const showParentOrGuardianForm = showParentForm || showGuardianForm;
    const steps = getSteps(showParentOrGuardianForm);
    const { classes, creatingUser, fetchingUserDetails, selectedUser } = this.props;
    return (
      <div>
        {selectedUser ? (
          <>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <div className={classes.formContainer}>
              {activeStep === 0 && (
                <SchoolDetailsForm
                  onSubmit={this.onSubmitSchoolDetails}
                  details={selectedUser}
                />
              )}
              {activeStep === 1 && (
                <UserDetailsForm
                  onSubmit={this.onSubmitUserDetails}
                  details={selectedUser}
                  handleBack={this.handleBack}
                  toggleParentForm={this.toggleParentForm}
                  toggleGuardianForm={this.toggleGuardianForm}
                  showParentForm={showParentForm}
                  showGuardianForm={showGuardianForm}
                  isSubmitting={creatingUser}
                />
              )}
              {activeStep === 2 && (
                <GuardianDetailsForm
                  onSubmit={this.onSubmitGuardianDetails}
                  details={selectedUser.parent}
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

        {/* <div>
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={this.handleBack}
                  className={classes.backButton}
                >
                  Back
                </Button>
                <Button variant='contained' color='primary' onClick={this.handleNext}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div> */}
      </div>
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
