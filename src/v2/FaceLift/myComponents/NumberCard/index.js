import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const NumberCard = (props) => {
  const title = props?.isAttendance ? props?.data.grade_section : props?.data?.role_name;
  const Present = props?.isAttendance
    ? props?.data.present_count
    : props?.data?.total_present;
  const Absent = props?.isAttendance
    ? props?.data.absent_count
    : props?.data?.total_absent;
  const headerIcon = props?.isAttendance ? '' : props?.data?.headerIcon;
  const percentage_present = props?.isAttendance
    ? props?.data.percentage_attendance
    : props?.data?.percentage_present;

  return (
    <div
      className='d-flex justify-content-between align-items-center py-1 mt-2 th-br-6 px-3 py-2 th-bg-grey'
      style={{ cursor: props?.isAttendance ? 'pointer' : 'inherit' }}
    >
      <div className='th-black-1 th-13 '>
        <div className='d-flex align-items-center'>
          {headerIcon && (
            <span className='th-fw-600 mr-2'>
              <img src={headerIcon} />{' '}
            </span>
          )}
          <span className='th-fw-600 th-14'>{title}</span>
        </div>
        <div className='d-flex pt-1'>
          <div>
            <span className='th-16 th-fw-700 th-green pr-1'>{Present}</span>
            <span className='th-12'>Present</span>
          </div>
          <div className='pl-1'>
            <span className='th-16 th-fw-700 th-red pr-1'>{Absent}</span>
            <span className='th-12'>Absent</span>
          </div>
        </div>
      </div>
      <div className='pt-2'>
        <Box position='relative' display='inline-flex'>
          <CircularProgress
            variant='determinate'
            value={Math.round(percentage_present)}
            className='th-primary'
          />
          <Box
            top={0}
            left={0}
            bottom={0}
            right={0}
            position='absolute'
            display='flex'
            alignItems='center'
            justifyContent='center'
          >
            <Typography
              variant='p'
              component='div'
              color='textSecondary'
              className='th-primary th-fw-700 th-12'
            >
              {Math.round(percentage_present)}%
            </Typography>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default NumberCard;
