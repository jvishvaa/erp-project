import React, { Component } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import { withStyles, TextField } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import { apiActions } from '../../../../_actions'
import * as actionTypes from '../../store/actions'

const styles = theme => ({
  container: {
    display: 'flex',
    flexwrap: 'wrap'
  },
  root: {
    width: '100%'
  },
  textField: {
    marginLeft: theme.spacing * 1,
    marginRight: theme.spacing * 1,
    width: 200
  },
  spacing: {
    marginLeft: '20px',
    marginRight: '10px',
    marginTop: '5px',
    marginBottom: '10px'
  },
  outlined: {
    zIndex: 0
  }
})
class NonRTEOtherDetailsFormAcc extends Component {
  constructor (props) {
    super(props)
    this.state = {
      seesion: null,
      otherDetails: {
        prevAdmissionno: null,
        religion: null,
        caste: null,
        mothertounge: null,
        bloodgroup: null,
        nationality: null,
        language1: null,
        language2: null,
        language3: null,
        adharno: null
      }
    }
  }

  componentDidUpdate () {
    console.log('DID UPDATED', this.state.otherDetails)
    this.props.getOtherDetail(this.state.otherDetails)
  }

  componentDidMount () {
    this.props.fetchSubjects(this.props.alert, this.props.user)
  }

  addressDetailsInputHandler= (event) => {
    const newotherDetails = { ...this.state.otherDetails }
    switch (event.target.name) {
      case 'prevAdmissionno': {
        newotherDetails['prevAdmissionno'] = event.target.value
        break
      }
      case 'adharno': {
        newotherDetails['adharno'] = event.target.value
        break
      }
      default: {

      }
    }
    this.setState({
      otherDetails: newotherDetails
    })
  }

  otherDetailsDropdonHandler= (event, name) => {
    console.log('other detail handler', event, name)
    const newotherDetails = { ...this.state.otherDetails }
    console.log(event)
    switch (name) {
      case 'religion': {
        newotherDetails['religion'] = event.value
        break
      }
      case 'caste': {
        newotherDetails['caste'] = event.value
        break
      }
      case 'mothertounge': {
        newotherDetails['mothertounge'] = event.value
        break
      }
      case 'bloodgroup': {
        newotherDetails['bloodgroup'] = event.value
        break
      }
      case 'nationality': {
        newotherDetails['nationality'] = event.value
        break
      }
      case 'language1': {
        newotherDetails['language1'] = event.value
        break
      }
      case 'language2': {
        newotherDetails['language2'] = event.value
        break
      }
      case 'language3': {
        newotherDetails['language3'] = event.value
        break
      }
      default: {

      }
    }
    this.setState({
      otherDetails: newotherDetails
    })
  }

  render () {
    const { classes } = this.props
    return (
      <React.Fragment>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Previous Admission No.</label>
              <TextField label='previousAdmissionNo'
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                onChange={this.addressDetailsInputHandler}
                variant='outlined'
                name='prevAdmissionno' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Aadhar No.</label>
              <TextField label='Aadhar No.'
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                onChange={this.addressDetailsInputHandler}
                variant='outlined'
                name='adharno' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Religion</label>
              <Select
                placeholder='Select '
                options={[
                  { value: 'Hindu', label: 'Hindu' },
                  { value: 'Christian', label: 'Christian' },
                  { value: 'Muslim', label: 'Muslim' },
                  { value: 'Sikh', label: 'Sikh' },
                  { value: 'Jain', label: 'Jain' },
                  { value: 'Buddhist', label: 'Buddhist' },
                  { value: 'Other', label: 'Other' }
                ]}
                onChange={(e) => { this.otherDetailsDropdonHandler(e, 'religion') }}
              />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Caste</label>
              <Select
                placeholder='Select '
                options={[
                  { value: 'BC', label: 'BC' },
                  { value: 'OBC', label: 'OBC' },
                  { value: 'OC', label: 'OC' },
                  { value: 'ST', label: 'ST' },
                  { value: 'SC', label: 'SC' },
                  { value: 'bca', label: 'BC-A' },
                  { value: 'bcb', label: 'BC-B' },
                  { value: 'bcc', label: 'BC-C' },
                  { value: 'bcd', label: 'BC-D' },
                  { value: 'bce', label: 'BC-E' },
                  { value: 'Others', label: 'Others' }
                ]}
                onChange={(e) => { this.otherDetailsDropdonHandler(e, 'caste') }}
              />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Mother Tongue</label>
              <Select
                placeholder='Select '
                options={[
                  { value: 'Kannada', label: 'Kannada' },
                  { value: 'Telugu', label: 'Telugu' },
                  { value: 'Malayalam', label: 'Malayalam' },
                  { value: 'Tamil', label: 'Tamil' },
                  { value: 'Marathi', label: 'Marathi' },
                  { value: 'Hindi', label: 'Hindi' },
                  { value: 'Bengali', label: 'Bengali' },
                  { value: 'Urdu', label: 'Urdu' },
                  { value: 'Others', label: 'Others' }
                ]}
                onChange={(e) => { this.otherDetailsDropdonHandler(e, 'mothertounge') }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Blood Group</label>
              <Select
                placeholder='Select '
                options={[
                  { value: 'A+ve', label: 'A+ve' },
                  { value: 'A-ve', label: 'A-ve' },
                  { value: 'B-ve', label: 'B-ve' },
                  { value: 'B+ve', label: 'B+ve' },
                  { value: 'AB+ve', label: 'AB+ve' },
                  { value: 'AB-ve', label: 'AB-ve' },
                  { value: 'O+ve', label: 'O+ve' },
                  { value: 'O-ve', label: 'O-ve' },
                  { value: 'Others', label: 'Others' }
                ]}
                onChange={(e) => { this.otherDetailsDropdonHandler(e, 'bloodgroup') }}
              />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Nationality</label>
              <Select
                placeholder='Select '
                options={[
                  { value: 'Indian', label: 'Indian' },
                  { value: 'Others', label: 'Others' }
                ]}
                onChange={(e) => { this.otherDetailsDropdonHandler(e, 'nationality') }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Language I</label>
              <Select
                placeholder='Select '
                options={this.props.subjectList ? this.props.subjectList.map(sub => ({
                  value: sub.id,
                  label: sub.subject_name
                }))
                  : []
                }
                onChange={(e) => { this.otherDetailsDropdonHandler(e, 'language1') }}
              />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Language II</label>
              <Select
                placeholder='Select '
                options={this.props.subjectList ? this.props.subjectList.map(sub => ({
                  value: sub.id,
                  label: sub.subject_name
                }))
                  : []
                }
                onChange={(e) => { this.otherDetailsDropdonHandler(e, 'language2') }}
              />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Language III</label>
              <Select
                placeholder='Select '
                options={this.props.subjectList ? this.props.subjectList.map(sub => ({
                  value: sub.id,
                  label: sub.subject_name
                }))
                  : []
                }
                onChange={(e) => { this.otherDetailsDropdonHandler(e, 'language3') }}
              />
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  subjectList: state.finance.common.subjects
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchSubjects: (alert, user) => dispatch(actionTypes.fetchSubjects({ alert, user }))

})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(NonRTEOtherDetailsFormAcc)))
