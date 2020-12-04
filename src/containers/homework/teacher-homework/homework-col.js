import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { useHistory } from 'react-router-dom';
import hwGiven from '../../../assets/images/hw-given.svg';
import hwEvaluatedIcon from '../../../assets/images/hw-evaluated.svg';
import submitted from '../../../assets/images/student-submitted.svg';
import { Badge } from '@material-ui/core';

const HomeworkCol = ({ data, isSelected, handleClick, handleNavigationToAddScreen }) => {
  const history = useHistory();
  const { student_submitted: studentSubmitted, hw_evaluated: hwEvaluated } = data;

  return (
    <TableCell className={isSelected ? 'selected-col' : ''}>
      {!data.hasOwnProperty('student_submitted') ? (
        <IconButton onClick={handleNavigationToAddScreen}>
          <AddCircleOutlineIcon color='primary' />
        </IconButton>
      ) : (
        <SvgIcon
          component={() => (
            <img style={{ width: '35px', padding: '5px' }} src={hwGiven} alt='hwGiven' />
          )}
        />
      )}
      {studentSubmitted > 0 && (
        <Badge
          badgeContent={studentSubmitted}
          color='primary'
          style={{ cursor: 'pointer' }}
          onClick={handleClick}
        >
          <SvgIcon
            component={() => (
              <img
                style={{ width: '35px', padding: '5px' }}
                src={submitted}
                alt='submitted'
              />
            )}
            style={{ cursor: 'pointer' }}
          />
        </Badge>
      )}
      {hwEvaluated > 0 && (
        <Badge
          badgeContent={hwEvaluated}
          color='primary'
          style={{ cursor: 'pointer' }}
          onClick={handleClick}
        >
          <SvgIcon
            component={() => (
              <img
                style={{ width: '35px', padding: '5px' }}
                src={hwEvaluatedIcon}
                alt='hwEvaluated'
              />
            )}
          />
        </Badge>
      )}
    </TableCell>
  );
};

export default HomeworkCol;
