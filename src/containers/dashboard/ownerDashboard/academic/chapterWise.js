/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Divider,
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
  TableFooter,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Box,
  Collapse,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
  ChevronRight as ArrowCircleRightIcon,
} from '@material-ui/icons';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { withRouter } from 'react-router-dom';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Pagination } from '@material-ui/lab';
import MediaQuery from 'react-responsive';
import { DatePicker, Space } from 'antd';
import { makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
// import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
// import Loader from '../../components/loader/loader';
// import axiosInstance from '../../config/axios';
// import endpoints from '../../config/endpoints';
// import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Layout from '../../../Layout';
// import { getModuleInfo } from '../../utility-functions';
import { Button } from 'antd';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import axiosInstance from 'config/axios';
import moment from 'moment';
import endpoints from 'config/endpoints';
import { fetchAllSectionsPerGrade } from 'containers/Finance/src/components/Finance/store/actions';
import Loader from 'components/loader/loader';
import { connect, useSelector } from 'react-redux';
import communicationStyles from 'containers/Finance/src/components/Finance/BranchAccountant/Communication/communication.styles';
import '../academic/style.scss';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { LeftOutlined } from '@ant-design/icons';
// import { TableCell, TableRow } from 'semantic-ui-react';

const useStyles = makeStyles((theme) => ({
  gradeBoxContainer: {
    // marginTop: '15px',
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
  gradeBox: {
    border: '1px solid black',
    padding: '3px',
  },
  gradeOverviewContainer: {
    border: '1px solid black',
    borderRadius: '10px',
    padding: '15px 8px',
    maxHeight: '55vh',
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
    //   ::-webkit-scrollbar {
    //     width: 12px;
    // }
  },
  eachGradeOverviewContainer: {
    border: '1px solid black',
    borderRadius: '10px',
    padding: '10px 8px',
    margin: '8px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eachGradeName: {
    backgroundColor: 'gray',
    color: 'white',
    padding: '4px',
    borderRadius: '5px',
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
  TableTextLeft: {
    textAlign: 'center !important',
    fontSize: '13px',
  },
  TableTextRight: {
    textAlign: 'right !important',
    fontSize: '14px'
  },
  TableTextRightContainer: {
    textAlign: 'right !important',
    paddingRight: '48px',
  },
  TableHeaderColor: {
    backgroundColor: `${theme.palette.v2Color1.primaryV2} !important`,
    color: 'black',
  },
  tableStateMent: {
    color: `${theme.palette.v2Color1.primaryV2} !important`,
    fontWeight: 'bolder'
  },
  viewButton: {
    backgroundColor: `${theme.palette.v2Color1.primaryV2} !important`,
  },
}));



const CurriculumCompletionChapter = (props) => {
  const classes = useStyles();
  const [volume, setVolume] = React.useState('');
  const history = useHistory();
  const [tableData, setTableData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [moduleId, setModuleId] = React.useState('');
  const [acadeId, setAcadeId] = React.useState('');
  const [gradeApiData, setGradeApiData] = React.useState([]);
  const [branchName, setBranchName] = React.useState([]);
  const [teacherView, setTeacherView] = useState()
  const [dateToday, setDateToday] = useState();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );



  const {
    match: {
      params: { branchId },
    },
  } = props;

  console.log(props);

  useEffect(() => {
    // console.log(history?.location?.state, 'Mobile99999999')
    setModuleId(history?.location?.state?.module_id);
    setAcadeId(history?.location?.state?.acad_session_id);
    setBranchName(history?.location?.state?.branchName)
    setDateToday(history?.location?.state?.selectedDate)
    setTeacherView(history?.location?.state?.teacherView)
  }, [history]);


  useEffect(() => {
    gradeData(branchId);
  }, [branchId, moduleId]);

  const { acad_session_id, module_id, acad_sess_id } = history.location.state;
  const dateFormat = 'YYYY/MM/DD';
  const handleCurrSubject = (gradeId, gradeName) => {
    history.push({
      pathname: `/curriculum-completion-subject/${branchId}/${gradeId}`,
      state: {
        grade: gradeId,
        gradeName: gradeName,
        acad_session_id: acad_session_id,
        acad_sess_id: acad_sess_id,
        module_id: moduleId,
        branchName: branchName,
        selectedDate: dateToday
      },
    });
  };

  const gradeData = (branchId) => {
    if (moduleId !== '' || null || undefined) {
      axiosInstance
        .get(
          `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${branchId}&module_id=${moduleId}`
        )
        .then((res) => {
          setGradeApiData(res?.data?.data);
        })
        .catch(() => { });
    }
  };

  useEffect(() => {
    console.log(dateToday);
    if(dateToday){
        gradeListTable({
          grade_id: history?.location?.state?.grade,
          session_year: selectedAcademicYear?.id,
          date: moment(dateToday).format('YYYY-MM-DD')
        });
  }
  }, [  dateToday]);

  const gradeListTable = (params = {}) => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.ownerDashboard.subjectWise}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((res) => {
        console.log(res);
        setTableData(res?.data?.result);
        setLoading(false);

        // setStudentData(res.data.result);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };




  const onChangeDate = (date, string) => {
    console.log(date, string);
    setDateToday(string)
  }
  const handleBack = () => {
    history.goBack();
  }


  return (
    <Layout>
      <div style={{ width: '100%', overflow: 'hidden', padding: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            < CommonBreadcrumbs
              componentName='Dashboard'
              // childComponentName='Academic Performance' 
              childComponentNameNext='Curriculum Completion'
            />
          </Grid>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }} >
            <Button onClick={handleBack} icon={<LeftOutlined />} className={clsx(classes.backButton)} >Back</Button>
            <Space direction="vertical">
              <DatePicker  onChange={onChangeDate} />
            </Space>
          </Grid>
            <Grid item container xs={12} spacing={3}>
              <Grid item xs={3}>

              </Grid>

              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead className={clsx(classes.TableHeaderColor)}>
                      <TableRow>
                        <TableCell className={clsx(classes.TableTextLeft)} style={{ minWidth: '150px' }} >
                          SUBJECT
                        </TableCell>
                        <TableCell className={clsx(classes.TableTextLeft)}>
                          Total Periods
                        </TableCell>
                        <TableCell className={clsx(classes.TableTextLeft)}>
                          Total Periods Conducted
                        </TableCell>
                        <TableCell className={clsx(classes.TableTextLeft)}>
                          Total Periods Pending
                        </TableCell>
                        <TableCell className={clsx(classes.TableTextLeft)}>
                          AVG. COMPLETION
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
             
                      {tableData &&
                        tableData?.data?.map((each, index) => {
                          return (
                            <>
                              <TableRow key={index}>
                                <TableCell className={clsx(classes.TableTextLeft)}>
                                  {' '}
                                  {
                                    each?.subject_name
                                  }{' '}
                                </TableCell>
                                <TableCell
                                  className={clsx(classes.TableTextLeft)}
                                >
                                  {each?.total_periods_sum} %
                                </TableCell>
                                <TableCell
                                  className={clsx(classes.TableTextLeft)}
                                >
                                  {each?.completed_periods_sum} %
                                </TableCell>

                                <TableCell
                                  className={clsx(classes.TableTextLeft)}
                                >
                                  {each?.pending_periods} %
                                </TableCell>
                                <TableCell
                                  className={clsx(classes.TableTextLeft)}
                                >
                                  {each?.avg} %
                                </TableCell>
                                <TableCell className={clsx(classes.TableTextRight)}>
                                  <IconButton
                                    size='large'
                                    onClick={() =>
                                      handleCurrSubject(
                                        each?.grade_id,
                                        each?.grade_name,
                                      )
                                    }

                                  >
                                    <ArrowCircleRightIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            </>
                          );
                        })}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell
                          className={clsx(classes.TableTextLeft)}>
                          Total Periods: {tableData?.total_periods ? tableData?.total_periods : ''}
                        </TableCell>
                        <TableCell
                          className={clsx(classes.TableTextLeft)}>
                          Total Periods Conducted	: {tableData?.completed_periods ? tableData?.completed_periods : ''}
                        </TableCell>
                        <TableCell
                          className={clsx(classes.TableTextLeft)}>
                          Total Periods Pending: {tableData?.pending_periods ? tableData?.pending_periods : ''}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
        </Grid>

        {loading && <Loader />}
      </div>
    </Layout>
  );
};

export default withRouter(CurriculumCompletionChapter);
