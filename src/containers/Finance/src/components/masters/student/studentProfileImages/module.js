import React from 'react'
import axios from 'axios'
import { Button } from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import { urls } from '../../../../urls'
import ImgDropAndCaptureAndCrop from '../../../../ImgDropAndCaptureAndCrop/ImgDropAndCaptureAndCrop'
import Thumbs from '../../../../ImgDropAndCaptureAndCrop/thumbs'

class StudentProfileImageUpload extends React.Component {
  constructor () {
    super()
    this.state = {}
    let authToken = window.localStorage.getItem('id_token')
    this.headers = { headers: { Authorization: 'Bearer ' + authToken } }
  }
  componentWillMount () {
    let { sectionMappingId = undefined, studentId = undefined } = this.getRouteParams()
    this.setState({ sectionMappingId, studentId }, this.getImages)
  }
  getRouteParams = () => {
    let { match: { path, params: { sectionMappingId, studentId } } = {} } = this.props
    return { sectionMappingId, studentId, path }
  }
  getSearchParams = () => {
    let { location: { search = '' } = {} } = this.props
    const urlParams = new URLSearchParams(search) // search = ?open=true&qId=123
    const searchParamsObj = Object.fromEntries(urlParams) // {open: "true", def: "[asf]", xyz: "5"}
    return searchParamsObj
  }
  uploadImage = (file, imgVariant) => {
    let { studentId, sectionMappingId } = this.state
    if (!studentId || !file || !imgVariant) {
      // window.alert('params not found')
      this.props.alert.error('params not found')
      return
    }
    const formData = new FormData()
    formData.append('file', file)
    formData.append('student_id', studentId)
    formData.append('type_image', imgVariant)
    formData.append('section_mapping', sectionMappingId)
    let { ProfileImages } = urls
    let URL = ProfileImages
    axios
      .post(URL, formData, this.headers)
      .then(response => {
        if (response.status === 200) {
          let { status } = response.data
          // window.alert(status)
          this.props.alert.success(`${status}`)
          this.getImages()
        } else {
          let { status } = response.data
          // window.alert(status)
          this.props.alert.error(`${status}`)
        }
      })
      .catch(er => {
        let { response: { data = {} } = {} } = er
        let { status } = data || {}
        if (status) {
          // window.alert(status)
          this.props.alert.error(`${status}`)
        } else {
          this.props.alert.error(`Failed to upload, Please try again`)
          // window.alert('Failed to upload, Please try again')
        }
      })
  }
  getImages = () => {
    let { ProfileImages } = urls
    let URL = ProfileImages + '?'
    let { studentId, sectionMappingId } = this.state
    if (!studentId) {
      // window.alert('No student id found')
      this.props.alert.error('No student id found')
      return
    }
    URL += studentId ? `student_id=${studentId}&` : ''
    URL += sectionMappingId ? `section_mapping=${sectionMappingId}` : ''
    axios
      .get(URL, this.headers)
      .then(response => {
        if (response.status === 200) {
          let { data: responseData = [] } = response || {}
          if (responseData.length) {
            let { id, erp: studentErp, name: studentName, studentprofileimages: studentAllProfileImages = [] } = responseData[0]
            console.log(id)
            var studentProfileImages
            if (sectionMappingId) {
              // logic to get profile related to section mapping id
              studentProfileImages = studentAllProfileImages.filter(item => item.section_mapping === sectionMappingId)
            } else {
              studentProfileImages = studentAllProfileImages.length ? studentAllProfileImages : []
            }
            if (studentProfileImages.length) {
              let { frontal_image: frontalImage, left_sidewise: leftSidewise, right_sidewise: rightSidewise } = studentProfileImages[0]
              this.setState({ frontalImage, leftSidewise, rightSidewise })
            }
            this.setState({ studentName, studentErp })
          }
          this.setState({ responseData })
        }
      })
      .catch(er => {
        // window.alert('Failed to fetch Images, please try again')
        this.props.alert.error('Failed to fetch Images, please try again')
        console.log(er)
      })
  }
  sampleFrontImg = 'https://letseduvate.s3.ap-south-1.amazonaws.com/prod/media/student_profile/sample_images/frontwise.jpeg'
  sampleRightImg = 'https://letseduvate.s3.ap-south-1.amazonaws.com/prod/media/student_profile/sample_images/rightside_wise.jpeg'
  sampleLeftImg = 'https://letseduvate.s3.ap-south-1.amazonaws.com/prod/media/student_profile/sample_images/leftside_wise.jpeg'
  sampleImgRenderer = (imgSrc, label, alt) => {
    return <div style={{ textAlign: 'center', width: '50%' }}>
      <img style={{ height: '150px', width: '150px', maxWidth: '150px', maxHeight: '150px' }} src={imgSrc} alt={alt} />
      <h4 style={{ whiteSpace: 'pre-line' }}>
        {label}
      </h4>
    </div>
  }
  render () {
    let { frontalImage, leftSidewise, rightSidewise, studentErp, studentName } = this.state
    const divStyle = { borderTop: '0.75px solid rgb(184,186,188)', marginBottom: 20, paddingTop: 10 }
    return <div style={{ padding: 10, margin: 30 }}>
      <h4>Student Name: {studentName}<br />ERP: {studentErp}</h4>

      <div style={divStyle}>
        <div style={{ display: 'flex', maxWidth: '400px' }}>
          {frontalImage ? <Thumbs files={[ { preview: frontalImage, alt: 'Image not found' } ]} /> : ''}
          {this.sampleImgRenderer(this.sampleFrontImg, 'Sample \n frontal image', 'frontal sample image')}
        </div>
        <ImgDropAndCaptureAndCrop
          uploadImage={(file) => { this.uploadImage(file, 'frontal_image') }}
          label='frontal'
        // sampleImageSrc={''}
        />
      </div>
      <div style={divStyle}>
        <div style={{ display: 'flex', maxWidth: '400px' }}>
          {rightSidewise ? <Thumbs files={[{ preview: rightSidewise, alt: 'Image not found' }]} /> : ''}
          {this.sampleImgRenderer(this.sampleRightImg, 'Sample \n Right facial image\n( tilt face 45deg to * Left * )', 'rsw sample image')}
        </div>
        <ImgDropAndCaptureAndCrop
          uploadImage={(file) => { this.uploadImage(file, 'right_sidewise') }}
          label='Right side wise'
        // sampleImageSrc={''}
        />
      </div>
      <div style={divStyle}>
        <div style={{ display: 'flex', maxWidth: '400px' }}>
          {leftSidewise ? <Thumbs files={[{ preview: leftSidewise, alt: 'Image not found' }]} /> : ''}
          {this.sampleImgRenderer(this.sampleLeftImg, 'Sample \n Left facial image\n( tilt face 45deg to * Right *)', 'lsw sample image')}
        </div>
        <ImgDropAndCaptureAndCrop
          uploadImage={(file) => { this.uploadImage(file, 'left_sidewise') }}
          label='Left side wise'
        // sampleImageSrc={''}
        />
      </div>

      <Button
        onClick={this.props.history.goBack}
        variant='outlined'
      >
          Return
      </Button>
    </div>
  }
}
export default withRouter(StudentProfileImageUpload)
