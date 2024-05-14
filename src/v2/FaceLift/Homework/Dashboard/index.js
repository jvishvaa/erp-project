import React, { useEffect, useRef, useState } from 'react';
import Layout from 'containers/Layout';
import { Breadcrumb, DatePicker, Form, message, Select } from 'antd';
import axiosInstance from 'config/axios';
import { useSelector } from 'react-redux';
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';
import endpoints from 'config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { useHistory } from 'react-router-dom';
import DashboardCard from './Componant/dashboardCard';

const HomeworkDashboard = () => {
  const formRef = useRef();
  const history = useHistory();
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const dateFormat = 'YYYY-MM-DD';
  const defaultStartDate = moment().subtract(6, 'days');

  const [teacherData, setTeacherData] = useState([]);
  const [teacherId, setTeacherId] = useState();
  const [teacherName, setTeacherName] = useState();
  const [teacherErp, setTeacherErp] = useState();
  const [dates, setDates] = useState(null);
  const [startDate, setStartDate] = useState(defaultStartDate.format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [dashboardLevel, setDashboardLevel] = useState(0);
  const [branchData, setBranchData] = useState([]);
  const [gradeData, setGradeData] = useState([]);
  const [sectionData, setSectionData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedLevel1Card, setSelectedLevel1Card] = useState({
    index: null,
    data: null,
  });
  const [selectedLevel2Card, setSelectedLevel2Card] = useState({
    index: null,
    data: null,
  });

  const [level1Data, setLevel1Data] = useState([]);
  const [level2Data, setLevel2Data] = useState([]);
  const [level3Data, setLevel3Data] = useState([]);
  const [level1TableData, setLevel1TableData] = useState([]);
  const [level2TableData, setLevel2TableData] = useState([]);

  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  useEffect(() => {
    fetchTeacherList();
    fetchBranchWise({
      start_date: startDate,
      end_date: endDate,
      session_year_id: selectedAcademicYear?.id,
    });
  }, []);

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
        setLevel1Data(mappedData);
        setSelectedLevel1Card({ index: 0, data: mappedData[0] });
      } else {
        setBranchData([]);
        setLevel1Data([]);
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
    setTableLoading(true);
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
        let mappedData = Array.isArray(result?.data?.result)
          ? result?.data?.result?.map((item) => ({
              id: item?.grade_id,
              name: item?.grade_name,
              numberCounts: item?.counts,
              percentageCounts: item?.percents,
            }))
          : [];
        setGradeData(mappedData);
        setLevel1TableData(mappedData);
      } else {
        setGradeData([]);
        setLevel1TableData([]);
        message.error(result?.message || 'Something went wrong');
      }
    } catch (error) {
      message.error(error?.response?.data?.message ?? 'Something went wrong');
    } finally {
      setTableLoading(false);
    }
  };

  const fetchSectionWise = async (params = {}) => {
    console.log({ params });
    // setChildLoading(true);
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
        setLevel2Data(mappedData);
        setSelectedLevel2Card({ index: 0, data: mappedData[0] });
      } else {
        setSectionData([]);
        setLevel2Data([]);
        message.error(result?.message || 'Something went wrong');
      }
    } catch (error) {
      message.error(error?.response?.data?.message ?? 'Something went wrong');
    } finally {
      // setChildLoading(false);
    }
  };

  const fetchSubjectWise = async (params = {}) => {
    console.log({ params });
    // setChildLoading(true);
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
        let mappedData = result?.data?.result?.map((item) => ({
          map_sub: item?.map_sub,
          id: item?.subject_id,
          name: item?.subject_name,
          numberCounts: item?.counts,
          percentageCounts: item?.percents,
          sec_map_id: item?.sec_map_id,
        }));
        setSubjectData(mappedData);
        setLevel2TableData(mappedData);
      } else {
        setSubjectData([]);
        setLevel2TableData([]);
        message.error(result?.message || 'Something went wrong');
      }
    } catch (error) {
      console.log({ error }, error?.response);
      message.error(error?.response?.data?.message ?? 'Something went wrong');
    } finally {
      // setChildLoading(false);
    }
  };

  const getLevel1Data = () => {};
  const getLevel1TableData = (params) => {
    if (dashboardLevel === 0) {
      fetchGradeWise(params);
    }
  };

  const getLevel2Data = (params = {}) => {
    if (dashboardLevel === 1) {
      console.log(params, 'data getLevel2Data');
      fetchSectionWise(params);
    }
  };

  const getLevel2TableData = (params) => {
    if (dashboardLevel === 1) {
      fetchSubjectWise(params);
    }
  };

  // const selectHomework = (index) => {
  //   setSelectedIndex(index);
  // };

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
              <div className='row'>
                <div className='col-md-7 col-12 pl-0 dashboard-stat'>
                  {Array.isArray(level1Data) && level1Data?.length > 0
                    ? level1Data?.map((item, index) => (
                        <DashboardCard
                          dashboardLevel={dashboardLevel}
                          setDashboardLevel={setDashboardLevel}
                          startDate={startDate}
                          endDate={endDate}
                          mainData={item}
                          index={index}
                          getLevel2Data={getLevel2Data}
                          level2Data={level2Data}
                          getLevel1TableData={getLevel1TableData}
                          getLevel2TableData={getLevel2TableData}
                          level1TableData={level1TableData}
                          level2TableData={level2TableData}
                          // level3TableData={level3TableData}
                          tableLoading={tableLoading}
                          selectedLevel1Card={selectedLevel1Card}
                          setSelectedLevel1Card={setSelectedLevel1Card}
                          selectedLevel2Card={selectedLevel2Card}
                          setSelectedLevel2Card={setSelectedLevel2Card}
                        />
                      ))
                    : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default HomeworkDashboard;
