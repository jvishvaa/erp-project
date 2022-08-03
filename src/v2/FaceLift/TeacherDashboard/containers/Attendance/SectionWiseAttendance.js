import React, { useState, useEffect, createRef } from 'react';
import Layout from 'containers/Layout';
import moment from 'moment';
import endpoints from 'v2/config/endpoints';
import axiosInstance from 'v2/config/axios';
import demoPic from 'v2/Assets/images/student_pic.png';
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
import { DownOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;
const sectionWiseAttendanceData = [
  {
    studentName: 'Student Odd',
    erp: 'ERP 2022098765',
    attendance: 'P',
  },
  {
    studentName: 'Student Even',
    erp: 'ERP 202209665',
    attendance: 'A',
  },
  {
    studentName: 'Student Odd',
    erp: 'ERP 2022098765',
    attendance: 'P',
  },
  {
    studentName: 'Student Even',
    erp: 'ERP 202209665',
    attendance: 'A',
  },
  {
    studentName: 'Student Odd',
    erp: 'ERP 2022098765',
    attendance: 'P',
  },
  {
    studentName: 'Student Even',
    erp: 'ERP 202209665',
    attendance: 'A',
  },
  {
    studentName: 'Student Odd',
    erp: 'ERP 2022098765',
    attendance: 'P',
  },
  {
    studentName: 'Student Even',
    erp: 'ERP 202209665',
    attendance: 'A',
  },
];
const columns = [
  {
    title: <span className='th-white pl-sm-0 pl-4 th-fw-600 '>STUDENT DETAILS</span>,
    dataIndex: 'grade',
    width: '75%',
    align: 'left',
    key: 'grade',
    id: 1,
    render: (text, row) => (
      <div className='d-flex align-items-center pl-sm-0 pl-4'>
        <Avatar size={40} src={demoPic} />
        <div className='d-flex flex-column px-2 '>
          <span className='th-black-1 th-fw-400'>{row.studentName}</span>
          <span className='th-grey th-14 th-fw-400'>{row.erp}</span>
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
        className={`${row.attendance === 'P' ? 'th-green' : 'th-red'} th-16 th-fw-500`}
      >
        {row.attendance}
      </span>
    ),
  },
];

const SectionWiseAttendance = () => {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const formRef = createRef();
  const [gradeData, setGradeData] = useState([]);
  const [gradeId, setGradeId] = useState('');
  const [sectionData, setSectionData] = useState([]);
  const [sectionId, setSectionId] = useState('');

  const handleDateChange = (value) => {
    if (value) {
      setDate(moment(value).format('YYYY-MM-DD'));
    }
  };

  const fetchGradeData = () => {
    const params = {
      session_year: 1,
      branch_id: 88,
      module_id: 2,
    };
    axiosInstance
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
    if (e) {
      setGradeId(e);

      fetchSectionData({
        session_year: 1,
        branch_id: 88,
        module_id: 2,
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
    axiosInstance
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
    fetchGradeData();
  }, []);

  return (
    <Layout>
      <div className='row py-3 px-2'>
        <div className='col-md-6'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/teacher-dashboard' className='th-grey th-fw-400'>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item href='/gradewise-attendance' className='th-grey th-fw-400'>
              Attendance
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1  th-fw-400'>Students</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='col-md-4 text-right mt-2 mt-sm-0 justify-content-end'>
          <span className='th-br-4 p-1 th-bg-white'>
            <img src={calendarIcon} className='pl-2' />
            <DatePicker
              allowClear={false}
              bordered={false}
              placement='bottomRight'
              placeholder={'Till Date'}
              onChange={(value) => handleDateChange(value)}
              showToday={false}
              suffixIcon={<DownOutlined className='th-black-1' />}
              className='th-black-2 pl-0 th-date-picker'
              format={'DD/MM/YYYY'}
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
              Total Students: <span className='th-primary'>50</span>
            </div>
            <div className='col-md-2 col-6 pb-0 pb-sm-2 th-custom-col-padding'>
              Students Present: <span className='th-green'>47</span>
            </div>
            <div className='col-md-2 col-6 pb-0 pb-sm-2 th-custom-col-padding'>
              Students Absent: <span className='th-fw-500 th-red'>03</span>
            </div>
            <div className='col-md-2 col-12 pb-0 pb-sm-2 th-custom-col-padding'>
              <Input
                className='th-bg-grey th-br-4'
                placeholder='Search a student'
                suffix={<SearchOutlined className='th-grey' />}
                bordered={false}
              />
            </div>
            <div className='col-md-2 col-12 pb-0 pb-sm-2 th-custom-col-padding'>
              <Select
                defaultValue={'All Students'}
                className='th-grey th-bg-grey th-br-4 w-100'
                bordered={false}
              >
                <Option value='1'>All Students</Option>
                <Option value='2'>Present</Option>
                <Option value='2'>Absent</Option>
              </Select>
            </div>
          </div>
        </div>

        <div className='row mt-3'>
          <div className='col-12'>
            <Table
              className='th-table'
              columns={columns}
              rowKey={(record) => record?.id}
              dataSource={sectionWiseAttendanceData}
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
