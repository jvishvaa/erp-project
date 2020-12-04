import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import HomeworkCol from './homework-col';

const HomeworkRow = ({ data, cols, selectedCol, setSelectedCol }) => {
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
            handleClick={() => {
              setSelectedCol({
                date: data.date,
                subject: col.subject_name,
                subjectId: col.id,
              });
            }}
            handleNavigationToAddScreen={() =>
              navigateToAddScreen({
                date: data.date,
                subject: col.subject_name,
                subjectId: col.id,
              })
            }
          />
        ) : (
          <TableCell className='no-wrap-col'>{data.date}</TableCell>
        );
      })}
    </TableRow>
  );
};

export default HomeworkRow;
