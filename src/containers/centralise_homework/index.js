import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import CentralizedStudentHw from './student';
import EvaluatorHomework from './evaluator/imageView';
import BranchHomework from './BranchStaffSide';
import endpoints from '../../config/endpoints';
import axiosInstance from 'config/axios';

const CentralizedHomework = () => {
  const userLevel = JSON.parse(localStorage.getItem('userDetails'))?.user_level;
  const [isAuditor, setIsAuditor] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkEvaluator();
  }, []);

  const checkEvaluator = async (params = {}) => {
    setLoading(true);
    await axiosInstance
      .get(`${endpoints.centralizedHomework.checkEvaluator}`)
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setIsAuditor(!res?.data?.result?.is_evaluator);
        } else {
          message.error(res?.data?.message);
        }
        console.log({ res });
      })
      .catch((error) => {
        message.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {userLevel === 13 ? (
        <CentralizedStudentHw />
      ) : userLevel === 11 ? (
        <BranchHomework />
      ) : userLevel === 2 || userLevel === 8 ? (
        <>{!loading && <EvaluatorHomework is_auditor={isAuditor} />}</>
      ) : null}
    </>
  );
};

export default CentralizedHomework;
