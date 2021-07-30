import React, { useContext } from 'react';
// import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';
import ReactHtmlParser from 'react-html-parser';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { IconButton, SvgIcon, Button } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { AttachmentPreviewerContext } from '../../../../../components/attachment-previewer/attachment-previewer-contexts';
// import FormLabel from '@material-ui/core/FormLabel';

import { AssessmentHandlerContext } from '../../../assess-attemption/assess-attemption-context';
import '../../assess-attemption.css';

const McqQuestionMultiAnswer = (props) => {
  const {
    controls: { attemptQuestion },
  } = useContext(AssessmentHandlerContext);

  const { questionObj: currentQuestionObj } = props || {};
  const { openPreview, closePreview } =
    React.useContext(AttachmentPreviewerContext) || {};

  const {
    id: qId,
    question_answer: questionAnswer,
    user_response: { answer: existingAnswer = [] } = {},
  } = currentQuestionObj || {};

  const [{ options, question }] = questionAnswer || [];

  const s3Image = "https://erp-revamp.s3.ap-south-1.amazonaws.com/"

  const handleOptionValue = (event) => {
    const { value, checked } = event.target;
    const answersArray = [...(existingAnswer || [])];
    if (checked) {
      if (answersArray.includes(value)) {
      } else {
        answersArray.push(value);
      }
    } else {
      const itemIndex = answersArray.indexOf(value);
      answersArray.splice(itemIndex, 1);
    }
    attemptQuestion(qId, { attemption_status: true, answer: answersArray });
  };

  return (
    <div>
      <div className='mcq-question-wrapper'>
        <h3>{ReactHtmlParser(question)}</h3>
        <FormControl component='fieldset' onChange={handleOptionValue}>
          {/* <FormLabel component='legend'>Options</FormLabel> */}
          <RadioGroup
            aria-label='gender'
            name='options'
            value={existingAnswer}
            onChange={handleOptionValue}
          >
            <div className='mcq-options' style={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                // className='mcq-options'
                value='option1'
                checked={existingAnswer.includes('option1')}
                control={<Checkbox />}
                label={options[0].option1.optionValue}
              />
              <div>
                {options[0]?.option1?.images.length !== 0 ? (
                  <a
                    className='underlineRemove'
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
                  >
                    <SvgIcon component={() => <VisibilityIcon />} />
                  </a>
                ) : null}
              </div>
            </div>

            <div className='mcq-options' style={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                // className='mcq-options'
                value='option2'
                checked={existingAnswer.includes('option2')}
                control={<Checkbox />}
                label={options[1].option2.optionValue}
              />
              <div>
                {options[1]?.option2?.images.length !== 0 ? (
                  <a
                    className='underlineRemove'
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
                  >
                    <SvgIcon component={() => <VisibilityIcon />} />
                  </a>
                ) : null}
              </div>
            </div>
            {options[2]?.option3 ? (
              <div className='mcq-options' style={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  //  className='mcq-options'
                  value='option3'
                  checked={existingAnswer.includes('option3')}
                  control={<Checkbox />}
                  label={options[2].option3.optionValue}
                />
                <div>
                  {options[2]?.option3?.images.length !== 0 ? (
                    <a
                      className='underlineRemove'
                      onClick={() => {
                        // const fileSrc = `${endpoints.assessmentErp.s3}${obj?.media_file[0]}`;
                        const fileSrc =
                          `${s3Image}${options[2]?.option3?.images[0]}`;
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
                    >
                      <SvgIcon component={() => <VisibilityIcon />} />
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}

            {options[3]?.option4 ? (
              <div className='mcq-options' style={{ display: 'flex', alignItems: 'center' }}>

                <FormControlLabel
                  // className='mcq-options'
                  value='option4'
                  checked={existingAnswer.includes('option4')}
                  control={<Checkbox />}
                  label={options[3].option4.optionValue}
                />
                <div>
                  {options[3]?.option4?.images.length !== 0 ? (
                    <a
                      className='underlineRemove'
                      onClick={() => {
                        // const fileSrc = `${endpoints.assessmentErp.s3}${obj?.media_file[0]}`;
                        const fileSrc =
                          `${s3Image}${options[3]?.option4?.images[0]}`;
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
                    >
                      <SvgIcon component={() => <VisibilityIcon />} />
                    </a>
                  ) : null}
                </div>
              </div>

            ) : null}
            {options[4]?.option5 ? (
              <div className='mcq-options' style={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  className='mcq-options'
                  value='option5'
                  checked={existingAnswer.includes('option5')}
                  control={<Checkbox />}
                  label={options[4].option5.optionValue}
                />
                <div>
                  {options[4]?.option5?.images.length !== 0 ? (
                    <a
                      className='underlineRemove'
                      onClick={() => {
                        // const fileSrc = `${endpoints.assessmentErp.s3}${obj?.media_file[0]}`;
                        const fileSrc =
                          `${s3Image}${options[4]?.option5?.images[0]}`;
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
                    >
                      <SvgIcon component={() => <VisibilityIcon />} />
                    </a>
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
export default McqQuestionMultiAnswer;
