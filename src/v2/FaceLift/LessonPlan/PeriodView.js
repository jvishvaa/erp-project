import React, { useState, useEffect, createRef, Fragment } from 'react';
import { Select, Form, message, Drawer, Spin, Divider, Button } from 'antd';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
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
  const [volumeListData, setVolumeListData] = useState([]);
  const [volumeId, setVolumeId] = useState('');
  const [volumeName, setVolumeName] = useState('');
  const [boardListData, setBoardListData] = useState([]);
  const [boardId, setBoardId] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [centralAcademicYearID, setCentralAcademicYearID] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  let isStudent = window.location.pathname.includes('student-view');
  let boardFilterArr = [
    'orchids.letseduvate.com',
    'localhost:3000',
    'localhost:3001',
    'dev.olvorchidnaigaon.letseduvate.com',
    'ui-revamp1.letseduvate.com',
    'qa.olvorchidnaigaon.letseduvate.com',
  ];
  const getSubjectIcon = (subject) => {
    switch (subject) {
      case 'maths':
        return mathsIcon;
      case 'science':
        return scienceIcon;
      case 'english':
        return languageIcon;
      case 'hindi':
        return languageIcon;
      case 'sports':
        return sportIcon;
      case 'music':
        return musicIcon;
      case 'evs':
        return evsIcon;
      case 'sst':
        return sstIcon;
      case 'French':
        return languageIcon;
      case 'dance':
        return danceIcon;
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
          // if (!boardFilterArr.includes(window.location.host)) {
          let data = result?.data?.result?.filter(
            (item) => item?.board_name === 'CBSE'
          )[0];
          setBoardId(data?.id);
          // }
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
    // setFiltered(true);
    setSelectedSubject('');
    axios
      .get(`/academic/period-view/lp-overview/`, {
        params: { ...params },
      })
      .then((res) => {
        if (res?.data?.status === 200) {
          setPeriodData(res?.data?.data);
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
  const handlevolume = (e) => {
    setVolumeId(e.value);
    setVolumeName(e.children);
  };
  const handleClearVolume = () => {
    setVolumeId('');
    setVolumeName('');
  };

  useEffect(() => {
    // fetchVolumeListData();
    fetchBoardListData();
    fetchResourceYear();
  }, []);

  useEffect(() => {
    if (boardId) {
      fetchPeriodData({
        acad_session_id: selectedBranch?.id,
        board_id: boardId,
      });
    }
  }, [boardId]);

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
        {loading ? (
          <div className='row justify-content-center my-3'>
            <Spin title='Loading...' />
          </div>
        ) : !isStudent ? (
          <>
            <div className='row'>
              {periodData.length > 0 ? (
                <>
                  {periodData.length > 1 && (
                    <>
                      <div className='col-md-2 col-6'>
                        <Button
                          className={`${
                            selectedSubject == '' ? 'th-button-active' : 'th-button'
                          } th-width-100 th-br-6 mt-2`}
                          onClick={() => setSelectedSubject('')}
                        >
                          All Subjects
                        </Button>
                      </div>

                      {periodData?.map((item, i) => (
                        <div className='col-md-2 col-6'>
                          <Button
                            className={`${
                              item?.subject_id == selectedSubject
                                ? 'th-button-active'
                                : 'th-button'
                            } th-width-100 th-br-6 mt-2`}
                            onClick={() => setSelectedSubject(item?.subject_id)}
                          >
                            {item?.subject_name}
                          </Button>
                        </div>
                      ))}
                    </>
                  )}
                  <div
                    className='col-12 mt-3'
                    style={{ maxHeight: 400, overflowY: 'scroll' }}
                  >
                    {periodData
                      ?.filter((item) => {
                        if (selectedSubject) {
                          return item?.subject_id == selectedSubject;
                        } else {
                          return item;
                        }
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
                                <div className='col-md-4 pl-0 mt-2'>
                                  <div
                                    className='th-br-20 th-bg-grey period-card'
                                    style={{ border: '1px solid #d9d9d9' }}
                                  >
                                    <div
                                      className='row p-3 th-bg-pink align-items-center th-black-1'
                                      style={{ borderRadius: '20px 20px 0 0' }}
                                    >
                                      <div className='col-6 px-0'>
                                        <img
                                          src={getSubjectIcon(
                                            (each?.subject_name).toLowerCase()
                                          )}
                                          height='30'
                                          className='mb-1'
                                        />
                                        <span className='th-18 th-fw-700 ml-2 text-capitalize'>
                                          {item?.grade_name}
                                        </span>
                                      </div>
                                      <div className='col-6 px-0 th-16 text-right th-fw-700'>
                                        {each?.subject_name}
                                      </div>
                                    </div>

                                    <div className='row pl-3 pt-4'>
                                      <span className='th-fw-600'>
                                        Total Periods &nbsp;
                                      </span>{' '}
                                      {item?.total_teaching_periods}
                                    </div>
                                    <div className='row pl-3'>
                                      <div className='th-fw-600 col-md-2 col-3 px-0'>
                                        Sections
                                      </div>
                                      <div className='col-md-10 col-9 text-truncate px-0'>
                                        {item?.sections
                                          ?.map((item) => item?.slice(-1).toUpperCase())
                                          .join(', ')}
                                      </div>
                                    </div>
                                    <div className='row pl-3'>
                                      <div className='th-fw-600 col-3 px-0'>
                                        Current Chapter
                                      </div>
                                      <div className='col-9 pl-2'>
                                        {item?.last_completed_chapter_name} in{' '}
                                        {item?.last_completed_volume_name}
                                      </div>
                                    </div>
                                    <div
                                      className='row my-2 align-items-center'
                                      style={{ borderTop: '1px solid #d9d9d9' }}
                                    >
                                      <div className='col-7 text-left th-12 pt-2 pb-1 pl-3 pr-0'>
                                        Updated On :{' '}
                                        {moment(item?.last_completed_at).format(
                                          'DD/MM/YYYY'
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
                                                ? '/lesson-plan/teacher-view/list-view'
                                                : '/lesson-plan/student-view/list-view',
                                              state: {
                                                gradeID: item?.grade_id,
                                                gradeName: item?.grade_name,
                                                subjectID: each?.subject_id,
                                                subjectName: each?.subject_name,
                                                boardID: boardId,
                                                volumeName:
                                                  item?.last_completed_volume_name,
                                                volumeID: item?.last_completed_volume_id,
                                                centralAcademicYearID,
                                                chapterID:
                                                  item?.last_completed_chapter_id,
                                                chapterName:
                                                  item?.last_completed_chapter_name,
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
          </>
        ) : (
          <>
            {periodData.length > 0 ? (
              <div className='row pt-3' style={{ maxHeight: 400, overflowY: 'scroll' }}>
                {
                  periodData.map((each) =>
                    each?.data?.map((item) => (
                      <div className='col-md-4 pl-0 mt-2'>
                        <div
                          className='th-br-20 th-bg-grey'
                          style={{ border: '1px solid #d9d9d9' }}
                        >
                          <div
                            className='row p-2 th-bg-pink align-items-center th-black-1'
                            style={{ borderRadius: '20px 20px 0 0' }}
                          >
                            <div className='col-6 px-0'>
                              <img src={getSubjectIcon(each?.subject_name)} height='30' />
                              <span className='th-20 th-fw-700 ml-2 text-capitalize'>
                                {item?.grade_name}
                              </span>
                            </div>
                            <div className='col-6 px-0 th-16 text-left'>
                              {each?.subject_name}
                            </div>
                          </div>
                          <div className='row pl-3 pt-4'>
                            <span className='th-fw-600'>Teacher &nbsp;</span>{' '}
                            <span className='text-capitalize'>{item?.teacher_name}</span>
                          </div>

                          <div className='row pl-3'>
                            <span className='th-fw-600'>Total Periods &nbsp; </span>{' '}
                            {item?.total_teaching_periods}
                          </div>
                          <div className='row pl-3'>
                            <div className='th-fw-600 col-3 px-0'>Current Chapter</div>
                            <div className='col-9 pl-2'>
                              {item?.last_completed_chapter_name} in{' '}
                              {item?.last_completed_volume_name}
                            </div>
                          </div>

                          <div
                            className='row my-2 align-items-center'
                            style={{ borderTop: '1px solid #d9d9d9' }}
                          >
                            <div className='col-7 text-left th-12 pt-2 pb-1 pl-3 pr-0'>
                              Updated on :{' '}
                              {moment(item?.last_completed_at).format('DD/MM/YYYY')}
                            </div>
                            <div className='col-5 text-right th-fw-600 pt-2 pb-1'>
                              <div
                                className='badge p-2 th-br-10 th-bg-pink th-pointer '
                                onClick={() =>
                                  history.push({
                                    pathname: window.location.pathname.includes(
                                      'teacher-view'
                                    )
                                      ? '/lesson-plan/teacher-view/list-view'
                                      : '/lesson-plan/student-view/list-view',
                                    state: {
                                      gradeID: item?.grade_id,
                                      gradeName: item?.grade_name,
                                      subjectID: each?.subject_id,
                                      subjectName: each?.subject_name,
                                      boardID: boardId,
                                      volumeName: item?.last_completed_volume_name,
                                      volumeID: item?.last_completed_volume_id,
                                      centralAcademicYearID,
                                      chapterID: item?.last_completed_chapter_id,
                                      chapterName: item?.last_completed_chapter_name,
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
                  )

                  // );
                }
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
