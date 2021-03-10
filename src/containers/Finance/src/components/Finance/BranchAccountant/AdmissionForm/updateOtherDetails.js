import React, { Component } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import { withStyles, TextField, Radio } from '@material-ui/core/'
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
  outlined: {
    zIndex: 0
  }
})
class UpdateOtherDetailsFormAcc extends Component {
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
        adharno: null,
        qualifiedExamRank: null,
        eligibleForSchorlarship: null,
        identificationMarks1: null,
        identificationMarks2: null
      }
    }
  }

  componentDidUpdate () {
    console.log('DID UPDATED', this.state.otherDetails)
    this.props.getOtherDetail(this.state.otherDetails)
  }
  componentWillReceiveProps (nextProps) {
    console.log('===received props', nextProps.admissionrecordbyerp)
    if (nextProps.admissionrecordbyerp) {
      console.log('this is printed chandan')
      const newotherDetails = { ...this.state.otherDetails }
      newotherDetails['adharno'] = nextProps.admissionrecordbyerp.aadhar_number ? nextProps.admissionrecordbyerp.aadhar_number : null
      newotherDetails['qualifiedExamRank'] = nextProps.admissionrecordbyerp.qualified_exam_rank ? nextProps.admissionrecordbyerp.qualified_exam_rank : null
      newotherDetails['religion'] = nextProps.admissionrecordbyerp.religion ? nextProps.admissionrecordbyerp.religion : null
      newotherDetails['caste'] = nextProps.admissionrecordbyerp.caste ? nextProps.admissionrecordbyerp.caste : null
      newotherDetails['identificationMarks1'] = nextProps.admissionrecordbyerp.identification_mark_one ? nextProps.admissionrecordbyerp.identification_mark_one : null
      newotherDetails['identificationMarks2'] = nextProps.admissionrecordbyerp.identification_mark_two ? nextProps.admissionrecordbyerp.identification_mark_two : null
      newotherDetails['mothertounge'] = nextProps.admissionrecordbyerp.mother_tongue ? nextProps.admissionrecordbyerp.mother_tongue : null
      newotherDetails['bloodgroup'] = nextProps.admissionrecordbyerp.blood_group ? nextProps.admissionrecordbyerp.blood_group : null
      newotherDetails['nationality'] = nextProps.admissionrecordbyerp.nationality ? nextProps.admissionrecordbyerp.nationality : null
      newotherDetails['language1'] = nextProps.admissionrecordbyerp.first_lang ? nextProps.admissionrecordbyerp.first_lang.id : null
      newotherDetails['language2'] = nextProps.admissionrecordbyerp.second_lang ? nextProps.admissionrecordbyerp.second_lang.id : null
      newotherDetails['language3'] = nextProps.admissionrecordbyerp.third_lang ? nextProps.admissionrecordbyerp.third_lang.id : null
      this.setState({
        otherDetails: newotherDetails })
    }
  }
  componentDidMount () {
    this.props.fetchSubjects(this.props.alert, this.props.user)
  }
  handlescholership = event => {
    const newotherDetails = { ...this.state.otherDetails }
    if (event.target.value === 'yes') {
      newotherDetails['eligibleForSchorlarship'] = event.target.value
    } else if (event.target.value === 'no') {
      newotherDetails['eligibleForSchorlarship'] = event.target.value
    }
    this.setState({
      otherDetails: newotherDetails })
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
      case 'qualifiedexamrank': {
        newotherDetails['qualifiedExamRank'] = event.target.value
        break
      }
      case 'identification1': {
        newotherDetails['identificationMarks1'] = event.target.value
        break
      }
      case 'identification2': {
        newotherDetails['identificationMarks2'] = event.target.value
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
              <label>Qualified Examination Rank</label>
              <TextField
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.otherDetails.qualifiedExamRank ? this.state.otherDetails.qualifiedExamRank : ''}
                onChange={this.addressDetailsInputHandler}
                variant='outlined'
                name='qualifiedexamrank' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Aadhar No.</label>
              <TextField label='Aadhar No.'
                type='text'
                margin='dense'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                fullWidth
                value={this.state.otherDetails.adharno ? this.state.otherDetails.adharno : ''}
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
                value={{ label: this.state.otherDetails.religion ? this.state.otherDetails.religion : '', value: this.state.otherDetails.religion ? this.state.otherDetails.religion : '' }}
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
                value={{ label: this.state.otherDetails.caste ? this.state.otherDetails.caste : '', value: this.state.otherDetails.caste ? this.state.otherDetails.caste : '' }}
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
                value={{ label: this.state.otherDetails.mothertounge ? this.state.otherDetails.mothertounge : '', value: this.state.otherDetails.mothertounge ? this.state.otherDetails.mothertounge : '' }}
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
                value={{ label: this.state.otherDetails.bloodgroup ? this.state.otherDetails.bloodgroup : '', value: this.state.otherDetails.bloodgroup ? this.state.otherDetails.bloodgroup : '' }}
                options={[
                  { value: 'A+ve', label: 'A+ve' },
                  { value: 'A-ve', label: 'A-ve' },
                  { value: 'B-ve', label: 'B-ve' },
                  { value: 'B+ve', label: 'B+ve' },
                  { value: 'AB+ve', label: 'AB+ve' },
                  { value: 'AB-ve', label: 'hindi' },
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
                value={{ label: this.state.otherDetails.nationality ? this.state.otherDetails.nationality : '', value: this.state.otherDetails.nationality ? this.state.otherDetails.nationality : '' }}
                options={[
                  { value: 'Indian', label: 'Indian' },
                  { value: 'Others', label: 'Others' }
                ]}
                onChange={(e) => { this.otherDetailsDropdonHandler(e, 'nationality') }}
              />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <strong>Eligible for Scholarship:</strong>
              <Grid item xs={12}>
                <Radio
                  checked={this.state.otherDetails.eligibleForSchorlarship === 'yes'}
                  value='yes'
                  name='scholarship-yes'
                  onChange={this.handlescholership}
                  aria-label='Yes'
                /> Yes
                <Radio
                  checked={this.state.otherDetails.eligibleForSchorlarship === 'no'}
                  value='no'
                  name='scholarship-no'
                  onChange={this.handlescholership}
                  aria-label='No'
                /> No
              </Grid>
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
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Identification Marks</label>
              <Grid item xs={12}>
                <div style={{ marginTop: '10px' }}>
                  <textarea
                    placeholder='Identification Marks I'
                    rows='4'
                    cols='100'
                    value={this.state.otherDetails.identificationMarks1 ? this.state.otherDetails.identificationMarks1 : ''}
                    name='identification1'
                    onChange={this.addressDetailsInputHandler}
                  />
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <Grid item xs={12}>
                <div style={{ marginTop: '10px' }}>
                  <textarea
                    placeholder='Identification Marks II'
                    rows='4'
                    cols='100'
                    value={this.state.otherDetails.identificationMarks2 ? this.state.otherDetails.identificationMarks2 : ''}
                    name='identification2'
                    onChange={this.addressDetailsInputHandler}
                  />
                </div>
              </Grid>
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
  subjectList: state.finance.common.subjects,
  admissionrecordbyerp: state.finance.accountantReducer.admissionForm.admissionrecordbyerp
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchSubjects: (alert, user) => dispatch(actionTypes.fetchSubjects({ alert, user }))

})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(UpdateOtherDetailsFormAcc)))
