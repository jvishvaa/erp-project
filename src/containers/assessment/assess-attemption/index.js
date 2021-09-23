import React, { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { AssessmentHandlerContextProvider } from '../assess-attemption/assess-attemption-context';
import AssessmentAttemptionUI from './assess-attemption';
import Layout from '../../Layout';
import { ContactSupportOutlined, Keyboard } from '@material-ui/icons';

const AssessmentAttemption = (props) => {
  const { match: { params: { assessmentId } = {} } = {} } = props || {};
  const testContainerRef = useRef(null);
  function openFullscreen() {
    const elem = document.getElementById('testContainer');
    elem.requestFullscreen({ navigationUI: "show" }).then(function () {
      window.addEventListener("keydown", function (e) {

        let flag = false;
        if (e.keyCode == "27") {
          e = e || window.event;
          var isEscape = false;
          if ("key" in e) {
            isEscape = (e.key === "Escape" || e.key === "Esc");
          }
          // else {
          //   isEscape = (e.keyCode === "27");
          // }
          if (isEscape) {
            alert("Escape");
          }
          // e.preventDefault()
          // flag = true
          // submit()
          // setIsAutoSubmit(prev => !prev);
          flag = true;
        }
        if (e.ctrlKey && e.keyCode == "78") {
          flag = true;
          // For CTRL + N new tab
        }
        if (e.code == "AltLeft" && e.key == "9") {
          flag = "true"
        }
        if (e.ctrlKey && e.keyCode == "82") {
          flag = true;
          // for CTRL + R refresh
        }
        if (e.ctrlKey && e.keyCode == "73") {
          flag = true;
          // for CTRL + Shift + I inspect
        }
        if (e.ctrlKey && e.keyCode == "84") {
          flag = true;
          // for CTRL + Shift + T previous tab
        }
        if (flag) {
          e.preventDefault ? e.preventDefault() : e.returnValue = false;
          return false
        }
      })

    })
      .catch(function (error) {
      });
  }
  useEffect(() => {
    openFullscreen()
    // toggleFullScreen()
  }, [])

  return (
    <>
      {/* <Layout> */}
      <div style={{ background: 'white', overflow: 'auto ' }} id="testContainer" ref={testContainerRef}>
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
