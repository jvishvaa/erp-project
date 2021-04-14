import React, { Component } from 'react'
import { Button } from '@material-ui/core'

export class CameraFeed extends Component {
  /**
     * Processes available devices and identifies one by the label
     * @memberof CameraFeed
     * @instance
     */
  processDevices (devices) {
    devices.forEach(device => {
      console.log(device.label)
      this.setDevice(device)
    })
  }

  stopStreamingDevices (devices) {
    this.videoPlayer.srcObject.getTracks().forEach(function (track) {
      track.stop()
    })
  }
  //   async removeDevice (device) {
  //     this.videoPlayer.srcObject.getTracks().forEach(function (track) {
  //       track.stop()
  //     })
  //   }
  /**
     * Sets the active device and starts playing the feed
     * @memberof CameraFeed
     * @instance
     */
  async setDevice (device) {
    const { deviceId } = device
    const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { deviceId } })
    this.videoPlayer.srcObject = stream
    this.videoPlayer.play()
  }

  /**
     * On mount, grab the users connected devices and process them
     * @memberof CameraFeed
     * @instance
     * @override
     */
  async componentDidMount () {
    // const cameras = await navigator.mediaDevices.enumerateDevices()
    // this.processDevices(cameras)
    this.handler()
  }
  handler=async () => {
    const cameras = await navigator.mediaDevices.enumerateDevices()
    this.processDevices(cameras)
  }

    /**
     * Handles taking a still image from the video feed on the camera
     * @memberof CameraFeed
     * @instance
     */
    takePhoto = (event) => {
      if (event) {
        event.stopPropagation()
      }
      const { sendFile } = this.props
      const context = this.canvas.getContext('2d')
      context.drawImage(this.videoPlayer, 0, 0, 680, 360)
      this.canvas.toBlob(sendFile)
      this.stopStreamingDevices()
    };

    render () {
      return (
        <div className='c-camera-feed'>
          <div className='c-camera-feed__viewer'>
            <video ref={ref => (this.videoPlayer = ref)} width='680' heigh='360' />
          </div>
          <Button variant='contained' color='primary' onClick={e => { this.takePhoto(e) }}>Take photo!</Button>
          {/* <button onClick={this.handler}>reTake photo!</button> */}
          <div className='c-camera-feed__stage'>
            <canvas width='680' height='360' ref={ref => (this.canvas = ref)} />
          </div>
        </div>
      )
    }
}

export default CameraFeed
