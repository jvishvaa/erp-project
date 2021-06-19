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
  const { submit, startedAt, duration: durationInMin } = props || {};
  const duratonPassedAlreadyInMilliSec = new Date() - new Date(startedAt);
  const testDurationInMilliSec = durationInMin * 60 * 1000;
  const durationLeft = testDurationInMilliSec - duratonPassedAlreadyInMilliSec;
  // if (durationLeft <= 0) {
  // const isConfirm = window.confirm('Time ran out.');
  // submit();
  // if (isConfirm) {
  //   submit();
  // } else {
  //   window.alert('Please submit the test');
  // }
  // }

  // React.useEffect(() => {
  //   let continuosCall = setTimeout(() => {
  //     window.alert('Time ran out!');
  //     submit();
  //   }, durationLeft);
  //   return () => {
  //     clearTimeout(continuosCall);
  //   };
  // }, []);

  return (
    <Timer
      initialTime={durationLeft}
      direction='backward'
      lastUnit='m'
      checkpoints={[
        {
          time: durationLeft,
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
