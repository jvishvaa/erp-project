import React, { useState, useEffect } from 'react';
import AnnouncementCard from 'v2/FaceLift/myComponents/AnnouncementCards';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getSortedAnnouncements } from 'v2/generalAnnouncementFunctions';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';

const Announcements = (props) => {
  const history = useHistory();
  const [announcementData, setAnnouncementData] = useState([]);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  const fetchAnnouncementData = (params = {}) => {
    axios
      .get(`${endpoints.adminDashboard.announcements}`, {
        params: { ...params },
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setAnnouncementData(response?.data?.data);
        }
      })
      .catch((error) => console.log(error));
  };

  const announcementListData = getSortedAnnouncements(announcementData);

  useEffect(() => {
    if (selectedAcademicYear)
      fetchAnnouncementData({
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.branch?.id,
      });
  }, [selectedAcademicYear]);

  return (
    <div className='th-bg-white th-br-5 py-3 mt-3 px-2 shadow-sm'>
      <div className='col-md-12 mt-2 pb-2 th-black-1 th-16 th-fw-400 '>
        <span className=''>Announcements </span>
      </div>
      <div
        className='col-md-12 mt-2 mb-1'
        style={{
          height: props?.scrollHeight,
          overflowY: 'auto',
        }}
      >
        {announcementListData?.length > 0 ? (
          announcementListData?.map((item) => {
            return (
              <div className='th-14 th-fw-500 th-black-1 th-lh-20'>
                {item?.date}
                {item?.events.map((item) => (
                  <AnnouncementCard data={item} />
                ))}
              </div>
            );
          })
        ) : (
          <div className='d-flex justify-content-center mt-5'>
            <img src={NoDataIcon} />
          </div>
        )}
      </div>
      <div className='col-md-12 mt-1 text-right'>
        <div className='th-primary'>
          {announcementListData?.length > 0 ? (
            <u className='th-pointer' onClick={() => history.push('./announcement-list')}>
              {'View All >'}
            </u>
          ) : (
            <span> &nbsp;</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
