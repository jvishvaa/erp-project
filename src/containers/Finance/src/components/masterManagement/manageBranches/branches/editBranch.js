import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Dropzone from 'react-dropzone'
import { withStyles, TextField, Button, Card, CardContent, Checkbox,
  FormControlLabel, LinearProgress } from '@material-ui/core'
import { Grid } from 'semantic-ui-react'
import { urls } from '../../../../urls'

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
})

class EditBranch extends Component {
  constructor (props) {
    super(props)
    this.props = props
    this.state = {
      branchName: '',
      branchCode: '',
      address: '',
      city: '',
      files: [],
      central: false,
      school: false,
      percentCompleted: 0,
      internal: false
    }
    this.onDrop = this.onDrop.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }

  componentDidMount () {
    axios
      .get(urls.BRANCH + this.props.match.params.id + '/', {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        this.setState({
          branchName: res.data.branch_name,
          branchCode: res.data.branch_code,
          address: res.data.address,
          city: res.data.city,
          central: res.data.is_central,
          school: res.data.is_school,
          internal: res.data.is_internal,
          logo: res.data.logo.includes('no-img.jpg') ? null : res.data.logo
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  onDrop (files) {
    this.setState({ files: files })
  }

  handleSave () {
    let { branchName, address, city, files, central, school, internal } = this.state
    let formData = new FormData()
    formData.append('branch_name', branchName)
    formData.append('address', address)
    formData.append('city', city)
    formData.append('is_central', central)
    formData.append('is_school', school)
    formData.append('is_internal', internal)
    if (files && files.length > 0) {
      formData.append('logo', files[0])
    }
    axios
      .put(urls.BRANCH + this.props.match.params.id + '/', formData, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'multipart/formData'
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            branchName: res.data.branch_name,
            branchCode: res.data.branch_code,
            address: res.data.address,
            city: res.data.city,
            central: res.data.is_central,
            school: res.data.is_school,
            internal: res.data.is_internal
          })
          console.log(res.data)

          this.props.alert.success('Edited branch details Successfully')
        } else {
          this.props.alert.error('Error')
        }
      })
      .catch(error => {
        console.log(error)
        this.props.alert.error('Error')
      })
  }

  render () {
    const files = this.state.files &&
      this.state.files.map(file => (
        <li key={file.name}>
          {file.name} - {file.size} bytes
        </li>
      ))
    let { branchName, branchCode, address, city, central, school, logo, internal } = this.state
    const { classes } = this.props
    return (
      <React.Fragment>
        <Grid style={{ padding: '40px' }}>
          <Grid.Row>
            <Grid.Column computer={5} mobile={6} tablet={8}>
              <TextField
                required
                label='Branch Name'
                className={classes.textField}
                margin='normal'
                type='text'
                name='branchName'
                value={branchName}
                fullWidth
                onChange={event => this.setState({ branchName: event.target.value })}
              />
            </Grid.Column>
            <Grid.Column computer={5} mobile={6} tablet={8}>
              <TextField
                required
                label='Branch Code'
                className={classes.textField}
                margin='normal'
                type='text'
                name='branchCode'
                value={branchCode}
                fullWidth
                // disabled
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column computer={5} mobile={6} tablet={8}>
              <TextField
                required
                label='Address'
                className={classes.textField}
                margin='normal'
                type='text'
                name='address'
                value={address}
                fullWidth
                onChange={event => this.setState({ address: event.target.value })}
              />
            </Grid.Column>
            <Grid.Column computer={5} mobile={6} tablet={8}>
              <TextField
                required
                label='City'
                className={classes.textField}
                margin='normal'
                type='text'
                name='city'
                value={city}
                fullWidth
                onChange={event => this.setState({ city: event.target.value })}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column computer={5} mobile={6} tablet={8}>
              <label> Upload Logo </label>
              <Dropzone onDrop={this.onDrop}>
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
                        {isDragAccept && 'All file will be accepted'}
                        {isDragReject && 'Some file will be rejected'}
                        {!isDragActive && 'Drop your file here.'}
                      </div>
                      {files}
                    </CardContent>
                  </Card>
                )}
              </Dropzone>
              {this.state.percentCompleted > 0 &&
              <LinearProgress
                variant={'determinate'}
                value={this.state.percentCompleted}
              /> &&
                this.state.percentCompleted
              }
            </Grid.Column>
            {logo &&
              <Grid.Column computer={5} mobile={6} tablet={8}>
                <label> Uploaded Logo </label>
                <img src={logo} min-height='145px' />
              </Grid.Column>
            }
          </Grid.Row>
          <Grid.Row>
            <Grid.Column computer={5} mobile={6} tablet={8}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={central}
                    onChange={e => this.setState({ central: e.target.checked })}
                    value='checkeCental'
                    color='primary'
                  />
                }
                label='Is Central'
              />
            </Grid.Column>
            <Grid.Column computer={5} mobile={6} tablet={8}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={school}
                    onChange={e => this.setState({ school: e.target.checked })}
                    value='checkeCental'
                    color='primary'
                  />
                }
                label='Is School'
              />
            </Grid.Column>
            <Grid.Column computer={5} mobile={6} tablet={8}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={internal}
                    onChange={e => this.setState({ internal: e.target.checked })}
                    value='checkeIsInternal'
                    color='primary'
                  />
                }
                label='Is Internal'
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column computer={5} mobile={6} tablet={8}>
              <Button onClick={this.handleSave}>
                Save
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(mapStateToProps)(withStyles(styles)(withRouter(EditBranch)))
