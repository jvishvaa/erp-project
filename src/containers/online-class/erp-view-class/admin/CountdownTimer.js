import Timer from 'react-compound-timer';

import React from 'react';
import { Tune } from '@material-ui/icons';

function CountdownTimer(props) {
  const classStartMin = 1;
  const countStartWithInMIn = 1*(30/100);
  const defaultStartTime=new Date(new Date().getTime() + classStartMin * 60 * 1000).getTime()
  const [classStartsAt] = React.useState(defaultStartTime);
  const [timerWillStartOn, setTimerWillStartOn] = React.useState(null)
  const [timeDiffInMilliSec, setTimeDiffInMilliSec]= React.useState(null)
  const [classWillStartOn, setClassWillStartOn]= React.useState(null)

//   function timeChecker() {
//     const timeNow = new Date().getTime();
//     const timeDiffInMilliSec = classStartsAt - timeNow;
//     if (timeDiffInMilliSec <= countStartWithInMIn * 60 * 1000) {
//         return true;
//     } else {
//       console.log('Timer start on', timeDiffInMilliSec);
//       return null;
//     }
//   }
console.log(props,'=================')
  const getTimerStartsOn =()=>{
    const timeNow = new Date().getTime();
    return ((classStartsAt||defaultStartTime) - countStartWithInMIn*60*1000)-timeNow
  }
  const getClassStartsOn =()=>{
    const timeNow = new Date().getTime();
    return ((classStartsAt||defaultStartTime))-timeNow
  }
  const [canStartTimer, startTimer] = React.useState(null);
  const checKkUpdate =()=>{
    const timeNow = new Date().getTime();
    const timeDiffInMilliSec = (classStartsAt||defaultStartTime) - timeNow;
    setTimeDiffInMilliSec(timeDiffInMilliSec)
    const timerStartsOn =getTimerStartsOn()
    if(timerStartsOn/1000>1){
        setTimerWillStartOn(timerStartsOn)
    }
    const classStartsOn =getClassStartsOn()
    if(classStartsOn/1000>1){
        setClassWillStartOn(classStartsOn)
    }
    if (canStartTimer!==true && timerStartsOn/1000 <= 1) {
      startTimer(true);
    }
  }
  React.useEffect(() => {
    checKkUpdate()
  });
  return (
      <div key='timer'>
          {/* { */}
            {/* //   canStartTimer ? ( */}
            <p>Class starts at : {new Date(classStartsAt).toString()}</p>
                      <hr />
                      <p key={timerWillStartOn}>Time diff to start timer {timerWillStartOn/1000}</p>
                      <hr />
                      <p key={classWillStartOn}>Time diff to start timer {classWillStartOn/1000}</p>
                      <hr />
                      <button type='button' 
                                  onClick={()=>{checKkUpdate()}}
                                  >Check</button>
                      <br />
                      {
                          canStartTimer &&(
                            <Timer
                            key='timer-comppound'
                              initialTime={countStartWithInMIn*60*1000}
                              direction='backward'
                              checkpoints={[
                                {
                                  time: 0,
                                  callback: () => window.alert('Started'),
                                },
                              ]}
                            >
                              {({ start, resume, pause, stop, reset, timerState }) => (
                                <React.Fragment>
                                  <div>
                                    <Timer.Days /> days
                                    <Timer.Hours /> hours
                                    <Timer.Minutes /> minutes
                                    <Timer.Seconds /> seconds
                                  </div>
                                </React.Fragment>
                              )}
                            </Timer>
                          )
                      }
      </div>
  );
}

export default CountdownTimer;
