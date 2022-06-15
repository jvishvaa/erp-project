import React, { useEffect, useState } from 'react';
import TimeTableNew from '../time-table/index';
import TimeTableOld from '../time-table-old/index';

const TimeTableCheck = () => {
  const [periodConfig, setPeriodConfig] = useState(null);
  useEffect(() => {
    const erp_config = JSON.parse(localStorage.getItem('userDetails'))?.erp_config;
    setPeriodConfig(erp_config);
  }, [periodConfig]);
  return <><TimeTableNew /></>
};

export default TimeTableCheck;
