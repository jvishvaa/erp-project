import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Grid } from 'semantic-ui-react'
import {
  Card,
  CardContent,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  Select
} from '@material-ui/core'
import axios from 'axios'
// import GSelect from '../../_components/globalselector'
// import { COMBINATIONS } from '../questbox/config/combination'
import { urls } from '../../urls'
import './canvas.css'

class UploadEbook extends Component {
  constructor () {
    super()
    this.state = {
      grade_id: '',
      subject_id: '',
      file: '',
      publicationIcon: '',
      // ebookName: '',
      publicationTitle: '',
      publicationEdition: '',
      // ebookDescription: '',
      // ebookType: '',
      publicationType: '',
      publicationZone: '',
      gSelectKey: new Date().getTime(),
      loading: false,
      PublicationZone: [],
      customIcon: false,
      iconCheck: true
      // publicationIconPreview: ''
    }
  }

  onDrop = (file) => {
    this.setState({ file })
    // console.log('file', file)
  };
  onPublicationThumbnail = (publicationIcon) => {
    this.setState({ publicationIcon: publicationIcon, iconCheck: true })
    // console.log('thumbnail', publicationIcon)
    // const file = publicationIcon[0]
    // this.setState({
    //   publicationIconPreview: URL.createObjectURL(file)
    // })
  };
  selectPublication = (e) => {
    this.setState({ publicationType: e.target.value })
  };
  selectZone = (e) => {
    this.setState({ publicationZone: e.target.value })
  };
  onChange = (data) => {
    console.log('Zone', data)
    for (let key in data) {
      this.setState({ [key]: data[key] })
    }
  };

  handleUpload = () => {
    this.setState({
      loading: true
    })
    const {
      publicationType,
      publicationZone,
      publicationEdition,
      file,
      publicationIcon,
      publicationTitle
    } = this.state
    console.log('upload', publicationEdition)
    let formData = new FormData()
    formData.append('to_publish', true)
    formData.append('title', publicationTitle)
    formData.append('edition', publicationEdition)
    formData.append('newsletter_type', publicationType)
    formData.append('zone_id', publicationZone)
    formData.append('file', file[0])
    formData.append('thumbnail', publicationIcon[0])
    // formData.append('to_publish', 'true')
    // formData.append('title', 'Elemental English_Grade1_Grammar')
    // formData.append('edition', '4th May 2020')
    // formData.append('newsletter_type', 'magazine')
    // formData.append('zone_id', '3')
    // formData.append('file', 'Elemental.pdf')
    // formData.append('thumbnail', 'tea_field-wallpaper-1366x768.jpg')
    // console.log('formData', formData)
    axios
      .post(urls.PublicationUpload, formData, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'multipart/formData'
        }
      })
      .then((res) => {
        this.props.alert.success(res.data.status)
        console.log('response', res)
        this.setState({ loading: false })
        this.setState(
          {
            publicationTitle: '',
            publicationEdition: '',
            file: '',
            publicationType: '',
            publicationZone: '',
            publicationIcon: '',
            gSelectKey: new Date().getTime(),
            loading: false
          },
          () => []
        )
      })
      .catch((error) => {
        this.setState({
          loading: false
        })
        console.log('erroe', error)
        this.props.alert.error('Something went wrong')
        // this.props.alert.error(error.response.data.error)
      })
  };
  componentDidMount () {
    // Listing the publication zone
    axios
      .get(`${urls.PublicationZone}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(({ data }) => {
        console.log('Data', data.result)
        this.setState({ PublicationZone: data.result })
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
        }
        console.log(error.response)
      })
  }
  _onFocus = (e) => {
    // e.currentTarget.type = 'date'
    e.currentTarget.type = 'text'
  };
  _onBlur = (e) => {
    e.currentTarget.type = 'text'
    e.currentTarget.placeholder = 'Edition'
  };
  onCustomIcon = (e) => {
    // console.log('custo', e.target.value)
    // this.setState({ customIcon: true })
    const { checked } = e.target
    // console.log('custo', checked)
    this.setState({
      customIcon: checked
    })
    if (checked) {
      this.setState({ iconCheck: false })
    } else {
      this.setState({ iconCheck: true })
    }
  };

  render () {
    const files =
      this.state.file &&
      this.state.file.map((file) => (
        <li key={file.name}>
          {file.name} - {file.size} bytes
        </li>
      ))
    const fileIcon =
      this.state.publicationIcon &&
      this.state.publicationIcon.map((file) => (
        <li key={file.name}>
          {file.name} - {file.size} bytes
        </li>
      ))
    let {
      customIcon,
      publicationType: etype,
      publicationZone: ztype,
      file,
      // publicationIcon,
      iconCheck,
      publicationTitle,
      loading,
      PublicationZone
      // publicationIconPreview
    } = this.state
    return (
      <div style={{ padding: '30px' }}>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '35%', marginRight: '8%' }}>
            <Grid.Row style={{ marginBottom: '20px' }}>
              <FormControl className='formControl'>
                <InputLabel>Pubication Type</InputLabel>
                <Select
                  className='selectEbookType'
                  value={this.state.publicationType}
                  onChange={this.selectPublication}
                >
                  <MenuItem value={'magazine'}>Magazine</MenuItem>
                  {/* <MenuItem value={'General'}>General Ebook</MenuItem> */}
                  <MenuItem value={'tabloid'}>Newsletter</MenuItem>
                </Select>
              </FormControl>
            </Grid.Row>
            <Grid.Row style={{ marginBottom: '20px' }}>
              <FormControl className='formControl'>
                <InputLabel>Zone </InputLabel>
                <Select
                  className='selectEbookType'
                  value={this.state.publicationZone}
                  onChange={this.selectZone}
                >
                  {!PublicationZone ? (
                    <MenuItem value={'Nozone'}>No Zone</MenuItem>
                  ) : (
                    PublicationZone.map((item) => {
                      // console.log('item', item)
                      return (
                        <MenuItem value={item.id}>{item.zone_name}</MenuItem>
                      )
                    })
                  )}
                </Select>
              </FormControl>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column computer={5} mobile={16} tablet={5}>
                <input
                  placeholder='Title'
                  onChange={(e) => {
                    this.setState({ publicationTitle: e.target.value })
                  }}
                  value={this.state.publicationTitle}
                  className='ebook__title'
                  maxLength='100'
                />
              </Grid.Column>

              <Grid.Column
                computer={5}
                mobile={16}
                tablet={5}
                style={{ marginTop: 20 }}
              >
                <input
                  placeholder='Edition'
                  onFocus={this._onFocus}
                  onBlur={this._onBlur}
                  onChange={(e) => {
                    this.setState({ publicationEdition: e.target.value })
                  }}
                  value={this.state.publicationEdition}
                  className='ebook__title'
                  maxLength='100'
                />
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={5}
                style={{ marginTop: 20 }}
              >
                <input
                  placeholder='Title'
                  type='checkbox'
                  // checked={!customIcon}
                  // onChange={this.onCustomIcon}
                  onChange={e => this.onCustomIcon(e)}
                  defaultChecked={customIcon}
                  // onChange={(e) => {
                  //   console.log('edata', e.target.value)
                  // }}
                  // value={customIcon}
                  className='check_Box'
                  maxLength='100'
                />
                Custom Thumbnail
              </Grid.Column>
              {/* <img src={publicationIconPreview} width='100px' /> */}
              {/* <Grid.Column
          computer={5}
          mobile={16}
          tablet={5}
          style={{ marginTop: 20 }}
        >
          <TextArea
            onChange={e => {
              this.setState({ ebookDescription: e.target.value })
            }}
            className='form-control'
            required
            name='description'
            autoHeight
            placeholder='Ebook Description'
            value={this.state.ebookDescription}
            style={{ minHeight: 100, width: 300 }}
          />
        </Grid.Column> */}
            </Grid.Row>
          </div>
          {/* <div> */}
          <Grid.Row
            style={{ padding: '20px 0px', width: '100%', marginRight: '3%' }}
          >
            <label>
              File ( .pdf )<sup>*</sup>
            </label>
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
                    borderStyle: 'dotted',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
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
          </Grid.Row>
          {customIcon ? (
            <Grid.Row style={{ padding: '20px 0px', width: '25%' }}>
              <label>
                Thumbnail<sup>*</sup>
              </label>
              <Dropzone onDrop={this.onPublicationThumbnail}>
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
                      borderStyle: 'dotted',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%'
                    }}
                    {...getRootProps()}
                    className='dropzone'
                  >
                    <CardContent>
                      <input {...getInputProps()} />
                      <div>
                        {isDragAccept && 'All files will be accepted'}
                        {isDragReject && 'Some files will be rejected'}
                        {!isDragActive && 'Drop your Thumbnail here.'}
                      </div>
                      {fileIcon}
                    </CardContent>
                  </Card>
                )}
              </Dropzone>
              {/* <img src={publicationIconPreview} width='100px' /> */}
            </Grid.Row>
          ) : null}
          {/* </div> */}
        </div>
        <Grid.Row style={{ marginTop: '3%' }}>
          <Button
            disabled={
              !etype ||
              !ztype ||
              !file ||
              !iconCheck ||
              !publicationTitle ||
              loading
            }
            variant='contained'
            onClick={this.handleUpload}
          >
            Upload
          </Button>
          {/* <Button disabled={
            !iconCheck ||
              loading
          }variant='contained' onClick={this.handleUpload}>Upload</Button> */}
        </Grid.Row>
      </div>
    )
  }
}
const mapStateToProps = (state) => ({
  user: state.authentication.user
})

// export default UploadEbook
export default connect(mapStateToProps)(withRouter(UploadEbook))
