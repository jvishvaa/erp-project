import React, { useEffect, useRef } from "react";
import axios from "axios";
import Button from '@material-ui/core/Button';

const ImageSubmitted = (props) => {
  const width = window.innerWidth * 0.5,
    height = window.innerHeight * 0.75;
  const canvas = useRef(null);
  const ctx = useRef(null);

  useEffect(() => {
    // postImage();
    canvas.current = document.getElementById("canvas");
    ctx.current = canvas.current.getContext("2d");
    const image = document.getElementById("source");
    canvas.current.width = width;
    canvas.current.height = height;
    image.style.display = "none";
    debugger
    ctx.current.drawImage(
      image,
      props.dimensions.x,
      props.dimensions.y,
      props.dimensions.width,
      props.dimensions.height,
      (canvas.current.width - props.dimensions.width) * 0.5,
      (canvas.current.height - props.dimensions.height) * 0.5,
      props.dimensions.width + 100,
      props.dimensions.height + 100
    );
  }, []);

  const base64StringtoFile = (filename) => {
    let base64String = canvas.current.toDataURL();
    let arr = base64String.split(",");
    let mime = arr[0].match(/:(.*?);/)[1];
    // eslint-disable-next-line no-undef
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    // eslint-disable-next-line no-undef
    return new File([u8arr], filename, { type: mime });
  };

  function postImage() {
    if (props.image) {
      let fileName = String(new Date().getTime()) + ".png";
      const response = base64StringtoFile(fileName);
      props.handleUploadFile(response);
      props.handleClose()
      props.handlewebcam()
    } else {
      console.log("Didn't get the image")
    }
  }

  function reclickImage() {
    props.reclickImage();
  }

  return (
    <div>
      <canvas id="canvas" width="-webkit-fill-available"></canvas>
      <img
        id="source"
        src={props.image}
        width={width}
        height={height}
        alt="homework"
      />
      <div className="webcambtn" style = {{marginLeft:"40%"}}
>
        <Button
          color="primary"
          variant="contained"
          onClick={postImage}
          style = {{color: "white"}}
          >
          Submit
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={reclickImage}
          style = {{color: "white",marginLeft:"10%"}}
          >
          Retake</Button>
      </div>
    </div>
  );
};

export default ImageSubmitted;
