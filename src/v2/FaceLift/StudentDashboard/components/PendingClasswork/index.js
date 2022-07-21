import React, { useState, useEffect } from 'react';
import axios from 'v2/config/axios';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import endpoints from 'v2/config/endpoints';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { message } from 'antd';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';

const PendingClasswork = () => {
  const history = useHistory();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const [classWorkReportData, setClassWorkReportData] = useState([]);
  const fetchClassWorkReportData = (params = {}) => {
    axios
      .get(`${endpoints.studentDashboard.pendingClasswork}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setClassWorkReportData(response?.data?.result);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  useEffect(() => {
    if (selectedAcademicYear)
      fetchClassWorkReportData({
        session_year_id: selectedAcademicYear?.id,
      });
  }, [selectedAcademicYear]);

  return (
    <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm' style={{ minHeight: 240 }}>
      <div className='row justify-content-between'>
        <div className='col-12 th-16 mt-2 th-fw-400 th-black-1'>
          Pending Classworks{' '}
          <span>
            {classWorkReportData?.length > 0 ? ` (${classWorkReportData?.length})` : ''}
          </span>
        </div>
      </div>
      {classWorkReportData?.length > 0 ? (
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
                {classWorkReportData?.map((item, i) => (
                  <div
                    className='th-bg-grey mb-2 th-br-6 th-pointer'
                    onClick={() => history.push('./erp-online-class-student-view')}
                  >
                    <div className='row justify-content-between py-3 th-br-6 align-items-center'>
                      <div className='col-4 th-black-2 th-14 th-fw-400 pr-0 text-left pl-1 text-truncate'>
                        {item?.subject_name}
                      </div>
                      <div className='col-4 th-black-2 th-14 th-fw-400 pr-0 pl-2 text-truncate text-center'>
                        {item?.class_name}
                      </div>
                      <div className='col-4 text-center th-14 th-fw-400 th-red px-0 text-right'>
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

export default PendingClasswork;
