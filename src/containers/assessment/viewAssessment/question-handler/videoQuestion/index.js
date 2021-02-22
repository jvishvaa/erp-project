import React, { useContext, useState, useEffect, useRef } from 'react';
import '../../viewAssessment.css';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import ReactHtmlParser from 'react-html-parser';
import { AssessmentHandlerContext } from '../../../assess-attemption/assess-attemption-context';
import TinyMce from '../../../../../components/TinyMCE/tinyMce';

const VideoQuestion = (props) => {
  const {
    assessmentQp: { fetching },
    fetchAssessmentQp,

    questionsDataObj,
    questionsArray,
    controls: {
      selectQues,
      nextQues,
      //   prevQues,
      attemptQuestion,
      isStarted,
      currentQuesionId,
      start,
      //   startedAt,
    },
  } = useContext(AssessmentHandlerContext);

  // const { [currentQuesionId]: currentQuestionObj = {} } = questionsDataObj || {};
  const { questionObj: currentQuestionObj } = props || {};

  const {
    id: qId,
    question_type: questionType,
    meta: { index: qIndex } = {},
    question_answer,
    user_response: { attemption_status: attemptionStatus } = {},
  } = currentQuestionObj || {};

  const [{ answer, options, question, video }] = question_answer;
  //   const [optionSelected, setOptionSelected] = React.useState(null);
  const [textEditorContent, setTextEditorContent] = useState('');
  // const [isChecked, setIsChecked] = useState([]);
  useEffect(() => {
    console.log('is CHecked: ', currentQuestionObj);
    // if (currentQuestionObj?.user_response?.attemptionStatus) {
    //   console.log('selected answer: ', currentQuestionObj?.user_response);
    //   setOptionSelected(currentQuestionObj?.user_response?.answer);
    // }
  }, []);

  function removeTags(str) {
    if (str === null || str === '') return false;
    str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, '');
  }

  const handleNextQuestion = () => {
    nextQues(qId);
  };

  const handleTextEditor = (event) => {
    // console.log('from editor', e);
    setTextEditorContent(event);
    attemptQuestion(qId, { attemption_status: true, answer: event });
  };
  return (
    <div>
      {/* <div className='question-header'>
        Description specific to this test to be followed by all appearing students/pupils
        / attendees (Write if req. else leave empty)
      </div>
      <div className='question-numbers'>
        <div>{qIndex + 1}</div>
        <div>
          Progress - {qIndex + 1}/{questionsArray.length}
        </div>
      </div> */}
      <div className='mcq-question-wrapper'>
        <h3>{ReactHtmlParser(question)}</h3>
        <video width='100%' height='500' controls>
          <source src={video} type='video/mp4' />
        </video>

        <TinyMce
          key={1}
          id={1}
          get={handleTextEditor}
          content={currentQuestionObj?.user_response?.answer}
        />
        {/* <div className='question-submit-btn' onClick={handleNextQuestion}>
          Next
        </div> */}
      </div>
    </div>
  );
};

export default VideoQuestion;
