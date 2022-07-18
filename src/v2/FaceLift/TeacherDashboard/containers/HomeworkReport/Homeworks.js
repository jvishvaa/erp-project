import React, { useState, useEffect, createRef } from 'react';
import Layout from 'v2/Layout';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import endpoints from 'v2/config/endpoints';
import axiosInstance from 'v2/config/axios';
import { Table, DatePicker, Breadcrumb, Form, Select, message, Input } from 'antd';
import { DownOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import CalendarIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/calendarIcon.svg';

const { Option } = Select;
const { RangePicker } = DatePicker;
const homeworksData = [
  {
    title: 'Random lengthy text for ellipsis',
    assigned_on: '02/06/22',
    due_date: '15/06/2022',
    submitted: 90,
    pending: 10,
    pending_perc: '10%',
    evaluated_perc: '10%',
    evaluated: 10,
  },
  {
    title: 'Random text ',
    assigned_on: '02/06/22',
    due_date: '15/06/2022',
    submitted: 90,
    pending: 10,
    pending_perc: '10%',
    evaluated_perc: '10%',
    evaluated: 10,
  },
  {
    title: 'Random lengthy text for ellipsis',
    assigned_on: '02/06/22',
    due_date: '15/06/2022',
    submitted: 90,
    pending: 10,
    pending_perc: '10%',
    evaluated_perc: '10%',
    evaluated: 10,
  },
  {
    title: 'Random lengthy text for ellipsis',
    assigned_on: '02/06/22',
    due_date: '15/06/2022',
    submitted: 90,
    pending: 10,
    pending_perc: '10%',
    evaluated_perc: '10%',
    evaluated: 10,
  },
  {
    title: 'Random lengthy text for ellipsis',
    assigned_on: '02/06/22',
    due_date: '15/06/2022',
    submitted: 90,
    pending: 10,
    pending_perc: '10%',
    evaluated_perc: '10%',
    evaluated: 10,
  },
];

const Homeworks = () => {
  const history = useHistory();
  const formRef = createRef();
  const [gradeData, setGradeData] = useState([]);
  const [gradeId, setGradeId] = useState('');
  const [sectionData, setSectionData] = useState([]);
  const [sectionId, setSectionId] = useState('');
  const [subjectData, setSubjectData] = useState([]);
  const [subjectId, setSubjectId] = useState('');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const handleDateChange = (value) => {
    if (value) {
      setStartDate(moment(value[0]).format('YYYY-MM-DD'));
      setEndDate(moment(value[1]).format('YYYY-MM-DD'));
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
      subject: null,
    });
    setSectionData([]);
    setSubjectData([]);
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
    formRef.current.setFieldsValue({
      subject: null,
    });
    setSubjectData([]);
    if (e) {
      setSectionId(e);
      fetchSubjectData({
        session_year: 1,
        branch: 88,
        module_id: 2,
        // grade: 2,
        // section: 3,
        grade: `${gradeId}`,
        section: e,
      });
    }
  };
  const handleSubject = (e) => {
    setSubjectId(e);
  };
  const handleClearSubject = () => {
    setSubjectId('');
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
  const fetchSubjectData = (params = {}) => {
    axiosInstance
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
      <Option key={each?.id} value={each.subject__id}>
        {each?.subject__subject_name}
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
  const columns = [
    {
      title: <span className='th-white pl-md-2 th-fw-700 '>ASSIGNED ON</span>,
      dataIndex: 'assigned_on',
      align: 'left',
      width: '15%',
      render: (data) => <span className='pl-md-2 th-black-1'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>TITLE</span>,
      dataIndex: 'title',
      width: '20%',
      align: 'left',
      render: (data) => (
        <span
          className='th-fw-400 th-black-1 d-inline-block text-truncate'
          style={{ width: '9rem' }}
        >
          {data}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>DUE DATE</span>,
      dataIndex: 'due_date',
      align: 'left',
      width: '15%',
      render: (data) => <span className='th-black-1'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>STUDENTS PENDING</span>,
      dataIndex: 'submitted',
      align: 'center',
      width: '15%',
      render: (text, row) => (
        <>
          <span className='th-red'>{row.pending}</span>
          <span className='th-black-2'> ({row.pending_perc})</span>
        </>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>STUDENTS SUBMITTED</span>,
      dataIndex: 'evaluated',
      align: 'center',
      width: '15%',
      render: (data) => <span className='th-green'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>STUDENTS EVALUATED</span>,
      dataIndex: 'evaluated',
      width: '15%',
      align: 'center',
      render: (text, row) => (
        <>
          <span className='th-primary'>{row.evaluated}</span>
          <span className='th-grey'> ({row.evaluated_perc})</span>
        </>
      ),
    },
    {
      title: '',
      dataIndex: '',
      align: 'left',
      width: '5%',
      render: () => (
        <span onClick={() => history.push('./studentwise-homework-report')}>
          <RightOutlined className='th-grey th-pointer' />
        </span>
      ),
    },
  ];

  return (
    <Layout>
      <div className='row py-3 px-2'>
        <div className='col-md-8'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/teacher-dashboard' className='th-grey th-16'>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item href='/homework-report' className='th-grey th-16'>
              Homework Report
            </Breadcrumb.Item>
            <Breadcrumb.Item
              href='/subjectwise-homework-report'
              className='th-grey th-16'
            >
              Subjectwise Report
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1 th-16'>Homeworks</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='col-md-4 mt-3 mt-sm-0 text-right'>
          <div>
            <RangePicker
              allowClear={false}
              bordered={false}
              placement='bottomRight'
              showToday={false}
              suffixIcon={<DownOutlined />}
              defaultValue={[moment(), moment()]}
              onChange={(value) => handleDateChange(value)}
              className='th-range-picker th-br-4'
              separator={'to'}
              format={'DD/MM/YYYY'}
            />
          </div>
          <div className='th-date-range'>
            <img src={CalendarIcon} />
          </div>
        </div>
        <div className='row mt-3'>
          <div className='col-12'>
            <Form id='filterForm' ref={formRef} layout={'horizontal'}>
              <div className='row align-items-center'>
                <div className='col-md-2 col-6 px-0'>
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
                <div className='col-md-2 col-6 pr-0'>
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
                <div className='col-md-2 col-6 pr-0 px-0 px-md-1'>
                  <Form.Item name='subject'>
                    <Select
                      placeholder='Select Subject'
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e) => {
                        handleSubject(e);
                      }}
                      onClear={handleClearSubject}
                      className='w-100 text-left th-black-1 th-bg-white th-br-4'
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

        <div className='row mt-2'>
          <div className='col-12'>
            <Table
              className='th-table'
              columns={columns}
              rowKey={(record) => record?.id}
              dataSource={homeworksData}
              pagination={false}
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
              }
              scroll={{ x: '100%' }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Homeworks;
