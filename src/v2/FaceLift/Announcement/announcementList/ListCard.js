import React, { useEffect, useState } from 'react';
import { getTimeInterval } from 'v2/timeIntervalCalculator';
import { getCategoryColor } from 'v2/generalAnnouncementFunctions';
import DetailsModal from './DetailsModal';
import { DeleteOutlined, EditOutlined, StarTwoTone } from '@ant-design/icons';
import { Button, Popconfirm, Popover, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import publishIcon from 'v2/Assets/dashboardIcons/announcementListIcons/publishIcon.svg';
import deleteIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/deleteIcon.svg';
import moment from 'moment';
import { TrackerHandler } from 'v2/MixpanelTracking/Tracker';

const ListCard = (props) => {
  const {
    category__category_name: category,
    title,
    content,
    created_time: date,
    is_flash_event,
    created_by_user_level,
  } = props.data;
  const { showTab, deleteAnnouncement } = props;
  const [showModal, setShowModal] = useState(false);

  const { is_superuser } = JSON.parse(localStorage.getItem('userDetails')) || {};
  // const is_superuser = false;
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
  // const user_level = 8;

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const extractContent = (s) => {
    const span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  };
  const getDuration = (date) => {
    let currentDate = moment(date).format('DD/MM/YYYY');
    if (currentDate === moment().format('DD/MM/YYYY')) {
      return 'Today';
    } else if (currentDate == moment().subtract(1, 'days').format('DD/MM/YYYY')) {
      return 'Yesterday';
    } else {
      return (
        <span>
          {currentDate} <br />
          {moment(date).format('LT')}
        </span>
      );
    }
  };

  return (
    <>
      <div
        className='row th-bg-grey py-3 th-14 th-fw-400'
        style={{
          borderLeft: `4px ${getCategoryColor(category)} solid`,
          borderRadius: ' 0px 4px 4px 0px',
          backgroundOpacity: 0.5,
        }}
      >
        <div className='col-md-2 col-4 text-uppercase th-fw-500 text-break pr-0 pr-md-1'>
          {category} {is_flash_event ? <StarTwoTone twoToneColor='#52c41a' /> : null}
        </div>
        <div
          className='col-md-2 col-5 text-truncate th-pointer'
          style={{ width: '10%' }}
          onClick={() => {
            setShowModal(true);
          }}
        >
          <b>
            {extractContent(title).length > 25 ? (
              <Tooltip
                autoAdjustOverflow='false'
                placement='bottomLeft'
                title={extractContent(title)}
                overlayStyle={{ maxWidth: '40%', minWidth: '20%' }}
              >
                {extractContent(title)}
              </Tooltip>
            ) : (
              extractContent(title)
            )}
          </b>
        </div>
        <div
          className={`${
            [1, 3].includes(parseInt(showTab))
              ? [1, 8].includes(user_level) || is_superuser
                ? 'col-md-4'
                : 'col-md-6'
              : showTab == 2
              ? 'col-md-5'
              : 'col-md-6'
          } col-5 text-truncate th-pointer`}
          style={{ width: '95%' }}
          onClick={() => {
            TrackerHandler('announcement_view', { title });
            setShowModal(true);
          }}
        >
          {extractContent(content).length > 66 ? (
            <Tooltip
              autoAdjustOverflow='false'
              placement='bottomLeft'
              title={extractContent(content)}
              overlayStyle={{ maxWidth: '40%', minWidth: '20%' }}
            >
              {extractContent(content)}
            </Tooltip>
          ) : (
            extractContent(content)
          )}
        </div>
        {showTab != 2 ? (
          <div className={`col-md-2 col-3 px-2 px-md-4 th-grey text-right`}>
            <Tooltip
              autoAdjustOverflow='false'
              placement='bottomRight'
              title={getDuration(date)}
            >
              {' '}
              {getTimeInterval(date)}
            </Tooltip>
          </div>
        ) : null}
        {([1, 3].includes(parseInt(showTab)) &&
          ([1, 8].includes(user_level) || is_superuser)) ||
        showTab == 2 ? (
          <div
            className={`${
              showTab == 2 ? 'col-md-3' : 'col-md-2'
            } col-3 px-2 px-md-4 th-grey text-right`}
          >
            <div className='d-flex flex-row justify-content-end'>
              {showTab == 2 ? (
                <div
                  className='th-bg-primary th-white  th-pointer th-br-4 text-center py-1 px-2'
                  onClick={() => {
                    setShowModal(true);
                  }}
                >
                  {props?.allowedPublishBranches.length > 0 &&
                  !props?.allowedPublishBranches?.includes(props?.data?.branch_id[0])
                    ? 'Verify'
                    : 'Publish'}
                </div>
              ) : null}
              {showTab == 2 ||
              ([1, 3].includes(parseInt(showTab)) &&
                (is_superuser || [1].includes(user_level))) ? (
                <>
                  <Popconfirm
                    title='Sure to delete?'
                    onConfirm={(e) => deleteAnnouncement(props?.data?.id)}
                  >
                    {/* <DeleteOutlined
                      title='Delete'
                      style={{ margin: 10, cursor: 'pointer', color: '#1B4CCB' }}
                    /> */}
                    <Button
                      type='primary'
                      shape='circle'
                      className='ml-1'
                      icon={<DeleteOutlined title='Delete' />}
                    />
                  </Popconfirm>
                </>
              ) : null}
              {showTab == 2 ||
              ([1, 3].includes(parseInt(showTab)) &&
                (is_superuser || [1, 8].includes(user_level))) ? (
                <>
                  <Link
                    to={{
                      pathname: `/edit-announcement/${props?.data?.id}`,
                      state: { data: props?.data },
                    }}
                  >
                    {/* <EditOutlined
                      title='Edit'
                      style={{ margin: 10, cursor: 'pointer', color: '#1B4CCB' }}
                    /> */}
                    <Button
                      type='primary'
                      shape='circle'
                      className='ml-1'
                      icon={<EditOutlined title='Edit' />}
                    />
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
      {showModal && (
        <DetailsModal
          data={props?.data}
          show={showModal}
          showTab={showTab}
          setTab={props?.setTab}
          handleClose={handleCloseModal}
          allowedPublishBranches={props?.allowedPublishBranches}
        />
      )}
    </>
  );
};

export default ListCard;
