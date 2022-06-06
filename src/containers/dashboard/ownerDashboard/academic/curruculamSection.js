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
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from '@material-ui/core';
import { green, pink } from '@material-ui/core/colors';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
} from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Pagination } from '@material-ui/lab';
import MediaQuery from 'react-responsive';
import { makeStyles } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
// import Loader from '../../components/loader/loader';
// import axiosInstance from '../../config/axios';
// import endpoints from '../../config/endpoints';
// import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Layout from '../../../Layout';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import './style.scss';
import Loader from 'components/loader/loader';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';

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
  textAlignStart: {
    textAlign: 'start !important',
  },
  textAlignCenter: {
    textAlign: 'center',
  },
  textBold: {
    fontWeight: '800',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
  },
  colorCheckedGreen: {
    '& span svg': {
      color: 'green',
    },
  },
  colorCheckedRed: {
    '& span svg': {
      color: 'red',
    },
  },
}));

const CurriculumCompletionSection = (props) => {
  const classes = useStyles();
  const [volume, setVolume] = React.useState('');
  const history = useHistory();
  const [expanded, setExpanded] = useState(true);
  const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [loading, setLoading] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const [historySubject, setHistorySubject] = useState({});
  const [tableChapter, setTableChapter] = useState(null);

  const {
    match: {
      params: { branchId, gradeId, subjectId },
    },
  } = props;

  // let dateToday = moment().format('YYYY-MM-DD');

  useEffect(() => {
    // console.log(history?.location?.state, 'POPPPPPPP');
    setHistorySubject(history?.location?.state);
  }, [history]);

  const handleDateClass = (e) => {
    setDate(e.target.value);
  };

  const handleChange = () => {
    // console.log('hello');
    setExpanded(expanded ? false : true);
  };

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };

  useEffect(() => {
    if(date){
      chapterTable({
        branch_id: branchId,
        grade_id: gradeId,
        subject_id: subjectId,
        date:date
      });

    }
  }, [date]);

  const chapterTable = (params = {}) => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.ownerDashboard.curriculumChapterList}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': window.location.host,
          // 'X-DTS-Host': 'qa.olvorchidnaigaon.letseduvate.com',
          // Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InN1cGVyX2FkbWluX09MViIsImV4cCI6NjY0MDk0MzY4NCwiZW1haWwiOiJzdXBlcl9hZG1pbkBvcmNoaWRzLmVkdS5pbiIsImZpcnN0X25hbWUiOiJ0ZXN0IiwiaXNfc3VwZXJ1c2VyIjp0cnVlfQ.-xEeYFMvknL-PR6vsdR3a2QtCzej55lfIzllNgvJtTg'
        },
      })
      .then((res) => {
        if(res?.data?.message === "No data found"){
          setLoading(false)
          setAlert('error',res?.data?.message)
        }else{
          setTableChapter(res?.data?.result);
          setLoading(false);

        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  // useEffect(() => {
  //   chapterTable()
  // },[date])

  return (
    <Layout>
      <div
        style={{ width: '100%', overflow: 'hidden', padding: '20px' }}
        className='whole-section-curr'
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
          <IconButton size='small' onClick={() => history.goBack()}>
            <ArrowBackIcon />
          </IconButton>
            < CommonBreadcrumbs 
          componentName='Dashboard'
          childComponentName='Academic Performance' 
          childComponentNameNext = 'Curriculum Completion'
          />
          </Grid>
          <Grid xs={12}>
            <Typography style={{ marginLeft: '20px', fontWeight: 'bolder', textTransform:'capitalize' }}>
              {historySubject?.subjectName}
            </Typography>
          </Grid>
          <Grid item container xs={9} spacing={3}>
            {/* <Grid item xs={3}>
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
            </Grid> */}
            <Grid item xs={3}>
              <TextField
                id='date'
                variant='outlined'
                margin='dense'
                label='Till Date'
                type='date'
                value={date}
                // onChange={handleDateClass}
                onChange={(e) => setDate(e.target.value) }
                // defaultValue={dateToday}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={6}></Grid>
          <Grid item xs={6} className={clsx(classes.textAlignCenter)}>
            <Typography variant='h5'>Sections</Typography>
          </Grid>
          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className={clsx(classes.textAlignStart)}>TOPICS</TableCell>
                    <TableCell></TableCell>
                    {tableChapter &&
                      tableChapter?.details?.section.map((each, index) => {
                        return <TableCell key={index}>{each}</TableCell>;
                      })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableChapter &&
                    tableChapter?.data?.map((each, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell className={clsx(classes.textAlignStart)}>
                            {each?.period__subject_mapping__subject__chapter__chapter_name} :   {' '}
                            {each?.period__subject_mapping__subject__chapter__topic__topic_name}
                          </TableCell>
                          <TableCell></TableCell>
                          {each?.completion_status?.map((eachCheckbox, index) => {
                            return (
                              <TableCell key={index}>
                                <Checkbox
                                  checked
                                  disabled
                                  className={clsx(classes.checkbox, {
                                    [classes.colorCheckedGreen]: eachCheckbox,
                                    [classes.colorCheckedRed]: !eachCheckbox,
                                  })}
                                />
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        {loading && <Loader />}
      </div>
    </Layout>
  );
};

export default withRouter(CurriculumCompletionSection);
