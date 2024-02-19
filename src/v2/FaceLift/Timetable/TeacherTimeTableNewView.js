import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Button, message } from 'antd';
import axios from 'v2/config/axios';
import { withRouter, useHistory } from 'react-router-dom';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';

const TeacherTimeTableNewView = withRouter(
  ({ currentWeekTimeTable, startDate, endDate, allowAutoAssignDiary, sectionList }) => {
    const selectedBranch = useSelector(
      (state) => state.commonFilterReducer?.selectedBranch
    );
    const today = new Date();
    const history = useHistory();
    const [currentDay, setCurrentDay] = useState();
    const [loading, setLoading] = useState(false);
    const [currentDiaryId, setCurrentDiaryId] = useState();
    const [currentDayPeriodData, setCurrentDayPeriodData] = useState();
    const days = Object.keys(currentWeekTimeTable)?.map((item) =>
      moment(item).format('dddd')
    );
    const userDetails = JSON.parse(localStorage?.getItem('userDetails'));
    const [userId, setUserId] = useState();
    const fetchDiaryDetails = (diaryId) => {
      setLoading(true);
      axios
        .get(`${endpoints?.dailyDiary?.newDiaryList}?diary_id=${diaryId}`)
        .then((response) => {
          if (response?.data?.status_code == 200) {
            let diaryData = response.data?.result[0];
            history.push({
              pathname: '/create/diary',
              state: {
                data: diaryData?.grade_data[0],
                subject: diaryData,
                isDiaryEdit: true,
                isDiaryAutoAssign: diaryData?.grade_data?.teacher_report?.homework
                  ? true
                  : false,
              },
            });
          }
        })
        .catch((error) => {
          message.error(error?.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    useEffect(() => {
      setUserId(userDetails?.user_id);
      let showDate =
        Object.keys(currentWeekTimeTable)?.filter(
          (item) =>
            moment(item).format('YYYY-MM-DD') === moment(today).format('YYYY-MM-DD')
        )?.[0] ?? moment(Object.keys(currentWeekTimeTable)?.[0])?.format('YYYY-MM-DD');
      setCurrentDay(moment(showDate).format('dddd'));
      setCurrentDayPeriodData(currentWeekTimeTable?.[showDate]);
    }, [currentWeekTimeTable]);

    let periodSlots = currentDayPeriodData?.map((item) => item?.slot) ?? [];

    const allLectures = Object.keys(currentWeekTimeTable)
      .map((item) => currentWeekTimeTable?.[item])
      .flat();

    let periodData = {};

    allLectures.forEach((lecture) => {
      const { slot, date, sub } = lecture;
      const slotName = slot?.name;

      if (!periodData[slotName]) {
        periodData[slotName] = [];
      }

      periodData[slotName].push({
        date,
        period: slotName,
        subject: sub,
        grade_section:
          lecture?.sec_map[0]?.grade_sec?.grade +
          ' ' +
          lecture?.sec_map[0]?.grade_sec?.section,
        teacher: lecture.sub_teacher.map((t) => t?.name).join(', '),
        dairy_details: lecture.dairy_details,
        holidays: lecture?.holidays,
        sectionDetails: lecture?.sec_map[0]?.grade_sec,
        sujectDetails: lecture?.sub,
      });
    });

    Object.keys(periodData).forEach((periodName) => {
      const period = periodData[periodName];

      for (let date = startDate; date <= endDate; date = getNextDate(date)) {
        if (!period.some((lecture) => lecture?.date === date)) {
          period.push({
            date,
            period: periodName,
            subject: '',
            grade_section: '',
            teacher: '',
            dairy_details: [],
            holidays: [],
          });
        }
      }
      period.sort((a, b) => a.date.localeCompare(b.date));
    });

    function getNextDate(currentDate) {
      const current = new Date(currentDate);
      current.setDate(current.getDate() + 1);
      return current.toISOString().split('T')[0];
    }

    const filterUniqueObjects = (arr) => {
      return Object.values(
        arr.reduce((acc, obj) => {
          const key = obj.date;
          if (!acc[key]) {
            acc[key] = obj;
          }
          return acc;
        }, {})
      );
    };
    return (
      <>
        <div className='tablewrap'>
          <table style={{ minHeight: '50vh' }} className='tableCon'>
            <thead>
              <tr
                className='headerarea '
                style={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: '10px 10px 0px 0px',
                  color: '#000',
                }}
              >
                <th
                  className='fixedcol tableH'
                  style={{ verticalAlign: 'middle', borderRadius: '10px 0px 0px 0px' }}
                >
                  <div className='th-14 th-fw-600 '>Periods</div>
                </th>
                {days?.length > 0 &&
                  days?.map((item, index) => (
                    <th
                      className=''
                      style={{
                        padding: '15px 5px',
                        borderRadius:
                          index == days?.length - 1 ? '0px 10px 0px 0px' : null,
                        background: currentDay == item ? '#1b4ccb' : 'inherit',
                        borderRadius: currentDay == item ? '8px' : null,
                      }}
                    >
                      <div
                        onClick={() => {
                          setCurrentDay(item);
                          let date = Object.keys(currentWeekTimeTable)?.find(
                            (el) => moment(el)?.format('dddd') === item
                          );
                          setCurrentDayPeriodData(currentWeekTimeTable?.[date]);
                        }}
                        style={{
                          margin: '2px',
                          color: currentDay == item ? 'white' : 'black',
                        }}
                      >
                        <div className='d-flex justify-content-center th-pointer'>
                          {item}
                        </div>
                      </div>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {periodSlots?.length > 0 ? (
                periodSlots?.map((item, index) => {
                  const periodDetails = filterUniqueObjects(
                    periodData[item?.name]
                  )?.slice(0, 7);
                  return (
                    <tr className='tableR' style={{ borderTop: 0 }}>
                      <>
                        <td
                          className='fixedcol tableD'
                          style={{
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            padding: 0,
                          }}
                        >
                          <div
                            className='d-flex justify-content-center flex-column'
                            style={{
                              height: '100px',
                              background: '#1b4ccb',
                              borderRadius: 5,
                              color: 'white',
                            }}
                          >
                            <div className='mb-2 text-truncate' title={item?.name}>
                              <span className='th-fw-600'>{item?.name}</span>
                            </div>
                            <div>
                              <span className='th-fw-500 th-12'>{`${moment(
                                item?.start,
                                'hh:mm:ss'
                              ).format('hh:mm A')} - ${moment(
                                item?.end,
                                'hh:mm:ss'
                              ).format('hh:mm A')} `}</span>
                            </div>
                          </div>
                        </td>
                        {periodDetails?.map((eachPeriod, index) => {
                          return (
                            <td
                              className='tableD'
                              style={{
                                verticalAlign: 'middle',
                              }}
                            >
                              <div
                                className={`card w-100 d-flex justify-content-center p-2 flex-column`}
                                style={{
                                  height: '100px',
                                }}
                              >
                                {eachPeriod?.holidays?.length > 0 ? (
                                  <div className='mb-2 th-18 th-fw-600 th-green-1 d-flex flex-column justify-content-center h-100'>
                                    Holiday
                                    <div
                                      className='th-grey th-12 text-truncate'
                                      title={eachPeriod?.holidays[0]?.title}
                                      style={{ cursor: 'default' }}
                                    >
                                      {eachPeriod?.holidays[0]?.title}
                                    </div>
                                  </div>
                                ) : eachPeriod?.subject ? (
                                  <>
                                    <div
                                      className=' text-truncate'
                                      title={eachPeriod?.subject
                                        ?.map((el) => el?.subject_name)
                                        .join(', ')}
                                    >
                                      <span className='th-fw-600'>
                                        {eachPeriod?.subject
                                          ?.map((el) => el?.subject_name)
                                          .join(', ')}
                                      </span>
                                    </div>
                                    <div
                                      className='text-truncate'
                                      title={eachPeriod?.grade_section}
                                    >
                                      <span className='th-12 th-fw-500'>
                                        {eachPeriod?.grade_section}
                                      </span>
                                    </div>
                                    {moment(eachPeriod?.date).format('DD/MM/YYYY') ===
                                    moment(today).format('DD/MM/YYYY') ? (
                                    <div className='text-truncate py-1'>
                                      <Button
                                        type='default'
                                        loading={
                                          loading &&
                                          currentDiaryId ===
                                            eachPeriod?.dairy_details[0]?.id
                                        }
                                        // onMouseEnter={()=>}
                                        className='th-12 th-br-8 px-2 th-bg-grey'
                                        onClick={() => {
                                          if (eachPeriod?.dairy_details?.length > 0) {
                                            const createdByCurrentUser =
                                              eachPeriod.dairy_details.some(
                                                (detail) => detail.created_by === userId
                                              );
                                            if (createdByCurrentUser) {
                                              setCurrentDiaryId(
                                                eachPeriod?.dairy_details[0]?.id
                                              );
                                              fetchDiaryDetails(
                                                eachPeriod?.dairy_details[0]?.id
                                              );
                                            } else {
                                              history.push({
                                                pathname: '/diary/teacher',
                                                state: {
                                                  eachPeriod: eachPeriod,
                                                },
                                              });
                                            }
                                          } else {
                                            history.push({
                                              pathname: '/create/diary',
                                              state: {
                                                comingFromTimetable: true,
                                                data: {
                                                  academic_year_id: selectedBranch?.id,
                                                  branch_id: selectedBranch?.branch?.id,
                                                  branch_name:
                                                    selectedBranch?.branch?.branch_name,
                                                  diary_type: '2',
                                                  grade_id:
                                                    eachPeriod?.sectionDetails?.grade_id,
                                                  grade_name:
                                                    eachPeriod?.sectionDetails?.grade,
                                                  is_substitute_diary: false,
                                                  section_id:
                                                    eachPeriod?.sectionDetails
                                                      ?.section_id,
                                                  section_mapping_id: sectionList?.find(
                                                    (item) =>
                                                      item?.section_id ==
                                                      eachPeriod?.sectionDetails
                                                        ?.section_id
                                                  )?.id,
                                                  section_name:
                                                    eachPeriod?.sectionDetails?.section,
                                                  session_year:
                                                    selectedBranch?.session_year
                                                      ?.session_year,
                                                  session_year_id:
                                                    selectedBranch?.session_year?.id,
                                                  substitute: false,
                                                },
                                              },
                                            });
                                          }
                                        }}
                                      >
                                        {eachPeriod?.dairy_details?.length > 0
                                          ? eachPeriod?.dairy_details?.some((detail) =>
                                              eachPeriod?.subject?.some(
                                                (sub) =>
                                                  sub.subject_id === detail.subject_id
                                              )
                                            )
                                            ? 'View Diary'
                                            : '+ Add Diary & HW'
                                          : moment(eachPeriod?.date).format(
                                              'DD/MM/YYYY'
                                            ) === moment(today).format('DD/MM/YYYY')
                                          ? '+ Add Diary & HW'
                                          : ''}
                                      </Button>
                                    </div> ) : ""}
                                  </>
                                ) : (
                                  <div className='mb-2 text-truncate th-12 th-grey-1'>
                                    No Classes Assigned
                                  </div>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colspan='8'>
                    <div className='d-flex justify-content-center'>
                      <span className='th-grey th-30 th-fw-500'>
                        No classes assigned for today !
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  }
);

export default connect()(TeacherTimeTableNewView);
