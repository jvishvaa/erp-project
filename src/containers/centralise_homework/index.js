import React, { useState } from 'react';
import { Spin } from 'antd';
import CentralizedStudentHw from './student';
import EvaluatorHomework from './evaluator/imageView';
import BranchHomework from './BranchStaffSide';

const CentralizedHomework = () => {
  const userLevel = JSON.parse(localStorage.getItem('userDetails'))?.user_level;

  return (
    <>
      {userLevel === 13 ? (
        <CentralizedStudentHw />
      ) : userLevel === 11 ? (
        <BranchHomework />
      ) : userLevel === 2 || userLevel === 8 ? (
        <EvaluatorHomework />
      ) : null}
    </>
  );
};

export default CentralizedHomework;
