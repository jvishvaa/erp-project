import React from 'react'
import { connect } from 'react-redux'
import { Grid, Popover, Button, Icon, RadioGroup, FormControlLabel, Radio } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Dropzone from 'react-dropzone'
import axios from 'axios'
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { apiActions } from '../../_actions'
import { urls } from '../../urls'
import Box from './box'
import Target from './target'
import SMSLogReport from './smsLogReport'

class SMS extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      openNewSMS: props.newSMS,
      files: {}
    }
    this.sendSMS = this.sendSMS.bind(this)
  }
  componentDidMount () {
    let { branches } = this.props
    if (!branches) { this.props.listBranches() }
  }
  static getDerivedStateFromProps (props, state) {
    if (state.openNewSMS !== props.newSMS) {
      return {
        openNewSMS: props.newSMS
      }
    } else if (state.anchorEl !== props.anchorEl) {
      return {
        anchorEl: props.anchorEl
      }
    }
    return null
  }
  sendSMS () {
    let { text, files, type } = this.state
    var formData = new FormData()
    formData.append('csv_file', files[0])
    formData.append('template', text)
    formData.append('sms_type', type)
    axios.post(urls.SMS, formData, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    }).then(() => {
      this.props.alert.success('Successfully Sent.')
    }).catch(() => this.props.alert.error('An error occured while sending SMS.'))
  }
  onDrop = (acceptedFiles) => {
    const reader = new FileReader()
    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onload = () => {
      // Do whatever you want with the file contents
      const data = reader.result
      let lines = data.split('\n')
      var jsonObj = []
      var headers = lines[0].split(',')
      for (var i = 1; i < lines.length; i++) {
        var content = lines[i].split(',')
        var obj = {}
        for (var j = 0; j < content.length; j++) {
          obj[headers[j].trim()] = content[j].trim()
        }
        jsonObj.push(obj)
      }
      this.setState({ data: jsonObj, headers })
    }
    acceptedFiles.forEach((file, index) => {
      this.setState({ files: { [index]: file } })
      reader.readAsBinaryString(file)
    })
  }
  handleTypeChange = event => {
    this.setState({ type: event.target.value })
  }
  handleTamplete = event => {
    console.log(this.state.type)
    if (this.state.type === 'Custom') {
      window.location.href = 'https://letseduvate.s3.ap-south-1.amazonaws.com/prod/media/custom_sms_template.csv'
    } else if (this.state.type === 'Fees') {
      window.location.href = 'https://letseduvate.s3.ap-south-1.amazonaws.com/prod/media/fees_sms_template.csv'
    } else if (this.state.type === 'Marks') {
      window.location.href = 'https://letseduvate.s3.ap-south-1.amazonaws.com/prod/media/marks_sms_template.csv'
    }
  }
  render () {
    return <Grid>
      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={this.state.openNewSMS}
        anchorEl={this.props.anchorEl}
        onClose={this.props.onCloseSMS}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <div style={{
          minWidth: '480px',
          padding: 8
        }} >
          <RadioGroup
            aria-label='Type'
            name='type'
            value={this.state.type}
            onChange={this.handleTypeChange}
          >
            <FormControlLabel value='Marks' control={<Radio />} label='Marks' />
            <FormControlLabel value='Fees' control={<Radio />} label='Fees' />
            <FormControlLabel value='Custom' control={<Radio />} label='Custom' />
          </RadioGroup>

          <Button color='primary' onClick={this.handleTamplete} disabled={!this.state.type}>Download Template</Button>
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
                    {!isDragActive && 'Drop your CSV here.'}
                  </div>
                </CardContent>
                {Object.values(this.state.files).map(file => {
                  return <li>{file.name}</li>
                })}
              </Card>
            )}
          </Dropzone>
          {this.state.headers && <DragDropContextProvider backend={HTML5Backend}>
            { this.state.headers.map(header => {
              return <Box name={header} dropped={(value) => this.setState(state => ({ text: state.text ? state.text + '{' + value + '}' : '{' + value + '}' }))} />
            })}
            <Target content={this.state.text} onChange={(value) => this.setState({ text: value })} />
          </DragDropContextProvider>}
          {this.state.headers && <Button onClick={this.sendSMS} variant='contained' color='primary'>
        Send
            {/* This Button uses a Font Icon, see the installation instructions in the docs. */}
            <Icon>send</Icon>
          </Button>}
        </div>
      </Popover>
      {this.props.branches ? <SMSLogReport /> : null}
    </Grid>
  }
}
const mapStateToProps = state => ({
  branches: state.branches.items,
  user: state.authentication.user
})

const mapDispatchToProps = dispatch => ({
  listBranches: () => dispatch(apiActions.listBranches())
})

export default connect(mapStateToProps, mapDispatchToProps)(SMS)
