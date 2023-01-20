import React, { useState, useEffect, createRef } from 'react';
import Layout from 'containers/Layout';
import axios from 'v2/config/axios';
import endpoints from 'config/endpoints';
import {
  Table,
  Breadcrumb,
  Tag,
  Space,
  Button,
  Select,
  Form,
  message,
  Input,
  Radio,
} from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

const { Option } = Select;

const ObservationReport = () => {
  const history = useHistory();
  const formRef = createRef();
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [gradeDropdown, setGradeDropdown] = useState([]);
  const [sectionDropdown, setSectionDropdown] = useState([]);
  const [subjectDropdown, setSubjectDropdown] = useState([]);
  const [gradeID, setGradeID] = useState(null);
  const [sectionID, setSectionID] = useState(null);
  const [subjectID, setSubjectID] = useState();
  const [sectionMappingID, setSectionMappingID] = useState([]);
  const [moduleId, setModuleId] = useState();
  const [teacherName, setTeacherName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [tableView, setTableView] = useState('teacher');

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

  useEffect(() => {
    if (moduleId && selectedBranch) {
      fetchGradeData();
    }
  }, [moduleId]);

  const handleSearch = () => {
    if (tableView === 'teacher') {
      observationGet({
        teacher_name__icontains: teacherName,
        subject_map__section_mapping__grade_id: gradeID,
        subject_map__section_mapping__section_id: sectionID,
        subject_map__section_mapping__acad_session__branch_id: selectedBranch?.branch?.id,
        subject_map__subject_id: subjectID,
        is_student: false,
      });
    } else {
      observationGet({
        subject_map__section_mapping__grade_id: gradeID,
        subject_map__section_mapping__section_id: sectionID,
        subject_map__section_mapping__acad_session__branch_id: selectedBranch?.branch?.id,
        teacher_name__icontains: studentName,
        is_student: true,
      });
    }
  };

  const observationGet = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.observation.observationTableData}`, {
        params: { ...params },
      })
      .then((result) => {
        if (result.status === 200) {
          setData(result?.data);
          setLoading(false);
        } else {
          setLoading(false);
          setData([]);
        }
      })
      .catch((error) => {
        console.log(error);
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
      .then((result) => {
        if (result?.data?.status_code == 200) {
          setGradeDropdown(result?.data?.data);
        }
      })
      .catch((error) => message.error('error', error?.message));
  };

  const handleGrade = (e, value) => {
    setSectionDropdown([]);
    if (e) {
      setGradeID(e);
      const params = {
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.branch?.id,
        grade_id: e,
        module_id: moduleId,
      };
      axios
        .get(`${endpoints.academics.sections}`, { params })
        .then((result) => {
          if (result?.data?.status_code == 200) {
            const sectionData = result?.data?.data || [];
            setSectionDropdown(sectionData);
          }
        })
        .catch((error) => message.error('error', error?.message));
    }
  };

  const handleClearGrade = () => {
    setGradeID(null);
    setSectionDropdown([]);
    setSubjectDropdown([]);
  };

  const handleClearSection = () => {
    setSectionID(null);
    setSubjectDropdown([]);
  };
  const handleSection = (each) => {
    if (each) {
      setSectionID(each?.value);
      setSectionMappingID(each?.mappingId);
      const params = {
        session_year: selectedAcademicYear?.id,
        branch: selectedBranch?.branch?.id,
        grade: gradeID,
        section: each.value,
        module_id: moduleId,
      };
      axios
        .get(`${endpoints.academics.subjects}`, { params })
        .then((result) => {
          if (result?.data?.status_code == 200) {
            setSubjectDropdown(result?.data?.data);
          }
        })
        .catch((error) => message.error('error', error?.message));
    }
  };

  const handleSubject = (e) => {
    if (e) {
      setSubjectID(e.value);
    }
  };
  const handleTableView = (e) => {
    setTableView(e.value);
    setData([]);
  };
  const gradeOptions = gradeDropdown?.map((each) => {
    return (
      <Option key={each?.grade_id} value={each?.grade_id}>
        {each?.grade__grade_name}
      </Option>
    );
  });

  const sectionOptions = sectionDropdown?.map((each) => {
    return (
      <Option key={each?.id} mappingId={each.id} value={each?.section_id}>
        {each?.section__section_name}
      </Option>
    );
  });

  const subjectOptions = subjectDropdown?.map((each) => {
    return (
      <Option key={each?.subject__id} value={each?.subject__id} id={each?.subject__id}>
        {each?.subject__subject_name}
      </Option>
    );
  });

  const columns = [
    {
      title: <span className='th-white th-fw-700 '>S. No.</span>,
      width: '8%',
      align: 'center',
      render: (value, item, index) => (
        <span className='th-black-1 th-16'>{index + 1}</span>
      ),
    },
    {
      title: (
        <span className='th-white th-fw-700'>
          {tableView === 'teacher' ? 'Teacher Name' : 'Student Name'}
        </span>
      ),
      dataIndex: 'teacher_name',
      render: (data) => <span className='th-black-1 th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Score</span>,
      align: 'center',
      dataIndex: 'score',
      render: (data) => <span className='th-black-1 th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Remark</span>,
      align: 'center',
      dataIndex: 'remark',
      render: (data) => <span className='th-black-1 th-16'>{data}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Evaluation Date</span>,
      align: 'center',
      dataIndex: 'date',
      render: (data) => <span className='th-black-1 th-16'>{data}</span>,
    },

    {
      title: <span className='th-white th-fw-700'>Action</span>,
      align: 'center',
      key: 'actiom',
      render: (data) => {
        return (
          <Space>
            <Tag
              icon={data?.report ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              className='th-br-6 th-bg-primary th-white py-1 px-2'
              style={{ cursor: data?.report ? 'pointer' : 'not-allowed' }}
              onClick={() =>
                history.push({
                  pathname: '/observation-report-preview',
                  state: { selectedReport: data },
                })
              }
            >
              {data?.report ? 'View Report' : 'No Report'}
            </Tag>
          </Space>
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <Layout>
        <div className='row py-3 px-2'>
          <div className='col-md-9' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>
                Observation Report
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className='col-md-12 px-0 mt-3'>
            <Form id='filterForm' ref={formRef} layout={'horizontal'}>
              <div className='row'>
                <div className='col-md-2 py-2'>
                  <Form.Item name='grade'>
                    <Select
                      allowClear
                      placeholder={'Select Grade'}
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={handleGrade}
                      onClear={handleClearGrade}
                      className='th-width-100 th-br-6'
                    >
                      {gradeOptions}
                    </Select>
                  </Form.Item>
                </div>
                <div className='col-md-2 py-2'>
                  <Form.Item name='section'>
                    <Select
                      className='th-width-100 th-br-6'
                      onChange={(e, value) => handleSection(value)}
                      placeholder={
                        tableView === 'student' && gradeID ? 'Section*' : 'Section'
                      }
                      allowClear
                      onClear={handleClearSection}
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {sectionOptions}
                    </Select>
                  </Form.Item>
                </div>

                <div className='col-md-2 py-2'>
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
                      onChange={(e, value) => {
                        handleSubject(value);
                      }}
                      className='th-width-100 th-br-6'
                    >
                      {subjectOptions}
                    </Select>
                  </Form.Item>
                </div>

                <div className='col-md-2 py-2'>
                  <Form.Item name='applicable_for'>
                    <Select
                      placeholder='Applicable for'
                      showSearch
                      optionFilterProp='children'
                      onChange={(e, value) => {
                        handleTableView(value);
                      }}
                      className='th-width-100 th-br-6'
                      defaultValue='teacher'
                    >
                      <Option key={'2'} value={'teacher'}>
                        {'For Teacher'}
                      </Option>
                      <Option key={'1'} value={'student'}>
                        {'For Student'}
                      </Option>
                    </Select>
                  </Form.Item>
                </div>

                {tableView === 'teacher' ? (
                  <div className='col-md-2 py-2'>
                    <Form.Item name='teachername'>
                      <Input
                        placeholder='Teacher Name'
                        onChange={(e) => setTeacherName(e.target.value)}
                      />
                    </Form.Item>
                  </div>
                ) : (
                  <div className='col-md-2 py-2'>
                    <Form.Item name='studentname'>
                      <Input
                        placeholder='Student Name'
                        onChange={(e) => setStudentName(e.target.value)}
                      />
                    </Form.Item>
                  </div>
                )}
                <div className='col-md-2 py-2'>
                  <Button type='primary' className='w-100' onClick={handleSearch}>
                    Search
                  </Button>
                </div>
              </div>
            </Form>
          </div>
          <div className='row'>
            <div className='col-12'>
              <Table
                className='th-table'
                rowClassName={(record, index) =>
                  index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                }
                loading={loading}
                columns={columns}
                rowKey={(record) => record?.id}
                dataSource={data}
                pagination={false}
                // scroll={{ y: '400px' }}
              />
            </div>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default ObservationReport;
