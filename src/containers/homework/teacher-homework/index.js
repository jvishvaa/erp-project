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
import { Grid, TextField, Button } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Loading from '../../../components/loader/loader';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import './student-homework.css';
import { SvgIcon, Icon } from '@material-ui/core';
import hwGiven from '../../../assets/images/hw-given.svg';
import hwEvaluated from '../../../assets/images/hw-evaluated.svg';
import submitted from '../../../assets/images/student-submitted.svg';

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

const TeacherHomework = withRouter(({ history, ...props }) => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [isHidden, setIsHidden] = useState(window.innerWidth < 600);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [messageRows, setMessageRows] = useState({
    header: ['Date', 'english', 'history', 'math', 'other', 'science'],
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
        history: { isHomework: true, isSubmited: true },
        math: { isHomework: false },
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
  const [moduleId, setModuleId] = useState();
  const [modulePermision, setModulePermision] = useState(true);

  const handleCellClick = (row, index) => {
    setIsSelectedCell({ row, index });
  };

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div className='message_log_wrapper'>
          <div className='message_log_breadcrumb_wrapper'>
            <CommonBreadcrumbs componentName='Homework' />
          </div>
          <div className='message_log_white_wrapper'>
            <div className='homework_block_wrapper'>
              <div className='homework_block'>Weekly Time table</div>
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
                                headers === 'Date' ? (
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
                                    {/* <SvgIcon> */}
                                    {/* <CheckCircleIcon style={{ color: 'green' }} /> */}
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
                                          src={hwEvaluated}
                                          alt='hwEvaluated'
                                        />
                                      )}
                                    />
                                    <SvgIcon
                                      component={() => (
                                        <img
                                          style={{ width: '35px', padding: '5px' }}
                                          src={submitted}
                                          alt='submitted'
                                        />
                                      )}
                                    />
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
              </Grid>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
});

export default TeacherHomework;
