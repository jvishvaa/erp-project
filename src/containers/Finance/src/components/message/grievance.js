import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles, Tabs, Tab, AppBar, Checkbox, Grid, Avatar } from '@material-ui/core'
// FormControlLabel, Grid
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Dropzone from 'react-dropzone'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Close from '@material-ui/icons/Close'

import { apiActions } from '../../_actions'
import { urls } from '../../urls'

import { OmsSelect } from '../../ui'
import ViewGrievance from './viewGrievance'

const styles = theme => ({
//   root: {
//     display: 'flex',
//     fontSize: '1rem'
//   },
//   formControl: {
//     margin: theme.spacing.unit * 3
//   },
//   group: {
//     margin: `${theme.spacing.unit}px 0`
//   },
//   container: {
//     display: 'flex',
//   flexWrap: 'wrap'
// },
  selectTag: {
    // marginLeft: theme.spacing.unit * 2,
    // marginRight: theme.spacing.unit * 2,
    width: '80%'

  },
  checkBoxDiv: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2
  },
  textField: {
    // marginLeft: theme.spacing.unit * 2,
    // marginRight: theme.spacing.unit * 2,
    width: '90%'
  },
  textFieldArea: {
    // marginLeft: theme.spacing.unit * 2,
    // marginRight: theme.spacing.unit * 2,
    width: '90%',
    height: 'auto'
  },
  //   dense: {
  //     marginTop: 19
  //   },
  //   menu: {
  //     width: 200
  //   },
  button: {
    // marginLeft: theme.spacing.unit * 2,
    // marginRight: theme.spacing.unit * 2,
    width: 250,
    height: 'auto'
  }

})

class Grievance extends React.Component {
  constructor () {
    super()
    this.state = {
      numPages: null,
      pageNumber: 1,
      value: {},
      grievanceTypeList: [],
      grievanceSubTypeList: [],
      tab: 0,
      checked: false,
      files: [],
      right: false,

      selectedSubTypes: new Set()
    }
    this.handleAdd = this.handleAdd.bind(this)
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.role = this.userProfile.personal_info.role
    this.onDrop = this.onDrop.bind(this)
  }

  componentDidMount () {
    if (this.role === 'Student') {
      this.getGrievanceServiceType()
        .then(result => { this.setState({ grievanceTypeList: result.data }) })
        .catch(err => { console.log(err) })
      this.props.gradeMapBranch(this.userProfile.branch_id)
      this.setState({
        gradeId: this.userProfile.grade_id,
        sectionId: this.userProfile.section_id
      })
    }
    if (this.role === 'GuestStudent') {
      this.getGrievanceServiceSubType()
        .then(result => { this.setState({ grievanceSubTypeList: result.data }) })
        .catch(err => { console.log(err) })
    }
  }

  getGrievanceServiceType = async () => {
    let res = await axios.get(urls.GrievanceType, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
    return res
  }
  getGrievanceServiceSubType = async () => {
    let res = await axios.get(`${urls.GrievanceSubType}?type_id=${9}`, {

      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
    return res
  }

  componentDidUpdate (prevProps) {
    if (this.role === 'Student') {
      if (prevProps.grades !== this.props.grades) {
        this.props.grades && this.props.sectionMap(this.props.grades.filter(grade =>
          grade.grade.id === this.state.gradeId)[0].id)
      }
    }
  }

  getSectionData (sectionId) {
    this.setState({ sectionMapId: sectionId })
  }
  handleType = (obj) => {
    this.setState({ selectedTypeId: obj.value, selectedTypeObj: obj })
    // this.setState({ selectedTypeId: obj.value, selectedTypeObj: obj, selectedSubTypes: new Set() })
  }
  handleSubType
  = (obj) => {
    this.setState({ selectedTypeId: 9, selectedSubTypeId: obj.value, selectedSubTypeObj: obj })
  }
  onDrop (files = []) {
    if (files.length) {
      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        let val = ['jpg', 'jpeg', 'gif', 'png', 'doc', 'docx', 'xls', 'xlsx',
          'ppt', 'txt', 'pdf', 'html',
          'htm', 'odt', 'ods', 'pptx', 'jpeg', 'gif', 'png', 'tiff',
          'bmp', 'aac', 'mp3', 'mp4', 'wav', 'wma', 'dts', 'aiff', 'asf', 'flac',
          'adpcm', 'dsd', 'lpcm', 'ogg', 'mpeg-1', 'mpeg-2', 'mpeg-4', 'avi', 'mov', 'avchd', 'mkv', '3gp', 'flv', 'wmv']
        let fileName = files[fileIndex].name
        let extension = fileName.split('.')[fileName.split('.').length - 1]
        if (extension) {
          let isValidExtension = val.includes(extension.toLowerCase())
          if (isValidExtension === true) {
            files[fileIndex]['customKey_isvalidExtention'] = true
          } else {
            let msg = 'Invalid file extension of file: ' + fileName
            this.props.alert.error(msg)
          }
        } else {
          let msg = 'please upload a file with extension: ' + fileName
          this.props.alert.error(msg)
        }
      }
      files = files.filter(file => file['customKey_isvalidExtention'] === true)
      files = files.map(file => {
        delete file['customKey_invalidExtention']
        return file
      })
      this.setState({ files })
    }
  };

  handleAdd (sectionMapId) {
    console.log(this.userProfile.data)

    let { files, message, title, selectedTypeId, selectedSubTypes = new Set(), selectedTypeObj, selectedSubTypeId } = this.state
    if (!message || message === '' || !title || title === '' || !selectedTypeId || selectedTypeId === '') {
      this.props.alert.warning('fill all the fields!')
      return
    }
    let { servicesubtype_set: subTypesArray = [] } = selectedTypeObj || {}
    if (subTypesArray.length && !selectedSubTypes.size) {
      this.props.alert.warning('Please select sub type')
      return
    }
    this.setState({ postingGrievance: true })
    var formData = new FormData()
    for (var i = 0; i < files.length; i++) {
      formData.append('media_files', files[i])
    }
    formData.append('title', title)
    formData.append('message', message)
    formData.append('is_grievance', 'True')
    formData.append('grievance_type', selectedTypeId)
    // eslint-disable-next-line no-lone-blocks
    { this.role === 'GuestStudent' ? formData.append('grievance_sub_type', selectedSubTypeId)
      // : formData.append('grievance_sub_type', JSON.stringify([...selectedSubTypes])) }
      : formData.append('grievance_sub_type', [...selectedSubTypes]) }
    axios
      .post(urls.Message, formData, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user,
          'Content-Type': 'multipart/formData'
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.props.alert.success('Issue posted Sucessully')
          this.setState({ selectedSubTypeObj: [], files: [], selectedSubTypes: new Set(), selectedTypeObj: undefined, selectedTypeId: undefined, message: undefined, title: undefined })
        } else {
          this.props.alert.error('Failed to post')
        }
        this.setState({ postingGrievance: false })
      })
      .catch(error => {
        this.props.alert.error('Failed to post')
        console.log(error)
        this.setState({ postingGrievance: false })
      })
  }

  handleChange = title => event => {
    this.setState({ [title]: event.target.value })
  }

  // handleChangeData = message => event => {
  //   this.setState({ [message]: event.target.value })
  // }

  handleSelection = event => {
    this.setState({ value: event.target.value })
  }

  handleChangeSubType = (e, id) => {
    let { selectedSubTypes = new Set() } = this.state
    if (selectedSubTypes.has(id)) {
      selectedSubTypes.delete(id)
    } else {
      selectedSubTypes.add(id)
    }
    this.setState({ selectedSubTypes })
  }

  getCheckBoxes = ({ label, id }) => {
    let { selectedSubTypes = new Set() } = this.state
    return (
      <div>
        <Checkbox
          key={`sub-type-${id}`}
          onChange={(e) => this.handleChangeSubType(e, id)}
          color='primary'
          checked={selectedSubTypes.has(id)}
        />
        <span style={{ fontSize: '1rem' }}>{label}</span>
      </div>
    )
  }
  handleClose = () => {
    this.setState({ right: false, files: [] })
  };
  sendTabContent=() => {
    const files = this.state.files &&
    this.state.files.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ))
    const { grievanceSubTypeList, selectedSubTypeObj = {} } = this.state
    const { classes } = this.props
    const { grievanceTypeList, selectedTypeObj = {} } = this.state
    let { servicesubtype_set: subTypesArray = [] } = selectedTypeObj
    return (
      <div style={{ marginTop: 20, paddingLeft: '10%', paddingRight: '20%', paddingBottom: '10%' }}>
        {this.role === 'GuestStudent'
          ? <Grid container spacing={2}>
            <Grid item xs={12} sm={4} md={4}>
              <OmsSelect
                label='Category'
                name='Category'
                placeholder='Select Category'
                change={this.handleSubType}
                defaultValue={selectedSubTypeObj.label ? selectedSubTypeObj : {}}
                options={grievanceSubTypeList.map((item) => {
                  return { ...item, label: item.sub_type_name, value: item.id }
                })}
              /></Grid>
            <Grid item xs={12} sm={4} md={4} />
          </Grid>

          : <Grid container spacing={2}>
            <Grid item xs={12} sm={4} md={4}> <OmsSelect
              label='Type'
              name='Type'
              placeholder='Select Type'
              className={classes.selectTag}
              change={this.handleType}
              defaultValue={selectedTypeObj.label ? selectedTypeObj : {}}
              options={grievanceTypeList.map((item) => {
                return { ...item, label: item.type_name, value: item.id }
              })}
            /></Grid></Grid>
        }
        {
          subTypesArray.length
            ? <div className={classes.checkBoxDiv}>
              {
                subTypesArray
                  .map(
                    subType => this.getCheckBoxes({
                      ...subType,
                      label: subType.sub_type_name,
                      id: subType.id
                    })
                  )
              }
            </div>
            : null
        }
        <Grid container spacing={2}>

          <Grid item xs={12} sm={4} md={4}>
            <TextField
              required
              key='title'
              label='Title'
              className={classes.textField}
              margin='normal'
              variant='outlined'
              value={this.state.title || ''}
              onChange={this.handleChange('title')}
            /></Grid>
        </Grid>
        <br />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} md={4}>
            <TextField
              required
              key='description'
              type='textarea'
              className={classes.textFieldArea}
              multiline
              label='Issue'
              placeholder='Enter Description'
              margin='normal'
              variant='outlined'
              value={this.state.message || ''}
              onChange={this.handleChange('message')}
            /></Grid>
        </Grid>
        <br />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} md={4}>
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
                    marginTop: 16,
                    marginBottom: 16,
                    border: '1px solid black',
                    borderStyle: 'dotted'
                  }}
                  {...getRootProps()}
                  // className='dropzone'
                >
                  <CardContent>
                    <input {...getInputProps()} />
                    <div>
                      {isDragAccept && 'All files will be accepted'}
                      {isDragReject && 'Some files will be rejected'}
                      {!isDragActive && '\xa0\xa0\xa0\xa0\xa0\xa0\xa0 ' + 'Upload Image' + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 '}
                      {files.length ? <Button
                        type='button'
                        onClick={this.handleClose} >
                        <Avatar ><Close style={{ color: 'black' }} /></Avatar>
                      </Button> : ''}

                    </div>
                    {files}

                  </CardContent>

                </Card>
              )}

            </Dropzone>
          </Grid>

        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} md={4}>
            <Button
              variant='contained'
              color='primary'
              // className={classes.button}
              disabled={this.state.postingGrievance}
              onClick={this.handleAdd}>
              {this.state.postingGrievance ? 'Posting' : 'Post Issue'}
            </Button>
          </Grid>
        </Grid>
      </div>)
  }
  viewTabContent=() => {
    return <ViewGrievance alert={this.props.alert} />
  }
  decideTab =() => {
    if (this.state.tab === 0) {
      return this.sendTabContent()
    } else if (this.state.tab === 1) {
      return this.viewTabContent()
    }
  }
  handleTabChange = (event, value) => {
    this.setState({ tab: value, data: [], dataList: [] })
  }

  render () {
    return (
      <React.Fragment>
        <AppBar style={{ backgroundColor: '#f0f0f0' }} elevation={4} position='static'>
          <Tabs
            value={this.state.tab}
            onChange={this.handleTabChange}
            indicatorColor='primary'
            textColor='primary'
            variant='fullWidth'
          >
            <Tab label='Send' />

            <Tab label='View' />

          </Tabs>
        </AppBar>
        {this.decideTab()}

      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  grades: state.gradeMap.items,
  sections: state.sectionMap.items
})

const mapDispatchToProps = dispatch => ({
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId)),
  sectionMap: acadId => dispatch(apiActions.getSectionMapping(acadId))
})

Grievance.propTypes = {
  classes: PropTypes.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(Grievance)))
