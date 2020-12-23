import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import HomeworkCol from './homework-col';
import moment from 'moment';

const HomeworkRow = ({ data, cols, selectedCol, setSelectedCol, handleViewHomework }) => {
  const history = useHistory();
  const navigateToAddScreen = ({ date, subject, subjectId }) => {
    history.push(`/homework/add/${date}/${subject}/${subjectId}`);
  };
  return (
    <TableRow>
      {cols.map((col) => {
        const isSelected =
          selectedCol.date === data.date && selectedCol.subject === col.subject_name;
        return typeof col === 'object' ? (
          <HomeworkCol
            key={col.id}
            data={data[col.subject_name]}
            isSelected={isSelected}
            handleClick={(view) => {
              setSelectedCol({
                date: data.date,
                subject: col.subject_name,
                subjectId: col.id,
                homeworkId: data[col.subject_name].hw_id,
                view,
              });
            }}
            handleNavigationToAddScreen={() => {
              navigateToAddScreen({
                date: data.date,
                subject: col.subject_name,
                subjectId: col.id,
              });
            }}
            handleViewHomework={() => {
              handleViewHomework({
                date: data.date,
                subject: col.subject_name,
                subjectId: col.id,
                homeworkId: data[col.subject_name].hw_id,
              });
            }}
          />
        ) : (
          <TableCell className='no-wrap-col'>
            <div>
              <div className='day-icon'>
                {moment(data.date).format('dddd').split('')[0]}
              </div>
              {data.date}
            </div>
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default HomeworkRow;
