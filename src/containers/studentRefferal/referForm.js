import React, { useContext, useRef, useState, useEffect } from 'react';
import {
  Button,
  Grid,
  makeStyles,
  Paper,
  withStyles,
  useTheme,
  Box,
  Input,
  Typography,
} from '@material-ui/core';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../Layout';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import { Autocomplete } from '@material-ui/lab';
import { connect, useSelector } from 'react-redux';
import { Divider, TextField } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import axiosInstance from '../../config/axios';
import endpoints from 'config/endpoints';
import FileSaver from 'file-saver';
import IMGPIC from 'assets/images/img1.png';
import Orchids from 'assets/images/orchids.png';
import { CSVLink } from 'react-csv';
import TablePagination from '@material-ui/core/TablePagination';
import { useHistory } from 'react-router';
import Loader from 'components/loader/loader';
import { Table, Tabs, Pagination, Empty, Checkbox, Spin, Modal } from 'antd';

import './referstudent.scss';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: theme.commonTableRoot,
  paperStyled: {
    minHeight: '80vh',
    height: '100%',
    padding: '50px',
    marginTop: '15px',
  },
  guidelinesText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: theme.palette.secondary.main,
  },
  errorText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fe6b6b',
    marginBottom: '30px',
    display: 'inline-block',
  },
  table: {
    minWidth: 650,
  },
  downloadExcel: {
    float: 'right',
    fontSize: '16px',
    // textDecoration: 'none',
    // backgroundColor: '#fe6b6b',
    // color: '#ffffff',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  tableCell: {
    color: theme.palette.secondary.main,
  },
  tablePaginationSpacer: {
    flex: 0,
  },
  tablePaginationToolbar: {
    justifyContent: 'center',
  },
  cardsContainer: {
    width: '95%',
    margin: '0 auto',
  },
  tablePaginationCaption: {
    fontWeight: '600 !important',
  },
  tablePaginationSpacer: {
    flex: 0,
  },
  tablePaginationToolbar: {
    justifyContent: 'center',
  },
  guidelineval: {
    color: theme.palette.primary.main,
    fontWeight: '600',
  },
  guideline: {
    color: theme.palette.secondary.main,
    fontSize: '16px',
    padding: '10px',
  },
}));

const StyledButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: '#FFFFFF',
    padding: '8px 15px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}))(Button);

const StyledButtonUnblock = withStyles({
  root: {
    backgroundColor: '#228B22',
    color: '#FFFFFF',
    padding: '2px 8px',
    fontSize: '10px',
    '&:hover': {
      backgroundColor: '#228B22 !important',
    },
  },
})(Button);

const StyledButtonBlock = withStyles({
  root: {
    backgroundColor: '#FF2E2E',
    color: '#FFFFFF',
    padding: '2px 8px',
    fontSize: '10px',
    '&:hover': {
      backgroundColor: '#FF2E2E !important',
    },
  },
})(Button);

const StyledClearButton = withStyles((theme) => ({
  root: {
    backgroundColor: '#E2E2E2',
    color: '#8C8C8C',
    padding: '8px 15px',
    marginLeft: '30px',
    '&:hover': {
      backgroundColor: '#E2E2E2 !important',
    },
  },
}))(Button);

const statusColorMap = {
  Active: '#087D21',
  Pending: '#F41919',
  'In Progress': '#DCC70B',
  Inactive: '#000000',
  Rewarded: '#1F620E',
};

const StudentRefer = () => {
  const classes = useStyles({});
  const fileRef = useRef();
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const { TabPane } = Tabs;

  const [moduleId, setModuleId] = useState('');
  // const [selectedAcademicYear, setSelectedAcadmeicYear] = useState('');
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const history = useHistory();

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};

  const [checkFilter, setCheckFilter] = useState(false);
  const [student, setStudent] = useState('');
  const [parent, setParent] = useState('');
  const [phone, setPhone] = useState('');
  const [mail, setMail] = useState('');
  const [refferList, setRefferList] = useState([]);
  const [studentError, setStudentError] = useState('');
  const [parentError, setParentError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [cityError, setCityError] = useState('');
  const [checkBoxError, setCheckBoxError] = useState('');

  const [mailError, setMailError] = useState('');
  const [valid, setValid] = useState(true);
  const [activeKey, setActiveKey] = useState('1');
  const [isChecked, setChecked] = useState(false);
  const [refferListPageData, setRefferListPageData] = useState({
    currentPage: 1,
    pageSize: 5,
    totalCount: null,
    totalPage: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // const regexEmail =
  // /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const nameRegex = /^[a-zA-Z ]+$/;

  const columns = [
    {
      title: 'Sl.no',
      dataIndex: 'id', // Use 'sno' as the dataIndex for the row number
      key: 'id',
      // render: (text, record, index) => index + 1, // Render the row number
      render: (text, record, index) =>
        (refferListPageData.currentPage - 1) * refferListPageData.pageSize + index + 1,
    },
    {
      title: 'Student Name',
      dataIndex: 'student_name',
      key: 'student_name',
    },
    {
      title: 'Parent Name',
      dataIndex: 'parent_name',
      key: 'parent_name',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Mobile No',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Referral code',
      dataIndex: 'referral_code',
      key: 'referral_code',
    },
    {
      title: 'Status',
      dataIndex: 'concession_status_display',
      key: 'concession_status_display',
      render: (text) => {
        const color = statusColorMap[text] || 'black'; // Default to black if status is not found in the map
        return <span style={{ color }}>{text}</span>;
      },
    },
  ];

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Online Class' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Attend Online Class') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  const handleStudentName = (e) => {
    setStudent(e.target.value);
    validateStudentName(e.target.value);
  };

  const validateCity = (value) => {
    if (!nameRegex.test(value) && value !== '') {
      setCityError('Invalid City Name ie. Only Alphabets');
      setValid(false);
      return false;
    } else {
      setCityError('');
      setValid(true);
      return true;
    }
  };

  const validateStudentName = (value) => {
    if (!nameRegex.test(value) && value !== '') {
      setStudentError('Invalid Student Name ie. Only Alphabets');
      setValid(false);
      return false;
    } else {
      setStudentError('');
      setValid(true);
      return true;
    }
  };

  const validateParentName = (value) => {
    if (!nameRegex.test(value) && value !== '') {
      setParentError('Invalid Parent Name ie. Only Alphabets');
      setValid(false);
      return false;
    } else {
      setParentError('');
      setValid(true);
      return true;
    }
  };

  const handleParentName = (e) => {
    setParent(e.target.value);
    validateParentName(e.target.value);
  };
  const handleCity = (e) => {
    setSelectedBranch(e.target.value);
    validateCity(e.target.value);
  };
  const handlePhone = (e) => {
    setPhone(e.target.value);
    phonevalidate(e.target.value);
  };
  const handleMail = (e) => {
    setMail(e.target.value);
    emailValidate(e.target.value);
  };

  const emailValidate = (value) => {
    if (!regexEmail.test(value) && value !== '') {
      setMailError('Email is Invalid');
      setValid(false);
      return false;
    } else {
      setMailError('');
      setValid(true);
      return true;
    }
  };

  const phonevalidate = (value) => {
    let numberRegex = /^[1-9]([0-9]{9}$)/;
    if (!numberRegex.test(value) && value !== '') {
      setValid(false);
      setPhoneError('phone number not valid');
      return false;
    } else {
      setPhoneError('');
      setValid(true);
      return true;
    }
  };

  // useEffect(() => {
  //   if (moduleId && selectedAcademicYear) {
  //     axiosInstance
  //       .get(
  //         `erp_user/branch/?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`
  //       )
  //       .then((res) => {
  //         // setAcademicYear(res?.data?.data);
  //         setBranchList(res?.data?.data?.results);
  //         console.log(res.data.data, 'academic');
  //         // const defaultValue = res?.data?.data?.[0];
  //         // handleAcademicYear(defaultValue);
  //       })
  //       .catch((error) => {
  //         setAlert('error', 'Something Wrong!');
  //       });
  //   }
  // }, [moduleId, selectedAcademicYear]);

  const handleClearAll = () => {
    fileRef.current.value = null;
    // setSelectedAcadmeicYear();
    setSelectedBranch();
  };

  const handleClearAllList = () => {};

  const branchCheck = () => {
    if (selectedBranch.length === 0) {
      setAlert('warning', 'Please select branch');
      console.log(selectedBranch.length);
    } else {
      // setAlert('warning', 'mil gya');
    }
  };

  const handleRedirect = (res) => {
    console.log(res.status, 'status');
    setAlert('success', res?.data.message);
    history.push({
      pathname: '/successrefer',
      state: {
        data: res.data.data,
      },
    });
  };

  const handleTabChange = (key) => {
    setActiveKey(key);

    if (key === '2') {
      setRefferListPageData({
        ...refferListPageData,
        currentPage: 1,
      });
    }
  };

  useEffect(() => {
    getData(refferListPageData.currentPage);
  }, [refferListPageData.currentPage]);

  const handleSubmit = () => {
    setLoading(true);
    if (cityError) {
      setAlert('error', cityError);
      setLoading(false);
      return;
    } else if (studentError) {
      setAlert('error', studentError);
      setLoading(false);
      return;
    } else if (parentError) {
      setAlert('error', parentError);
      setLoading(false);
      return;
    } else if (phoneError) {
      setAlert('error', phoneError);
      setLoading(false);
      return;
    } else if (mailError) {
      setAlert('error', mailError);
      setLoading(false);
      return;
    } else if (!isChecked) {
      setCheckBoxError('Please check the terms and conditions');
      setAlert('error', 'Check the terms and condition');
      setLoading(false);
      return;
    } else {
      console.log('Checking');
      branchCheck();
      const data = {
        parent_name: parent,
        student_name: student,
        city: selectedBranch,
        email_id: mail,
        phone_number: phone,
        referral_code: userDetails?.erp,
      };
      if (student && parent && mail && phone && valid) {
        axiosInstance
          .post(`${endpoints.referral.studentReferV2}`, data, {
            headers: {
              Authorization: `Bearer ${userDetails?.token}`,
            },
          })
          .then((results) => {
            // setAlert('success', results?.message);
            // history.push('/dashboard');
            console.log(results?.data.message, 'results');
            handleRedirect(results);
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            // console.log(error.response.data.message, 'error');
            setAlert('error', error.response.data.message);
          });
      } else {
        setLoading(false);
        setAlert('error', 'All Fields are Mandatory');
      }
    }
  };

  const getData = (pageNo) => {
    setLoading(true);
    const refererCode = userDetails?.erp;
    axiosInstance
      .get(`${endpoints.referral.studentReferralList}?referer=${refererCode}`, {
        params: {
          page: pageNo !== undefined ? pageNo : refferListPageData.currentPage,
          page_size: refferListPageData.pageSize,
        },
      })
      .then((res) => {
        console.log(res, 'res');
        const data = res?.data?.result?.results;
        if (res.status === 200) {
          setRefferListPageData({
            ...refferListPageData,
            totalCount: res.data.result.count,
            totalPage: Math.ceil(res.data.result.count / refferListPageData.pageSize),
          });
          setRefferList(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err, 'fetchRefferList Error');
        setLoading(false);
      });
  };

  const onchangeCheckbox = (e) => {
    setChecked(e.target.checked);
    setCheckBoxError('');
  };

  const showModal = () => {
    console.log('showModal called');
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Layout className='student-refer-whole-container'>
      <div className={classes.parentDiv}>
        <CommonBreadcrumbs
          componentName='Student Refer'
          childComponentName='Orchids Ambassador Program'
          isAcademicYearVisible={true}
        />
        <Tabs activeKey={activeKey} onChange={handleTabChange} className='p-1 pt-0'>
          <TabPane tab='Refer Now' key='1'>
            <Paper>
              <div className='student-refer-container'>
                {loading ? (
                  <Loader />
                ) : (
                  <div className='image-class'>
                    <div className='leftimage'>
                      <div className='main-img'>
                        <img src={IMGPIC} className='image-left' />
                      </div>
                      <div className='orchidslogo'>
                        <img src={Orchids} className='logo-orchids' />
                      </div>
                    </div>

                    <div className='form-div'>
                      <div className='header-refer-container'>
                        <p className='referHeader'>Refer Now</p>
                        <p className='small-header'>
                          Take advantage of the ORCHIDS AMBASSADOR PROGRAM
                        </p>
                      </div>
                      <div className='form-area'>
                        <TextField
                          id='outlined-basic'
                          label='City'
                          variant='outlined'
                          size='small'
                          className='input-boxes'
                          onChange={(e) => handleCity(e)}
                          helperText={cityError}
                          error={cityError.length !== 0}
                          required={true}
                        />

                        <TextField
                          id='outlined-basic'
                          label='Student Name'
                          variant='outlined'
                          size='small'
                          className='input-boxes'
                          onChange={(e) => handleStudentName(e)}
                          helperText={studentError}
                          error={studentError.length !== 0}
                          required={true}
                        />
                        <TextField
                          id='outlined-basic'
                          label='Parents Name'
                          variant='outlined'
                          size='small'
                          helperText={parentError}
                          error={parentError.length !== 0}
                          className='input-boxes'
                          onChange={(e) => handleParentName(e)}
                          required={true}
                        />
                        <TextField
                          id='outlined-basic'
                          label='Phone Number'
                          inputProps={{
                            maxLength: 10,
                          }}
                          variant='outlined'
                          className='input-boxes'
                          helperText={phoneError}
                          error={phoneError.length !== 0}
                          size='small'
                          onChange={(e) => handlePhone(e)}
                          type='number'
                          required={true}
                        />
                        <TextField
                          id='outlined-basic'
                          label='E-mail'
                          variant='outlined'
                          size='small'
                          helperText={mailError}
                          error={mailError.length !== 0}
                          className='input-boxes'
                          onChange={(e) => handleMail(e)}
                          required={true}
                        />
                        <div className='d-flex align-items-center justify-content-center mb-2 th-width-60'>
                          <div className='mb-3'>
                            <Checkbox onChange={onchangeCheckbox} checked={isChecked} />
                          </div>

                          <div className='ml-2'>
                            I have read and agree to the{' '}
                            <u className='th-primary th-pointer ' onClick={showModal}>
                              Terms & Conditions
                            </u>{' '}
                            of Referral Program.
                          </div>
                          <Modal
                            title='Referral Policy Terms & Conditions:'
                            visible={isModalOpen}
                            onOk={handleOk}
                            // onCancel={handleCancel}
                            footer={[
                              <Button key='ok' type='primary' onClick={handleOk}>
                                OK
                              </Button>,
                            ]}
                            width={'50%'}
                          >
                            <div className='"p-5 pt-2 pb-0"'>
                              <p>
                                <b>Referral Concession Eligibility: </b>
                                The referral concession pertains exclusively to the
                                tuition fee of the referred student, which amounts to 4%
                                of the tuition fee paid by the referred student for the
                                first year of referral. <br />
                                <br />
                                <b>Calculation of Discounts:</b> In a scenario where X
                                refers both students A and B, X's discount will be
                                calculated as the sum of two components: 4% of the tuition
                                fee paid by student A in the first year and 4% of the
                                tuition fee paid by student B in the first year.
                                <br />
                                <br />
                                <b>Duration of Referral Amount Validity:</b> The referral
                                amount is applicable for a span of two academic sessions,
                                including the referral year. <br />
                                <br />
                                <b>Referral Priority:</b> The discount will be applied to
                                the parent who submits the initial referral. In the event
                                that the referred student is already a part of the system,
                                or if the student already exists in our system, further
                                referrals for the same student will not be accepted.{' '}
                                <br />
                                <br />
                                <b>Exemption for Siblings: </b>
                                Siblings are exempt from participation in this referral
                                program and cannot be referred. <br />
                                <br />
                                <b>Exclusions from Applicability:</b> The referral
                                discount does not apply to Admission fees, Transportation
                                fees, Building and utilities fees, or Non-academic fees
                              </p>
                            </div>
                          </Modal>
                        </div>
                        <div style={{ color: 'red', marginBottom: '2px' }}>
                          {checkBoxError}
                        </div>

                        <div className='submit-btn-area'>
                          <StyledButton onClick={handleSubmit}>Submit</StyledButton>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Paper>
          </TabPane>
          <TabPane tab='My Referrals' key='2'>
            {loading ? (
              <div className='d-flex justify-content-center align-items-center h-50 pt-5'>
                <Spin tip='Loading...' size='large' />
              </div>
            ) : refferList.length > 0 ? (
              <Table
                dataSource={refferList}
                columns={columns}
                className='custom-table'
                pagination={false}
              />
            ) : (
              <div className='d-flex justify-content-center mt-5 th-grey'>
                <Empty
                  description={
                    <span>
                      No Data.
                      {/* <br />" Stay tuned for the updates! " */}
                    </span>
                  }
                />
              </div>
            )}

            {!loading && refferList.length > 0 && (
              <div className='text-center mt-2'>
                <Pagination
                  current={refferListPageData.currentPage}
                  total={refferListPageData.totalCount}
                  pageSize={refferListPageData.pageSize}
                  onChange={(value) =>
                    setRefferListPageData({
                      ...refferListPageData,
                      currentPage: value,
                    })
                  }
                  showSizeChanger={false} // Optional: hide the page size changer
                  showQuickJumper={false}
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`
                  }
                />
              </div>
            )}
            {!loading && (
              <div
                style={{
                  color: '#3956A1',
                }}
                className='d-flex align-items-center justify-content-center mt-4'
              >
                Note: Referral concession will be applied once your referral successfully
                pays their tuition fees
              </div>
            )}
          </TabPane>
        </Tabs>
      </div>
    </Layout>
  );
};

export default StudentRefer;
