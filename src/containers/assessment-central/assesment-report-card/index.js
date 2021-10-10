import React from 'react';
import ReportTable from './report-table.js';
import StudentDetails from './report-top-descriptions.js';
import { Paper, makeStyles } from '@material-ui/core';
import PersonalityTraitTable from './report-table-personality-trait';
import ReportCardFooter from './report-card-footer';
import ReportCardHeader from './report-card-header';
import TableTypeFooter from './tableTypeFooter';
import { generateGradeScale, generateCategoryMap } from './transform-report-card-data';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '20px auto',
    padding: '15px',
    width: '95%',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tr: {
    padding: '2px',
    border: '1px solid #dddddd',
  },
}));

const AssesmentReport = ({ reportCardData }) => {
  const classes = useStyles();

  const {
    scholastic = {},
    co_scholastic: coScholastic = {},
    school_info: schoolInfo = {},
    user_info: userInfo = {},
  } = reportCardData || {};

  const {
    grade_scale: scholasticGradeScale = {},
    category_map: scholasticCategoryMap = {},
  } = scholastic || {};
  const {
    grade_scale: coScholasticGradeScale = {},
    category_map: coScholasticCategoryMap = {},
  } = coScholastic || {};

  const SCHOLASTIC_GRADE_SCALE = generateGradeScale(scholasticGradeScale);
  const CO_SCHOLASTIC_GRADE_SCALE = generateGradeScale(coScholasticGradeScale);

  const { categoryAssessmentType: SCHOLASTIC_CATEGORY_ASSESSMENT } =
    generateCategoryMap(scholasticCategoryMap);
  const { categoryAssessmentType: CO_SCHOLASTIC_CATEGORY_ASSESSMENT } =
    generateCategoryMap(coScholasticCategoryMap);

  return (
    <>
      {reportCardData ? (
        <Paper component={'div'} elevation={2} className={classes.root}>
          <ReportCardHeader schoolData={schoolInfo} />
          <StudentDetails userInfo={userInfo} />
          <ReportTable TableType={'SCHOLASTIC'} Data={scholastic} />
          <TableTypeFooter
            gradeScale={SCHOLASTIC_GRADE_SCALE}
            categoryAssessment={SCHOLASTIC_CATEGORY_ASSESSMENT}
          />
          <ReportTable TableType={'CO-SCHOLASTIC'} Data={coScholastic} />
          <TableTypeFooter
            gradeScale={CO_SCHOLASTIC_GRADE_SCALE}
            categoryAssessment={CO_SCHOLASTIC_CATEGORY_ASSESSMENT}
          />
          <PersonalityTraitTable />
          <TableTypeFooter gradeScale={CO_SCHOLASTIC_GRADE_SCALE} />
          <ReportCardFooter />
        </Paper>
      ) : (
        'REPORT CARD NOT AVAILABLE'
      )}
    </>
  );
};

export default AssesmentReport;
