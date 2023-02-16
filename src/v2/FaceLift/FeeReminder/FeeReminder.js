import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { useHistory } from 'react-router-dom';
import ENVCONFIG from 'config/config';
import axiosInstance from 'config/axios';
import { useSelector } from 'react-redux';
import endpoints from 'v2/config/endpoints';

const FeeReminder = () => {
  const [open, setOpen] = useState(false);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const history = useHistory();
  const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
  const selectedAcademicYear = useSelector((state) => state.commonFilterReducer);
  const branchId = selectedAcademicYear?.selectedBranch?.branch?.id;
  const sessionYear = selectedAcademicYear?.selectedBranch?.session_year?.session_year;

  useEffect(() => {
    if (branchId && sessionYear) {
      fetchUserStatus();
    }
  }, []);

  const handleClose = () => {
    history.push({ pathname: '/dashboard' });
    setOpen(false);
  };

  const handleOk = () => {
    window.location.href.includes('dheerajinternational')
      ? window.open(
          `https://formbuilder.ccavenue.com/live/dheeraj-international-school`,
          '_blank'
        )
      : window.open(
          `${ENVCONFIG?.apiGateway?.finance}/sso/finance/${token}#/auth/login`,
          '_blank'
        );

    setOpen(false);
  };

  const fetchUserStatus = () => {
    axiosInstance
      .get(
        `${endpoints.profile.getUserStatus}?branch=${branchId}&session_year=${sessionYear}&erp_id=${userDetails?.erp}`
      )
      .then((res) => {
        setOpen(res.data?.result?.results[0]?.is_blocked);
      });
  };

  return (
    <>
      <Modal
        title='Fee Reminder'
        centered
        visible={open}
        onOk={() => handleOk()}
        onCancel={() => handleClose()}
        width={1000}
        okText='Pay'
      >
        <div className='row px-3 mb-2'>
          <div className='col-md-12 th-bg-grey shadow-sm d-none d-md-block'>
            <div className='row pt-3 th-primary th-18 th-fw-600'>
              “Dear Parent, Access for this module is denied due to pending fees, Kindly
              pay at the earliest”
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FeeReminder;
