import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import axios from 'axios'
import DialogTitle from '@material-ui/core/DialogTitle'
import GroupAddIcon from '@material-ui/icons/GroupAdd'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, InputLabel, Select, MenuItem
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { urls } from '../../urls'

import cityList from './cityList'

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 225
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  outlined: {
    zIndex: 0
  },
  paper: {
    position: 'absolute',
    width: '350px',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #fff',
    boxShadow: theme.shadows[5],
    padding: '10px 20px',
    borderRadius: '10px',
    outlineColor: 'transparent'
    // padding: theme.spacing(2, 4, 3)
  }
}))

function AddGuestChild (props) {
  console.log(props, 'po')

  const [userName, setUserName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState([])
  // const [email1, setEmail1] = useState('')
  const [mobile, setMobile] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('1998-01-10')
  const [gender, setGender] = useState('male')
  const [city, setCity] = useState('')
  const [cityName, setCityName] = useState('')
  const [school, setSchool] = useState('')
  // const [address, setAddress] = useState('')
  const [pinCode, setPinCode] = useState('')
  const [grades, setGrades] = useState([])
  const [selectedGrade, setSelectedGrade] = useState('')
  const [guestStudent, setGusetStudents] = useState([])

  const userProfile = JSON.parse(localStorage.getItem('user_profile'))
  const userId = userProfile.personal_info.user_id
  const token = userProfile.personal_info.token

  const [fields] = useState([{ value: null }])

  const [open, setOpen] = useState(false)
  const classes = useStyles()

  useEffect(() => {
    fetchGrades()
  }, [])

  const userNameHandler = (event) => {
    setUserName(event.target.value)
  }

  const firstNameHandler = (event) => {
    setFirstName(event.target.value)
  }

  const emailHandler = (event) => {
    setEmail(event.target.value)
  }

  const mobileHandler = (event) => {
    setMobile(event.target.value)
  }

  const dobHandler = (event) => {
    setDateOfBirth(event.target.value)
  }

  const genderHandler = (event) => {
    setGender(event.target.value)
  }
  const passwordHandler = (event) => {
    setPassword(event.target.value)
    setConfirmPassword('')
  }
  const confirmPasswordHandler = (event) => {
    setConfirmPassword(event.target.value)
  }

  const pinCodeHandler = (event) => {
    setPinCode(event.target.value)
  }
  const gradeChangeHandler = (event) => {
    setSelectedGrade(event.target.value)
  }

  const cityHandler = (event, value) => {
    console.log('Event: ', event)
    console.log('Value: ', value)
    setCity(value && value.City ? value.City : '')
  }

  const cityNameHandler = (event) => {
    setCityName(event.target.value)
  }

  const schoolHandler = (event) => {
    setSchool(event.target.value)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const handleSubmit = () => {
    console.log(props.alert, 'alert')

    if (!userName || !password || !gender || !firstName || !mobile || !dateOfBirth || !selectedGrade || !city || !pinCode) {
      props.alert.warning('Please enter required fields')
      return
    }
    if (pinCode.length !== 6) {
      props.alert.warning('Enter valid pin code!')
      return
    }
    if (password !== confirmPassword) {
      props.alert.warning('Password Dont Match')
      return
    }
    if (mobile.length !== 10) {
      props.alert.warning('Invaild Mobile Number')
      return
    }
    let data = {
      username: userName,
      name: firstName,
      email_address: email,
      password: confirmPassword,
      phone_number: mobile,
      pincode: pinCode,
      date_of_birth: dateOfBirth,
      gender: gender,
      grade_id: selectedGrade,
      city: city === 'Not Listed' ? cityName : city,
      school: school,
      source: 'aol'

    }
    if (userName && email && firstName && selectedGrade && mobile && confirmPassword && dateOfBirth && gender) {
      axios
        .post(urls.GuestStudentRegister, data, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
        .then(res => {
          if (res.status === 200) {
            props.alert.success(' Successfully ')
          } else {
            props.alert.warning('Error Occured')
          }
          // setLoading(false)
        })
        .catch(error => {
          if (error.response && error.response.status === 409) {
            let a = error.response.data
            if (a) {
              props.alert.warning(a.status)
            }
          }
          if (error.response && error.response.status === 500) {
            props.alert.warning('Error Occured')
          }
        })
    }
  }
  const fetchGrades = () => {
    axios
      .get(urls.GRADE, {

      }).then(response => {
        let removeGrades = [1, 17, 18, 21, 16, 26, 27, 25, 24, 35, 29, 28, 30, 42, 60, 61, 58, 59, 45, 51, 53, 43, 47, 48, 46, 52, 54, 50, 44, 49]
        const newSetGrade = response.data.filter((grade) => !removeGrades.includes(grade.id))
        setGrades(newSetGrade)
      }).catch(error => {
        console.error(error)
      })
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getGuestStudents = () => {
    console.log(token)
    // setLoadingFiles(true)
    // 60 52
    axios.get(`${urls.GetGuestStudents}?user_id=${userId}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        setGusetStudents(res.data)
        setMobile(res.data.phone_number)
        console.log(mobile, guestStudent,
          'oo')
        setEmail(res.data.user.email)
        console.log(selectedGrade, res.data.grade.grade, 'grade')
      })
      .catch(err => {
        console.log(err)
      })
  }
  useEffect(() => {
    getGuestStudents()
    console.log(selectedGrade, 'grade')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <React.Fragment>
      <div>
        <IconButton onClick={handleClickOpen} style={{ color: 'white', marginRight: 16, fontSize: '10px' }} >
          <GroupAddIcon />  ADD CHILD
        </IconButton>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title'>User Registration</DialogTitle>
          <DialogContent>
            {fields.map((field, idx) => {
              return (
                <div key={`${field}-${idx}`}>

                  <div className={classes.formControl}>
                    <TextField variant='outlined' style={{ width: 225 }} error={userName && userName.length <= 5} helperText={userName && userName.length <= 5 ? 'More than 5 characters.' : ''} type='text' name='userName' value={userName} label='Username*'onChange={userNameHandler} />
                  </div>
                  <div className={classes.formControl}>
                    <TextField variant='outlined' style={{ width: 225 }} type='text' name='firstName' value={firstName} label='Full Name*'onChange={firstNameHandler} />
                  </div>
                  <div className={classes.formControl}>
                    <TextField variant='outlined' style={{ width: 225 }} type='text' name='email' label='Email*' value={email} onChange={emailHandler} />
                  </div>
                  <div className={classes.formControl}>
                    <TextField variant='outlined' style={{ width: 225 }} error={mobile && mobile.length !== 10} helperText={mobile && mobile.length !== 10 ? '10 Digits only' : ''} type='number' name='mobile' label='Mobile Number*' value={mobile} onChange={mobileHandler} />
                    {/* {mobile.length <= 11 ? <p style={{ color: 'red', fontSize: 10 }}>Username should be more than 5 characters</p> : <p style={{ color: 'green', fontSize: 10 }}>Valid Username</p>} */}
                  </div>
                  <div className={classes.formControl}>
                    <TextField variant='outlined' type='date' name='date' label='Child`s Date of Birth' style={{ width: 225 }} value={dateOfBirth} onChange={dobHandler} />
                  </div>
                  <div className={classes.formControl}>
                    <FormControl component='fieldset' className={classes.formControl} margin='normal' fullWidth>
                      <FormLabel component='legend'>Gender*</FormLabel>
                      <RadioGroup
                        aria-label='gender'
                        name='gender1'
                        // className={classes.group}
                        value={gender}
                        onChange={genderHandler}
                        // style={{ display: 'flex' }}
                      >
                        <FormControlLabel value='male' control={<Radio />} label='Male' />
                        <FormControlLabel value='female' control={<Radio />} label='Female' />
                        <FormControlLabel value='other' control={<Radio />} label='Other' />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <div className={classes.formControl}>
                    <TextField variant='outlined' style={{ width: 225 }} error={password && password.length < 7} helperText={password && password.length < 7 ? 'Min 6 characters' : ''} type='password' name='password' value={password} label='Password*' onChange={passwordHandler} />
                  </div>
                  <div className={classes.formControl}>
                    <TextField variant='outlined' style={{ width: 225 }} error={password !== confirmPassword} helperText={confirmPassword && password !== confirmPassword ? 'Password Didnt Match' : ''} type='password' name='confirmPassword' value={confirmPassword} label='Confirm Password*' onChange={confirmPasswordHandler} />
                  </div>
                  <div className={classes.formControl}>
                    <Autocomplete
                      id='city'
                      options={cityList}
                      onChange={cityHandler}
                      // value={city}
                      getOptionLabel={(option) => option.City}
                      renderInput={(params) => <TextField {...params} label='City*' value={city} variant='outlined' />}
                    />
                  </div>
                  {city === 'Not Listed'
                    ? <div className={classes.formControl}>
                      <TextField variant='outlined' style={{ width: 225 }} type='text' name='CityName' label='Enter City Name*' value={cityName} onChange={cityNameHandler} />
                    </div>
                    : ''}
                  <div className={classes.formControl}>
                    <TextField variant='outlined' style={{ width: 225 }} type='text' name='school' label='Child`s School' value={school} onChange={schoolHandler} />
                  </div>
                  <div className={classes.formControl}>
                    <TextField variant='outlined' style={{ width: 225 }} type='number' name='pincode' value={pinCode} label='Pin Code*' onChange={pinCodeHandler} />
                  </div>
                  <div className={classes.margin}>
                    <FormControl margin='normal' variant='outlined' className={classes.formControl}>
                      <InputLabel>Grade*</InputLabel>
                      <Select
                        // placeholder='Grade*'
                        label='Grade*'
                        // labelId='label'
                        value={selectedGrade}
                        onChange={gradeChangeHandler}
                      >
                        {grades.length ? grades.map((grade) => {
                          return (<MenuItem value={grade.id}>{grade.grade}</MenuItem>)
                        }) : []}
                      </Select>
                    </FormControl>
                  </div>

                </div>
              )
            })}
          </DialogContent>
          <DialogActions>
            <Button color='primary' onClick={handleSubmit}>
                    Save
            </Button>
            <Button onClick={handleClose} color='primary'>
          Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </React.Fragment>
  )
}
const mapStateToProps = (state) => ({
  user: state.authentication.user
})
export default connect(mapStateToProps)(withRouter(AddGuestChild))
