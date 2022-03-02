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
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
} from '@material-ui/icons';
import { withRouter, useHistory } from 'react-router-dom';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Pagination } from '@material-ui/lab';
import MediaQuery from 'react-responsive';
import { makeStyles } from '@material-ui/core';
// import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
// import Loader from '../../components/loader/loader';
// import axiosInstance from '../../config/axios';
// import endpoints from '../../config/endpoints';
import Layout from '../../../Layout';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  studentStrenghtDownloadButton: {
    width: '100%',
    color: theme.palette.secondary.main,
    backgroundColor: 'white !important',
    border: `1px solid ${theme.palette.primary.main} !important`,
  },
  cardContant: {
    padding: '8px',
  },
  lookALikeButton: {
    width: '100%',
    margin: '5px 0 0 0',
    // backgroundColor: 'rgba(0,0,0,0.1)',
    // borderRadius: '8px',
    padding: '5px',
    textAlign: 'center',
  },

  colorGreen: {
    color: 'lightgreen',
    textDecoration: 'underline',
  },
  colorRed: {
    color: 'red',
    textDecoration: 'underline',
  },
  colorYellow: {
    color: 'yellow',
    textDecoration: 'underline',
  },
  textAlignCenter: {
    textAlign: 'center',
  },
  textAlignEnd: {
    textAlign: 'end',
  },
  clickable: {
    cursor: 'pointer',
  },
  textBold: {
    fontWeight: '800',
  },
  absentGrid: {
    border: '1px solid red',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '3px',
  },
  detailsDiv: {
    borderRadius: '5px',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px',
    margin: '5px 0',
  },
  accordion: {
    margin: '10px 0 !important',
    border: '1px solid black',
    '&::before': {
      backgroundColor: 'black',
    },
  },
  applyColor1: {
    backgroundColor: 'lavenderblush',
  },
  applyColor2: {
    backgroundColor: 'lightgreen',
  },
  applyColor3: {
    backgroundColor: 'aliceblue',
  },
}));

const arr = [
  {
    id: 1,
    branchName: 'Branch 1',
    curriculumCompletion: '7%',
    studentReport: '85%',
    attendanceReport: '85%',
  },
  {
    id: 2,
    branchName: 'Branch 2',
    curriculumCompletion: '71%',
    studentReport: '86%',
    attendanceReport: '86%',
  },
  {
    id: 3,
    branchName: 'Branch 3',
    curriculumCompletion: '72%',
    studentReport: '87%',
    attendanceReport: '87%',
  },
];
const AcadView = (props) => {
  const classes = useStyles();
  const history = useHistory();

  console.log(props);

  const [academicPerformanceDetailsOpen, setAcademicPerformanceDetailsOpen] =
    useState(false);
  const [expanded, setExpanded] = useState(true);
  const [volume, setVolume] = React.useState('');

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };

  const handleChange = () => {
    console.log('hello');
    setExpanded(expanded ? false : true);
  };

  const handleCurr = () => {
    history.push('/curriculum-completion');
  };

  const handleStudentReport = () => {
    history.push('/student-report-dash');
  };

  return (
    <div style={{ width: '100%', overflow: 'hidden', padding: '20px' }}>
      <Grid item container spacing={2}>
        <>
          <Grid
            item
            container
            xs={12}
            spacing={2}
            justifyContent='space-between'
            alignItems='center'
          >
            <Grid item xs={3}>
              <IconButton onClick={() => setAcademicPerformanceDetailsOpen(false)}>
                <ArrowBackIcon />
              </IconButton>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth variant='outlined' margin='dense'>
                <InputLabel id='volume'>Volume</InputLabel>
                <Select
                  labelId='volume'
                  value={volume}
                  label='Volume'
                  onChange={handleVolumeChange}
                >
                  <MenuItem value={10}>Volume 1</MenuItem>
                  <MenuItem value={20}>Volume 2</MenuItem>
                  <MenuItem value={30}>Volume 3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {props?.branchList?.length > 0 &&
              props?.branchList?.map((each, index) => {
                return (
                  <Accordion
                    elevation={0}
                    className={clsx(classes.accordion)}
                    {...{
                      ...(index === 0 && {
                        expanded: expanded,
                        onChange: handleChange,
                      }),
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>{each?.branch?.branch_name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div style={{ width: '100%' }}>
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <div
                              className={clsx(classes.detailsDiv, classes.applyColor1)}
                              onClick={() =>
                                history.push(`/curriculum-completion/${each.id}`)
                              }
                            >
                              <div>
                                <Typography variant='body2'>
                                  Curriculum Completion
                                </Typography>
                              </div>
                              <div className={clsx(classes.textAlignEnd)}>
                                <Typography
                                  variant='body2'
                                  className={clsx(classes.textBold)}
                                >
                                  {each.curriculumCompletion}
                                </Typography>
                              </div>
                            </div>
                          </Grid>

                          <Grid item xs={4}>
                            <div
                              className={clsx(classes.detailsDiv, classes.applyColor2)}
                              onClick={() =>
                                history.push(`/student-report-dash/${each.id}`)
                              }
                            >
                              <div>
                                <Typography variant='body2'>Student Report</Typography>
                                <Typography variant='caption'>
                                  Learning & Engagement Reports
                                </Typography>
                              </div>
                              <div className={clsx(classes.textAlignEnd)}>
                                <Typography
                                  variant='body2'
                                  className={clsx(classes.textBold)}
                                >
                                  {each.studentReport}
                                </Typography>
                                <Typography variant='caption'>Av. Score</Typography>
                              </div>
                            </div>
                          </Grid>
                          <Grid item xs={4}>
                            <div
                              className={clsx(classes.detailsDiv, classes.applyColor3)}
                              onClick={() =>
                                history.push(`/attendance-report/${each.id}`)
                              }
                            >
                              <div>
                                <Typography variant='body2'>Attendance Report</Typography>
                              </div>
                              <div className={clsx(classes.textAlignEnd)}>
                                <Typography
                                  variant='body2'
                                  className={clsx(classes.textBold)}
                                >
                                  {each.attendanceReport}
                                </Typography>
                                <Typography variant='caption'>Av. Attendance</Typography>
                              </div>
                            </div>
                          </Grid>
                        </Grid>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
          </Grid>
        </>
      </Grid>
    </div>
  );
};

export default withRouter(AcadView);
