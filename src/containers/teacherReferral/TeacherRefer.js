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
// import axios from 'v2/config/axios';
import endpoints from 'config/endpoints';
// import endpoints from 'v2/config/endpoints';
import FileSaver from 'file-saver';
import IMGPIC2 from 'assets/images/img1.png';
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
  Form,
  Select,
  Upload,
  message,
  Button as ButtonAntd,
  Breadcrumb,
  Input,
  Col,
  Space,
  DatePicker,
  Tooltip,
} from 'antd';
import {
  DownOutlined,
  FileExcelTwoTone,
  InfoCircleOutlined,
  InfoCircleTwoTone,
  ReloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import './referTeacher.scss';
import axios from 'axios';
import { designations } from 'containers/Finance/src/_reducers/designation.reducer';
import countryList from 'containers/user-management/list';
import { AccessKey } from '../../v2/cvboxAccesskey';

const useStyles = makeStyles((theme) => ({
  root: theme.commonTableRoot,
  paperStyled: {
    minHeight: '60vh',
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
    backgroundColor: '#208B22',
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
  accept: '#0BB358',
  pending: '#FF3333',
  shortlisted: '#D4D429',
  inactive: '#0303FF',
  not_shortlisted: 'black',
};

const TeacherRefer = () => {
  const classes = useStyles({});
  const fileRef = useRef();
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const { TabPane } = Tabs;
  const { Option } = Select;

  const [moduleId, setModuleId] = useState('');
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [branchList, setBranchList] = useState([]);
  const history = useHistory();

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};

  const [username, setUsername] = useState('');
  const [city, setCity] = useState(null);
  const [phone, setPhone] = useState('');
  const [mail, setMail] = useState('');
  const [refferList, setRefferList] = useState([]);
  const [usernameError, setUsernameError] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [cityError, setCityError] = useState(false);
  const [checkBoxError, setCheckBoxError] = useState('');
  const [Designation, setDesignation] = useState(null);
  const [Position, setPosition] = useState(null);
  const [Role, setRole] = useState([]);
  const [count, setCount] = useState(0);
  const [cityList, setCityList] = useState([]);
  const [mailError, setMailError] = useState('');
  const [valid, setValid] = useState(true);
  const [activeKey, setActiveKey] = useState('1');
  const [isChecked, setChecked] = useState(false);
  const [refferListPageData, setRefferListPageData] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: null,
    totalPage: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const [fileTypeError, setFileTypeError] = useState(null);
  const [dateOfBirth, SetdateOfBirth] = useState('');

  const [subject, setSubject] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [experience, Setexperience] = useState(null);
  const [board, setBoard] = useState(null);
  const [subjectTaught, SetsubjectTaught] = useState(null);
  const [branch, Setbranch] = useState(null);

  const [positionapplyId, setPositionApplyId] = useState('');

  const [countryCode, setCountryCode] = useState('');

  const formRef = useRef();

  const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const nameRegex = /^[a-zA-Z ]+$/;

  const columns = [
    {
      title: 'Sl.no',
      dataIndex: 'applicant', // Use 'sno' as the dataIndex for the row number
      key: 'applicant',
      render: (text, record, index) => index + 1, // Render the row number
      render: (text, record, index) =>
        (refferListPageData.currentPage - 1) * refferListPageData.pageSize + index + 1,
    },
    {
      title: 'Candidates Name',
      dataIndex: 'candidate_name',
      key: 'candidate_name',
    },
    {
      title: 'Mobile No',
      dataIndex: 'candidate_phone_number',
      key: 'candidate_phone_number',
    },
    {
      title: 'Email ID',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role Applied',
      dataIndex: 'role',
      key: 'role',
    },
    // {
    // title: 'Experience',
    // dataIndex: 'teaching_experience',
    // key: 'teaching_experience',
    // render: (text, record) => {
    // console.log(text, record);
    // return <span>{text} Years</span>;
    // },
    // },
    // {
    // title: 'Board',
    // dataIndex: 'experience_in_school',
    // key: 'experience_in_school',
    // },

    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'City',
      dataIndex: 'city_name',
      key: 'city_name',
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
    },
    {
      title: 'Referral code',
      dataIndex: 'referral_code',
      key: 'referral_code',
    },

    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        const isMapped = record.is_mapped;
        const currentProgress = record.current_progress;

        let content;
        let color;

        if (isMapped && currentProgress === null) {
          content = 'Shortlisted';
          color = 'orange';
        } else if (isMapped && currentProgress !== null) {
          // Show the value of current_progress when is_mapped is true
          content = currentProgress;
          color = 'orange';
        } else {
          // Default case when is_mapped is false
          content = 'Pending';
          color = 'red';
        }

        if (currentProgress === 'Joined') {
          content = 'Joined';
          color = 'green';
        }

        return <span style={{ color }}>{content}</span>;
      },
    },
  ];
  const subjectsOfInterest = [
    'Horticulture Course',
    'Library',
    'Biology',
    'Art and Craft',
    'Bengali 2nd Lang',
    'Bengali 3rd Lang',
    'Tamil 3rd Lang',
    'Tamil 2nd Lang',
    'Tamil',
    'Sanskrit',
    'Telugu 3rd Lang',
    'Telugu 2nd Lang',
    'Bengali',
    'Telugu',
    'Environmental Studies',
    'Reading',
    'Storytelling',
    'Rhymes',
    'Social Sciences',
    'EVS',
    'Marathi',
    'French',
    'Public Speaking',
    'Geography',
    'Physics',
    'Art Education',
    'Visual Arts',
    'Theatre',
    'Dance',
    'Music',
    'Robotics',
    'Computer Science',
    'Physical Education',
    'Numeracy',
    'Literacy',
    'Maths',
    'Kannada',
    'Trilingual Marathi',
    'Trilingual Hindi',
    'Kannada 3rd Lang',
    'Kannada 2nd Lang',
    'Marathi 3rd Lang',
    'Hindi 3rd Lang',
    'Hindi 2nd Lang',
    'French 4th Lang',
    'French 3rd Lang',
    'French 2nd lang',
    'SST',
    'IDP',
    'Natural Science',
    'English',
    'Hindi',
  ];
  const Board = [
    { id: 1, name: 'CBSE' },
    { id: 2, name: 'ICSE' },
    { id: 3, name: 'State' },
    { id: 4, name: 'IGCSE' },
    { id: 5, name: 'IB' },
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

  const handleUserName = (e) => {
    validateUserName(e?.target?.value);
    setUsername(e?.target?.value);
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

  const validateUserName = (value) => {
    if (!nameRegex.test(value) && value !== '') {
      setUsernameError('Invalid User Name ie. Only Alphabets');
      setValid(false);
      return false;
    } else {
      setUsernameError('');
      setValid(true);
      return true;
    }
  };

  const handleCity = (e) => {
    if (e) {
      const [selectedCityId, selectedCityValue] = e.split(',');
      // You can use selectedId as needed
      getBranches(selectedCityId);
      setCity(selectedCityId);
    } else {
      formRef.current.setFieldsValue({
        City: null,
        Branch: null,
      });
      Setbranch(null);
      setBranchList([]);
    }
  };

  const handlePhone = (e) => {
    phonevalidate(e?.target?.value);
    setPhone(e?.target?.value);
  };

  const handleMail = (e) => {
    setMail(e?.target?.value);
    emailValidate(e?.target?.value);
  };

  const handleCountryCode = (e) => {
    setCountryCode(e);
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
    const numberRegex = /^[5-9]\d{9}$/;

    if (value === '') {
      setValid(false);
      setPhoneError('Please enter a phone number');
      return false;
    } else if (value.length > 10 || value.length < 10) {
      setValid(false);
      setPhoneError('Please enter a valid 10-digit phone number');
      return false;
    } else if (!numberRegex.test(value)) {
      setValid(false);
      setPhoneError('Phone number should start from 5-9');
      return false;
    } else {
      setPhoneError('');
      setValid(true);
      return true;
    }
  };

  const handleRedirect = (res) => {
    console.log(res, 'referred_data');
    // console.log(res, 'status');
    setAlert('success', res?.data.message);
    history.push({
      pathname: '/teacher-refer-success',
      state: {
        data: res?.data,
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

  const handleUserRole = (e) => {
    setUserRole(e);
  };

  const handleExperience = (e) => {
    Setexperience(e.target.value);
  };

  const handleBoard = (e) => {
    setBoard(e.toLowerCase());
  };

  const handleSubjectTaught = (e) => {
    if (e) {
      const [selectedSubjectId, selectedSubjectTaught] = e.split(',');
      SetsubjectTaught(selectedSubjectId);
    }
  };

  const handleBranch = (e) => {
    if (e) {
      const [selectedBranchId, SelectedBranchName] = e.split(',');
      Setbranch(selectedBranchId);
    }
  };

  const getSubjects = () => {
    // console.log(userDetails.token)
    axios
      .get(`${endpoints.teacherReferral.subject_list}`, {
        headers: {
          authorization: `Bearer ${userDetails.token}`,
        },
      })
      .then((res) => {
        const filteredSubjects = res?.data?.result.filter((obj) =>
          subjectsOfInterest.includes(obj.subject_name)
        );

        setSubject(filteredSubjects);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getRoleApi = () => {
    // console.log("fetching..............")
    axios
      .get(endpoints.userManagement.userLevelList, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        const filteredRoles = result?.data?.result.filter((role) => {
          return ['Teacher', 'Academic Coordinators', 'Principal'].includes(
            role?.level_name
          );
        });

        setRole(filteredRoles);
      })
      .catch((error) => {
        message.error(error.message);
        console.log(error, 'error');
      });
  };

  const getBranches = (cityId) => {
    axios
      .get(`${endpoints.teacherReferral.branch_list}?city_id=${cityId}`, {
        headers: {
          'Access-Api-Key': `${AccessKey}`,
        },
      })
      .then((result) => {
        if (result?.status) {
          // console.log(result.data);
          setBranchList(result?.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCity = () => {
    axios
      .get(`${endpoints.teacherReferral.city_list}`, {
        headers: {
          'Access-Api-Key': `${AccessKey}`,
        },
      })
      .then((result) => {
        if (result.status) {
          // console.log(result.data);
          setCityList(result?.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getRoleApi();
    getCity();
    getSubjects();
  }, []);

  useEffect(() => {
    getData(refferListPageData.currentPage);
  }, [refferListPageData.currentPage, count]);

  const handleSubmit = () => {
    // setLoading(true);
    if (cityError) {
      message.error(cityError);
      setLoading(false);
      return;
    } else if (usernameError) {
      message.error(usernameError);
      setLoading(false);
      return;
    } else if (phoneError) {
      message.error(phoneError);
      setLoading(false);
      return;
    } else if (mailError) {
      message.error(mailError);
      setLoading(false);
      return;
    } else if (dateOfBirth === '') {
      message.error('Please select the Date of Birth');
      setLoading(false);
      return;
    } else if (userRole === null) {
      message.error('Please select the User Role');
      setLoading(false);
      return;
    } else if (experience === '') {
      message.error('Please Enter the Year of Experience');
      setLoading(false);
      return;
    } else if (board === null) {
      message.error('Please Select Board');
      setLoading(false);
      return;
    } else if (subjectTaught === null) {
      message.error('Please select the Subject');
      setLoading(false);
      return;
    } else if (city === '') {
      message.error('Please select the City');
      setLoading(false);
      return;
    } else if (branch === null) {
      message.error('Please select the Branch');
      setLoading(false);
      return;
    } else if (selectedFile === '') {
      message.error('Please select a file to upload');
      setLoading(false);
      return;
    } else if (!isChecked) {
      setCheckBoxError('Please agree to the terms and conditions before proceeding');
      setAlert('error', 'Please agree to the terms and conditions before proceeding');
      setLoading(false);
      return;
    } else {
      const contact_no = `${countryCode}${phone}`;
      const formData = new FormData();
      // formData.append('position_apply', positionapplyId);
      formData.append('candidate_name', username);
      formData.append('email', mail);
      formData.append('candidate_phone_number', contact_no);
      formData.append('candidate_dob', dateOfBirth);
      formData.append('teaching_experience', experience);
      formData.append('experience_in_school', board);
      formData.append('branch_name', branch);
      // formData.append('designation', '');
      formData.append('subject', subjectTaught);
      formData.append('referring_city_branch', city);
      // formData.append('recruiter', '');
      // formData.append('position_apply', '');
      formData.append('erp_id', userDetails?.erp);
      formData.append('resume', selectedFile);
      formData.append(
        'employee_name',
        `${userDetails?.first_name} ${userDetails?.last_name}`
      );
      formData.append('role', userRole);

      const objectFromFormData = {};
      formData.forEach((value, key) => {
        objectFromFormData[key] = value;
      });

      console.log(objectFromFormData);

      if (username && mail && phone && city && dateOfBirth) {
        setLoading(true);
        axios
          .post(`${endpoints.teacherReferral.candidate_refferal}`, formData, {
            headers: {
              'Access-Api-Key': `${AccessKey}`,
            },
          })
          .then((results) => {
            setAlert('success', results?.message);
            console.log(results, 'results');
            handleRedirect(results);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
            message.error(error?.message || 'Network Error!');
          });
      } else {
        setLoading(false);
        setAlert('error', 'All Fields are Mandatory');
      }
    }
  };

  const getData = async (pageNo) => {
    setLoading(true);
    const refererCode = userDetails?.erp;
    try {
      const result = await axios.get(
        `${endpoints.teacherReferral.referred_applicants}?erp_id=${refererCode}`,
        {
          params: {
            page: pageNo !== undefined ? pageNo : refferListPageData.currentPage,
            page_size: refferListPageData.pageSize,
          },
          headers: {
            'Access-Api-Key': `${AccessKey}`,
          },
        }
      );
      if (result.status === 200) {
        // console.log(result.data);
        setRefferListPageData({
          ...refferListPageData,
          totalCount: result.data.count,
          totalPage: Math.ceil(result.data.count / refferListPageData.pageSize),
        });
        setRefferList(result?.data?.results);
        setLoading(false);
      } else {
        message.error(result?.data?.message);
      }
    } catch (error) {
      console.log(error, 'fetchRefferList Error');
      setLoading(false);
    }
  };

  const handledateofbirth = (e) => {
    const formattedDate = moment(e).format('YYYY-MM-DD');
    console.log(formattedDate);
    SetdateOfBirth(formattedDate);
  };

  const countryCodeOptions = countryList?.map((each) => (
    <Select.Option key={each?.country} value={each?.callingCode}>
      {/* {each?.country} ( */}
      {each?.callingCode}
    </Select.Option>
  ));

  const boardOptions = Board.map((each) => (
    <Select.Option key={each?.id} value={each?.name}>
      {each?.name}
    </Select.Option>
  ));

  const RoleOptions = Role.map((each) => (
    <Select.Option key={each?.id} value={each?.level_name}>
      {each?.level_name}
    </Select.Option>
  ));

  const BranchListOptions = branchList.map((each) => (
    <Select.Option key={each?.id} value={`${each?.id}, ${each?.branch_name}`}>
      {each?.branch_name}
    </Select.Option>
  ));

  const CityListOptions = cityList.map((each) => (
    <Select.Option key={each?.id} value={`${each?.id}, ${each?.city_name}`}>
      {each?.city_name}
    </Select.Option>
  ));

  const SubjectListOptions = subject.map((each) => (
    <Select.Option key={each?.id} value={`${each.id}, ${each?.subject_name}`}>
      {each?.subject_name}
    </Select.Option>
  ));

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

  const MAX_FILE_SIZE_MB = 10;
  const allowedFiles = ['.pdf', '.PDF', '.docx', '.doc'];
  const draggerProps = {
    showUploadList: false,
    disabled: false,
    accept: allowedFiles.join(),
    // '.xls,.xlsx',
    multiple: false,
    onRemove: () => {
      setSelectedFile(null);
    },
    onDrop: (e) => {
      const file = e.dataTransfer.files;
      setSelectedFile(null);
      const type = '.' + file[0]?.name.split('.')[file[0]?.name.split('.').length - 1];
      console.log(type, allowedFiles, 'inside file upload');
      if (allowedFiles.includes(type)) {
        setSelectedFile(...file);
        setFileTypeError(false);
      } else {
        message.error('Only [.pdf, .PDF, .docx, .doc] files are allowed!');
        setFileTypeError(true);
      }

      return false;
    },
    beforeUpload: (file) => {
      const type = '.' + file.name.split('.')[file.name.split('.').length - 1];
      const isAllowedType = allowedFiles.includes(type);
      const isSizeValid = file.size / 1024 / 1024 <= MAX_FILE_SIZE_MB;

      if (!isAllowedType) {
        message.error('Only [.pdf, .PDF, .docx, .doc] files are allowed!');
        setFileTypeError(true);
      } else if (!isSizeValid) {
        message.error(`File size must be less than ${MAX_FILE_SIZE_MB} MB!`);
        setFileTypeError(true);
      } else {
        setSelectedFile(file);
        setFileTypeError(false);
      }

      return false;
    },

    selectedFile,
  };

  return (
    <Layout className='teacher-refer-whole-container'>
      <div className='col-md-6 th-bg-grey' style={{ zIndex: 2 }}>
        <Breadcrumb separator='>'>
          <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
            Dashboard
          </Breadcrumb.Item>

          <Breadcrumb.Item className='th-black-1 th-16'>
            Teacher's Referral Programme
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className='row'>
        <div className='col-12'>
          <div className='th-tabs th-bg-white'>
            <Tabs type='card' onChange={handleTabChange} defaultActiveKey={activeKey}>
              <TabPane tab='Refer Now' key='1'>
                <Paper>
                  <div className='student-refer-container'>
                    {loading ? (
                      <Loader />
                    ) : (
                      <div className='image-class'>
                        <div className='leftimage' style={{ marginTop: '40px' }}>
                          <div style={{ textAlign: 'center', height: '65px' }}>
                            <p style={{ fontSize: '35px', fontWeight: '600' }}>
                              Refer Now
                            </p>
                          </div>
                          <div className='main-img'>
                            <img src={IMGPIC2} className='image-left' />
                          </div>
                        </div>
                        <div className='form-div' style={{ marginTop: '50px' }}>
                          <div className='header-refer-container'>
                            {/* <p className='referHeader'></p> */}
                            <p className='small-header'>
                              Take advantage of the Teachers Referral Programme
                            </p>
                          </div>
                          <div className='scrollable-container'>
                            <div className='form-area'>
                              <div style={{ width: '60%' }}>
                                <Col md={12}>
                                  <Form.Item
                                    rules={[
                                      {
                                        required: true,
                                        message: 'Candidates Name',
                                      },
                                    ]}
                                    name={'Candidates Name'}
                                    label='Candidates Name'
                                  >
                                    <Input
                                      allowClear={true}
                                      placeholder='Candidates name'
                                      style={{ width: '200%' }}
                                      size='large'
                                      onChange={(e) => handleUserName(e)}
                                      required={true}
                                      pattern='[A-Za-z]+'
                                      title='Please enter only alphabets'
                                      onKeyPress={(e) => {
                                        const pattern = /^[A-Za-z\s]+$/; // Including \s to allow spaces
                                        const inputChar = String.fromCharCode(e.charCode);
                                        if (!pattern.test(inputChar)) {
                                          e.preventDefault();
                                        }
                                      }}
                                      autoComplete='off'
                                    />
                                  </Form.Item>
                                </Col>
                              </div>
                              <div style={{ width: '60%' }}>
                                <Form.Item
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Select Candidates Role',
                                    },
                                  ]}
                                  name={'Select Candidates Role'}
                                  label='Select Candidates Role'
                                  labelAlign='left'
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                  }}
                                >
                                  <Select
                                    allowClear
                                    placeholder='Select Candidates Role'
                                    showSearch
                                    size='large'
                                    optionFilterProp='children'
                                    filterOption={(input, options) => {
                                      return (
                                        options.children
                                          ?.toLowerCase()
                                          ?.indexOf(input.toLowerCase()) >= 0
                                      );
                                    }}
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    style={{ width: '100%' }}
                                    value={userRole}
                                    onChange={(e) => handleUserRole(e)}
                                  >
                                    {RoleOptions}
                                  </Select>
                                </Form.Item>
                              </div>

                              <div style={{ width: '60%' }}>
                                <Col md={12}>
                                  <Form.Item
                                    rules={[
                                      {
                                        required: true,
                                        message: 'Experience in Years',
                                      },
                                    ]}
                                    name={'Experience in Years'}
                                    label='Experience in Years'
                                  >
                                    <Input
                                      allowClear={true}
                                      placeholder='Experience in Years'
                                      style={{ width: '200%' }}
                                      size='large'
                                      required={true}
                                      pattern='[A-Za-z]+'
                                      title='Please enter only numbers'
                                      type='tel'
                                      maxLength={4}
                                      onKeyPress={(e) => {
                                        const pattern = /^[0-9./]$/;
                                        const inputChar = String.fromCharCode(e.charCode);
                                        if (!pattern.test(inputChar)) {
                                          e.preventDefault();
                                        }
                                      }}
                                      value={experience}
                                      onChange={(e) => handleExperience(e)}
                                      autoComplete='off'
                                    />
                                  </Form.Item>
                                </Col>
                              </div>

                              <div style={{ width: '60%' }}>
                                <Form.Item
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Select Board',
                                    },
                                  ]}
                                  name={'Select Board'}
                                  label='Select Board'
                                  labelAlign='left'
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                  }}
                                >
                                  <Select
                                    allowClear
                                    placeholder='Select Board'
                                    showSearch
                                    size='large'
                                    optionFilterProp='children'
                                    filterOption={(input, options) => {
                                      return (
                                        options.children
                                          ?.toLowerCase()
                                          ?.indexOf(input.toLowerCase()) >= 0
                                      );
                                    }}
                                    style={{ width: '100%' }}
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    value={board}
                                    onChange={(e) => handleBoard(e)}
                                  >
                                    {boardOptions}
                                  </Select>
                                </Form.Item>
                              </div>

                              <div style={{ width: '60%' }}>
                                <Form.Item
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Select Subject Taught',
                                    },
                                  ]}
                                  name={'Select Subject Taught'}
                                  label='Select Subject Taught'
                                  labelAlign='left'
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                  }}
                                >
                                  <Select
                                    allowClear
                                    placeholder='Select Subject Taught'
                                    showSearch
                                    size='large'
                                    optionFilterProp='children'
                                    filterOption={(input, options) => {
                                      return (
                                        options.children
                                          ?.toLowerCase()
                                          ?.indexOf(input.toLowerCase()) >= 0
                                      );
                                    }}
                                    style={{ width: '100%' }}
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    value={subjectTaught}
                                    onChange={(e) => handleSubjectTaught(e)}
                                  >
                                    {SubjectListOptions}
                                  </Select>
                                </Form.Item>
                              </div>

                              <div style={{ width: '60%' }}>
                                <Col>
                                  <Space align='start'>
                                    <Form.Item name={'contact_code'} label='Code'>
                                      <Select
                                        showSearch
                                        filterOption={(input, options) => {
                                          return (
                                            options.children
                                              .toLowerCase()
                                              .indexOf(input.toLowerCase()) >= 0
                                          );
                                        }}
                                        size='large'
                                        defaultValue={'+91'}
                                        onChange={handleCountryCode}
                                      >
                                        {countryCodeOptions}
                                      </Select>
                                    </Form.Item>
                                    <Form.Item
                                      rules={[
                                        {
                                          required: true,
                                          message: 'Candidates Contact Number',
                                        },
                                      ]}
                                      name={'contact'}
                                      required
                                      label='Candidates Contact Number'
                                    >
                                      <Input
                                        allowClear={true}
                                        placeholder='Phone Number'
                                        style={{ width: '100%' }}
                                        size='large'
                                        onChange={(e) => handlePhone(e)}
                                        required={true}
                                        type='tel '
                                        maxLength={10}
                                        onKeyPress={(e) => {
                                          const pattern = /^[0-9]$/;
                                          const inputChar = String.fromCharCode(
                                            e.charCode
                                          );
                                          if (!pattern.test(inputChar)) {
                                            e.preventDefault();
                                          }
                                        }}
                                        autoComplete='off'
                                      />
                                    </Form.Item>
                                  </Space>
                                </Col>
                              </div>
                              <div style={{ width: '60%' }}>
                                <Col md={12}>
                                  <Form.Item
                                    rules={[
                                      {
                                        required: true,
                                        message: 'Email ID',
                                      },
                                    ]}
                                    name={'Email ID'}
                                    label='Email ID'
                                  >
                                    <Input
                                      allowClear={true}
                                      placeholder='Email ID'
                                      size='large'
                                      onChange={(e) => handleMail(e)}
                                      required={true}
                                      style={{ width: '200%' }}
                                      type='text'
                                      autoComplete='off'
                                    />
                                  </Form.Item>
                                </Col>
                              </div>

                              <div style={{ width: '59%' }}>
                                <p style={{ color: 'red', textAlign: 'left' }}>
                                  {mailError}
                                </p>
                              </div>
                              <div
                                style={{
                                  width: '60%',
                                }}
                              >
                                <Col md={12}>
                                  <Form.Item
                                    rules={[
                                      {
                                        required: true,
                                        message: 'Select Date Of Birth',
                                      },
                                    ]}
                                    name={'Select Date Of Birth'}
                                    label='Select Date Of Birth'
                                  >
                                    <DatePicker
                                      allowClear={true}
                                      placement='bottomRight'
                                      placeholder='Date Of Birth'
                                      size='large'
                                      style={{ width: '200%', textAlign: 'left' }}
                                      onChange={handledateofbirth}
                                      className='th-black-2 pl-0 th-date-picker'
                                      format={'DD-MM-YYYY'}
                                    />
                                  </Form.Item>
                                </Col>
                              </div>
                              <Form style={{ width: '60%' }} ref={formRef}>
                                <Form.Item
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Select City',
                                    },
                                  ]}
                                  name='City'
                                  label='Select City'
                                  labelAlign='left'
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                  }}
                                >
                                  <Select
                                    allowClear
                                    placeholder='Select City'
                                    showSearch
                                    size='large'
                                    optionFilterProp='children'
                                    filterOption={(input, options) => {
                                      return (
                                        options.children
                                          ?.toLowerCase()
                                          ?.indexOf(input.toLowerCase()) >= 0
                                      );
                                    }}
                                    style={{ width: '100%' }}
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    value={city}
                                    defaultValue={city}
                                    onChange={(e) => handleCity(e)}
                                  >
                                    {CityListOptions}
                                  </Select>
                                </Form.Item>
                                <Form.Item
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Select Branch',
                                    },
                                  ]}
                                  name='Branch'
                                  label='Select Branch'
                                  labelAlign='left'
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                  }}
                                >
                                  <Select
                                    allowClear
                                    placeholder='Select Branch'
                                    showSearch
                                    size='large'
                                    optionFilterProp='children'
                                    filterOption={(input, options) => {
                                      return (
                                        options.children
                                          ?.toLowerCase()
                                          ?.indexOf(input.toLowerCase()) >= 0
                                      );
                                    }}
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    value={branch}
                                    onChange={(e) => handleBranch(e)}
                                    defaultValue={branch}
                                  >
                                    {BranchListOptions}
                                  </Select>
                                </Form.Item>
                              </Form>
                              <br />
                              <div style={{ width: '60%' }}>
                                <div>
                                  <span className='th-grey th-14 '>
                                    Upload the resume ( size must be less than 10 MB )*
                                  </span>
                                </div>

                                <Upload {...draggerProps}>
                                  <ButtonAntd
                                    icon={<UploadOutlined />}
                                    style={{ width: '370%' }}
                                  >
                                    Select File
                                  </ButtonAntd>
                                </Upload>
                                <div
                                  style={{
                                    marginTop: '2px',
                                    maxWidth: '400px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                >
                                  {selectedFile ? (
                                    <span style={{ color: 'blue' }}>
                                      <FileExcelTwoTone />
                                      {selectedFile?.name}
                                    </span>
                                  ) : (
                                    ''
                                  )}
                                </div>
                              </div>
                              <div style={{ width: '58%', marginTop: '10px' }}>
                                <small style={{ textAlign: 'left' }}>
                                  <b>Note :</b> Only ['.pdf', '.PDF', '.docx', '.doc']
                                  files are allowed
                                  {/* <br/> */}
                                  {/* <b style={{color:"red"}}>Note :</b> <span style={{color:"red"}}>File </span> */}
                                </small>
                              </div>
                              <br />

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
                                    <Button key='ok' type='primary' onClick={handleOk}>
                                      OK
                                    </Button>,
                                  ]}
                                  width={'50%'}
                                >
                                  <div className='pl-4 pt-2 pb-0 pr-4 text-justify'>
                                    <p>
                                      <b>Incentives for Teachers: </b>
                                      Teachers will be eligible for incentives based on
                                      their tenure: a) 2 to 4 years - ₹3,000 b) 5 years -
                                      ₹75,000 c) 7 years - ₹7,000 d) 10 years and beyond -
                                      ₹10,000 <br />
                                      <br />
                                      <b>Referral Incentive:</b> Upon a teacher joining
                                      and successfully completing 30 days, the referring
                                      staff member will receive an incentive for the
                                      referred candidate.
                                      <br />
                                      <br />
                                      <b>Notification for Referral Status:</b> The staff
                                      member referring a candidate will receive an email
                                      notification upon the candidate's selection or
                                      rejection in the hiring process.
                                      <br />
                                    </p>
                                  </div>
                                </Modal>
                              </div>
                              <div style={{ color: 'red', marginBottom: '2px' }}>
                                {checkBoxError}
                              </div>
                              <div className='submit-btn-wrapper'>
                                <ButtonAntd
                                  type='primary'
                                  shape='round'
                                  size='large'
                                  disabled={!isChecked}
                                  onClick={handleSubmit}
                                >
                                  Submit
                                </ButtonAntd>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Paper>
              </TabPane>
              <TabPane
                tab={
                  <div>
                    <span>My Referrals</span>{' '}
                    <span
                      style={{ marginLeft: '10px' }}
                      onClick={() => setCount((prev) => prev + 1)}
                    >
                      <ReloadOutlined />
                    </span>
                  </div>
                }
                key='2'
              >
                <div style={{ padding: '10px' }} id='display_table'>
                  {loading ? (
                    <Loader />
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
                      Note: Referral concession will be applied once your referral
                      successfully pays their tuition fees
                    </div>
                  )}
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherRefer;
