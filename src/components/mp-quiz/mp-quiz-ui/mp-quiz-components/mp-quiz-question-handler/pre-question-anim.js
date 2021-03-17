import React from 'react';
import Timer from 'react-compound-timer';
import { useQuizQuesContext } from '../../../mp-quiz-providers';

export default function PreQuestionAnim() {
  /*
    /* on zero checkpoint set below values to state
    * timeToRender: renderMeme
    */
  //   const { activeStep, preQuesAnimDuration, firstQuesAnimDuration } = this.state;
  const {
    timeToRenderObj: {
      durationObj: { preQuesAnimDuration, firstQuesAnimDuration } = {},
    } = {},
    timeToRenderControls: {
      onEndOfPreQuesAnim = () => {
        // eslint-disable-next-line no-alert
        window.alert('onEndOfPreQuesAnim is undefined');
      },
    } = {},
    controls: { currentQuesionIndex },
  } = useQuizQuesContext() || {};
  return (
    <Timer
      key={currentQuesionIndex}
      initialTime={
        currentQuesionIndex === 0 ? firstQuesAnimDuration : preQuesAnimDuration
      }
      direction='backward'
      lastUnit='s'
      checkpoints={[
        {
          time: 0,
          callback: () => {
            onEndOfPreQuesAnim();
          },
        },
      ]}
    >
      {(timerObj) => {
        const seconds = Math.round(Math.ceil(timerObj.getTime() / 1000));
        return (
          <>
            <div
              // className={'animated fadeInUpBig counter'}
              className='animated grow counter counter__position'
              // key={keySec}
              key={Math.round(timerObj.getTime())}
            >
              <hr />
              <div style={{ margin: 'auto' }}>
                {seconds === 1 || seconds === 0 ? `Q${currentQuesionIndex + 1}` : seconds}
              </div>
              <hr />
            </div>
            {/* { timerObj.getTime() } */}
          </>
        );
      }}
    </Timer>
  );
}
