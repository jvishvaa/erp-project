import React from 'react';
import { useHistory } from 'react-router-dom';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import HomeworkCol from './homework-col';
import moment from 'moment';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  dayicon : theme.dayIcon
}))

const HomeworkRow = ({ data, cols, selectedCol, sectionId, setSelectedCol, handleViewHomework, coord_selected_teacher_id}) => {
  const history = useHistory();
  const classes = useStyles()
  const navigateToAddScreen = ({ date, sessionYear, branch, grade, subject, subjectId }) => {
    history.push(`/homework/cadd/${date}/${sessionYear}/${branch}/${grade}/${subject}/${subjectId}/${coord_selected_teacher_id}`);
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
            canUpload={data.canUpload}
            handleClick={(view) => {
              setSelectedCol({
                date: data.date,
                subject: col.subject_name,
                subjectId: col.subject_id,
                sectionId: sectionId,
                homeworkId: data[col.subject_name].hw_id,
                view,
                coord_selected_teacher_id
              });
            }}
            handleNavigationToAddScreen={() => {
              navigateToAddScreen({
                date: data.date,
                //section: sectionId,
                sessionYear: data.sessionYear,
                branch: data.branch,
                grade: data.grade,
                subject: col.subject_name,
                subjectId: col.subject_id,
                coord_selected_teacher_id
              });
            }}
            handleViewHomework={() => {
              handleViewHomework({
                date: data.date,
                subject: col.subject_name,
                subjectId: col.subject_id,
                homeworkId: data[col.subject_name].hw_id,
                coord_selected_teacher_id
              });
            }}
          />
        ) : (
          <TableCell className='no-wrap-col' style={{ minWidth: '188px'}}>
            <div>
              <div className={classes.dayicon}>
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
