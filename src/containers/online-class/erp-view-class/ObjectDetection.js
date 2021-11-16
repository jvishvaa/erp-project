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
  let count = 0;

  const videoStyle = {
    width: "98%",
    height: "75vh",
    padding: "1%",
  };

  useEffect(() => {
    console.log("hereeee");
    const modelLoaded = () => {
      console.log("Model loaded");
      setLoading(true)
    };

    videoElement.current = document.getElementById("videoElement");
    objectDetector.current = ml5.objectDetector("cocossd", modelLoaded);
    detectionInterval.current = setInterval(() => {
            detect();
          }, 200);

  }, []);

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



  return (
    <>
    {Loading && <Loader/>}
      <Webcam
        ref={videoRef}
        videoConstraints={videoConstraints}
        id="videoElement"
        style={videoStyle}
      />
    </>
  );
};

export default ObjectDetection;
