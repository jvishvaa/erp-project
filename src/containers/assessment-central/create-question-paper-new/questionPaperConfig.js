import React, { useState, useEffect } from 'react';
import endpoints from 'v2/config/endpoints';
import axios from 'v2/config/axios';
import { message, Spin } from 'antd';
import { useSelector } from 'react-redux';
import Filters from './filters';
import CreateQuestionPaper from '../../assessment-central/create-question-paper/index';


const QuestionPaperConfig = () => {
  const [loading, setLoading] = useState(false);
  const [showNewAsses, setShowNewAsses] = useState(false);
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const fetchquesPaperStatus = () => {
    setLoading(true);
    axios
      .get(`${endpoints.doodle.checkDoodle}?config_key=asmt_enhancement`)
      .then((response) => {
        if (response?.data?.result) {
          if (response?.data?.result.includes(String(selectedBranch?.branch?.id))) {
            setShowNewAsses(true);
          } else {
            setShowNewAsses(false);
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        message.error('error', error?.message);
      });
  };
  useEffect(() => {
    fetchquesPaperStatus();
  }, [selectedBranch]);
  return (
    <>
      {!loading ? (
        showNewAsses ? 
            <Filters />
         : <CreateQuestionPaper/>
      ) : (
        <div className='th-width-100 text-center mt-5 h-100'>
          <Spin tip='Loading...'></Spin>
        </div>
      )}
    </>
  );
};

export default QuestionPaperConfig