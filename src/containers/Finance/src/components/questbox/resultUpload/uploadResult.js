import React, { Component } from 'react'
import { Table, Grid, Message } from 'semantic-ui-react'
import Dropzone from 'react-dropzone'
import { Button, Card, CardContent, LinearProgress, Badge, Modal } from '@material-ui/core'
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'
import axios from 'axios'
// import Badge from '@material-ui/core/Badge'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { urls } from '../../../urls'
import { OmsSelect } from '../../../ui'
// import WebSocketInstance from './websocket/websocket'

class UploadResult extends Component {
  constructor () {
    super()
    this.state = {
      errors: [],
      testTypes: null,
      files: [],
      percentCompleted: 0,
      mode: 'excel',
      omrFile: [],
      errorsOmr: [],
      percentCompletedOmr: 0,
      QuestionPaperSubType: [],
      uploadedPercentage: 0,
      showProgressBar: false,
      disableUploadButton: false,
      invalidData: {
        data_error: [],
        erp_error: []
      },
      open: false,
      resultTypeLabel: ''
    }
    this.changehandler = this.changehandler.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.handleMode = this.handleMode.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
    this.handleOnDropOmr = this.handleOnDropOmr.bind(this)
  }

  componentDidMount () {
    axios
      .get(urls.QuestionPaperType, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        this.setState({ QuestionPaperType: res.data })
      })
      .catch(error => {
        console.log("Error: Couldn't fetch data", error)
      })
  }

  handleMode (event, mode) {
    this.setState({ mode })
  }
  changehandler (event) {
    this.setState({ type: event.value, subType: '', resultTypeLabel: event.label, showProgressBar: false, uploadedPercentage: 0, invalidData: { data_error: [], erp_error: [] }
    })
    axios.get(`${urls.QuestionPaperSubType}?qp_id=${event.value}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(res => {
        this.setState({ QuestionPaperSubType: res.data })
      })
      .catch(err => {
        console.log(err)
      })
  }

  connect = () => {
    const path = 'ws://localhost:8000/ws/'
    // eslint-disable-next-line no-undef
    this.socketRef = new WebSocket(path)
    this.socketRef.onopen = () => {
      console.log('WebSocket open')
      this.socketRef.send(this.state.files[0])
      console.log('sent')
    }

    this.socketRef.onmessage = (event) => {
      let data = JSON.parse(event.data)
      if (data.percentage) {
        this.setState({ uploadedPercentage: data.percentage, disableUploadButton: true }, () => {
          if (data.percentage === 100) {
            // this.socketRef.close()
            this.setState({ disableUploadButton: false })
          }
        })
      } else {
        this.setState({ invalidData: data })
      }
    }

    this.socketRef.onerror = e => {
      console.log(e.message)
    }
    this.socketRef.onclose = () => {
      console.log('WebSocket closed')
      // this.connect()
      // this.setState({ uploadedPercentage: 0 })
    }
  }

  onDrop (files) {
    this.state.files
      ? this.setState({
        files: [...this.state.files, ...files], uploadedPercentage: 0, showProgressBar: false
      })
      : this.setState({ files: files, uploadedPercentage: 0, showProgressBar: false, invalidData: { data_error: [], erp_error: [] } })
  }

  handleOnDropOmr (files) {
    this.setState({ omrFile: files })
  }

  handleUpload = (e) => {
    let { mode, type, files, omrFile, subType, resultTypeLabel, QuestionPaperSubType } = this.state
    if (mode === 'excel' && type !== 7) {
      if (!type) {
        this.props.alert.error('Select result type')
        return
      }
      if (!files || files.length === 0) {
        this.props.alert.error('Upload excel file')
        return
      }
      let formData = new FormData()
      console.log(files)
      this.state.files &&
      this.state.files.forEach((file, index) => {
        file.name.endsWith('.xlsx') ? formData.append('excel_file ', file) : file.name.endsWith('.json') ? formData.append('json_file ', file) : formData.append('zip_file ', file)
      })
      // formData.append('excel_file', files[0])
      formData.append('excel_type', resultTypeLabel)
      if (QuestionPaperSubType.length && !subType) {
        this.props.alert.error('Select sub type')
        return
      } else if (QuestionPaperSubType.length && subType) {
        formData.append('excel_subtype', subType)
      }
      this.setState({ errors: [] })
      axios
        .post(urls.UploadResultExcel, formData, {
          headers: {
            Authorization: 'Bearer ' + this.props.user,
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
        .then((res) => {
          this.props.alert.success('Result uploaded successfully')
          // this.setState({files:[]})
        })
        .catch((error) => {
          console.log(error)
          if (error.response && error.response.status === 404) {
            this.setState({ errors: error.response.data })
          } else if (error.response && error.response.status === 400) {
            this.props.alert.error(error.response.data)
          } else {
            this.props.alert.error('Something went wrong')
          }
        })
    } else if (mode === 'excel' && this.state.type === 7) {
      if (!files || files.length === 0) {
        this.props.alert.error('Upload excel file')
        return
      }
      this.setState({ showProgressBar: true, uploadedPercentage: 0, invalidData: { data_error: [], erp_error: [] } }, () => {
        this.connect()
      })
      // let formData = new FormData()
      // formData.append('excel_file', files[0])
      // formData.append('excel_type', 'Dance')
      // if (subType) {
      //   formData.append('excel_subtype', subType)
      // }
      // this.setState({ errors: [], uploadedPercentage: 0 })
      // axios
      //   .post(urls.UPLOADDANCERESULT, formData, {
      //     headers: {
      //       Authorization: 'Bearer ' + this.props.user,
      //       'Content-Type': 'multipart/formData'
      //     },
      //     onUploadProgress: (progressEvent) => {
      //       let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      //       this.setState({ percentCompleted })
      //       // console.log('i am progesss ', percentCompleted)
      //       if (percentCompleted === 100) {
      //         this.setState({ percentCompleted: 0 })
      //       }
      //     }
      //   })
      //   .then((res) => {
      //     console.log(res)
      //     this.setState({ showProgressBar: true, danceResult: res.data }, () => {
      //       // this.connect()
      //     })
      //     this.props.alert.success('Result uploaded successfully')
      //   })
      //   .catch((error) => {
      //     console.log(error)
      //     if (error.response && error.response.status === 404) {
      //       this.setState({ errors: error.response.data })
      //     } else if (error.response && error.response.status === 400) {
      //       this.props.alert.error(error.response.data)
      //     } else {
      //       this.props.alert.error('Something went wrong')
      //     }
      //   })
    } else if (mode === 'omr') {
      if (!omrFile || omrFile.length === 0) {
        this.props.alert.error('Upload OMR data')
        return
      }
      let formData = new FormData()
      formData.append('file', omrFile[0])
      axios
        .post(urls.OMRUpload, formData, {
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'multipart/formData'
          },
          onUploadProgress: (progressEvent) => {
            let percentCompletedOmr = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            this.setState({ percentCompletedOmr })
            if (percentCompletedOmr === 100) {
              this.setState({ percentCompletedOmr: 0 })
            }
          }
        })
        .then((res) => {
          if (res.status === 200) {
            this.props.alert.success('OMR uploaded successfully')
          } else {
            this.props.alert.error('Something went wrong')
          }
        })
        .catch((error) => {
          console.log(error)
          if (error.response && error.response.status === 404) {
            this.setState({ errorsOmr: error.response.data })
          } else if (error.response && error.response.status === 406) {
            this.props.alert.error(error.response.data)
          } else {
            this.props.alert.error('Something went wrong')
          }
        })
    }
  }

  changeSubtypeHandler = (data) => {
    console.log(data)
    this.setState({ subType: data.label })
  }

  onClick () {
    window.location.href = urls.ResultExcel
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render () {
    const files = this.state.files &&
      this.state.files.map(file => (
        <li key={file.name}>
          {file.name} - {file.size} bytes
        </li>
      ))
    const omrFiles = this.state.omrFile &&
      this.state.omrFile.map(file => (
        <li key={file.name}>
          {file.name} - {file.size} bytes
        </li>
      ))
    console.log(files, 'files')
    let { mode, percentCompletedOmr, errorsOmr, open } = this.state
    return (
      <React.Fragment>
        <Grid style={{ padding: '50px' }}>
          <Grid.Row>
            <Grid.Column
              computer={5}
              mobile={12}
              tablet={5}
              style={{ display: 'flex', margin: 'auto' }}
            >
              <ToggleButtonGroup
                value={mode}
                onChange={this.handleMode}
                exclusive
              >
                <ToggleButton value='excel'> Excel Upload </ToggleButton>
                <ToggleButton value='omr'> OMR Upload </ToggleButton>
              </ToggleButtonGroup>
            </Grid.Column>
          </Grid.Row>
          {mode === 'excel'
            ? <React.Fragment>
              <Grid.Row>
                <Grid.Column computer={7} mobile={7} tablet={7} >
                  <Grid.Row>
                    <label>Result Type<sup>*</sup></label>
                    <OmsSelect
                      placeholder='Select Result Type'
                      options={this.state.QuestionPaperType
                        ? this.state.QuestionPaperType.map(QuestionPaperType => ({
                          value: QuestionPaperType.id,
                          label: QuestionPaperType.question_paper_type
                        }))
                        : []
                      }
                      change={this.changehandler}
                      // change={e => this.setState({ type: e.label })}

                    />
                    {
                      this.state.QuestionPaperSubType.length
                        ? (
                          <OmsSelect
                            placeholder='Select Result Sub Type'
                            options={this.state.QuestionPaperSubType
                              ? this.state.QuestionPaperSubType.map(subType => ({
                                value: subType.question_paper_type_id,
                                label: subType.question_paper_sub_type_name
                              })) : []}
                            change={this.changeSubtypeHandler}
                          />
                        )
                        : ''
                    }

                  </Grid.Row>
                  <Grid.Row style={{ padding: '20px 0px' }}>
                    <label>Select File (.xlsx format only)<sup>*</sup></label>
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
                              {isDragAccept && 'All files will be accepted'}
                              {isDragReject && 'Some files will be rejected'}
                              {!isDragActive && 'Drop your files here.'}
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
                  </Grid.Row>
                </Grid.Column>
                {/* for spce between two coluns */}
                <Grid.Column></Grid.Column>
                <Grid.Column computer={7} mobile={7} tablet={7} >
                  <Grid.Row>
                    <Table collapsing celled>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell>STID</Table.HeaderCell>
                          <Table.HeaderCell>TESTID</Table.HeaderCell>
                          <Table.HeaderCell>Q1</Table.HeaderCell>
                          <Table.HeaderCell>Q2</Table.HeaderCell>
                          <Table.HeaderCell>Q3</Table.HeaderCell>
                          <Table.HeaderCell>.</Table.HeaderCell>
                          <Table.HeaderCell>.</Table.HeaderCell>
                          <Table.HeaderCell>.</Table.HeaderCell>
                          <Table.HeaderCell>Qn</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                    </Table>
                  </Grid.Row>
                  <Grid.Row style={{ padding: '20px 0px' }}>
                    <Button
                      onClick={this.onClick}
                    >
                      Download Template
                    </Button>
                  </Grid.Row>
                </Grid.Column>
              </Grid.Row>
              {
                this.state.showProgressBar ? (
                  <div style={{ width: '100%' }}>
                    <div>
                      {
                        this.state.invalidData.data_error.length || this.state.invalidData.erp_error.length
                          ? (<Button
                            color={'primary'}
                            variant={'outlined'}
                            style={{ float: 'right' }}
                            onClick={() => { this.setState({ open: true }) }}
                          >
                              Found Invalid data
                          </Button>)
                          : ('')
                      }
                      <Badge
                        badgeContent={
                          this.state.uploadedPercentage !== 100 ? `${this.state.uploadedPercentage}%` : 'Completed'
                        }
                        color='primary'
                        style={{ float: 'right', marginTop: 20, marginRight: 50 }} />
                      <LinearProgress color='primary' variant='determinate' value={this.state.uploadedPercentage} />
                    </div>
                  </div>
                ) : ('')
              }

              {this.state.errors.length > 0
                ? <Grid.Row>
                  <Message
                    header='Result Uploaded with the following Issues'
                    list={this.state.errors}
                  />
                </Grid.Row>
                : null
              }

            </React.Fragment>
            : <React.Fragment>
              <Grid.Row>
                <Grid.Column computer={8} mobile={8} tablet={8} >
                  <Grid.Row>
                    <label>Select File (zip/image file)<sup>*</sup></label>
                    <Dropzone onDrop={this.handleOnDropOmr}>
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
                            {omrFiles}
                          </CardContent>
                        </Card>
                      )}
                    </Dropzone>
                    {percentCompletedOmr > 0 &&
                      <LinearProgress
                        variant={'determinate'}
                        value={percentCompletedOmr}
                      /> && percentCompletedOmr
                    }
                  </Grid.Row>
                  <Grid.Row style={{ padding: '10px 0px' }}>
                    Note: Image name format should be <span style={{ color: 'red' }}> Unique Test id _ Student's ERP Code</span>
                  </Grid.Row>
                </Grid.Column>
              </Grid.Row>
              {errorsOmr.length > 0
                ? <Grid.Row>
                  <Message
                    header='Result Uploaded with the following Issues'
                    list={errorsOmr}
                  />
                </Grid.Row>
                : null
              }
            </React.Fragment>
          }
          <Grid.Row>
            <Button
              onClick={this.handleUpload}
              disabled={this.state.disableUploadButton}
            >
              Upload
            </Button>

            <Button
              onClick={this.props.history.goBack}
            >
              Return
            </Button>
          </Grid.Row>
        </Grid>
        <Modal
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'
          open={open}
          onClose={this.handleClose}
        >
          <div style={{ backgroundColor: 'white', width: '90%', height: '80vh', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', overflow: 'scroll', padding: 20 }}>
            {this.state.invalidData.length ? this.state.invalidData.map((erp, index) => {
              return <h4>{`${index + 1}. ${erp}`}</h4>
            }) : ''}
            <Grid style={{ padding: '10px' }}>
              <Grid.Row>
                <Grid.Column
                  computer={5}
                  mobile={12}
                  tablet={5}
                  style={{ margin: '0 auto' }}
                >
                  <h2>List of Invalid data found in the file</h2>
                  {
                    this.state.invalidData.data_error.map((error, index) => {
                      for (let key in error) {
                        if (typeof error[key] === 'string') {
                          console.log(error[key])
                          return <h5>{index + 1}. Found error <span style={{ color: 'red' }}>{error[key]}</span> at ERP {error.ERP}</h5>
                        }
                      }
                    })
                  }
                </Grid.Column>
                <Grid.Column
                  computer={5}
                  mobile={12}
                  tablet={5}
                  style={{ margin: '0 auto' }}
                >
                  <h2>List of Invalid ERP found in the file</h2>
                  {
                    this.state.invalidData.erp_error.map((erp, index) => {
                      return <h5>{index + 1}. {erp}</h5>
                    })
                  }
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </Modal>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})
export default connect(mapStateToProps)(withRouter(UploadResult))
