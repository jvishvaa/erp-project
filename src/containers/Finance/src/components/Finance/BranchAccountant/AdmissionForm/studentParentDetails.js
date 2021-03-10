import React, { Component } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import { withStyles, TextField } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import { apiActions } from '../../../../_actions'

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
  outlined: {
    zIndex: 0
  }
})
class StudentParentDetailsFormAcc extends Component {
  constructor (props) {
    super(props)
    this.state = {
      seesion: null,
      studentParentDetails: {
        fatherName: null,
        fatherphone: null,
        fatheremail: null,
        fatherqualification: null,
        fatheroccupation: null,
        motherName: null,
        motherphone: null,
        motheremail: null,
        motherqualification: null,
        motheroccupation: null,
        poc: null,
        siblingClass: null
      }
    }
  }

  componentDidUpdate () {
    console.log('DID UPDATED', this.state.studentParentDetails)
    this.props.getStudentParentDetail(this.state.studentParentDetails)
  }

  componentDidMount () {
    if (this.props.studentparentdetails) {
      const newstudentParentDetails = { ...this.props.studentparentdetails }
      this.setState({
        studentParentDetails: newstudentParentDetails })
    }
  }

  studentParentDroponHandler= (event, name) => {
    console.log(event, name)
    const newstudentParentDetails = { ...this.state.studentParentDetails }
    switch (name) {
      case 'poc': {
        newstudentParentDetails['poc'] = event.value
        break
      }
      default: {

      }
    }
    this.setState({
      studentParentDetails: newstudentParentDetails
    })
  }

  studentParentInputHandler= (event) => {
    console.log(event.target.name)
    const newstudentParentDetails = { ...this.state.studentParentDetails }
    switch (event.target.name) {
      case 'fatherName': {
        newstudentParentDetails['fatherName'] = event.target.value
        break
      }
      case 'fatherphone': {
        newstudentParentDetails['fatherphone'] = event.target.value
        break
      }
      case 'fatheremail': {
        newstudentParentDetails['fatheremail'] = event.target.value
        break
      }
      case 'fatherqualification': {
        newstudentParentDetails['fatherqualification'] = event.target.value
        break
      }
      case 'fatheroccupation': {
        newstudentParentDetails['fatheroccupation'] = event.target.value
        break
      }
      case 'motherName': {
        newstudentParentDetails['motherName'] = event.target.value
        break
      }
      case 'motherphone': {
        newstudentParentDetails['motherphone'] = event.target.value
        break
      }
      case 'motheremail': {
        newstudentParentDetails['motheremail'] = event.target.value
        break
      }
      case 'motherqualification': {
        newstudentParentDetails['motherqualification'] = event.target.value
        break
      }
      case 'motheroccupation': {
        newstudentParentDetails['motheroccupation'] = event.target.value
        break
      }
      case 'siblingClass': {
        newstudentParentDetails['siblingClass'] = event.target.value
        break
      }
      default: {

      }
    }
    this.setState({
      studentParentDetails: newstudentParentDetails
    })
  }

  render () {
    const { classes } = this.props
    return (
      <React.Fragment>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Father Name*</label>
              <TextField label='Father Name'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                type='text'
                margin='dense'
                fullWidth
                required
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='fatherName' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Father Phone No*</label>
              <TextField
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                type='phone'
                margin='dense'
                fullWidth
                required
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='fatherphone' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Father E-mail</label>
              <TextField
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                type='email'
                margin='dense'
                fullWidth
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='fatheremail' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Father Qualification</label>
              <TextField label='Father Qualification'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                type='text'
                margin='dense'
                fullWidth
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='fatherqualification' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Father Occupation</label>
              <TextField
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                type='text'
                margin='dense'
                fullWidth
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='fatheroccupation' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Mother Name</label>
              <TextField label='Mother Name'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                type='text'
                margin='dense'
                fullWidth
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='motherName' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Mother Phone No*</label>
              <TextField
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                type='phone'
                margin='dense'
                fullWidth
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='motherphone' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Mother E-mail</label>
              <TextField
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                type='email'
                margin='dense'
                fullWidth
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='motheremail' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Mother Qualification</label>
              <TextField label='Mother Qualification'
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                type='text'
                margin='dense'
                fullWidth
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='motherqualification' />
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Mother Occupation</label>
              <TextField
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                type='text'
                margin='dense'
                fullWidth
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='motheroccupation' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Point Of Contact*</label>
              <div style={{ marginTop: '14px' }}>
                <Select
                  placeholder='Select'
                  name='pointOfContact'
                  onChange={(e) => { this.studentParentDroponHandler(e, 'poc') }}
                  options={[
                    { value: '1', label: 'Father' },
                    { value: '2', label: 'Mother' },
                    { value: '3', label: 'Guardian' }
                  ]}
                />
              </div>
            </Grid>
            <Grid item xs={3} className={classes.spacing}>
              <label>Sibling Class</label>
              <TextField
                InputLabelProps={{ classes: { outlined: classes.outlined } }}
                type='text'
                margin='dense'
                fullWidth
                onChange={this.studentParentInputHandler}
                variant='outlined'
                name='siblingClass' />
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions())

})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(StudentParentDetailsFormAcc)))
