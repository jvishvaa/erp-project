import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import ml5 from "ml5";
import Loader from "components/loader/loader";
const ObjectDetection = (props) => {
  const videoRef = useRef(null);
  const [Loading,setLoading] = useState(true)
  const image = useRef(null);
  const objectDetector = useRef(null);
  const detectionInterval = useRef(null);
  const videoElement = useRef(null);
  const videoConstraints = {
    facingMode: "user",
  };
  const width = 480;
  const height = 360
  let canvas, ctx;
  let count = 0;
  const videoStyle = {
    width: width,
    height: height,
  };
  useEffect(() => {
    const modelLoaded = () => {
      setLoading(true)
    };
    videoElement.current = document.getElementById("videoElement");
    objectDetector.current = ml5.objectDetector("cocossd", modelLoaded);
    canvas = createCanvas(width,height)
    ctx = canvas.getContext("2d");
    detectionInterval.current = setInterval(() => {
            detect();
          }, 200);
  }, []);
  const draw = (objects,detected) => {
    // Clear part of the canvas
    // ctx.fillStyle = "#000000"
    ctx.clearRect(0,0, width,height);
    // ctx.drawImage(videoRef.current.video, 0, 0);
    for (let i = 0; i < objects.length; i += 1) {
        const label = detected ? objects[i].label : "trying to detect classwork ...";
      ctx.font = "16px Arial";
      ctx.fillStyle = "red";
      ctx.fillText(label, objects[i].x + 4, objects[i].y + 16);
      ctx.beginPath();
      ctx.rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
      ctx.strokeStyle = "red";
      ctx.stroke();
      ctx.closePath();
    }
  }
  const detect = () => {
    if (videoRef.current) {
      if (videoRef.current.video.readyState !== 4) {
        console.warn("Video not ready yet");
        return;
      }
      objectDetector.current.detect(videoRef.current.video, (err, results) => {
        setLoading(false)
        console.log(results,'@@')
        if (results && results.length) {
          results.forEach((detection) => {
            draw(results,detection.label === "book"? true:false)
            if (detection.label === "book") {
              console.log("here");
              count++;
            }
            if (count > 10) {
              image.current = videoRef.current.getScreenshot();
              console.log(detection);
              props.submitImage(image.current, detection);
            }
          });
        }
      });
    }
  };
  const createCanvas=(w, h)=>{
    const canvas = document.createElement("canvas");
    canvas.width  = w;
    canvas.height = h;
    canvas.style.position = "absolute"
    document.getElementById("webCamContainer").prepend(canvas);

    return canvas;
  }
  return (
    <div id = "webCamContainer">
        {Loading && <Loader/>}
        <Webcam
            ref={videoRef}
            videoConstraints={videoConstraints}
            id="videoElement"
            style={videoStyle}
            screenshotQuality = {1}
        />
    </div>
  );
};
export default ObjectDetection;