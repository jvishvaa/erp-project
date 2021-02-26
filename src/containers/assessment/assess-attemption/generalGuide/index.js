import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ReactHtmlParser from 'react-html-parser';

function GeneralInstruction({ text, handleClose }) {
  const defaultText = "<ol type='i'><li>All questions are compulsory. </li></ol>";
  return (
    <>
      <div style={{ zIndex: 20, paddingTop: 30, maxHeight: '80vh', overflowY: 'auto' }}>
        <h2>
          Instructions:
          {handleClose ? (
            <IconButton
              aria-label='close'
              onClick={handleClose}
              style={{ float: 'right' }}
            >
              <CloseIcon color='secondary' />
            </IconButton>
          ) : null}
        </h2>
        {ReactHtmlParser(text || defaultText)}
        <br />
        <br />
        <hr />
        <br />
        <h4>Before beginning the exam:</h4>
        <ol type='i'>
          <li>Make sure you have a good internet connection.</li>
          <li>
            Maximize your browser window before starting the test. Minimizing the browser
            window during the exam can prevent the submission of your exam.
          </li>
        </ol>
        <br />
        <h4>During the exam:</h4>
        <ol type='i'>
          <li>Do not resize (minimize) the browser during the test.</li>
          <li>
            Click the “Submit” button to submit your exam. Do not press “Enter” on the
            keyboard to submit the exam.
          </li>
        </ol>
      </div>
    </>
  );
}

export default GeneralInstruction;

// return (
//   <div>
//     <h2>General Instruction</h2>
//     <ol type='i'>
//       <li>
//         This question paper is divided into three sections: <br />
//         Section A – Reading <br />
//         Section B – Writing and Grammar <br />
//         Section C – Literature <br />
//       </li>
//       <li>All questions are compulsory. </li>
//       <li>You may attempt any section at a time.</li>
//       <li>
//         All questions of that particular section must be attempted in the correct order.
//       </li>
//     </ol>
//   </div>
// );
