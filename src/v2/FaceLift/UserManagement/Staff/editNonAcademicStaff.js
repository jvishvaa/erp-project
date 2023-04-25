import { Breadcrumb, Button, Steps } from 'antd';
import Layout from 'containers/Layout';
import React, { useEffect, useState } from 'react';
import EditSchoolDetails from './editSchoolDetails';
import endpoints from 'v2/config/endpoints';
import { useParams } from 'react-router-dom';
import axiosInstance from 'v2/config/axios';

const EditNonAcademicStaff = () => {
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState([]);
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    console.log('hit api');
    axiosInstance
      .get(`${endpoints.nonAcademicStaff.viewStaff}?erp_user_id=${id}`)
      .then((res) => {
        console.log({ res });
        if (res?.data?.status_code === 200) {
          setUserDetails(res?.data?.result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
console.log({userDetails});
  // const [userDetails, setUserDetails] = useState([
  //   {
  //     id: 1,
  //     erp_id: '20225670001_AYI',
  //     user_middle_name: '',
  //     contact: '+91-8765432635',
  //     gender: 'male',
  //     profile: null,
  //     user: {
  //       id: 16682,
  //       username: '20225670001_AYI',
  //       first_name: 'non_acad',
  //       last_name: '_1',
  //       email: 'test@gmail.com',
  //       user_level: 24,
  //       user_level_int: 24,
  //     },
  //     mapping_bgs: [
  //       {
  //         session_year: [
  //           {
  //             session_year_id: 2,
  //             is_current_session: true,
  //             acad_session_year: '2022-23',
  //           },
  //         ],
  //         branch: [
  //           {
  //             branch_id: 1,
  //             branch__branch_name: 'OLV',
  //           },
  //         ],
  //       },
  //       {
  //         session_year: [
  //           {
  //             session_year_id: 57,
  //             is_current_session: false,
  //             acad_session_year: '2023-24',
  //           },
  //         ],
  //         branch: [
  //           {
  //             branch_id: 83,
  //             branch__branch_name: 'OLV BTM',
  //           },
  //         ],
  //       },
  //     ],
  //     status: 'active',
  //     is_delete: false,
  //     address: 'address',
  //     date_of_birth: '2023-04-01',
  //     name: 'non_acad  _1',
  //     role: {
  //       id: 15,
  //       role_name: 'Vikash',
  //       created_at: '2021-03-22T14:06:30.433022',
  //       created_by: 'super_admin_OLV',
  //     },
  //     acad_session: [
  //       {
  //         id: 24,
  //         created_at: '2021-03-24T23:56:09.861593',
  //         is_delete: false,
  //         session_year: 2,
  //         branch: 1,
  //         created_by: null,
  //       },
  //       {
  //         id: 867,
  //         created_at: '2023-03-29T18:23:16.724831',
  //         is_delete: false,
  //         session_year: 57,
  //         branch: 83,
  //         created_by: null,
  //       },
  //     ],
  //     designation: 1,
  //     user_level: 15,
  //   },
  // ]);
  const handleUpdateUserDetails = (data) => {
    console.log({ data });
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
        />
      ),
    },
    {
      title: 'User Details',
      content: 'User Details',
    },
  ];

  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
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
                      // onClick={handleSubmit}
                      // disabled={requestSent}
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
