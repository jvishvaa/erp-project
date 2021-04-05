import React, { useEffect, useState } from 'react';
import DisplayBox from './displayBox.jsx';
const Daily = (props) => {
  const [daily, setDaily] = useState(null);
  const [loopData] = useState([1, 2, 3, 4, 5]);
  const [selectData, setSelectData] = useState(false);
  const [currentDay, setCurrent] = useState(null);
  const [DataMonday, setDataMonday] = useState(props.tableData.Monday);
  const [DataTuesday, setDataTuesday] = useState(props.tableData.Tuesday);
  const [DataWednesday, setDataWednesday] = useState(props.tableData.Wednesday);
  const [DataThursday, setDataThursday] = useState(props.tableData.Thursday);
  const [DataFriday, setDataFriday] = useState(props.tableData.Friday);

  useEffect(()=>{
    handleDailyData();
    console.log(props.openToggleCalander, 'open===');
  },[props.openToggleCalander])
  const handleDailyData = () =>{
    let newDate = new Date();
    let days = ["","Monday","Tuesday","Wednesday","Thursday","Friday",""];
    let day = days[newDate.getDay()]
    setCurrent(day);
    if(day === 'Monday'){
      setDaily(DataMonday);
    }
    if(day === 'Tuesday'){
      setDaily(DataTuesday);
    }
    if(day === 'Wednesday'){
      setDaily(DataWednesday);
    }
    if(day === 'Thursday'){
      setDaily(DataThursday);
    }
    if(day === 'Friday'){
      setDaily(DataFriday);
    }
  }

  return (
    <>
      <div className='calander-container'>
        <div className='calander-daily'>
          <table>
            <tr>
              <div className='daily-header'>{currentDay}</div>
            </tr>
            {daily &&
              daily.map((data) => (
                <tr key={data.id} onClick={()=>setSelectData(data)}>
                  {loopData.map((times) => (
                    <td key={times}>
                      <h4>{data.period_name}</h4>
                      <p>
                        {data.period_start_time.slice(0,5)}-{data.period_end_time.slice(0,5)}
                      </p>
                      <h4>
                        {data.assigned_teacher__first_name}{' '}
                        {data.assigned_teacher__last_name}
                      </h4>
                    </td>
                  ))}
                </tr>
              ))}
          </table>
        </div>
        <div className='display-container'>
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
