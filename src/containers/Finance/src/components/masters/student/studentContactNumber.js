import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Timer from 'react-compound-timer'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import { withStyles, Button } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import OtpInput from 'react-otp-input'
// import moment from 'moment'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { urls } from '../../../urls'
import { OmsSelect } from '../../../ui'

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300
  }
})

class StudentContactNumber extends Component {
  constructor () {
    super()
    this.state = {
      value: {},
      checkedA: false,
      checkedB: false,
      otp: '',
      showOtp: {},
      otpError: false

    }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.handleOtp = this.handleOtp.bind(this)
  }
  componentDidMount () {
    this.role = this.userProfile.personal_info.role
    this.userId = this.userProfile.personal_info.user_id
    console.log(this.userId)
    this.getPointOfContact()
    if (this.role === 'Student') {
      this.setState({
        userId: this.userId

      }, () => { this.getContactNumbers() })
    }
  }
  setPointOfContact = (value) => {
    let pointOfContact = value

    let { pointOfContactChoices = undefined } = this.state
    if (Array.isArray(pointOfContactChoices) && pointOfContactChoices.length && pointOfContact && pointOfContact !== 'undefined') {
      console.log(typeof (pointOfContactChoices[0].id), typeof (pointOfContact))
      let choice = pointOfContactChoices.filter(poc => poc.id === pointOfContact)
      if (choice) {
        choice = choice[0].choice

        this.setState({ pointOfContact: { value: pointOfContact, label: choice } })
      }
    }
  }
  getPointOfContact = () => {
    axios
      .get(urls.PointOfContact, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({ pointOfContactChoices: res.data })
        }
      })
      .catch(e => console.log(e))
  }

  getContactNumbers = (e) => {
    var path = urls.StudentContactDetails + '?'

    axios.get(path, {
      headers: {
        'Authorization': 'Bearer ' + this.props.user
      }
    }).then(res => {
      if (res.status === 200) {
        this.setPointOfContact(res.data.point_of_contact)
        this.setState({
          fatherMobile: res.data.father_mobile,
          fatherEmail: res.data.father_email,
          fatherWhatsApp: res.data.father_whatsapp_number,
          motherMobile: res.data.mother_mobile,
          motherEmail: res.data.mother_email,
          motherWhatsApp: res.data.mother_whatsapp_number,
          guardianEmail: res.data.guardian_email,
          guardianMobile: res.data.guardian_mobile
        })
      } else {
        this.props.alert.error('Error Occured')
      }
    })
      .catch(error => {
        this.props.alert.error('Student matching query does not exist')
        console.log(error)
      })
  }
  handleChange = name => event => {
    this.setState({ [name]: event.target.checked })
  }
  handleOtp (index) {
    console.log(index)
    this.setState({ fatherMobileotp: '', motherMobileOtp: '' })
    let { fatherWhatsApp, motherWhatsApp, fatherMobile, guardianMobile, motherMobile, fatherEmail, motherEmail, guardianEmail } = this.state
    console.log(this.state, 'this.state')
    console.log(this.state.fatherEmail)
    let data = {
      // number: index ? Number(fatherWhatsApp) : Number(motherWhatsApp)
      // father_mobile_number: index ? Number(fatherWhatsApp) : Number(motherWhatsApp)

    }
    if (index === 'fatherWhatsappNumber') {
      this.setState({ isfatherNumberVerifying: true })
      if (this.state.checkedA) {
        data['number'] = Number(fatherWhatsApp)
        // data['father_mobile_number'] = Number(fatherWhatsApp)
      } else {
        data['number'] = Number(fatherWhatsApp)
        // data['father_mobile_number'] = [index ? Number(fatherWhatsApp) : Number(motherWhatsApp)]
      }
    }
    if (index === 'motherWhatsappNumber') {
      this.setState({ ismotherWhatsappVerifying: true })
      if (this.state.checkedB) {
        data['number'] = Number(motherWhatsApp)
        // data['mother_mobile_number'] = Number(motherWhatsApp)
      } else {
        data['number'] = Number(motherWhatsApp)
      }
    }
    if (index === 'fatherNumber') {
      this.setState({ isfatherPhoneNumberVerifying: true })
      data['number'] = Number(fatherMobile)
    } else if (index === 'motherNumber') {
      this.setState({ ismotherPhoneNumberVerifying: true })
      data['number'] = Number(motherMobile)
    } else if (index === 'guardianNumber') {
      this.setState({ isguardianNumberVerifying: true })
      data['number'] = Number(guardianMobile)
    }
    if (index === 'fatherEmail') {
      this.setState({ isfatherEmailVerifying: true })
      data['email'] = fatherEmail
    } else if (index === 'motherEmail') {
      this.setState({ ismotherEmailVerifying: true })
      data['email'] = motherEmail
    } else if (index === 'guardianEmail') {
      this.setState({ isguardianEmailVerifying: true })
      data['email'] = guardianEmail
    }
    axios
      .post(urls.mobileOtp, data, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        if (String(res.status).startsWith(String(2))) {
          this.setState(prevState => {
            let showOtp = prevState.showOtp
            showOtp[index] = true
            return { ...prevState, showOtp }
          })
          this.props.alert.success('OTP Sent Successfully')
        } else {
          this.props.alert.error('Error occured')
        }
      })
      .catch(error => {
        // this.setState(prevState => {
        //   let showOtp = prevState.showOtp
        //   showOtp[index] = true
        //   return { ...prevState, showOtp }
        // })

        this.props.alert.error('Error occured')
        console.log(error)
      })
  }
  verifyOtp (index) {
    console.log(index)
    let { fatherWhatsApp, motherWhatsApp, fatherMobile, guardianMobile, motherMobile, fatherEmail, userId, motherEmail, guardianEmail } = this.state
    console.log(this.state, 'this.state')
    this.setState({ otpError: true })

    let data = {

    }
    if (index === 'fatherWhatsappNumber') {
      if (this.state.checkedA) {
        data['father_whatsapp_number'] = Number(fatherWhatsApp)
        data['father_mobile_number'] = Number(fatherWhatsApp)
        data['user_id'] = userId
        data['otp'] = this.state.fatherWhatsAppOtp
      } else {
        data['father_whatsapp_number'] = Number(fatherWhatsApp)
        data['user_id'] = userId
        data['otp'] = this.state.fatherWhatsAppOtp
      }
    }
    if (index === 'motherWhatsappNumber') {
      if (this.state.checkedB) {
        data['mother_whatsapp_number'] = Number(motherWhatsApp)
        data['mother_mobile_number'] = Number(motherWhatsApp)
        data['user_id'] = userId
        data['otp'] = this.state.motherWhatsAppOtp
      } else {
        data['mother_whatsapp_number'] = Number(motherWhatsApp)
        data['user_id'] = userId
        data['otp'] = this.state.motherWhatsAppOtp
      }
    }
    if (index === 'fatherNumber') {
      data['father_mobile_number'] = Number(fatherMobile)
      data['user_id'] = userId
      data['otp'] = this.state.fatherMobileotp
    } else if (index === 'motherNumber') {
      data['mother_mobile_number'] = Number(motherMobile)
      data['user_id'] = userId
      data['otp'] = this.state.motherMobileOtp
    } else if (index === 'guardianNumber') {
      data['guardian_mobile_number'] = Number(guardianMobile)
      data['user_id'] = userId
      data['otp'] = this.state.guardianMobileOtp
    }
    if (index === 'fatherEmail') {
      data['father_email'] = fatherEmail
      data['user_id'] = userId
      data['otp'] = this.state.fatherEmailOtp
    } else if (index === 'motherEmail') {
      data['mother_email'] = motherEmail
      data['user_id'] = userId
      data['otp'] = this.state.motherEmailOtp
    } else if (index === 'guardianEmail') {
      data['guardian_email'] = guardianEmail
      data['user_id'] = userId
      data['otp'] = this.state.guardianEmailOtp
    }
    axios
      .post(urls.mobileOtpVerify, data, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        // eslint-disable-next-line no-debugger
        if (String(res.status).startsWith(String(2))) {
          if (index === 'fatherWhatsappNumber') {
            this.setState({ isfatherNumberVerifying: false })
          } else if (index === 'fatherNumber') {
            this.setState({ isfatherPhoneNumberVerifying: false })
          } else if (index === 'fatherEmail') {
            this.setState({ isfatherEmailVerifying: false })
          } else if (index === 'motherWhatsappNumber') {
            this.setState({ ismotherWhatsappVerifying: false })
          } else if (index === 'motherNumber') {
            this.setState({ ismotherPhoneNumberVerifying: false })
          } else if (index === 'motherEmail') {
            this.setState({ ismotherEmailVerifying: false })
          } else if (index === 'guardianEmail') {
            this.setState({ isguardianEmailVerifying: false })
          } else if (index === 'guardianNumber') {
            this.setState({ isguardianNumberVerifying: false })
          }
          this.props.alert.success('OTP Verified')
        }
      })
      .catch(error => {
        console.log(error.response.status, 'Status')
        switch (error.response.status) {
          case 404: this.props.alert.error('OTP is not Matched'); break
          case 400: this.props.alert.error('OTP  Expired, Generate Again'); break
          case 500: this.props.alert.error('OTP  not matched'); break
          default: this.props.alert.error('Error occured'); break
        }
      })
  }

  updatePointOfContact = (poc) => {
    // eslint-disable-next-line no-debugger
    debugger
    this.setState({ pointOfContact: poc })
    // eslint-disable-next-line no-debugger
    debugger
    console.log(poc, ' poc')
    let data = { 'point_of_contact': poc.value }
    axios
      .post(urls.PointOfContact, data, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        // eslint-disable-next-line no-debugger
        debugger
        if (res.status === 200) {
          console.log(res, 'done')
        }
      })
      .catch(e => console.log(e))
  }

  render () {
    const { classes } = this.props
    console.log(this.state.timerState)
    // const { otpError } = this.state
    return (
      <React.Fragment>
        <Grid container>
          <Grid item>

            <TextField
              required
              id='standard-required'
              label='Father WhatsApp Number'
              className={classes.textField}
              value={this.state.fatherWhatsApp}
              type='number'
              pattern='/^(\+\d{1,3}[- ]?)?\d{10}$/'
              onChange={(e) => { e.target.value.length <= 10 && this.setState({ fatherWhatsApp: e.target.value }) }}
              margin='normal'
              InputLabelProps={{
                shrink: true
              }}
            />

            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.checkedA}
                    onChange={this.handleChange('checkedA')}
                    value='checkedA'
                    inputProps={{
                      'aria-label': 'primary checkbox'
                    }}
                  />
                }
                label='Use WhatsApp Number as Phone Number'
              />
            </div>
          </Grid>
          <Grid item style={{ paddingTop: 9 }}>
            {this.state.fatherWhatsApp &&
              <Button type='submit' onClick={() => { this.setState({ fatherWhatsAppOtp: '' }); this.handleOtp('fatherWhatsappNumber') }}
                color='green'>Save</Button>}

          </Grid>
          {this.state.showOtp['fatherWhatsappNumber'] && <Timer
            initialTime={120000}
            direction='backward'
            checkpoints={[
              {
                time: 0,
                callback: () => this.setState({ showOtp: { ...this.state.showOtp, 'fatherWhatsappNumber': false } })

              }
            ]}
          >
            {({ timerState, reset }) => {
              console.log(timerState)
              return <React.Fragment>
                <Grid item>
                  {this.state.isfatherNumberVerifying ? this.state.showOtp['fatherWhatsappNumber'] && <OtpInput
                    onChange={fatherWhatsAppOtp => this.setState({ fatherWhatsAppOtp })}
                    numInputs={6}
                    value={this.state.fatherWhatsAppOtp}
                    inputStyle={{
                      background: 'none',
                      color: '#000',
                      fontSize: 14,
                      padding: '6px 6px 6px 2px',
                      display: 'block',
                      width: 30,
                      margin: 10,
                      borderRadius: 0,
                      border: '1px solid #c6c6c6'
                    }}
                  />
                    : null }
                </Grid>
                <Grid item style={{ paddingTop: 11 }}>
                  {this.state.isfatherNumberVerifying ? this.state.showOtp['fatherWhatsappNumber'] && this.state.fatherWhatsAppOtp && this.state.fatherWhatsAppOtp.length === 6 &&
                    <Button type='submit' onClick={() => this.verifyOtp('fatherWhatsappNumber')}
                      color='green'>Verify</Button> : null}
                </Grid>
                <Grid item style={{ paddingTop: 11 }}>
                  {this.state.fatherWhatsApp &&
                    <Button type='submit' onClick={() => { reset(); this.setState({ fatherWhatsAppOtp: '' }); this.handleOtp('fatherWhatsappNumber') }}
                      color='green'>Resend OTP </Button>}
                </Grid>
                {this.state.isfatherNumberVerifying
                  ? <Grid item style={{ paddingTop: 17 }}>
                    <Timer.Minutes /> :
                    <Timer.Seconds /></Grid> : null}
              </React.Fragment>
            }}
          </Timer>}
        </Grid>

        <Grid container>
          <Grid item>
            <TextField
              required
              id='standard-required'
              label='Father Number'
              className={classes.textField}
              value={this.state.checkedA ? this.state.fatherWhatsApp : this.state.fatherMobile}
              type='number'
              onChange={(e) => { e.target.value.length <= 10 && this.setState({ fatherMobile: e.target.value }) }}
              margin='normal'
              InputLabelProps={{
                shrink: true
              }}

            />

          </Grid>
          <Grid item style={{ paddingTop: 9 }} >
            {((this.state.fatherMobile && this.state.checkedA === false) &&
              <Button type='submit' onClick={() => { this.setState({ fatherMobileotp: '' }); this.handleOtp('fatherNumber') }}

                color='green'>Save</Button>)}
          </Grid>
          {/* <Grid item style={{ paddingTop: 17 }}> */}
          {this.state.showOtp['fatherNumber'] && <Timer
            initialTime={120000}
            direction='backward'
            checkpoints={[
              {
                time: 0,
                callback: () => this.setState({ showOtp: { ...this.state.showOtp, 'fatherNumber': false } })
              }
            ]}
          >

            {({ reset }) => {
              // console.log(timerState)
              return <React.Fragment>
                <Grid item>
                  {this.state.isfatherPhoneNumberVerifying ? this.state.showOtp['fatherNumber'] && <OtpInput
                    onChange={fatherMobileotp => this.setState({ fatherMobileotp })}
                    numInputs={6}
                    value={this.state.fatherMobileotp}
                    inputStyle={{
                      background: 'none',
                      color: '#000',
                      fontSize: 14,
                      padding: '6px 6px 6px 2px',
                      display: 'block',
                      width: 30,
                      margin: 10,
                      borderRadius: 0,
                      border: '1px solid #c6c6c6'
                    }}
                  />
                    : null}
                </Grid>
                <Grid item style={{ paddingTop: 11 }}>
                  {this.state.isfatherPhoneNumberVerifying ? this.state.showOtp['fatherNumber'] && this.state.fatherMobileotp && this.state.fatherMobileotp.length === 6 &&
                    <Button type='submit' onClick={() => this.verifyOtp('fatherNumber')}
                      color='green'>Verify</Button> : null}
                </Grid>
                <Grid item style={{ paddingTop: 11 }}>
                  {this.state.fatherMobile &&
                    <Button type='submit' onClick={() => { reset(); this.setState({ fatherMobileotp: '' }); this.handleOtp('fatherNumber') }}
                      color='green'>Resend OTP </Button>}
                </Grid>
                {this.state.isfatherPhoneNumberVerifying
                  ? <Grid item style={{ paddingTop: 17 }}>
                    <Timer.Minutes /> :
                    <Timer.Seconds /></Grid> : null}
              </React.Fragment>
            }}
          </Timer>}
        </Grid>
        {/* ////////////////////////////////////////Father Email//////////////////////// */}
        <Grid container>
          <Grid item>
            <TextField
              required
              id='standard-required'
              label='Father Email'
              className={classes.textField}
              value={this.state.fatherEmail}
              onChange={(e) => this.setState({ fatherEmail: e.target.value })}
              margin='normal'
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item style={{ paddingTop: 9 }}>
            {this.state.fatherEmail && <Button type='submit' onClick={() => { this.setState({ fatherEmailOtp: '' }); this.handleOtp('fatherEmail') }}
              color='green'>Save</Button>}
          </Grid>

          {this.state.showOtp['fatherEmail'] && <Timer
            initialTime={120000}
            direction='backward'
            checkpoints={[
              {
                time: 0,
                callback: () => this.setState({ showOtp: { ...this.state.showOtp, 'fatherEmail': false } })
              }
            ]}
          >
            {({ reset }) => {
              // console.log(timerState)
              return <React.Fragment>
                <Grid item>
                  {this.state.isfatherEmailVerifying ? this.state.showOtp['fatherEmail'] && <OtpInput
                    onChange={fatherEmailOtp => this.setState({ fatherEmailOtp })}
                    numInputs={6}
                    value={this.state.fatherEmailOtp}
                    inputStyle={{
                      background: 'none',
                      color: '#000',
                      fontSize: 14,
                      padding: '6px 6px 6px 2px',
                      display: 'block',
                      width: 30,
                      margin: 10,
                      borderRadius: 0,
                      border: '1px solid #c6c6c6'
                    }}
                  />
                    : null}
                </Grid>
                <Grid item style={{ paddingTop: 11 }}>
                  {this.state.isfatherEmailVerifying ? this.state.showOtp['fatherEmail'] && this.state.fatherEmailOtp && this.state.fatherEmailOtp.length === 6 &&
                    <Button type='submit' onClick={() => this.verifyOtp('fatherEmail')}
                      color='green'>Verify</Button> : null}
                </Grid>
                <Grid item style={{ paddingTop: 11 }}>
                  {this.state.fatherEmail &&
                    <Button type='submit' onClick={() => { reset(); this.setState({ fatherEmailOtp: '' }); this.handleOtp('fatherEmail') }}
                      color='green'>Resend OTP </Button>}
                </Grid>
                {this.state.isfatherEmailVerifying
                  ? <Grid item style={{ paddingTop: 17 }}>
                    <Timer.Minutes /> :
                    <Timer.Seconds /></Grid> : null}
              </React.Fragment>
            }}
          </Timer>}
        </Grid>

        <Grid container>
          <Grid item>
            <TextField
              required
              id='standard-required'
              label='Mother WhatsApp Number'
              className={classes.textField}
              value={this.state.motherWhatsApp}
              type='number'
              onChange={(e) => { e.target.value.length <= 10 && this.setState({ motherWhatsApp: e.target.value }) }}
              margin='normal'
              InputLabelProps={{
                shrink: true
              }}
            />
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.checkedB}
                    onChange={this.handleChange('checkedB')}
                    value='checkedB'
                    inputProps={{
                      'aria-label': 'primary checkbox'
                    }}
                  />
                }
                label='Use WhatsApp Number as Phone Number'
              />
            </div>
          </Grid>
          <Grid item style={{ paddingTop: 9 }}>
            {this.state.motherWhatsApp &&
              <Button type='submit' onClick={() => { this.setState({ motherWhatsAppOtp: '' }); this.handleOtp('motherWhatsappNumber') }}
                color='green'>Save</Button>}
          </Grid>

          {this.state.showOtp['motherWhatsappNumber'] && <Timer
            initialTime={120000}
            direction='backward'
            checkpoints={[
              {
                time: 0,
                callback: () => this.setState({ showOtp: { ...this.state.showOtp, 'motherWhatsappNumber': false } })
              }
            ]}
          >
            {({ reset }) => {
              // console.log(timerState)
              return <React.Fragment>
                <Grid item>
                  {this.state.ismotherWhatsappVerifying ? this.state.showOtp['motherWhatsappNumber'] && <OtpInput
                    onChange={motherWhatsAppOtp => this.setState({ motherWhatsAppOtp })}
                    numInputs={6}
                    value={this.state.motherWhatsAppOtp}
                    inputStyle={{
                      background: 'none',
                      color: '#000',
                      fontSize: 14,
                      padding: '6px 6px 6px 2px',
                      display: 'block',
                      width: 30,
                      margin: 10,
                      borderRadius: 0,
                      border: '1px solid #c6c6c6'
                    }}
                  />
                    : null}
                </Grid>
                <Grid item style={{ paddingTop: 11 }}>
                  {this.state.ismotherWhatsappVerifying ? this.state.showOtp['motherWhatsappNumber'] && this.state.motherWhatsAppOtp && this.state.motherWhatsAppOtp.length === 6 &&
                    <Button type='submit' onClick={() => this.verifyOtp('motherWhatsappNumber')}
                      color='green'>Verify</Button> : null}
                </Grid>
                <Grid item style={{ paddingTop: 11 }}>
                  {this.state.motherWhatsApp &&
                    <Button type='submit' onClick={() => { reset(); this.setState({ motherWhatsAppOtp: '' }); this.handleOtp('motherWhatsappNumber') }}
                      color='green'>Resend OTP </Button>}
                </Grid>
                {this.state.ismotherWhatsappVerifying
                  ? <Grid item style={{ paddingTop: 17 }}>
                    <Timer.Minutes /> :
                    <Timer.Seconds /></Grid> : null}
              </React.Fragment>
            }}
          </Timer>}
        </Grid>

        <Grid container>
          <Grid item>
            <TextField
              required
              id='standard-required'
              label='Mother Number'
              className={classes.textField}
              value={this.state.checkedB ? this.state.motherWhatsApp : this.state.motherMobile}
              type='number'
              onChange={(e) => { e.target.value.length <= 10 && this.setState({ motherMobile: e.target.value }) }}
              margin='normal'
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item style={{ paddingTop: 9 }}>

            {((this.state.motherMobile && this.state.checkedB === false) &&
              <Button type='submit' onClick={() => { this.setState({ motherMobileOtp: '' }); this.handleOtp('motherNumber') }}
                color='green'>Save</Button>)}
          </Grid>
          {this.state.showOtp['motherNumber'] && <Timer
            initialTime={120000}
            direction='backward'
            checkpoints={[
              {
                time: 0,
                callback: () => this.setState({ showOtp: { ...this.state.showOtp, 'motherNumber': false } })
              }
            ]}
          >

            {({ reset }) => {
              // console.log(timerState)
              return <React.Fragment>
                <Grid item>
                  {this.state.ismotherPhoneNumberVerifying ? this.state.showOtp['motherNumber'] && <OtpInput
                    onChange={motherMobileOtp => this.setState({ motherMobileOtp })}
                    numInputs={6}
                    value={this.state.motherMobileOtp}
                    inputStyle={{
                      background: 'none',
                      color: '#000',
                      fontSize: 14,
                      padding: '6px 6px 6px 2px',
                      display: 'block',
                      width: 30,
                      margin: 10,
                      borderRadius: 0,
                      border: '1px solid #c6c6c6'
                    }}
                  />
                    : null}
                </Grid>
                <Grid item style={{ paddingTop: 11 }}>
                  {this.state.ismotherPhoneNumberVerifying ? this.state.showOtp['motherNumber'] && this.state.motherMobileOtp && this.state.motherMobileOtp.length === 6 &&
                    <Button type='submit' onClick={() => this.verifyOtp('motherNumber')}
                      color='green'>Verify</Button> : null}
                </Grid>
                <Grid item style={{ paddingTop: 11 }}>
                  {this.state.motherMobile &&
                    <Button type='submit' onClick={() => { reset(); this.setState({ motherMobileOtp: '' }); this.handleOtp('motherNumber') }}
                      color='green'>Resend OTP </Button>}
                </Grid>
                {this.state.ismotherPhoneNumberVerifying
                  ? <Grid item style={{ paddingTop: 17 }}>
                    <Timer.Minutes /> :
                    <Timer.Seconds /></Grid> : null}
              </React.Fragment>
            }}
          </Timer>}
        </Grid>

        <Grid container>
          <Grid item>
            <TextField
              required
              id='standard-required'
              label='Mother Email'
              className={classes.textField}
              value={this.state.motherEmail}
              onChange={(e) => this.setState({ motherEmail: e.target.value })}
              margin='normal'
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item style={{ paddingTop: 9 }} >
            {this.state.motherEmail &&
              <Button type='submit' onClick={() => { this.setState({ motherEmailOtp: '' }); this.handleOtp('motherEmail') }}
                color='green'>Save</Button>}
          </Grid>

          {this.state.showOtp['motherEmail'] && <Timer
            initialTime={120000}
            direction='backward'
            checkpoints={[
              {
                time: 0,
                callback: () => this.setState({ showOtp: { ...this.state.showOtp, 'motherEmail': false } })
              }
            ]}
          >

            {({ reset }) => {
              // console.log(timerState)
              return <React.Fragment>
                <Grid item>
                  {this.state.ismotherEmailVerifying ? this.state.showOtp['motherEmail'] && <OtpInput
                    onChange={motherEmailOtp => this.setState({ motherEmailOtp })}
                    numInputs={6}
                    value={this.state.motherEmailOtp}
                    inputStyle={{
                      background: 'none',
                      color: '#000',
                      fontSize: 14,
                      padding: '6px 6px 6px 2px',
                      display: 'block',
                      width: 30,
                      margin: 10,
                      borderRadius: 0,
                      border: '1px solid #c6c6c6'
                    }}
                  />
                    : null}
                </Grid>
                <Grid item style={{ paddingTop: 11 }}>
                  {this.state.ismotherEmailVerifying ? this.state.showOtp['motherEmail'] && this.state.motherEmailOtp && this.state.motherEmailOtp.length === 6 &&
                    <Button type='submit' onClick={() => this.verifyOtp('motherEmail')}
                      color='green'>Verify</Button> : null}
                </Grid>
                <Grid item style={{ paddingTop: 11 }}>
                  {this.state.motherEmail &&
                    <Button type='submit' onClick={() => { reset(); this.setState({ motherEmailOtp: '' }); this.handleOtp('motherEmail') }}
                      color='green'>Resend OTP </Button>}
                </Grid>
                {this.state.ismotherEmailVerifying
                  ? <Grid item style={{ paddingTop: 17 }}>
                    <Timer.Minutes /> :
                    <Timer.Seconds /></Grid> : null}
              </React.Fragment>
            }}
          </Timer>}
        </Grid>

        <Grid container>
          <Grid item>
            <TextField
              required
              id='standard-required'
              label='Guardian Email'
              className={classes.textField}
              value={this.state.guardianEmail}
              onChange={(e) => this.setState({ guardianEmail: e.target.value })}
              margin='normal'
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item style={{ paddingTop: 9 }} >
            {this.state.guardianEmail &&
              <Button type='submit' onClick={() => { this.setState({ guardianEmailOtp: '' }); this.handleOtp('guardianEmail') }}
                color='green'>Save</Button>}
          </Grid>

          {this.state.showOtp['guardianEmail'] && <Timer
            initialTime={120000}
            direction='backward'
            checkpoints={[
              {
                time: 0,
                callback: () => this.setState({ showOtp: { ...this.state.showOtp, 'guardianEmail': false } })
              }
            ]}
          >
            {({ reset }) => {
              // console.log(timerState)
              return <React.Fragment>
                <Grid item>
                  {this.state.isguardianEmailVerifying ? this.state.showOtp['guardianEmail'] && <OtpInput
                    onChange={guardianEmailOtp => this.setState({ guardianEmailOtp })}
                    numInputs={6}
                    value={this.state.guardianEmailOtp}
                    inputStyle={{
                      background: 'none',
                      color: '#000',
                      fontSize: 14,
                      padding: '6px 6px 6px 2px',
                      display: 'block',
                      width: 30,
                      margin: 10,
                      borderRadius: 0,
                      border: '1px solid #c6c6c6'
                    }}
                  />
                    : null}

                </Grid>
                <Grid item style={{ paddingTop: 11 }}>
                  {this.state.isguardianEmailVerifying ? this.state.showOtp['guardianEmail'] && this.state.guardianEmailOtp && this.state.guardianEmailOtp.length === 6 &&
                    <Button type='submit' onClick={() => this.verifyOtp('guardianEmail')}
                      color='green'>Verify</Button> : null}
                </Grid>
                <Grid item style={{ paddingTop: 11 }}>
                  {this.state.guardianEmail &&
                    <Button type='submit' onClick={() => { reset(); this.setState({ guardianEmailOtp: '' }); this.handleOtp('guardianEmail') }}
                      color='green'>Resend OTP </Button>}
                </Grid>
                {this.state.isguardianEmailVerifying
                  ? <Grid item style={{ paddingTop: 17 }}>
                    <Timer.Minutes /> :
                    <Timer.Seconds /></Grid> : null}
              </React.Fragment>
            }}
          </Timer>}
        </Grid>

        <Grid container>
          <Grid item>
            <TextField
              required
              id='standard-required'
              label='Guardian Number'
              className={classes.textField}
              value={this.state.guardianMobile}
              type='number'
              onChange={(e) => { e.target.value.length <= 10 && this.setState({ guardianMobile: e.target.value }) }}
              margin='normal'
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item style={{ paddingTop: 9 }} >
            {this.state.guardianMobile &&
              <Button type='submit' onClick={() => { this.setState({ guardianMobileOtp: '' }); this.handleOtp('guardianNumber') }}
                color='green'>Save</Button>}
          </Grid>

          {this.state.showOtp['guardianNumber'] && <Timer
            initialTime={120000}
            direction='backward'
            checkpoints={[
              {
                time: 0,
                callback: () => this.setState({ showOtp: { ...this.state.showOtp, 'guardianNumber': false } })
              }
            ]}
          >

            {({ reset }) => {
              // console.log(timerState)
              return <React.Fragment>
                <Grid item>
                  {this.state.isguardianNumberVerifying ? this.state.showOtp['guardianNumber'] && <OtpInput
                    onChange={guardianMobileOtp => this.setState({ guardianMobileOtp })}
                    numInputs={6}
                    value={this.state.guardianMobileOtp}
                    inputStyle={{
                      background: 'none',
                      color: '#000',
                      fontSize: 14,
                      padding: '6px 6px 6px 2px',
                      display: 'block',
                      width: 30,
                      margin: 10,
                      borderRadius: 0,
                      border: '1px solid #c6c6c6'
                    }}
                  />
                    : null}

                </Grid>
                <Grid item style={{ paddingTop: 11 }}>
                  {this.state.isguardianNumberVerifying ? this.state.showOtp['guardianNumber'] && this.state.guardianMobileOtp && this.state.guardianMobileOtp.length === 6 &&
                    <Button type='submit' onClick={() => this.verifyOtp('guardianNumber')}
                      color='green'>Verify</Button> : null}
                </Grid>
                <Grid item style={{ paddingTop: 11 }}>
                  {this.state.guardianMobile &&
                    <Button type='submit' onClick={() => { reset(); this.setState({ guardianMobileOtp: '' }); this.handleOtp('guardianNumber') }}
                      color='green'>Resend OTP </Button>}
                </Grid>
                {this.state.isguardianNumberVerifying
                  ? <Grid item style={{ paddingTop: 17 }}>
                    <Timer.Minutes /> :
                    <Timer.Seconds /></Grid> : null}
              </React.Fragment>
            }}
          </Timer>}
          <Grid container>
            <Grid item style={{ width: '30%', margin: 10 }}>
              <OmsSelect
                label='Point of Contact'
                placeholder='Point of Contact'
                name='point of contact'
                defaultValue={this.state.pointOfContact}
                options={
                  this.state.pointOfContactChoices
                    ? this.state.pointOfContactChoices.map(poc => ({
                      value: poc.id,
                      label: poc.choice
                    }))
                    : []
                } change={(e) => this.updatePointOfContact(e)}
              />
            </Grid>
          </Grid>
        </Grid>

      </React.Fragment>

    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user

})

export default connect(
  mapStateToProps,
  null
)(withRouter(withStyles(styles)(StudentContactNumber)))
