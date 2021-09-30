import React, { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { AssessmentHandlerContextProvider } from '../assess-attemption/assess-attemption-context';
import AssessmentAttemptionUI from './assess-attemption';

const AssessmentAttemption = (props) => {
  const { match: { params: { assessmentId } = {} } = {} } = props || {};
  const testContainerRef = useRef(null);

  function checkBrowserFullScreen() {
    window.addEventListener("keydown" || "keyup", function (e) {
      if (e.ctrlKey) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        return false
      }
    })

  }
  function openFullscreen() {
    const elem = document.getElementsByTagName('body')[0];
    if (elem.requestFullscreen) {
      // elem.requestFullscreen();
      elem.requestFullscreen({ navigationUI: "show" }).then(function () {
        checkBrowserFullScreen()
      })
        .catch(function (error) {
        });
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen({ navigationUI: "show" }).then(function () {
        checkBrowserFullScreen()
      })
        .catch(function (error) {
        });;
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen({ navigationUI: "show" }).then(function () {
        checkBrowserFullScreen()
      })
        .catch(function (error) {
        });;
    }
    else if (elem.mozRequestFullScreen) { /* Mozilla firefox */
      elem.mozRequestFullScreen({ navigationUI: "show" }).then(function () {
        checkBrowserFullScreen()
      })
        .catch(function (error) {
        });;
    }
  }
  useEffect(() => {
    openFullscreen()
    // toggleFullScreen()
  }, [])

  return (
    <>
      {/* <Layout> */}
      <div style={{ background: 'white' }} id="testContainer" ref={testContainerRef}>
        {/* <button onClick={openFullscreen}>Toggle</button> */}
        <AssessmentHandlerContextProvider assessmentId={assessmentId}>
          <AssessmentAttemptionUI />
        </AssessmentHandlerContextProvider>
      </div>
      {/* </Layout> */}
    </>
  );
};
export default withRouter(AssessmentAttemption);
