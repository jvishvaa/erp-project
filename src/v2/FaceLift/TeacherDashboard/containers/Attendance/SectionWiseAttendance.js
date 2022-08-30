import React, { useState, useEffect, createRef } from 'react';
import Layout from 'containers/Layout';
import moment from 'moment';
import endpoints from 'v2/config/endpoints';
import axios from 'v2/config/axios';
import calendarIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/calendarIcon.svg';
import {
  Table,
  DatePicker,
  Breadcrumb,
  Avatar,
  Form,
  Select,
  message,
  Input,
} from 'antd';
import { DownOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';

const { Option } = Select;

const columns = [
  {
    title: <span className='th-white pl-sm-0 pl-4 th-fw-600 '>STUDENT DETAILS</span>,
    width: '75%',
    align: 'left',
    render: (text, row) => (
      <div className='d-flex align-items-center pl-sm-0 pl-4'>
        <Avatar
          size={40}
          src={`https://d3ka3pry54wyko.cloudfront.net/dev/media/${row?.profile}`}
          icon={<UserOutlined />}
        />
        <div className='d-flex flex-column px-2 '>
          <span className='th-black-1 th-fw-400'>{row.student_name}</span>
          <span className='th-grey th-14 th-fw-400'>{row.erp_id}</span>
        </div>
      </div>
    ),
  },
  {
    title: <span className='th-white th-fw-600'>ATTENDANCE</span>,
    dataIndex: 'attendance',
    width: '25%',
    align: 'center',
    key: 'total',
    id: 2,
    render: (text, row) => (
      <span
        className={`${
          row.erpusersattendance__attendence_status === 'present' ? 'th-green' : 'th-red'
        } th-16 th-fw-500`}
      >
        {row.erpusersattendance__attendence_status === 'present' ? 'P' : 'A'}
      </span>
    ),
  },
];

const SectionWiseAttendance = () => {
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const history = useHistory();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [date, setDate] = useState(history?.location?.state?.date);
  const formRef = createRef();
  const [moduleId, setModuleId] = useState();
  const [gradeData, setGradeData] = useState([]);
  const [gradeId, setGradeId] = useState(history?.location?.state?.gradeID || '');
  const [sectionData, setSectionData] = useState([]);
  const [sectionId, setSectionId] = useState(history?.location?.state?.sectionID || '');
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceCountData, setAttendanceCountData] = useState([]);
  const [searchedValue, setSearchedValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [studentFilter, setStudentFilter] = useState('all');

  const handleDateChange = (value) => {
    if (value) {
      setDate(moment(value).format('YYYY-MM-DD'));
    }
  };
  const handleFilterChange = (value) => {
    setStudentFilter(value);
  };
  const fetchAttendanceData = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.teacherAttendance.sectionwiseAttendance}`, {
        params: {
          ...params,
          ...(studentFilter == 'present' ? { is_present: 1 } : {}),
          ...(studentFilter == 'absent' ? { is_absent: 1 } : {}),
        },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        }
      })
      .then((res) => {
        if (res?.data?.status_code == 200) {
          setAttendanceData(res?.data?.result?.students);
          setAttendanceCountData(res?.data?.result);
          setLoading(false);
        }
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
      });
  };

  const fetchGradeData = () => {
    const params = {
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranch?.branch?.id,
      module_id: moduleId,
    };
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
  const handleGrade = (e) => {
    formRef.current.setFieldsValue({
      section: null,
    });
    setSectionData([]);
    setGradeId();
    setSectionId();
    if (e) {
      setGradeId(e);

      fetchSectionData({
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.branch?.id,
        module_id: moduleId,
        grade_id: e,
      });
    }
  };
  const handleSection = (e) => {
    if (e) {
      setSectionId(e);
    }
  };
  const fetchSectionData = (params = {}) => {
    axios
      .get(`${endpoints.academics.sections}`, {
        params: {
          ...params,
        },
      })
      .then((res) => {
        if (res.data.status_code === 200) {
          setSectionData(res.data.data);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
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
  const handleClearSection = () => {
    setSectionId('');
  };
  const handleClearGrade = () => {
    setGradeId('');
    setSectionId('');
  };

  useEffect(() => {
    if (moduleId) {
      fetchGradeData();
    }
  }, [moduleId]);

  useEffect(() => {
    if (history?.location?.state) {
      formRef.current.setFieldsValue({
        grade: history?.location?.state?.gradeName,
        section: history?.location?.state?.sectionName,
      });
    }
  }, []);

  useEffect(() => {
    if (sectionId) {
      fetchAttendanceData({
        session_year: selectedAcademicYear?.id,
        date: date,
        branch_id: selectedBranch?.branch?.id,
        grade_id: gradeId,
        section_id: sectionId,
      });
    }
  }, [sectionId, date, studentFilter]);

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
      <div className='row py-3 px-2'>
        <div className='col-md-8'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/dashboard' className='th-grey th-pointer'>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item href='/gradewise-attendance' className='th-grey th-pointer'>
              Attendance
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1'>Students</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='col-md-4 text-right mt-2 mt-sm-0 justify-content-end'>
          <span className='th-br-4 p-1 th-bg-white'>
            <img src={calendarIcon} className='pl-2' />
            <DatePicker
              allowClear={false}
              bordered={false}
              placement='bottomRight'
              defaultValue={moment()}
              value={moment(date)}
              onChange={(value) => handleDateChange(value)}
              showToday={false}
              suffixIcon={<DownOutlined className='th-black-1' />}
              className='th-black-2 pl-0 th-date-picker'
              format={'YYYY-MM-DD'}
            />
          </span>
        </div>
        <div className='row mt-3'>
          <div className='col-12'>
            <Form id='filterForm' ref={formRef} layout={'horizontal'}>
              <div className='row align-items-center'>
                <div className='col-md-2 col-6 px-0 pr-md-2 '>
                  <Form.Item name='grade'>
                    <Select
                      allowClear
                      placeholder='Select Grade'
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e) => {
                        handleGrade(e);
                      }}
                      onClear={handleClearGrade}
                      className='w-100 text-left th-black-1 th-bg-white th-br-4'
                      bordered={false}
                    >
                      {gradeOptions}
                    </Select>
                  </Form.Item>
                </div>
                <div className='col-md-2 col-6 pr-0 '>
                  <Form.Item name='section'>
                    <Select
                      allowClear
                      placeholder='Select Section'
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e) => {
                        handleSection(e);
                      }}
                      onClear={handleClearSection}
                      className='w-100 text-left th-black-1 th-bg-white th-br-4'
                      bordered={false}
                    >
                      {sectionOptions}
                    </Select>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </div>
        <div className='col-12'>
          <div className='row pt-2 align-items-center th-bg-white th-br-4 th-13 th-grey th-fw-500'>
            <div className='col-md-2 col-6 pb-0 pb-sm-2 th-custom-col-padding w-100'>
              Total Students:{' '}
              <span className='th-primary'>{attendanceCountData?.total_students}</span>
            </div>
            <div className='col-md-2 col-6 pb-0 pb-sm-2 th-custom-col-padding'>
              Students Present:{' '}
              <span className='th-green'>
                {attendanceCountData?.present_students_count}
              </span>
            </div>
            <div className='col-md-2 col-6 pb-0 pb-sm-2 th-custom-col-padding'>
              Students Absent:{' '}
              <span className='th-fw-500 th-red'>
                {attendanceCountData?.absent_students_count}
              </span>
            </div>
            <div className='col-md-2 col-6 pb-0 pb-sm-2 th-custom-col-padding'>
              Students Marked:{' '}
              <span className='th-green'>{attendanceCountData?.marked_students}</span>
            </div>
            <div className='col-md-2 col-12 pb-0 pb-sm-2 th-custom-col-padding'>
              Students Unmarked:{' '}
              <span className='th-red'>{attendanceCountData?.unmarked_students}</span>
            </div>
          </div>

          <div className='row pt-2 my-2 align-items-center th-bg-white th-br-4 th-13 th-grey th-fw-500'>
            <div className='col-md-2 col-12 pb-0 pb-sm-2 th-custom-col-padding'>
              <Input
                className='th-bg-grey th-br-4'
                placeholder='Search a student'
                suffix={<SearchOutlined className='th-grey' />}
                bordered={false}
                onChange={(e) => setSearchedValue(e.target.value)}
              />
            </div>
            <div className='col-md-2 col-12 pb-0 pb-sm-2 th-custom-col-padding'>
              <Select
                defaultValue={'All Students'}
                className='th-grey th-bg-grey th-br-4 w-100'
                bordered={false}
                onChange={handleFilterChange}
              >
                <Option value='all'>All Students</Option>
                <Option value='present'>Present</Option>
                <Option value='absent'>Absent</Option>
              </Select>
            </div>
          </div>
        </div>

        <div className='row mt-3'>
          <div className='col-12'>
            <Table
              className='th-table'
              columns={columns}
              rowKey={(record) => record?.erp_id}
              loading={loading}
              dataSource={attendanceData.filter(
                (item) =>
                  item.student_name.toLowerCase().includes(searchedValue.toLowerCase()) ||
                  item.erp_id.toLowerCase().includes(searchedValue.toLowerCase())
              )}
              pagination={false}
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
              }
              scroll={{ x: 'max-content' }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SectionWiseAttendance;
