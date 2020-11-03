import React, { useContext, useEffect, useState } from 'react';
import { Button, TableCell, TableRow } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { OnlineclassViewContext } from '../../online-class-context/online-class-state';

const OnlineClassResourceCell = (props) => {
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

  const {
    cancelClass,
    dispatch,
    managementView: { currentManagementTab },
  } = useContext(OnlineclassViewContext);

  const [hasClassEnded, setHasClassEnded] = useState(false);
  const [isJoinTime, setIsJoinTime] = useState(false);
  const [isHost, setIsHost] = useState(true);

  const history = useHistory();

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

  const handleAttendee = () => {
    history.push(`/online-class/attendee-list/${id}`);
  };

  return (
    <TableRow key={id}>
      <TableCell align='center'>{index + 1}</TableCell>
      <TableCell align='center'>{title}</TableCell>
      <TableCell align='center'>{subjectName}</TableCell>
      <TableCell align='center'>{startTime}</TableCell>
      <TableCell align='center'>
        <Button>Upload resource</Button>
      </TableCell>
    </TableRow>
  );
};

export default OnlineClassResourceCell;
