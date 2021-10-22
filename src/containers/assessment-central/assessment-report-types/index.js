/* eslint-disable react/jsx-no-duplicate-props */
import React, { useContext, useEffect, useState } from 'react';
import {
  SvgIcon,
  Table,
  TableContainer,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Paper,
  TablePagination,
  Box,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import '../../../containers/master-management/master-management.css';
import Loading from '../../../components/loader/loader';
import ReportTypeFilter from '../assessment-report-types/report-type-filter';
import AssessmentReportFilters from '../assessment-report-types/assessment-report-filters';
import AssesmentReportTable from '../assesment-report-card/index';
import AssessmentReportBack from '../assesment-report-card/report-table-observation-and-feedback';
import { connect } from 'react-redux';
import { setClearFilters } from 'redux/actions';
import unfiltered from '../../../assets/images/unfiltered.svg';
import selectfilter from '../../../assets/images/selectfilter.svg';
import useStyles from './useStyles';
import TabPanel from '../../../components/tab-panel';

const AssessmentReportTypes = ({ assessmentReportListData, selectedReportType }) => {
  const limit = 15;
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const widerWidth = isMobile ? '98%' : '95%';
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);

  const [page, setPage] = useState(1);
  const [isFilter, setIsFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [reportData, setReportData] = useState([]);
  const [columns, setColumns] = useState([]);

  const [reportCardData, setReportCardData] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const renderReportCard = () => {
    switch (tabValue) {
      case 0:
        return <AssesmentReportTable reportCardData={reportCardData} />;
      case 1:
        return (
          <AssessmentReportBack
            observationFeedback={reportCardData['observation_feedback']}
          />
        );
    }
  };

  // useEffect(() => {
  //   setClearFilters();
  // }, []);

  useEffect(() => {
    if (isFilter) {
      setReportData(assessmentReportListData?.results);
      setTotalCount(assessmentReportListData?.count);
    }
  }, [isFilter, assessmentReportListData]);

  useEffect(() => {
    switch (selectedReportType?.id) {
      case 2:
        setColumns([
          {
            id: 'serial_number',
            label: 'S.No',
            minWidth: 100,
            align: 'center',
            labelAlign: 'center',
          },
          {
            id: 'topic_name',
            label: 'Topic Name',
            minWidth: 170,
            align: 'center',
            labelAlign: 'center',
          },
          {
            id: 'class_avg',
            label: 'Class Average',
            minWidth: 170,
            align: 'center',
            labelAlign: 'center',
          },
        ]);
        break;
      case 3:
      case 4:
        setColumns([
          {
            id: 'serial_number',
            label: 'S.No',
            minWidth: 100,
            align: 'center',
            labelAlign: 'center',
          },
          {
            id: 'erp_number',
            label: 'ERP No.',
            minWidth: 170,
            align: 'center',
            labelAlign: 'center',
          },
          {
            id: 'student_name',
            label: 'Student Name',
            minWidth: 170,
            align: 'center',
            labelAlign: 'center',
          },
          {
            id: 'marks_obtained',
            label: 'Marks Obtained',
            minWidth: 170,
            align: 'center',
            labelAlign: 'center',
          },
          {
            id: 'comparison',
            label: 'Comparison',
            minWidth: 170,
            align: 'center',
            labelAlign: 'center',
          },
        ]);
        break;
      case 1:
      default:
        setColumns([
          {
            id: 'serial_number',
            label: 'S.No',
            minWidth: 100,
            align: 'center',
            labelAlign: 'center',
          },
          {
            id: 'section',
            label: 'Section',
            minWidth: 170,
            align: 'center',
            labelAlign: 'center',
          },
          {
            id: 'class_avg',
            label: 'Class Average',
            minWidth: 170,
            align: 'center',
            labelAlign: 'center',
          },
          {
            id: 'teacher_name',
            label: 'Teacher Name',
            align: 'center',
            labelAlign: 'center',
          },
        ]);
        break;
    }
  }, [selectedReportType?.id]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 450);
  }, [page]);

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <CommonBreadcrumbs
          componentName='Assessment'
          childComponentName='Reports'
          isAcademicYearVisible={true}
        />
        <ReportTypeFilter
          setIsFilter={setIsFilter}
          selectedReportType={selectedReportType}
          widerWidth={widerWidth}
          isMobile={isMobile}
        />
        {selectedReportType?.id && (
          <AssessmentReportFilters
            page={page}
            setIsPreview={setIsPreview}
            setPage={setPage}
            pageSize={limit}
            setReportCardData={setReportCardData}
            classTopicAverage={
              selectedReportType?.id === 3
                ? reportData?.[0]?.class_average
                : +assessmentReportListData?.comparison || ''
            }
            isFilter={isFilter}
            setIsFilter={setIsFilter}
            selectedReportType={selectedReportType}
            widerWidth={widerWidth}
            isMobile={isMobile}
          />
        )}
        {selectedReportType?.id === 5 && isPreview && (
          <>
            <Box style={{ margin: '20px auto', width: '95%' }}>
              <TabPanel
                tabValue={tabValue}
                setTabValue={setTabValue}
                tabValues={['Front', 'Back']}
              />
            </Box>
            {renderReportCard()}
          </>
        )}

        {isFilter && (
          <Paper className={`${classes.root} common-table`}>
            <TableContainer className={classes.container}>
              <Table stickyHeader aria-label='sticky table'>
                <TableHead className='table-header-row'>
                  <TableRow>
                    {[...columns].map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column?.minWidth }}
                        className={classes.columnHeader}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData?.map((rowData, index) => {
                    return (
                      <TableRow hover academicyear='checkbox' tabIndex={-1} key={index}>
                        <TableCell className={classes.tableCell}>
                          {limit * (page - 1) + index + 1}
                        </TableCell>
                        {selectedReportType?.id === 1 && (
                          <TableCell className={classes.tableCell}>
                            {rowData?.section_name}
                          </TableCell>
                        )}
                        {selectedReportType?.id === 1 && (
                          <TableCell className={classes.tableCell}>
                            {rowData?.class_average}
                          </TableCell>
                        )}
                        {selectedReportType?.id === 1 && (
                          <TableCell className={classes.tableCell}>
                            <div className={classes.teacherNameParent}>
                              {rowData?.teacher_name?.map((obj) => {
                                return (
                                  <div className={classes.teacherNameChild}>{obj}</div>
                                );
                              })}
                            </div>
                          </TableCell>
                        )}
                        {selectedReportType?.id === 2 && (
                          <TableCell className={classes.tableCell}>
                            {rowData?.topic}
                          </TableCell>
                        )}
                        {selectedReportType?.id === 2 && (
                          <TableCell className={classes.tableCell}>
                            {rowData?.average}
                          </TableCell>
                        )}
                        {(selectedReportType?.id === 3 ||
                          selectedReportType?.id === 4) && (
                          <TableCell className={classes.tableCell}>
                            {rowData?.erp_no}
                          </TableCell>
                        )}
                        {(selectedReportType?.id === 3 ||
                          selectedReportType?.id === 4) && (
                          <TableCell className={classes.tableCell}>
                            {rowData?.user_name}
                          </TableCell>
                        )}
                        {(selectedReportType?.id === 3 ||
                          selectedReportType?.id === 4) && (
                          <TableCell className={classes.tableCell}>
                            {selectedReportType?.id === 3
                              ? rowData?.total_mark
                              : rowData?.marks_obtained}
                          </TableCell>
                        )}
                        {(selectedReportType?.id === 3 ||
                          selectedReportType?.id === 4) && (
                          <TableCell className={classes.tableCell}>
                            {selectedReportType?.id === 3
                              ? rowData?.comparsion
                              : +rowData?.marks_obtained -
                                +assessmentReportListData?.comparison}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <div className='paginateData'>
              <TablePagination
                component='div'
                count={totalCount}
                rowsPerPage={limit}
                page={page - 1}
                onChangePage={handleChangePage}
                rowsPerPageOptions={false}
              />
            </div>
          </Paper>
        )}
        {!isFilter && !isPreview && (
          <div className='periodDataUnavailable'>
            <SvgIcon
              component={() => (
                <img
                  style={
                    isMobile
                      ? { height: '100px', width: '200px' }
                      : { height: '160px', width: '290px' }
                  }
                  src={unfiltered}
                />
              )}
            />
            <SvgIcon
              component={() => (
                <img
                  style={
                    isMobile
                      ? { height: '20px', width: '250px' }
                      : { height: '50px', width: '400px', marginLeft: '5%' }
                  }
                  src={selectfilter}
                />
              )}
            />
          </div>
        )}
      </Layout>
    </>
  );
};
const mapDispatchToProps = (dispatch) => ({
  setClearFilters: () => dispatch(setClearFilters()),
});

const mapStateToProps = (state) => ({
  selectedReportType: state.assessmentReportReducer.selectedReportType,
  assessmentReportListData: state.assessmentReportReducer.assessmentReportListData,
});

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentReportTypes);
