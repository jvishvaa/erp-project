import React, { useContext, useEffect, useState } from 'react';
import { Button, TableCell, TableRow } from '@material-ui/core';
import { OnlineclassViewContext } from '../../../online-class-context/online-class-state';

const ViewClassTableCell = (props) => {
  const {
    index,
    data: {
      id,
      is_canceled: isCancelled,
      absent_student_count: absentCount,
      attendee_student_count: attendedCount,
      presenter: { email },
      join_time: joinTime,
      presenter_url: presenterUrl,
      online_class: {
        start_time: startTime,
        end_time: endTime,
        subject: { subject_name: subjectName },
        title,
      },
      tutor_email: tutor,
    },
  } = props || {};

  const { cancelClass, dispatch } = useContext(OnlineclassViewContext);

  const [hasClassEnded, setHasClassEnded] = useState(false);
  const [isJoinTime, setIsJoinTime] = useState(false);
  const [isHost, setIsHost] = useState(true);

  useEffect(() => {
    const now = new Date();

    if (joinTime) {
      const difference = new Date(joinTime) - now;
      setTimeout(() => {
        setIsJoinTime(true);
      }, difference);
    }

    if (endTime) {
      const difference = new Date(endTime) - now;
      setTimeout(() => {
        setHasClassEnded(true);
        setIsJoinTime(false);
      }, difference);
    }
  }, []);

  const handleHost = () => {
    window.open(presenterUrl, '_blank');
  };

  const handleAudit = () => {
    debugger;
  };

  const handleCancel = (classId) => {
    dispatch(cancelClass(classId));
  };

  return (
    <TableRow key={id}>
      <TableCell align='center'>{index + 1}</TableCell>
      <TableCell align='center'>{title}</TableCell>
      <TableCell align='center'>{subjectName}</TableCell>
      <TableCell align='center'>{startTime}</TableCell>
      <TableCell align='center'>{attendedCount}</TableCell>
      <TableCell align='center'>{absentCount}</TableCell>
      <TableCell align='center'>{email}</TableCell>
      <TableCell align='center'>
        {hasClassEnded ? (
          'Class Ended'
        ) : (
          <Button
            onClick={isHost ? handleHost : handleAudit}
            disabled={!isJoinTime || isCancelled}
            variant='contained'
            color='primary'
          >
            {isCancelled ? 'Class canceled' : isHost ? 'Host' : 'Audit'}
          </Button>
        )}
      </TableCell>
      <TableCell>
        <Button
          variant='contained'
          color='primary'
          disabled={isCancelled}
          onClick={() => {
            handleCancel(id);
          }}
        >
          {isCancelled ? 'Class cancelled' : 'Cancel'}
        </Button>
      </TableCell>
      <TableCell>
        <Button variant='contained' color='primary'>
          Attendee list
        </Button>
      </TableCell>
      <TableCell align='center'>{tutor}</TableCell>
    </TableRow>
  );
};

export default ViewClassTableCell;
