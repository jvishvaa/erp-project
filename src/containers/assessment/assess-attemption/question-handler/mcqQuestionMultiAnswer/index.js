import React, { useContext } from 'react';
// import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';
import ReactHtmlParser from 'react-html-parser';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { AttachmentPreviewerContext } from '../../../../../components/attachment-previewer/attachment-previewer-contexts';
// import FormLabel from '@material-ui/core/FormLabel';
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

const McqQuestionMultiAnswer = (props) => {
  const classes = useStyles()
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
    is_central: isCentral = false,
  } = currentQuestionObj || {};

  const [{ options, question }] = questionAnswer || [];

  const s3Image = `${isCentral ? endpoints.s3 : endpoints.assessmentErp.s3}/`;

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
        <div>{ReactHtmlParser(question)}</div>
        <FormControl component='fieldset' onChange={handleOptionValue}>
          {/* <FormLabel component='legend'>Options</FormLabel> */}
          <RadioGroup
            aria-label='gender'
            name='options'
            value={existingAnswer}
            onChange={handleOptionValue}
          >
            <div
              className={classes.mcqOptions}
              style={{ display: 'grid', alignItems: 'center' }}
            >
              <FormControlLabel
                // className={classes.mcqOptions}
                value='option1'
                checked={existingAnswer.includes('option1')}
                control={<Checkbox />}
                label={options[0].option1.optionValue}
              />
              <div className='imageContainer'>
                {options[0]?.option1?.images.length !== 0 ? (
                  <img
                    // className='underlineRemove'
                    src={`${s3Image}${options[0]?.option1?.images[0]}`}
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
                checked={existingAnswer.includes('option2')}
                control={<Checkbox />}
                label={options[1].option2.optionValue}
              />
              <div className='imageContainer'>
                {options[1]?.option2?.images.length !== 0 ? (
                  <img
                    // className='underlineRemove'
                    src={`${s3Image}${options[1]?.option2?.images[0]}`}
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
                  //  className={classes.mcqOptions}
                  value='option3'
                  checked={existingAnswer.includes('option3')}
                  control={<Checkbox />}
                  label={options[2].option3.optionValue}
                />
                <div className='imageContainer'>
                  {options[2]?.option3?.images.length !== 0 ? (
                    <img
                      // className='underlineRemove'
                      src={`${s3Image}${options[2]?.option3?.images[0]}`}
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
                  checked={existingAnswer.includes('option4')}
                  control={<Checkbox />}
                  label={options[3].option4.optionValue}
                />
                <div className='imageContainer'>
                  {options[3]?.option4?.images.length !== 0 ? (
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
                  className={classes.mcqOptions}
                  value='option5'
                  checked={existingAnswer.includes('option5')}
                  control={<Checkbox />}
                  label={options[4].option5.optionValue}
                />
                <div className='imageContainer'>
                  {options[4]?.option5?.images.length !== 0 ? (
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
export default McqQuestionMultiAnswer;
