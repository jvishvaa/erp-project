/* eslint-disable react/jsx-no-duplicate-props */
import React, { useContext, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import TablePagination from '@material-ui/core/TablePagination';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import '../../../containers/master-management/master-management.css';
import Loading from '../../../components/loader/loader';
import ReportTypeFilter from '../assessment-report-types/report-type-filter';
import AssessmentReportFilters from '../assessment-report-types/assessment-report-filters';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    boxShadow: 'none',
  },
  container: {
    maxHeight: '70vh',
  },
  buttonContainer: {
    background: theme.palette.background.secondary,
    paddingBottom: theme.spacing(2),
  },
  centerInMobile: {
    width: '100%',
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  tableCell: {
    color: theme.palette.secondary.main,
  },
}));

const AssessmentReportTypes = ({ assessmentReportListData, selectedReportType }) => {
  const limit = 15;
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [columns, setColumns] = useState([]);

  useEffect(() => {
    switch (selectedReportType?.id) {
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
            minWidth: 170,
            align: 'center',
            labelAlign: 'center',
          },
        ]);
        break;
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
        <div>
          <div style={{ width: '95%', margin: '20px auto' }}>
            <CommonBreadcrumbs componentName='Assessment' childComponentName='Reports' />
          </div>
        </div>
        <ReportTypeFilter widerWidth={widerWidth} isMobile={isMobile} />
        {selectedReportType?.id && (
          <AssessmentReportFilters widerWidth={widerWidth} isMobile={isMobile} />
        )}
        <Paper className={`${classes.root} common-table`}>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead className='table-header-row'>
                <TableRow>
                  {[...columns].map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                      className={classes.columnHeader}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {assessmentReportListData?.map((rowData, index) => {
                  return (
                    <TableRow hover academicyear='checkbox' tabIndex={-1} key={index}>
                      <TableCell className={classes.tableCell}>{index + 1}</TableCell>
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
                          {rowData?.test__teacher}
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
                      {(selectedReportType?.id === 3 || selectedReportType?.id === 4) && (
                        <TableCell className={classes.tableCell}>
                          {rowData?.erp_no}
                        </TableCell>
                      )}
                      {(selectedReportType?.id === 3 || selectedReportType?.id === 4) && (
                        <TableCell className={classes.tableCell}>
                          {rowData?.user_name}
                        </TableCell>
                      )}
                      {(selectedReportType?.id === 3 || selectedReportType?.id === 4) && (
                        <TableCell className={classes.tableCell}>
                          {rowData?.marks_obtained}
                        </TableCell>
                      )}
                      {(selectedReportType?.id === 3 || selectedReportType?.id === 4) && (
                        <TableCell className={classes.tableCell}>
                          {rowData?.comparison}
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
      </Layout>
    </>
  );
};
const mapDispatchToProps = (dispatch) => ({});

const mapStateToProps = (state) => ({
  selectedReportType: state.assessmentReportReducer.selectedReportType,
  assessmentReportListData: state.assessmentReportReducer.assessmentReportListData,
});

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentReportTypes);
