import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import moment from 'moment';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { handleDaytoText, handleTexttoWeekDay } from 'v2/weekdayConversions';

const TimeTableNewUI = withRouter(
  ({ currentWeekTimeTable, startDate, isTeacherView }) => {
    const [currentDay, setCurrentDay] = useState(currentWeekTimeTable?.[0]?.week_days);
    const [currentDayPeriodData, setCurrentDayPeriodData] = useState(
      currentWeekTimeTable?.filter(
        (item) => item?.week_days == handleTexttoWeekDay(moment(startDate).format('dddd'))
      )?.[0]
    );
    const days = currentWeekTimeTable?.map((item) => item?.week_days);
    let periodSlots = currentDayPeriodData?.period_slot ?? [];
    let slotLength = currentDayPeriodData?.period_slot.length;
    let periodData = [];
    for (let i = 0; i < slotLength; i++) {
      periodData.push(
        currentWeekTimeTable?.map((el) => el?.period_slot?.map((item) => item)[i])
      );
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
                          setCurrentDayPeriodData(
                            currentWeekTimeTable?.find((el) => el?.week_days === item)
                          );
                        }}
                        style={{
                          margin: '2px',
                          color: currentDay == item ? 'white' : 'black',
                        }}
                      >
                        <div className='d-flex justify-content-center th-pointer'>
                          {handleDaytoText(item)}
                        </div>
                      </div>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {periodSlots?.map((item, index) => (
                <tr className='tableR' style={{ borderTop: 0 }}>
                  <>
                    <td
                      className='fixedcol tableD'
                      style={{
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        paddingLeft: 0,
                      }}
                    >
                      <div
                        className='card w-100 d-flex justify-content-center p-2 flex-column'
                        style={{
                          height: '100px',
                          background: '#1b4ccb',
                          borderRadius: 5,
                          color: 'white',
                        }}
                      >
                        <div className='mb-2 text-truncate' title={item?.period_name}>
                          <span className='th-fw-600'>{item?.period_name}</span>
                        </div>
                        <div>
                          <span className='th-fw-500 th-12'>{`${moment(
                            item?.start_time,
                            'hh:mm:ss'
                          ).format('hh:mm A')} - ${moment(
                            item?.end_time,
                            'hh:mm:ss'
                          ).format('hh:mm A')} `}</span>
                        </div>
                      </div>
                    </td>
                    {periodData[index]?.map((each) => {
                      let eachPeriod = each?.periods[0];
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
                            {eachPeriod ? (
                              <>
                                <div
                                  className='mb-2 text-truncate'
                                  title={eachPeriod?.sub
                                    ?.map((el) => el?.subject_name)
                                    ?.join(',')}
                                >
                                  <span className='th-fw-600'>
                                    {eachPeriod?.sub
                                      ?.map((el) => el?.subject_name)
                                      ?.join(',')}
                                  </span>
                                </div>
                                {isTeacherView ? (
                                  <div
                                    className='text-truncate'
                                    title={eachPeriod?.sec_map
                                      ?.map(
                                        (el) =>
                                          `${el?.grade_sec?.grade} ${el?.grade_sec?.section}`
                                      )
                                      ?.join(',')}
                                  >
                                    <span className='th-12 th-fw-500'>
                                      {eachPeriod?.sec_map
                                        ?.map(
                                          (el) =>
                                            `${el?.grade_sec?.grade} ${el?.grade_sec?.section}`
                                        )
                                        ?.join(',')}
                                    </span>
                                  </div>
                                ) : (
                                  <div
                                    className='text-truncate'
                                    title={eachPeriod?.sub_teacher
                                      ?.map((el) => el?.name)
                                      ?.join(',')}
                                  >
                                    <span className='th-12 th-fw-500'>
                                      {eachPeriod?.sub_teacher
                                        ?.map((el) => el?.name)
                                        ?.join(',')}
                                    </span>
                                  </div>
                                )}
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
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }
);

export default connect()(TimeTableNewUI);
