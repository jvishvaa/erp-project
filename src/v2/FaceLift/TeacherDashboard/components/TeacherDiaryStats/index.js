import React, { useState, useEffect } from 'react';
import axios from 'v2/config/axios';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { useHistory } from 'react-router-dom';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import { message, Spin, Progress } from 'antd';
import diaryBG from 'v2/Assets/dashboardIcons/studentDashboardIcons/diary.png';
import './index.css';
import moment from 'moment';
const DiaryStats = () => {
  const history = useHistory();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [diaryStats, setDiaryStats] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchDiaryStats = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.teacherDashboard.diaryStats}`, {
        params: { ...params },
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.data?.status_code === 200) {
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
        acadsession_id: selectedBranch?.id,
      });
  }, []);

  return (
    <div className='th-bg-white th-br-5 px-0 shadow-sm'>
      {loading ? (
        <div className='d-flex justify-content-center py-3 align-items-center'>
          <Spin size='small' tip={<span className='th-12'>Loading...</span>}></Spin>
        </div>
      ) : (
        <>
          <div
            className='row pr-2 py-2 py-md-0 align-items-center th-pointer'
            style={{
              backgroundImage: `url(${diaryBG})`,
              height: 85,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
            }}
            onClick={() =>
              history.push({
                pathname: '/gradewise-diary-report',
                state: {
                  date: moment().format('YYYY-MM-DD'),
                  diaryType: 2,
                },
              })
            }
          >
            <div className='col-2 px-0 '>&nbsp;</div>
            <div className='col-9 pr-0'>
              <div className='py-2'>
                <div className='th-black-1 th-fw-500 py-1 d-flex justify-content-between align-items-start'>
                  <div className='th-18'>Today's Diary</div>
                  {diaryStats?.total_diary > 0 && (
                    <div className='text-right'>
                      <div>
                        <span className='th-14 th-primary'>
                          {diaryStats?.assigned_diary} /{' '}
                        </span>
                        <span className='th-16' style={{ color: '#94BEFF' }}>
                          {diaryStats?.total_diary}
                        </span>
                      </div>
                      <div>
                        <span className='th-10 th-primary'>Assigned /</span>
                        <span className='th-10' style={{ color: '#94BEFF' }}>
                          Total
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div
                  className='th-black-2 pt-1 th-12'
                  // style={{ borderTop: '1px solid #d9d9d9' }}
                >
                  {diaryStats?.total_diary > 0 ? (
                    <div className='th-diaryprogress'>
                      {Array.from({ length: diaryStats?.total_diary }, (v, i) => i).map(
                        (item, index) => (
                          <div
                            className={`${
                              index < diaryStats?.assigned_diary ? 'active' : ''
                            } step mx-1`}
                            style={{
                              height: 10,
                              width: `${100 / diaryStats?.total_diary}%`,
                            }}
                          >
                            &nbsp;
                          </div>
                        )
                      )}
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
