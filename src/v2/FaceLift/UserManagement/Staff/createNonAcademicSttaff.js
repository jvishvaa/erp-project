import { Breadcrumb, Button, Checkbox, Steps, message } from 'antd';
import Layout from 'containers/Layout';
import React, { useState } from 'react';
import SchoolDetails from './schoolDetails';
import UserDetails from './userDetails';
import UploadExcel from './uploadExcel';
import { useSelector } from 'react-redux';
import axiosInstance from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useHistory } from 'react-router-dom';
const { Step } = Steps;

const CreateNoAcademicStaff = () => {
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const [requestSent, setRequestSent] = useState(false);
  const history = useHistory();

  const [userDetails, setUserDetails] = useState([
    {
      userLevel: '',
      userDesignation: '',
      academicYear: '',
      userBranch: '',
      userBranchCode: '',
      userProfile: '',
      userFirstName: '',
      userMiddleName: '',
      userLastName: '',
      userGender: 1,
      userDOB: '',
      userCode: '',
      userMobile: '',
      userUsername: '',
      userEmail: '',
      userAddress: '',
    },
  ]);

  const steps = [
    {
      title: 'School Details',
      content: (
        <SchoolDetails userDetails={userDetails} setUserDetails={setUserDetails} />
      ),
    },
    {
      title: 'User Details',
      content: <UserDetails userDetails={userDetails} setUserDetails={setUserDetails} />,
    },
  ];

  const [current, setCurrent] = useState(0);
  const [excelUpload, setExcelUpload] = useState(false);
  const next = () => {
    if (current === 0) {
      if (userDetails[0]?.userLevel === '' || userDetails[0]?.userLevel === undefined) {
        message.error('Please Select User Level');
        return;
      }
      if (
        userDetails[0]?.userDesignation === '' ||
        userDetails[0]?.userDesignation === undefined
      ) {
        message.error('Please Select User Designation');
        return;
      }
      if (userDetails[0]?.userRole === '' || userDetails[0]?.userRole === undefined) {
        message.error('Please Select User Role');
        return;
      }
      if (userDetails[0]?.userBranch === '' || userDetails[0]?.userBranch === undefined) {
        message.error('Please Select User Branch');
        return;
      }
      if (
        userDetails[0]?.academicYear === '' ||
        userDetails[0]?.academicYear === undefined
      ) {
        message.error('Please Enter Aacademic Year');
        return;
      }
      setCurrent(current + 1);
    }
  };

  const submitData = (userDetails) => {
    let userData = userDetails[0];
    let fd = new FormData();

    if (userData?.userUsername) {
      //  userData[0].userUsername = formData.value;
      if (
        userData.userUsername.toString().slice(0, 4) ==
          selectedYear?.session_year.toString().slice(0, 4) &&
        userData.userUsername.toString().slice(4, 7) ==
          userData?.userBranchCode.toString() &&
        userData.userUsername.toString().charAt(11) == '_' &&
        (userData.userUsername.toString().toLowerCase().slice(12, 15) == 'olv' ||
          userData.userUsername.toString().toLowerCase().slice(12, 15) == 'ois')
      ) {
        // console.log(userData?.userUsername, 'debug2');
      } else {
        // console.log('debug2 - wrong format', selectedYear?.session_year, userData);
        message.error('Wrong Format of username.');
        return false;
      }
    }
    setRequestSent(true);

    fd.append('academic_year', userData?.academicYear);
    fd.append('academic_year_value', selectedYear?.session_year);
    fd.append('branch', userData?.userBranch);
    fd.append('branch_code', userData?.userBranchCode);
    fd.append('designation', userData?.userDesignation);
    fd.append('first_name', userData?.userFirstName);
    fd.append('middle_name', userData?.userMiddleName);
    fd.append('last_name', userData?.userLastName);
    fd.append('gender', userData?.userGender);
    fd.append('date_of_birth', userData?.userDOB);
    fd.append('username', userData?.userUsername);
    fd.append('address', userData?.userAddress);
    fd.append('contact', `${userData?.userCode}-${userData?.userMobile}`);
    fd.append('email', userData?.userEmail);
    fd.append('profile', userData?.userProfile);
    fd.append('role', userData?.userRole);
    fd.append('user_level', userData?.userLevel);
    axiosInstance
      .post(`${endpoints.nonAcademicStaff.createStaff}`, fd)
      .then((res) => {
        if (res.status === 200) {
          message.success(res?.data?.message);
          history.push('/user-management/non-academic-staff');
        }
      })
      .catch((error) => {
        message.error(error.message);
        // console.log('error');
      })
      .finally(() => {
        setRequestSent(false);
      });
  };

  const handleSubmit = () => {
    let letterRegx = /^[A-Za-z ]+$/;
    if (current === 1) {
      // if (
      //   userDetails[0]?.userProfile === '' ||
      //   userDetails[0]?.userProfile === undefined
      // ) {
      //   message.error('Please Select User Profile');
      //   return;
      // }
      if (
        userDetails[0]?.userFirstName === '' ||
        userDetails[0]?.userFirstName === undefined
      ) {
        message.error('Please Enter User First Name');
        return;
      }
      if (!userDetails[0]?.userFirstName.match(letterRegx)) {
        message.error('First Name should only contains character');
        return;
      }
      if (userDetails[0]?.userMiddleName !== '') {
        if (!userDetails[0]?.userMiddleName.match(letterRegx)) {
          message.error('Middle Name should only contains character');
          return;
        }
      }
      if (
        userDetails[0]?.userLastName === '' ||
        userDetails[0]?.userLastName === undefined
      ) {
        message.error('Please Enter User Last Name');
        return;
      }
      if (!userDetails[0]?.userLastName.match(letterRegx)) {
        message.error('Last Name should only contains character');
        return;
      }
      if (userDetails[0]?.userGender === '' || userDetails[0]?.userGender === undefined) {
        message.error('Please Select User Gender');
        return;
      }
      if (userDetails[0]?.userDOB === '' || userDetails[0]?.userDOB === undefined) {
        message.error('Please Enter User Date of Birth');
        return;
      }
      if (userDetails[0]?.userCode === '' || userDetails[0]?.userCode === undefined) {
        message.error('Please Select User Country Code');
        return;
      }
      if (isNaN(userDetails[0]?.userMobile)) {
        message.error('Mobile No. should only contains numbers');
        return;
      }
      if (userDetails[0]?.userMobile === '' || userDetails[0]?.userMobile === undefined) {
        message.error('Please Enter User Mobile No.');
        return;
      }
      if (userDetails[0]?.userCode === '+91') {
        if (
          userDetails[0]?.userMobile.toString().length < 10 ||
          userDetails[0]?.userMobile.toString().length > 10
        ) {
          message.error('Mobile No. must be 10 digit long');
          return;
        }
      } else {
        if (
          userDetails[0]?.userMobile.toString().length < 10 ||
          userDetails[0]?.userMobile.toString().length > 12
        ) {
          message.error('Mobile No. must be 10 to 12 digit long');
          return;
        }
      }

      if (userDetails[0]?.userUsername !== '') {
        if (userDetails[0]?.userUsername.length !== 15) {
          message.error('The username must be of 15 characters');
          return;
        }
      }
      if (userDetails[0]?.userEmail === '' || userDetails[0]?.userEmail === undefined) {
        message.error('Please Enter User Email');
        return;
      }
      if (
        userDetails[0]?.userAddress === '' ||
        userDetails[0]?.userAddress === undefined
      ) {
        message.error('Please Enter User Address');
        return;
      }
      submitData(userDetails);
    }
  };
  const prev = () => {
    setUserDetails([
      {
        userLevel: '',
        userDesignation: '',
        academicYear: '',
        userBranch: '',
        userBranchCode: '',
        userProfile: '',
        userFirstName: '',
        userMiddleName: '',
        userLastName: '',
        userGender: 1,
        userDOB: '',
        userCode: '',
        userMobile: '',
        userUsername: '',
        userEmail: '',
        userAddress: '',
      },
    ]);
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

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
                Create Non Academic Staff
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <div className='row my-3 pl-3'>
          <div className='col-md-10'>
            <Checkbox onChange={(e) => setExcelUpload(e.target.checked)}>
              Upload Excel
            </Checkbox>
          </div>
        </div>

        {excelUpload ? (
          <div className='row mt-3'>
            <div className='col-md-12 col-sm-12 col-12'>
              <UploadExcel />
            </div>
          </div>
        ) : (
          <>
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
              <div className='col-md-12 col-sm-12 col-12'>
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
                          onClick={handleSubmit}
                          disabled={requestSent}
                        >
                          Submit
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Layout>
    </React.Fragment>
  );
};

export default CreateNoAcademicStaff;
