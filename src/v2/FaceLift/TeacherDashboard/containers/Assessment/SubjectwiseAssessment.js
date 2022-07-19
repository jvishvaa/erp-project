import React, { useState, useEffect, createRef } from 'react';
import Layout from 'containers/Layout';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import endpoints from 'v2/config/endpoints';
import axios from 'v2/config/axios';
import { Table, DatePicker, Breadcrumb, Form, Select, message } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import calendarIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/calendarIcon.svg';

const { Option } = Select;

const subjectwiseAssessmentReport = [
  {
    subject: 'Mathematics',
    total: 56,
    avg_score: '75%',
    below_threshold: '5',
    below_threshold_perc: '4',
    id: 1,
  },
  {
    subject: 'English',
    total: 56,
    avg_score: '75%',
    below_threshold: '8',
    below_threshold_perc: '-3',
    id: 2,
  },
  {
    subject: 'Hindi',
    total: 56,
    avg_score: '75%',
    below_threshold: '5',
    below_threshold_perc: '4',
    id: 3,
  },
  {
    subject: 'Science',
    total: 56,
    avg_score: '75%',
    below_threshold: '4',
    below_threshold_perc: '-2',
    id: 4,
  },
];

const SubjectwiseAssessment = () => {
  const history = useHistory();
  const formRef = createRef();
  const [gradeData, setGradeData] = useState([]);
  const [gradeId, setGradeId] = useState('');
  const [sectionData, setSectionData] = useState([]);
  const [sectionId, setSectionId] = useState('');
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
  const columns = [
    {
      title: <span className='th-white pl-4 th-fw-700 '>SUBJECTS</span>,
      dataIndex: 'subject',
      align: 'left',
      width: '30%',
      render: (data) => <span className='pl-4 th-black-1'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL STUDENTS</span>,
      dataIndex: 'total',
      align: 'center',
      width: '15%',
      render: (data) => <span className='th-black-1'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>CLASS AVG. SCORE</span>,
      dataIndex: 'avg_score',
      align: 'center',
      width: '20%',
      render: (data) => <span className='th-black-1'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>STUDENTS BELOW THRESHOLD</span>,
      align: 'center',
      width: '20%',
      render: (text, row) => (
        <>
          <span className='th-fw-500 th-18 th-black-1'>{row.below_threshold}</span>
          {row.below_threshold_perc > 0 ? (
            <span className='th-red'> +{row.below_threshold_perc}%</span>
          ) : (
            <span className='th-green'> {row.below_threshold_perc}%</span>
          )}
        </>
      ),
    },
    {
      title: '',
      dataIndex: 'evaluated',
      align: 'center',
      width: '5%',
      render: () => (
        <span className='pr-4' onClick={() => history.push('./tests-report')}>
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
            <Breadcrumb.Item href='/assessment-report' className='th-grey th-16'>
              Assessment
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1 th-16'>
              Subject Wise Assessment
            </Breadcrumb.Item>
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
              // defaultValue={moment(moment(), 'YYYY-MM-DD')}
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
                <div className='col-md-2 col-6 pl-0 '>
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
                <div className='col-md-2 px-0 col-6 th-custom-col-padding'>
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

        <div className='row mt-2'>
          <div className='col-12'>
            <Table
              className='th-table'
              columns={columns}
              rowKey={(record) => record?.id}
              dataSource={subjectwiseAssessmentReport}
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

export default SubjectwiseAssessment;
