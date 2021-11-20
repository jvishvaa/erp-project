import React from 'react';
import Timer from 'react-compound-timer';
import { makeStyles } from '@material-ui/core/styles';

/* <Timer.Days />
days,
<Timer.Hours />
h:
<Timer.Minutes />
m:
<Timer.Seconds />
s */
const useStyles = makeStyles((theme) => ({
  sidebarTimecounterTitle: {
    marginTop: '0px',
    color: theme.palette.secondary.main,
    fontSize: '15px',
    marginBottom: '0px',
  },
  counterTimer: {
    marginTop: '0px',
    color: theme.palette.secondary.main,
    fontSize: '16px',
    borderRadius: '20px',
    marginBottom: '0px',
    padding: '5px',
    textAlign: 'center',
    fontWeight: 'bold',
    border: `1px solid ${theme.palette.primary.main}`,
  }
}))
const TimerComponent = (props) => {
  const classes = useStyles()
  const { submit, startedAt, duration: durationInMin, setIsAutoSubmit } = props || {};
  let duratonPassedAlreadyInMilliSec = new Date() - new Date(startedAt);
  let testDurationInMilliSec = durationInMin * 60 * 1000;
  let durationLeft = testDurationInMilliSec - duratonPassedAlreadyInMilliSec;

  React.useEffect(() => {
    let checkDuration = setInterval(() => {
      durationLeft =
        durationInMin * 60 * 1000 - new Date().getTime() + new Date(startedAt).getTime();
      if (durationLeft <= 0) {
        // submit();
        setIsAutoSubmit(prev => !prev);
      }
    },1000);
    return () => {
      clearInterval(checkDuration);
    }
  }, []);
  // if (durationLeft <= 0 || !!!durationLeft) {
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
          <div>
            <h4 className={classes.sidebarTimecounterTitle}>Time Remaining</h4>
            <h5 className={classes.counterTimer}>
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
