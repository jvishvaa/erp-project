import React, { useState } from 'react'

import { TextField, Grid, Button, Checkbox, FormControlLabel } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import axios from 'axios'
import { qBUrls } from '../../urls'
import './zoom.css'

const styles = theme => ({
  root: {
    margin: theme.spacing.unit * 8,
    padding: theme.spacing.unit * 3
  },
  item: {
    padding: theme.spacing.unit * 2

  }
})

const AddZoomUSer = (props) => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')
  const [isActive, setActive] = useState(false)
  const [loading, setLoading] = useState(false)

  const { classes } = props

  function validateEmail (email) {
    // eslint-disable-next-line no-useless-escape
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }
  const createZoomUser = () => {
    if (name && email && userId && password) {
      if (validateEmail(email)) {
        let formData = new FormData()
        formData.set('user_name', name)
        formData.set('password', password)
        formData.set('email', email)
        formData.set('zoom_user_id', userId)
        formData.set('is_active', isActive)
        setLoading(true)
        axios.post(qBUrls.ZoomUser, formData, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('id_token'),
            'Content-Type': 'multipart/formData'
          }

        }).then(res => {
          if (res.status === 200) {
            setLoading(false)
            props.alert.success('Zoom user has been created sucessfully')
            setName('')
            setUserId('')
            setEmail('')
            setPassword('')
            setActive(false)
          }
        })
          .catch(error => {
            if (error.response.status === 400) {
              setLoading(false)
              props.alert.warning('Email/userId exist,please try with another')
            }
          })
      } else {
        props.alert.warning('Email is not valid')
      }
    } else {
      props.alert.warning('All fields are required')
    }
  }

  return (
    <React.Fragment>
      {
        loading === true ? <div className='loader' />
          : <div className={classes.root}>
            <Grid container spacing={1}>
              <Grid container item xs={3} spacing={3} />
              <Grid container item xs={5} spacing={3}>
                <TextField
                  id='outlined-basic'
                  label='User Name'
                  margin='dense'
                  variant='outlined'
                  fullWidth
                  value={name}
                  name='name'
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <TextField
                  id='outlined-basic'
                  type='password'
                  label='Password'
                  margin='dense'
                  variant='outlined'
                  fullWidth
                  value={password}
                  name='password'
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autocomplete='new-password'
                />
                <TextField
                  id='email'
                  label='Email'
                  margin='dense'
                  variant='outlined'
                  name='email'
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required

                />
                <TextField
                  id='userId'
                  label='User Id'
                  margin='dense'
                  variant='outlined'
                  name='userId'
                  fullWidth
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isActive}

                      onChange={(e) => {
                        setActive(!isActive)
                      }}
                      color='primary'
                    />
                  }
                  label='Is Active'
                />
                <div>
                &nbsp;&nbsp;&nbsp;

                  <Button color='primary' variant='contained' href='/zoomusers/view' >Return</Button>
                &nbsp;&nbsp;&nbsp;

                  <Button color='primary' variant='contained' onClick={createZoomUser}>Add zoom user to ERP</Button>

                </div>

              </Grid>

            </Grid>

          </div>

      }
    </React.Fragment>

  )
}
export default withStyles(styles)(AddZoomUSer)
