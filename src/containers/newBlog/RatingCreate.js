import React, { useState, useEffect, useContext, useRef} from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import {
  Button,
  Input,
  Select,
  Divider as AntDivider,
  Breadcrumb,
  Spin,
  Form,
  Table,
  Modal as ModalAnt,
  Tag,
  message,
} from 'antd';
import {
  DeleteFilled,
  PlusOutlined,
  SnippetsOutlined,
  AuditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditFilled,
} from '@ant-design/icons';

import axios from 'axios';

import { makeStyles } from '@material-ui/core';

import Layout from 'containers/Layout';

import { useTheme } from '@material-ui/core/styles';

import './styles.scss';

import endpoints from '../../config/endpoints';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '90vw',
    width: '95%',
    margin: '20px auto',
    marginTop: theme.spacing(4),
    boxShadow: 'none',
  },
  searchTable: {
    fontSize: '12px',
    whiteSpace: 'nowrap',
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  dividerColor: {
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  container: {
    maxHeight: '70vh',
    maxWidth: '90vw',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },

  customTabRoot: {
    color: 'red',
    backgroundColor: 'green',
  },
  customTabIndicator: {
    backgroundColor: 'orange',
  },

  tableCell: {
    color: 'black !important',
    backgroundColor: '#ADD8E6 !important',
  },
  tableCells: {
    color: 'black !important',
    backgroundColor: '#F0FFFF !important',
  },
  vl: {
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    height: '45px',
  },
  buttonColor: {
    color: `${theme.palette.primary.main} !important`,
    // backgroundColor: 'white',
  },
  tabStyle: {
    color: 'white !important',
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  tabStatic: {
    position: 'static',
    paddingLeft: '19px',
    paddingRight: '39px',
    paddingTop: '36px',
  },
  buttonColor1: {
    color: 'grey !important',
    backgroundColor: 'white',
  },
  buttonColor2: {
    color: `${theme.palette.primary.main} !important`,
    backgroundColor: 'white',
  },
  selected1: {
    background: `${theme.palette.primary.main} !important`,
    color: 'white !important',
  },
  selected2: {
    background: `${theme.palette.primary.main} !important`,
    color: 'white !important',
  },
  tabsFont: {
    '& .MuiTab-wrapper': {
      color: 'white',
      fontWeight: 'bold',
    },
  },
  tabsFont1: {
    '& .MuiTab-wrapper': {
      color: 'black',
      fontWeight: 'bold',
    },
  },
}));

const visualOptionData = [
  { name: 'good', id: 1 },
  { name: 'can do better', id: 2 },
];

const RatingCreate = () => {
  const classes = useStyles();
  const themeContext = useTheme();
  const history = useHistory();
  const { Option } = Select;
  const [moduleId, setModuleId] = React.useState();
  const [month, setMonth] = React.useState('1');
  const [status, setStatus] = React.useState('');
  const [mobileViewFlag, setMobileViewFlag] = useState(window.innerWidth < 700);
  const { setAlert } = useContext(AlertNotificationContext);
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
  const [loading, setLoading] = useState(false);
  const [showPhy, setShowPhy] = useState(false);
  const [score1, setScore1] = useState('');
  const [creativity, setCreativity] = useState('');
  const [score2, setScore2] = useState('');
  const [score3, setScore3] = useState('');
  const [score4, setScore4] = useState('');
  const [score5, setScore5] = useState('');
  const [inputList, setInputList] = useState([{ name: '', rating: '', score: null }]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [viewParameterFlag, setViewParameterFlag] = useState(false);
  const [antDrawer, setAntDrawer] = useState(false);
  const [visualInputlList, setVisualInputList] = useState([{ name: '', score: null }]);
  const [selectedOption, setSelectedOption] = useState('');
  const [onOptionVisible, setOnOptionVisible] = useState(false);
  const [onOptionModal, setOnOptionModal] = useState(false);
  const [optionTitleSelected, setOptionTitle] = useState('');
  const [optionList, setOptionList] = useState([
    { name: '', score: null, status: false },
  ]);
  const [visualActivity, setVisualActivity] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState('');
  const [viewing, setViewing] = useState(false);
  const [ActivityType, setActivityType] = useState();
  const [remarksType, setRemarksType] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [isEditData, setIsEditData] = useState([]);
  const [editOption,setEditOption] = useState([])
  const formRef = useRef()

  const columns = [
    {
      title: <span className='th-white th-fw-700 '>Activity Type Name </span>,
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700 '>Sub Activity Name </span>,
      dataIndex: 'erp_id',
      key: 'erp_id',
      align: 'center',
      render: (text, row, index) => <p>{row?.sub_type ? row?.sub_type : <b>NA</b>}</p>,
    },
    {
      title: <span className='th-white th-fw-700 '>Criteria Title</span>,
      dataIndex: 'criteria_title',
      key: 'erp_id',
      align: 'center',
      render: (text, row, index) => (
        <p>{row?.criteria_title ? row?.criteria_title : <b>NA</b>}</p>
      ),
    },
    {
      title: <span className='th-white th-fw-700 '>Criteria Name</span>,
      dataIndex: 'gender',
      key: 'gender',
      align: 'center',
      render: (text, row, index) => {
        return (
          <p>
            {row.grading_scheme.map((item) => (
              <p>{item.name ? item?.name : <b>NA</b>}</p>
            ))}
          </p>
        );
      },
    },
    {
      title: <span className='th-white th-fw-700 '>Rating</span>,
      dataIndex: 'gender',
      key: 'gender',
      align: 'center',
      render: (text, row, index) => {
        return (
          <>
            <p>
              {row.va_rating[0]
                ? row.va_rating[0].map((item) => <p>{item?.name}</p>)
                : row.grading_scheme.map((item) => <p>{item?.rating}</p>)}
            </p>
          </>
        );
      },
    },
    {
      title: <span className='th-white th-fw-700 '>Score</span>,
      dataIndex: 'gender',
      key: 'gender',
      align: 'center',
      render: (text, row, index) => {
        return (
          <p>
            {row.grading_scheme.map((item) => (
              <p>{item?.score ? item?.score : <b>NA</b>}</p>
            ))}
          </p>
        );
      },
    },
    // {
    //   title: <span className='th-white th-fw-700 '>Action</span>,
    //   dataIndex: 'gender',
    //   key: 'gender',
    //   align: 'center',
    //   render: (text, row, index) => {
    //     return (
    //       <div>
    //         <Tag
    //           icon={<EditFilled className='th-14' />}
    //           color={'warning'}
    //           className='th-br-5 th-pointer py-1'
    //           onClick={(e) => handleEdit(e, row)}
    //         >
    //           Edit
    //         </Tag>
    //         <Tag
    //           icon={<DeleteFilled className='="th-14' />}
    //           color={'red'}
    //           className='th-br-5 th-pointer py-1'
    //           onClick={(e) => handleDelete(row)}
    //         >
    //           Delete
    //         </Tag>
    //       </div>
    //     );
    //   },
    // },
  ];

  const handleListAdd = () => {
    setInputList([
      ...inputList,
      {
        name: '',
        rating: '',
        score: null,
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
    setViewing(false);
    setInputList([{ name: '', rating: '', score: null }]);
    setVisualInputList([{ name: '', score: null }]);
    setOptionList([{ name: '', score: null, status: false }]);
  };

  const handleParameterClose = () => {
    setViewParameterFlag(false);
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
    axios
      .get(`${endpoints.newBlog.unAssign}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        console.log(response);
        setAssigneds(response.data.result);
      });
  };

  useEffect(() => {
    getAssinged();
  }, []);

  const handleActivityTypeSubmit = () => {
    if (!ActivityType?.name) {
      setAlert('error', 'Please Enter Activity Type');
      return;
    }
    const uniqueValues = new Set(inputList.map((e) => e.name));
    if (uniqueValues.size < inputList.length) {
      setAlert('error', 'Duplicate Name Found');
      return;
    }
    let body = {
      sub_type: ActivityType?.sub_type,
      activity_type: ActivityType?.name,
      grading_scheme: inputList,
      criteria_title:
        ActivityType?.name.toLowerCase() === 'public speaking' ? '' : remarksType,

      // {ActivityType.toLowerCase() === "public speaking" ?  criteria_title: remarksType : ""},
    };
    setLoading(true);
    axios
      .post(`${endpoints.newBlog.activityTypeSubmit}`, body, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response?.data?.status_code == 400) {
          setLoading(false);
          message.error(response?.data?.message);
          return;
        } else {
          message.success(response?.data?.message);
          setLoading(false);
          setActivityType('');
          handleClose();
          getActivityCategory();
          return;
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const [activityCategory, setActivityCategory] = useState([]);
  const getActivityCategory = () => {
    let array = [];
    setLoading(true);
    axios
      .get(`${endpoints.newBlog.getActivityType}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        response.data.result.map((obj) => {
          let temp = {};
          temp['id'] = obj?.id;
          temp['grading_scheme_id'] = obj?.grading_scheme_id;
          temp['name'] = obj?.name;
          temp['sub_type'] = obj?.sub_type;
          temp['criteria_title'] = obj?.criteria_title;
          temp['grading_scheme'] = obj?.grading_scheme;
          temp['question'] = obj?.grading_scheme?.map((item) => item?.name);
          temp['va_rating'] = obj?.grading_scheme.map((item) =>
            JSON.parse(item?.va_rating)
          );
          array.push(temp);
        });
        setActivityCategory(array);
        setLoading(false);
      });
  };
  useEffect(() => {
    getActivityCategory();
  }, []);

  const activityScore1 = (e) => {
    const re = /^[0-5\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      setScore1(e.target.value);
    }
    console.log(e.target.value, 'event');
  };

  const handleInputCreativity = (event, index) => {
    const { value } = event.target;
    const newInputList = [...inputList];
    // newInputList[index].creativity = value;
    newInputList[index].name = value;
    setInputList(newInputList);
  };
  const handleInputCreativityEdit = (event, index) => {
    const { value } = event.target;
    const newInputList = {...isEditData};
    let newData = newInputList.grading_scheme
    newData[index].name = value;
    let modifiedData = {...newData['grading_scheme'], isEditData}
    setIsEditData(modifiedData);
  };
  const handleInputRating = (event, index) => {
    const { value } = event.target;
    if (value > 5 || value < 0) {
      setAlert('error', 'Please Enter Number In Between 0 to 5');
      return;
    }
    const newInputList = [...inputList];
    // newInputList[index].creativity = value;
    newInputList[index].rating = value;
    setInputList(newInputList);
  };

  const handleInputChange1 = (event, index) => {
    const { value } = event?.target;
    // const index1=1;

    let newInputList = [...inputList];
    // newInputList[index].creativity = value;
    newInputList[index].score = Number(value);

    setInputList(newInputList);
  };

  const viewParameter = () => {
    // setViewParameterFlag(true)
    setAntDrawer(true);
  };
  const viewOption = () => {
    setOnOptionVisible(true);
  };
  const viewDisplay = () => {
    setViewing(true);
  };

  const handleCreateTemplate = () => {
    history.push('/blog/templates');
  };

  const handleRemoveItem = (index) => {
    const newList = [...inputList];
    newList.splice(index, 1);
    setInputList(newList);
  };

  const handleActivity = (e, value) => {
    if (e) {
      setSearch(e);
      let res = activityCategory.filter((item) =>
        item.name.toLowerCase()?.includes(e.toLowerCase())
      );
      console.log(res, 'pl3');
      setFilterData(res);

      // setFilterData(value)
    } else {
      setFilterData(activityCategory);
    }
  };

  useEffect(() => {
    if (ActivityType?.name == 'Physical Activity') {
      setShowPhy(true);
    } else {
      setShowPhy(false);
    }
  }, [ActivityType]);

  useEffect(() => {
    if(isEditData?.name == "Physical Activity"){
      setShowPhy(true);
    }else{
      setShowPhy(false);
    }

  },[isEditData]);

  const onCloseAnt = () => {
    setAntDrawer(false);
    setOnOptionVisible(false);
  };

  const handleVisualInputApp = () => {
    setVisualInputList([
      ...visualInputlList,
      {
        name: '',
        score: null,
      },
    ]);
  };

  const handleVisualOption = (event, index) => {
    let newInputList = [...visualInputlList];
    newInputList[index].option = value;
    setVisualInputList(newInputList);
  };

  const handleRemoveVisual = (index) => {
    const indexList = visualInputlList.indexOf(index);
    const newList = [...visualInputlList];
    newList.splice(indexList, 1);
    setVisualInputList(newList);
  };

  const handleVisualTypeSubmit = () => {
    let uniqueValues = new Set(visualInputlList.map((e) => e.name));
    if (uniqueValues.size < visualInputlList.length) {
      setAlert('error', 'Duplicate Name Found');
      return;
    }

    //API call
  };

  //Visual Option dropdown
  const visulaOptions = visualOptionData?.map((each) => {
    return (
      <Option value={each?.name} key={each?.id}>
        {each?.name}
      </Option>
    );
  });

  const handleVisualChange = (e, value) => {
    if (e) {
      setSelectedOption(value?.value);
    } else {
      setSelectedOption('');
    }
  };

  const onOptionModalFun = () => {
    setOnOptionModal(true);
  };

  const mainActivityOption = activityCategory.map((each) => {
    return (
      <Option
        value={each?.name}
        key={each?.id}
        name={each.name}
        sub_type={each?.sub_type}
      >
        {each?.name}
      </Option>
    );
  });

  const activityOption = activityCategory.map((each) => {
    return (
      <Option value={each?.id} key={each?.id} name={each.name} sub_type={each?.sub_type}>
        {each?.name} {each?.sub_type ? ` - ${each.sub_type}` : ''}
      </Option>
    );
  });

  const handleActivityAnt = (e, value) => {
    setVisualActivity('');
    if (value) {
      setVisualActivity(value);
    }
  };

  const handleOptionInputAdd = (e, value) => {
    setOptionList([
      ...optionList,
      {
        name: '',
        score: null,
        status: false,
      },
    ]);
  };

  const handleOptionInput = (event, index) => {
    console.log(index);
    if (event) {
      const { value } = event.target;
      const newInputList = [...optionList];
      newInputList[index].name = value;
      setOptionList(newInputList);
    }
  };

  const handleMarksInput = (event, index) => {
    const { value } = event.target;
    let newInputList = [...optionList];
    newInputList[index].score = value;
    setOptionList(newInputList);
  };

  const handleOptionSubmit = () => {
    const arr1 = visualInputlList?.map((obj) => {
      return { ...obj, rating: optionList };
      return obj;
    });
    let body = {
      activity_type: ActivityType?.name,
      criteria_title: remarksType,
      grading_scheme: arr1,
    };

    setLoading(true);
    axios
      .post(`${endpoints.newBlog.visualOptionSubmit}`, body, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((res) => {
        if (res.data.status_code == 400) {
          message.error(res.data.message);
          setLoading(false);
          return;
        } else {
          setLoading(false);
          message.success(res.data.message);
          setActivityType('');
          handleClose();
          getActivityCategory();
          return;
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const handleOptionTitle = (e) => {
    const { value } = e.target;
    setOptionTitle(value);
  };

  const handleOptionDelete = (id, index) => {
    let newOptionList = [...optionList];
    let newList = newOptionList.filter((item) => item?.name !== id?.name);
    setOptionList(newList);
  };

  const handleQuestion = (event, index) => {
    if (event) {
      const { value } = event.target;
      const newInputList = [...visualInputlList];
      newInputList[index].name = value;
      setVisualInputList(newInputList);
    }
  };

  const handleRemoveVisualQuestion = (id, index) => {
    let newVisualList = [...visualInputlList];
    const newList = newVisualList.filter((item) => item?.name !== id?.name);
    setVisualInputList(newList);
  };

  const activityOptions = activityCategory?.map((each) => {
    return (
      <Option key={each?.id} value={each?.name}>
        {each?.name}
      </Option>
    );
  });

  const handleClearActivityType = () => {
    setSearch('');
  };

  const handleActivityChange = (event, value) => {
    setActivityType(value);
  };

  const handleModalClose = () => {
    setViewing(false);
    setInputList([{ name: '', rating: '', score: null }]);
    setVisualInputList([{ name: '', score: null }]);
    setOptionList([{ name: '', score: null, status: false }]);
  };
  const handleModalCloseEdit = () =>{
    setIsEdit(false);
    setIsEditData([]);
    setInputList([{ name: '', rating: '', score: null }]);
    setVisualInputList([{ name: '', score: null }]);
    setOptionList([{ name: '', score: null, status: false }]);

  }

  const handleInputRemarks = (event) => {
    const { value } = event.target;
    setRemarksType(value);
  };
  const handleInputRemarksEdit = (event) => {
    const { value } = event.target;
    const newInputList = {...isEditData, criteria_title: value}
    setIsEditData(newInputList);

  };
  const handleDelete = (data) => {
    if(data){
      setLoading(true)
      axios.delete(`${endpoints.newBlog.criteriaDelete}/${data?.id}/?grading_scheme_id=${data?.grading_scheme_id}`,{
        headers: {
          'X-DTS-HOST' : X_DTS_HOST,
        },
      })
      .then((response) =>{
        console.log(response)
        message.success(response?.data?.message)
        setLoading(false)
        return
        
      })
      .catch((err) =>{
        message.error(err)
        console.log(err)
        return
      })
    }
  };
  const handleEdit = (e, data) => {
    setIsEdit(false);
    if (e) {
      setIsEdit(true);
      setIsEditData(data);
      let optionData =  data?.va_rating[0]
      setEditOption(optionData)      
      console.log(data, 'k1');
    }
  };

  return (
    // ant design-ui ----->

    <Layout>
      {''}
      <div className='row px-2'>
        {/* breadcrumb - */}

        <div className='col-md-8' style={{ zIndex: 2 }}>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
              Activity
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-grey th-16'>Create rating</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        {/* //body - */}

        <div className='row th-bg-white th-br-5 m-3'>
          {loading ? (
            <div
              className='d-flex align-item-center justify-content-center w-100'
              style={{ height: '55vh' }}
            >
              <Spin tip='Loading' />
            </div>
          ) : (
            <div className='row p-3' style={{ height: '68vh', overflowY: 'auto' }}>
              <div className='col-12 d-flex' style={{ height: '6%' }}>
                <div className='col-md-6 mb-sm-0 p-0'>
                  <Form.Item name='activity type'>
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      placeholder='Select Activity Type'
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e) => {
                        handleActivity(e);
                      }}
                      onClear={handleClearActivityType}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      bordered={false}
                    >
                      {mainActivityOption}
                    </Select>
                  </Form.Item>
                </div>

                <div className='d-flex align-item-center justify-content-end col-md-6 mb-sm-0 p-0'>
                  <div className='col-mb-3 mb-sm-0 text-sm-right px-0 px-sm-2 pt-1 pt-sm-0'>
                    <Tag
                      icon={<SnippetsOutlined className='th-14' />}
                      color='geekblue'
                      className='th-br-5 th-pointer py-1'
                      onClick={handleCreateTemplate}
                    >
                      <span className='th-fw-500 th-14'>Add Templates</span>
                    </Tag>
                  </div>
                  <div className='col-mb-3 mb-sm-0 text-sm-right px-0 px-sm-2 pt-1 pt-sm-0'>
                    <Tag
                      icon={<AuditOutlined className='th-14' />}
                      color='purple'
                      className='th-br-5 th-pointer py-1 th-14 th-fw-500'
                      onClick={viewDisplay}
                    >
                      Add Remarks
                    </Tag>
                  </div>
                </div>
              </div>
              <div className='row' style={{ height: '55vh', overflowY: 'auto' }}>
                <div className='col-md-12'>
                  <>
                    {filterData?.length !== 0 ? (
                      <Table
                        className='th-table'
                        rowClassName={(record, index) =>
                          `'th-pointer ${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
                        }
                        pagination={false}
                        loading={loading}
                        columns={columns}
                        dataSource={filterData}
                      />
                    ) : (
                      <div
                        className='row justify-content-center align-item-center mt-5'
                        style={{ height: '47 vh' }}
                      >
                        <img src={NoDataIcon} />
                      </div>
                    )}
                  </>
                </div>
              </div>
            </div>
          )}
        </div>
        <ModalAnt
          title='Create Rating'
          centered
          open={viewing}
          visible={viewing}
          footer={null}
          className='th-upload-modal'
          onOk={() => setViewing(false)}
          onCancel={handleModalClose}
          width={1000}
        >
          <div className='row p-2'>
            <div className='col-md-12 md-sm-0'>
              <Form.Item name='activity_type'>
                <Select
                  placeholder='Activity Type'
                  showSearch
                  optionFilterProp='children'
                  filterOption={(input, option) => {
                    return (
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={(e, value) => handleActivityChange(e, value)}
                  className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                  bordered={false}
                >
                  {activityOption}
                </Select>
              </Form.Item>
            </div>
            <div className='col-md-12'>
              {ActivityType ? (
                <>
                  {(ActivityType && ActivityType?.name.toLowerCase() === 'visual art') ||
                  ActivityType?.name.toLowerCase() === 'music' ||
                  ActivityType?.name.toLowerCase() === 'dance' ||
                  ActivityType?.name.toLowerCase() === 'theatre' ? (
                    <div className='row m-2'>
                      <AntDivider
                        orientation='left'
                        orientationMargin='0'
                        plain
                        style={{ alignItems: 'flex-start' }}
                      >
                        Add Criteria Title
                      </AntDivider>
                      <div className='col-10 question-visual'>
                        <Input
                          placeholder='Criteria Title'
                          width={100}
                          value={remarksType}
                          onChange={(e) => handleInputRemarks(e)}
                        />
                      </div>
                      <AntDivider
                        orientation='left'
                        orientationMargin='0'
                        plain
                        style={{ alignItems: 'flex-start' }}
    // setIsEdit(false);
    >
                        Add Questions
                      </AntDivider>
                      {visualInputlList
                        ? visualInputlList.map((input, index) => (
                            <>
                              <div className='col-10 question-visual'>
                                <Input
                                  placeholder='Question'
                                  width={100}
                                  value={input?.name}
                                  onChange={(event) => handleQuestion(event, index)}
                                />
                              </div>
                              <div className='col-2 delete-visual-icon'>
                                <DeleteFilled
                                  onClick={() => handleRemoveVisualQuestion(input, index)}
                                  style={{
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    color: 'darkblue',
                                  }}
                                />
                              </div>
                            </>
                          ))
                        : 'No Item In The List'}

                      <div className='col-12 padding-style'>
                        <Button
                          type='primary'
                          icon={<PlusOutlined />}
                          onClick={handleVisualInputApp}
                        >
                          Add Question
                        </Button>
                      </div>
                      <AntDivider
                        orientation='left'
                        orientationMargin='0'
                        plain
                        style={{ alignItems: 'flex-start' }}
                      >
                        Add Options
                      </AntDivider>
                      {optionList
                        ? optionList.map((input, index) => (
                            <div className='row'>
                              <div className='col-6' style={{ padding: '0.5rem 0rem' }}>
                                <Input
                                  value={input?.name}
                                  placeholder='Option'
                                  width={100}
                                  onChange={(event) => handleOptionInput(event, index)}
                                />
                              </div>
                              <div className='col-3' style={{ padding: '0.5rem 0.5rem' }}>
                                <Input
                                  placeholder='Marks'
                                  value={input?.score}
                                  width={100}
                                  onChange={(event) => handleMarksInput(event, index)}
                                />
                              </div>
                              <div className='col-3 delete-visual-icon'>
                                <DeleteFilled
                                  style={{
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    color: 'darkblue',
                                  }}
                                  onClick={() => handleOptionDelete(input, index)}
                                />
                              </div>
                            </div>
                          ))
                        : 'No Option In The List'}
                      <div className='col-12' style={{ padding: '0.5rem 0rem' }}>
                        <Button
                          icon={<PlusOutlined />}
                          onClick={handleOptionInputAdd}
                          type='primary'
                        >
                          Add Option
                        </Button>
                      </div>
                      <div className='col-12 padding-style'>
                        <Button type='primary' onClick={handleOptionSubmit}>
                          Submit
                        </Button>

                        <Button
                          type='primary'
                          onClick={handleClose}
                          style={{ marginLeft: '0.5rem' }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className='row m-2'>
                        {ActivityType &&
                        ActivityType.name.toLowerCase() === 'public speaking' ? (
                          ''
                        ) : (
                          <>
                            <AntDivider
                              orientation='left'
                              orientationMargin='0'
                              plain
                              style={{ alignItems: 'flex-start' }}
                            >
                              Add Criteria Title
                            </AntDivider>
                            <div className='col-3'>
                              <Input
                                placeholder='Criteria Title'
                                width={100}
                                value={remarksType}
                                onChange={(event) => handleInputRemarks(event)}
                                inputList   />
                            </div>
                          </>
                        )}
                      </div>
                      <div className='row m-2'>
                        <AntDivider
                          orientation='left'
                          orientationMargin='0'
                          plain
                          style={{ alignItems: 'flex-start' }}
                        >
                          Add Criteria Name
                        </AntDivider>
                      </div>
                      {inputList
                        ? inputList.map((input, index) => (
                            <>
                              <div className='row m-2'>
                                <div className='col-3'>
                                  <Input
                                    placeholder='Criteria'
                                    width={100}
                                    value={input?.name}
                                    onChange={(event) =>
                                      handleInputCreativity(event, index)
                                    }
                                  />
                                </div>
                                {showPhy ? (
                                  ''
                                ) : (
                                  <>
                                    <div className='col-3'>
                                      <Input
                                        placeholder='Rating'
                                        width={100}
                                        value={input?.rating}
                                        onChange={(event) =>
                                          handleInputRating(event, index)
                                        }
                                      />
                                    </div>
                                    <div className='col-3'>
                                      <Input
                                        placeholder='Score'
                                        width={100}
                                        value={input?.score}
                                        onChange={(event) =>
                                          handleInputChange1(event, index)
                                        }
                                      />
                                    </div>
                                  </>
                                )}
                                <div className='col-2 d-flex align-items-center'>
                                  <DeleteFilled
                                    // onClick={() => handleRemoveVisualQuestion(input, index)}
                                    onClick={() => handleRemoveItem(index)}
                                    style={{
                                      cursor: 'pointer',
                                      fontSize: '18px',
                                      color: 'darkblue',
                                    }}
                                  />
                                </div>
                              </div>
                            </>
                          ))
                        : 'No item in the list '}
                      <div className='row m-2'>
                        <div className='col-12 mb-2 th-black-1  text-truncate'>
                          <Button
                            icon={<PlusOutlined />}
                            type='primary'
                            className='th-br-5 th-pointer py-1 th-14 th-fw-500'
                            onClick={handleListAdd}
                          >
                            Add Remarks
                          </Button>
                        </div>
                      </div>
                      <AntDivider />
                      <div className='row mb-3 ml-1'>
                        <div className='col-12 th-black-1'>
                          <Button
                            icon={<CheckCircleOutlined />}
                            color='green'
                            type='primary'
                            className='th-br-5 th-pointer py-1 th-14 th-fw-500 mr-2'
                            onClick={handleActivityTypeSubmit}
                          >
                            Submit
                          </Button>
                          <Button
                            icon={<CloseCircleOutlined />}
                            color='red'
                            type='primary'
                            className='th-br-5 th-pointer py-1 th-14 th-fw-500'
                            onClick={handleModalClose}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div
                  className='row justify-content-center align-item-center m-5'
                  style={{ height: '25vh' }}
                >
                  <img src={NoDataIcon} />
                </div>
              )}
            </div>
          </div>
        </ModalAnt>
        {console.log(isEditData, 'k22')}
        <ModalAnt
          title='Edit Rating'
          centered
          open={isEdit}
          visible={isEdit}
          footer={null}
          className='th-upload-modal'
          onOk={() => setViewing(false)}
          onCancel={handleModalCloseEdit}
          width={1000}
        >
          <div className='row p-2'>
            <div className='col-md-12 md-sm-0'>
            {/* <Form ref={formRef}> */}
              <Form.Item name='activity_type'>
                <Select
                  placeholder='Activity Type'
                  showSearch
                  disabled
                  optionFilterProp='children'
                  defaultValue={`${isEditData?.name}`}
                  // value={isEditData?.name}
                  filterOption={(input, option) => {
                    return (
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={(e, value) => handleActivityChange(e, value)}
                  className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                  bordered={false}
                >
                  {activityOption}
                </Select>
              </Form.Item>

            {/* </Form> */}
            </div>
            {console.log(isEditData,'jk1')}
            <div className='col-md-12'>
              {Object.keys(isEditData).length > 0  ? (
                <>
                  {(isEditData?.name.toLowerCase() === 'visual art') ||
                  isEditData?.name.toLowerCase() === 'music' ||
                  isEditData?.name.toLowerCase() === 'dance' ||
                  isEditData?.name.toLowerCase() === 'theatre' ? (
                    <div className='row m-2'>
                      <AntDivider
                        orientation='left'
                        orientationMargin='0'
                        plain
                        style={{ alignItems: 'flex-start' }}
                      >
                        Add Criteria Title
                      </AntDivider>
                      <div className='col-10 question-visual'>
                        <Input
                          placeholder='Criteria Title'
                          width={100}
                          defaultValue={isEditData?.criteria_title}
                          value={Object.keys(isEditData) ? isEditData?.criteria_title : remarksType}
                          onChange={(e) => handleInputRemarks(e)}
                        />
                      </div>
                      <AntDivider
                        orientation='left'
                        orientationMargin='0'
                        plain
                        style={{ alignItems: 'flex-start' }}
                      >
                        Add Questions
                      </AntDivider>
                      {Object.keys(isEditData)
                        ? isEditData?.grading_scheme.map((input, index) => (
                            <>
                              <div className='col-10 question-visual'>
                                <Input
                                  placeholder='Question'
                                  width={100}
                                  value={input?.name}
                                  onChange={(event) => handleQuestion(event, index)}
                                />
                              </div>
                              <div className='col-2 delete-visual-icon'>
                                <DeleteFilled
                                  onClick={() => handleRemoveVisualQuestion(input, index)}
                                  style={{
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    color: 'darkblue',
                                  }}
                                />
                              </div>
                            </>
                          ))
                        : 'No Item In The List'}

                      <div className='col-12 padding-style'>
                        <Button
                          type='primary'
                          icon={<PlusOutlined />}
                          onClick={handleVisualInputApp}
                        >
                          Add Question
                        </Button>
                      </div>
                      <AntDivider
                        orientation='left'
                        orientationMargin='0'
                        plain
                        style={{ alignItems: 'flex-start' }}
                      >
                        Add Options
                      </AntDivider>
                      {Object.keys(editOption)
                        ? editOption?.map((input, index) => (
                            <div className='row'>
                              <div className='col-6' style={{ padding: '0.5rem 0rem' }}>
                                <Input
                                  value={input?.name}
                                  placeholder='Option'
                                  width={100}
                                  onChange={(event) => handleOptionInput(event, index)}
                                />
                              </div>
                              <div className='col-3' style={{ padding: '0.5rem 0.5rem' }}>
                                <Input
                                  placeholder='Marks'
                                  value={input?.score}
                                  width={100}
                                  onChange={(event) => handleMarksInput(event, index)}
                                />
                              </div>
                              <div className='col-3 delete-visual-icon'>
                                <DeleteFilled
                                  style={{
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    color: 'darkblue',
                                  }}
                                  onClick={() => handleOptionDelete(input, index)}
                                />
                              </div>
                            </div>
                          ))
                        : 'No Option In The List'}
                      <div className='col-12' style={{ padding: '0.5rem 0rem' }}>
                        <Button
                          icon={<PlusOutlined />}
                          onClick={handleOptionInputAdd}
                          type='primary'
                        >
                          Add Option
                        </Button>
                      </div>
                      <div className='col-12 padding-style'>
                        <Button type='primary' onClick={handleOptionSubmit}>
                          Submit
                        </Button>

                        <Button
                          type='primary'
                          onClick={handleClose}
                          style={{ marginLeft: '0.5rem' }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className='row m-2'>
                        {isEditData.name.toLowerCase() === 'public speaking' ? (
                          ''
                        ) : (
                          <>
                            <AntDivider
                              orientation='left'
                              orientationMargin='0'
                              plain
                              style={{ alignItems: 'flex-start' }}
                            >
                              Add Criteria Title
                            </AntDivider>
                            <div className='col-3'>
                              <Input
                                placeholder='Criteria Title'
                                defaultValue={isEditData?.criteria_title}
                                width={100}
                                value={Object.keys(isEditData) ? isEditData?.criteria_title :  remarksType}
                                onChange={(event) => handleInputRemarksEdit(event)}
                              />
                            </div>
                          </>
                        )}
                      </div>
                      <div className='row m-2'>
                        <AntDivider
                          orientation='left'
                          orientationMargin='0'
                          plain
                          style={{ alignItems: 'flex-start' }}
                        >
                          Add Criteria Name
                        </AntDivider>
                      </div>
                      {Object.keys(isEditData)
                        ? isEditData?.grading_scheme?.map((input, index) => (
                            <>
                              <div className='row m-2'>
                                <div className='col-3'>
                                  <Input
                                    placeholder='Criteria'
                                    width={100}
                                    defaultValue={input?.name}
                                    value={input?.name}
                                    onChange={(event) =>
                                      handleInputCreativityEdit(event, index)
                                    }
                                  />
                                </div>
                                {showPhy ? (
                                  ''
                                ) : (
                                  <>
                                    <div className='col-3'>
                                      <Input
                                        placeholder='Rating'
                                        width={100}
                                        value={input?.rating}
                                        onChange={(event) =>
                                          handleInputRating(event, index)
                                        }
                                      />
                                    </div>
                                    <div className='col-3'>
                                      <Input
                                        placeholder='Score'
                                        width={100}
                                        value={input?.score}
                                        onChange={(event) =>
                                          handleInputChange1(event, index)
                                        }
                                      />
                                    </div>
                                  </>
                                )}
                                <div className='col-2 d-flex align-items-center'>
                                  <DeleteFilled
                                    // onClick={() => handleRemoveVisualQuestion(input, index)}
                                    onClick={() => handleRemoveItem(index)}
                                    style={{
                                      cursor: 'pointer',
                                      fontSize: '18px',
                                      color: 'darkblue',
                                    }}
                                  />
                                </div>
                              </div>
                            </>
                          ))
                        : 'No item in the list '}
                      <div className='row m-2'>
                        <div className='col-12 mb-2 th-black-1  text-truncate'>
                          <Button
                            icon={<PlusOutlined />}
                            type='primary'
                            className='th-br-5 th-pointer py-1 th-14 th-fw-500'
                            onClick={handleListAdd}
                          >
                            Add Remarks
                          </Button>
                        </div>
                      </div>
                      <AntDivider />
                      <div className='row mb-3 ml-1'>
                        <div className='col-12 th-black-1'>
                          <Button
                            icon={<CheckCircleOutlined />}
                            color='green'
                            type='primary'
                            className='th-br-5 th-pointer py-1 th-14 th-fw-500 mr-2'
                            onClick={handleActivityTypeSubmit}
                          >
                            Submit
                          </Button>
                          <Button
                            icon={<CloseCircleOutlined />}
                            color='red'
                            type='primary'
                            className='th-br-5 th-pointer py-1 th-14 th-fw-500'
                            onClick={handleModalClose}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div
                  className='row justify-content-center align-item-center m-5'
                  style={{ height: '25vh' }}
                >
                  <img src={NoDataIcon} />
                </div>
              )}
            </div>
          </div>
        </ModalAnt>
      </div>
    </Layout>
  );
};
export default RatingCreate;
