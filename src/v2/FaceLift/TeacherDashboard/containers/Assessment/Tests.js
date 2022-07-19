import React, { useState, useEffect, createRef } from 'react';
import Layout from 'containers/Layout';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Table, DatePicker, Breadcrumb, Form, Select, message, Input } from 'antd';
import { DownOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import calendarIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/calendarIcon.svg';
import axios from 'v2/config/axios';
import { useSelector } from 'react-redux';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Tests = () => {
  const history = useHistory();
  const formRef = createRef();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [loading, setLoading] = useState(false);
  const [gradeData, setGradeData] = useState([]);
  const [gradeId, setGradeId] = useState(2);
  const [sectionData, setSectionData] = useState([]);
  const [sectionId, setSectionId] = useState(1);
  const [subjectData, setSubjectData] = useState([]);
  const [subjectId, setSubjectId] = useState(9);
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [testTypes, setTestTypes] = useState([]);
  const [testTypeId, setTestTypeId] = useState([]);
  const [testsData, setTestsData] = useState([]);
  const handleDateChange = (value) => {
    if (value) {
      setStartDate(moment(value[0]).format('YYYY-MM-DD'));
      setEndDate(moment(value[1]).format('YYYY-MM-DD'));
    }
  };

  const fetchGradeData = () => {
    const params = {
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranch?.branch?.id,
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
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.branch?.id,
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
        session_year: selectedAcademicYear?.id,
        branch: selectedBranch?.branch?.id,
        module_id: 2,
        grade: gradeId,
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
  const handleTestType = (e) => {
    setTestTypeId(e);
  };

  const fetchTestTypes = () => {
    axios
      .get(`${endpoints.academics.testTypes}`, {})
      .then((response) => {
        if (response.status === 200) {
          setTestTypes(response?.data?.result);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const fetchTestsData = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.teacherAssessment.tests}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setTestsData(response?.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
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
  const testTypesOptions = testTypes?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.exam_name}
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
    if (
      selectedBranch &&
      selectedAcademicYear &&
      gradeId &&
      sectionId &&
      subjectId &&
      startDate &&
      endDate
    )
      fetchTestsData({
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.branch?.id,
        grade_id: gradeId,
        section_id: sectionId,
        subject_id: subjectId,
        test_type: testTypeId,
        date_gte: startDate,
        date_lte: endDate,
      });
  }, [
    selectedBranch,
    selectedAcademicYear,
    gradeId,
    sectionId,
    subjectId,
    testTypeId,
    startDate,
    endDate,
  ]);

  useEffect(() => {
    fetchGradeData();
  }, [selectedBranch, selectedAcademicYear]);

  useEffect(() => {
    fetchTestTypes();
  }, []);
  const columns = [
    {
      title: <span className='th-white th-fw-700'>TEST</span>,
      dataIndex: 'test_name',
      align: 'left',
      render: (data) => (
        <span
          className='th-black-2 d-inline-block text-truncate'
          style={{ width: '8rem' }}
        >
          {data}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>STUDENTS APPEARED</span>,
      dataIndex: 'appeared',
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700'>TOTAL MARKS</span>,
      dataIndex: 'total_marks',
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700'>CLASS AVERAGE</span>,
      dataIndex: 'class_average',
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700'>BELOW 35%</span>,
      dataIndex: 'student_below_35_per',
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700'>BETWEEN 35%-70%</span>,
      dataIndex: 'student_below_35_to_70_per',
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700'>ABOVE 70%</span>,
      dataIndex: 'student_above_70_per',
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700'>STUDENTS BELOW THRESHOLD</span>,
      width: '20%',
      align: 'center',
      render: (text, row) => (
        <>
          <span className='th-fw-500 th-18'>{row.student_below_threshold}</span>
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
      dataIndex: '',
      align: 'center',
      width: '5%',
      render: () => (
        <span onClick={() => history.push('./studentwise-assessment-report')}>
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
            <Breadcrumb.Item
              href='/subjectwise-assessment-report'
              className='th-grey th-16'
            >
              Subject Wise Assessment
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-black-1 th-16'>Tests</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='col-md-4 text-right mt-2 mt-sm-0 justify-content-end'>
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
            <img src={calendarIcon} />
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
                <div className='col-md-2 col-6 pr-0 pl-md-3'>
                  <Form.Item name='test_type'>
                    <Select
                      placeholder='Test Type'
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e) => {
                        handleTestType(e);
                      }}
                      onClear={handleClearSubject}
                      className='w-100 text-left th-black-1 th-bg-white th-br-4'
                      bordered={false}
                    >
                      {testTypesOptions}
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
              loading={loading}
              rowKey={(record) => record?.id}
              dataSource={testsData}
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

export default Tests;
