import React, { useState, useEffect } from 'react';
import {
  Paper,
  Grid,
  makeStyles,
  TableCell,
  TableBody,
  TableContainer,
  TableRow,
  TableHead,
  Table,
  TextField,
  IconButton,
  Checkbox,
  withStyles,
  Card,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import clsx from 'clsx';
import moment from 'moment';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import endpoints from '../../../../config/endpoints';
import axios from '../../../../config/axios';
import Layout from 'containers/Layout';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiSvgIcon-root': {
      color: '#16C54B !important',
    },
  },
  gradeDiv: {
    width: '100%',
    height: '100%',
    border: '1px solid black',
    borderRadius: '8px',
    padding: '10px 15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // '&::before': {
    //   backgroundColor: 'black',
    // },
  },
  cardContantFlex: {
    display: 'flex',
    alignItems: 'center',
  },
  cardLetter: {
    padding: '6px 10px',
    borderRadius: '8px',
    margin: '0 10px 0 0',
    fontSize: '1.4rem',
  },
  absentDiv: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid red',
    padding: '0 5px',
  },
  link: {
    cursor: 'pointer',
    color: 'blue',
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
  colorBlue: {
    color: 'blue',
  },
  colorRed: {
    color: 'lightpink',
  },
  colorWhite: {
    color: 'white',
  },
  backgrounColorGreen: {
    backgroundColor: 'lightgreen',
  },
  backgrounColorBlue: {
    backgroundColor: 'lightblue',
  },
  backgrounColorRed: {
    backgroundColor: 'lightpink',
  },
  textLeft: {
    textAlign: 'left !important',
  },
  textcenter: {
    textAlign: 'center !important',
  },
}));
const CustomColorCheckbox = withStyles({
  root: {
    '& .MuiSvgIcon-root': {
      color: '#16C54B !important',
    },
    color: '#16C54B !important',
    '&$checked': {
      color: '#16C54B !important',
    },
  },
  checked: {},
})((props) => <Checkbox {...props} />);

function Row(props) {
  const classes = useStyles();
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const allLicenseData = (data) => {
    setOpen(!open);
  };

  const [check, setCheck] = useState(null);

  const checkList = (list) => {
    let count = 0;
    list.forEach((data) => {
      if (data === true) {
        count += 1;
      }
    });
    if (count === list.length) {
      return 0; // all true
    } else if (count === 0) {
      return 1; //all false
    } else {
      return 2; // yellow
    }
  };
  useEffect(() => {
    let datacheck = checkList(row?.periodstudymaterial__status);
    setCheck(datacheck);
  });

  return (
    <React.Fragment>
      <TableRow>
        <TableCell className={classes.textLeft} style={{ paddingLeft: '35px' }}>
          {row.subject_mapping__subject__chapter__chapter_name}
        </TableCell>
        <TableCell align='right' style={{ paddingRight: '35px' }}>
          {/* {row.completedDate} */}
        </TableCell>

        <TableCell align='right' style={{ paddingLeft: '28px' }}>
          {check === 0 ? (
            <CustomColorCheckbox
              defaultChecked
              disabled
              // className={classes.checkbox}
            />
          ) : check === 1 ? (
            <CancelIcon style={{ color: '#FE8083' }} />
          ) : (
            <CheckCircleIcon style={{ color: '#FFC258' }} />
          )}
        </TableCell>
        <TableCell>
          {
            <IconButton
              aria-label='expand row'
              size='small'
              onClick={() => allLicenseData()}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          }
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box margin={1}>
              {/* <Typography variant="h6" gutterBottom component="div">
                License Details
              </Typography> */}
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  {/* <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Completed Date</TableCell>
                    <TableCell>Completed</TableCell>
                  </TableRow> */}
                </TableHead>
                <TableBody>
                  {row?.subject_mapping__subject__chapter__topic__topic_name.map(
                    (data, index) => (
                      <TableRow>
                        <TableCell className={classes.textLeft} style={{ width: '50%' }}>
                          {/* {data.subject_mapping__subject__chapter__chapter_name} */}
                          {data}
                          {/* subject_mapping__subject__chapter__topic__topic_name */}
                        </TableCell>

                        <TableCell style={{ width: '23%' }}>
                          {/* {data.completed_Date} */}
                        </TableCell>
                        {/* {row?.periodstudymaterial__status.map((data, index) => ( */}
                        <TableCell>
                          {row?.periodstudymaterial__status[index] ? (
                            <CustomColorCheckbox
                              defaultChecked
                              disabled
                              // color="success"
                              className={classes.checkbox}
                            />
                          ) : (
                            <CancelIcon style={{ color: '#FE8083' }} />
                          )}
                        </TableCell>
                        {/* ))} */}
                        <TableCell></TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
const ChapterAndTopics = (props) => {
  const classes = useStyles();

  const [tableData, setTableData] = useState([]);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};

  const tabledataList = () => {
    axios
      .get(
        // `${endpoints.teacherDashboard.tableData}?grade_id=${props.history.location.state.gradeId}&section_id=${props.history.location.state.sectionId}&acad_session_id=${props.history.location.state.acadSessionId}&subject_id={props.history.location.state.subjectId}`,
        `${endpoints?.teacherDashboard?.tableData}?grade_id=${props?.history?.location?.state?.gradeId}&section_id=${props?.history?.location?.state?.sectionId}&acad_session_id=${props?.history?.location?.state?.acadSessionId}&subject_id=${props?.history?.location?.state?.subjectId}`,
        {
          headers: {
            // 'X-DTS-HOST': 'dev.olvorchidnaigaon.letseduvate.com',
            'X-DTS-HOST': window.location.host,
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        setTableData(result?.data?.result);

        // if (result?.data?.status_code === 200) {
        //   setStudentData(result);
        // } else {
        //   setAlert('error', result?.data?.message);
        // }
        // setLoading(false);
      })
      .catch((error) => {
        // setAlert('error', error?.message);
        // setLoading(false);
      });
  };

  useEffect(() => {
    tabledataList();
  }, []);

  const [periodDate, setPeriodDate] = useState();
  const handleDateClass = (e) => {
    setPeriodDate(e.target.value);
  };
  let date = moment().format('YYYY-MM-DD');
  const handleBack = () => {
    return props?.history.goBack();
  };
  return (
    <Layout>
      <CommonBreadcrumbs
        componentName='Dashboard'
        childComponentName='Curriculum Completion'
        childComponentNameNext='Chapter and Topics'
      />
      <Card
        style={{
          padding: '22px',
          marginBottom: '20px',
          marginLeft: '20px',
          width: '97%',
        }}
      >
        <Grid
          xs={12}
          container
          direction='row'
          style={{ padding: '5px', font: 'Caption' }}
        >
          <div style={{ display: 'flex', marginLeft: '-20px' }}>
            <ArrowBackIosIcon
              onClick={handleBack}
              style={{ fontSize: 'larger', cursor: 'pointer' }}
            />
            Back to curriculam Completion
          </div>
        </Grid>
        <Grid xs={12} container direction='row' style={{ padding: '5px' }}></Grid>
        <Grid xs={12} container direction='row' style={{ padding: '5px' }}>
          <Grid xs={2}>
            Grade And Section : {props?.history?.location?.state?.gradeId}/
            {props?.history?.location?.state?.sectionId}
          </Grid>
          <Grid xs={2}>Test : Maths Quiz 1</Grid>
          <Grid xs={2}>Date Range : Jan 15</Grid>
        </Grid>
      </Card>
      <div style={{ padding: '0px 20px' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ background: '#EBF2FE' }}>
              <TableRow>
                <TableCell className={classes.textLeft} style={{ width: '50%' }}>
                  Chapter and Topics
                </TableCell>
                {/* <TableCell align='right'>Total Topics</TableCell> */}
                <TableCell align='right'>Completed Date</TableCell>
                <TableCell align='right'>Completed</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row) => (
                <Row
                  key={row.subject_mapping__subject__chapter__chapter_name}
                  row={row}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Layout>
  );
};
export default ChapterAndTopics;
