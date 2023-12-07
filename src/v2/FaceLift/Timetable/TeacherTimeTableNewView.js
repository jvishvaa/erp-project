import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

const TeacherTimeTableNewView = withRouter(
  ({ currentWeekTimeTable, startDate, endDate }) => {
    const today = new Date();

    const [currentDay, setCurrentDay] = useState();
    const [currentDayPeriodData, setCurrentDayPeriodData] = useState();
    const days = Object.keys(currentWeekTimeTable)?.map((item) =>
      moment(item).format('dddd')
    );

    useEffect(() => {
      let showDate =
        Object.keys(currentWeekTimeTable)?.filter(
          (item) =>
            moment(item).format('YYYY-MM-DD') === moment(today).format('YYYY-MM-DD')
        )?.[0] ?? moment(Object.keys(currentWeekTimeTable)[0])?.format('YYYY-MM-DD');
      setCurrentDay(moment(showDate).format('dddd'));
      setCurrentDayPeriodData(currentWeekTimeTable[showDate]);
    }, [currentWeekTimeTable]);

    let periodSlots = currentDayPeriodData?.map((item) => item?.slot) ?? [];

    const allLectures = Object.keys(currentWeekTimeTable)
      .map((item) => currentWeekTimeTable[item])
      .flat();

    let periodData = {};

    allLectures.forEach((lecture) => {
      const { slot, date, sub } = lecture;
      const slotName = slot.name;

      if (!periodData[slotName]) {
        periodData[slotName] = [];
      }

      periodData[slotName].push({
        date,
        period: slotName,
        subject: sub?.map((el) => el?.subject_name).join(', '),
        grade_section:
          lecture?.sec_map[0]?.grade_sec?.grade +
          ' ' +
          lecture?.sec_map[0]?.grade_sec?.section,
        teacher: lecture.sub_teacher.map((t) => t?.name).join(', '),
      });
    });

    Object.keys(periodData).forEach((periodName) => {
      const period = periodData[periodName];

      for (let date = startDate; date <= endDate; date = getNextDate(date)) {
        if (!period.some((lecture) => lecture.date === date)) {
          period.push({
            date,
            period: periodName,
            subject: '',
            grade_section: '',
            teacher: '',
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
                  const periodDetails = periodData[item?.name].slice(0, 7);
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
                                className='card w-100 d-flex justify-content-center p-2 flex-column'
                                style={{
                                  height: '100px',
                                }}
                              >
                                {eachPeriod?.subject ? (
                                  // && moment(eachPeriod?.date).format('dddd') === days[index]
                                  <>
                                    <div
                                      className='mb-2 text-truncate'
                                      title={eachPeriod?.subject}
                                    >
                                      <span className='th-fw-600'>
                                        {eachPeriod?.subject}
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
