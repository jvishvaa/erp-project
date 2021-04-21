import React from 'react'
import axios from 'axios'
import { urls } from '../urls'
import ImgDropAndCaptureAndCrop from './ImgDropAndCaptureAndCrop'
import Thumbs from './thumbs'

class StudentProfileImages extends React.Component {
  constructor () {
    super()
    this.state = {}
    let authToken = window.localStorage.getItem('id_token')
    this.headers = { headers: { Authorization: 'Bearer ' + authToken } }
  }
  uploadImage = (file, imgVariant) => {
    let { studentId = 37954, sectionMappingId = 6862 } = this.state
    if (!studentId || !sectionMappingId || !file || !imgVariant) {
      window.alert('params not found')
    }
    const formData = new FormData()
    formData.append('file', file)
    formData.append('student_id', studentId)
    formData.append('type_image', imgVariant)
    formData.append('section_mapping', sectionMappingId)
    let { BASE } = urls
    let URL = BASE + '/accounts/student/profile_images/'
    axios
      .post(URL, formData, this.headers)
      .then(response => {
        if (response.status === 200) {
          let { status } = response.data
          window.alert(status)
        } else {
          let { status } = response.data
          window.alert(status)
        }
      })
      .catch(er => {
        let { response: { data = {} } = {} } = er
        let { status } = data || {}
        window.alert(status)
      })
  }
  getImages = () => {
    let { BASE } = urls
    let URL = BASE + '/accounts/student/profile_images/?'
    // let { studentId, sectionMappingId } = this.state
    let { studentId = 37954, sectionMappingId = 6862 } = this.state
    if (!studentId) {
      window.alert('No student id found')
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
            var studentProfileImages = studentAllProfileImages.filter(item => item.section_mapping === sectionMappingId)
            if (studentProfileImages.length) {
              let { frontal_image: frontalImage, left_sidewise: leftSidewise, right_sidewise: rightSidewise } = studentProfileImages[0]
              this.setState({ frontalImage, leftSidewise, rightSidewise, studentErp, studentName })
            }
          }
          this.setState({ responseData })
        }
      })
      .catch(er => {
        window.alert('errorerrr')
        console.log(er)
      })
  }
  componentWillMount () {
    this.getImages()
  }
  render () {
    let { frontalImage, leftSidewise, rightSidewise, studentErp, studentName } = this.state
    const divStyle = { border: '0.75px solid rgb(184,186,188)', margin: 30 }
    return <div>
      {/* <button onClick={this.getImages}>get</button> */}
      <h4>Student Name: {studentName}<br />ERP: {studentErp}</h4>
      <div style={divStyle}>
        {frontalImage ? <Thumbs files={[{ preview: frontalImage, alt: 'Image not found' }]} /> : ''}
        <ImgDropAndCaptureAndCrop uploadImage={(file) => { this.uploadImage(file, 'frontal_image') }} label='frontal' sampleImageSrc={''} />
      </div>
      <div style={divStyle}>
        {rightSidewise ? <Thumbs files={[{ preview: rightSidewise, alt: 'Image not found' }]} /> : ''}
        <ImgDropAndCaptureAndCrop uploadImage={(file) => { this.uploadImage(file, 'right_sidewise') }} label='Right side wise' sampleImageSrc={''} />
      </div>
      <div style={divStyle}>
        {leftSidewise ? <Thumbs files={[{ preview: leftSidewise, alt: 'Image not found' }]} /> : ''}
        <ImgDropAndCaptureAndCrop uploadImage={(file) => { this.uploadImage(file, 'left_sidewise') }} label='Left side wise' sampleImageSrc={''} />
      </div>
    </div>
  }
}
export default StudentProfileImages
