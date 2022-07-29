import React, { useState, useEffect, createRef } from 'react';
import { Select, Form, message } from 'antd';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import TableView from './TableView';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.css';

const { Option } = Select;
const planData = [
  {
    volume: 'Volume 1',
    chapter: [
      'Real Numbers',
      'Polynomials',
      'Pair of Equations in two variables',
      'Triangles',
    ],
    time: 5,
    periods: '14',
    buffer: '14',
    quizzes: '14',
  },
  {
    volume: 'Volume 2',
    chapter: [
      'Real Numbers',
      'Polynomials',
      'Pair of Equations in two variables',
      'Triangles',
    ],
    time: 5,
    periods: '14',
    buffer: '14',
    quizzes: '14',
  },
  {
    volume: 'Volume 3',
    chapter: [
      'Real Numbers',
      'Polynomials',
      'Pair of Equations in two variables',
      'Triangles',
    ],
    time: 5,
    periods: '14',
    buffer: '14',
    quizzes: '14',
  },
  {
    volume: 'Volume 4',
    chapter: [
      'Real Numbers',
      'Polynomials',
      'Pair of Equations in two variables',
      'Triangles',
    ],
    time: 5,
    periods: '14',
    buffer: '14',
    quizzes: '14',
  },
];

const AnnualPlan = (props) => {
  const formRef = createRef();
  const [cardIndex, setCardIndex] = useState(0);

  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [gradeData, setGradeData] = useState([]);
  const [gradeId, setGradeId] = useState();
  const [sectionData, setSectionData] = useState([]);
  const [sectionId, setSectionId] = useState();
  const [subjectData, setSubjectData] = useState([]);
  const [subjectId, setSubjectId] = useState();
  const [tableVisible, setTableVisible] = useState(false);

  const showTable = (value) => {
    setTableVisible(true);
    props.getVolume(value);
  };

  const closeTable = () => {
    setTableVisible(false);
  };
  props.closeTable.current = closeTable;

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
            <div className='col-md-2 col-6 pr-0 px-0 pl-md-3'>
              <Form.Item name='volume'>
                <Select
                  placeholder='Select Volume'
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
            <div className='col-md-2 col-6 pr-0 px-0 pl-md-3'>
              <Form.Item name='topic'>
                <Select
                  placeholder='Select Topic'
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
      {tableVisible ? (
        <TableView />
      ) : (
        <div className='row pt-4 px-3 '>
          {planData?.map((item, i) => (
            <div className='col-md-6 p-2'>
              <div
                className='th-br-6 shadow-sm th-pointer'
                style={{ border: '1px solid #d9d9d9', minHeight: 170 }}
                onClick={() => showTable(item?.volume)}
              >
                <div
                  className='row px-3 py-1 th-bg-grey th-black-1 th-fw-600'
                  style={{
                    borderBottom: '1px solid #d9d9d9',
                    borderRadius: '6px 6px 0 0',
                  }}
                >
                  {item.volume}
                </div>
                <div className=' p-2 th-black-2'>
                  <div className='row py-2'>
                    <div className='col-4 pl-2'>
                      {' '}
                      No. of Chapters: <span className='th-primary'>5</span>
                    </div>
                    <div className='th-grey th-14 col-8 px-0'>
                      {item.chapter?.map((item, i) => {
                        return (
                          <div>
                            Chapter{i + 1}: {item}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className='row px-2'>
                    Time: <span className='th-primary'> {item.time} Weeks</span>
                  </div>
                  <div className='row px-2'>
                    Total Periods: <span className='th-primary'> {item.periods}</span>
                  </div>
                  <div className='row px-2'>
                    Buffer Periods: <span className='th-primary'> {item.buffer}</span>
                  </div>
                  <div className='row px-2'>
                    Quizzes: <span className='th-primary'> {item.quizzes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnualPlan;
