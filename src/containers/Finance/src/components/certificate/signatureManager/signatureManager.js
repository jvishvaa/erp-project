import React, { useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Dropzone from 'react-dropzone'
import {
  Grid,
  Button,
  Card,
  TextField,
  CardContent,
  Typography
} from '@material-ui/core'
import { urls } from '../../../urls'
import { apiActions } from '../../../_actions'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  table: {
    minWidth: 650
  },
  card__size: {
    minWidth: '100%',
    padding: '5%',
    margin: '5%'
  },
  signature__list: {
    background: 'red'
  }
}))
const SignatureManager = (props) => {
  const [file, setFile] = useState('')
  // const [name, setName] = useState('')
  // const [branch, setBranch] = useState('')
  const [erpNumber, setErpNumber] = useState('')
  const [checkedA, setChecked] = useState(false)
  const classes = useStyles()

  const onDrop = (file) => {
    setFile(file)
  }
  const uploadSignature = () => {
    if (!erpNumber || !file) {
      console.log('Select All Fields')
      props.alert.warning('Select All Field')
      return
    }
    const formData = new FormData()
    // formData.append('name', name)
    // formData.append('branch', branch)
    formData.append('erp', erpNumber)
    formData.append('signature', file[0])
    formData.append('is_signature_removed', 'False')
    formData.append('is_central', checkedA ? 'True' : 'False')
    axios
      .post(urls.signatureUpload, formData, {
        headers: {
          Authorization: 'Bearer ' + props.user,
          'Content-Type': 'multipart/formData'
        }
      })
      .then(res => {
        console.log(res.data.status)
        // eslint-disable-next-line no-debugger
        // debugger
        if (res.status === 201) {
          props.alert.success('signature uploaded successfully')
          // console.log('res.status', res.status)
          setErpNumber('')
          setFile('')
        }
      })
      .catch(error => {
        console.log(error)
        console.log(JSON.stringify(error), error)
        let { response: { data: { status } = {} } = {}, message } = error
        if (!status && message) {
          props.alert.error(JSON.stringify(message))
        } else {
          props.alert.error(JSON.stringify(status))
        }
      })
  }
  const files = file &&
  file.map(file => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ))

  // const handleChange = name => event => {
  //   setChecked({ [name]: event.target.checked })
  // }
  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={3} />
        <Grid item xs={6}>
          <Card
            className={classes.card__size}
            variant='outlined'
          >
            <Grid container spacing={2}>
              {/* <Grid item xs={12}> */}
              {/* <Typography className={classes.label} variant='p' noWrap>
                    Name*
                </Typography>
                <TextField
                  margin='dense'
                  type='text'
                  required
                  fullWidth
                  value={name}
                  onChange={e => setName(e.target.value)}
                  variant='outlined'
                />
              </Grid> */}
              <Grid item xs={12}>
                <Typography className={classes.label} variant='p' noWrap>
                    Erp Number*
                </Typography>
                <TextField
                  margin='dense'
                  type='number'
                  required
                  fullWidth
                  value={erpNumber}
                  onChange={e => setErpNumber(e.target.value)}
                  variant='outlined'
                />
              </Grid>
              {/* <Grid item xs={12}>
                <Typography className={classes.label} variant='p' noWrap>
                    Branch*
                </Typography>
                <TextField
                  margin='dense'
                  type='text'
                  required
                  fullWidth
                  value={branch}
                  onChange={e => setBranch(e.target.value)}
                  variant='outlined'
                />
              </Grid> */}
              <Grid item xs={12}>
                <Typography className={classes.label} variant='p' noWrap>
                    Signature *
                </Typography>
                <Dropzone
                  onDrop={onDrop}
                >
                  {({
                    getRootProps,
                    getInputProps,
                    isDragActive,
                    isDragAccept,
                    isDragReject
                  }) => (
                    <Card
                      elevation={0}
                      style={{
                        border: '1px solid black',
                        borderStyle: 'dotted'
                      }}
                      {...getRootProps()}
                      className='dropzone'
                    >
                      <CardContent>
                        <input {...getInputProps()} />
                        <div>
                          {isDragAccept && 'All files will be accepted'}
                          {isDragReject && 'Some files will be rejected'}
                          {!isDragActive && 'Drop your files here.'}
                        </div>
                        {files}
                      </CardContent>
                    </Card>
                  )}
                </Dropzone>
              </Grid>
              <Grid item xs={12}>
                <Grid>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkedA}
                        onClick={() => { setChecked(!checkedA) }}
                        value='checkedA'
                        inputProps={{
                          'aria-label': 'primary checkbox'
                        }}
                      />
                    }
                    label='Is central'
                  />
                  <Button
                    onClick={uploadSignature}
                    variant='contained'
                    color='primary'>
                Upload
                  </Button>
                </Grid>

              </Grid>

            </Grid>
          </Card>
        </Grid>
        <Grid item xs={3} />
      </Grid>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  roles: state.roles.items
})

const mapDispatchToProps = dispatch => ({
  loadRoles: dispatch(apiActions.listRoles())
})

export default connect(mapStateToProps, mapDispatchToProps)(SignatureManager)
