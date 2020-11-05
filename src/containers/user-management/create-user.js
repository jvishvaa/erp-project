/* eslint-disable camelcase */
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
import { createUser } from '../../redux/actions';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

function getSteps(showParentOrGuardian) {
  if (!showParentOrGuardian) {
    return ['School details', 'User details'];
  }
  return ['School details', 'User details', 'Parents/Guardian details'];
}

class CreateUser extends Component {
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
      this.onCreateUser(false);
    }
  };

  onSubmitGuardianDetails = (details) => {
    console.log('guardian details!!', details);

    this.setState(
      (prevState) => ({
        user: { ...prevState.user, parent: { ...prevState.user.parent, ...details } },
      }),
      () => {
        this.onCreateUser(true);
      }
    );
  };

  onCreateUser = (requestWithParentorGuradianDetails) => {
    const { user } = this.state;
    const { createUser, history } = this.props;
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
      parent: JSON.stringify({
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
      }),
    };

    if (!requestWithParentorGuradianDetails) {
      delete requestObj.parent;
    }
    const { setAlert } = this.context;

    console.log('requestObject ', requestObj);
    createUser(requestObj)
      .then(() => {
        history.push('/user-management');
        setAlert('success', 'User creatied');
      })
      .catch(() => {
        setAlert('error', 'User creation failed');
      });
  };

  onSubmitForm = (details) => {
    this.onSubmitGuardianDetails(details);
  };

  render() {
    const { activeStep, user, showParentForm, showGuardianForm } = this.state;
    const showParentOrGuardianForm = showParentForm || showGuardianForm;
    const steps = getSteps(showParentOrGuardianForm);
    const { classes, creatingUser } = this.props;
    return (
      <div>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div className={classes.formContainer}>
          {activeStep === 0 && (
            <SchoolDetailsForm onSubmit={this.onSubmitSchoolDetails} details={user} />
          )}
          {activeStep === 1 && (
            <UserDetailsForm
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
          {activeStep === 2 && (
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

CreateUser.contextType = AlertNotificationContext;

const mapStateToProps = (state) => ({
  creatingUser: state.userManagement.creatingUser,
});

const mapDispatchToProps = (dispatch) => ({
  createUser: (params) => {
    return dispatch(createUser(params));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CreateUser));
