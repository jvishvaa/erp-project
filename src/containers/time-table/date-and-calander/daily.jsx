import React, { useContext, useEffect, useState } from 'react';
import DisplayBox from './displayBox.jsx';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
const Daily = (props) => {
  const [daily, setDaily] = useState(null);
  const [loopData] = useState([1, 2, 3, 4, 5]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [selectData, setSelectData] = useState(false);
  const [currentDay, setCurrent] = useState(null);
  const [DataMonday, setDataMonday] = useState(props.tableData.Monday);
  const [DataTuesday, setDataTuesday] = useState(props.tableData.Tuesday);
  const [DataWednesday, setDataWednesday] = useState(props.tableData.Wednesday);
  const [DataThursday, setDataThursday] = useState(props.tableData.Thursday);
  const [DataFriday, setDataFriday] = useState(props.tableData.Friday);
  const [mapData, setMapData] = useState([1]);
  useEffect(() => {
    handleDailyData();
  }, [props.openToggleCalander]);
  const handleDailyData = () => {
    let newDate = new Date();
    let days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    let day = days[newDate.getDay()];
    setCurrent(day);
    if (day === 'Monday') {
      setDaily(DataMonday);
      // if (DataMonday) {
      //   let lengthDaily = DataMonday.length;
      //   setMapData(lengthDaily);
      // }
    }
    if (day === 'Tuesday') {
      setDaily(DataTuesday);
    }
    if (day === 'Wednesday') {
      setDaily(DataWednesday);
    }
    if (day === 'Thursday') {
      setDaily(DataThursday);
      // if (DataThursday) {
      //   let lengthDaily = DataThursday.length;
      //   let mappingArray = Array.from(Array(lengthDaily).keys());
      //   setMapData(mappingArray);
      // }
    }
    if (day === 'Friday') {
      setDaily(DataFriday);
    }
  };

  return (
    <>
      <div className='calander-container-time-table-module'>
        <div className='calander-daily-time-table-module'>
          <table>
            <tr>
              <div className='daily-header'>{currentDay}</div>
            </tr>
            {mapData &&
              mapData.map((data) => (
                <tr key={data.id} onClick={() => setSelectData(data)}>
                  {daily &&
                    daily.map((data) => (
                      <td>
                        <h4>{data?.period_name}</h4>
                        <h3>{data?.subject_details?.subject_name}</h3>
                        <p>
                          {data.period_start_time.slice(0, 5)}-
                          {data.period_end_time.slice(0, 5)}
                        </p>
                        <h4>{data.teacher_name?.name}</h4>
                      </td>
                    ))}
                </tr>
              ))}
          </table>
        </div>
        <div className='display-container-time-table-module'>
          {selectData ? (
            <DisplayBox dataOpenChange={selectData} />
          ) : (
            <div className='message'>Select card to view further details</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Daily;
