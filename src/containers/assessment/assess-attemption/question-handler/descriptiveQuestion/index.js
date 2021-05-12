// import React, { useState, useContext, useEffect } from 'react';
// import '../../assess-attemption.css';
// import { TextareaAutosize } from '@material-ui/core';
// import ReactHtmlParser from 'react-html-parser';
// import TinyMce from '../../../../../components/TinyMCE/tinyMce';
// import { AssessmentHandlerContext } from '../../../assess-attemption/assess-attemption-context';

// const DescriptiveQuestion = () => {
//   const {
//     assessmentQp: { fetching },
//     fetchAssessmentQp,

//     questionsDataObj,
//     questionsArray,
//     controls: {
//       selectQues,
//       nextQues,
//       //   prevQues,
//       attemptQuestion,
//       isStarted,
//       currentQuesionId,
//       start,
//       //   startedAt,
//     },
//   } = useContext(AssessmentHandlerContext);

//   const { [currentQuesionId]: currentQuestionObj = {} } = questionsDataObj || {};

//   const {
//     id: qId,
//     question_type: questionType,
//     meta: { index: qIndex } = {},
//     question_answer,
//     user_response: { attemption_status: attemptionStatus } = {},
//   } = currentQuestionObj || {};

//   const [{ answer, options, question }] = question_answer;
//   const [textEditorContent, setTextEditorContent] = useState('');
//   const handleTextEditor = (event) => {
//     setTextEditorContent(event);
//     attemptQuestion(qId, { attemption_status: true, answer: event });
//   };

//   const handleNextQuestion = () => {
//     nextQues(qId);
//   };
//   return (
//     <div>
//       {/* <div className='question-header'>
//         Description specific to this test to be followed by all appearing students/pupils
//         / attendees (Write if req. else leave empty)
//       </div>
//       <div className='question-numbers'>
//         <div>{qIndex + 1}</div>
//         <div>
//           Progress - {qIndex + 1}/{questionsArray.length}
//         </div>
//       </div> */}
//       <div className='mcq-question-wrapper'>
//         <p>{ReactHtmlParser(question)}</p>
//         {/* <h3>Question about the passage</h3> */}
//         {/* <img src='https://via.placeholder.com/150' alt='question image' /> */}
//         {/* <TextareaAutosize
//           rowsMax={100}
//           style={{ width: '100%', minHeight: '300px' }}
//           aria-label='maximum height'
//           placeholder='Maximum 4 rows'
//           defaultValue='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
//                 ut labore et dolore magna aliqua.'
//         /> */}
//         <TinyMce
//           key={1}
//           id={1}
//           get={handleTextEditor}
//           content={currentQuestionObj?.user_response?.answer}
//         />
//         {/* <div className='question-submit-btn' onClick={handleNextQuestion}>
//           Next
//         </div> */}
//       </div>
//     </div>
//   );
// };

// export default DescriptiveQuestion;


import React, { useState, useContext, useEffect } from 'react';
import '../../assess-attemption.css';
// import { TextareaAutosize } from '@material-ui/core';
import ReactHtmlParser from 'react-html-parser';
// import TinyMce from '../../../../../components/TinyMCE/tinyMce';
import MyTinyEditor from '../../../../question-bank/create-question/tinymce-editor';
import { AssessmentHandlerContext } from '../../../assess-attemption/assess-attemption-context';

const DescriptiveQuestion = () => {
  const {
    assessmentQp: { fetching },
    fetchAssessmentQp,
    questionsDataObj,
    questionsArray,
    controls: {
      selectQues,
      nextQues,
      attemptQuestion,
      isStarted,
      currentQuesionId,
      start,
    },
  } = useContext(AssessmentHandlerContext);

  const { [currentQuesionId]: currentQuestionObj = {} } = questionsDataObj || {};

  const {
    id: qId,
    question_type: questionType,
    meta: { index: qIndex } = {},
    question_answer,
    user_response: { attemption_status: attemptionStatus } = {},
  } = currentQuestionObj || {};
  const [{ answer, options, question }] = question_answer;
  const [textEditorContent, setTextEditorContent] = useState('');

  const handleEditorChange = (content, editor) => {
    content = content.replace(/&nbsp;/g, '');
    // editor?.getContent({ format: 'text' })
    setTextEditorContent(content);
    attemptQuestion(qId, {
      attemption_status: true,
      answer: content,
    });
  };

  // useEffect(() => {
  //  setTextEditorContent(currentQuestionObj?.user_response?.answer);
  // },[currentQuestionObj?.id])

  return (
    <div>
      <div className='mcq-question-wrapper'>
        <p className='descriptive_question_header'>{ReactHtmlParser(question)}</p>
        <MyTinyEditor
          id={`userId${currentQuestionObj?.id}`}
          content={currentQuestionObj?.user_response?.answer}
          handleEditorChange={handleEditorChange}
          placeholder='Answer...'
        />
      </div>
    </div>
  );
};

export default DescriptiveQuestion;