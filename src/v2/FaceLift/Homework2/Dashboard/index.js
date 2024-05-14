import React, { useEffect, useRef, useState } from 'react';
import Layout from 'containers/Layout';
import { Breadcrumb, DatePicker, Form, message, Select } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import DashboardComp from './Component/DashboardComp';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import endpoints from 'config/endpoints';
import { useSelector } from 'react-redux';
import axiosInstance from 'config/axios';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';

const HomeworkDashboard = () => {
  const formRef = useRef();
  const history = useHistory();
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const dateFormat = 'YYYY-MM-DD';
  const defaultStartDate = moment().subtract(6, 'days');

  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  //Dashboard Level = 0 => Principle / Cordinator => Branch => Grade => Section => Subject
  //Dashboard Level = 1 => Teacher   => Grade => Section => Subject
  //Dashboard Level = 2 => Teacher  =>  Grade => Section => Subject
  //Dashboard Level = 3 => Student => Subject
  const [dashboardLevel, setDashboardLevel] = useState(0);

  const [teacherData, setTeacherData] = useState([]);
  const [teacherId, setTeacherId] = useState();
  const [teacherName, setTeacherName] = useState();
  const [teacherErp, setTeacherErp] = useState();
  const [dates, setDates] = useState(null);
  const [startDate, setStartDate] = useState(defaultStartDate.format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));

  const [dashboardData, setDashboardData] = useState([]);
  const [dashboardTableData, setDashboardTableData] = useState([]);

  const [branchData, setBranchData] = useState([]);
  const [gradeData, setGradeData] = useState([]);
  const [sectionData, setSectionData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [childLoading, setChildLoading] = useState(false);
  const [apiData, setApiData] = useState('');

  useEffect(() => {
    fetchTeacherList();
    fetchBranchWise({
      start_date: startDate,
      end_date: endDate,
      session_year_id: selectedAcademicYear?.id,
    });
  }, []);

  // useEffect(() => {
  //   console.log({ apiData, dashboardLevel });
  //   if (apiData?.level === 'grade') {
  //     fetchGradeWise({
  //       start_date: startDate,
  //       end_date: endDate,
  //       acadsession_id: apiData?.id,
  //     });
  //   }
  //   if (apiData?.level === 'section') {
  //     fetchSectionWise({
  //       start_date: startDate,
  //       end_date: endDate,
  //       acadsession_id: apiData?.id,
  //       grade_id: apiData?.grade_id,
  //     });
  //   }
  // }, [dashboardLevel]);

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
      console.log({ result });
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
    console.log({ params });
    setChildLoading(true);
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
      console.log({ result });
      if (result?.data?.status_code === 200) {
        let mappedData = result?.data?.result?.map((item) => ({
          id: item?.grade_id,
          name: item?.grade_name,
          numberCounts: item?.counts,
          percentageCounts: item?.percents,
        }));
        setGradeData(mappedData);
      } else {
        setGradeData([]);
        message.error(result?.message || 'Something went wrong');
      }
    } catch (error) {
      message.error(error?.response?.data?.message ?? 'Something went wrong');
    } finally {
      setChildLoading(false);
    }
  };

  const fetchSectionWise = async (params = {}) => {
    console.log({ params });
    setChildLoading(true);
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
      console.log({ result });
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
      setChildLoading(false);
    }
  };

  const fetchSubjectWise = async (params = {}) => {
    console.log({ params });
    setChildLoading(true);
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
      console.log({ result });
      if (result?.data?.status_code === 200) {
        setSubjectData(result?.data?.result);
      } else {
        setSubjectData([]);
        message.error(result?.message || 'Something went wrong');
      }
    } catch (error) {
      console.log({ error }, error?.response);
      message.error(error?.response?.data?.message ?? 'Something went wrong');
    } finally {
      setChildLoading(false);
    }
  };

  const fetchStudentList = async (params = {}) => {
    console.log({ params });
    setChildLoading(true);
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
      console.log({ result });
      if (result?.data?.status_code === 200) {
        setStudentList(result?.data?.result);
      } else {
        setStudentList([]);
        message.error(result?.message || 'Something went wrong');
      }
    } catch (error) {
      console.log({ error }, error?.response);
      message.error(error?.response?.data?.message ?? 'Something went wrong');
    } finally {
      setChildLoading(false);
    }
  };

  const fetchTeacherList = () => {
    const params = {
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranch?.branch?.id,
    };
    axiosInstance
      .get(`${endpoints.aol.teacherList}`, { params })
      .then((result) => {
        if (result?.data?.status_code == 200) {
          setTeacherData(result?.data?.data);
        }
      })
      .catch((error) => message.error('error', error?.message));
  };

  const handleTeacher = (e) => {
    if (e) {
      setTeacherId(e.value);
      setTeacherName(e.teacherName?.split('(')[0]);
      setTeacherErp(e.teacherName?.split('(')[1]?.split(')')[0]);
    }
  };

  const handleClearTeacher = () => {
    setTeacherId(null);
    setTeacherName(null);
    setTeacherErp(null);
    formRef.current.setFieldsValue({
      teacher: null,
    });
  };

  const handleDateChange = (value) => {
    if (value) {
      setStartDate(moment(value[0]).format('DD-MM-YYYY'));
      setEndDate(moment(value[1]).format('DD-MM-YYYY'));
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
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 6;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 6;

    return !!tooEarly || !!tooLate;
  };

  const teacherOptions = teacherData?.map((each) => {
    return (
      <Option
        key={each?.user__id}
        value={each?.tutor_id}
        id={each?.user__id}
        teacherName={each?.name}
      >
        {each?.name}
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
            <Form
              id='filterForm'
              // className='mt-3'
              layout={'vertical'}
              ref={formRef}
              style={{ width: '100%' }}
            >
              <div className='row'>
                <div className={`col-xl-3 col-md-3 col-sm-6 col-12 pl-0`}>
                  <Form.Item name='date' label='Date'>
                    <RangePicker
                      className='th-width-100 th-br-4'
                      onCalendarChange={(value) => handleDateChange(value)}
                      onOpenChange={onOpenChange}
                      defaultValue={dates || [moment().subtract(6, 'days'), moment()]}
                      format={dateFormat}
                      disabledDate={disabledDate}
                      separator={'to'}
                    />
                  </Form.Item>
                </div>
                <div className={`col-xl-3 col-md-3`}>
                  <Form.Item name='teacher' label='Teacher'>
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      allowClear={true}
                      suffixIcon={<DownOutlined className='th-grey' />}
                      className='th-grey th-bg-grey th-br-4 w-100 text-left th-select'
                      placement='bottomRight'
                      showArrow={true}
                      onChange={(e, value) => handleTeacher(value)}
                      onClear={handleClearTeacher}
                      dropdownMatchSelectWidth={false}
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      showSearch
                      placeholder='Select Teacher'
                    >
                      {teacherOptions}
                    </Select>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </div>

        <div className='row mt-2'>
          <div className='col-12'>
            <div className='py-2'>
              <DashboardComp
                dashboardLevel={dashboardLevel}
                setDashboardLevel={setDashboardLevel}
                apiData={apiData}
                setApiData={setApiData}
                dashboardData={
                  dashboardLevel === 0
                    ? branchData
                    : dashboardLevel === 1
                    ? sectionData
                    : []
                }
                dashboardTableData={
                  dashboardLevel === 0
                    ? gradeData
                    : dashboardLevel === 1
                    ? subjectData
                    : []
                }
                dashboardParentData={sectionData}
                dashboardParentFunc={fetchSectionWise}
                dashboardChildData={gradeData}
                dashboardChildFunc={
                  dashboardLevel === 0
                    ? fetchGradeWise
                    : dashboardLevel === 1
                    ? fetchSubjectWise
                    : fetchStudentList
                }
                startDate={startDate}
                endDate={endDate}
                childLoading={childLoading}
              />
              {console.log({ dashboardLevel })}
            </div>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default HomeworkDashboard;
