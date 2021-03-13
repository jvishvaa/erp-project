import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { useHistory } from 'react-router-dom';
import hwGiven from '../../../assets/images/hw-given.svg';
import hwEvaluatedIcon from '../../../assets/images/hw-evaluated.svg';
import submitted from '../../../assets/images/student-submitted.svg';
import { Badge, Typography } from '@material-ui/core';
import AddHomework from '../../../assets/images/AddHomework.svg';

const HomeworkCol = ({
  data,
  isSelected,
  handleClick,
  handleNavigationToAddScreen,
  handleViewHomework,
  canUpload,
}) => {
  const history = useHistory();
  const { student_submitted: studentSubmitted, hw_evaluated: hwEvaluated } = data;

  return (
    <TableCell className={isSelected ? 'selected-col' : ''}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {!data.hasOwnProperty('student_submitted') ? (
          <>
          {canUpload ? (
            <IconButton onClick={handleNavigationToAddScreen}>
              <SvgIcon
                component={() => (
                  <img
                    style={{ width: '25px', marginRight: '5px' }}
                    src={AddHomework}
                    alt='submitted'
                  />
                )}
              />
            </IconButton>
          ) : (
            <Typography style={{ fontSize: '12px', fontWeight: 'bold'}}>{''}</Typography>
          )}
          </>
        ) : (
          <>
            <IconButton onClick={handleViewHomework}>
              <SvgIcon
                component={() => (
                  <img
                    style={{ width: '35px', padding: '5px' }}
                    src={hwGiven}
                    alt='hwGiven'
                  />
                )}
              />
            </IconButton>
            {studentSubmitted > 0 && (
              <IconButton onClick={() => handleClick('submissionStats')}>
                <Badge
                  badgeContent={studentSubmitted}
                  color='primary'
                  style={{ cursor: 'pointer' }}
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
              </IconButton>
            )}

            {hwEvaluated > 0 && (
              <IconButton onClick={() => handleClick('evaluationStats')}>
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
              </IconButton>
            )}
          </>
        )}
      </div>
    </TableCell>
  );
};

export default HomeworkCol;
