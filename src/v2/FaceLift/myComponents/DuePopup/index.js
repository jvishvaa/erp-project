import React, { useEffect, useState } from 'react';
import { Avatar, Modal } from 'antd';
import _ from 'lodash';
import axiosInstance from 'config/axios';
import endpoints from 'v2/config/endpoints';

const DuePopup = ({ popupData, popupSetting }) => {
  const userDetails = localStorage?.getItem('userDetails')
    ? JSON.parse(localStorage?.getItem('userDetails'))
    : {};
  const branchDetails = sessionStorage.getItem('selected_branch')
    ? JSON.parse(sessionStorage.getItem('selected_branch'))
    : {};

  const [paymentLinkData, setPaymentLinkData] = useState(null);
  const [duePopup, setDuePopup] = useState(false);

  useEffect(() => {
    if (
      popupData?.length > 0 &&
      popupSetting?.length > 0 &&
      localStorage.getItem('duePopup') === null
    ) {
      setDuePopup(true);

      fetchUserDetails({
        branch: JSON.parse(sessionStorage.getItem('selected_branch'))?.branch?.id,
        session_year: JSON.parse(sessionStorage.getItem('selected_branch'))?.session_year
          ?.session_year,
        erp_id: userDetails?.erp,
      });
    }
  }, [popupData]);

  const fetchUserDetails = (params = {}) => {
    axiosInstance
      .get(`${endpoints.profile.getUserStatus}`, { params: { ...params } })
      .then((res) => {
        handlePaymentLink(res.data.result.results[0]);
      })
      .catch(() => {});
  };

  const handlePaymentLink = (userData) => {
    if (popupData?.length > 0) {
      let academicList = popupData
        ?.filter((each) => each?.fee_type === 'academic')
        .map((each) => each.installments)
        .flat(Infinity);
      let transportList = popupData
        ?.filter((each) => each?.fee_type === 'transport')
        .map((each) => each.installments)
        .flat(Infinity);
      // setDuePopup(true);
      let obj = {};
      obj.branch_id = branchDetails?.branch?.id;
      obj.erp_id = userDetails?.erp;
      obj.grade_id = userData?.mapping_bgs?.grade?.id;
      obj.section_id = userData?.mapping_bgs?.section?.id;
      obj.finance_session_year = branchDetails?.session_year?.id;
      obj.amount_total = _.sumBy(popupData, 'balance');
      obj.amount_paid = _.sumBy(popupData, 'balance');
      obj.amount_discount = 0;
      obj.collected_by = userDetails?.erp;
      obj.payment_method = 4;
      obj.wallet_amount = 0;
      obj.branch_name = branchDetails?.branch?.branch_name;
      obj.student_name = userData?.name;
      obj.father_name = userData?.father_name;
      obj.is_student_paying = true;

      var renamedCollectedDataTransport = [];

      for (let i = 0; i < transportList?.length; i++) {
        var renamedObj = {};
        renamedObj.termName = transportList[i].fee_group__term_fee__term_name;
        renamedObj.fee = transportList[i].fee;
        renamedObj.typeName = transportList[i].fee_type__fee_type_name;
        renamedObj.typeId = transportList[i].fee_type__id;
        renamedObj.feePaid = transportList[i].fee_type_paid_amount;
        renamedObj.fineAmount = transportList[i].fine_amount;
        renamedObj.balance = transportList[i].fee_balance;

        renamedObj.payingAmount = transportList[i].fee_balance;
        renamedObj.discountValue = 0;
        renamedObj.collectId = transportList[i].id;
        renamedObj.isPartial = transportList[i].fee_type__partial_payment;
        renamedObj.isChecked = transportList[i]?.is_backdue ? true : false;
        renamedObj.feeId = transportList[i].id;

        renamedObj.finance_session_name =
          transportList[i].finance_session_year__session_year;
        renamedObj.is_manual = transportList[i].is_manual;
        renamedObj.finance_session_year = transportList[i].finance_session_year;
        renamedObj.grade_id = userData?.mapping_bgs?.grade?.id;
        renamedObj.section_id = userData?.mapping_bgs?.section?.id;
        renamedObj.feeSegment = transportList[i]?.type;
        renamedObj.due_date = transportList[i]?.due_date;
        renamedCollectedDataTransport.push(renamedObj);
      }

      var renamedCollectedDataAcad = [];

      for (let i = 0; i < academicList?.length; i++) {
        var renamedObj = {};
        renamedObj.termName = academicList[i].fee_group__term_fee__term_name;
        renamedObj.fee = academicList[i].fee;
        renamedObj.typeName = academicList[i].fee_type__fee_type_name;
        renamedObj.typeId = academicList[i].fee_type__id;
        renamedObj.feePaid = academicList[i].fee_type_paid_amount;
        renamedObj.fineAmount = academicList[i].fine_amount;
        renamedObj.balance = academicList[i].fee_balance;

        renamedObj.payingAmount = academicList[i].fee_balance;
        renamedObj.discountValue = 0;
        renamedObj.collectId = academicList[i].id;
        renamedObj.isPartial = academicList[i].fee_type__partial_payment;
        renamedObj.isChecked = academicList[i]?.is_backdue ? true : false;
        renamedObj.feeId = academicList[i].id;

        renamedObj.finance_session_name =
          academicList[i].finance_session_year__session_year;
        renamedObj.is_manual = academicList[i].is_manual;
        renamedObj.finance_session_year = academicList[i].finance_session_year;
        renamedObj.grade_id = userData?.mapping_bgs?.grade?.id;
        renamedObj.section_id = userData?.mapping_bgs?.section?.id;
        renamedObj.feeSegment = academicList[i]?.type;
        renamedObj.due_date = academicList[i]?.due_date;
        renamedCollectedDataAcad.push(renamedObj);
      }
      obj.fee_info =
        academicList?.length > 0 ? JSON.stringify(renamedCollectedDataAcad) : '';
      obj.transport_fee_details =
        transportList?.length > 0 ? JSON.stringify(renamedCollectedDataTransport) : '';
      setPaymentLinkData(obj);
    }
  };

  const handleGeneratePaymentLink = () => {
    axiosInstance
      .post(`${endpoints.popupSetting.studentPaymentLink}`, paymentLinkData)
      .then((res) => {
        if (res.data.payment_link) {
          window.open(`${res.data.payment_link}`, '_self');
        }
      })
      .catch((err) => {});
  };
  const handleClose = () => {
    setDuePopup(false);
    localStorage.setItem('duePopup', 'closed');
  };

  return (
    <Modal
      visible={duePopup}
      onCancel={() => handleClose()}
      onOk={() => handleGeneratePaymentLink()}
      okText={`Pay Rs. ${_.sumBy(popupData, 'balance')}`}
    >
      <div>
        <div
          style={{
            backgroundImage:
              popupSetting?.length > 0
                ? `url(${popupSetting[0]?.background_image})`
                : 'url(http://placehold.it/360x150)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '100%', // Set the width of the container
            height: '150px', // Set the height of the container
            position: 'relative',
            marginBottom: '20px',
            borderRadius: '8px 8px 0px 0px',
          }}
        >
          <div
            className=''
            style={{
              position: 'absolute',
              bottom: '-50px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <Avatar
              style={{
                backgroundImage:
                  popupSetting?.length > 0
                    ? `url(${popupSetting[0]?.feature_image})`
                    : 'url(https://png.pngtree.com/png-clipart/20230923/original/pngtree-flat-payment-icon-with-receipt-and-verified-notice-vector-png-image_12741714.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                width: '100px',
                height: '100px',
                borderColor: 'white',
                borderStyle: 'solid',
              }}
            />
          </div>
        </div>
        <div className='d-flex flex-column justify-content-around align-items-center p-4 pt-5 h-100 gap-8'>
          <div>
            <h3 className='mb-0 pb-1 text-center' style={{ color: '#244555' }}>
              {popupSetting[0]?.heading}
            </h3>
          </div>

          <p
            className='pt-2 th-16 text-center'
            style={{ color: '#244555', wordBreak: 'break-word' }}
          >
            <b> {popupSetting[0]?.sub_heading}</b>
          </p>
          <p className='th-14 text-center'> {popupSetting[0]?.description}</p>
        </div>
      </div>
    </Modal>
  );
};

export default DuePopup;
