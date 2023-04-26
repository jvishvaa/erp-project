import { Breadcrumb, Button, Steps, message } from 'antd';
import Layout from 'containers/Layout';
import React, { useEffect, useState } from 'react';
import EditSchoolDetails from './editSchoolDetails';
import endpoints from 'v2/config/endpoints';
import { useParams } from 'react-router-dom';
import axiosInstance from 'v2/config/axios';
import EditUserDetails from './editUserDetails';
import { useHistory } from 'react-router-dom';

const EditNonAcademicStaff = () => {
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState([]);
  const [requestSent, setRequestSent] = useState(false);
  const history = useHistory();
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axiosInstance
      .get(`${endpoints.nonAcademicStaff.viewStaff}?erp_user_id=${id}`)
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setUserDetails(res?.data?.result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleUpdateUserDetails = (data) => {
    setUserDetails(data);
  };

  const { Step } = Steps;
  const steps = [
    {
      title: 'School Details',
      content: (
        <EditSchoolDetails
          userDetails={userDetails}
          handleUpdateUserDetails={handleUpdateUserDetails}
          setUserDetails={setUserDetails}
        />
      ),
    },
    {
      title: 'User Details',
      content: (
        <EditUserDetails
          userDetails={userDetails}
          handleUpdateUserDetails={handleUpdateUserDetails}
          setUserDetails={setUserDetails}
        />
      ),
    },
  ];

  const [current, setCurrent] = useState(0);

  const handleUpdateData = () => {
    let letterRegx = /^[A-Za-z ]+$/;
    let contact = userDetails?.contact.split('-');
    if (
      userDetails?.user.first_name === '' ||
      userDetails?.user.first_name === undefined
    ) {
      message.error('Please Enter User First Name');
      return;
    }
    if (!userDetails?.user.first_name.match(letterRegx)) {
      message.error('First Name should only contains character');
      return;
    }
    if (userDetails?.user_middle_name !== '') {
      if (!userDetails?.user_middle_name.match(letterRegx)) {
        message.error('Middle Name should only contains character');
        return;
      }
    }
    if (userDetails?.user.last_name === '' || userDetails?.user.last_name === undefined) {
      message.error('Please Enter User Last Name');
      return;
    }
    if (!userDetails?.user.last_name.match(letterRegx)) {
      message.error('Last Name should only contains character');
      return;
    }
    if (userDetails?.gender === '' || userDetails?.gender === undefined) {
      message.error('Please Select User Gender');
      return;
    }
    if (userDetails?.date_of_birth === '' || userDetails?.date_of_birth === undefined) {
      message.error('Please Enter User Date of Birth');
      return;
    }
    if (contact[0] === '' || contact[0] === undefined) {
      message.error('Please Select User Country Code');
      return;
    }
    if (isNaN(contact[1])) {
      message.error('Mobile No. should only contains numbers');
      return;
    }
    if (contact[1] === '' || contact[1] === undefined) {
      message.error('Please Enter User Mobile No.');
      return;
    }
    if (userDetails?.userCode === '+91') {
      if (contact[1].toString().length < 10 || contact[1].toString().length > 10) {
        message.error('Mobile No. must be 10 digit long');
        return;
      }
    } else {
      if (contact[1].toString().length < 10 || contact[1].toString().length > 12) {
        message.error('Mobile No. must be 10 to 12 digit long');
        return;
      }
    }

    // if (
    //   userDetails?.userUsername === '' ||
    //   userDetails?.userUsername === undefined
    // ) {
    //   message.error('Please Enter User Username');
    //   return;
    // }
    if (userDetails?.user.email === '' || userDetails?.user.email === undefined) {
      message.error('Please Enter User Email');
      return;
    }
    if (userDetails?.address === '' || userDetails?.address === undefined) {
      message.error('Please Enter User Address');
      return;
    }
    handleSubmit();
  };

  const handleSubmit = () => {
    setRequestSent(true);
    let acadId = [];
    let brachId = [];
    let mappingData = userDetails?.acad_session?.forEach((item) => {
      acadId.push(item?.id);
      brachId.push(item?.branch);
    });
    let gender;
    if (userDetails?.gender === 'male') {
      gender = 1;
    } else if (userDetails?.gender === 'female') {
      gender = 2;
    } else if (userDetails?.gender === 'others') {
      gender = 3;
    } else {
      gender = userDetails?.gender;
    }

    const fd = new FormData();
    fd.append('academic_year', acadId.join(','));
    fd.append('branch', brachId.join(','));
    fd.append('designation', userDetails?.designation?.id);
    fd.append('first_name', userDetails?.user?.first_name);
    fd.append('middle_name', userDetails?.user_middle_name);
    fd.append('last_name', userDetails?.user?.last_name);
    fd.append('gender', gender);
    fd.append('date_of_birth', userDetails?.date_of_birth);
    fd.append('erp_id', userDetails?.erp_id);
    fd.append('address', userDetails?.address);
    fd.append('contact', userDetails?.contact);
    fd.append('email', userDetails?.user?.email);
    fd.append('profile', userDetails?.profile);
    fd.append('role', userDetails?.role?.id);
    fd.append('user_level', userDetails?.user_level?.id);
    axiosInstance
      .put(`${endpoints.nonAcademicStaff.updateStaff}`, fd)
      .then((res) => {
        if (res.status === 200) {
          message.success(res?.data?.message);
          history.push('/user-management/non-academic-staff');
        }
      })
      .catch((error) => {
        message.error(error.message);
      })
      .finally(() => {
        setRequestSent(false);
      });
  };

  const next = () => {
    if (userDetails?.user_level?.id === '' || userDetails?.user_level?.id === undefined) {
      message.error('Please select user level');
      return;
    }
    if (
      userDetails?.designation?.id === '' ||
      userDetails?.designation?.id === undefined
    ) {
      message.error('Please select designation');
      return;
    }

    if (userDetails?.role?.id === '' || userDetails?.role?.id === undefined) {
      message.error('Please select role');
      return;
    }

    const isFieldNull = userDetails?.mapping_bgs.filter(function (el) {
      return (
        el.branch[0].branch_id == '' ||
        el.branch[0].branch_id == undefined ||
        el.session_year[0].acad_session_year == '' ||
        el.session_year[0].acad_session_year == undefined
      );
    });

    if (isFieldNull.length > 0) {
      message.error('Academic year and Branch can not be empty');
      return;
    }
    let acadId = [];
    let mappingData = userDetails?.acad_session?.forEach((item) => {
      acadId.push(item?.id);
    });
    if (new Set(acadId).size !== acadId.length) {
      message.error('Academic year can not be duplicate');
      return;
    }

    setCurrent(current + 1);
    // handleUpdateData();
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <React.Fragment>
      <Layout>
        {/* Breadcrumb */}
        <div className='row py-3 px-3'>
          <div className='col-md-9' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                href='/user-management/non-academic-staff'
                className='th-grey th-16'
              >
                User Management
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>
                Edit Non Academic Staff
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        {/* STEP */}
        <div className='row mt-3 justify-content-center'>
          <div className='col-md-8 col-sm-10 col-12'>
            <div>
              <Steps current={current} labelPlacement='vertical'>
                {steps.map((item) => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>
            </div>
          </div>
        </div>

        <div className='row my-3'>
          <div className='col-md-12 col-sm-12 col-12 '>
            <div className='steps-content'>{steps[current].content}</div>
            <div className='row mt-3'>
              <div className='col-md-5'>
                <div className='steps-action'>
                  {current > 0 && (
                    <Button className='mr-3' onClick={() => prev()}>
                      Back
                    </Button>
                  )}
                  {current < steps.length - 1 && (
                    <Button type='primary' onClick={() => next()}>
                      Next
                    </Button>
                  )}
                  {current === steps.length - 1 && (
                    <Button
                      type='primary'
                      onClick={() => handleUpdateData()}
                      disabled={requestSent}
                    >
                      Update
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default EditNonAcademicStaff;
