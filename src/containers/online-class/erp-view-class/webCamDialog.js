// import  React from 'react';
import React, { useContext, useState, useEffect, useRef } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ObjectDetection from './ObjectDetection';
import ImageSubmitted from './ImageSubmitted';

 const WebCamDialog = (props) => {
  const [webcam, setwebcam] = useState('')
  const [image, setImage] = useState(null);
  const [dimensions, setDimensions] = useState(null);
  const submitImage = (img, dim) => {
    setImage(img);
    setDimensions(dim);
    setwebcam('submitImage')
  };

  useEffect(()=>{
setwebcam('detectImage')
  },[])
  const reclickImage = () => {
    setwebcam('detectImage')
  }

  const handleClose = () => {
    debugger
    props.handleWebcam()
  };

  return (
    <div>
      <Dialog
        // fullScreen
        open={props.webOpen}
        onClose={handleClose}
      >
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              style = {{marginTop : '5%'}}
            >
              <CloseIcon />
            </IconButton>
         {webcam == 'detectImage' &&
          <ObjectDetection
            submitImage={submitImage}
          />}
          {
            webcam == 'submitImage' &&
            <ImageSubmitted
              image={image}
              dimensions={dimensions}
              reclickImage={reclickImage}
              handleUploadFile = {props.handleUploadFile}
              handleClose = {handleClose}
              handlewebcam ={props.handleWebcam}
            />
          }
      </Dialog>
    </div>
  );
}
export default WebCamDialog;
