import React, { useState, useEffect, createRef } from 'react';
import Layout from 'containers/Layout';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import endpoints from 'v2/config/endpoints';
import axiosInstance from 'v2/config/axios';
import { Table, DatePicker, Breadcrumb, Form, Select, message, Input } from 'antd';
import { DownOutlined, UpOutlined, CheckSquareFilled } from '@ant-design/icons';
import CalendarIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/calendarIcon.svg';
import completionIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/completionIcon.svg';
import { tableWidthCalculator } from 'v2/tableWidthCalculator';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ChapterwiseCurriculumReport = () => {
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

  const chapterwiseCurriculumData = [
    {
      chapter: 'Number System',
      completion_perc: 100,
      id: 1,
    },
    {
      chapter: 'Addition',
      completion_perc: 70,
      id: 2,
    },
    {
      chapter: 'Subtraction',
      completion_perc: 70,
      id: 3,
    },
  ];

  const columns = [
    {
      title: <span className='th-white pl-md-4 th-fw-700 '>CHAPTERS</span>,
      dataIndex: 'chapter',
      align: 'left',
      width: '70%',
      render: (text, row, index) => (
        <span className='pl-md-4 th-black-1'>
          Chapter {index + 1}: {row.chapter}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>AVG. COMPLETION</span>,
      dataIndex: 'completion_perc',
      align: 'center',
      width: '20%',
      render: (text, row) =>
        row?.completion_perc === 100 ? (
          <img src={completionIcon} style={{ height: 24, width: 24 }} />
        ) : (
          <span className='th-fw-400 th-black-1'>{row?.completion_perc}%</span>
        ),
    },
  ];
  const expandedRowRender = () => {
    const innerColumn = [
      {
        title: 'topic',
        dataIndex: 'topic',
        align: 'left',
        width: tableWidthCalculator(70) + '%',
        render: (data) => <span className='pl-4 ml-md-5 th-black-2'>{data}</span>,
      },
      {
        title: 'avg. completion',
        dataIndex: 'completion_perc',
        align: 'center',
        width: '20%',
        render: (text, row) =>
          row?.completion_perc === 100 ? (
            <span className='pr-5 pr-md-0'>
              <img src={completionIcon} style={{ height: 20, width: 20 }} />
            </span>
          ) : (
            <span className='th-fw-400 pr-5 pr-md-0'>{row?.completion_perc}%</span>
          ),
      },
      {
        title: '',
      },
    ];
    const data = [
      {
        topic: 'Topic 1',
        completion_perc: 100,
        id: 1,
      },
      {
        topic: 'Topic 2',
        completion_perc: 70,
        id: 2,
      },
    ];

    return (
      <Table
        columns={innerColumn}
        dataSource={data}
        rowKey={(record) => record?.id}
        pagination={false}
        showHeader={false}
        bordered={false}
        style={{ width: '100%' }}
        scroll={{ x: 'max-content' }}
      />
    );
  };

  return (
    <Layout>
      <div className='row py-3 px-2'>
        <div className='col-md-8'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/teacher-dashboard' className='th-grey th-16'>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item href='/curriculum-report' className='th-grey th-16'>
              Curriculum Completion
            </Breadcrumb.Item>
            <Breadcrumb.Item
              href='/subjectwise-curriculum-report'
              className='th-grey th-16'
            >
              Subjectwise Completion
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1 th-16'>
              Chapterwise Completion
            </Breadcrumb.Item>
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
                <div className='col-md-2 col-6 pr-0 px-0 pl-md-3'>
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
              dataSource={chapterwiseCurriculumData}
              expandable={{ expandedRowRender }}
              expandIcon={({ expanded, onExpand, record }) =>
                expanded ? (
                  <UpOutlined
                    className='th-black-1'
                    onClick={(e) => onExpand(record, e)}
                  />
                ) : (
                  <DownOutlined
                    className='th-black-1'
                    onClick={(e) => onExpand(record, e)}
                  />
                )
              }
              pagination={false}
              expandIconColumnIndex={2}
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

export default ChapterwiseCurriculumReport;
