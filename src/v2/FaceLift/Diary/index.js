import React, { useState, useEffect } from 'react';
import endpoints from 'v2/config/endpoints';
import axios from 'v2/config/axios';
import { message, Spin } from 'antd';
import NewDiary from 'v2/FaceLift/Diary/DiaryNew/index';
import OldTeacherDiary from 'v2/FaceLift/Diary/DiaryOld/index';
import OldStudentDiary from 'containers/general-dairy';
import { useSelector } from 'react-redux';

const DiaryMain = () => {
  const [loading, setLoading] = useState(false);
  const [showNewDiary, setShowNewDiary] = useState(false);
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const fetchNewDiaryStatus = () => {
    setLoading(true);
    axios
      .get(`${endpoints.doodle.checkDoodle}?config_key=diary_branches_new_flow`)
      .then((response) => {
        if (response?.data?.result) {
          console.log('Status', response.data?.result);
          if (response?.data?.result.includes(String(selectedBranch?.branch?.id))) {
            setShowNewDiary(true);
          } else {
            setShowNewDiary(false);
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
    fetchNewDiaryStatus();
  }, [selectedBranch]);
  return (
    <>
      {!loading ? (
        window.location.pathname.includes('/diary/student') ? (
          showNewDiary ? (
            <NewDiary />
          ) : (
            <OldStudentDiary />
          )
        ) : showNewDiary ? (
          <NewDiary />
        ) : (
          <OldTeacherDiary />
        )
      ) : (
        <div className='th-width-100 text-center mt-5 h-100'>
          <Spin tip='Loading...'></Spin>
        </div>
      )}
    </>
  );
};

export default DiaryMain;
