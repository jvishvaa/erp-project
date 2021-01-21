import React from 'react'
import axios from 'axios'
import { Button, Typography, Paper, Grid } from '@material-ui/core'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import CssBaseline from '@material-ui/core/CssBaseline'
import Radio from '@material-ui/core/Radio'
// import List from '@material-ui/core/List'
import { Redirect } from 'react-router'
import TextField from '@material-ui/core/TextField'
import Timer from 'react-compound-timer'
import withStyles from '@material-ui/core/styles/withStyles'
import OtpInput from 'react-otp-input'
import { connect } from 'react-redux'
import { qBUrls } from '../urls'
import { userActions } from '../_actions'

const styles = theme => ({
  main: {
    width: '100',
    display: 'block',
    padding: '10px',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    height: '100vh',
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  },
  div: {
    width: '100',
    display: 'flex'
  },
  form: {
    width: '100%',
    margin: 'auto',
    maxWidth: '500px',
    marginTop: theme.spacing.unit,
    padding: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
})
export class Reset extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      number: '',
      // showTimer: ,
      otp: '',
      resend_otp: false,
      otp_sent: false,
      showTimer: false,
      indexes: 0,
      onSaveloading: false,
      onVerifyloading: false,
      Verified: false,
      redirect: false,
      resdata: []
    }
    this.handleSave = this.handleSave.bind(this)
  }

  handleEmail = (e) => {
    console.log(e.target.value)
    this.setState({
      selectedValue: e.target.value,
      indexes: 1,
      otp_sent: false,
      showTimer: false,
      Format: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      number: '',
      resend_otp: false

    })
  }

  handleNumber = (e) => {
    console.log(e.target.value)
    this.setState({
      selectedValue: e.target.value,
      indexes: 0,
      otp_sent: false,
      showTimer: false,
      Format: /^(\+\d{1,3}[- ]?)?\d{10}$/,
      email: '',
      resend_otp: false
    })
  }

 handleSave = (e) => {
   const { email, number } = this.state
   const formData = new FormData()

   if (this.state.selectedValue === 'email') {
     formData.append('email', email)
   } else {
     formData.append('phone_number', number)
   }
   this.setState({ onSaveloading: true, showTimer: false })
   axios.post(qBUrls.SendOtp, formData, {
   })

     .then(res => {
       console.log(JSON.stringify(res.data.status))
       this.props.alert.success(res.data.status)
       this.setState({ resend_otp: true, otp_sent: true, showTimer: true, onSaveloading: false, disabletextField: true })
     })
     .catch(error => {
       console.log(JSON.stringify(error), error)
       let { response: { data: { status } = {} } = {}, message } = error
       if (!status && message) {
         this.props.alert.error(JSON.stringify(message))
       } else {
         this.props.alert.error(JSON.stringify(status))
       }
       this.setState({ onSaveloading: false })
     })
 }

 handleVerify = (e) => {
   const { email, number, otp } = this.state
   const formData = new FormData()

   if (this.state.selectedValue === 'email') {
     formData.append('email', email)
   } else {
     formData.append('phone_number', number)
   }
   formData.append('otp', otp)
   this.setState({ onVerifyloading: true })
   axios.post(qBUrls.VerifyOtp, formData, {
   })

     .then(res => {
       this.props.alert.success('otp verified successfully')
       console.log(res.data)
       //  this.props.history.push('/reset_password')
       //  window.open(`${window.location.origin}/reset_password/${res.data}`, '_self')
       this.setState({ resdata: res.data, redirect: true, resend_otp: false, otp_sent: false, otp: '', showTimer: false, onVerifyloading: false, Verified: true })
     })
     .catch(error => {
       console.log(error.response.data)
       this.props.alert.error(error.response.data.status)
       this.setState({ onVerifyloading: false })
     })
 }
 handleOtpChange =(e) => {
   this.setState({ otp: e })
 }

 handleTextfield=(e) => {
   let { selectedValue } = this.state
   if (selectedValue === 'email') {
     this.setState({ email: e.target.value })
   } else {
     this.setState({ number: e.target.value })
   }
 }
 renderTextField () {
   let{ email, number, indexes, Format, disabletextField } = this.state
   let { classes } = this.props
   let mobileFormat = /^(\+\d{1,3}[- ]?)?\d{10}$/
   let mailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

   const formdataArray = [{ label: 'Enter Your Phone Number', type: 'number', autoComplete: 'number', value: number, name: 'number', format: mobileFormat }, { label: 'Enter Your Email', type: 'email', autoComplete: 'email', value: email, name: 'email', format: mailFormat }]

   return (
     formdataArray.map((val, index) => {
       if (index === indexes) {
         return (
           <TextField
             required fullWidth
             id='standard-required'
             label={val.label}
             onChange={this.handleTextfield}
             className={classes.textField}
             value={val.value || ''}
             type={val.type}
             name={val.name}
             autoComplete={val.autoComplete}
             disabled={disabletextField}
             margin='normal'
             error={!val.value.match(Format)}
             helperText={!val.value.match(Format) ? (val.name === 'number' ? 'Please enter a 10 digit phone number' : 'Please enter a valid email address ') : ''}
           />)
       }
     })
   )
 }

 render () {
   console.log(this.state.otp, this.state.otp.length, 'otpppp')
   const { classes } = this.props
   let { onSaveloading, onVerifyloading } = this.state
   return <div className={classes.main}>
     <Paper className={classes.paper}>
       <form className={classes.form}>
         <CssBaseline />
         <img alt='' src={require('./logo.png')} width='250px' />

         <Typography component='h1' variant='h5'>
            Reset Password
         </Typography>
         <FormControlLabel
           control={
             <Radio
               checked={this.state.selectedValue === 'Number'}
               onChange={this.handleNumber}
               value='Number'
               name='Number'

               aria-label='number'
             />
           }
           label='Number'
         />
         <FormControlLabel
           control={
             <Radio
               checked={this.state.selectedValue === 'email'}
               onChange={this.handleEmail}
               value='email'
               name='Email'

               aria-label='email'
             />
           }
           label='Email'
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
               numInputs={6}
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
             disabled={onSaveloading}
           >
             {this.state.resend_otp ? (onSaveloading ? 'RESENDING OTP...' : 'RESEND OTP') : (onSaveloading ? 'Confirming' + ' ' + this.state.selectedValue + '....' : 'Confirm' + ' ' + this.state.selectedValue)}

           </Button></Grid>
           {this.state.otp.length === 6 ? <Grid item> <Button
             onClick={this.handleVerify}
             variant='contained'
             color='primary'
             disabled={onVerifyloading}
           >
             { onVerifyloading ? 'VERIFYING...' : 'VERIFY' }

           </Button></Grid> : ''}
           {this.state.redirect ? <Redirect to={{ pathname: '/reset_password', state: { data: this.state.resdata } }} /> : ''}
         </Grid>}

       </form>
     </Paper>
   </div>
 }
}
const mapDispatchToProps = dispatch => ({
  reset_password: (password, confirmPassword) => dispatch(userActions.login(password, confirmPassword))
})
const mapStateToProps = state => ({
  loggingIn: state.authentication.loggingIn,
  error: state.authentication.error
})
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Reset))
