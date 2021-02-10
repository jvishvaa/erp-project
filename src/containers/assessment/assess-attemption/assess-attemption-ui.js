import React, { useContext } from 'react';
import Loader from '../../../components/loader/loader';
import { AssessmentHandlerContext } from './assess-attemption-context';
import Loading from '../../../components/loader/loader';

const AssessmentHandlerUI = () => {
  const {
    assessmentQp: { fetching },
    fetchAssessmentQp,

    questionsDataObj,
    questionsArray,

    questionsMetaInfo: { is_ready_to_submit: isReadyToSubmit } = {},

    controls: {
      selectQues,
      nextQues,
      prevQues,
      attemptQuestion,
      isStarted,
      currentQuesionId,
      start,
      startedAt,
    },
  } = useContext(AssessmentHandlerContext);
  React.useEffect(() => {
    fetchAssessmentQp({ assessment_id: 3 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //   React.useEffect(() => {
  //     console.log({ questionsDataObj, questionsMetaInfo }, 'apiData');
  //   }, [questionsDataObj, questionsMetaInfo]);

  const { [currentQuesionId]: currentQuestionObj = {} } = questionsDataObj || {};
  const {
    id: qId,
    meta: { index: qIndex } = {},
    user_response: { attemption_status: attemptionStatus } = {},
  } = currentQuestionObj || {};
  return (
    <>
      {fetching ? <Loading message='fetching question paper..' /> : null}
      {/* <div>{Object.values(questionsDataObj || {}).map((i) => `${i.id},`)}</div> */}
      {isStarted ? (
        <p>{`${startedAt}`}</p>
      ) : (
        <button type='button' onClick={start}>
          Start
        </button>
      )}

      {isStarted ? (
        <>
          <div style={{ display: 'flex', border: '1px solid black' }}>
            {questionsArray.map((i, index) => {
              const {
                id: interationqId,
                // meta: { index: qIndex } = {},
                user_response: { attemption_status: qAttemptionStatus } = {},
              } = i || {};

              return (
                <button
                  type='button'
                  key={i.id}
                  onClick={() => {
                    selectQues(i.id);
                  }}
                  style={{
                    cursor: 'pointer',
                    padding: 4,
                    border:
                      // eslint-disable-next-line no-nested-ternary
                      qAttemptionStatus === true
                        ? '3px solid green'
                        : qAttemptionStatus === false
                        ? '3px solid red'
                        : '3px solid black',
                    flexBasis: '20%',
                    margin: 2,
                  }}
                >
                  <span
                    style={{ border: interationqId === qId ? '1px solid red' : 'none' }}
                  >
                    Ques &nbsp;
                    {index + 1}
                  </span>
                </button>
              );
            })}
          </div>
          <hr />
          <p>{`Question:  ${qIndex + 1}, id:${qId}-${currentQuesionId}`}</p>
          {`${currentQuestionObj.user_response?.attemption_status}`}
          <button
            type='button'
            onClick={() => {
              attemptQuestion(qId, { attemption_status: true });
            }}
          >
            attempt
          </button>
          <button type='button' onClick={nextQues}>
            next
          </button>
          <button type='button' onClick={prevQues}>
            prev
          </button>

          {isReadyToSubmit ? <button type='button'>Submit</button> : null}
        </>
      ) : null}
    </>
  );
};
export default AssessmentHandlerUI;
