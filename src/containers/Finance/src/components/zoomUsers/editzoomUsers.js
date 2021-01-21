import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { TextField, Checkbox, Grid, Button, FormControlLabel } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import axios from 'axios'
import { qBUrls } from '../../urls'

const styles = theme => ({
  root: {
    margin: theme.spacing.unit * 8,
    padding: theme.spacing.unit * 3
  },
  item: {
    padding: theme.spacing.unit * 2

  }
})

const EditZoomUser = (props) => {
  const { classes } = props
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [zoomId, setZoomId] = useState('')

  const [isActive, setActive] = useState(false)
  const [isDelete, setIsDelete] = useState(false)

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [id, setId] = useState(0)

  function validateEmail (email) {
    // eslint-disable-next-line no-useless-escape
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }
  const updateZoomUser = () => {
    if (validateEmail(email)) {
      let formData = new FormData()
      formData.set('user_name', name)
      formData.set('password', password)
      formData.set('email', email)
      formData.set('zoom_user_id', zoomId)
      formData.set('is_active', isActive)
      formData.set('is_delete', isDelete)

      setLoading(true)
      console.log(loading)
      axios.put(qBUrls.CreateZoomUser + id + '/', formData, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('id_token'),
          'Content-Type': 'multipart/formData'
        }

      }).then(res => {
        if (res.status === 200) {
          setLoading(false)
          props.alert.success('Zoom user has been updated sucessfully')
        }
      })
        .catch(error => {
          console.log(error)
          props.alert.error('Zoom user already exist,please try with another email/user id')
        })
    } else {
      props.alert.warning('Email is not valid')
    }
  }

  useEffect(() => {
    var url = window.location.href
    var spl = url.split('/')
    setId(spl[5])
    if (id) {
      axios.get(qBUrls.EditZoomUser + id + '/', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('id_token'),
          'Content-Type': 'multipart/formData'
        }

      }).then(res => {
        setData(res.data.data[0])
        setName(data.username)
        setPassword(data.password)
        setEmail(data.email)

        setZoomId(data.zoom_user_id)

        setActive(data.is_active)
        setIsDelete(data.is_delete)
        console.log(data.zoom_user_id, data.username, data.password, data.is_active)
      })
    }
  }, [data.email, data.is_active, data.is_delete, data.name, data.password, data.username, data.zoom_user_id, id])
  return (

    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid container item xs={3} spacing={3} />
        <Grid container item xs={5} spacing={3}>
          <TextField
            id='outlined-basic'
            label='User Name'
            margin='dense'
            variant='outlined'
            fullWidth
            value={name || email}
            name='name'
            onChange={(e) => setName(e.target.value)}

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
            autoComplete='new-password'
            onChange={(e) => setPassword(e.target.value)}

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

          />
          <TextField
            id='userId'
            label='UserId'
            margin='dense'
            variant='outlined'
            name='userId'
            fullWidth
            value={zoomId}
            onChange={(e) => setZoomId(e.target.value)}

          />
                      &nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;

          <FormControlLabel
            control={
              <Checkbox
                checked={isActive}
                onChange={(e) => setActive(!isActive)}

                color='primary'
              />
            }
            label='Is Active'
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={isDelete}
                onChange={(e) => setIsDelete(!isDelete)}

                color='primary'
              />
            }
            label='Is Delete'
          />
          <div>
          &nbsp;&nbsp;&nbsp;

            <Button color='primary' variant='contained' href='/zoomusers/view'>Return</Button>
            &nbsp;&nbsp;&nbsp;
            <Button color='primary' variant='contained' onClick={updateZoomUser}>Update zoom user</Button>

          </div>

        </Grid>

      </Grid>
    </div>

  )
}

export default withRouter(withStyles(styles)(EditZoomUser))
