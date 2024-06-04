import mixpanel from 'mixpanel-browser';
mixpanel.init('1a74c2c62a329aabf4eabc67877909b7');

const isTrackerChecker = window.location.hostname === 'orchids.letseduvate.com';

export const TrackerHandler = (tracker, params = {}) => {
  if (isTrackerChecker) {
    const { user_level, user_id, erp, email, first_name } =
      JSON.parse(localStorage.getItem('userDetails')) || {};

    if (tracker == 'user_login') {
      mixpanel.identify(erp);
      mixpanel.people.set({ name: first_name, $email: email, user_level });
    }
    mixpanel.track(tracker, {
      user_level,
      erp,
      email,
      first_name,
      platform: 'web',
      ...params,
    });
  }
};
