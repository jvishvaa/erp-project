import React, { useState, useEffect, useRef, createRef } from 'react';
import Layout from 'v2/Layout';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './index.css';
import { Select, Form, message } from 'antd';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import moment from 'moment';
const { Option } = Select;

const CalendarView = () => {
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const formRef = createRef();
  const branchList = useSelector((state) => state.commonFilterReducer?.branchList);
  const userLevel = JSON.parse(localStorage.getItem('userDetails'))?.user_level;
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [calendarViewMode, setCalendarViewMode] = useState('dayGridMonth');
  const calendarRef = useRef();
  const [moduleId, setModuleId] = useState('');
  const [gradeData, setGradeData] = useState([]);
  const [branchId, setBranchId] = useState();
  const [gradeIds, setGradeIds] = useState('');
  const [sectionData, setSectionData] = useState([]);
  const [sectionIds, setSectionIds] = useState('');
  const [subjectData, setSubjectData] = useState([]);
  const [subjectIds, setSubjectIds] = useState('');
  const [monthlyData, setMonthlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterOn, setFilterOn] = useState(false);

  const getColorType = (type) => {
    switch (type) {
      case 'Holiday':
        return '#20c51c';
      case 'Lecture':
        return '#343434';
      case 'Examination':
        return '#FF9922';
      case 'Period':
        return '#343434';
      case 'Competetion':
        return '#EF1973';
      default:
        return '#B770DB';
    }
  };
  const dailyDummyData = [
    {
      start: '2022-07-12T10:07:25',
      end: '2022-07-12T10:09:25',
      info: {
        id: 491,
        name: 'Bio sub 3',
        type_id: 3,
        type_name: 'Lecture',
      },
    },
    {
      start: '2022-07-12T11:15:40',
      end: '2022-07-12T11:18:40',
      info: {
        id: 492,
        name: 'Bio sub 1',
        type_id: 3,
        type_name: 'Lecture',
      },
    },
  ];

  const weeklyDummyData = [
    {
      start: '2022-07-12T10:07:25',
      end: '2022-07-12T10:09:25',
      info: {
        id: 491,
        name: 'Bio sub 3',
        type_id: 3,
        type_name: 'Lecture',
      },
    },
    {
      start: '2022-07-13T10:15:40',
      end: '2022-07-13T10:18:40',
      info: {
        id: 492,
        name: 'Bio sub 1',
        type_id: 3,
        type_name: 'Lecture',
      },
    },
  ];

  const monthlyDummyData = [
    {
      date: '2022-07-28',
      total_periods: 1,
    },
    {
      date: '2022-07-07',
      total_holidays: 1,
    },
    {
      date: '2022-07-07',
      total: 2,
    },
    {
      date: '2022-07-07',
      total_periods: 4,
    },
    {
      date: '2022-07-08',
      total_periods: 5,
    },
    {
      date: '2022-07-09',
      total_periods: 2,
    },
  ];

  let events = [];

  if (calendarViewMode === 'dayGridMonth') {
    let count = 0;
    let type = '';
    if (filterOn) {
      events = monthlyData.map((item) => {
        if (item?.total_periods) {
          count = item?.total_periods;
          type = 'Period';
        }
        if (item?.total_holidays) {
          count = item?.total_holidays;
          type = 'Holiday';
        }
        return {
          title: count > 0 ? count : '',
          date: item?.date,
          color: getColorType(type),
        };
      });
    } else {
      events = monthlyDummyData.map((item) => {
        if (item?.total_periods) {
          count = item?.total_periods;
          type = 'Period';
        }
        if (item?.total_holidays) {
          count = item?.total_holidays;
          type = 'Holiday';
        }
        return {
          title: count > 0 ? count : '',
          date: item?.date,
          color: getColorType(type),
        };
      });
    }
  } else if (calendarViewMode === 'timeGridWeek') {
    if (filterOn) {
      events = weeklyData.map((item) => {
        return {
          title: item?.gradewise_holidays[0]?.holiday_name,
          start: item?.date,
          end: item.date,
          color: getColorType(item?.type?.name),
        };
      });
    } else {
      events = weeklyDummyData?.map((item) => {
        return {
          title: item?.info?.name,
          start: item?.start,
          end: item?.end,
          color: getColorType(item?.info?.type),
        };
      });
    }
  } else {
    if (filterOn) {
      events = dailyData.map((item) => {
        return {
          title: item?.gradewise_holidays[0]?.holiday_name,
          start: item?.date,
          end: item.date,
          color: getColorType(item?.type?.name),
        };
      });
    } else {
      events = dailyDummyData?.map((item) => {
        return {
          title: item?.info?.name,
          start: item?.start,
          end: item?.end,
          color: getColorType(item?.info?.type),
        };
      });
    }
  }

  const fetchMonthlyData = () => {
    let params = {};
    if (!filterOn) {
      params = {
        start_date: startDate,
        end_date: endDate,
        branch: selectedBranch?.branch?.id,
        session_year: selectedAcademicYear?.id,
      };
    } else {
      params = {
        start_date: startDate,
        end_date: endDate,
        subject_mapping: subjectIds,
        grade: gradeIds,
        acad_session: selectedBranch?.id,
      };
    }
    axios
      .get(`${endpoints.acadCalendar.monthly}`, {
        params,
      })
      .then((res) => {
        if (res?.data?.status_code == 200) {
          setMonthlyData(res?.data?.result);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const fetchWeeklyData = () => {
    let params = {};
    if (!filterOn) {
      params = {
        start_date: startDate,
        end_date: endDate,
        branch: selectedBranch?.branch?.id,
        session_year: selectedAcademicYear?.id,
      };
    } else {
      params = {
        start_date: startDate,
        end_date: endDate,
        subject_mapping: subjectIds,
        grade: gradeIds,
        acad_session: selectedBranch?.id,
      };
    }
    axios
      .get(`${endpoints.acadCalendar.weekly}`, {
        params,
      })
      .then((res) => {
        if (res.data.status_code == 200) {
          setWeeklyData(res?.data?.result);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const fetchDailyData = () => {
    let params = {};
    if (!filterOn) {
      params = {
        start_date: startDate,
        end_date: endDate,
        branch: selectedBranch?.branch?.id,
        session_year: selectedAcademicYear?.id,
      };
    } else {
      params = {
        start_date: startDate,
        end_date: endDate,
        subject_mapping: subjectIds,
        grade: gradeIds,
        acad_session: selectedBranch?.id,
      };
    }
    axios
      .get(`${endpoints.acadCalendar.daily}`, {
        params,
      })
      .then((res) => {
        if (res.data.status_code === 200) {
          setDailyData(res?.data?.result);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const fetchGradeData = (params = {}) => {
    axios
      .get(`${endpoints.academics.grades}`, { params })
      .then((res) => {
        if (res.data.status_code === 200) {
          setGradeData(res.data.data);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const fetchSectionData = (params = {}) => {
    axios
      .get(`${endpoints.academics.sections}`, { params: { ...params } })
      .then((res) => {
        if (res.data.status_code === 200) {
          setSectionData(res.data.data);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const fetchSubjectData = (params = {}) => {
    axios
      .get(`${endpoints.academics.subjects}`, { params: { ...params } })
      .then((res) => {
        if (res.data.status_code === 200) {
          setSubjectData(res.data.data);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const handleBranch = (e) => {
    formRef.current.setFieldsValue({
      grade: [],
      section: [],
      subject: [],
    });
    setGradeData([]);
    setSectionData([]);
    setSubjectData([]);
    if (filterOn) {
      setFilterOn(false);
    }
    if (e) {
      setBranchId(e);
      fetchGradeData({
        session_year: selectedAcademicYear?.id,
        branch_id: e,
        module_id: moduleId,
      });
    }
  };

  const handleGrade = (e) => {
    formRef.current.setFieldsValue({
      section: [],
      subject: [],
    });

    setSectionData([]);
    setSubjectData([]);
    const grades = e.map((item) => item?.value).join(',');
    setGradeIds(grades);
    if (filterOn) {
      setFilterOn(false);
    }
    if (grades) {
      fetchSectionData({
        session_year: selectedAcademicYear?.id,
        branch_id: branchId,
        module_id: moduleId,
        grade_id: grades,
      });
    }
  };
  const handleSection = (e) => {
    formRef.current.setFieldsValue({
      subject: [],
    });

    setSubjectData([]);
    const sections = e.map((item) => item?.value).join(',');
    setSectionIds(sections);
    if (filterOn) {
      setFilterOn(false);
    }
    if (sections) {
      fetchSubjectData({
        session_year: selectedAcademicYear?.id,
        branch: branchId,
        module_id: moduleId,
        grade: gradeIds,
        section: sections,
      });
    }
  };
  const handleSubject = (e) => {
    const subjects = e.map((item) => item?.value).join(',');
    setSubjectIds(subjects);
    if (filterOn && !subjects) {
      setFilterOn(false);
    }
  };
  const handleClearBranch = () => {
    setGradeIds([]);
    setSectionIds([]);
    setSubjectIds([]);
    if (filterOn) {
      setFilterOn(false);
    }
  };
  const handleClearGrade = () => {
    setGradeIds([]);
    setSectionIds([]);
    setSubjectIds([]);
  };
  const handleClearSection = () => {
    setSectionIds([]);
    setSubjectIds([]);
  };

  const handleClearSubject = () => {
    setSubjectIds([]);
  };
  const handleClearFilters = () => {
    setFilterOn(false);
    formRef.current.setFieldsValue({
      branch: [],
      grade: [],
      section: [],
      subject: [],
    });
    setBranchId('');
    setGradeIds('');
    setSectionIds('');
    setSectionIds('');
    setGradeData([]);
    setSectionData([]);
    setSubjectData([]);
  };
  const branchOptions = branchList?.map((each) => {
    return (
      <Option key={each?.branch?.id} value={each?.branch?.id}>
        {each?.branch?.branch_name}
      </Option>
    );
  });
  const gradeOptions = gradeData?.map((each) => {
    return (
      <Option key={each?.id} value={each.grade_id}>
        {each?.grade__grade_name}
      </Option>
    );
  });
  const sectionOptions = sectionData?.map((each) => {
    return (
      <Option key={each?.id} value={each.section_id}>
        {each?.section__section_name}
      </Option>
    );
  });
  const subjectOptions = subjectData?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.subject__subject_name}
      </Option>
    );
  });

  useEffect(() => {
    calendarRef.current.getApi().changeView(calendarViewMode);
  }, [calendarViewMode]);

  useEffect(() => {
    if (startDate && endDate) {
      if (filterOn) {
        if (branchId && gradeIds && sectionIds && subjectIds) {
          if (calendarViewMode === 'dayGridMonth') {
            fetchMonthlyData();
          } else if (calendarViewMode === 'timeGridWeek') {
            fetchWeeklyData();
          } else {
            fetchDailyData();
          }
        }
      } else {
        if (calendarViewMode === 'dayGridMonth') {
          fetchMonthlyData();
        } else if (calendarViewMode === 'timeGridWeek') {
          fetchWeeklyData();
        } else {
          fetchDailyData();
        }
      }
    }
  }, [startDate, endDate, filterOn]);
  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Ebook' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Ebook View') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  return (
    <Layout>
      <div className='px-2'>
        <div className='row th-16 py-3 justify-content-between'>
          <div className='col-md-6 th-black-1 th-20 th-fw-400'>
            Good Morning, Super Admin
          </div>
          <div className='col-md-6 text-right'>
            <div className='row justify-content-md-end th-14 th-fw-400 px-2 pt-3 pt-md-0 th-black text-center'>
              <div
                className={`col-md-2 col-4 py-1 th-pointer px-md-1 ${
                  calendarViewMode === 'dayGridMonth' ? 'active' : ''
                }`}
                onClick={() => setCalendarViewMode('dayGridMonth')}
              >
                Monthly
              </div>
              <div
                className={`col-md-2 col-4 py-1 mx-md-1 th-pointer px-md-1 ${
                  calendarViewMode === 'timeGridWeek' ? 'active' : ''
                }`}
                onClick={() => setCalendarViewMode('timeGridWeek')}
              >
                Weekly
              </div>
              <div
                className={`col-md-2 col-4 py-1 th-pointer px-md-1 ${
                  calendarViewMode === 'timeGridDay' ? 'active' : ''
                }`}
                onClick={() => setCalendarViewMode('timeGridDay')}
              >
                Daily
              </div>
            </div>
          </div>
        </div>
        {userLevel !== 13 && (
          <div className='row th-16 py-3 px-2 th-bg-white shadown-sm th-br-5 mx-2'>
            <div className='row justify-content-between px-2 '>
              <div className='col-4 py-1'>Filters</div>
              <div className='col-4'>
                <div className='d-flex th-14 th-fw-400 justify-content-end'>
                  <div
                    className='mr-5 py-1 th-black-1 th-pointer'
                    onClick={handleClearFilters}
                  >
                    Clear
                  </div>
                  <div
                    className='th-primary th-br-10 th-bg-white py-1 px-3 th-pointer'
                    style={{ border: '1px solid #1b4ccb' }}
                    onClick={() => {
                      if (branchId && gradeIds && sectionIds && subjectIds) {
                        setFilterOn(true);
                      } else {
                        message.error('Select all fields');
                      }
                    }}
                  >
                    Apply
                  </div>
                </div>
              </div>
            </div>

            <div className='row pt-3'>
              <div className='col-12 pl-0'>
                <Form id='filterForm' ref={formRef} layout={'horizontal'}>
                  <div className='row align-items-center'>
                    <div className='col-md-3 col-6 '>
                      <Form.Item name='branch'>
                        <Select
                          placeholder='Select Branch'
                          showSearch
                          optionFilterProp='children'
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          onChange={(e) => {
                            handleBranch(e);
                          }}
                          onClear={handleClearBranch}
                          className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                          bordered={false}
                          allowClear
                        >
                          {branchOptions}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className='col-md-3 col-6 px-0'>
                      <Form.Item name='grade'>
                        <Select
                          allowClear
                          placeholder='Select Grade'
                          showSearch
                          mode='multiple'
                          maxTagCount={3}
                          optionFilterProp='children'
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          onChange={(e, value) => handleGrade(value)}
                          onClear={handleClearGrade}
                          className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                          bordered={false}
                        >
                          {gradeOptions}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className='col-md-3 col-6 pr-0'>
                      <Form.Item name='section'>
                        <Select
                          allowClear
                          placeholder='Select Section'
                          showSearch
                          mode='multiple'
                          maxTagCount={3}
                          optionFilterProp='children'
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          onChange={(e, value) => {
                            handleSection(value);
                          }}
                          onClear={handleClearSection}
                          className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                          bordered={false}
                        >
                          {sectionOptions}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className='col-md-3 col-6 pr-0 px-0 pl-md-3'>
                      <Form.Item name='subject'>
                        <Select
                          placeholder='Select Subject'
                          showSearch
                          mode='multiple'
                          maxTagCount={3}
                          optionFilterProp='children'
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          onChange={(e, value) => {
                            handleSubject(value);
                          }}
                          onClear={handleClearSubject}
                          className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                          bordered={false}
                        >
                          {subjectOptions}
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        )}

        <div className='px-2 th-calendar'>
          <div className='th-br-6'>
            <FullCalendar
              plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
              events={events}
              viewName={calendarViewMode}
              ref={calendarRef}
              slotMinTime={'09:00:00'}
              slotMaxTime={'21:00:00'}
              dayHeaderFormat={{ weekday: window.innerWidth < 768 ? 'short' : 'long' }}
              headerToolbar={{
                start: '',
                center: 'prev,title,next',
                end: '',
              }}
              allDaySlot={false}
              datesSet={(arg) => {
                setStartDate(moment(arg.view.activeStart).format('YYYY-MM-DD'));
                setEndDate(moment(arg.view.activeEnd).format('YYYY-MM-DD'));
              }}
              showNonCurrentDates={false}
              style={{ boxShadow: '5px 0 5px -4px #f0e2f0, -5px 0 5px -4px #f0e2f0' }}
            />

            <div className='row th-bg-grey px-2 pt-3'>
              <div className='col-md-8 px-0 px-md-2'>
                <div className='d-flex th-14 th-fw-400 justify-content-between align-items-center'>
                  <div className='p-1 th-br-4 th-green th-pointer th-bg-white px-md-3'>
                    Holiday
                  </div>
                  <div className='p-1 th-br-4 th-yellow th-pointer th-bg-white px-md-3'>
                    Examinations
                  </div>
                  <div className='p-1 th-br-4 th-violet th-pointer th-bg-white px-md-3'>
                    Misc. Events
                  </div>
                  <div className='p-1 th-br-4 th-red th-pointer th-bg-white px-md-3'>
                    Competition
                  </div>
                  <div className='pr-0 th-br-4 th-black-1 th-pointer th-bg-white px-md-3'>
                    Period
                  </div>
                </div>
              </div>
              <div className='col-md-4 text-right py-2 '>
                <span className='th-white py-1 px-3 th-br-4 th-bg-primary th-14 th-fw-400'>
                  Add Period
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarView;
