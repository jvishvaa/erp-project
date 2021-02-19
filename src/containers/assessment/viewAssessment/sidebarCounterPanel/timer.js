import { duration } from '@material-ui/core';
import React from 'react';
import Timer from 'react-compound-timer';

/* <Timer.Days />
days,
<Timer.Hours />
h:
<Timer.Minutes />
m:
<Timer.Seconds />
s */
const TimerComponent = (props) => {
  const { submit, duration: durationInMin } = props || {};
  const durationInMilliSec = durationInMin * 60 * 1000;
  return (
    <Timer
      initialTime={durationInMilliSec}
      direction='backward'
      lastUnit='m'
      checkpoints={[
        {
          time: durationInMilliSec,
          callback: () => submit(),
        },
      ]}
    >
      {() => (
        <>
          <div className='sidebar-time-counter'>
            <h4>Time Remaining</h4>
            <h5 className='counter-timer'>
              <Timer.Minutes />
              :
              <Timer.Seconds />
            </h5>
          </div>
        </>
      )}
    </Timer>
  );
};
export default TimerComponent;
