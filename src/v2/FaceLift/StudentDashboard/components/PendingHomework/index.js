import React, { useState, useEffect } from 'react';
import axios from 'v2/config/axios';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { useHistory } from 'react-router-dom';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import { message } from 'antd';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';

const PendingHomework = () => {
  const history = useHistory();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [homeworkReportData, setHomeworkReportData] = useState([]);
  const fetchHomeworkReportData = (params = {}) => {
    axios
      .get(`${endpoints.studentDashboard.pendingHomework}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setHomeworkReportData(response?.data?.result);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  useEffect(() => {
    if (selectedAcademicYear)
      fetchHomeworkReportData({
        session_year_id: selectedAcademicYear?.id,
      });
  }, [selectedAcademicYear]);

  return (
    <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm' style={{ minHeight: 240 }}>
      <div className='row justify-content-between'>
        <div className='col-12 th-16 mt-2 th-fw-400 th-black-1'>
          Pending Homeworks
          <span>
            {homeworkReportData?.length > 0 ? ` (${homeworkReportData?.length})` : ''}
          </span>
        </div>
      </div>
      {homeworkReportData?.length > 0 ? (
        <div className='my-1 p-2'>
          <div className='th-custom-col-padding'>
            <div className='px-2'>
              <div className='row justify-content-between py-1'>
                <div className='col-4 th-grey th-fw-400 th-12 text-left'>Subject</div>
                <div className='col-4 th-grey th-fw-400 th-12 text-center'>Title</div>
                <div className='col-4 th-red th-fw-400 th-12 pl-0 text-right'>
                  Due Date
                </div>
              </div>
              <div style={{ overflowY: 'auto', overflowX: 'hidden', height: 130 }}>
                {homeworkReportData?.map((item, i) => (
                  <div
                    className='th-bg-grey mb-2 th-br-6 th-pointer'
                    onClick={() => history.push('./homework/student')}
                  >
                    <div className='row justify-content-between py-3 th-br-6 align-items-center'>
                      <div className='col-4 th-black-2 th-14 th-fw-400 pr-0 pl-1 text-truncate text-left'>
                        {item?.subject_name}
                      </div>
                      <div className='col-4 th-black-2 th-14 th-fw-400 pr-0 pl-2 text-truncate text-center'>
                        {item?.hw_name}
                      </div>
                      <div className='col-4 text-center th-14 th-fw-400 th-red px-0'>
                        {item?.due_date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='d-flex justify-content-center mt-5'>
          <img src={NoDataIcon} />
        </div>
      )}
    </div>
  );
};

export default PendingHomework;
