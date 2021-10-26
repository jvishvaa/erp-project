import React, { useContext } from 'react';
import Radio from '@material-ui/core/Radio';
import ReactHtmlParser from 'react-html-parser';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
// import FormLabel from '@material-ui/core/FormLabel';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { makeStyles } from '@material-ui/core';
import { AttachmentPreviewerContext } from '../../../../../components/attachment-previewer/attachment-previewer-contexts';
import endpoints from '../../../../../config/endpoints';
import { AssessmentHandlerContext } from '../../../assess-attemption/assess-attemption-context';
import '../../assess-attemption.css';

const useStyles = makeStyles((theme) => ({
  mcqOptions: {
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: '5px',
    background: theme.palette.primary.primarylightest,
    padding: '10px',
    width: '100%',
    textAlign: 'justify',
    justifyContent: 'space-between',
    /* max-width: 400px, */
    cursor: 'pointer',
    marginBottom: '10px',
  }
}))


const McqQuestion = (props) => {
  const classes = useStyles()
  const {
    controls: { attemptQuestion },
  } = useContext(AssessmentHandlerContext);

  const { questionObj: currentQuestionObj } = props || {};

  const {
    id: qId,
    question_answer: questionAnswer,
    user_response: { answer: existingAnswerArray } = {},
    is_central: isCentral = false,
  } = currentQuestionObj || {};

  const { openPreview, closePreview } =
    React.useContext(AttachmentPreviewerContext) || {};

  const [existingAnswer] = existingAnswerArray || [];

  const [{ options, question }] = questionAnswer || [];

  const s3Image = `${isCentral ? endpoints.s3 : endpoints.assessmentErp.s3}/`;
  const handleOptionValue = (event) => {
    attemptQuestion(qId, { attemption_status: true, answer: [event.target.value] });
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
        <div style={{ textAlign: 'justify', fontSize: "30px" }}>
          {ReactHtmlParser(question)}
        </div>
        {/* <img src='https://via.placeholder.com/150' alt='question image' /> */}
        {/* {options.map((option, index) => {
          return (
            <div
              ref={inputEl}
              className='mcq-options'
              onClick={() =>
                handleOptionValue(
                  index,
                  option[`option${(index + 1).toString()}`].optionValue
                )
              }
            >
              {option[`option${(index + 1).toString()}`].optionValue}
            </div>
          );
        })} */}
        <FormControl
          component='fieldset'
          // style={{ width: '80%' }}
          onChange={handleOptionValue}
        >
          {/* <FormLabel component='legend'>Options</FormLabel> */}
          <RadioGroup
            aria-label='gender'
            name='options'
            // value={currentQuestionObj?.user_response?.answer}
            value={existingAnswer}
            onChange={handleOptionValue}
          >
            <div
              className={classes.mcqOptions}
              style={{ display: 'grid', alignItems: 'center' }}
            >
              <FormControlLabel
                // className='mcq-options'
                value='option1'
                control={<Radio checked={existingAnswer === 'option1'} />}
                label={options[0]?.option1?.optionValue}
              />
              <div className='imageContainer'>
                {options[0]?.option1?.images?.length !== 0 ? (
                  <img
                    src={`${s3Image}${options[0]?.option1?.images[0]}`}
                    // className='underlineRemove'
                    onClick={() => {
                      const fileSrc = `${s3Image}${options[0]?.option1?.images[0]}`;
                      openPreview({
                        currentAttachmentIndex: 0,
                        attachmentsArray: [
                          {
                            src: fileSrc,
                            name: `demo`,
                            extension: '.png',
                          },
                        ],
                      });
                    }}
                  />
                ) : null}
              </div>
            </div>
            <div
              className={classes.mcqOptions}
              style={{ display: 'grid', alignItems: 'center' }}
            >
              <FormControlLabel
                // className={classes.mcqOptions}
                value='option2'
                control={<Radio checked={existingAnswer === 'option2'} />}
                label={options[1]?.option2?.optionValue}
              />
              <div className='imageContainer'>
                {options[1]?.option2?.images?.length !== 0 ? (
                  <img
                    src={`${s3Image}${options[1]?.option2?.images[0]}`}
                    // className='underlineRemove'
                    onClick={() => {
                      const fileSrc = `${s3Image}${options[1]?.option2?.images[0]}`;
                      openPreview({
                        currentAttachmentIndex: 0,
                        attachmentsArray: [
                          {
                            src: fileSrc,
                            name: `demo`,
                            extension: '.png',
                          },
                        ],
                      });
                    }}
                  />
                ) : null}
              </div>
            </div>
            {options[2]?.option3 ? (
              <div
                className={classes.mcqOptions}
                style={{ display: 'grid', alignItems: 'center' }}
              >
                <FormControlLabel
                  // className={classes.mcqOptions}
                  value='option3'
                  // control={<Radio />}
                  control={<Radio checked={existingAnswer === 'option3'} />}
                  label={options[2]?.option3?.optionValue}
                />

                <div className='imageContainer'>
                  {options[2]?.option3?.images?.length !== 0 ? (
                    <img
                      src={`${s3Image}${options[2]?.option3?.images[0]}`}
                      // className='underlineRemove'
                      onClick={() => {
                        // const fileSrc = `${endpoints.assessmentErp.s3}${obj?.media_file[0]}`;
                        const fileSrc = `${s3Image}${options[2]?.option3?.images[0]}`;
                        openPreview({
                          currentAttachmentIndex: 0,
                          attachmentsArray: [
                            {
                              src: fileSrc,
                              name: `demo`,
                              extension: '.png',
                            },
                          ],
                        });
                      }}
                    />
                  ) : null}
                </div>
              </div>
            ) : null}
            {options[3]?.option4 ? (
              <div
                className={classes.mcqOptions}
                style={{ display: 'grid', alignItems: 'center' }}
              >
                <FormControlLabel
                  // className={classes.mcqOptions}
                  value='option4'
                  // control={<Radio />}
                  control={<Radio checked={existingAnswer === 'option4'} />}
                  label={options[3]?.option4?.optionValue}
                />
                <div className='imageContainer'>
                  {options[3]?.option4?.images?.length !== 0 ? (
                    <img
                      // className='underlineRemove'
                      src={`${s3Image}${options[3]?.option4?.images[0]}`}
                      onClick={() => {
                        // const fileSrc = `${endpoints.assessmentErp.s3}${obj?.media_file[0]}`;
                        const fileSrc = `${s3Image}${options[3]?.option4?.images[0]}`;
                        openPreview({
                          currentAttachmentIndex: 0,
                          attachmentsArray: [
                            {
                              src: fileSrc,
                              name: `demo`,
                              extension: '.png',
                            },
                          ],
                        });
                      }}
                    />
                  ) : null}
                </div>
              </div>
            ) : null}
            {options[4]?.option5 ? (
              <div
                className={classes.mcqOptions}
                style={{ display: 'grid', alignItems: 'center' }}
              >
                <FormControlLabel
                  //  className='mcq-options'
                  value='option5'
                  // control={<Radio />}
                  control={<Radio checked={existingAnswer === 'option5'} />}
                  label={options[4]?.option5?.optionValue}
                />
                <div className='imageContainer'>
                  {options[4]?.option5?.images?.length !== 0 ? (
                    <img
                      // className='underlineRemove'
                      src={`${s3Image}${options[4]?.option5?.images[0]}`}
                      onClick={() => {
                        // const fileSrc = `${endpoints.assessmentErp.s3}${obj?.media_file[0]}`;
                        const fileSrc = `${s3Image}${options[4]?.option5?.images[0]}`;
                        openPreview({
                          currentAttachmentIndex: 0,
                          attachmentsArray: [
                            {
                              src: fileSrc,
                              name: `demo`,
                              extension: '.png',
                            },
                          ],
                        });
                      }}
                    />
                  ) : null}
                </div>
              </div>
            ) : null}
          </RadioGroup>
        </FormControl>
        {/* <div className='question-submit-btn' onClick={handleNextQuestion}>
          Next
        </div> */}
      </div>
    </div>
  );
};

export default McqQuestion;
