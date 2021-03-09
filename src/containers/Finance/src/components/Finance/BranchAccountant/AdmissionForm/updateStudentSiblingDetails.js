import React, { Component } from 'react'
import { connect } from 'react-redux'
// import Select from 'react-select'
import { withStyles, TextField, Button, Modal } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import { apiActions } from '../../../../_actions'
// import Modal from '../../../../ui/Modal/modal'
import * as actionTypes from '../store/actions'

const styles = theme => ({
  container: {
    display: 'flex',
    flexwrap: 'wrap'
  },
  root: {
    width: '100%'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  spacing: {
    marginLeft: '20px',
    marginRight: '10px',
    marginTop: '5px',
    marginBottom: '10px'
  },
  spacingForDropDown: {
    marginLeft: '20px',
    marginRight: '10px',
    marginTop: '5px',
    marginBottom: '10px'
  },
  modalDeletebutton: {
    bottom: '5px',
    right: '10px',
    backgroundColor: '#009900',
    display: 'inlineBlock',
    position: 'absolute'
  },
  modalRemainbutton: {
    bottom: '5px',
    left: '10px',
    backgroundColor: '#cc0000',
    display: 'inlineBlock',
    position: 'absolute'
  },
  outlined: {
    zIndex: 0
  }
})
class UpdateStudentSiblingDetailsFormAcc extends Component {
  constructor (props) {
    super(props)
    this.state = {
      seesion: null,
      certificateName: null,
      studentSiblingDetails: {
        sibling1name: null,
        sibling1code: null,
        sibling1Occupation: null,
        sibling1mobile: null,
        sibling2name: null,
        sibling2code: null,
        sibling2mobile: null,
        sibling2Occupation: null,
        guardianName: null,
        guardianCode: null,
        guardianOccupation: null,
        guardianmobile: null,
        guardianEmail: null
      }
    }
  }

  componentDidUpdate () {
    console.log('DID UPDATED', this.state)
    this.props.getSiblingDetail(this.state.studentSiblingDetails)
  }
  componentWillReceiveProps (nextProps) {
    console.log('===received props', nextProps.studentDetailsForAdmission)
    if (nextProps.studentDetailsForAdmission) {
      console.log('this is printed chandan')
      const newstudentParentDetails = { ...this.state.studentParentDetails }
      newstudentParentDetails['fatherName'] = nextProps.studentDetailsForAdmission.parent.father_name ? nextProps.studentDetailsForAdmission.parent.father_name : null
      newstudentParentDetails['fatherphone'] = nextProps.studentDetailsForAdmission.parent.father_mobile_no ? nextProps.studentDetailsForAdmission.parent.father_mobile_no : null
      newstudentParentDetails['motherName'] = nextProps.studentDetailsForAdmission.parent.mother_name ? nextProps.studentDetailsForAdmission.parent.mother_name : null
      newstudentParentDetails['motherphone'] = nextProps.studentDetailsForAdmission.parent.mother_mobile_no ? nextProps.studentDetailsForAdmission.parent.mother_mobile_no : null
      this.setState({
        studentParentDetails: newstudentParentDetails })
    }
  }

  studentSiblingInputHandler= (event) => {
    console.log(event.target.name)
    const newstudentSiblingDetails = { ...this.state.studentSiblingDetails }
    switch (event.target.name) {
      case 'sibling1name': {
        newstudentSiblingDetails['sibling1name'] = event.target.value
        break
      }
      case 'sibling1code': {
        newstudentSiblingDetails['sibling1code'] = event.target.value
        break
      }
      case 'sibling1mobile': {
        newstudentSiblingDetails['sibling1mobile'] = event.target.value
        break
      }
      case 'sibling1occupation': {
        newstudentSiblingDetails['sibling1Occupation'] = event.target.value
        break
      }
      case 'sibling2name': {
        newstudentSiblingDetails['sibling2name'] = event.target.value
        break
      }
      case 'sibling2code': {
        newstudentSiblingDetails['sibling2code'] = event.target.value
        break
      }
      case 'sibling2mobile': {
        newstudentSiblingDetails['sibling2mobile'] = event.target.value
        break
      }
      case 'sibling2Occupation': {
        newstudentSiblingDetails['sibling2Occupation'] = event.target.value
        break
      }
      case 'guardianName': {
        newstudentSiblingDetails['guardianName'] = event.target.value
        break
      }
      case 'guardianCode': {
        newstudentSiblingDetails['guardianCode'] = event.target.value
        break
      }
      case 'guardianOccupation': {
        newstudentSiblingDetails['guardianOccupation'] = event.target.value
        break
      }
      case 'guardianmobile': {
        newstudentSiblingDetails['guardianmobile'] = event.target.value
        break
      }
      case 'guardianEmail': {
        newstudentSiblingDetails['guardianEmail'] = event.target.value
        break
      }
      default: {

      }
    }
    this.setState({
      studentSiblingDetails: newstudentSiblingDetails
    })
  }
  hideInfoModalHandler= () => {
    this.setState({ showModal: false })
  }
  saveCertificateHandler= () => {
    console.log(this.state.certificateName)
    this.setState({ showModal: false })
    const body = {
      certificate_name: this.state.certificateName
    }
    this.props.postStudentAdmissionCertificate(body, this.props.user, this.props.alert)
  }
  studentCertificateInputHandler= (event) => {
    this.setState({
      certificateName: event.target.value
    })
  }
  showInfoModalHandler = () => {
    this.setState({ showModal: true })
  }
  render () {
    const { classes } = this.props
    let cerModal = null
    if (this.state.showModal) {
      cerModal = (
        <Modal open={this.state.showModal} click={this.hideInfoModalHandler} small>
          <React.Fragment>
            <Grid container spacing={3}>
              <Grid item xs={12} className={classes.spacing}>
                <label>Add Certificate Name</label>
                <TextField
                  type='text'
                  margin='dense'
                  fullWidth
                  InputLabelProps={{ classes: { outlined: classes.outlined } }}
                  // value={this.state.studentParentDetails.fatherphone}
                  onChange={this.studentCertificateInputHandler}
                  variant='outlined'
                  name='certificateName' />
              </Grid>
            </Grid>
            <footer>
              {/* <Grid container spacing={1}>
                <Grid item xs={1}>
                  <div className={classes.spacing}>
                    <Button variant='contained' color='primary'>Save</Button>
                  </div>
                </Grid>
              </Grid> */}
            </footer>
          </React.Fragment>
          <div className={classes.modalRemainbutton}>
            <Button primary style={{ color: '#fff' }} onClick={this.saveCertificateHandler}>Save</Button>
          </div>
          <div className={classes.modalDeletebutton}>
            <Button primary style={{ color: '#fff' }} onClick={this.hideInfoModalHandler}>Go Back</Button>
          </div>
        </Modal>
      )
    }
    return (
      <React.Fragment>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Sibling1 Name</label>
              <TextField
                type='text'
                margin='dense'
                fullWidth
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                // value={this.state.studentParentDetails.fatherName}
                onChange={this.studentSiblingInputHandler}
                variant='outlined'
                name='sibling1name' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Sibling1 Code</label>
              <TextField
                type='text'
                margin='dense'
                fullWidth
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                // value={this.state.studentParentDetails.fatherphone}
                onChange={this.studentSiblingInputHandler}
                variant='outlined'
                name='sibling1code' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Sibling1 Mobile No</label>
              <TextField
                type='text'
                margin='dense'
                fullWidth
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                onChange={this.studentSiblingInputHandler}
                variant='outlined'
                name='sibling1mobile' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Sibling1 Occupation</label>
              <TextField
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                onChange={this.studentSiblingInputHandler}
                variant='outlined'
                name='sibling1occupation' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Sibling2 Name</label>
              <TextField
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                // value={this.state.studentParentDetails.fatherName}
                onChange={this.studentSiblingInputHandler}
                variant='outlined'
                name='sibling2name' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Sibling2 Code</label>
              <TextField
                type='phone'
                margin='dense'
                fullWidth
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                // value={this.state.studentParentDetails.fatherphone}
                onChange={this.studentSiblingInputHandler}
                variant='outlined'
                name='sibling2code' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Sibling2 Mobile No</label>
              <TextField
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                onChange={this.studentSiblingInputHandler}
                variant='outlined'
                name='sibling2mobile' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Sibling2 Occupation</label>
              <TextField
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                onChange={this.studentSiblingInputHandler}
                variant='outlined'
                name='sibling2Occupation' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Guardian Name</label>
              <TextField
                type='text'
                margin='dense'
                fullWidth
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                // value={this.state.studentParentDetails.fatherName}
                onChange={this.studentSiblingInputHandler}
                variant='outlined'
                name='guardianName' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Guardian Code</label>
              <TextField
                type='phone'
                margin='dense'
                fullWidth
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                // value={this.state.studentParentDetails.fatherphone}
                onChange={this.studentSiblingInputHandler}
                variant='outlined'
                name='guardianCode' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Guardian Occupation</label>
              <TextField
                type='text'
                margin='dense'
                fullWidth
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                onChange={this.studentSiblingInputHandler}
                variant='outlined'
                name='fatheroccupation' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Guardian Mobile No</label>
              <TextField
                type='text'
                margin='dense'
                fullWidth
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                onChange={this.studentSiblingInputHandler}
                variant='outlined'
                name='guardianmobile' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Guardian E-mail</label>
              <TextField
                type='e-mail'
                margin='dense'
                fullWidth
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                onChange={this.studentSiblingInputHandler}
                variant='outlined'
                name='guardianEmail' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <Grid>
                <Button color='primary' onClick={this.showInfoModalHandler}>Add Certificate</Button>
              </Grid>
            </Grid>
          </Grid>
        </div>
        {cerModal}
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  studentDetailsForAdmission: state.finance.accountantReducer.admissionForm.studentDetailsforAdmisssion,
  admissionrecordbyerp: state.finance.accountantReducer.admissionForm.admissionrecordbyerp
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  postStudentAdmissionCertificate: (data, user, alert) => dispatch(actionTypes.postStudentAdmissionCertificate({ data, user, alert }))

})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(UpdateStudentSiblingDetailsFormAcc)))
