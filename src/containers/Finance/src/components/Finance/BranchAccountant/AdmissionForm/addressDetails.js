import React, { Component } from 'react'
import { connect } from 'react-redux'
// import Select from 'react-select'
import { withStyles, TextField, Checkbox } from '@material-ui/core/'
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
    marginLeft: theme.spacing * 1,
    marginRight: theme.spacing * 1,
    width: 200
  },
  spacing: {
    marginLeft: '20px',
    marginRight: '10px',
    marginTop: '5px',
    marginBottom: '10px'
  }
})

const NavData = JSON.parse(localStorage.getItem('navigationData')) || {}
let moduleId
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Admissions' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Admission Form') {
          // setModuleId(item.child_id);
          // setModulePermision(true);
            moduleId = item.child_id
        } else {
          // setModulePermision(false);
        }
      });
    } else {
      // setModulePermision(false);
    }
  });
} else {
  // setModulePermision(false);
}
class AddressDetailsFormAcc extends Component {
  constructor (props) {
    super(props)
    this.state = {
      seesion: null,
      isaddresssame: false,
      addressDetails: {
        tempAdd: null,
        tempzip: null,
        perAdd: null,
        perzip: null
      }
    }
  }

  componentDidUpdate () {
    this.props.getAddressDetail(this.state.addressDetails)
  }

  componentDidMount () {
    if (this.props.adressdetails) {
      const newaddressDetails = { ...this.props.studentparentdetails }
      this.setState({
        addressDetails: newaddressDetails })
    }
  }

  handleCheckbox= (event, name) => {
    const newaddressDetails = { ...this.state.addressDetails }
    if (event.target.value !== 'true') {
      newaddressDetails['perAdd'] = newaddressDetails['tempAdd']
      newaddressDetails['perzip'] = newaddressDetails['tempzip']
      this.setState({
        addressDetails: newaddressDetails
      })
    } else if (event.target.value !== 'false') {
      newaddressDetails['perAdd'] = ''
      newaddressDetails['perzip'] = ''
      this.setState({
        addressDetails: newaddressDetails
      })
    }
    this.setState({ isaddresssame: !event.target.value })
  }

  addressDetailsInputHandler= (event) => {
    const newaddressDetails = { ...this.state.addressDetails }
    switch (event.target.name) {
      case 'tempAdd': {
        newaddressDetails['tempAdd'] = event.target.value
        break
      }
      case 'tempzip': {
        newaddressDetails['tempzip'] = event.target.value
        break
      }
      case 'perAdd': {
        newaddressDetails['perAdd'] = event.target.value
        break
      }
      case 'perzip': {
        newaddressDetails['perzip'] = event.target.value
        break
      }
      default: {

      }
    }
    this.setState({
      addressDetails: newaddressDetails
    })
  }

  render () {
    const { classes } = this.props
    return (
      <React.Fragment>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Current Address*</label>
              <Grid item xs={12}>
                <div style={{ marginTop: '10px' }}>
                  <textarea
                    placeholder='Current Address'
                    rows='4'
                    cols='100'
                    name='tempAdd'
                    onChange={this.addressDetailsInputHandler}
                  />
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Zipcode</label>
              <TextField
                type='number'
                margin='dense'
                fullWidth
                onChange={this.addressDetailsInputHandler}
                variant='outlined'
                name='tempzip' />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid>
              <Checkbox
                checked={this.state.isaddresssame}
                onChange={(e) => { this.handleCheckbox(e, 'checkedA') }}
                value={this.state.isaddresssame ? this.state.isaddresssame : null}
                color='primary'
              /><label>Check if Current address is same as Permanent Address</label>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Permanant Address</label>
              <Grid item xs={12}>
                <div style={{ marginTop: '10px' }}>
                  <textarea
                    placeholder='Permanant Address'
                    name='perAdd'
                    rows='4'
                    cols='100'
                    onChange={this.addressDetailsInputHandler}
                    value={this.state.addressDetails.perAdd}
                  />
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Zipcode</label>
              <TextField
                type='number'
                margin='dense'
                fullWidth
                value={this.state.addressDetails.perzip}
                onChange={this.addressDetailsInputHandler}
                variant='outlined'
                name='perzip' />
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
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId))

})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(AddressDetailsFormAcc)))
