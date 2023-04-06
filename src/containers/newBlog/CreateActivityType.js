import React, { useState, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axios from 'axios';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import Layout from 'containers/Layout';
import { useTheme } from '@material-ui/core/styles';
import './styles.scss';
import endpoints from '../../config/endpoints';
import { Input, Button, Breadcrumb, Table, Tag, message } from 'antd';
import { CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';

const CreateActivityType = () => {
  // const classes = useStyles();
  const themeContext = useTheme();
  const history = useHistory();
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const [moduleId, setModuleId] = React.useState();
  const [month, setMonth] = React.useState('1');
  const [status, setStatus] = React.useState('');
  const [mobileViewFlag, setMobileViewFlag] = useState(window.innerWidth < 700);

  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedBranchIds, setSelectedBranchIds] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [selectedGradeIds, setSelectedGradeIds] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState('');
  const [drawer, setDrawer] = useState(false);
  const [drawers, setDrawers] = useState(false);
  const [value, setValue] = useState(0);
  const [maxWidth, setMaxWidth] = React.useState('lg');
  const [accordianBulkFilter, setAccordianBulkFilter] = useState(false);
  const [creativityType, setCreativityType] = useState('');
  const [scoreType, setScoreType] = useState('');
  const [inputList, setInputList] = useState([
    {
      score: null,
      rating: null,
    },
  ]);

  const [isDisabled, setIsDisabled] = useState(false);

  const columns = [
    {
      title: <span className='th-white th-fw-700'>SL No.</span>,
      // dataIndex: 'lp_count',
      align: 'center',
      // width: '15%',
      render: (text, row, index) => <span className='th-black-1'>{index + 1}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Activity Type Name </span>,
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700'>Sub Activity Name</span>,
      dataIndex: 'sub_type',
      align: 'center',
      render: (text, row) => (
        <span className='th-black-1'>{row?.sub_type ? row.sub_type : <b>NA</b>}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Actions</span>,
      dataIndex: '',
      align: 'center',
      width: '25%',
      render: (text, row) => (
        <div className='th-black-1 d-flex justify-content-around'>
          <Tag
            icon={<DeleteOutlined className='th-14' />}
            color='red'
            className='th-br-5 th-pointer py-1'
            // onClick={() => viewedAssign(row)}
            onClick={() => handleDeleteActivity(row)}
          >
            <span className='th-fw-500 th-14'>Delete</span>
          </Tag>
          {/* <Tag
            icon={<IdcardOutlined className='th-14' />}
            color='success'
            className='th-br-5 th-pointer py-1'
            onClick={() => handlePreview(row)}
          >
            <span className='th-fw-500 th-14'>Edit</span>
          </Tag> */}
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (inputList.length > 0) {
      inputList[inputList.length - 1].input === ''
        ? setIsDisabled(true)
        : setIsDisabled(false);
    }
  }, []);
  const handleListAdd = () => {
    setInputList([
      ...inputList,
      {
        score: '',
        rating: '',
      },
    ]);
  };

  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const months = [
    {
      label: 'January',
      value: '1',
    },
    {
      label: 'Febraury',
      value: '2',
    },
    {
      label: 'March',
      value: '3',
    },
    {
      label: 'April',
      value: '4',
    },
    {
      label: 'May',
      value: '5',
    },
    {
      label: 'June',
      value: '6',
    },
    {
      label: 'July',
      value: '7',
    },
    {
      label: 'August',
      value: '8',
    },
    {
      label: 'September',
      value: '9',
    },
    {
      label: 'October',
      value: '10',
    },
    {
      label: 'November',
      value: '11',
    },
    {
      label: 'December',
      value: '12',
    },
  ];

  const [view, setViewed] = useState(false);
  const [branchView, setBranchView] = useState(true);
  const [branchSearch, setBranchSearch] = useState(true);

  const viewed = () => {
    setViewed(true);
  };
  const handleClose = () => {
    setViewed(false);
  };

  const branchViewed = () => {
    setBranchView(false);
    setBranchSearch(true);
  };

  const shortList = () => {
    history.push('/blog/short');
  };
  const [data, setData] = useState('');
  const handleDate = (data) => {
    console.log(data, 'data');
    setBranchView(true);
    setBranchSearch(false);
    setData(data);
  };
  const [assigned, setAssigned] = useState(false);

  const assignIcon = () => {
    setAssigned(true);
  };

  const [assingeds, setAssigneds] = useState([]);
  const getAssinged = () => {
    setLoading(true);
    axios
      .get(`${endpoints.newBlog.unAssign}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        console.log(response);
        setAssigneds(response.data.result);
        setLoading(false);
      });
  };

  useEffect(() => {
    getAssinged();
  }, []);
  const [ActivityType, setActivityType] = useState('');
  const [SubActivityType, setSubActivityType] = useState('');

  const submitActivity = () => {
    setLoading(true);
    if (!ActivityType) {
      setLoading(false);
      message.error('Please Enter Activity Type');
      return;
    } else {
      let body = {
        activity_type: ActivityType,
        sub_type: SubActivityType,
      };
      axios
        .post(`${endpoints.newBlog.activityTypeSubmit}`, body, {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        })
        .then((response) => {
          if (response?.data?.status_code === 400) {
            message.error(response?.data?.message);
            setLoading(false);
            return;
          } else {
            setActivityType('');
            setAccordianBulkFilter(false);
            getActivityCategory();
            message.success('Activity Created Successfully');
            setLoading(false);
          }
        });
    }
  };

  const [activityCategory, setActivityCategory] = useState([]);
  const getActivityCategory = () => {
    setLoading(true);
    axios
      .get(`${endpoints.newBlog.getActivityType}?is_type=${true}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        setActivityCategory(response.data.result);
        setLoading(false);
      });
  };
  useEffect(() => {
    getActivityCategory();
  }, []);

  const activityScore = (e) => {
    const re = /^[0-5\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      setScoreType(e.target.value);
    }
  };

  const handleInputChange = (event, index) => {
    const { value } = event.target;
    const newInputList = [...inputList];
    // newInputList[index].creativity = value;
    newInputList[index].score = value;
    newInputList[index].rating = value;

    setInputList(newInputList);
  };

  const handleDeleteActivity =(data) =>{

    if(data){
      setLoading(true)
      axios
      .delete(`${endpoints.newBlog.activityDelete}${data?.id}/`,{
        headers:{
          'X-DTS-HOST' : X_DTS_HOST,
        },
      })
      .then((response) => {
        message.success(response?.data?.message)
        getActivityCategory()
        setLoading(false)
        return
      })
      .catch((err) =>{
        message.error(err)
        setLoading(false)
        return
      })
    }

  }

  return (
    <div>
      <Layout>
        <div className='px-3'>
          <div className='row'>
            <div className='col-md-6 pl-2'>
              <Breadcrumb separator='>'>
                <Breadcrumb.Item> Activity</Breadcrumb.Item>
                <Breadcrumb.Item> Create Activity</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
        </div>
        <div className='col-12 mt-3 th-br-5 py-3 th-bg-white'>
          <div className='row align-items-center'>
            <div className='col-md-4 col-6 p-2'>
              <div className='mb-2 text-left'>Activity Type</div>
              <Input
                placeholder='Enter Activity Type'
                type='text'
                onChange={(e) => setActivityType(e.target.value)}
              />
            </div>
            <div className='col-md-4 col-6 p-2'>
              <div className='mb-2 text-left'>Sub Activity Type</div>
              <Input
                placeholder='Enter Sub Activity Type.'
                type='text'
                onChange={(e) => setSubActivityType(e.target.value)}
              />
            </div>
            <div className='col-md-4 col-6 pt-4'>
              <Button
                icon={<CheckCircleOutlined />}
                onClick={submitActivity}
                type='primary'
              >
                Submit
              </Button>
            </div>
          </div>
          <div className='col-12 px-0'>
            <Table
              columns={columns}
              dataSource={activityCategory}
              className='th-table'
              rowClassName={(record, index) =>
                `${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
              }
              loading={loading}
              pagination={false}
              scroll={{ x: assingeds.length > 0 ? 'max-content' : null, y: 600 }}
            />
          </div>
        </div>
      </Layout>
    </div>
  );
};
export default CreateActivityType;
