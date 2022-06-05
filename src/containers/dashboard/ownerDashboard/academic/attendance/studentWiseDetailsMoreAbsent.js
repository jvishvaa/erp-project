/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Divider,
  Button,
  Typography,
  InputAdornment,
  Card,
  CardHeader,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Table,
  Paper
} from '@material-ui/core';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  DateRange as DateRangeIcon,
} from '@material-ui/icons';
import { withRouter, useHistory } from 'react-router-dom';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import moment from 'moment';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Pagination } from '@material-ui/lab';
import MediaQuery from 'react-responsive';
import { makeStyles } from '@material-ui/core';
// import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
// import Loader from '../../components/loader/loader';
import axiosInstance from '../../../../../config/axios';
import endpoints from '../../../../../config/endpoints';
// import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Layout from '../../../../Layout';
// import { getModuleInfo } from '../../utility-functions';
import clsx from 'clsx';
import { lightGreen } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  gradeBoxContainer: {
    // marginTop: '15px',
  },
  gradeBox: {
    border: '1px solid black',
    padding: '3px',
  },
  gradeOverviewContainer: {
    // border: '1px solid black',
    borderRadius: '10px',
    padding: '15px 8px',
    maxHeight: '60vh',
    overflowY: 'scroll',
    backgroundColor: 'white',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.3) ',
      borderRadius: '10px',
    },

    '&::-webkit-scrollbar-thumb': {
      borderRadius: '10px',
      '-webkit-box-shadow': ' inset 0 0 6px rgba(0,0,0,0.5)',
    },
  },
  textAlignEnd: {
    textAlign: 'end',
  },
  textBold: {
    fontWeight: '800',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
  },
  accordion: {
    margin: '10px 0 !important',
    border: '1px solid black',
    '&::before': {
      backgroundColor: 'black',
    },
  },
  tableCellLeftAlign: {
    textAlign: 'left !important',
  },
  tableCellRightAlign: {
    textAlign: 'right !important',
  },

  moreAbsentButton: {
    backgroundColor: 'lightpink',
    color: 'red',
    float: 'right',
  },
  colorGreen: {
    color: 'lightGreen',
  },
  colorRed: {
    color: 'red',
  },
}));
const StudentWiseDetailsMoreAbsent = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const {
    match: {
      params: { branchId, gradeId, sectionId, subjectId, acad_session_id },
    },
  } = props;
  const { grade_name, section_name, data } = history.location.state;
  const [dateRangeTechPer, setDateRangeTechPer] = useState([
    moment().subtract(0, 'days'),
    moment(),
  ]);
  const [moreAbsentData, setMoreAbsentData] = useState(null);

  useEffect(() => {
    console.log(history.location.state);
    setDateRangeTechPer([
      moment(history.location.state.start_date),
      moment(history.location.state.end_date),
    ]);
  }, []);
  useEffect(() => {
    getMoreAbsentStudentWiseData({
      acad_session_id: acad_session_id,
      grade_id: gradeId,
      section_id: sectionId,
      start_date: moment(dateRangeTechPer[0])?.format('YYYY-MM-DD'),
      end_date: moment(dateRangeTechPer[1])?.format('YYYY-MM-DD'),
    });
  }, [dateRangeTechPer]);

  const getMoreAbsentStudentWiseData = (params = {}) => {
    axiosInstance
      .get(`${endpoints.ownerDashboard.studentWiseStudentAttendanceState}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': window.location.host,
          // 'X-DTS-Host': 'dev.olvorchidnaigaon.letseduvate.com ',
          // Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InN1cGVyX2FkbWluX09MViIsImV4cCI6NjY0MDk0MzY4NCwiZW1haWwiOiJzdXBlcl9hZG1pbkBvcmNoaWRzLmVkdS5pbiIsImZpcnN0X25hbWUiOiJ0ZXN0IiwiaXNfc3VwZXJ1c2VyIjp0cnVlfQ.-xEeYFMvknL-PR6vsdR3a2QtCzej55lfIzllNgvJtTg'
        },
      })
      .then((res) => {
        console.log(res);
        setMoreAbsentData(res.data.result?.below_thresh_hold_students);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Layout>
      <div style={{ width: '100%', overflow: 'hidden', padding: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className={clsx(classes.breadcrumb)}>
              <IconButton size='small' onClick={() => history.goBack()}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant='h6' className={clsx(classes.textBold)}>
                Student Attendance ({grade_name}, {section_name})
              </Typography>
            </div>
          </Grid>
          <Grid
            item
            container
            xs={12}
            spacing={3}
            alignItems='center'
            justifyContent='space-between'
          >
            <Grid item xs={4}>
              <LocalizationProvider dateAdapter={MomentUtils}>
                <DateRangePicker
                  //   minDate={minStartDate ? new Date(minStartDate) : undefined}
                  //   maxDate={maxStartDate ? new Date(maxStartDate) : undefined}
                  startText='Select-date-range'
                  value={dateRangeTechPer}
                  onChange={(newValue) => {
                    console.log(newValue, 'new');
                    setDateRangeTechPer(newValue);
                  }}
                  renderInput={({ inputProps, ...startProps }, endProps) => {
                    return (
                      <>
                        <TextField
                          {...startProps}
                          inputProps={{
                            ...inputProps,
                            value: `${moment(inputProps.value).format(
                              'DD/MM/YYYY'
                            )} - ${moment(endProps.inputProps.value).format(
                              'DD/MM/YYYY'
                            )}`,
                            readOnly: true,
                            endAdornment: (
                              <IconButton>
                                <DateRangeIcon
                                  style={{ width: '35px' }}
                                  color='primary'
                                />
                              </IconButton>
                            ),
                          }}
                          size='small'
                        />
                      </>
                    );
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={3}>
              <Button
                size='small'
                variant='contained'
                className={clsx(classes.moreAbsentButton)}
                endIcon={<ArrowForwardIcon />}
                onClick={() => history.goBack()}
              >
                View today's attendance
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Paper elevation={1} className={clsx(classes.gradeOverviewContainer)}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className={clsx(classes.tableCellLeftAlign)}>
                          Students
                        </TableCell>
                        {/* <TableCell className={clsx(classes.colorGreen)}>
                          Day's Present
                        </TableCell> */}
                        <TableCell
                          className={clsx(classes.colorRed, classes.tableCellRightAlign)}
                        >
                          Total Absent
                        </TableCell>
                        {/* <TableCell></TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {moreAbsentData &&
                        moreAbsentData.map((each, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell className={clsx(classes.tableCellLeftAlign)}>
                                {each.student_name}
                              </TableCell>
                              {/* <TableCell className={clsx(classes.colorGreen)}>{each.present}</TableCell> */}
                              <TableCell
                                className={clsx(
                                  classes.colorRed,
                                  classes.tableCellRightAlign
                                )}
                              >
                                {each.absent_count}
                              </TableCell>
                              {/* <TableCell>
                              <IconButton size='small'>
                                <ArrowForwardIcon />
                              </IconButton>
                            </TableCell> */}
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* {loading && <Loader />} */}
      </div>
    </Layout>
  );
};

export default withRouter(StudentWiseDetailsMoreAbsent);
