import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Dropzone from 'react-dropzone'
import Card from '@material-ui/core/Card'
import { withStyles, Typography } from '@material-ui/core'
import CardContent from '@material-ui/core/CardContent'
import { apiActions } from '../../_actions'
import { urls } from '../../urls'
import { OmsSelect, ProfanityFilter } from '../../ui'
import { COMBINATIONS } from './gselectConfig'
import GSelect from '../../_components/globalselector'

const styles = theme => ({
  root: {
    width: '90%'
  },
  button: {
    marginRight: theme.spacing.unit
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  }
})

class Circular extends React.Component {
  constructor () {
    super()
    this.state = { files: [],
      percentCompleted: 0,
      skipped: new Set(),
      gradevalue: [],
      selectorData: {},
      circularName: '',
      DescriptionValue: '',
      role: '',
      isUploading: false

    }
    this.uploadFiles = this.uploadFiles.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.changeHandlerGrade = this.changeHandlerGrade.bind(this)
    this.changeHandlerSection = this.changeHandlerSection.bind(this)
    this.onChange = this.onChange.bind(this)
    // this.validateFileExtension = this.validateFileExtension.bind(this)
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
  }

  componentDidMount () {
    this.role = this.userProfile.personal_info.role
    let academicProfile = this.userProfile.academic_profile
    // this.props.gradeMapBranch(academicProfile.branch_id)

    console.log(academicProfile)
    if (this.role === 'Principal' || this.role === 'BDM') {
      this.setState({
        branch: academicProfile.branch_id,
        branchData: { value: academicProfile.branch_id, label: academicProfile.branch }
      })
      this.changehandlerbranch({ value: academicProfile.branch_id, label: academicProfile.branch })
    }

    this.circularId = this.props.match.params.id
    if (this.circularId) {
      axios
        .get(urls.CircularId + this.circularId, {
          headers: {
            'Authorization': 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          if (res.status === 200) {
            let sectionId = []
            res.data.sections.map(data => {
              sectionId.push(data.id)
            })
            this.setState({
              flagGrade: true,
              flagSection: true,
              sectionMapId: sectionId,
              selectedGrade: res.data.sections[0].branch_grade_acad_session_mapping,
              circularName: res.data.circular_name,
              DesciptionValue: res.data.description
            })
            this.props.sectionMap(res.data.sections[0].branch_grade_acad_session_mapping)
          } else {
            this.props.alert.error('Error Occured')
          }
        })
        .catch(error => {
          this.props.alert.error('Error Occured')
          console.log(error)
        })
    }
  }

  changehandlerbranch = (e) => {
    this.setState({ branch: e.value, gradevalue: [], branchData: e })
    this.props.gradeMapBranch(e.value)
  };

  changeHandlerGrade = event => {
    // this.setState({ grade: e.value })
    console.log(event, 'eeeeeee')
    let aGradeIds = []
    event.forEach(function (grade) {
      aGradeIds.push(grade.value)
    })
    this.props.sectionMap(aGradeIds[0])
    this.setState({ gradevalue: aGradeIds, gradeValue: event, sectionValue: [] })
    console.log(aGradeIds, 'grade')
    console.log('grade', aGradeIds)
  };

  changeHandlerSection (event) {
    let sectionId = []
    event.map(section => {
      sectionId.push(section.value)
    })
    this.setState({ sectionValue: event, sectionMapId: sectionId, flagSection: false })
  }
  changehandlerrole = e => {
    this.setState({ role: e.label, valueRole: e })
  };
  onChange (data) {
    let { selectorData } = this.state
    console.log(selectorData, data)
    this.setState({ selectorData: data, isUploading: false })
  }

  uploadFiles () {
    let { files = [] } = this.state

    let{ selectorData, isUploading } = this.state
    if (!isUploading) return
    let url = urls.Circular

    this.setState({ fileError: '', sectionError: '', nameError: '', roleError: '', circularNameError: false, descriptionError: false, rolesError: false, isUploading: false
    })
    let CircularNameValue = this.CircularName()
    let RoleNameValue = this.RoleName()
    let DescriptionNameValue = this.DescriptionName()
    if (CircularNameValue || DescriptionNameValue || RoleNameValue) {
      return
    }

    // let { branchData, files, sectionMapId, circularName, DescriptionValue, gradevalue, gradeValue, role } = this.state
    let { circularName, DescriptionValue, gradeValue, role } = this.state
    console.log(gradeValue, 'grade')
    if (!circularName) {
      this.setState({ nameError: 'Enter Circular Name', isUploading: false })
      return
    }

    if (!role) {
      this.props.alert.error('Please enter required fields')
      return
    }
    this.setState({ isUploading: true })
    let formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('file' + i, files[i])
    }
    formData.append('circular_name', circularName)
    formData.append('description', DescriptionValue)
    formData.append('role', role)

    if (this.circularId) {
      formData.append('circular_id', this.circularId)
      Object.keys(selectorData).forEach(item => {
        formData.append(item, selectorData[item])
      })
      axios({
        method: 'PUT',
        data: formData,
        params: {
          ...selectorData
        },
        url,

        // Circular, formData, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user,
          'Content-Type': 'multipart/formData'
        }
      })
        .then(res => {
          // if(){}
          if (String(res.status).startsWith(String(2))) {
            this.props.alert.success('Circulars Updated Successfully')
          } else {
            this.props.alert.error('Error Occured')
          }
        })
        .catch(error => {
          this.props.alert.error(error.response.data)
          console.log(error)
        })
    } else {
      Object.keys(selectorData).forEach(item => {
        formData.append(item, selectorData[item])
      })
      axios({
        method: 'POST',
        data: formData,

        params: {
          ...selectorData
        },
        url,
        // Circular, formData, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user,
          'Content-Type': 'multipart/formData'
        },
        onUploadProgress: (progressEvent) => {
          let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          this.setState({ percentCompleted })
          console.log('i am progesss ', percentCompleted)
          if (percentCompleted === 100) {
            this.setState({ percentCompleted: 0 })
          }
        }
      })
        .then(res => {
          if (res.status === 200 || res.status === 201) {
            this.props.alert.success('Circulars Uploaded Successfully')
          }
          this.setState({ circularName: '',
            DescriptionValue: '',
            valueRole: {},
            isUploading: false,
            role: '',
            files: [] })
          // else {
          //   this.props.alert.error('Error Occured')
          // }
        })
        .catch(error => {
          this.props.alert.error(error.response.data)
          console.log(error)
        })
    }
  }
  CircularName = () => {
    let{ circularName } = this.state
    if (!circularName) {
      this.setState({ circularNameError: true })
      return true
    }
  }
  DescriptionName = () => {
    let{ DescriptionValue } = this.state
    if (!DescriptionValue) {
      this.setState({ descriptionError: true })
      return true
    }
  }
  RoleName = () => {
    let{ role } = this.state
    if (!role) {
      this.setState({ rolesError: true })
      return true
    }
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

  getData = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render () {
    // const { classes } = this.props

    // const steps = this.getSteps()
    // const { activeStep } = this.state
    console.log(this.state.selectorData)
    let { circularNameError, circularName, DescriptionValue, descriptionError, rolesError } = this.state

    const files =
    this.state.files &&
    this.state.files.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ))

    // let { nameError } = this.state
    return (
      <React.Fragment>

        <Grid container>
          <Grid style={{ marginLeft: 4 }} item>
            <GSelect config={COMBINATIONS} variant={'filter'} onChange={this.onChange} />
          </Grid>
        </Grid>
        <React.Fragment>
          <Grid style={{ marginLeft: 4 }} item>
            <OmsSelect
              label={'Role'}
              options={[{ label: 'Student', value: 'Student' }, { label: 'Teacher', value: 'Teacher' }]}
              change={this.changehandlerrole}
              defaultValue={this.state.valueRole}
              // isClearable
              // error={this.state.roleError}
            />
          </Grid>
          <Grid>

            <Grid style={{ margin: 16 }} item>

              {rolesError && (
                <Typography style={{ color: 'red' }}>Select Role</Typography>
              )}
              <ProfanityFilter name='circularName' onChange={this.getData} label='Title'value={circularName} />
              <br />
              {circularNameError && (
                <p style={{ color: 'red' }}>Enter Title</p>
              )}
              <br />
              <ProfanityFilter name='DescriptionValue' onChange={this.getData} label='Enter Description' isMultiline value={DescriptionValue} />
              <br />

              {descriptionError && (
                <p style={{ color: 'red' }}>Enter Description </p>
              )}
              <br />
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
              {/* {fileError && (
              <p style={{ color: 'red' }}>
        Select atleast one file to send message
              </p>
            )} */}
            </Grid>
          </Grid>

        </React.Fragment>

        <Grid container>
          <Grid item>

            <Button
              variant='contained'
              color='primary'
              style={{ marginbottom: 16 }}
              disabled={this.state.isUploading}
              onClick={() => {
                this.setState({ isUploading: true }, this.uploadFiles)
              }}
            >
    Upload Circular
            </Button>
          </Grid>
        </Grid>
      </React.Fragment>

    )
  }
}

const mapStateToProps = state => ({
  branches: state.branches.items,
  user: state.authentication.user,
  grades: state.gradeMap.items,
  gradeLoading: state.gradeMap.loading,
  sections: state.sectionMap.items,
  sectionLoading: state.sectionMap.loading,
  roles: state.roles.items

})

const mapDispatchToProps = dispatch => ({
  listBranches: dispatch(apiActions.listBranches()),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId)),
  sectionMap: acadId => dispatch(apiActions.getSectionMapping(acadId)),
  loadRoles: dispatch(apiActions.listRoles())

})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(Circular)))
