import React, { useEffect, useState } from 'react';

const IdleTieOutComp = ({ idleTimeOut }) => {
  //   const [idleTimeOut, setIdleTimeOut] = useState(1 * 60 * 1000);
  const [loadListeners, setLoadListeners] = useState(false);

  const idle_events = {
    load: false,
    mousemove: false,
    mousedown: false,
    touchstart: false,
    touchmove: false,
    keydown: false,
    click: false,
    scroll: true,
  };

//   useEffect(() => {
//     fetchConfigData();
//   }, []);

  useEffect(() => {
    if (!loadListeners) {
      addListeners();
      setLoadListeners(true);
    }
    resetIdleTimeout();
    return () => {
      removeListeners();
      clearTimeout(loggedOutTime);
    };
  }, []);

  //   const fetchConfigData = () => {
  //     axiosInstance
  //       .get(`/assessment/check-sys-config/?config_key=idealTime`)
  //       .then((response) => {
  //         if (response?.data?.status_code === '201') {
  //           const configData = response?.data?.result[0];
  //           setIdleTimeOut(parseInt(configData.idleTime) * 60 * 1000);
  //         } else {
  //           console.log('Failed to fetch config data from the API.');
  //           setIdleTimeOut(0.5 * 60 * 1000);
  //         }
  //       })
  //       .catch((error) => {
  //         console.log('Error fetching config data:', error);
  //       });
  //   };

  let loggedOutTime;

  function sendIdleEvent() {
    removeListeners();
    localStorage.clear();
    window.location.href = '/';
  }

  function resetIdleTimeout() {
    clearTimeout(loggedOutTime);
    loggedOutTime = setTimeout(sendIdleEvent, idleTimeOut);
  }

  function addListeners() {
    Object.entries(idle_events).forEach(([event_name, capture]) => {
      window.addEventListener(event_name, resetIdleTimeout, capture);
    });
  }

  function removeListeners() {
    Object.entries(idle_events).forEach(([event_name, capture]) => {
      window.removeEventListener(event_name, resetIdleTimeout, capture);
    });
  }

  return (
    <React.Fragment>
      {/* <p>{idleTimeOut}</p> */}
    </React.Fragment>
  );
};

export default IdleTieOutComp;
