// useTimeTracker.js
import { useEffect } from 'react';
import mixpanel from 'mixpanel-browser';
mixpanel.init('1a74c2c62a329aabf4eabc67877909b7');

const isTrackerChecker = window.location.hostname === 'orchids.letseduvate.com';
const useTimeTracker = (eventName, params = {}) => {
  useEffect(() => {
    if (isTrackerChecker) {
      const { user_level, erp, email, first_name } =
        JSON.parse(localStorage.getItem('userDetails')) || {};
      const startTime = Date.now();

      return () => {
        const endTime = Date.now();
        const timeSpent = (endTime - startTime) / 1000; // time in seconds
        mixpanel.track(eventName, {
          timeSpent,
          user_level,
          erp,
          email,
          platform: 'web',
          first_name,
          ...params,
        });
      };
    }
  }, [eventName]);
};

export default useTimeTracker;
