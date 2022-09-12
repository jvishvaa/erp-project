import React, { useState, useEffect, createRef } from 'react';
import { Select, Form, message, Spin } from 'antd';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.css';
import { useHistory } from 'react-router-dom';
import { CaretDownOutlined } from '@ant-design/icons';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';

const { Option } = Select;

const AnnualPlan = () => {
  const formRef = createRef();
  const history = useHistory();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState();

  let boardFilterArr = [
    'orchids.letseduvate.com',
    'localhost:3000',
    'dev.olvorchidnaigaon.letseduvate.com',
    'ui-revamp1.letseduvate.com',
    'qa.olvorchidnaigaon.letseduvate.com',
  ];
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [gradeData, setGradeData] = useState([]);
  const [gradeId, setGradeId] = useState();
  const [gradeName, setGradeName] = useState();
  const [subjectData, setSubjectData] = useState([]);
  const [subjectId, setSubjectId] = useState();
  const [subjectName, setSubjectName] = useState();
  const [boardListData, setBoardListData] = useState([]);
  const [boardId, setBoardId] = useState([]);
  const [annualPlanData, setAnnualPlanData] = useState([{ volume_name: 'ppp' }]);
  const [loading, setLoading] = useState(false);

  const fetchAnnualPlanData = (params = {}) => {
    setLoading(true);
    axios
      .get(`academic/annual-plan/volumes/`, {
        params: { ...params },
      })
      .then((res) => {
        if (res?.data?.status === 200) {
          setAnnualPlanData(res?.data?.data);
          setLoading(false);
        } else {
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

  const fetchSubjectData = (params = {}) => {
    axios
      .get(`${endpoints.lessonPlan.subjects}`, { params: { ...params } })
      .then((res) => {
        if (res.data.status_code === 200) {
          setSubjectData(res.data.result);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const fetchBoardListData = () => {
    axios
      .get(`/academic/get-board-list/`)
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setBoardListData(result?.data?.result);
          if (!boardFilterArr.includes(window.location.host)) {
            let data = result?.data?.result?.filter(
              (item) => item?.board_name === 'CBSE'
            )[0];
            setBoardId(data?.id);
          }
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const handleGrade = (item) => {
    formRef.current.setFieldsValue({
      subject: null,
      board: null,
    });
    setSubjectData([]);
    setSubjectId('');
    setBoardId('');
    if (item) {
      setGradeId(item.value);
      setGradeName(item.children);
      fetchSubjectData({
        session_year: selectedAcademicYear?.id,
        branch_id: selectedBranch?.branch?.id,
        module_id: moduleId,
        grade_id: item.value,
      });
    }
  };
  const handleClearGrade = () => {
    setGradeId('');
    setGradeName('');
    setSubjectId('');
    setSubjectName('');
    setBoardId('');
  };
  const handleSubject = (item) => {
    // formRef.current.setFieldsValue({
    //   board: [],
    // });
    if (item) {
      setSubjectId(item.value);
      setSubjectName(item.children);
    }
  };
  const handleClearSubject = () => {
    setSubjectId('');
    setSubjectName('');
  };
  const handleBoard = (e) => {
    setBoardId(e);
  };
  const handleClearBoard = () => {
    setBoardId('');
  };

  const gradeOptions = gradeData?.map((each) => {
    return (
      <Option key={each?.id} value={each.grade_id}>
        {each?.grade__grade_name}
      </Option>
    );
  });
  const subjectOptions = subjectData?.map((each) => {
    return (
      <Option key={each?.id} value={each.subject_id}>
        {each?.subject_name}
      </Option>
    );
  });
  const boardOptions = boardListData?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.board_name}
      </Option>
    );
  });

  useEffect(() => {
    if (moduleId) {
      fetchGradeData();
      fetchBoardListData();
    }
  }, [moduleId]);

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
    if (subjectId && boardId) {
      fetchAnnualPlanData({
        grade_id: gradeId,
        subject_id: subjectId,
        acad_session_id: selectedBranch?.id,
        board_id: boardId,
      });
    }
  }, [subjectId, boardId]);

  return (
    <>
      <div className='row'>
        <div className='col-12'>
          <Form id='filterForm' ref={formRef} layout={'horizontal'}>
            <div className='row align-items-center'>
              <div className='col-md-2 col-6 px-0'>
                <div className='mb-2 text-left'>Grade</div>
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
                    onChange={(e, value) => {
                      handleGrade(value);
                    }}
                    onClear={handleClearGrade}
                    className='w-100 text-left th-black-1 th-bg-white th-br-4'
                    bordered={false}
                  >
                    {gradeOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-md-2 col-6 pr-0 px-0 pl-md-3'>
                <div className='mb-2 text-left'>Subject</div>
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
                    onClear={handleClearSubject}
                    className='w-100 text-left th-black-1 th-bg-white th-br-4'
                    bordered={false}
                  >
                    {subjectOptions}
                  </Select>
                </Form.Item>
              </div>
              {boardFilterArr.includes(window.location.host) && (
                <div className='col-md-2 col-6 pr-0 px-0 pl-md-3'>
                  <div className='mb-2 text-left'>Board</div>
                  <Form.Item name='board'>
                    <Select
                      placeholder='Select Board'
                      showSearch
                      // mode='multiple'
                      // maxTagCount={2}
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e) => {
                        handleBoard(e);
                      }}
                      onClear={handleClearBoard}
                      className='w-100 text-left th-black-1 th-bg-white th-br-4'
                      bordered={false}
                    >
                      {boardOptions}
                    </Select>
                  </Form.Item>
                </div>
              )}
            </div>
          </Form>
        </div>
        {loading ? (
          <div className='row justify-content-center mt-5'>
            <Spin title='Loading...' />
          </div>
        ) : annualPlanData.length > 0 ? (
          <div className='row p-2'>
            {annualPlanData?.map((item, i) => (
              <div className='col-md-6 p-2'>
                <div
                  className='th-br-6 shadow-sm th-pointer volume-card'
                  style={{ border: '1px solid #d9d9d9', height: 250 }}
                  onClick={() =>
                    history.push({
                      pathname: '/lesson-plan-module-view',
                      state: {
                        gradeID: gradeId,
                        gradeName,
                        subjectID: subjectId,
                        subjectName,
                        boardID: boardId,
                        volumeName: item.volume_name,
                        volumeID: item.volume_id,
                        centralAcademicYearID: item.central_academic_year_id,
                      },
                    })
                  }
                >
                  <div
                    className='row px-3 py-1 th-bg-primary th-white th-fw-700'
                    style={{
                      borderBottom: '1px solid #d9d9d9',
                      borderRadius: '6px 6px 0 0',
                    }}
                  >
                    {item?.volume_name}
                  </div>
                  <div className=' p-2 th-black-2'>
                    <div className='row px-2 th-fw-600'>
                      <div className='col-md-4 col-8 text-md-right pl-0'>
                        Total Teaching Periods{' '}
                      </div>
                      <div className='col-md-6 col-4 th-18'>
                        {item?.total_teaching_periods}
                      </div>
                    </div>
                    <div className='row py-2 th-fw-600'>
                      <div className='col-md-4 col-8 text-md-right'>Total Chapters</div>
                      <div className='col-md-6 col-4 th-18 '>
                        {item?.chapter_name?.length}
                      </div>
                    </div>
                    <div className='th-grey th-14 col-12 px-0'>
                      {item.chapter_name?.slice(0, 4).map((each, i) => {
                        return (
                          <div className='row pt-1'>
                            <div className='col-5 text-right pl-4'> Chapter{i + 1}: </div>
                            <div className='col-6 pl-1'>{each}</div>
                          </div>
                        );
                      })}
                      {item?.chapter_name?.length > 5 ? (
                        <div className='row'>
                          <div className='col-5'>{''}</div>
                          <div className='col-6 th-primary pt-1 pl-1'>
                            View {item?.chapter_name.length - 5} more{' '}
                            <CaretDownOutlined className='th-grey ml-1' />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='row justify-content-center mt-5'>
            <img src={NoDataIcon} />
          </div>
        )}
      </div>
    </>
  );
};

export default AnnualPlan;
