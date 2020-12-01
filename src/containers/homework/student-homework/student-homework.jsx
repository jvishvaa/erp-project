/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
import React, { useContext, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import StarIcon from '@material-ui/icons/Star';
import { Grid, TextField, Button, SvgIcon, Icon, Slide } from '@material-ui/core';
import MomentUtils from '@date-io/moment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Loading from '../../../components/loader/loader';
import hwGiven from '../../../assets/images/hw-given.svg';
import studentHomeworkEvaluted from '../../../assets/images/student-hw-evaluated.svg';
import hwFileUnopened from '../../../assets/images/hw-file-unopened.svg';
import hwFileOpened from '../../../assets/images/Group-8243.svg';
import hwFileNotSubmitted from '../../../assets/images/hw-not-submitted.svg';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import './student-homework.css';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
    width: '100%',
    marginLeft: '5px',
    marginTop: '5px',
    [theme.breakpoints.down('xs')]: {
      width: '87vw',
      margin: 'auto',
    },
  },
  container: {
    maxHeight: 440,
  },
}));

const StudentHomework = withRouter(({ history, ...props }) => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [isHidden, setIsHidden] = useState(window.innerWidth < 600);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [messageRows, setMessageRows] = useState({
    header: ['date', 'english', 'history', 'math', 'other', 'science'],
    rows: [
      {
        id: 0,
        date: '11-10-20',
        english: { isHomework: true, isSubmited: false },
        history: { isHomework: true, isSubmited: true },
        math: { isHomework: false },
        other: { isHomework: true, isSubmited: false },
        science: { isHomework: true, isSubmited: false },
      },
      {
        id: 1,
        date: '12-10-20',
        english: { isHomework: true, isSubmited: false },
        history: { isHomework: true, isSubmited: true },
        math: { isHomework: false },
        other: { isHomework: true, isSubmited: true },
        science: { isHomework: true, isSubmited: false },
      },
      {
        id: 2,
        date: '13-10-20',
        english: { isHomework: true, isSubmited: true },
        history: { isHomework: true, isSubmited: false },
        math: { isHomework: false },
        other: { isHomework: true, isSubmited: false },
        science: { isHomework: true, isSubmited: true },
      },
      {
        id: 3,
        date: '14-10-20',
        english: { isHomework: true, isSubmited: false },
        history: { isHomework: true, isSubmited: true },
        math: { isHomework: false },
        other: { isHomework: true, isSubmited: false },
        science: { isHomework: true, isSubmited: false },
      },
      {
        id: 4,
        date: '15-10-20',
        english: { isHomework: true, isSubmited: false },
        history: { isHomework: true, isSubmited: false },
        math: { isHomework: false },
        other: { isHomework: true, isSubmited: false },
        science: { isHomework: true, isSubmited: false },
      },
      {
        id: 5,
        date: '16-10-20',
        english: { isHomework: true, isSubmited: false },
        history: { isHomework: false },
        math: { isHomework: true, isSubmited: true },
        other: { isHomework: true, isSubmited: true },
        science: { isHomework: true, isSubmited: false },
      },
      {
        id: 6,
        date: '17-10-20',
        english: { isHomework: true, isSubmited: false },
        history: { isHomework: true, isSubmited: false },
        math: { isHomework: false },
        other: { isHomework: true, isSubmited: false },
        science: { isHomework: true, isSubmited: false },
      },
    ],
  });
  const [isSelectedCell, setIsSelectedCell] = useState({ row: '', index: '' });
  const [branchList, setBranchList] = useState([]);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [isEmail, setIsEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFromDate, setSelectedFromDate] = useState();
  const [selectedToDate, setSelectedToDate] = useState();
  const [moduleId, setModuleId] = useState();
  const [modulePermision, setModulePermision] = useState(true);

  const handleCellClick = (row, index) => {
    if (isSelectedCell.row === row && isSelectedCell.index === index) {
      setIsSelectedCell({ row: '', index: '' });
      return;
    }
    setIsSelectedCell({ row, index });
  };
  const handleFromDateChange = (event, value) => {
    setSelectedFromDate(value);
  };

  const handleToDateChange = (event, value) => {
    setSelectedToDate(value);
  };

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div className='message_log_wrapper'>
          <div className='message_log_breadcrumb_wrapper'>
            <CommonBreadcrumbs componentName='Homework' />
          </div>
          <div className='create_group_filter_container'>
            <Grid container spacing={5} className='message_log_container'>
              <MuiPickersUtilsProvider utils={MomentUtils} className='date_provider'>
                <Grid item xs={12} sm={3}>
                  <KeyboardDatePicker
                    margin='normal'
                    id='date-picker-dialog'
                    label='From'
                    className='message_log_date_piker'
                    format='YYYY-MM-DD'
                    value={selectedFromDate}
                    onChange={handleFromDateChange}
                    maxDate={new Date()}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <KeyboardDatePicker
                    margin='normal'
                    id='date-picker-dialog'
                    label='To'
                    className='message_log_date_piker'
                    format='YYYY-MM-DD'
                    value={selectedToDate}
                    onChange={handleToDateChange}
                    maxDate={new Date()}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </Grid>
              </MuiPickersUtilsProvider>
            </Grid>
          </div>
          <div className='message_log_white_wrapper'>
            <div className='homework_block_wrapper'>
              <div className='homework_block'>Weekly Time table</div>
              <div className='icon-desc-container'>
                <SvgIcon
                  component={() => (
                    <img
                      style={{ width: '20px', marginRight: '5px' }}
                      src={hwGiven}
                      alt='given'
                    />
                  )}
                />
                <span>HW given</span>
              </div>
              <div className='icon-desc-container'>
                <SvgIcon
                  component={() => (
                    <img
                      style={{ width: '20px', marginRight: '5px' }}
                      src={hwFileNotSubmitted}
                      alt='homework not submitted'
                    />
                  )}
                />
                <span>HW not submitted</span>
              </div>
              <div className='icon-desc-container'>
                <SvgIcon
                  component={() => (
                    <img
                      style={{ width: '20px', marginRight: '5px' }}
                      src={hwFileOpened}
                      alt='evaluated'
                    />
                  )}
                />
                <span>File Opened</span>
              </div>
              <div className='icon-desc-container'>
                <SvgIcon
                  component={() => (
                    <img
                      style={{ width: '20px', marginRight: '5px' }}
                      src={hwFileUnopened}
                      alt='submitted'
                    />
                  )}
                />
                <span>File unopened</span>
              </div>
              <div className='icon-desc-container'>
                <SvgIcon
                  component={() => (
                    <img
                      style={{ width: '20px', marginRight: '5px' }}
                      src={studentHomeworkEvaluted}
                      alt='submitted'
                    />
                  )}
                />
                <span>Evaluated</span>
              </div>
            </div>
            <div className='create_group_filter_container'>
              <Grid container className='homework_container' spacing={2}>
                <Grid xs={12} lg={9} item>
                  <Paper className={`homework_table_wrapper ${classes.root}`}>
                    <TableContainer
                      className={`table table-shadow homework_table ${classes.container}`}
                    >
                      <Table stickyHeader aria-label='sticky table'>
                        <TableHead className='view_groups_header'>
                          <TableRow>
                            {messageRows.header.map((headers, i) => (
                              <TableCell className='homework_header'>{headers}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody className='table_body'>
                          {messageRows.rows.map((row, i) => (
                            <TableRow
                              // onClick={() => handleUserDetails(row.id)}
                              key={`message_log_details${i}`}
                            >
                              {messageRows.header.map((headers, i) =>
                                headers === 'date' ? (
                                  <TableCell>{row.date}</TableCell>
                                ) : row[headers].isHomework ? (
                                  <TableCell
                                    align='middle'
                                    onClick={() => handleCellClick(row.id, i)}
                                    className={
                                      isSelectedCell.row === row.id &&
                                      isSelectedCell.index === i
                                        ? 'selected'
                                        : 'null'
                                    }
                                  >
                                    {row[headers].isSubmited ? (
                                      <>
                                        <SvgIcon
                                          component={() => (
                                            <img
                                              style={{ width: '35px', padding: '5px' }}
                                              src={hwGiven}
                                              alt='given'
                                            />
                                          )}
                                        />
                                        <SvgIcon
                                          component={() => (
                                            <img
                                              style={{ width: '35px', padding: '5px' }}
                                              src={hwFileOpened}
                                              alt='homeworkopened'
                                            />
                                          )}
                                        />
                                        <SvgIcon
                                          component={() => (
                                            <img
                                              style={{ width: '35px', padding: '5px' }}
                                              src={studentHomeworkEvaluted}
                                              alt='homeworkEvaluted'
                                            />
                                          )}
                                        />
                                      </>
                                    ) : (
                                      <>
                                        <SvgIcon
                                          component={() => (
                                            <img
                                              style={{ width: '35px', padding: '5px' }}
                                              src={hwFileNotSubmitted}
                                              alt='homeworkunopened'
                                            />
                                          )}
                                        />
                                        <SvgIcon
                                          component={() => (
                                            <img
                                              style={{ width: '35px', padding: '5px' }}
                                              src={hwFileUnopened}
                                              alt='homeworkunopened'
                                            />
                                          )}
                                        />
                                      </>
                                    )}
                                  </TableCell>
                                ) : (
                                  <TableCell />
                                )
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
                <Grid xs={12} lg={3} item>
                  <Grid container>
                    <Grid lg={12} item>
                      <Paper className='top-performer-card'>
                        <Slide
                          direction='left'
                          in={drawerOpen}
                          mountOnEnter
                          unmountOnExit
                        >
                          <Paper className='top-performer-student-wrapper'>
                            <SvgIcon
                              component={() => (
                                <img
                                  style={{ width: '30px' }}
                                  src={hwGiven}
                                  alt='given'
                                />
                              )}
                            />
                            <div className='top-performer-student'>student 1</div>
                            <div className='top-performer-student'>student 1</div>
                            <div className='top-performer-student'>student 1</div>
                            <div className='top-performer-student'>student 1</div>
                            <div className='top-performer-student'>student 1</div>
                          </Paper>
                        </Slide>
                        <div className='top-performer-header'>
                          <span className='top-performer-tag'>Top performer</span>
                          <SvgIcon
                            component={() => (
                              <img
                                style={{ width: '30px', float: 'right' }}
                                src={hwGiven}
                                alt='given'
                              />
                            )}
                          />
                        </div>
                        <div
                          className='top-performer-subject'
                          onClick={() => setDrawerOpen(!drawerOpen)}
                        >
                          Subject 1
                        </div>
                        <div className='top-performer-subject'>Subject 2</div>
                        <div className='top-performer-subject'>Subject 3</div>
                        <div className='top-performer-subject'>Subject 4</div>
                        <div className='top-performer-subject'>Subject 5</div>
                      </Paper>
                    </Grid>
                    <Grid lg={12} item>
                      {isSelectedCell.index !== '' && isSelectedCell.row !== '' ? (
                        <div className='subject-homework-details-wrapper'>
                          <div className='subject-homework-details-tag'>Duration</div>
                          <div>Total homeworks given: 10</div>
                          <div>Total homeworks submitted: 5</div>
                          <div>
                            Subject 1{' '}
                            <StarIcon
                              className='top-performer-star-icon'
                              fontSize='large'
                            />
                            4/5
                          </div>
                        </div>
                      ) : null}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
});

export default StudentHomework;
