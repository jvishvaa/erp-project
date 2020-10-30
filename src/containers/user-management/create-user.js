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

function getSteps() {
  return ['School details', 'User details', 'Parents/Guardian details'];
}

class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      user: {
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        academic_year: '',
        branch: '',
        grade: '',
        section: '',
        subjects: [],
        contact: '',
        date_of_birth: '',
        gender: '',
        profile: '',
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
        },
      },
    };
  }

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

    this.setState((prevState) => ({ user: { ...prevState.user, ...details } }));
    this.handleNext();
  };

  onSubmitGuardianDetails = (details) => {
    console.log('guardian details!!', details);

    this.setState(
      (prevState) => ({
        user: { ...prevState.user, parent: { ...prevState.user.parent, ...details } },
      }),
      () => {
        this.onCreateUser();
      }
    );
  };

  onCreateUser = () => {
    const { user } = this.state;
    const { createUser, history } = this.props;
    console.log('user ', user);
    let requestObj = JSON.parse(JSON.stringify(user));
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
    } = parent;
    requestObj = {
      academic_year: academic_year.id,
      branch: branch.id,
      grade: grade.id,
      section: section.id,
      subjects: subjects.map((sub) => sub.id),
      first_name,
      middle_name,
      last_name,
      gender,
      date_of_birth,
      address,
      contact,
      email,
      profile,
      parent: {
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
      },
    };

    createUser(requestObj).then(() => history.push('/user-management'));

    console.log('req ', requestObj);
  };

  onSubmitForm = (details) => {
    this.onSubmitGuardianDetails(details);
  };

  render() {
    const steps = getSteps();
    const { activeStep, user } = this.state;
    const { classes } = this.props;
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
            />
          )}
          {activeStep === 2 && (
            <GuardianDetailsForm
              onSubmit={this.onSubmitGuardianDetails}
              details={user.parent}
              handleBack={this.handleBack}
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
