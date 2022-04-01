import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

function TodayAttendance({ attendanceDetail }) {
  const history = useHistory();

  useEffect(() => {
    let element = document.getElementById('status');
    let Text = document.getElementById('statusText');
    if (attendanceDetail?.attendence_status === 'present') {
      Text.style.color = 'green';
      element.style.backgroundColor = 'green';
      Text.innerHTML = '<b>Present</b>';
    } else if (attendanceDetail?.attendence_status === 'absent') {
      Text.style.color = 'red';
      element.style.backgroundColor = 'red';
      Text.innerHTML = '<b>Absent</b>';
    } else if (attendanceDetail?.attendence_status === 'halfday') {
      Text.style.color = 'blue';
      element.style.backgroundColor = 'blue';
      Text.innerHTML = '<b>Half Day</b>';
    } else if (attendanceDetail?.attendence_status === 'holiday') {
      Text.style.color = '#DAB5FF';
      element.style.backgroundColor = '#DAB5FF';
      Text.innerHTML = '<b>Holiday</b>';
    } else if (attendanceDetail?.attendence_status === 'late') {
      Text.style.color = '#DAB5FF';
      element.style.backgroundColor = '#DAB5FF';
      Text.innerHTML = '<b>Late</b>';
    } else {
      Text.style.color = 'black';
      element.style.backgroundColor = 'grey';
      Text.innerHTML = '<b>Not Available</b>';
    }
  });
  const viewAttendanceHandler = () => {
    history.push({
      pathname: './teacherdashboards/attendance_overview',
      state: {
        attendanceDetail: attendanceDetail,
      },
    });
  };
  return (
    <div>
      <Card
        style={{ minWidth: '100%', border: '2px solid whitesmoke', marginBottom: '10px' }}
      >
        <CardContent>
          <Typography
            style={{ marginBottom: '10px', fontWeight: '1000', fontSize: '12px' }}
          >
            Your Today's Attendance
          </Typography>
          <Card
            style={{ minWidth: '100%', border: '2px solid whitesmoke', height: '49px' }}
          >
            <CardContent>
              <div style={{ display: 'flex', textAlign: 'center' }}>
                <div
                  id='status'
                  style={{
                    height: '10px',
                    width: '10px',
                    // backgroundColor: '#307E0F',
                    marginRight: '20px',
                  }}
                ></div>
                <Typography
                  id='statusText'
                  style={{
                    color: '#307E0F',
                    fontWeight: '1000',
                    fontSize: '12px',
                    marginBottom: '-10px',
                  }}
                >
                  {/* {attendanceDetail?.attendence_status} */}
                </Typography>
                {/* <Typography
                  style={{ position: 'relative', left: '210px', fontSize: '12px' }}
                >
                  Logged In:{attendanceDetail?.check_in_time}
                </Typography> */}
              </div>
            </CardContent>
          </Card>
          <Typography
            onClick={viewAttendanceHandler}
            style={{
              position: 'relative',
              left: '316px',
              fontSize: '12px',
              fontWeight: '800',
              top: '14px',
              cursor: 'pointer',
            }}
          >
            View all
            <ArrowForwardIosIcon
              size='small'
              style={{
                height: '12px',
                width: '12 px',
                color: 'black',
                marginLeft: '-5px',
                marginTop: '5px',
              }}
            />
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default TodayAttendance;
