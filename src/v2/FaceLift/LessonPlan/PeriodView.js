import React, { useState, useEffect, createRef, Fragment } from 'react';
import { Select, Form, message, Tooltip, Spin, Divider, Button } from 'antd';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.css';
import axiosInstance from 'axios';
import { useHistory } from 'react-router-dom';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import mathsIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/Maths.png';
import danceIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/dance.png';
import languageIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/Language.png';
import musicIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/music.png';
import scienceIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/science.png';
import sportIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/Sport.png';
import evsIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/evs.png';
import sstIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/sst.png';
import artIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/art.png';
import computerIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/computer.png';
import otherSubjectIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/PeriodViewIcons/othersubjects.png';
import moment from 'moment';
const { Option } = Select;

const PeriodView = () => {
  const formRef = createRef();
  const history = useHistory();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [periodData, setPeriodData] = useState([]);
  const [boardListData, setBoardListData] = useState([]);
  const [boardId, setBoardId] = useState('');
  const [loading, setLoading] = useState(false);
  const [centralAcademicYearID, setCentralAcademicYearID] = useState();
  const [subjectData, setSubjectData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showSubjectCount, setShowSubjectCount] = useState(11);
  const [subject, setSubject] = useState('');
  let isStudent = window.location.pathname.includes('student-view');
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
  let boardFilterArr = [
    'orchids.letseduvate.com',
    'localhost:3000',
    'localhost:3001',
    'dev.olvorchidnaigaon.letseduvate.com',
    'ui-revamp1.letseduvate.com',
    'qa.olvorchidnaigaon.letseduvate.com',
  ];
  const getSubject = (value) => {
    if (['maths', 'mathematics', 'numeracy', 'math'].includes(value)) {
      return 'maths';
    } else if (
      [
        'english',
        'hindi',
        'french',
        'literacy',
        'marathi',
        'kannada',
        'sanskrit',
        'bengali',
        'tamil',
        'telugu',
        'english reading',
        'rhymes',
        'story telling',
      ].includes(value)
    ) {
      return 'language';
    } else if (
      [
        'sst',
        'social science',
        'geography',
        'history',
        'social studies',
        'economic',
        'business studies',
      ].includes(value)
    ) {
      return 'sst';
    } else if (['evs', 'environmental studies'].includes(value)) {
      return 'evs';
    } else if (['music', 'music & rhymes'].includes(value)) {
      return 'music';
    } else if (['dance'].includes(value)) {
      return 'dance';
    } else if (
      [
        'pe',
        'physical education',
        'skating',
        'team sport',
        'taekwondo',
        'swimming',
        'karate',
        'chess',
      ].includes(value)
    ) {
      return 'sports';
    } else if (
      [
        'science',
        'natural science',
        'physics',
        'chemistry',
        'biology',
        'robotics',
      ].includes(value)
    ) {
      return 'science';
    } else if (['visual arts', 'arts education'].includes(value)) {
      return 'art';
    } else if (['computer', 'computer science', 'robotics'].includes(value)) {
      return 'computer';
    } else {
      return;
    }
  };
  const getSubjectIcon = (value) => {
    const subject = getSubject(value);

    switch (subject) {
      case 'maths':
        return mathsIcon;
      case 'language':
        return languageIcon;
      case 'sports':
        return sportIcon;
      case 'music':
        return musicIcon;
      case 'evs':
        return evsIcon;
      case 'sst':
        return sstIcon;
      case 'dance':
        return danceIcon;
      case 'science':
        return scienceIcon;
      case 'art':
        return artIcon;
      case 'computer':
        return computerIcon;
      default:
        return otherSubjectIcon;
    }
  };
  const fetchBoardListData = () => {
    setLoading(true);
    axios
      .get(`/academic/get-board-list/`)
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setBoardListData(result?.data?.result);
          let data = result?.data?.result?.filter(
            (item) => item?.board_name === 'CBSE'
          )[0];
          setBoardId(data?.id);
          setLoading(false);
        }
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
      });
  };
  const fetchResourceYear = () => {
    axiosInstance
      .get(`${endpoints.lessonPlan.academicYearList}`, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setCentralAcademicYearID(
            result?.data?.result?.results?.filter(
              (item) => item?.session_year == selectedAcademicYear.session_year
            )[0]?.id
          );
        }
      })
      .catch((error) => {
        message.error(error?.message);
      });
  };
  const fetchPeriodData = (params = {}) => {
    setLoading(true);
    setSelectedSubject('');
    axios
      .get(`/academic/period-view/lp-overview/`, {
        params: { ...params },
      })
      .then((res) => {
        if (res?.data?.status === 200) {
          setPeriodData(res?.data?.data);
          setSelectedSubject(res?.data?.data[0]?.subject_id);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        message.error(error.message);
      });
  };
  const boardOptions = boardListData?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.board_name}
      </Option>
    );
  });

  const handleBoard = (e) => {
    setBoardId(e);
  };
  const handleClearBoard = () => {
    setBoardId('');
  };
  const fetchSubjectData = (params = {}) => {
    setLoading(true);
    axios
      .get(`/erp_user/v1/subjects-lp-view/`, {
        params: { ...params },
      })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          if (res?.data?.result.length > 0) {
            setSubjectData(res?.data?.result);
            setSubject(res?.data?.result[0]);
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBoardListData();
    fetchResourceYear();
  }, []);

  useEffect(() => {
    if (boardId) {
      if (user_level == 13 || user_level == 11) {
        fetchPeriodData({
          acad_session_id: selectedBranch?.id,
          board_id: boardId,
        });
      } else {
        fetchSubjectData();
      }
    }
  }, [boardId]);
  useEffect(() => {
    if (subject) {
      fetchPeriodData({
        acad_session_id: selectedBranch?.id,
        board_id: boardId,
        subject_id: subject?.id,
      });
    }
  }, [subject]);
  return (
    <div className='row'>
      {boardFilterArr.includes(window.location.host) && (
        <div className='col-12'>
          <Form id='filterForm' ref={formRef} layout={'horizontal'}>
            <div className='row align-items-center'>
              <div className='col-md-2 col-6 pl-0'>
                <div className='mb-2 text-left'>Board</div>
                <Form.Item name='board'>
                  <Select
                    placeholder='Select Board'
                    showSearch
                    defaultValue={'CBSE'}
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
                    className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    bordered={false}
                  >
                    {boardOptions}
                  </Select>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      )}

      <div className='row'>
        {loading && !subject ? (
          <div className='row justify-content-center my-3'>
            <Spin title='Loading...' />
          </div>
        ) : !isStudent ? (
          <>
            {user_level !== 11
              ? subjectData?.slice(0, showSubjectCount).map((item, i) => (
                  <div className='col-md-2 col-6'>
                    <Button
                      className={`${
                        item?.id == subject?.id ? 'th-button-active' : 'th-button'
                      } th-width-100 th-br-6 mt-2 text-truncate th-pointer`}
                      onClick={() => setSubject(item)}
                    >
                      <span>{item?.subject_name}</span>
                    </Button>
                  </div>
                ))
              : ''}
            {subjectData.length > 11 && (
              <div className='col-md-2 col-6 th-pointer'>
                <Button
                  className='th-button th-width-100 th-br-6 mt-2 text-truncate'
                  onClick={() => {
                    showSubjectCount == subjectData.length
                      ? setShowSubjectCount(11)
                      : setShowSubjectCount(subjectData.length);
                  }}
                >
                  Show {showSubjectCount == subjectData.length ? 'Less' : 'All'}
                </Button>
              </div>
            )}

            {loading ? (
              <div className='row justify-content-center py-3 mt-5'>
                <Spin title='Loading...' />
              </div>
            ) : (
              <div className='row'>
                {periodData.length > 0 ? (
                  <>
                    {periodData.length > 1 && (
                      <>
                        {periodData?.slice(0, showSubjectCount).map((item, i) => (
                          <div className='col-md-2 col-6'>
                            <Button
                              className={`${
                                item?.subject_id == selectedSubject
                                  ? 'th-button-active'
                                  : 'th-button'
                              } th-width-100 th-br-6 mt-2 text-truncate`}
                              onClick={() => setSelectedSubject(item?.subject_id)}
                            >
                              {item?.subject_name}
                            </Button>
                          </div>
                        ))}
                        {periodData.length > 11 && (
                          <div className='col-md-2 col-6 th-pointer'>
                            <Button
                              className='th-button th-width-100 th-br-6 mt-2 text-truncate'
                              onClick={() => {
                                showSubjectCount == periodData.length
                                  ? setShowSubjectCount(11)
                                  : setShowSubjectCount(periodData.length);
                              }}
                            >
                              Show{' '}
                              {showSubjectCount == periodData.length ? 'Less' : 'All'}
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                    <div
                      className='col-12 mt-3'
                      style={{ maxHeight: 400, overflowY: 'scroll' }}
                    >
                      {periodData
                        ?.filter((item) => {
                          // if (selectedSubject) {
                          return item?.subject_id == selectedSubject;
                          //   } else {
                          //     return item;
                          //   }
                        })
                        .map((each) => {
                          return (
                            <div className='row py-2 px-0 th-black-1 th-divider'>
                              <Divider
                                className=''
                                orientation='left'
                                orientationMargin='0'
                              >
                                <span className='th-fw-700 th-22'>
                                  {each?.subject_name}
                                </span>
                              </Divider>
                              {each?.data?.map((item) => {
                                return (
                                  <div className='col-lg-4 col-md-6 pl-0 mt-2'>
                                    <div
                                      className='th-br-20 th-bg-grey period-card'
                                      style={{ border: '1px solid #d9d9d9' }}
                                    >
                                      <div
                                        className='row p-3 th-bg-pink align-items-center th-black-1'
                                        style={{ borderRadius: '20px 20px 0 0' }}
                                      >
                                        <div className='col-8 pl-0 text-truncate'>
                                          <img
                                            src={getSubjectIcon(
                                              (each?.subject_name).toLowerCase()
                                            )}
                                            height='30'
                                            className='mb-1'
                                          />
                                          <Tooltip
                                            placement='topLeft'
                                            title={item?.grade_name}
                                          >
                                            <span className='th-18 th-fw-700 ml-2 text-capitalize'>
                                              {item?.grade_name}
                                            </span>
                                          </Tooltip>
                                        </div>
                                        <div className='col-4 px-0 th-16 text-right th-fw-700 text-truncate'>
                                          <Tooltip
                                            placement='topRight'
                                            title={each?.subject_name}
                                          >
                                            {each?.subject_name}
                                          </Tooltip>
                                        </div>
                                      </div>

                                      <div className='row pl-3 pt-4'>
                                        <div className='th-fw-600 col-4 px-0'>
                                          Total Periods
                                        </div>
                                        <div className='col-8 text-truncate px-2'>
                                          {item?.next_volume_name
                                            ? `${item?.total_teaching_periods} in ${item?.next_volume_name}`
                                            : item?.total_teaching_periods}
                                        </div>
                                      </div>
                                      <div className='row pl-3'>
                                        <div className='th-fw-600 col-4 px-0'>
                                          Sections
                                        </div>
                                        <div className='col-8 text-truncate px-2'>
                                          {item?.sections
                                            ?.map((item) => item?.slice(-1).toUpperCase())
                                            .join(', ')}
                                        </div>
                                      </div>
                                      <div
                                        className='row pl-2 pt-1'
                                        style={{
                                          height: 60,
                                        }}
                                      >
                                        <div className='th-fw-600 col-4 px-0'>
                                          <div className='badge th-fw-600 p-2 th-br-10 th-14 th-bg-pink'>
                                            Next Period
                                          </div>
                                        </div>
                                        {/* <div> */}
                                        {item?.next_period_name ? (
                                          <div className='col-8 pl-2 th-truncate'>
                                            <div>
                                              <div className='text-truncate'>
                                                {item?.next_period_name},
                                                {item?.next_topic_name}{' '}
                                              </div>
                                              <div
                                                className='th-grey'
                                                style={{
                                                  fontStyle: 'italic',
                                                  lineHeight: '15px',
                                                }}
                                              >
                                                {item?.next_chapter_name}
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className='col-8 pl-2'>
                                            {item?.total_teaching_periods > 0 ? (
                                              <div className='th-fw-500 th-green'>
                                                Last period is{' '}
                                                <span className=''>completed</span>
                                              </div>
                                            ) : null}
                                          </div>
                                        )}
                                      </div>
                                      <div
                                        className='row my-2 align-items-center'
                                        style={{ borderTop: '1px solid #d9d9d9' }}
                                      >
                                        <div className='col-7 text-left th-12 pt-2 pb-1 pl-3 pr-0'>
                                          {item?.last_completed_at ? (
                                            `Updated On :
                                        ${moment(item?.last_completed_at).format(
                                          'DD/MM/YYYY'
                                        )}`
                                          ) : (
                                            <span className='th-red'>Yet to start</span>
                                          )}
                                        </div>
                                        <div className='col-5 text-right th-fw-600 pt-2 pb-1'>
                                          <div
                                            // className='th-button p-2 th-bg-grey badge th-fw-500 th-br-10 th-pointer'
                                            className='badge p-2 th-br-10 th-bg-pink th-pointer '
                                            onClick={() =>
                                              history.push({
                                                pathname:
                                                  window.location.pathname.includes(
                                                    'teacher-view'
                                                  )
                                                    ? '/lesson-plan/teacher-view/period-view/list-view'
                                                    : '/lesson-plan/student-view/period-view/list-view',

                                                state: {
                                                  gradeID: item?.grade_id,
                                                  gradeName: item?.grade_name,
                                                  subjectID: each?.subject_id,
                                                  subjectName: each?.subject_name,
                                                  boardID: boardId,
                                                  volumeName: item?.next_volume_name
                                                    ? item?.next_volume_name
                                                    : item?.last_completed_volume_name,
                                                  volumeID: item?.next_volume_id
                                                    ? item?.next_volume_id
                                                    : item?.last_completed_volume_id,
                                                  centralAcademicYearID,
                                                  chapterID: item?.next_chapter_id
                                                    ? item?.next_chapter_id
                                                    : item?.last_completed_chapter_id,
                                                  chapterName: item?.next_chapter_name
                                                    ? item?.next_chapter_name
                                                    : item?.last_completed_chapter_name,
                                                  showTab: '1',
                                                  centralGSID: item?.central_gs_id,
                                                },
                                              })
                                            }
                                          >
                                            View Periods &gt;
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                    </div>
                  </>
                ) : (
                  <div className='row justify-content-center my-5'>
                    <img src={NoDataIcon} />
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {periodData.length > 0 ? (
              <div className='row p-3' style={{ maxHeight: 400, overflowY: 'scroll' }}>
                {periodData.map((each) =>
                  each?.data?.map((item) => (
                    <div className='col-lg-4 col-md-6 pl-0 mt-2'>
                      <div
                        className='th-br-20 th-bg-grey period-card'
                        style={{ border: '1px solid #d9d9d9' }}
                      >
                        <div
                          className='row p-3 th-bg-pink align-items-center th-black-1'
                          style={{ borderRadius: '20px 20px 0 0' }}
                        >
                          <div className='col-8 pl-0 text-truncate'>
                            <img
                              src={getSubjectIcon((each?.subject_name).toLowerCase())}
                              height='30'
                              className='mb-1'
                            />
                            <Tooltip placement='topLeft' title={each?.subject_name}>
                              <span className='th-18 th-fw-700 ml-2 text-capitalize'>
                                {each?.subject_name}
                              </span>
                            </Tooltip>
                          </div>
                          <div className='col-4 px-0 th-16 text-right th-fw-700 text-capitalize'>
                            <Tooltip placement='topLeft' title={item?.grade_name}>
                              {item?.grade_name}
                            </Tooltip>
                          </div>
                        </div>
                        <div className='row pl-3 pt-4'>
                          <div className='th-fw-600 col-4 px-0'>Teacher &nbsp;</div>{' '}
                          <div className='text-capitalize col-8 pl-2'>
                            {item?.teacher_name}
                          </div>
                        </div>

                        <div className='row pl-3'>
                          <div className='th-fw-600 col-4 px-0'>Total Periods </div>
                          <div className='col-8 pl-2'>
                            {item?.next_volume_name
                              ? `${item?.total_teaching_periods} in ${item?.next_volume_name}`
                              : item?.total_teaching_periods}
                          </div>
                        </div>
                        <div
                          className='row pl-2 pt-1'
                          style={{
                            height: 60,
                          }}
                        >
                          <div className='th-fw-600 col-4 px-0'>
                            <div className='badge th-fw-600 p-2 th-br-10 th-14 th-bg-pink'>
                              Next Period
                            </div>
                          </div>
                          {/* <div> */}
                          {item?.next_period_name ? (
                            <div className='col-8 pl-2 th-truncate'>
                              <div>
                                <div className='text-truncate'>
                                  {item?.next_period_name},{item?.next_topic_name}{' '}
                                </div>
                                <div
                                  className='th-grey'
                                  style={{
                                    fontStyle: 'italic',
                                    lineHeight: '15px',
                                  }}
                                >
                                  {item?.next_chapter_name}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className='col-8 pl-2'>
                              {item?.total_teaching_periods > 0 ? (
                                <div className='th-fw-500 th-green'>
                                  Last period is <span className=''>completed</span>
                                </div>
                              ) : null}
                            </div>
                          )}
                        </div>

                        <div
                          className='row my-2 align-items-center'
                          style={{ borderTop: '1px solid #d9d9d9' }}
                        >
                          <div className='col-7 text-left th-12 pt-2 pb-1 pl-3 pr-0'>
                            {item?.last_completed_at ? (
                              `Updated On :
                                        ${moment(item?.last_completed_at).format(
                                          'DD/MM/YYYY'
                                        )}`
                            ) : (
                              <span className='th-red'>Yet to start</span>
                            )}
                          </div>
                          <div className='col-5 text-right th-fw-600 pt-2 pb-1'>
                            <div
                              className='badge p-2 th-br-10 th-bg-pink th-pointer '
                              onClick={() =>
                                history.push({
                                  pathname: window.location.pathname.includes(
                                    'teacher-view'
                                  )
                                    ? '/lesson-plan/teacher-view/period-view/list-view'
                                    : '/lesson-plan/student-view/period-view/list-view',
                                  state: {
                                    gradeID: item?.grade_id,
                                    gradeName: item?.grade_name,
                                    subjectID: each?.subject_id,
                                    subjectName: each?.subject_name,
                                    boardID: boardId,
                                    volumeName: item?.next_volume_name
                                      ? item?.next_volume_name
                                      : item?.last_completed_volume_name,
                                    volumeID: item?.next_volume_id
                                      ? item?.next_volume_id
                                      : item?.last_completed_volume_id,
                                    centralAcademicYearID,
                                    chapterID: item?.next_chapter_id
                                      ? item?.next_chapter_id
                                      : item?.last_completed_chapter_id,
                                    chapterName: item?.next_chapter_name
                                      ? item?.next_chapter_name
                                      : item?.last_completed_chapter_name,
                                    showTab: '1',
                                    centralGSID: item?.central_gs_id,
                                  },
                                })
                              }
                            >
                              View Periods &gt;
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className='row justify-content-center my-4'>
                <img src={NoDataIcon} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PeriodView;
