import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { Breadcrumb, Select, message, DatePicker, Card, Spin } from 'antd';
import { useSelector } from 'react-redux';
import TimeTableNewView from './TimeTableNewView';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

const TeacherTimeTable = () => {
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const today = moment();

  const startOfWeek = today.clone().startOf('isoWeek');
  const endOfWeek = today.clone().endOf('isoWeek');
  const [loading, setLoading] = useState(false);
  const [gradeID, setGradeID] = useState();
  const [gradeList, setGradeList] = useState([]);
  const [sectionMappingID, setSectionMappingID] = useState();
  const [sectionList, setSectionList] = useState([]);
  const [dates, setDates] = useState(null);
  const [value, setValue] = useState([startOfWeek, endOfWeek]);
  const [currentWeekTimeTable, setCurrentWeekTimeTable] = useState([]);

  const gradeOptions = gradeList?.map((each) => {
    return (
      <Option key={each?.grade_id} value={each?.grade_id}>
        {each?.grade_name}
      </Option>
    );
  });

  const sectionOptions = sectionList?.map((each) => {
    return (
      <Option key={each?.id} value={each?.id}>
        {each?.sec_name}
      </Option>
    );
  });

  const fetchGradeData = (params = {}) => {
    axios
      .get(`${endpoints.academics.grades}`, { params: { ...params } })
      .then((result) => {
        if (result?.data?.status_code == 200) {
          setGradeList(result?.data?.data);
        } else {
          setGradeList([]);
        }
      })
      .catch((error) => message.error('error', error?.message));
  };
  const fetchSectionData = (params = {}) => {
    axios
      .get(`${endpoints.academics.sections}`, { params: { ...params } })
      .then((result) => {
        if (result?.data?.status_code == 200) {
          setSectionList(result?.data?.data);
        } else {
          setSectionList([]);
        }
      })
      .catch((error) => message.error('error', error?.message));
  };
  const handleGrade = (e, value) => {
    setSectionList([]);
    setSectionMappingID();
    setGradeID();
    if (e) {
      if (e == 'All') {
        let allGrades = gradeList?.map((item) => item?.grade_id);
        setGradeID('All');
        fetchSectionData({
          session_year: selectedAcademicYear?.id,
          branch_id: selectedBranch?.branch?.id,
          grade_id: allGrades.join(','),
        });
      } else {
        setGradeID(e);
        fetchSectionData({
          session_year: selectedAcademicYear?.id,
          branch_id: selectedBranch?.branch?.id,
          grade_id: e,
        });
      }
    }
  };
  const handleSection = (e) => {
    setCurrentWeekTimeTable([]);
    if (e) {
      if (e == 'All') {
        let allSection = sectionList?.map((item) => item?.id);
        setSectionMappingID(e);
        fetchTeachersTimeTable({
          start: moment(value[0]).format('YYYY-MM-DD'),
          end: moment(value[1]).format('YYYY-MM-DD'),
          sec_map: allSection.join(','),
        });
      } else {
        setSectionMappingID(e);
        fetchTeachersTimeTable({
          start: moment(value[0]).format('YYYY-MM-DD'),
          end: moment(value[1]).format('YYYY-MM-DD'),
          sec_map: e,
        });
      }
    } else {
      setSectionMappingID();
    }
  };
  const disabledDate = (current) => {
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 7;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 7;
    return !!tooEarly || !!tooLate;
  };
  const onOpenChange = (open) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };

  const fetchTeachersTimeTable = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.timeTableNewFlow.teacherTimeTableView}/`, {
        params: { ...params },
      })
      .then((res) => {
        if (res?.data?.status_code == 200) {
          setCurrentWeekTimeTable(res?.data?.result);
        } else {
          setCurrentWeekTimeTable([]);
        }
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchGradeData({
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranch?.branch?.id,
    });
  }, []);
  useEffect(() => {
    if (value.length > 1 && sectionMappingID) {
      fetchTeachersTimeTable({
        start: moment(value[0]).format('YYYY-MM-DD'),
        end: moment(value[1]).format('YYYY-MM-DD'),
        sec_map: sectionMappingID,
      });
    }
  }, [value]);
  return (
    <div>
      <React.Fragment>
        <Layout>
          <div className='row py-3 px-2'>
            <div className='col-md-9' style={{ zIndex: 2 }}>
              <Breadcrumb separator='>'>
                <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                  Dashboard
                </Breadcrumb.Item>
                <Breadcrumb.Item className='th-black-1 th-16'>TimeTable</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <div className='row px-3'>
            <div className='col-12 th-bg-white'>
              <div className='row'>
                <div className='col-md-3 py-2'>
                  <div className='th-fw-600 pb-2'>Select Grade</div>
                  <Select
                    className='th-width-100 th-br-6'
                    onChange={handleGrade}
                    placeholder='Grade *'
                    allowClear
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    value={gradeID}
                  >
                    {/* {gradeList?.length > 0 && (
                      <Option value='All' key='All'>
                        All
                      </Option>
                    )} */}
                    {gradeOptions}
                  </Select>
                </div>
                <div className='col-md-3 py-2'>
                  <div className='th-fw-600 pb-2'>Select Section</div>
                  <Select
                    className='th-width-100 th-br-6'
                    onChange={(e) => handleSection(e)}
                    placeholder='Section *'
                    allowClear
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    value={sectionMappingID}
                  >
                    {/* {sectionList?.length > 0 && (
                      <Option value='All' key='All'>
                        All
                      </Option>
                    )} */}
                    {sectionOptions}
                  </Select>
                </div>
                <div className='col-md-3 py-2'>
                  <div className='th-fw-600 pb-2'>Select Date Range</div>
                  <div className='d-flex align-items-center'>
                    <RangePicker
                      className='w-100'
                      popupStyle={{ zIndex: 2100 }}
                      value={dates || value}
                      disabledDate={disabledDate}
                      onCalendarChange={(val) => setDates(val)}
                      onChange={(val) => setValue(val)}
                      onOpenChange={onOpenChange}
                    />
                  </div>
                </div>
              </div>

              <div className={`mt-3 px-2 ${loading ? 'py-5' : ''}`}>
                {sectionMappingID ? (
                  <Spin spinning={loading}>
                    <Card>
                      {currentWeekTimeTable?.length > 0 && (
                        <TimeTableNewView
                          currentWeekTimeTable={currentWeekTimeTable}
                          startDate={moment(value[0]).format('YYYY-MM-DD')}
                          isTeacherView={true}
                        />
                      )}
                    </Card>
                  </Spin>
                ) : (
                  <div className='text-center py-5'>
                    <span className='th-25 th-fw-500'>
                      Please select the section first you wish to display
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Layout>
      </React.Fragment>
    </div>
  );
};

export default TeacherTimeTable;
