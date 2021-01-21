import React from 'react'
import axios from 'axios'
import { Button, Typography, Paper, Grid, Modal } from '@material-ui/core'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import CssBaseline from '@material-ui/core/CssBaseline'
import Radio from '@material-ui/core/Radio'
// import List from '@material-ui/core/List'
import TextField from '@material-ui/core/TextField'
import Timer from 'react-compound-timer'
import withStyles from '@material-ui/core/styles/withStyles'
import OtpInput from 'react-otp-input'
import { Redirect } from 'react-router'
// import Backdrop from '@material-ui/core/Backdrop'
// import Fade from '@material-ui/core/Fade'
import { connect } from 'react-redux'
import { urls } from '../urls'
import { userActions } from '../_actions'

const styles = theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
export class ParentContactInfoUpdation extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      number: '',
      otp: '',
      resend_otp: false,
      otp_sent: false,
      showTimer: false,
      onSaveloading: false,
      onVerifyloading: false,
      Verified: false,
      studentId: '',
      open: false,
      active: true
    }
    this.handleSave = this.handleSave.bind(this)
  }
  classes = styles()
  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }
  handleParent = (value) => {
    if (value === 'Father Number') {
      this.setState({ choice: true })
    } else { this.setState({ choice: false }) }
    this.setState({
      selectedValue: value,
      otp_sent: false,
      showTimer: false,
      Format: /^(\+\d{1,3}[- ]?)?\d{10}$/,
      resend_otp: false,
      textDisabled: false,
      active: true,
      number: ''
    })
  }

  handleSave = (e) => {
    const userProfile = JSON.parse(localStorage.getItem('user_profile'))
    const { student_id: studentId } = userProfile
    console.log(userProfile, 'iddd')
    const { number } = this.state
    let payLoad = JSON.stringify({ number, s_id: studentId })
    this.setState({ onSaveloading: true, showTimer: false })
    // eslint-disable-next-line no-debugger
    debugger
    axios.post(urls.ParentOtpSend, payLoad, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.user
      }
    })
      .then(res => {
        console.log(JSON.stringify(res.data.status))
        this.props.alert.success(res.data.status)
        this.setState({ resend_otp: true, otp_sent: true, showTimer: true, onSaveloading: false, textDisabled: true })
      })
      .catch(error => {
        console.log(JSON.stringify(error), error)
        let { response: { data: { status } = {} } = {}, message } = error
        if (!status && message) {
          this.props.alert.error(JSON.stringify(message))
        } else if (status && !message) {
          this.props.alert.error(JSON.stringify(status))
        }
        this.setState({ resend_otp: true, onSaveloading: false })
      })
  }

  // activate = () => {
  //   this.setState({ active: true })
  // }
  handleVerify = (e) => {
    let userProfileObj = JSON.parse(localStorage.getItem('user_profile'))
    const { otp, choice } = this.state
    let payLoad = JSON.stringify({ otp, choice })
    this.setState({ onVerifyloading: true })
    axios.post(urls.ParentOtpVerify, payLoad, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.user
      }
    })
      .then(res => {
        // eslint-disable-next-line no-debugger
        debugger
        this.props.alert.success(res.data.result)

        console.log(res.data)
        userProfileObj.parent_contact = true
        localStorage.setItem('user_profile', JSON.stringify(userProfileObj))
        // eslint-disable-next-line no-debugger
        debugger
        this.setState({ redirect: true, resend_otp: false, otp_sent: false, otp: '', showTimer: false, onVerifyloading: false, Verified: true })
      })

      .catch(error => {
        console.log(JSON.stringify(error), error, error.response)
        let { response: { data: { result } = {} } = {}, message } = error
        if (!result && message) {
          this.props.alert.error(JSON.stringify(message))
        } else {
          this.props.alert.error(JSON.stringify(result))
        }
        this.setState({ onVerifyloading: false })
      })
  }
 handleOtpChange =(e) => {
   this.setState({ otp: e })
 }

 handleTextfield=(e) => {
   this.setState({ number: e.target.value })
   if (e.target.value.length === 10) {
     this.setState({ active: false })
   }
 }
 renderTextField () {
   let{ number, selectedValue } = this.state
   let { classes } = this.props
   let mobileFormat = /^(\+\d{1,3}[- ]?)?\d{10}$/
   const formdataArray = [
     {
       label: `Enter ${selectedValue}`,
       type: 'number',
       autoComplete: 'number',
       value: number,
       name: 'number',
       format: mobileFormat
     }
   ]

   return (
     formdataArray.map((val, index) => {
       return (
         <TextField
           required fullWidth
           id='standard-required'
           label={val.label}
           onChange={this.handleTextfield}
           className={classes.textField}
           value={number}
           type={val.type}
           name={val.name}
           disabled={this.state.textDisabled}
           autoComplete={val.autoComplete}
           margin='normal'
           error={!val.value.match(val.format)}
           helperText={!val.value.match(val.format) ? 'Please enter a 10 digit phone number' : ''}
         />)
     })
   )
 }

 render () {
   console.log(this.state.otp, this.state.otp.length, 'otpppp')
   const { classes } = this.props
   let { onSaveloading, onVerifyloading } = this.state
   console.log(this.state.number.length, 'numberrr')
   return <div className={classes.main}>
     <Modal
       aria-labelledby='transition-modal-title'
       aria-describedby='transition-modal-description'
       className={classes.modal}
       open={!this.props.show}
     >
       <Paper
         className={classes.paper}>
         <div
           style={
             {
               margin: 30
             }
           }
         >

           <form
             className={classes.form}>
             <CssBaseline />
             <Typography component='h1' variant='h5'>
            Enter Parent Mobile Number
             </Typography>
             <FormControlLabel
               control={
                 <Radio
                   checked={this.state.selectedValue === 'Father Number'}
                   onChange={() => this.handleParent('Father Number')}
                   value='Father Number'
                   name='Father Number'
                   aria-label='number'
                 />
               }
               label='Father Number'
             />
             <FormControlLabel
               control={
                 <Radio
                   checked={this.state.selectedValue === 'Mother Number'}
                   onChange={() => this.handleParent('Mother Number')}
                   value='Mother Number'
                   name='Mother Number'
                   aria-label='number'
                 />
               }
               label='Mother Number'
             />
             <Grid> {this.state.selectedValue && this.renderTextField()}</Grid>
             <Grid container>
               <Grid item>
                 {this.state.otp_sent && <OtpInput
                   inputStyle={{
                     width: '2rem',
                     height: '2rem',
                     margin: '30px 10px 30px 0px',
                     fontSize: '2rem',
                     borderRadius: 3,
                     border: '1px solid rgba(0,0,0,0.3)'
                   }}
                   value={this.state.otp}
                   onChange={this.handleOtpChange}
                   numInputs={5}
                   separator={<span><b>-</b></span>}
                   shouldAutoFocus
                 />
                 }
               </Grid> <Grid item>

                 {this.state.showTimer && <Timer
                   initialTime={120000}
                   direction='backward'
                   checkpoints={[
                     {
                       time: 0,
                       callback: () => this.setState({ showTimer: false })

                     }
                   ]}
                 >
                   <Grid item style={{ paddingTop: 30, fontSize: '20px' }}>
                     <Timer.Minutes /> :
                     <Timer.Seconds /></Grid>
                 </Timer>
                 }</Grid></Grid>
             <br />

             {this.state.selectedValue && <Grid container spacing={4}>
               <Grid item> <Button
                 type='button'
                 onClick={this.handleSave}
                 variant='contained'
                 color='primary'
                 disabled={this.state.active}
               >
                 {this.state.resend_otp ? (onSaveloading ? 'RESENDING OTP...' : 'RESEND OTP') : (onSaveloading ? 'Confirming' + ' ' + this.state.selectedValue + '....' : 'Confirm' + ' ' + this.state.selectedValue)}

               </Button></Grid>
               {this.state.otp.length === 5 ? <Grid item> <Button
                 onClick={this.handleVerify}
                 variant='contained'
                 color='primary'
                 disabled={onVerifyloading}
               >
                 { onVerifyloading ? 'VERIFYING...' : 'VERIFY' }

               </Button></Grid> : ''}
               {this.state.redirect ? <Redirect to={{ pathname: '/dashboard' }} /> : '' }</Grid>}

           </form>
         </div>
       </Paper>
     </Modal>
   </div>
 }
}
const mapDispatchToProps = dispatch => ({
  reset_password: (password, confirmPassword) => dispatch(userActions.login(password, confirmPassword))
})
const mapStateToProps = state => ({
  loggingIn: state.authentication.loggingIn,
  user: state.authentication.user,
  error: state.authentication.error
})
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ParentContactInfoUpdation))
