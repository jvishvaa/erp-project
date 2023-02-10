import React, { useState, useEffect } from 'react';
import axios from 'v2/config/axios';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { useHistory } from 'react-router-dom';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import { message, Spin } from 'antd';
import diaryBG from 'v2/Assets/dashboardIcons/studentDashboardIcons/diary.png';

const DiaryStats = () => {
  const history = useHistory();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [diaryStats, setDiaryStats] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchDiaryStats = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.studentDashboard.diaryStats}`, {
        params: { ...params },
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setDiaryStats(response?.data?.result);
        }
        setLoading(false);
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (selectedAcademicYear)
      fetchDiaryStats({
        session_id: selectedAcademicYear?.id,
      });
  }, []);

  return (
    <div className='th-bg-white th-br-5 py-1 px-0 shadow-sm'>
      {loading ? (
        <div className='d-flex justify-content-center align-items-center'>
          <Spin tip='Loading...'></Spin>
        </div>
      ) : (
        <>
          <div
            className='row pr-2 align-items-center th-pointer'
            onClick={() => history.push('/diary/student')}
          >
            <div
              className='col-3 px-0 '
              style={{
                backgroundImage: `url(${diaryBG})`,
                height: 85,
                backgroundSize: 'cover',
              }}
            >
              &nbsp;
            </div>
            <div className='col-8 px-0'>
              <div className='py-2'>
                <div className='th-black-1 th-fw-500 pb-1'> Today's Diary</div>
                <div
                  className='th-black-2 pt-1 th-12'
                  style={{ borderTop: '1px solid #d9d9d9' }}
                >
                  {diaryStats?.diary_count > 0 ? (
                    <div>
                      <span className='th-fw-500'>
                        {diaryStats?.diary_count}{' '}
                        {diaryStats?.diary_count == 1 ? 'Diary' : 'Diaries'}
                      </span>{' '}
                      assigned with{' '}
                      <span className='th-fw-500'>
                        {' '}
                        {diaryStats?.homework_count?.homeworks}{' '}
                        {diaryStats?.homework_count?.homeworks == 1
                          ? 'Homework'
                          : 'Homeworks'}{' '}
                      </span>
                    </div>
                  ) : (
                    <div className='th-14 th-black-2'>No Diaries Assigned Today</div>
                  )}
                </div>
              </div>
            </div>
            <div className='col-1 px-0 text-right'>
              <div>
                <span className='th-grey th-20'>&gt;</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DiaryStats;
