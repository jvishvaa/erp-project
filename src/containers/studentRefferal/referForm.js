import React, { useContext, useRef, useState, useEffect } from 'react';
import {
  Button,
  Grid,
  makeStyles,
  Paper,
  withStyles,
  useTheme,
  Box,
  Typography,
  IconButton,
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
import {
  Table,
  Tabs,
  Pagination,
  Empty,
  Checkbox,
  Spin,
  Modal,
  Input,
  Col,
  Form,
  Tooltip,
} from 'antd';
import { Add, RemoveCircleOutline } from '@material-ui/icons';

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
    '&:disabled': {
      backgroundColor: theme.palette.grey[500], // Use an appropriate shade of gray
      color: 'white', // Adjust text color for better visibility
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
  const history = useHistory();

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};

  const [checkFilter, setCheckFilter] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [city, setCity] = useState('');
  const [student, setStudent] = useState('');
  const [siblings, setsiblings] = useState(['']);
  const [parent, setParent] = useState('');
  const [phone, setPhone] = useState('');
  const [mail, setMail] = useState('');
  const [refferList, setRefferList] = useState([]);
  const [studentError, setStudentError] = useState('');
  const [parentError, setParentError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [cityError, setCityError] = useState('');
  const [checkBoxError, setCheckBoxError] = useState('');
  const [siblingsError, setsiblingsError] = useState('');

  const [mailError, setMailError] = useState('');
  const [valid, setValid] = useState(true);
  const [activeKey, setActiveKey] = useState('1');
  const [isChecked, setChecked] = useState(false);
  const [hassiblings, setHassiblings] = useState(false);
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
      // dataIndex: 'parentId',
      dataIndex: 'id',
      key: 'id',
      // key: 'parentId',
      render: (text, record, index) =>
        (refferListPageData.currentPage - 1) * refferListPageData.pageSize + index + 1,
    },
    {
      title: 'Parent Name',
      dataIndex: 'parent_name',
      key: 'parent_name',
      render: (text, record) => (
        <>
          {record?.parent_name?.length > 26 ? (
            <Tooltip
              autoAdjustOverflow={false}
              placement='bottomLeft'
              title={record?.parent_name}
              overlayStyle={{ maxWidth: '40%', minWidth: '20%' }}
            >
              <span>{`${record?.parent_name.substring(0, 26)}...`}</span>
            </Tooltip>
          ) : (
            <span>{record?.parent_name}</span>
          )}
        </>
      ),
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
      title: 'Student Name',
      key: 'student_name',
      render: (text, record) => (
        <>
          {record?.siblings.map((each, index) =>
            each?.student_name?.length > 26 ? (
              <Tooltip
                autoAdjustOverflow={false}
                placement='bottomLeft'
                title={each?.student_name}
                overlayStyle={{ maxWidth: '40%', minWidth: '20%' }}
                key={index}
              >
                <span key={index}>
                  {`${each?.student_name.substring(0, 26)}...`}
                  {/* {each?.student_name} */}
                  {record?.siblings?.length > 1 ? (
                    <>
                      <br />
                      <br />
                    </>
                  ) : (
                    ''
                  )}
                </span>
              </Tooltip>
            ) : (
              <span key={index}>
                {each?.student_name}
                {record?.siblings?.length > 1 ? (
                  <>
                    <br />
                    <br />
                  </>
                ) : (
                  ''
                )}
              </span>
            )
          )}
        </>
      ),
    },

    {
      title: 'Referral code',
      dataIndex: 'referral_code',
      key: 'referral_code',
      render: (text, record) => {
        return (
          <>
            {record?.siblings.map((each, index) => (
              <span key={index} style={{ textAlign: 'center' }}>
                {each?.referral_code}
                {record?.siblings?.length > 1 ? (
                  <>
                    <br />
                    <br />
                  </>
                ) : (
                  ''
                )}
              </span>
            ))}
          </>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'concession_status_display',
      key: 'concession_status_display',
      render: (text, record) => {
        return (
          <>
            {record?.siblings.map((each, index) => (
              <span
                key={index}
                style={{
                  color: statusColorMap[each?.concession_status_display] || 'black',
                  textAlign: 'center',
                }}
              >
                {each?.concession_status_display}
                {record?.siblings?.length > 1 ? (
                  <>
                    <br />
                    <br />
                  </>
                ) : (
                  ''
                )}
              </span>
            ))}
          </>
        );
      },
    },
  ];

  useEffect(() => {
    if (NavData && NavData?.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Online Class' &&
          item.child_module &&
          item.child_module?.length > 0
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

  // const validateStudentName = (value) => {
  //   if (!nameRegex.test(value) && value !== '') {
  //     setStudentError('Invalid Student Name ie. Only Alphabets');
  //     setValid(false);
  //     return false;
  //   } else {
  //     setStudentError('');
  //     setValid(true);
  //     return true;
  //   }
  // };

  const validateStudentName = (value) => {
    if (value?.length > 100) {
      setStudentError('Student Name cannot exceed 100 characters');
      setValid(false);
      return false;
    } else if (!nameRegex.test(value) && value !== '') {
      setStudentError('Invalid Student Name i.e., Only Alphabets');
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
    setCity(e.target.value);
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

  const handlesiblingsError = () => {
    const errors = [];
    const seenSiblings = new Set();

    siblings.forEach((sibling, index) => {
      const trimmedSibling = sibling.trim().toLowerCase();

      if (trimmedSibling === '') {
        errors.push(index);
      } else if (seenSiblings.has(trimmedSibling)) {
        // Check for duplicate values
        errors.push('duplicateFound');
        console.log('error found');
      } else {
        seenSiblings.add(trimmedSibling);
      }
      console.log(trimmedSibling, seenSiblings, 'trimmedsibling');
    });

    if (siblings?.length > 5) {
      errors.push('maxLimitExceeded');
    }

    return errors;
  };

  const handleSiblingsCount = () => {
    return siblings.some((sibling) => {
      const trimmedSibling = sibling.trim().toLowerCase();
      return trimmedSibling?.length > 100;
    });
  };

  const handleStudentSiblingsMatch = () => {
    return siblings.some((sibling) => {
      const trimmedSibling = sibling.trim().toLowerCase();
      return trimmedSibling !== '' && student.trim().toLowerCase() === trimmedSibling;
    });
  };

  console.log(handleStudentSiblingsMatch(), 'StudentSibling');

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

  const handleRedirect = (res) => {
    console.log(res.status, 'status');
    console.log(res, 'redirect');
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

  const SiblingString = siblings.join(',');

  // const flattenData = (data, currentPage) => {
  //   let startIndex = (currentPage - 1) * refferListPageData.pageSize;

  //   return data.reduce((flattened, student, index) => {
  //     const parentId = startIndex + index + 1;

  //     flattened.push({
  //       ...student,
  //       isSibling: false,
  //       parentId: parentId,
  //     });

  //     if (student.siblings && student.siblings.length > 1) {
  //       student.siblings.forEach((sibling) => {
  //         flattened.push({
  //           ...sibling,
  //           isSibling: true,
  //         });
  //       });
  //     }

  //     return flattened;
  //   }, []);
  // };

  // const flattenData = (data, currentPage) => {
  //   let startIndex = (currentPage - 1) * refferListPageData.pageSize;
  //   let count = startIndex;

  //   return data.reduce((flattened, student, index) => {
  //     count++;

  //     if (student?.siblings && student?.siblings.length > 0) {
  //       student?.siblings.forEach((sibling, siblingIndex) => {
  //         const siblingRecord = {
  //           ...sibling,
  //           isSibling: true,
  //         };

  //         if (siblingIndex === 0) {
  //           siblingRecord.phone_number = student.phone_number;
  //           siblingRecord.city = student.city;
  //           siblingRecord.parent_name = student.parent_name;
  //           siblingRecord.parentId = count;
  //         }

  //         flattened.push(siblingRecord);
  //       });
  //       flattened.push({ isSiblingEndMarker: true });
  //     }

  //     return flattened;
  //   }, []);
  // };

  // const flattenedRefferList = flattenData(refferList, refferListPageData.currentPage);

  // console.log(flattenedRefferList, 'flattenedRefferList');

  const getRowClassName = (record, index) => {
    return index % 2 === 0 ? 'even-row' : 'odd-row';
  };

  const handleSubmit = () => {
    setLoading(true);
    if (city === '') {
      setAlert('error', 'City name cannot be empty');
      setLoading(false);
      return;
    } else if (!nameRegex.test(city) && city !== '') {
      setAlert('error', 'Invalid City Name ie. Only Alphabets');
      setLoading(false);
      return;
    } else if (studentError) {
      setAlert('error', studentError);
      setLoading(false);
      return;
    } else if (student?.length > 100) {
      setAlert('error', 'Student Name cannot exceed 100 characters');
      setLoading(false);
      return;
    } else if (parent?.length > 100) {
      setAlert('error', 'Parent Name cannot exceed 100 characters');
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
      setCheckBoxError('Please agree to the terms and conditions before  proceeding');
      setAlert('error', 'Please agree to the terms and conditions before  proceeding');
      setLoading(false);
      return;
    } else if (
      handlesiblingsError().length > 0 &&
      !handlesiblingsError().includes('duplicateFound') &&
      hassiblings
    ) {
      setAlert('error', 'Siblings field cannot be empty');
      setLoading(false);
      return;
    } else if (handleStudentSiblingsMatch()) {
      setAlert('error', 'Student name and Siblings name should not be the same');
      setLoading(false);
      return;
    } else if (handleSiblingsCount()) {
      setAlert('error', 'Siblings name cannot exceed 100 characters');
      setLoading(false);
      return;
    } else if (handlesiblingsError().includes('duplicateFound')) {
      setAlert('error', 'Duplicate sibling names are not allowed');
      setLoading(false);
      return;
    } else {
      console.log('Checking');
      // branchCheck();

      let payload;

      if (SiblingString?.length > 0) {
        payload = {
          parent_name: parent,
          student_name: student,
          siblings_name: SiblingString,
          city: city,
          email_id: mail,
          phone_number: phone,
          referral_code: userDetails?.erp,
        };
      } else {
        payload = {
          parent_name: parent,
          student_name: student,
          city: city,
          email_id: mail,
          phone_number: phone,
          referral_code: userDetails?.erp,
        };
      }

      if (student && parent && mail && phone && city && valid) {
        axiosInstance
          .post(`${endpoints.referral.studentReferV2}`, payload, {
            headers: {
              Authorization: `Bearer ${userDetails?.token}`,
            },
          })
          .then((results) => {
            // setAlert('success', results?.message);
            // history.push('/dashboard');
            console.log(results, 'success');
            console.log(results?.data.message, 'results');
            console.log(results, 'resultsdata');
            handleRedirect(results);
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            setChecked(false);
            setHassiblings(false);
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
        const data = res?.data?.result?.results;
        console.log(data, 'resData');

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

  const addSiblings = () => {
    if (siblings?.length < 5) {
      setsiblings([...siblings, '']);
    } else {
      setAlert('error', 'Only upto 5 Siblings can be added');
    }
  };

  const removeSibling = (index) => {
    let newSiblings = siblings.slice();

    newSiblings.splice(index, 1);
    console.log(newSiblings, 'siblingsremoved');
    setsiblings(newSiblings);
  };

  const handleSiblings = (e, index) => {
    const newSiblingNames = [...siblings];
    newSiblingNames[index] = e.target.value;
    setsiblings(newSiblingNames);
  };

  const onchangeCheckbox = (e) => {
    setChecked(e.target.checked);
    setCheckBoxError('');
  };

  const onCheckSiblings = (e) => {
    setHassiblings(e.target.checked);
    setsiblings(['']);
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

  console.log(student, 'hassiblings');

  return (
    <Layout className='student-refer-whole-container'>
      <div className='row py-3 px-2'>
        <div className='col-md-6 th-bg-grey' style={{ zIndex: 2 }}>
          <CommonBreadcrumbs
            componentName='Student Refer'
            childComponentName='Orchids Ambassador Program'
            isAcademicYearVisible={false}
          />
        </div>
        <div className='row'>
          <div className='col-12'>
            <div className='th-tabs th-bg-white'>
              <Tabs
                activeKey={activeKey}
                onChange={handleTabChange}
                className=' pt-0'
                type='card'
              >
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
                              <div style={{ width: '60%' }}>
                                <Col md={12}>
                                  <Form.Item
                                    rules={[
                                      {
                                        required: true,
                                        message: 'Please enter a valid city name',
                                      },
                                    ]}
                                    name={'City'}
                                    label='City'
                                  >
                                    <Input
                                      allowClear={true}
                                      placeholder='City Name'
                                      style={{ width: '200%' }}
                                      size='large'
                                      onChange={(e) => handleCity(e)}
                                      required={true}
                                      pattern='[A-Za-z]+'
                                      title='Please enter only alphabets'
                                      onKeyPress={(e) => {
                                        const pattern = /^[A-Za-z]+$/;
                                        const inputChar = String.fromCharCode(e.charCode);
                                        if (!pattern.test(inputChar)) {
                                          e.preventDefault();
                                        }
                                      }}
                                    />
                                  </Form.Item>
                                </Col>
                              </div>
                              <div style={{ width: '60%' }}>
                                <Col md={12}>
                                  <Form.Item
                                    rules={[
                                      {
                                        required: true,
                                        message: 'Please enter a valid Student name',
                                      },
                                    ]}
                                    name={'Student'}
                                    label='Student'
                                  >
                                    <Input
                                      allowClear={true}
                                      placeholder='Student Name'
                                      style={{ width: '200%' }}
                                      size='large'
                                      onChange={(e) => handleStudentName(e)}
                                      required={true}
                                      pattern='^[A-Za-z ]*$'
                                      title='Please enter only alphabets'
                                      onKeyPress={(e) => {
                                        const pattern = /^[A-Za-z ]+$/;
                                        const inputChar = String.fromCharCode(e.charCode);

                                        // Allow only alphabetic characters and space
                                        if (!pattern.test(inputChar)) {
                                          e.preventDefault();
                                        }
                                      }}
                                    />
                                  </Form.Item>
                                </Col>
                              </div>
                              <div className='d-flex align-items-center mb-2 th-width-60 ml-3'>
                                <div>
                                  <Checkbox
                                    onChange={onCheckSiblings}
                                    checked={hassiblings}
                                  />
                                </div>

                                <div className='ml-2'>
                                  If siblings, Please select the box.
                                </div>
                              </div>
                              {hassiblings ? (
                                <div className='form-area th-width-60'>
                                  {siblings.map((sibiling, index) => (
                                    <div
                                      key={index}
                                      className='d-flex flex-row th-width-100 ml-5 mt-1'
                                    >
                                      <div className='th-width-80'>
                                        <Input
                                          allowClear={true}
                                          placeholder='Sibling Name'
                                          size='large'
                                          style={{
                                            marginBottom: index === 0 ? '10px' : '',
                                          }}
                                          value={sibiling}
                                          onChange={(e) => handleSiblings(e, index)}
                                          required={true}
                                          pattern='^[A-Za-z ]*$'
                                          error={handlesiblingsError().includes(index)}
                                          title='Please enter only alphabets'
                                          onKeyPress={(e) => {
                                            const pattern = /^[A-Za-z ]+$/;
                                            const inputChar = String.fromCharCode(
                                              e.charCode
                                            );
                                            if (!pattern.test(inputChar)) {
                                              e.preventDefault();
                                            }
                                          }}
                                        />
                                      </div>
                                      {index > 0 && (
                                        <IconButton
                                          onClick={() => removeSibling(index)}
                                          className='th-width-10 ml-2'
                                        >
                                          <RemoveCircleOutline
                                            color='red'
                                            style={{ color: 'red' }}
                                          />
                                        </IconButton>
                                      )}
                                    </div>
                                  ))}
                                  <StyledButton
                                    onClick={addSiblings}
                                    startIcon={<Add />}
                                    variant='outlined'
                                    color='primary'
                                    className='addMoreButton'
                                    style={{
                                      color: 'white',
                                      marginTop: '10px',
                                      backgroundColor:
                                        siblings?.length >= 5 ? 'gray' : '#2154CB',
                                    }}
                                    disabled={siblings?.length >= 5}
                                  >
                                    Add More
                                  </StyledButton>
                                </div>
                              ) : (
                                ''
                              )}
                              <div style={{ width: '60%' }}>
                                <Col md={12}>
                                  <Form.Item
                                    rules={[
                                      {
                                        required: true,
                                        message: 'Please enter a valid Parents name',
                                      },
                                    ]}
                                    name={'Parents Name'}
                                    label='Parents Name'
                                  >
                                    <Input
                                      allowClear={true}
                                      placeholder='Parents Name'
                                      style={{ width: '200%' }}
                                      size='large'
                                      onChange={(e) => handleParentName(e)}
                                      required={true}
                                      pattern='^[A-Za-z ]*$'
                                      title='Please enter only alphabets'
                                      onKeyPress={(e) => {
                                        const pattern = /^[A-Za-z ]+$/;
                                        const inputChar = String.fromCharCode(e.charCode);
                                        if (!pattern.test(inputChar)) {
                                          e.preventDefault();
                                        }
                                      }}
                                    />
                                  </Form.Item>
                                </Col>
                              </div>
                              <div style={{ width: '60%' }}>
                                <Col md={12}>
                                  <Form.Item
                                    rules={[
                                      {
                                        required: true,
                                        message: 'Please enter a valid Phone Number',
                                        pattern: /^[0-9]{10}$/,
                                        message:
                                          'Please enter a valid 10-digit Phone Number',
                                      },
                                    ]}
                                    name={'Phone Number'}
                                    label='Phone Number'
                                  >
                                    <Input
                                      allowClear={true}
                                      placeholder='Phone Number'
                                      style={{ width: '200%' }}
                                      size='large'
                                      onChange={(e) => handlePhone(e)}
                                      required={true}
                                      title='Please enter a valid 10-digit Phone Number'
                                      type='tel'
                                      maxLength={10}
                                      onKeyPress={(e) => {
                                        const pattern = /^[0-9]$/;
                                        const inputChar = String.fromCharCode(e.charCode);
                                        if (!pattern.test(inputChar)) {
                                          e.preventDefault();
                                        }
                                      }}
                                    />
                                  </Form.Item>
                                </Col>
                              </div>
                              <div style={{ width: '60%' }}>
                                <Col md={12}>
                                  <Form.Item
                                    rules={[
                                      {
                                        required: true,
                                        pattern: regexEmail,
                                        message: 'Please enter a valid E-mail ID',
                                      },
                                    ]}
                                    name={'E-mail'}
                                    label='E-mail'
                                  >
                                    <Input
                                      allowClear={true}
                                      placeholder='E-mail'
                                      style={{ width: '200%' }}
                                      size='large'
                                      onChange={(e) => handleMail(e)}
                                      required={true}
                                    />
                                  </Form.Item>
                                </Col>
                                <div
                                  style={{
                                    color: 'red',
                                    marginBottom: '8px',
                                    marginLeft: '2px',
                                  }}
                                >
                                  {mailError}
                                </div>
                              </div>
                              <div className='d-flex align-items-center justify-content-center mb-2 th-width-60 ml-3'>
                                <div className='mb-3'>
                                  <Checkbox
                                    onChange={onchangeCheckbox}
                                    checked={isChecked}
                                  />
                                </div>

                                <div className='ml-2'>
                                  I have read and agree to the{' '}
                                  <u
                                    className='th-primary th-pointer '
                                    onClick={showModal}
                                  >
                                    Terms & Conditions
                                  </u>{' '}
                                  of Referral Program.
                                </div>
                                <Modal
                                  title='Referral Policy Terms & Conditions:'
                                  visible={isModalOpen}
                                  onOk={handleOk}
                                  onCancel={handleCancel}
                                  footer={[
                                    <StyledButton
                                      key='ok'
                                      type='primary'
                                      onClick={handleOk}
                                    >
                                      OK
                                    </StyledButton>,
                                  ]}
                                  width={'50%'}
                                >
                                  <div className='pl-4 pt-2 pb-0 pr-4 text-justify'>
                                    <p>
                                      <b>Referral Concession Eligibility: </b>
                                      The referral concession pertains exclusively to the
                                      tuition fee of the referred student, which amounts
                                      to 4% of the tuition fee paid by the referred
                                      student for the first year of referral. <br />
                                      <br />
                                      <b>Calculation of Discounts:</b> In a scenario where
                                      X refers both students A and B, X's discount will be
                                      calculated as the sum of two components: 4% of the
                                      tuition fee paid by student A in the first year and
                                      4% of the tuition fee paid by student B in the first
                                      year.
                                      <br />
                                      <br />
                                      <b>Duration of Referral Amount Validity:</b> The
                                      referral amount is applicable for a span of two
                                      academic sessions, including the referral year.{' '}
                                      <br />
                                      <br />
                                      <b>Referral Priority:</b> The discount will be
                                      applied to the parent who submits the initial
                                      referral. In the event that the referred student is
                                      already a part of the system, or if the student
                                      already exists in our system, further referrals for
                                      the same student will not be accepted. <br />
                                      <br />
                                      <b>Exemption for Siblings: </b>
                                      Siblings are exempt from participation in this
                                      referral program and cannot be referred. <br />
                                      <br />
                                      <b>Exclusions from Applicability:</b> The referral
                                      discount does not apply to Admission fees,
                                      Transportation fees, Building and utilities fees, or
                                      Non-academic fees
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
                  ) : refferList?.length > 0 ? (
                    <Table
                      // dataSource={flattenedRefferList}
                      dataSource={refferList}
                      columns={columns}
                      className='custom-table'
                      pagination={false}
                      bordered
                      // rowClassName={getRowClassName}
                      rowClassName={(record, index) =>
                        index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                      }
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
                  <br />

                  {!loading && refferList?.length > 0 && (
                    <div className='text-center mt-6'>
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
                      Note: Referral concession will be applied once your referral
                      successfully pays their tuition fees
                    </div>
                  )}
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentRefer;
