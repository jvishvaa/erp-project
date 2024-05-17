import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axiosInstance from 'config/axios';
import { Breadcrumb, DatePicker, Empty, Form, message, Select, Spin, Switch } from 'antd';
import moment from 'moment';
import endpoints from 'config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { useSelector } from 'react-redux';
import { DownOutlined } from '@ant-design/icons';
import Layout from 'containers/Layout';
import DashbaoardCard from './DashboardCard';
import './dashboard.scss';

const HomeworkDashboard = () => {
  const formRef = useRef();
  const history = useHistory();
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const dateFormat = 'YYYY-MM-DD';
  const defaultStartDate = moment().subtract(30, 'days');

  const [teacherData, setTeacherData] = useState([]);
  const [teacherId, setTeacherId] = useState();
  const [dates, setDates] = useState(null);
  const [startDate, setStartDate] = useState(defaultStartDate.format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [dashboardLevel, setDashboardLevel] = useState(0);

  const [branchData, setBranchData] = useState([]);
  const [gradeData, setGradeData] = useState([]);
  const [sectionData, setSectionData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [mainData, setMainData] = useState([]);
  const [showAbsolute, setShowAbsolute] = useState(false);

  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  const userData = JSON.parse(localStorage.getItem('userDetails'));
  const user_level = userData?.user_level;

  const visibleLevel =
    user_level === 8 || user_level === 10
      ? 'branch'
      : user_level === 11
      ? 'grade'
      : user_level === 13
      ? 'subject'
      : 'not visible';

  useEffect(() => {
    if (visibleLevel === 'branch') {
      fetchSubjectList();
      fetchBranchWise({
        start_date: startDate,
        end_date: endDate,
        session_year_id: selectedAcademicYear?.id,
        teacher_id: visibleLevel === 'branch' && teacherId,
        subject_id: selectedSubjectId,
      });
    } else if (visibleLevel === 'grade') {
      fetchSubjectList();
      fetchGradeWise({
        start_date: startDate,
        end_date: endDate,
        acadsession_id: selectedBranch?.id,
        teacher_id: visibleLevel === 'grade' && userData?.user_id,
        subject_id: selectedSubjectId,
      });
    } else if (visibleLevel === 'subject') {
      fetchStudenthWise({
        start_date: startDate,
        end_date: endDate,
        section_mapping: userData?.role_details?.grades?.[0]?.id,
        acad_session: selectedBranch?.id,
      });
    }
  }, []);

  useEffect(() => {
    if (
      startDate &&
      endDate &&
      startDate !== 'Invalid date' &&
      endDate !== 'Invalid date'
    ) {
      if (visibleLevel === 'branch') {
        fetchBranchWise({
          start_date: startDate,
          end_date: endDate,
          session_year_id: selectedAcademicYear?.id,
          teacher_id: visibleLevel === 'branch' && teacherId,
          subject_id: selectedSubjectId,
        });
      } else if (visibleLevel === 'grade') {
        fetchGradeWise({
          start_date: startDate,
          end_date: endDate,
          acadsession_id: selectedBranch?.id,
          teacher_id: visibleLevel === 'grade' && userData?.user_id,
          subject_id: selectedSubjectId,
        });
      } else if (visibleLevel === 'subject') {
        fetchStudenthWise({
          start_date: startDate,
          end_date: endDate,
          section_mapping: userData?.role_details?.grades?.[0]?.id,
          acad_session: selectedBranch?.id,
        });
      }
    } else {
      setMainData([]);
    }
  }, [startDate, endDate, teacherId, selectedSubjectId]);

  const fetchBranchWise = async (params = {}) => {
    setLoading(true);
    try {
      const result = await axiosInstance.get(
        `${endpoints?.homeworkDashboard?.branchWise}`,
        {
          params: { ...params },
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      );
      if (result?.data?.status_code === 200) {
        let mappedData = result?.data?.result?.map((item) => {
          return {
            id: item?.branch_id,
            acad_session_id: item?.acad_session_id,
            name: item?.branch_name,
            numberCounts: item?.counts,
            percentageCounts: item?.percents,
          };
        });
        setBranchData(mappedData);
        if (visibleLevel === 'branch') {
          setMainData(mappedData);
        }
      } else {
        setBranchData([]);
        message.error(result?.message || 'Something went wrong');
      }
    } catch (error) {
      message.error(error?.response?.data?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const fetchGradeWise = async (params = {}) => {
    if (visibleLevel === 'grade') {
      setLoading(true);
    } else {
      setTableLoading(true);
    }
    try {
      const result = await axiosInstance.get(
        `${endpoints?.homeworkDashboard?.gradeWise}`,
        {
          params: { ...params },
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      );
      if (result?.data?.status_code === 200) {
        let mappedData = Array.isArray(result?.data?.result)
          ? result?.data?.result?.map((item) => ({
              id: item?.grade_id,
              name: item?.grade_name,
              numberCounts: item?.counts,
              percentageCounts: item?.percents,
            }))
          : [];
        setGradeData(mappedData);
        if (visibleLevel === 'grade') {
          setMainData(mappedData);
        }
      } else {
        setGradeData([]);
        message.error(result?.message || 'Something went wrong');
      }
    } catch (error) {
      message.error(error?.response?.data?.message ?? 'Something went wrong');
    } finally {
      if (visibleLevel === 'grade') {
        setLoading(false);
      } else {
        setTableLoading(false);
      }
    }
  };

  const fetchSectionWise = async (params = {}) => {
    if (visibleLevel === 'grade') {
      setTableLoading(true);
    } else {
      setLoading(true);
    }
    try {
      const result = await axiosInstance.get(
        `${endpoints?.homeworkDashboard?.sectionWise}`,
        {
          params: { ...params },
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      );
      if (result?.data?.status_code === 200) {
        let mappedData = result?.data?.result?.map((item) => {
          return {
            id: item?.sec_map_id,
            name: item?.section_name,
            numberCounts: item?.counts,
            percentageCounts: item?.percents,
          };
        });
        setSectionData(mappedData);
      } else {
        setSectionData([]);
        message.error(result?.message || 'Something went wrong');
      }
    } catch (error) {
      message.error(error?.response?.data?.message ?? 'Something went wrong');
    } finally {
      if (visibleLevel === 'grade') {
        setTableLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  const fetchSubjectWise = async (params = {}) => {
    if (visibleLevel === 'branch' && dashboardLevel === 1) {
      setTableLoading(true);
    } else if (visibleLevel === 'grade' && dashboardLevel === 0) {
      setLoading(true);
    }
    try {
      const result = await axiosInstance.get(
        `${endpoints?.homeworkDashboard?.subjectWise}`,
        {
          params: { ...params },
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      );
      if (result?.data?.status_code === 200) {
        let mappedData = result?.data?.result?.map((item) => ({
          map_sub: item?.map_sub,
          id: item?.subject_id,
          name: item?.subject_name,
          numberCounts: item?.counts,
          percentageCounts: item?.percents,
          sec_map_id: item?.sec_map_id,
        }));
        setSubjectData(mappedData);
        // setLevel2TableData([
        //   {
        //     map_sub: 14050,
        //     id: 3,
        //     name: 'Hindi',
        //     numberCounts: {
        //       assigned: 2,
        //       submitted: 1,
        //       pending: 1,
        //       non_evaluated: 0,
        //       evaluated: 1,
        //     },
        //     percentageCounts: {
        //       p_assigned: 100,
        //       p_submitted: 50.0,
        //       p_pending: 50.0,
        //       p_non_evaluated: 0.0,
        //       p_evaluated: 50.0,
        //     },
        //   },
        //   {
        //     map_sub: 14049,
        //     id: 6,
        //     name: 'Maths',
        //     numberCounts: {
        //       assigned: 2,
        //       submitted: 0,
        //       pending: 2,
        //       non_evaluated: 0,
        //       evaluated: 0,
        //     },
        //     percentageCounts: {
        //       p_assigned: 100,
        //       p_submitted: 0.0,
        //       p_pending: 100.0,
        //       p_non_evaluated: 0.0,
        //       p_evaluated: 0.0,
        //     },
        //   },
        // ]);
      } else {
        setSubjectData([]);
        message.error(result?.message || 'Something went wrong');
      }
    } catch (error) {
      message.error(error?.response?.data?.message ?? 'Something went wrong');
    } finally {
      if (visibleLevel === 'branch' && dashboardLevel === 1) {
        setTableLoading(false);
      } else if (visibleLevel === 'grade' && dashboardLevel === 0) {
        setLoading(false);
      }
    }
  };

  const fetchStudentList = async (params = {}) => {
    if (visibleLevel === 'branch') {
      setLoading(true);
    } else if (visibleLevel === 'grade') {
      setTableLoading(true);
    }
    try {
      const result = await axiosInstance.get(
        `${endpoints?.homeworkDashboard?.studentList}`,
        {
          params: { ...params },
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      );
      if (result?.data?.status_code === 200) {
        let mappedData = result?.data?.result?.map((item) => {
          return {
            id: item?.id,
            name: item?.name,
            numberCounts: item?.counts,
            percentageCounts: item?.percents,
          };
        });
        setStudentList(mappedData);
      } else {
        setStudentList([]);
        message.error(result?.message || 'Something went wrong');
      }
    } catch (error) {
      message.error(error?.response?.data?.message ?? 'Something went wrong');
    } finally {
      if (visibleLevel === 'branch') {
        setLoading(false);
      } else if (visibleLevel === 'grade') {
        setTableLoading(false);
      }
    }
  };

  const fetchStudenthWise = async (params = {}) => {
    setLoading(true);
    try {
      const result = await axiosInstance.get(
        `${endpoints?.homeworkDashboard?.studentDash}`,
        {
          params: { ...params },
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      );
      if (result?.data?.status_code === 200) {
        let mappedData = result?.data?.result?.map((item) => {
          return {
            id: item?.subject_id,
            mapSub: item?.map_sub,
            name: item?.subject_name,
            numberCounts: item?.counts,
            percentageCounts: item?.percents,
          };
        });
        setStudentData(mappedData);
        if (visibleLevel === 'subject') {
          setMainData(mappedData);
        }
      } else {
        setStudentData([]);
        message.error(result?.message || 'Something went wrong');
      }
    } catch (error) {
      message.error(error?.response?.data?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjectList = async (params = {}) => {
    try {
      const result = await axiosInstance.get(`${endpoints?.masterManagement?.subjects}`, {
        params: { ...params },
      });
      if (result?.data?.status_code === 200) {
        setSubjectList(result?.data?.data?.results);
      } else {
        setSubjectList([]);
        message.error(result?.message || 'Something went wrong');
      }
    } catch (error) {
      message.error(error?.response?.data?.message ?? 'Something went wrong');
    }
  };

  const fetchTeacherData = (value, callback) => {
    let timeout;
    let currentValue;
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;
    const fake = () => {
      axiosInstance
        .get(
          `${endpoints.communication.viewUser}?user_level=11&search=${value}&session_year=${selectedAcademicYear?.id}`
        )
        .then((result) => {
          setTeacherData(result?.data?.results);
          if (currentValue === value) {
            const newData = result?.data?.results;
            const data = newData.map((item) => ({
              value: item?.user?.id,
              text: `${item?.user?.first_name} ${item?.user?.last_name}`,
            }));
            callback(data);
          }
        })
        .catch((error) => message.error('error', error?.message));
    };
    timeout = setTimeout(fake, 300);
  };

  const handleTeacher = (newValue) => {
    if (newValue) {
      setTeacherId(newValue);
    }
  };
  const handleTeacherSearch = (newValue) => {
    if (newValue) {
      fetchTeacherData(newValue, setTeacherData);
    } else {
      setTeacherData([]);
    }
  };

  const handleClearTeacher = () => {
    setTeacherData([]);
    setTeacherId(null);
  };

  const handleSubject = (e) => {
    if (e) {
      setSelectedSubjectId(e?.value);
    }
  };

  const handleClearSubject = () => {
    setSelectedSubjectId(null);
    formRef.current.setFieldsValue({
      subject: null,
    });
  };

  const handleDateChange = (value) => {
    if (value) {
      setStartDate(moment(value[0]).format('YYYY-MM-DD'));
      setEndDate(moment(value[1]).format('YYYY-MM-DD'));
      setDates(value);
    } else {
      setStartDate(null);
      setEndDate(null);
      setDates(null);
    }
  };

  const onOpenChange = (open) => {
    if (open) {
      setStartDate(null);
      setEndDate(null);
      setDates([null, null]);
      formRef.current.setFieldsValue({
        date: [null, null],
      });
    } else {
      setDates(null);
    }
  };

  const disabledDate = (current) => {
    console.log(
      { current },
      dates,
      startDate,
      endDate,
      moment().diff(dates?.[0], 'days')
    );
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 30;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 30;
    return !!tooEarly || !!tooLate;
  };

  const subjectOptions = subjectList?.map((each) => {
    return (
      <Option key={each?.id} value={each?.id} id={each?.id}>
        {each?.subject_name}
      </Option>
    );
  });

  return (
    <React.Fragment>
      <Layout>
        <div className='row pt-3'>
          <div className='col-md-12'>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item
                className='th-grey th-16 th-pointer'
                onClick={() => history.push('/dashboard')}
              >
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>
                Homework Dashboard
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className='row mt-3'>
          <div className='col-12'>
            <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
              <div className='row'>
                <div className='col-12'>
                  <Form
                    id='filterForm'
                    // className='mt-3'
                    layout={'vertical'}
                    ref={formRef}
                    style={{ width: '100%' }}
                  >
                    <div className='row align-items-center'>
                      <div className={`col-xl-3 col-md-3 col-sm-6 col-12 pl-0`}>
                        <Form.Item name='date' label='Date'>
                          <RangePicker
                            className='th-width-100 th-br-4'
                            onCalendarChange={(value) => handleDateChange(value)}
                            onOpenChange={onOpenChange}
                            defaultValue={
                              dates || [moment().subtract(30, 'days'), moment()]
                            }
                            format={dateFormat}
                            disabledDate={disabledDate}
                            separator={'to'}
                          />
                        </Form.Item>
                      </div>
                      {visibleLevel === 'branch' || visibleLevel === 'grade' ? (
                        <div className={`col-xl-3 col-md-3`}>
                          <Form.Item name='subject' label='Subject'>
                            <Select
                              getPopupContainer={(trigger) => trigger.parentNode}
                              allowClear={true}
                              suffixIcon={<DownOutlined className='th-grey' />}
                              className='th-grey th-bg-grey th-br-4 w-100 text-left th-select'
                              placement='bottomRight'
                              showArrow={true}
                              onChange={(e, value) => handleSubject(value)}
                              onClear={handleClearSubject}
                              dropdownMatchSelectWidth={false}
                              filterOption={(input, options) => {
                                return (
                                  options.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                );
                              }}
                              showSearch
                              placeholder='Select Subject'
                            >
                              {subjectOptions}
                            </Select>
                          </Form.Item>
                        </div>
                      ) : null}
                      {visibleLevel === 'branch' ? (
                        <div className={`col-xl-3 col-md-3`}>
                          <Form.Item name='teacher' label='Teacher'>
                            <Select
                              showSearch
                              allowClear={true}
                              value={teacherId}
                              placeholder={'Teacher name or ERP'}
                              defaultActiveFirstOption={false}
                              showArrow={false}
                              filterOption={false}
                              onSearch={handleTeacherSearch}
                              onChange={handleTeacher}
                              onClear={handleClearTeacher}
                              notFoundContent={null}
                              options={(teacherData || []).map((d) => ({
                                value: d.value,
                                label: d.text,
                              }))}
                            />
                          </Form.Item>
                        </div>
                      ) : null}

                      {mainData?.length > 0 && (
                        <div
                          className={`${
                            visibleLevel === 'branch'
                              ? 'col-md-3'
                              : visibleLevel === 'grade'
                              ? 'col-md-6'
                              : 'col-md-6'
                          }`}
                        >
                          <Switch
                            checkedChildren='Absolute'
                            unCheckedChildren='Percentage'
                            className='mt-3 float-right'
                            defaultChecked={showAbsolute}
                            onChange={() => setShowAbsolute(!showAbsolute)}
                          />
                        </div>
                      )}
                    </div>
                  </Form>
                </div>
              </div>
              {((visibleLevel === 'branch' && dashboardLevel === 0) ||
                (visibleLevel === 'grade' && dashboardLevel === 0) ||
                (visibleLevel === 'subject' && dashboardLevel === 0)) &&
              loading ? (
                <div
                  className='row mt-2 th-bg-grey th-br-10 align-items-center'
                  style={{ minHeight: 300 }}
                >
                  <div className='col-12 text-center'>
                    <div className='pt-3 pb-2'>
                      <Spin size='large' tip='Loading...' />
                    </div>
                  </div>
                </div>
              ) : (
                <div className='row mt-2 th-bg-grey th-br-10'>
                  <div className='col-12'>
                    <div className='pt-3 pb-2'>
                      {mainData?.length > 0 ? (
                        <DashbaoardCard
                          dashboardLevel={dashboardLevel}
                          setDashboardLevel={setDashboardLevel}
                          startDate={startDate}
                          endDate={endDate}
                          teacherId={teacherId}
                          subjectId={selectedSubjectId}
                          visibleLevel={visibleLevel}
                          level1Data={mainData}
                          level2Data={
                            visibleLevel === 'branch'
                              ? sectionData
                              : visibleLevel === 'grade'
                              ? subjectData
                              : []
                          }
                          level3Data={studentList}
                          fetchGradeWise={fetchGradeWise}
                          fetchSectionWise={fetchSectionWise}
                          fetchSubjectWise={fetchSubjectWise}
                          fetchStudentList={fetchStudentList}
                          tableData={
                            visibleLevel === 'branch' && dashboardLevel === 0
                              ? gradeData
                              : visibleLevel === 'branch' && dashboardLevel === 1
                              ? subjectData
                              : visibleLevel === 'grade' && dashboardLevel === 0
                              ? sectionData
                              : visibleLevel === 'grade' && dashboardLevel === 1
                              ? studentList
                              : []
                          }
                          showAbsolute={showAbsolute}
                          loading={loading}
                          tableLoading={tableLoading}
                        />
                      ) : (
                        <Empty description='No results found for the chosen filters.' />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default HomeworkDashboard;
