import React, { useState, useEffect } from 'react';
import AnnouncementCard from 'v2/FaceLift/myComponents/AnnouncementCards';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getSortedAnnouncements } from 'v2/generalAnnouncementFunctions';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import DetailsModal from 'v2/FaceLift/Announcement/announcementList/DetailsModal';

const Announcements = (props) => {
  const history = useHistory();
  const [announcementData, setAnnouncementData] = useState([]);
  const [currentAnnouncement, setCurrentAnnouncement] = useState([]);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const fetchAnnouncementData = (params = {}) => {
    axios
      .get(`${endpoints.adminDashboard.announcements}`, {
        params: { ...params },
      })
      .then((response) => {
        if (response.data.status_code === 200) {
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
      <div className='col-md-12 mt-2 pb-2 th-black-1 th-16 th-fw-500 '>
        <span className=''>Announcements </span>
      </div>
      <div
        className='col-md-12 mt-2'
        style={{
          height: props?.scrollHeight ? props?.scrollHeight : '575px',
          overflowY: 'auto',
        }}
      >
        {announcementListData?.length > 0 ? (
          announcementListData?.map((item) => {
            return (
              <div className='th-14 th-fw-500 th-black-1 th-lh-20'>
                {item?.date}
                {item?.events.map((item) => (
                  <div
                    onClick={() => {
                      setShowModal(true);
                      setCurrentAnnouncement(item);
                    }}
                  >
                    <AnnouncementCard data={item} />
                  </div>
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
      <div className='col-md-12 mt-2 text-right'>
        <div className='th-primary'>
          {announcementListData?.length > 0 ? (
            <div
              onClick={() => history.push('./announcement-list')}
              className='th-black-1 th-bg-grey p-2 th-br-8 badge th-pointer'
              style={{ outline: '1px solid #d9d9d9' }}
            >
              View All
            </div>
          ) : (
            <span> &nbsp;</span>
          )}
        </div>
      </div>
      {showModal && (
        <DetailsModal
          data={currentAnnouncement}
          show={showModal}
          handleClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Announcements;
