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
  Checkbox,
  Paper,
  TablePagination,
  Button,
  Grid,
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
import { setClearFilters, setSelectedRole } from 'redux/actions';
import unfiltered from '../../../assets/images/unfiltered.svg';
import selectfilter from '../../../assets/images/selectfilter.svg';
import useStyles from './useStyles';
import TabPanel from '../../../components/tab-panel';
import { transform } from 'lodash';
import MomentUtils from '@date-io/moment';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import moment from 'moment';
import { returnAdmin } from 'containers/Finance/src/components/Finance/store/actions';

const AssessmentReportTypes = ({ assessmentReportListData, selectedReportType }) => {
  const limit = 10;
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const widerWidth = isMobile ? '98%' : '95%';
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [filterData, setFilterData] = useState({
    branch: '',
    grade: '',
    section: '',
    subject: '',
    test: '',
    chapter: '',
    topic: '',
    erp: '',
  });

  const [page, setPage] = useState(1);
  const [isFilter, setIsFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [reportData, setReportData] = useState([]);
  const [columns, setColumns] = useState([]);

  const [reportCardData, setReportCardData] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const [selectedERP, setSelectedERP] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (isFilter) {
      setTotalCount(assessmentReportListData?.count);
      setReportData(assessmentReportListData?.results);
      if (selectedReportType?.id === 3) {
        const transformedResponse =
          getTransformedReportData(assessmentReportListData?.results) || [];
        setReportData(transformedResponse);
      }
    }
  }, [isFilter, assessmentReportListData]);

  useEffect(() => {
    if (selectedReportType?.id) {
      setSelectedERP([]);
    }
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
        setColumns([
          {
            id: 'serial_number',
            label: 'Select',
            minWidth: 100,
            align: 'center',
            labelAlign: 'center',
          },
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

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 450);
  }, [page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleSelectERP = (e, erp, index) => {
    const isChecked = e?.target?.checked;
    if (isChecked) {
      setSelectedERP((prev) => [...prev, erp]);
    } else {
      const selectedERPs = [...selectedERP];
      const erpIndex = selectedERPs.indexOf(erp);
      selectedERPs.splice(erpIndex, 1);
      setSelectedERP(selectedERPs);
    }
    const list = [...reportData];
    list[index]['is_checked'] = isChecked;
    setReportData(list);
  };

  const handleResetCheckedERP = () => {
    const list = [...reportData];
    list.forEach((item) => (item.is_checked = false));
    setReportData(list);
  };

  const handleCreateRetest = () => {
    const retestDate = moment(selectedDate).format();
    const payload = {
      test: filterData.test?.id,
      retest_date: retestDate?.split('+')?.[0] || '',
      erpusers: selectedERP,
    };
    axiosInstance
      .post(endpoints.assessmentReportTypes.assessmentRetest, payload)
      .then((response) => {
        if (response?.data?.status_code === 200) {
          setAlert('success', response?.data?.message);
          setSelectedERP([]);
          handleResetCheckedERP();
        } else {
          setAlert('error', response?.data?.message);
        }
      })
      .catch((error) => {
        if (error?.response?.data?.status_code === 400) {
          setAlert('error', error?.response?.data?.message);
          setSelectedERP([]);
          handleResetCheckedERP();
        }
      });
  };

  const renderReportCard = () => {
    switch (tabValue) {
      case 0:
        return <AssesmentReportTable reportCardData={reportCardData} />;
      case 1:
        return (
          <AssessmentReportBack
            schoolInfo={reportCardData['school_info']}
            observationFeedback={reportCardData['observation_feedback']}
          />
        );
    }
  };

  const getTransformedReportData = (data) => {
    if (data) {
      const transformedResponse = data.map((item) => ({ is_checked: false, ...item }));
      transformedResponse.forEach((item) => {
        if (selectedERP.includes(item?.erp_no)) {
          item['is_checked'] = true;
        }
      });
      return transformedResponse || [];
    }
  };

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
            setLoading={setLoading}
            setIsPreview={setIsPreview}
            setPage={setPage}
            setSelectedERP={setSelectedERP}
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
            filterData={filterData}
            setFilterData={setFilterData}
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
            <Box style={{ margin: '20px auto', width: '95%' }}>{renderReportCard()}</Box>
          </>
        )}

        {isFilter && (
          <Paper className={`${classes.root} common-table`}>
            {selectedERP.length > 0 && selectedReportType?.id === 3 && (
              <Grid
                container
                spacing={isMobile ? 3 : 5}
                style={{
                  width: widerWidth,
                  margin: isMobile ? '10px 0px -10px 0px' : '-20px 0px 20px 8px',
                }}
              >
                <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDateTimePicker
                      value={selectedDate}
                      onChange={setSelectedDate}
                      label='Re-Test Date-Time'
                      onError={console.log}
                      minDate={new Date()}
                      disablePast
                      format='yyyy/MM/DD hh:mm A'
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12} sm={2} style={{ alignSelf: 'center' }}>
                  <Button
                    variant='contained'
                    size='medium'
                    color='secondary'
                    style={{ color: 'white', width: '100%' }}
                    onClick={() => handleCreateRetest()}
                  >
                    Re-Test
                  </Button>
                </Grid>
              </Grid>
            )}
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
                        {selectedReportType?.id === 3 && (
                          <TableCell>
                            <Checkbox
                              checked={rowData?.is_checked}
                              onChange={(e) => handleSelectERP(e, rowData?.erp_no, index)}
                              color='primary'
                              name='is_erp_selected'
                            />
                          </TableCell>
                        )}
                        <TableCell className={classes.tableCell}>
                          {limit * (page - 1) + index + 1}
                        </TableCell>
                        {selectedReportType?.id === 1 || selectedReportType?.id === 12 && (
                          <TableCell className={classes.tableCell}>
                            {rowData?.section_name}
                          </TableCell>
                        )}
                        {selectedReportType?.id === 1 || selectedReportType?.id === 12 && (
                          <TableCell className={classes.tableCell}>
                            {rowData?.class_average}
                          </TableCell>
                        )}
                        {selectedReportType?.id === 1 || selectedReportType?.id === 12 && (
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
