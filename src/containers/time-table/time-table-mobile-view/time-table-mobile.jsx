import React, { useEffect, useState } from 'react';
// import Paper from '@material-ui/core/Paper';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import DisplayBox from './time-table-display-box/time-table-display';
import {
  Grid,
  Paper,
  IconButton,
  TextField,
  Button,
  Divider,
  Typography,
  TablePagination,
} from '@material-ui/core';
import './time-table-mobile.scss';
const TimeTableMobile = (props) => {
  const [headingLoop] = useState(['Mon', 'Tue', 'Wed', 'Thus', 'Fri']);
  const [dataDay, setDataDay] = useState(props.tableData.Monday);
  const [dataOpenChange, setDataOpenChange] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  useEffect(() => {
    props.callGetAPI();
  }, []);
  const handleChangeDataDay = (days) => {
    if (days === 'Mon') {
      setDataDay(props.tableData.Monday);
    } else if (days === 'Tue') {
      setDataDay(props.tableData.Tuesday);
    } else if (days === 'Wed') {
      setDataDay(props.tableData.Wednesday);
    } else if (days === 'Thus') {
      setDataDay(props.tableData.Thursday);
    } else if (days === 'Fri') {
      setDataDay(props.tableData.Friday);
    }
  };
  const handleOpenChange = (data, toEdit) => {
    setDataOpenChange(data);
    setIsEdit(toEdit);
  };
  return (
    <>
      {isEdit ? (
        <div className='display-box-mobile-container'>
          <DisplayBox
            teacherView={props.teacherView}
            dataOpenChange={dataOpenChange}
            handleOpenChangeMobile={handleOpenChange}
          />
        </div>
      ) : (
        <div className='time-table-mobile'>
          <div className='fixed-header-mobile'>
          <div className='mobile-calander-header'>
            {headingLoop.map((days) => (
              <h3
                className='day-calander-data'
                onClick={() => {
                  handleChangeDataDay(days);
                }}
              >
                {days}
                <div className='underline-slected'></div>
              </h3>
            ))}
          </div>
          <Divider variant='middle' />
          </div>
          <Grid container spacing={2} style={{ marginTop: '10px', marginLeft: '7px' }}>
            {dataDay &&
              dataDay.map((data) => (
                <Grid item md={2} xs={11}>
                  <Paper>
                    <div className='period-details-container-mobile'>
                      <div>
                        <h4>{data.period_name}</h4>
                        <p>
                          {data.period_start_time.slice(0, 5)}-
                          {data.period_end_time.slice(0, 5)}
                        </p>
                        <h4>
                          {data.teacher_name?.name}
                        </h4>
                      </div>
                      <div className='button-container'>
                        <IconButton
                          aria-label='delete'
                          onClick={() => handleOpenChange(data, true)}
                        >
                          <EditTwoToneIcon />
                        </IconButton>
                      </div>
                    </div>
                  </Paper>
                </Grid>
              ))}
          </Grid>
        </div>
      )}
    </>
  );
};

export default TimeTableMobile;
