import React, { useState, useEffect, useContext } from 'react';
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
    // let newList = [...visualInputlList]
    // newList.splice(index, 1);
    // setVisualInputList(newList)
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

  const activityOption = activityCategory.map((each) => {
    return (
      <Option value={each?.name} key={each?.id} name={each.name} sub_type={each.sub_type}>
        {each?.name}
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
    // let uniqueValues = new Set(optionList.map((e) => e?.option));
    // if(uniqueValues.size < optionList?.length){
    //   setAlert('error','Duplicate Name FOund')
    //   return
    // }
    let body = {
      activity_type: ActivityType?.name,
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

    // setActivityType("")
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
                      {activityOption}
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
                  {/* {(search && search?.name?.toLowerCase() === "blog activity") || (search?.name?.toLowerCase() === "physical activity") ? ( */}
                  <>
                    {filterData?.length !== 0 ? (
                      <Table
                        // style={{ maxHeight: '60vh', OverflowY: 'auto' }}
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
        {/* <Modal
          title="Modal 1000px width"
          centered
          open={viewing}
          onOk={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          width={1000}
        >
          <p>some contents...</p>
          <p>some contents...</p>
          <p>some contents...</p>
        </Modal> */}

        {/* <AntDrawer
          title={`Add Parameters`}
          zIndex={1300}
          placement="right"
          width={window.innerWidth < 768 ? '90vw' : '450px'}
          onClose={onCloseAnt}
          visible={antDrawer}
          open={antDrawer}
        >

          <div className='action-filed'>
            {visualInputlList ? visualInputlList.map((input, index) => (
              <>
                <div className='row' style={{ marginTop: '1rem', display: 'flex' }}>
                  <div className='col-6'>

                  </div>
                  <div className='col-4'>
                    <Select
                      className='th-grey th-bg-grey th-br-4 th-select w-100 text-left'
                      bordered={true}
                      getPopupContainer={(trigger) => trigger.parentNode}
                      placement='bottomRight'
                      placeholder='Select Option'
                      suffixIcon={<DownOutlined className='th-black-1' />}
                      dropdownMatchSelectWidth={false}
                      onChange={(e, val) => handleVisualChange(e, val)}
                      allowClear

                      menuItemSelectedIcon={<CheckOutlined className='th-primary' />}
                    >
                      {visulaOptions}

                    </Select>
                  </div>
                  <div className='col-2'>
                    <DeleteFilled onClick={() => handleRemoveVisual(index)} style={{ cursor: 'pointer' }} />
                  </div>

                </div>
              </>
            )) : "No Item In The List"}
            <div style={{ padding: '0.5rem 0rem' }}>
              <Button type="primary" onClick={handleVisualInputApp} >Add</Button>

            </div>
            <div style={{ padding: '0.5rem 0rem', display: 'flex', alignItem: 'center', justifyContent: 'end' }}>
              <Button type="primary">Submit</Button>
            </div>

          </div>
        </AntDrawer>
        <AntDrawer
          title={`Options`}
          zIndex={1300}
          placement="right"
          width={window.innerWidth < 768 ? '90vw' : '450px'}
          // size='default'
          onClose={onCloseAnt}
          visible={onOptionVisible}
          open={onOptionVisible}
          extra={
            <Space>
              <Button
                icon={<PlusOutlined />}
                onClick={onOptionModalFun}
              >Add Options</Button>
            </Space>
          }
        >

          <div className='action-filed'>
            {visualInputlList ? visualInputlList.map((input, index) => (
              <>
                <div className='row' style={{ marginTop: '1rem', display: 'flex' }}>
                  <div className='col-6'>

                  </div>
                  <div className='col-4'>
                    <Select
                      className='th-grey th-bg-grey th-br-4 th-select w-100 text-left'
                      bordered={true}
                      getPopupContainer={(trigger) => trigger.parentNode}
                      placement='bottomRight'
                      placeholder='Select Option'
                      suffixIcon={<DownOutlined className='th-black-1' />}
                      dropdownMatchSelectWidth={false}
                      onChange={(e, val) => handleVisualChange(e, val)}
                      allowClear

                      menuItemSelectedIcon={<CheckOutlined className='th-primary' />}
                    >
                      {visulaOptions}

                    </Select>
                  </div>
                  <div className='col-2'>
                    <DeleteFilled onClick={() => handleRemoveVisual(index)} style={{ cursor: 'pointer' }} />
                  </div>

                </div>
              </>
            )) : "No Item In The List"}
            <div style={{ padding: '0.5rem 0rem' }}>
              <Button type="primary" onClick={handleVisualInputApp} >Add</Button>

            </div>
            <div style={{ padding: '0.5rem 0rem', display: 'flex', alignItem: 'center', justifyContent: 'end' }}>
              <Button type="primary">Submit</Button>
            </div>

          </div>
        </AntDrawer> */}
        {/* <AntModal
          title="Add Options"
          centered
          open={onOptionModal}
          visible={onOptionModal}
          onCancel={() => setOnOptionModal(false)}
        >
          <div style={{ border: '1px solid black', margin: '0.5rem 0rem' }}>
            <div className='col-10' style={{ padding: '0.5rem 0rem' }}>
              <Input
                placeholder='Question'
                width={100}
              />
            </div>
            <div className='col-2'>
            </div>
            {optionList ? optionList.map((input, index) => (
              <div className='row'>

                <div className='col-6' style={{ padding: '0.5rem 0rem' }} >
                  <Input
                    placeholder='Option'
                    width={100}
                    onChange={(event) => handleOptionInput(event, index)}
                  />
                </div>
                <div className='col-6' style={{ padding: '0.5rem 0rem' }}>
                  <Input
                    placeholder='Marks'
                    width={100}
                    onChange={(event) => handleMarksInput(event, index)}
                  />
                </div>
              </div>
            )) : "No Item In The List"}
            <div className='col-12' style={{ padding: '0.5rem 0rem' }}>
              <Button
                icon={<PlusOutlined />}
                onClick={handleOptionInputAdd}
              >
                Add Button
              </Button>
            </div>
            <div className='col-12'
            >
              <Button onClick={handleOptionSubmit}>
                Submit
              </Button>

            </div>

          </div>
        </AntModal> */}

        {/* <Dialog
          maxWidth={maxWidth}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <div
            style={{
              marginLeft: '37px',
              marginTop: '13px',
              marginBottom: '12px',
              marginRight: '28px',
            }}
          >
            <div style={{ fontSize: '28px', fontWeight: 'bold', width: '46vw' }}>
              Create Rating
            </div>
            <Divider />
            <div style={{ marginTop: '8px' }}>
              <Autocomplete
                size='small'
                style={{ width: '45%' }}
                onChange={(e, value) => setActivityType(value)}
                className='dropdownIcon'
                value={ActivityType}
                options={activityCategory || []}
                getOptionLabel={(option) => option?.name || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Activity Type'
                    placeholder='Activity Type'
                    required
                  />
                )}
              />
            </div>

            {ActivityType?.name == 'Physical Activity' ? (
              <div
                style={{
                  width: '73vh',
                  fontWeight: 400,
                  marginTop: '10px',
                  paddingLeft: '10px',
                }}
              >
                Sub-Activity Type :
                <b style={{ color: 'blue' }}> {ActivityType?.sub_type} </b>
              </div>
            ) : (
              ''
            )}

            {ActivityType?.name.toLowerCase() === 'visual art' ||
            ActivityType?.name.toLowerCase() === 'music' ||
            ActivityType?.name.toLowerCase() === 'dance' ||
            ActivityType?.name.toLowerCase() === 'theater' ? (
              <div className='row m-2' style={{ width: '650px' }}>
                <AntDivider orientation='left' plain style={{ alignItems: 'flex-start' }}>
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
                <AntDivider orientation='left' plain style={{ alignItems: 'flex-start' }}>
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
                    type='danger'
                    onClick={handleClose}
                    style={{ marginLeft: '0.5rem' }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {inputList
                  ? inputList.map((input, index) => (
                      <>
                        <div style={{ marginTop: '1rem', display: 'flex' }}>
                          <TextField
                            label='Criteria Name'
                            size='small'
                            type='text'
                            onChange={(event) => handleInputCreativity(event, index)}
                            variant='outlined'
                          />
                          &nbsp;&nbsp;&nbsp;
                          {showPhy ? (
                            ''
                          ) : (
                            <>
                              <TextField
                                label='Rating'
                                size='small'
                                type='number'
                                onChange={(event) => handleInputRating(event, index)}
                                variant='outlined'
                              />
                              &nbsp;&nbsp;&nbsp;
                              <TextField
                                label='Score'
                                size='small'
                                type='number'
                                onChange={(event) => handleInputChange1(event, index)}
                                variant='outlined'
                              />
                            </>
                          )}
                          <Button
                            style={{ marginLeft: '12px' }}
                            color='primary'
                            variant='contained'
                            onClick={() => handleRemoveItem(index)}
                          >
                            Delete
                          </Button>
                        </div>
                      </>
                    ))
                  : 'No item in the list '}
                &nbsp;&nbsp;&nbsp;
                <Button
                  onClick={handleListAdd}
                  disabled={isDisabled}
                  style={{ marginTop: '1rem' }}
                  variant='contained'
                  color='primary'
                >
                  Add
                </Button>
                &nbsp;&nbsp;
                <Button
                  variant='contained'
                  size='small'
                  color='primary'
                  onClick={handleActivityTypeSubmit}
                  style={{ marginTop: '1rem' }}
                >
                  Submit
                </Button>
              </>
            )}
          </div>
        </Dialog> */}

        <ModalAnt
          title='Create Rating'
          centered
          open={viewing}
          visible={viewing}
          footer={null}
          className='th-upload-modal'
          onOk={() => setViewing(false)}
          // onCancel={() => setViewing(false)}
          onCancel={handleModalClose}
          width={1000}
        >
          <div className='row p-2'>
            <div className='col-md-12 md-sm-0'>
              <Form.Item name='activity type'>
                <Select
                  placeholder='Activity Type'
                  showSearch
                  optionFilterProp='children'
                  filterOption={(input, option) => {
                    return (
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  // onChange={(e) => handleActivity(e)}
                  // onClear={handleRatingActivityClear}
                  // onChange={(e, value) => setActivityType(value)}
                  onChange={(e, value) => handleActivityChange(e, value)}
                  className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                  bordered={false}
                >
                  {activityOption}
                </Select>
              </Form.Item>
            </div>
            {console.log(ActivityType, 'KK')}
            <div className='col-md-12'>
              {ActivityType ? (
                <>
                  {(ActivityType && ActivityType?.name.toLowerCase() === 'visual art') ||
                  ActivityType?.name.toLowerCase() === 'music' ||
                  ActivityType?.name.toLowerCase() === 'dance' ||
                  ActivityType?.name.toLowerCase() === 'theater' ? (
                    <div className='row m-2' style={{ width: '650px' }}>
                      <AntDivider
                        orientation='left'
                        plain
                        style={{ alignItems: 'flex-start' }}
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
                          type='danger'
                          onClick={handleClose}
                          style={{ marginLeft: '0.5rem' }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
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
                                        // onChange={(event) => handleQuestion(event, index)}
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
                                        // onChange={(event) => handleQuestion(event, index)}
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
                              {/* <div style={{ marginTop: '1rem', display: 'flex' }}>
                                <TextField
                                  label='Criteria Name'
                                  size='small'
                                  type='text'
                                  onChange={(event) =>
                                    handleInputCreativity(event, index)
                                  }
                                  variant='outlined'
                                />
                                &nbsp;&nbsp;&nbsp;
                                {showPhy ? (
                                  ''
                                ) : (
                                  <>
                                    <TextField
                                      label='Rating'
                                      size='small'
                                      type='number'
                                      onChange={(event) =>
                                        handleInputRating(event, index)
                                      }
                                      variant='outlined'
                                    />
                                    &nbsp;&nbsp;&nbsp;
                                    <TextField
                                      label='Score'
                                      size='small'
                                      type='number'
                                      onChange={(event) =>
                                        handleInputChange1(event, index)
                                      }
                                      variant='outlined'
                                    />
                                  </>
                                )}
                                <Button
                                  style={{ marginLeft: '12px' }}
                                  color='primary'
                                  variant='contained'
                                  onClick={() => handleRemoveItem(index)}
                                >
                                  Delete
                                </Button>
                              </div> */}
                            </>
                          ))
                        : 'No item in the list '}
                      <div className='row m-2'>
                        <div className='col-12 mb-2 th-black-1  text-truncate'>
                          <Tag
                            icon={<PlusOutlined />}
                            color='geekblue'
                            className='th-br-5 th-pointer py-1 th-14 th-fw-500'
                            onClick={handleListAdd}
                          >
                            Add Remarks
                          </Tag>
                        </div>
                      </div>
                      <div className='row m-2'>
                        <div className='col-12 th-black-1'>
                          <Button
                            icon={<CheckCircleOutlined />}
                            color='green'
                            className='th-br-5 th-pointer py-1 th-14 th-fw-500 mr-2'
                            onClick={handleActivityTypeSubmit}
                          >
                            Submit
                          </Button>
                          <Button
                            icon={<CloseCircleOutlined />}
                            color='red'
                            className='th-br-5 th-pointer py-1 th-14 th-fw-500'
                            onClick={handleModalClose}
                          >
                            Cancel
                          </Button>
                        </div>
                        {/* <div className='col-6 th-black-1'>
                          <Tag
                            icon={<CloseCircleOutlined />}
                            color='red'
                            className='th-br-5 th-pointer py-1'
                            onClick={handleActivityTypeSubmit}
                          >
                            Cancel
                          </Tag>
                        </div> */}
                      </div>
                      {/* <Button
                        onClick={handleListAdd}
                        disabled={isDisabled}
                        style={{ marginTop: '1rem' }}
                        variant='contained'
                        color='primary'
                      >
                        Add Remarks
                      </Button> */}

                      {/* <Button
                        variant='contained'
                        size='small'
                        color='primary'
                        onClick={handleActivityTypeSubmit}
                        style={{ marginTop: '1rem' }}
                      >
                        Submit
                      </Button> */}
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

    // material-ui ----->

    // <div>
    //   {loading && <Loader />}

    //   <Layout>
    //     <Grid
    //       container
    //       style={{
    //         display: 'flex',
    //         justifyContent: 'space-between',
    //         paddingLeft: '22px',
    //         paddingRight: '15px',
    //         paddingBottom: '15px',
    //       }}
    //     >
    //       <Grid item xs={4} md={4}>
    //         <Breadcrumb separator=">">
    //           <Breadcrumb.Item className='th-grey th-16'>
    //             Activity
    //           </Breadcrumb.Item>
    //           <Breadcrumb.Item className='th-grey th-16'>
    //             Create Rating
    //           </Breadcrumb.Item>
    //         </Breadcrumb>
    //       </Grid>
    //     </Grid>

    //     <Grid container item md={12} sm={12} xs={12}>
    //       <Grid item spacing={3} md={6}>
    //         <Grid item md={6} style={{ margin: '0 6%' }}>
    //           <Autocomplete
    //             size='small'
    //             fullWidth
    //             onChange={handleActivity}
    //             className='dropdownIcon'
    //             value={search}
    //             options={activityCategory || []}
    //             getOptionLabel={(option) => option?.name || ''}
    //             renderInput={(params) => (
    //               <TextField
    //                 {...params}
    //                 variant='outlined'
    //                 label='Activity Type'
    //                 placeholder='Activity Type'
    //                 required
    //               />
    //             )}
    //           />
    //         // </Grid>
    //       </Grid>

    //       <Grid item md={6} container justifyContent='flex-end'>
    //         <Grid item md={3} container justifyContent='flex-end'>
    //           <Button variant='contained' color='primary' onClick={handleCreateTemplate}>
    //             {' '}
    //             Add Template
    //           </Button>
    //         </Grid>
    //         <Grid item md={3} container justifyContent='center'>
    //           <Button variant='contained' color='primary' onClick={viewDisplay}>
    //             Add
    //           </Button>
    //         </Grid>
    //       </Grid>
    //     </Grid>

    //     {(search?.name.toLowerCase() === "visual activity") || (search?.name.toLowerCase() === "visual art") || (search?.name.toLowerCase() === "visual art") || (search?.name.toLowerCase() === "music") || (search?.name.toLowerCase() === "theater") || (search?.name.toLowerCase() === "dance") ? (
    //       <Paper className={`${classes.root} common-table`} id='singleStudent'>
    //         <TableContainer
    //           className={`table table-shadow view_users_table ${classes.container}`}
    //         >
    //           <Table stickyHeader aria-label='sticky table'>
    //             <TableHead className={`${classes.columnHeader} table-header-row`}>
    //               <TableRow>
    //                 <TableCell className={classes.tableCell} style={{ maxWidth: '1px' }}>
    //                   S No.
    //                 </TableCell>
    //                 <TableCell className={classes.tableCell}>Activity Type Name </TableCell>
    //                 <TableCell className={classes.tableCell}>Question</TableCell>
    //                 <TableCell className={classes.tableCell}>Options</TableCell>
    //                 <TableCell className={classes.tableCell}>Score</TableCell>
    //               </TableRow>
    //             </TableHead>

    //             {activityCategory && activityCategory
    //               ?.filter((response) =>
    //                 response?.name?.toLowerCase()?.includes(search?.name?.toLowerCase()))
    //               .map((response, index) => (
    //                 <>
    //                 <TableBody>
    //                   <TableRow
    //                     hover
    //                     role='checkbox'
    //                     tabIndex={-1}
    //                   >
    //                     <TableCell className={classes.tableCells}>{index + 1}</TableCell>
    //                     <TableCell className={classes.tableCells}>{response?.name}</TableCell>
    //                     <TableCell className={classes.tableCells}>{response?.question.map((item) => <p> {item} </p>)} </TableCell>
    //                     <TableCell className={classes.tableCells}>
    //                       {response?.va_rating[0].map((item) =><p>{item?.name}</p> )}
    //                     </TableCell>{' '}
    //                     <TableCell className={classes.tableCells}>
    //                     {response?.va_rating[0].map((item) =><p>{item?.score}</p> )}
    //                     </TableCell>
    //                   </TableRow>
    //                 </TableBody>
    //                 </>
    //               ))}
    //           </Table>
    //         </TableContainer>
    //       </Paper>

    //     ) : (
    //       <Paper className={`${classes.root} common-table`} id='singleStudent'>
    //         <TableContainer
    //           className={`table table-shadow view_users_table ${classes.container}`}
    //         >
    //           <Table stickyHeader aria-label='sticky table'>
    //             <TableHead className={`${classes.columnHeader} table-header-row`}>
    //               <TableRow>
    //                 <TableCell className={classes.tableCell} style={{ maxWidth: '1px' }}>
    //                   S No.
    //                 </TableCell>
    //                 <TableCell className={classes.tableCell}>Activity Type Name </TableCell>
    //                 <TableCell className={classes.tableCell}>Sub-Type Activity</TableCell>
    //                 <TableCell className={classes.tableCell}>Criteria Name</TableCell>

    //                 <TableCell className={classes.tableCell}>Rating </TableCell>
    //                 {search?.name == "Physical Activity" ? (
    //                   ""
    //                 ) : (
    //                   <TableCell className={classes.tableCell}>Score </TableCell>
    //                 )}
    //               </TableRow>
    //             </TableHead>
    //             {activityCategory
    //               ?.filter((response) =>
    //                 response?.name?.toLowerCase()?.includes(search?.name?.toLowerCase())
    //               )
    //               .map((response, index) => (
    //                 <TableBody>
    //                   <TableRow
    //                     hover
    //                     role='checkbox'
    //                     tabIndex={-1}
    //                   >
    //                     <TableCell className={classes.tableCells}>{index + 1}</TableCell>
    //                     <TableCell className={classes.tableCells}>{response.name}</TableCell>
    //                     <TableCell className={classes.tableCells}>{response.sub_type ? response.sub_type : <b style={{ color: 'red' }}>NA</b>}</TableCell>
    //                     <TableCell className={classes.tableCells}>
    //                       {response?.grading_scheme.map((obj) => (
    //                         <div>{obj.name}</div>
    //                       ))}
    //                     </TableCell>{' '}
    //                     <TableCell className={classes.tableCells}>
    //                       <Typography>
    //                         {response?.grading_scheme.map((obj) => (
    //                           <div>{obj.rating}</div>
    //                         ))}
    //                       </Typography>
    //                     </TableCell>
    //                   </TableRow>
    //                 </TableBody>
    //               ))}
    //           </Table>
    //         </TableContainer>
    //       </Paper>

    //     )}

    //     <Dialog
    //       open={viewing}
    //       maxWidth={maxWidth}
    //       onClose={handleClose}
    //       aria-labelledby='alert-dialog-title'
    //       aria-describedby='alert-dialog-description'
    //     >
    //       <div
    //         style={{
    //           marginLeft: '37px',
    //           marginTop: '13px',
    //           marginBottom: '12px',
    //           marginRight: '28px',
    //         }}
    //       >
    //         <div style={{ fontSize: '28px', fontWeight: 'bold', width: '46vw' }}>Create Rating</div>
    //         <Divider />
    //         <div style={{ marginTop: '8px' }}>
    //           <Autocomplete
    //             size='small'
    //             style={{ width: '45%' }}
    //             onChange={(e, value) => setActivityType(value)}
    //             className='dropdownIcon'
    //             value={ActivityType}
    //             options={activityCategory || []}
    //             getOptionLabel={(option) => option?.name || ''}
    //             renderInput={(params) => (
    //               <TextField
    //                 {...params}
    //                 variant='outlined'
    //                 label='Activity Type'
    //                 placeholder='Activity Type'
    //                 required
    //               />
    //             )}
    //           />

    //         </div>

    //         {ActivityType?.name == "Physical Activity" ? (
    //           <div style={{ width: '73vh', fontWeight: 400, marginTop: '10px', paddingLeft: '10px' }}>
    //             Sub-Activity Type :<b style={{ color: 'blue' }}> {ActivityType?.sub_type} </b>
    //           </div>
    //         ) : ""}
    //         {(ActivityType?.name.toLowerCase() === "visual art") || (ActivityType?.name.toLowerCase() === "music") || (ActivityType?.name.toLowerCase() === "dance") || (ActivityType?.name.toLowerCase() === "theater") ? (
    //           <div className='row m-2' style={{width:'650px'}}>
    //             <AntDivider orientation="left" plain style={{alignItems:'flex-start'}}>
    //               Add Questions
    //             </AntDivider>
    //             {visualInputlList ? visualInputlList.map((input, index) => (
    //               <>
    //                 <div className='col-10 question-visual'
    //                 >
    //                   <Input
    //                     placeholder='Question'
    //                     width={100}
    //                     value={input?.name}
    //                     onChange={(event) => handleQuestion(event, index)}
    //                   />
    //                 </div>
    //                 <div className='col-2 delete-visual-icon'>
    //                   <DeleteFilled onClick={() => handleRemoveVisualQuestion(input, index)} style={{ cursor: 'pointer', fontSize: '18px', color: 'darkblue' }} />
    //                 </div>

    //               </>
    //             )) : (
    //               "No Item In The List"
    //             )}

    //             <div className='col-12 padding-style'

    //             >
    //               <Button type="primary" icon={<PlusOutlined />} onClick={handleVisualInputApp} >Add Question</Button>
    //             </div>
    //             <AntDivider orientation="left" plain style={{alignItems:'flex-start'}}>
    //               Add Options
    //             </AntDivider>
    //             {optionList ? optionList.map((input, index) => (
    //               <div className='row'>
    //                 <div className='col-6' style={{ padding: '0.5rem 0rem' }}>
    //                   <Input
    //                     value={input?.name}
    //                     placeholder='Option'
    //                     width={100}
    //                     onChange={(event) => handleOptionInput(event, index)}
    //                   />
    //                 </div>
    //                 <div className='col-3' style={{ padding: '0.5rem 0.5rem' }}>
    //                   <Input
    //                     placeholder='Marks'
    //                     value={input?.score}
    //                     width={100}
    //                     onChange={(event) => handleMarksInput(event, index)}
    //                   />
    //                 </div>
    //                 <div className='col-3 delete-visual-icon'>
    //                   <DeleteFilled style={{ cursor: 'pointer', fontSize: '18px', color: 'darkblue' }} onClick={() => handleOptionDelete(input, index)} />
    //                 </div>
    //               </div>

    //             )) : (
    //               "No Option In The List"
    //             )}
    //             <div className='col-12' style={{ padding: '0.5rem 0rem' }}>
    //               <Button
    //                 icon={<PlusOutlined />}
    //                 onClick={handleOptionInputAdd}
    //                 type="primary"
    //               >
    //                 Add Option
    //               </Button>
    //             </div>
    //             <div className='col-12 padding-style'
    //             >
    //               <Button type="primary" onClick={handleOptionSubmit}>
    //                 Submit
    //               </Button>
    //               <Button type="danger" onClick={handleClose} style={{ marginLeft: '0.5rem' }}>
    //                 Cancel
    //               </Button>

    //             </div>
    //           </div>
    //         ) : (
    //           <>
    //             {inputList
    //               ? inputList.map((input, index) => (
    //                 <>
    //                   <div style={{ marginTop: '1rem', display: 'flex' }}>
    //                     <TextField
    //                       label='Criteria Name'
    //                       size='small'
    //                       type='text'
    //                       onChange={(event) => handleInputCreativity(event, index)}
    //                       variant='outlined'
    //                     />
    //                     &nbsp;&nbsp;&nbsp;
    //                     {showPhy ? (
    //                       ""
    //                     ) : (
    //                       <>
    //                         <TextField
    //                           label='Rating'
    //                           size='small'
    //                           type='number'
    //                           onChange={(event) => handleInputRating(event, index)}
    //                           variant='outlined'
    //                         />
    //                         &nbsp;&nbsp;&nbsp;
    //                         <TextField
    //                           label='Score'
    //                           size='small'
    //                           type='number'
    //                           onChange={(event) => handleInputChange1(event, index)}
    //                           variant='outlined'
    //                         />
    //                       </>
    //                     )}
    //                     <Button
    //                       style={{ marginLeft: '12px' }}
    //                       color='primary'
    //                       variant='contained'
    //                       onClick={() => handleRemoveItem(index)}
    //                     >
    //                       Delete
    //                     </Button>
    //                   </div>
    //                 </>
    //               ))
    //               : 'No item in the list '}
    //             &nbsp;&nbsp;&nbsp;
    //             <Button
    //               onClick={handleListAdd}
    //               disabled={isDisabled}
    //               style={{ marginTop: '1rem' }}
    //               variant='contained'
    //               color='primary'

    //             >
    //               Add
    //             </Button>
    //             &nbsp;&nbsp;
    //             <Button
    //               variant='contained'
    //               size='small'
    //               color='primary'
    //               onClick={handleActivityTypeSubmit}
    //               style={{ marginTop: '1rem' }}
    //             >
    //               Submit
    //             </Button>
    //           </>

    //         )}
    //       </div>

    //     </Dialog>

    // <AntDrawer
    //   title={`Add Parameters`}
    //   zIndex={1300}
    //   placement="right"
    //   width={window.innerWidth < 768 ? '90vw' : '450px'}
    //   onClose={onCloseAnt}
    //   visible={antDrawer}
    //   open={antDrawer}
    // >

    //   <div className='action-filed'>
    //     {visualInputlList ? visualInputlList.map((input, index) => (
    //       <>
    //         <div className='row' style={{ marginTop: '1rem', display: 'flex' }}>
    //           <div className='col-6'>

    //           </div>
    //           <div className='col-4'>
    //             <Select
    //               className='th-grey th-bg-grey th-br-4 th-select w-100 text-left'
    //               bordered={true}
    //               getPopupContainer={(trigger) => trigger.parentNode}
    //               placement='bottomRight'
    //               placeholder='Select Option'
    //               suffixIcon={<DownOutlined className='th-black-1' />}
    //               dropdownMatchSelectWidth={false}
    //               onChange={(e, val) => handleVisualChange(e, val)}
    //               allowClear

    //               menuItemSelectedIcon={<CheckOutlined className='th-primary' />}
    //             >
    //               {visulaOptions}

    //             </Select>
    //           </div>
    //           <div className='col-2'>
    //             <DeleteFilled onClick={() => handleRemoveVisual(index)} style={{ cursor: 'pointer' }} />
    //           </div>

    //         </div>
    //       </>
    //     )) : "No Item In The List"}
    //     <div style={{ padding: '0.5rem 0rem' }}>
    //       <Button type="primary" onClick={handleVisualInputApp} >Add</Button>

    //     </div>
    //     <div style={{ padding: '0.5rem 0rem', display: 'flex', alignItem: 'center', justifyContent: 'end' }}>
    //       <Button type="primary">Submit</Button>
    //     </div>

    //   </div>
    // </AntDrawer>
    // <AntDrawer
    //   title={`Options`}
    //   zIndex={1300}
    //   placement="right"
    //   width={window.innerWidth < 768 ? '90vw' : '450px'}
    //   // size='default'
    //   onClose={onCloseAnt}
    //   visible={onOptionVisible}
    //   open={onOptionVisible}
    //   extra={
    //     <Space>
    //       <Button
    //         icon={<PlusOutlined />}
    //         onClick={onOptionModalFun}
    //       >Add Options</Button>
    //     </Space>
    //   }
    // >

    //   <div className='action-filed'>
    //     {visualInputlList ? visualInputlList.map((input, index) => (
    //       <>
    //         <div className='row' style={{ marginTop: '1rem', display: 'flex' }}>
    //           <div className='col-6'>

    //           </div>
    //           <div className='col-4'>
    //             <Select
    //               className='th-grey th-bg-grey th-br-4 th-select w-100 text-left'
    //               bordered={true}
    //               getPopupContainer={(trigger) => trigger.parentNode}
    //               placement='bottomRight'
    //               placeholder='Select Option'
    //               suffixIcon={<DownOutlined className='th-black-1' />}
    //               dropdownMatchSelectWidth={false}
    //               onChange={(e, val) => handleVisualChange(e, val)}
    //               allowClear

    //               menuItemSelectedIcon={<CheckOutlined className='th-primary' />}
    //             >
    //               {visulaOptions}

    //             </Select>
    //           </div>
    //           <div className='col-2'>
    //             <DeleteFilled onClick={() => handleRemoveVisual(index)} style={{ cursor: 'pointer' }} />
    //           </div>

    //         </div>
    //       </>
    //     )) : "No Item In The List"}
    //     <div style={{ padding: '0.5rem 0rem' }}>
    //       <Button type="primary" onClick={handleVisualInputApp} >Add</Button>

    //     </div>
    //     <div style={{ padding: '0.5rem 0rem', display: 'flex', alignItem: 'center', justifyContent: 'end' }}>
    //       <Button type="primary">Submit</Button>
    //     </div>

    //   </div>
    // </AntDrawer>
    // <AntModal
    //   title="Add Options"
    //   centered
    //   open={onOptionModal}
    //   visible={onOptionModal}
    //   onCancel={() => setOnOptionModal(false)}
    // >
    //   <div style={{ border: '1px solid black', margin: '0.5rem 0rem' }}>
    //     <div className='col-10' style={{ padding: '0.5rem 0rem' }}>
    //       <Input
    //         placeholder='Question'
    //         width={100}
    //       />
    //     </div>
    //     <div className='col-2'>
    //     </div>
    //     {optionList ? optionList.map((input, index) => (
    //       <div className='row'>

    //         <div className='col-6' style={{ padding: '0.5rem 0rem' }} >
    //           <Input
    //             placeholder='Option'
    //             width={100}
    //             onChange={(event) => handleOptionInput(event, index)}
    //           />
    //         </div>
    //         <div className='col-6' style={{ padding: '0.5rem 0rem' }}>
    //           <Input
    //             placeholder='Marks'
    //             width={100}
    //             onChange={(event) => handleMarksInput(event, index)}
    //           />
    //         </div>
    //       </div>
    //     )) : "No Item In The List"}
    //     <div className='col-12' style={{ padding: '0.5rem 0rem' }}>
    //       <Button
    //         icon={<PlusOutlined />}
    //         onClick={handleOptionInputAdd}
    //       >
    //         Add Button
    //       </Button>
    //     </div>
    //     <div className='col-12'
    //     >
    //       <Button onClick={handleOptionSubmit}>
    //         Submit
    //       </Button>

    //     </div>

    //   </div>
    // </AntModal>

    //   </Layout>
    // </div>
  );
};
export default RatingCreate;
