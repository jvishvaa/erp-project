import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const Countdown = (props) => {
  const [countdownTime, setCountdownTime] = useState({
    days: undefined,
    hours: undefined,
    minutes: undefined,
    seconds: undefined,
  });

  const interval = useRef(null);

  useEffect(() => {
    interval.current = setInterval(() => {
      const { startTime } = props;
      const difference = moment(startTime).diff(moment.now());
      const duration = moment.duration(difference, 'milliseconds');
      const days = moment.duration(duration).days();
      const hours = moment.duration(duration).hours();
      const minutes = moment.duration(duration).minutes();
      const seconds = moment.duration(duration).seconds();

      setCountdownTime({ days, hours, minutes, seconds });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  const { days, hours, minutes, seconds } = countdownTime;
  const nill = !days && !hours && !minutes && !seconds;
  return (
    <div>
      {nill ? null : (
        <>
          Start&apos;s In:
          {`${countdownTime.days}d ${countdownTime.hours}h ${countdownTime.minutes}m ${countdownTime.seconds}s`}
        </>
      )}
    </div>
  );
};

Countdown.propTypes = {
  startTime: PropTypes.string.isRequired,
};

export default Countdown;
