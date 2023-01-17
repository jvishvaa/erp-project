import React, { useEffect, useState, useContext, createRef } from 'react';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import Loader from '../../components/loader/loader';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import { Breadcrumb, Checkbox, Select, Input, Button, message, Form, Spin, DatePicker } from 'antd';

import { IconButton } from '@material-ui/core';
import DateRangeIcon from '@material-ui/icons/DateRange';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import Layout from 'containers/Layout';
import Divider from '@material-ui/core/Divider';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import '../Calendar/Styles.css';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import './AttendanceCalender.scss';
import { DownOutlined, CheckOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1rem',
    borderRadius: '10px',
    width: '100%',

    margin: '1.5rem -0.1rem',
  },
  bord: {
    margin: theme.spacing(1),
    border: 'solid lightgrey',
    borderRadius: 10,
  },
  button: {
    display: 'flex',
    justifyContent: 'space-evenly',
    // width: '20%',
  },
}));


const EventsMark = () => {
  const [flag, setFlag] = useState(false);
  const [evnetcategoryType, setEventcategoryType] = useState([]);
  const [selectedSession, setSelectedSession] = useState([]);
  const [dateRangeTechPer, setDateRangeTechPer] = useState([
    moment().subtract(6, 'days'),
    moment(),
  ]);
  const formRef = createRef();

  const [holidayName, setHolidayName] = useState('');
  const [holidayDesc, setHolidayDesc] = useState('');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [loading, setLoading] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const history = useHistory();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const classes = useStyles();
  const [academicYear, setAcademicYear] = useState([]);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [dates, setDates] = useState(null);
  const [ category , setCategory ] = useState([])
  const [ selectedCategory ,  setSelectedCategory ] = useState()
  const handleChangeHoliday = (event) => {
    setHolidayName(event.target.value);
  };
  const handleChangeHolidayDesc = (event) => {
    setHolidayDesc(event.target.value);
  };

  const handleSubmit = (e) => {
    console.log(e);
    e.preventDefault();
    const [startDateTechPer, endDateTechPer] = dateRangeTechPer;
    let branches = branchList.filter(item => selectedBranch.includes(item?.branch?.id))
    console.log(branches);

    if (!selectedAcademicYear) {
      setAlert('warning', 'Select Academic Year');
      return;
    }
    if (!holidayName) {
      setAlert('warning', 'Enter Holiday Name');
      return;
    }
    if (!holidayDesc) {
      setAlert('warning', 'Enter Holiday Description');
      return;
    }
    if (selectedBranch.length == 0) {
      setAlert('warning', 'Select Branch');
      return;
    }
    if (selectedGrade.length == 0) {
      setAlert('warning', 'Select Grade');
      return;
    }
    if (isEdit) {
      axiosInstance
        .patch(`${endpoints.academics.getEvents}?id=${history?.location?.state?.data?.id}`, {
          event_name: holidayName,
          description: holidayDesc,
          start_date: moment(startDate).format('YYYY-MM-DD'),
          end_date: moment(endDate).format('YYYY-MM-DD'),
          is_full_day: false,
          grade_ids: selectedGrade,
          // academic_year: selectedAcademicYear?.id,
          // branch_ids: selectedBranch.map((el) => el?.id),
          acad_session: branches.map((el) => el?.id),
          start_time: "00:01",
          end_time: "23:59",
          event_category: selectedCategory
        })
        .then((result) => {
          setAlert('success', result.data.message);
          handleBackButtonClick();
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', 'something went wrong');
        });
    } else {
      axiosInstance
        .post(endpoints.academics.getEvents, {
          event_name: holidayName,
          description: holidayDesc,
          start_date: startDate,
          end_date: endDate,
          is_full_day: false,
          grade_ids: selectedGrade,
          // academic_year: selectedAcademicYear?.id,
          acad_session: branches.map((el) => el?.id),
          // branch_ids: selectedBranch.map((el) => el?.id),
          start_time: "00:01",
          end_time: "23:59",
          event_category: selectedCategory
        })

        .then((result) => {
          setAlert('success', result.data.message);
          handleBackButtonClick();
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', 'something went wrong');
        });
    }
  };
  const handleBackButtonClick = (e) => {
    
    history.push({
      pathname: '/attendance-calendar/teacher-view',
      state: {
        payload: history?.location?.state?.payload,
        backButtonStatus: true,
      },
    });
  };



  function callApi(api, key) {
    setLoading(true);
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'academicYearList') {
            const defaultValue = result?.data?.data?.[0];
            handleAcademicYear({}, defaultValue);
            setAcademicYear(result?.data?.data || []);
          }
          if (key === 'branchList') {

            setBranchList(result?.data?.data?.results)
          }
          if (key === 'gradeList') {

            setGradeList(result?.data?.data);
          }
          if (key === 'section') {
            setSectionList(result.data.data);
          }
          setLoading(false);
        } else {
          setAlert('error', result.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
        setLoading(false);
      });
  }
  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Calendar' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Teacher Calendar') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, [window.location.pathname]);

  const handleGetEvents = () => {
    axiosInstance
      .get(
        `${endpoints.eventBat.getListCategories}?module_id=${moduleId}`
      )
      .then((res) => {
        console.log(res);
        setCategory(res?.data?.data)
      })
      .catch((error) => {
      message.error('Failed To Fetch Categories')
      });
  };



  useEffect(() => {
    callApi(
      `${endpoints.communication.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`,
      'branchList'
    );

    axiosInstance.get(endpoints.CreateEvent.getEventCategory).then((res) => {
      setEventcategoryType(res?.data);
    });
    handleGetEvents()
  }, [moduleId]);

  useEffect(() => {
    if (history?.location?.state?.data) {
      setIsEdit(true);
      setHolidayDesc(history?.location?.state?.data?.description);
      setHolidayName(history?.location?.state?.data?.event_name);

      let branches = branchList?.filter(item => history.location?.state?.data?.acad_session.includes(item?.id))
      console.log(branches, 'branches');
      let setBranchVal = branches?.map(item => item?.branch?.id)

      formRef.current.setFieldsValue({
        holiday_name: history?.location?.state?.data?.event_name,
        holiday_desc: history?.location?.state?.data?.description,
        branch: setBranchVal,
        date: [moment(history?.location?.state?.data?.start_time), moment(history?.location?.state?.data?.end_time)],
        category: history?.location?.state?.data?.event_category_name
      });
      setSelectedBranch(setBranchVal)
      setSelectedCategory(history?.location?.state?.data?.event_category)
      getGrades(setBranchVal)
    }
    if (history?.location?.state?.data?.start_time) {
      setDates([moment(history?.location?.state?.data?.start_time), moment(history?.location?.state?.data?.end_time)])
      setStartDate(moment(history?.location?.state?.data?.start_time))
      setEndDate(moment(history?.location?.state?.data?.end_time))
    }
  }, [branchList]);

  // useEffect(() => {
  //   if (flag == false) {
  //     if (isEdit && branchList.length > 0) {
  //       const ids = history?.location?.state?.data?.grade.map((el, index) => el);
  //       let filterGrade = gradeList.filter((item) => ids.indexOf(item.grade_id) !== -1);
  //       setSelectedGrade(filterGrade);
  //     }
  //   }
  // }, [gradeList])

  const isEdited = history?.location?.state?.isEdit;

  useEffect(() => {
    if (isEdited && selectedBranch) {
      // gradeEdit();
    }
  }, [isEdited, selectedBranch]);

  // const gradeEdit = () => {

  //   if (moduleId) {
  //     callApi(
  //       `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${}&module_id=${moduleId}`,
  //       'gradeList'
  //     );
  //   }
  //   const gradeId = history?.location?.state?.gradeId;
  //   let filterGrade = gradeList.filter((item) => gradeId.indexOf(item.id) !== -1);
  // };

  useEffect(() => {
    if (history?.location?.state?.data?.grades?.length) {
      const ids = history?.location?.state?.data?.grades.map((el, index) => el);
      let filterBranch = gradeList.filter((item) => ids.indexOf(item.grade_id) !== -1);
      setSelectedGrade(filterBranch);
      formRef.current.setFieldsValue({
        grade: ids
      });
      setSelectedGrade(ids)
    }
  }, [gradeList]);

  const onunHandleClearAll = (e) => {
    setSelectedBranch();
    setSelectedGrade();
    setHolidayName('');
    setHolidayDesc('');
    setDateRangeTechPer([moment().subtract(6, 'days'), moment()]);
  };
  const handleAcademicYear = (event, value) => {
    if (value) {
      callApi(
        `${endpoints.communication.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`,
        'branchList'
      );
    }
    setSelectedGrade([]);
    setSectionList([]);
    setSelectedSection([]);
    setSelectedBranch([]);
  };

  const handleSelectBranch = (value, arr, acad) => {
    console.log(value, arr, acad, formRef.current, 'value arr');
    if (value == 'all' && selectedBranch?.length == 0) {
      formRef.current.setFieldsValue({
        branch: arr,
      });
      setSelectedBranch(arr);
      setSelectedSession(acad)
      getGrades(arr)
    } else if (value == 'all' && selectedBranch?.length > 0) {
      formRef.current.setFieldsValue({
        branch: [],
      });
      setSelectedBranch([]);
      setSelectedSession([])
    }
    else {
      if (!selectedBranch.includes(value)) {
        setSelectedBranch([...selectedBranch, Number(value)]);
        getGrades([...selectedBranch, Number(value)])
      }
      if (selectedBranch.includes(value)) {
        let arrayy = selectedBranch.filter(item => item !== value)
        setSelectedBranch(arrayy);
        getGrades(arrayy)
      }

    }

  };

  const getGrades = (branch) => {
    console.log(branch, 'branchhhhgreade');
    if (branch && moduleId) {
      callApi(
        `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id
        }&branch_id=${branch.toString()}&module_id=${moduleId}`,
        'gradeList'
      );
    }

  }
  const handleDeSelectBranch = (each) => {
    console.log(each);
    formRef.current.setFieldsValue({
      section: [],
      grade: []
    });
    const index = selectedBranch.indexOf(each?.value);
    const newBranchList = selectedBranch.slice();
    newBranchList.splice(index, 1);
    setSelectedBranch(newBranchList);
    console.log(newBranchList);
    getGrades(newBranchList)
  };

  const handleSelectGrade = (value, arr) => {
    console.log(value, arr, 'value arr');
    if (value == 'all') {
      formRef.current.setFieldsValue({
        grade: arr,
      });
      setSelectedGrade(arr);
    } else {
      if (!selectedGrade.includes(value)) {
        setSelectedGrade([...selectedGrade, Number(value)]);
      }
    }
  };
  const handleDeSelectGrade = (each) => {

    const index = selectedGrade.indexOf(each?.value);
    const newGradeList = selectedGrade.slice();
    newGradeList.splice(index, 1);
    setSelectedGrade(newGradeList);
  };

  const branchOptions = branchList?.map((each) => {
    return (
      <Option key={each?.id} value={each?.branch?.id}>
        {each?.branch?.branch_name}
      </Option>
    );
  });

  const gradeOptions = gradeList?.map((each) => {
    return (
      <Option key={each?.grade_id} value={each?.grade_id}>
        {each?.grade__grade_name}
      </Option>
    );
  });

  const categoryOptions = category?.map((each) => {
    return (
        <Option key={each?.id} value={each?.id}>
           {each?.event_category_name}
        </Option>
    );
});

  const handleDate = (value) => {
    console.log(value);
    if (value) {
      setStartDate(moment(value[0]).format('YYYY-MM-DD'))
      setEndDate(moment(value[1]).format('YYYY-MM-DD'))
      setDates([moment(value[0]), moment(value[1])])
    }
  }

  const handleDescription = (e) => {
    console.log(e.target.value);
    setHolidayDesc(e.target.value)
  }

  const handleCategory = (e) => {
    setSelectedCategory(e)
    console.log(e);
  }

  return (
    <>
      <Layout>
        <div className='col-md-12'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/dashboard' className='th-grey'>
              Calendar
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1'>
              Add Events
            </Breadcrumb.Item>
          </Breadcrumb>
          {/* <CommonBreadcrumbs componentName='Add Holiday' isAcademicYearVisible={true} /> */}
        </div>

        <Form ref={formRef}>
          <Grid container direction='row' spacing={2} className={classes.root}>

            <div className='col-md-4'>
              <span className='th-grey th-14'>Branch*</span>
              <Form.Item name='branch'>
                <Select
                  mode='multiple'
                  getPopupContainer={(trigger) => trigger.parentNode}
                  className='th-grey th-bg-grey th-br-4 w-100 text-left mt-1'
                  placement='bottomRight'
                  placeholder="Select Branch"
                  showArrow={true}
                  allowClear
                  suffixIcon={<DownOutlined className='th-grey' />}
                  maxTagCount={2}
                  value={selectedBranch}
                  dropdownMatchSelectWidth={false}
                  onSelect={(e) => {
                    handleSelectBranch(
                      e,
                      branchList?.map((item) => item.branch?.id),
                      branchList?.map((item) => item?.id),
                    );
                  }}
                  onDeselect={(e, value) => {
                    handleDeSelectBranch(value);
                  }}
                  filterOption={(input, options) => {
                    return (
                      options.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                >
                  {branchList?.length > 0 && (
                    <>
                      <Option key={0} value={'all'}>
                        All
                      </Option>
                    </>
                  )}
                  {branchOptions}
                </Select>
              </Form.Item>
            </div>
            <div className='col-md-4'>
              <span className='th-grey th-14'>Grades*</span>
              <Form.Item name='grade'>
                <Select
                  mode='multiple'
                  getPopupContainer={(trigger) => trigger.parentNode}
                  className='th-grey th-bg-grey th-br-4 w-100 text-left mt-1'
                  placement='bottomRight'
                  placeholder="Select Grade"
                  showArrow={true}
                  allowClear
                  suffixIcon={<DownOutlined className='th-grey' />}
                  maxTagCount={2}
                  dropdownMatchSelectWidth={false}
                  onSelect={(e) => {
                    handleSelectGrade(
                      e,
                      gradeList?.map((item) => item.grade_id)
                    );
                  }}
                  onDeselect={(e, value) => {
                    handleDeSelectGrade(value);
                  }}
                  filterOption={(input, options) => {
                    return (
                      options.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                >
                  {gradeList.length > 1 && (
                    <>
                      <Option key={0} value={'all'}>
                        All
                      </Option>
                    </>
                  )}
                  {gradeOptions}
                </Select>
              </Form.Item>
            </div>

            <div className='col-md-4'>
              <span className='th-grey th-14'>Select Date Range*</span>
              <Form.Item name='date'>
                <RangePicker
                  value={dates}
                  onChange={handleDate}
                />
              </Form.Item>
            </div>

            <div className='col-md-4'>
              <span className='th-grey th-14'>Category*</span>
              <Form.Item name='category'>
                <Select
                  allowClear
                  placeholder='Select Category'
                  showSearch
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={(e) => {
                    handleCategory(e);
                  }}
                  // onClear={handleClearGrade}
                  className='w-100 text-left th-black-1 th-bg-white th-br-4'
                >
                  {categoryOptions}
                </Select>
              </Form.Item>
            </div>

            <div className='col-md-4'>
              <span className='th-grey th-14'>Event Name*</span>
              <Form.Item name='holiday_name'>
                <Input placeholder="Select Holiday Name" onChange={handleChangeHoliday} />
              </Form.Item>
            </div>

          </Grid>
          <Grid container direction='row' spacing={2} className={classes.root}>
            <div className='col-md-6'>
              <span className='th-grey th-14'>Event Description*</span>
              <Form.Item name='holiday_desc'>
                <TextArea showCount maxLength={1000} value={holidayDesc} onChange={handleDescription} style={{ height: '200px' }} />
              </Form.Item>
            </div>
          </Grid>
          <Grid container direction='row'>
            <Grid item md={12} xs={12} style={{ marginLeft: '26px', width: '96%' }}>
              <Divider />
            </Grid>
          </Grid>




          <Grid container direction='row' className={classes.root}>
            <div className={classes.button}>
              <Button variant='contained' onClick={onunHandleClearAll} style={{ margin: '5px' }}>
                Clear All
              </Button>
              <Button
                style={{ margin: '5px' }}
                variant='contained'
                color='primary'
                onClick={handleBackButtonClick}
              >
                Go Back
              </Button>
              <Button
                style={{ margin: '5px' }}
                variant='contained'
                type='submit'
                value='Submit'
                color='primary'
                onClick={handleSubmit}
              >
                Save Event
              </Button>
            </div>
          </Grid>
        </Form>
        {loading && <Loader />}
      </Layout>
    </>
  );
};

export default EventsMark;
