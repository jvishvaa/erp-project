import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import ReactCrop from 'react-image-crop'
import { Button } from '@material-ui/core'
import './custom-image-crop.css'
import CameraFeed from './camera-feed'
import {
  base64StringtoFile,
  downloadBase64File,
  extractImageFileExtensionFromBase64,
  image64toCanvasRef
} from './ReusableUtils'
import Thumbs from './thumbs'

const imageMaxSize = 1000000000 // bytes
const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif'
const acceptedFileTypesArray = acceptedFileTypes.split(',').map((item) => { return item.trim() })
const dropzoneStyles = {
  border: '2px solid rgb(219,226,241)',
  backgroundColor: 'rgb(246,249,254)',
  minHeight: '100px',
  minWidth: '400px',
  width: '50vw'
  // maxWidth: '500px'
}
class ImgDropAndCaptureAndCrop extends Component {
  constructor (props) {
    super(props)
    this.imagePreviewCanvasRef = React.createRef()
    // this.fileInputRef = React.createRef()
    this.state = {
      imgSrc: null,
      imgSrcExt: null,
      crop: {
        aspect: 1 / 1
        // width: 500,
        // height: 500
      }
    }
  }

  verifyFile = (files) => {
    if (files && files.length > 0) {
      const currentFile = files[0]
      const currentFileType = currentFile.type
      const currentFileSize = currentFile.size
      if (currentFileSize > imageMaxSize) {
        window.alert('This file is not allowed. ' + currentFileSize + ' bytes is too large')
        return false
      }
      if (!acceptedFileTypesArray.includes(currentFileType)) {
        window.alert('This file is not allowed. Only images are allowed.')
        return false
      }
      return true
    }
  }

  handleOnDrop = (files, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      this.verifyFile(rejectedFiles)
    }
    if (files && files.length > 0) {
      const isVerified = this.verifyFile(files)
      if (isVerified) {
        // imageBase64Data
        const currentFile = files[0]
        Object.assign(currentFile, { preview: URL.createObjectURL(currentFile) })
        const myFileItemReader = new FileReader()
        myFileItemReader.addEventListener('load', () => {
          // console.log(myFileItemReader.result)
          const myResult = myFileItemReader.result
          this.setState({
            imgSrc: myResult,
            imgSrcExt: extractImageFileExtensionFromBase64(myResult),
            currentFile
          })
        }, false)

        myFileItemReader.readAsDataURL(currentFile)
      }
    }
  }

  handleImageLoaded = (image) => {
    // console.log(image)
  }
  handleOnCropChange = (crop) => {
    // eslint-disable-next-line no-debugger
    //   debugger
    this.setState({ crop: {
      ...crop
      // width: 500,
      // height: 500
    } })
  }
  handleOnCropComplete = (crop, pixelCrop) => {
    // console.log(crop, pixelCrop)
    const canvasRef = this.imagePreviewCanvasRef.current
    const { imgSrc } = this.state
    //   image64toCanvasRef(canvasRef, imgSrc, pixelCrop)
    image64toCanvasRef(canvasRef, imgSrc, crop)
    let { width, height } = crop
    if (width && height) {
      this.updateCurrentFile()
    }
  }
  handleDownloadClick = (event) => {
    event.preventDefault()
    const { imgSrc } = this.state
    if (imgSrc) {
      const canvasRef = this.imagePreviewCanvasRef.current

      const { imgSrcExt } = this.state
      const imageData64 = canvasRef.toDataURL('image/' + imgSrcExt)

      const myFilename = 'previewFile.' + imgSrcExt

      // file to be uploaded
      const myNewCroppedFile = base64StringtoFile(imageData64, myFilename)
      console.log(myNewCroppedFile)
      // download file
      downloadBase64File(imageData64, myFilename)
      // this.handleClearToDefault()
      Object.assign(myNewCroppedFile, { preview: URL.createObjectURL(myNewCroppedFile) })
      this.setState({ currentFile: myNewCroppedFile })
    }
  }
  updateCurrentFile = (callback) => {
    const { imgSrc } = this.state
    if (imgSrc) {
      const canvasRef = this.imagePreviewCanvasRef.current

      const { imgSrcExt } = this.state
      const imageData64 = canvasRef.toDataURL('image/' + imgSrcExt)

      const myFilename = 'previewFile.' + imgSrcExt

      // file to be uploaded
      const myNewCroppedFile = base64StringtoFile(imageData64, myFilename)
      Object.assign(myNewCroppedFile, { preview: URL.createObjectURL(myNewCroppedFile) })
      this.setState({ currentFile: myNewCroppedFile }, () => {
        if (callback) {
          callback(this.state.currentFile)
        }
      })
    }
  }
  upload = () => {
    // this.updateCurrentFile(this.uploadImage)
    this.props.uploadImage(this.state.currentFile)
  }

  handleClearToDefault = event => {
    if (event) event.preventDefault()
    const canvas = this.imagePreviewCanvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    this.setState({
      imgSrc: null,
      imgSrcExt: null,
      crop: {
        aspect: 1 / 1
      },
      cropImage: null
    })
    // this.fileInputRef.current.value = null
  }

  handleFileSelect = event => {
    // console.log(event)
    const files = event.target.files
    if (files && files.length > 0) {
      const isVerified = this.verifyFile(files)
      if (isVerified) {
        // imageBase64Data
        const currentFile = files[0]
        const myFileItemReader = new FileReader()
        myFileItemReader.addEventListener('load', () => {
          // console.log(myFileItemReader.result)
          const myResult = myFileItemReader.result
          this.setState({
            imgSrc: myResult,
            imgSrcExt: extractImageFileExtensionFromBase64(myResult)
          })
        }, false)

        myFileItemReader.readAsDataURL(currentFile)
      }
    }
  }
  captureImage = async blob => {
    const formData = new FormData()
    formData.append('blob', blob)
    // var fileObj = formData.get('file')
    const fileObj = Object.assign(blob, { preview: URL.createObjectURL(blob) })
    // this.setState({ files: [files] })
    this.handleOnDrop([fileObj], [])
    this.setState({ isCaptureImage: null })
  }
  isMobile = () => {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i
    ]

    return toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem)
    })
  }
  render () {
    const { imgSrc } = this.state
    console.log(this.state, 'mk')
    return (
      <div>
        {/* <h1>Drop and Crop</h1> */}
        <h3 style={{ marginBottom: 0 }}>
          <small>{this.props.label}:</small>
        </h3>
        {/* <input ref={this.fileInputRef} type='file' accept={acceptedFileTypes} multiple={false} onChange={this.handleFileSelect} /> */}
        {/* {imgSrc !== null
          ?  */}

        {
          this.state.cropImage &&
          // <div style={{ border: '1px solid red' }}>
          <React.Fragment>
            <ReactCrop
              src={imgSrc}
              crop={this.state.crop}
              onImageLoaded={this.handleImageLoaded}
              onComplete={this.handleOnCropComplete}
              onChange={this.handleOnCropChange}
            />
            {/* <br /> */}
            {/* <p>Preview Canvas Crop </p>
                <canvas ref={this.imagePreviewCanvasRef} />
                <button variant='outlined' onClick={this.handleDownloadClick}>Download</button>
                <button variant='outlined' onClick={this.handleClearToDefault}>Clear</button> */}
          </React.Fragment>
          // </div>
        }

        {/* :  */}
        <Dropzone onDrop={this.handleOnDrop} accept={acceptedFileTypes} multiple={false} maxSize={imageMaxSize}>

          {
            ({ getInputProps, getRootProps }) => {
              return <div
                className='dropzone'
                style={dropzoneStyles}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {imgSrc
                  ? <div
                    style={{
                      display: 'flex'

                    }}
                  >

                    {
                      this.state.cropImage ? <div><p>Preview Canvas Crop </p>
                        <canvas ref={this.imagePreviewCanvasRef} />
                        <Button variant='outlined' onClick={this.handleDownloadClick}>Download</Button>
                        <Button variant='outlined' color='secondary' onClick={this.handleClearToDefault}>Clear</Button></div>
                        : <Thumbs files={[this.state.currentFile]} />
                    }
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column-reverse',
                        justifyContent: 'space-evenly'
                      }}>
                      {/* <Button variant='outlined' onClick={(e) => {
                        e.stopPropagation()
                        window.open(this.props.sampleImageSrc)
                      }}
                      >View Sample Image</Button> */}

                      <Button variant='outlined' color='primary' onClick={(e) => {
                        e.stopPropagation()
                        this.upload()
                      }}>upload Image</Button>
                      <Button variant='outlined' onClick={(e) => { }}>Re choose Image</Button>
                      <Button variant='outlined' onClick={
                        e => {
                          e.stopPropagation()
                          this.setState({ imgSrc: null,
                            imgSrcExt: null,
                            crop: {
                              aspect: 1 / 1
                            } })
                        }
                      }>Clear</Button>

                      {!this.state.cropImage ? <Button variant='outlined' onClick={(e) => {
                        e.stopPropagation()
                        this.setState({ cropImage: true })
                      }}>Crop Image</Button> : ''}

                    </div>
                  </div>
                  : <p>
                    Drop image here or click to upload&nbsp;
                    {
                      this.isMobile()
                        ? ''
                        : <React.Fragment>
                          <Button variant='outlined' onClick={(e) => {
                            e.stopPropagation()
                            this.setState({ isCaptureImage: true, cropImage: false })
                          }}>or Capture Image</Button>
                          {this.state.isCaptureImage && <CameraFeed sendFile={this.captureImage} />}
                        </React.Fragment>
                    }
                    {/* &nbsp;<Button variant='outlined' onClick={(e) => {
                      e.stopPropagation()
                      window.open(this.props.sampleImageSrc)
                    }}
                    >View Sample Image</Button> */}

                  </p>
                }
              </div>
            }
          }
        </Dropzone>
        {/* } */}
        {/* {this.state.currentFile && <Button variant='outlined' onClick={() => { this.upload() }}>upload Image</Button>} */}
      </div>
    )
  }
}

export default ImgDropAndCaptureAndCrop
