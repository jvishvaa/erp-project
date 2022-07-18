import React, { useState, useEffect, createRef } from 'react';
import Layout from 'v2/Layout';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Table, DatePicker, Breadcrumb, Form, Select, message, Input } from 'antd';
import { DownOutlined, RightOutlined, PlusOutlined } from '@ant-design/icons';
import calendarIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/calendarIcon.svg';
import axios from 'v2/config/axios';
import { useSelector } from 'react-redux';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';

const { Option } = Select;
const { RangePicker } = DatePicker;

const homeworkData = [
  {
    id: 1,
    label: 'All Homeworks',
  },
  {
    id: 2,
    label: 'Completed',
  },
  {
    id: 3,
    label: 'Overdue',
  },
];

const data = [
  {
    date: '24/06/2022',
    homework: [
      {
        student: 'Mr. Rohan Bharati',
        grade: 'Grade 1A',
        due_date: '27/06/2022',
        submitted: 35,
        submitted_perc: 84,
        evaluated: 47,
        evaluated_perc: 54,
        title: 'MATHEMATICS: Addition Revise Exercise',
      },
      {
        student: 'Mr. Ravi Ranjan',
        grade: 'Grade 1B',
        due_date: '27/06/2022',
        submitted: 35,
        submitted_perc: 84,
        evaluated: 47,
        evaluated_perc: 54,
        title: 'MATHEMATICS: Addition Revise Exercise',
      },
    ],
  },
  {
    date: '23/06/2022',
    homework: [
      {
        student: 'Rohan Bharati',
        grade: 'Grade 1A',
        due_date: '27/06/2022',
        submitted: 35,
        submitted_perc: 84,
        evaluated: 47,
        evaluated_perc: 54,
        title: 'ENGLISH: Addition Revise Exercise',
      },
      {
        student: 'Ravi Ranjan',
        grade: 'Grade 1B',
        due_date: '27/06/2022',
        submitted: 35,
        submitted_perc: 84,
        evaluated: 47,
        evaluated_perc: 54,
        title: 'ENGLISH: Addition Revise Exercise',
      },
    ],
  },
  {
    date: '23/06/2022',
    homework: [
      {
        student: 'Rohan Bharati',
        grade: 'Grade 1A',
        due_date: '27/06/2022',
        submitted: 35,
        submitted_perc: 84,
        evaluated: 47,
        evaluated_perc: 54,
        title: 'ENGLISH: Addition Revise Exercise',
      },
      {
        student: 'Ravi Ranjan',
        grade: 'Grade 1B',
        due_date: '27/06/2022',
        submitted: 35,
        submitted_perc: 84,
        evaluated: 47,
        evaluated_perc: 54,
        title: 'ENGLISH: Addition Revise Exercise',
      },
    ],
  },
];

const TeacherHomework = () => {
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
  const homeworksOptions = homeworkData?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.label}
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
  }, [selectedBranch, selectedAcademicYear]);

  return (
    <Layout>
      <div className='row py-3 px-2'>
        <div className='col-md-8'>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item className='th-black-1 th-fw-400'>
              Teacher Homework
            </Breadcrumb.Item>
          </Breadcrumb>
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
                  <Form.Item name='homework_type'>
                    <Select
                      placeholder='Homework Type'
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      className='w-100 text-left th-black-1 th-bg-white th-br-4'
                      bordered={false}
                    >
                      {homeworksOptions}
                    </Select>
                  </Form.Item>
                </div>
                <div className='col-md-4 col-12 pr-0 pl-md-3 text-right'>
                  <div className='pb-2'>
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
                </div>
              </div>
            </Form>
          </div>
        </div>

        <div className='row' style={{ maxHeight: 520, overflowY: 'auto' }}>
          <div className='col-12'>
            {data?.map((item, i) => {
              return (
                <>
                  <div className='row mt-4'>
                    <div className='col-2 th-16 th-fw-400 th-black-1'>{item?.date}</div>
                    <div className='col-5'></div>
                    <div className='col-2 text-center pl-0'>
                      <div className='th-14 th-fw-400 th-black-2 '>
                        {i == 0 && 'Submitted'}
                      </div>
                    </div>
                    <div className='col-2 text-center pr-0'>
                      <div className='th-14 th-fw-400 th-black-2 '>
                        {i == 0 && 'Evaluated'}
                      </div>
                    </div>
                    <div className='col-1'></div>
                  </div>
                  {item?.homework?.map((item) => (
                    <div
                      className='row th-bg-white my-3 th-pointer'
                      onClick={() => history.push('./teacher-homework-students')}
                    >
                      <div className='row px-0 px-md-2'>
                        <div
                          className='col-2 py-2 pl-md-4 pl-1'
                          style={{ borderRight: '1px solid #D9D9D9' }}
                        >
                          <div className=' th-14 th-fw-500 th-black-2'>{item?.grade}</div>
                          <div
                            className={`${
                              window.innerWidth < 768 ? '' : 'text-truncate'
                            } th-12 th-fw-500 th-grey mt-1 `}
                          >
                            By {item?.student}
                          </div>
                        </div>
                        <div className='col-5 py-2 pr-0'>
                          <div className='th-16 th-fw-400 th-black-1'>{item?.title}</div>
                          <div className='th-14 th-fw-400 th-black-2'>
                            Due {item?.due_date}
                          </div>
                        </div>
                        <div className='col-2 text-center py-3 '>
                          <span className='th-green th-16 th-fw-500  d-inline-block'>
                            {item?.submitted}
                          </span>
                          <span className='th-black-1 th-14 th-fw-400'>
                            ({item?.submitted_perc}%)
                          </span>
                        </div>
                        <div className='col-2 py-3 text-center'>
                          <span className='th-16 fw-500 th-red d-inline-block'>
                            {item?.evaluated}
                          </span>
                          <span className='th-black-1 th-14 th-fw-400'>
                            ({item?.evaluated_perc}%)
                          </span>
                        </div>
                        <div className='col-1 text-right pr-md-4 pr-2 py-3'>
                          <RightOutlined />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              );
            })}
          </div>
        </div>
      </div>
      <div
        style={{ position: 'fixed', bottom: '5%', right: '2%' }}
        className='th-bg-primary th-white th-br-6 px-4 py-3 th-fw-500 th-pointer'
        onClick={() => history.push('./assign-homework')}
      >
        <span className='d-flex align-items-center'>
          <PlusOutlined size='small' className='mr-2' />
          Assign Homework
        </span>
      </div>
    </Layout>
  );
};

export default TeacherHomework;
