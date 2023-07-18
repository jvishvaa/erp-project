import React, { useState } from 'react';
import { getTimeInterval } from 'v2/timeIntervalCalculator';
import { getCategoryColor } from 'v2/generalAnnouncementFunctions';
import DetailsModal from './DetailsModal';
import { EllipsisOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
// import emailIcon from 'v2/Assets/dashboardIcons/announcementListIcons/emailIcon.svg';
// import smsIcon from 'v2/Assets/dashboardIcons/announcementListIcons/smsIcon.svg';
// import whatsappIcon from 'v2/Assets/dashboardIcons/announcementListIcons/whatsappIcon.svg';
// import editIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/editIcon.svg';
import publishIcon from 'v2/Assets/dashboardIcons/announcementListIcons/publishIcon.svg';
import deleteIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/deleteIcon.svg';

const ListCard = (props) => {
  const { category__category_name: category, content, created_time: date } = props.data;
  const { showTab } = props;
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const extractContent = (s) => {
    const span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
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
        <div className='col-md-3 col-4 text-uppercase th-fw-500 text-break pr-0 pr-md-2'>
          {category}
        </div>
        <div
          className='col-md-7 col-5 text-truncate th-pointer'
          style={{ width: '95%' }}
          onClick={() => {
            setShowModal(true);
          }}
        >
          {extractContent(content)}
        </div>
        <div className='col-md-2 col-3 px-2 px-md-4 th-grey text-right'>
          {showTab == 1 ? (
            getTimeInterval(date)
          ) : showTab == 2 ? (
            // <Popover
            //   content={
            //     <>
            //       {/* <div className='row justify-content-between th-pointer pb-2'>
            //         <img src={editIcon} className='mr-3 ' />
            //         <span className='th-black-1 th-16'>Edit</span>
            //       </div> */}
            //       <div
            //         className='row justify-content-center th-pointer'
            //         onClick={() => {
            //           setShowModal(true);
            //         }}
            //       >
            //         <img src={publishIcon} className='mr-3 ' />
            //         <span className='th-green th-16'>Publish</span>
            //       </div>
            //       {/* <div className='row justify-content-center th-pointer pt-2'>
            //         <img src={deleteIcon} className='mr-3' />
            //         <span className='th-red th-16 '>Delete</span>
            //       </div> */}
            //     </>
            //   }
            //   trigger='click'
            //   placement='bottomRight'
            // >
            //   <EllipsisOutlined />
            // </Popover>
            <div
              className='d-flex justify-content-end'
              onClick={() => {
                setShowModal(true);
              }}
            >
              <div className='th-bg-primary th-white w-75 th-pointer th-br-4 text-center py-1'>
                {props?.allowedPublishBranches.length > 0 &&
                !props?.allowedPublishBranches?.includes(props?.data?.branch_id[0])
                  ? 'Verify'
                  : 'Publish'}
              </div>
            </div>
          ) : (
            // <div className='d-flex justify-content-around'>
            //   <img src={emailIcon} />
            //   <img src={smsIcon} />
            //   <img src={whatsappIcon} />
            // </div>
            ''
          )}
        </div>
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
