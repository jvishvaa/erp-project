import React, { useState, useEffect, useContext } from 'react';
// import axiosInstance from '../../../../config/axios';
import axios from 'axios';
import {
  Paper,
  Grid,
  Typography,
  makeStyles,
  TableCell,
  TableBody,
  TableContainer,
  TableRow,
  TableHead,
  Table,
  TextField,
} from '@material-ui/core';
import Layout from 'containers/Layout';
import { ArrowForwardIos as ArrowForwardIosIcon } from '@material-ui/icons';
import clsx from 'clsx';
import moment from 'moment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
import { useHistory } from 'react-router-dom';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import endpoints from 'config/endpoints';
import Loader from 'components/loader/loader';
import { connect, useSelector } from 'react-redux';
import FilterDetailsContext from '../store/filter-data';
import axiosInstance from '../../../../config/axios';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useParams, withRouter } from 'react-router-dom';
import NoFilterData from 'components/noFilteredData/noFilterData';

const useStyles = makeStyles((theme) => ({
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

const CurriculumCompletionDetails = (props) => {
  const { branchId } = useParams();
  const dashBoard = () => {
    history.push({
      pathname: `/dashboard`,
      counter: 2,
    });
  };
  const [moduleId, setModuleId] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [selectedbranchIds, setSelectedbranchIds] = useState([]);

  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [selectedGradeIds, setSelectedGradeIds] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [sectionId, setSectionId] = useState('');

  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [subjectId, setSubjectId] = useState();

  // const { setAlert } = useContext(AlertNotificationContext);
  const [selectedSectionIds, setSelectedSectionIds] = useState([]);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const ctx = useContext(FilterDetailsContext);

  const volumeArr = [{ volume: 'volume1' }, { volume: 'volume2' }];

  const classes = useStyles();
  const history = useHistory();
  const [curriculumData, setCurriculumData] = useState([]);
  const [acadId, setAcadId] = useState(1);
  const [loading, setLoading] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const chapterTopicHandler = () => {
    history.push({
      pathname: './chapter_Topics',
      state: {
        gradeId: selectedGradeIds,
        sectionId: selectedSectionIds,
        acadSessionId: props?.history?.location?.state?.acadIdMain,
        subjectId: subjectId,
        branchId: props?.history?.location?.state?.branchIdMain,
      },
    });
  };

  const handleBranch = () => {
    setGradeList([]);
    setSelectedSection([]);
    setSelectedSubject([]);
    callApi(
      `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${props?.history?.location?.state?.branchIdMain}&module_id=${ctx.moduleId}`,
      'gradeList'
    );
  };

  const handleGrade = (event = {}, value = []) => {
    // setSelectedGrade([]);

    const ids = value;
    const selectedId = value?.grade_id;
    setSelectedGrade(ids);
    setSelectedGradeIds(selectedId);
    setSectionList([])  //clear List
    setSubjectList([])
    setSelectedSection([])
    setSelectedSubject([])
    setCurriculumData([])
    callApi(
      `${endpoints.academics.sections}?session_year=${
        selectedAcademicYear?.id
      }&branch_id=${
        props?.history?.location?.state?.branchIdMain
      }&grade_id=${selectedId?.toString()}&module_id=${ctx.moduleId}`,
      'section'
    );
  };

  const handleSection = (event = {}, value = []) => {
    const ids = value;
    const selectedId = value?.section_id;
    const sectionid = value?.id;
    setSectionId(sectionid);
    setSelectedSection(ids);
    setSelectedSectionIds(selectedId);
    setSubjectList([]) //clear
    setSelectedSubject([])
    setCurriculumData([])
    callApi(
      `${endpoints.academics.subjects}?session_year=${selectedAcademicYear?.id}&branch=${
        props?.history?.location?.state?.branchIdMain
      }&grade=${selectedGradeIds}&section=${selectedId?.toString()}&module_id=${
        ctx.moduleId
      }`,
      'subject'
    );
  };

  const handleSubject = (event = {}, value = []) => {
    setSelectedSubject(value);
    setSubjectId(value?.subject__id);
    setCurriculumData([]);
    if(value?.subject__id){
      dataList(value?.subject__id);
    }
    // pendingInfo();
  };

  // const pendingInfo = () => {
  //   pendingDetails(sectionId, subjectId, periodDate);
  // };

  function callApi(api, key) {
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'gradeList') {
            setGradeList(result.data.data || []);
          }
          if (key === 'section') {
            setSectionList(result.data.data);
          }
          if (key === 'subject') {
            setSubjectList(result.data.data);
          }
        } else {
          console.log('error', result.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    handleBranch();
  }, [ctx.moduleId]);

  const [periodDate, setPeriodDate] = useState(moment().format('YYYY-MM-DD'));
  const handleDateClass = (e) => {
    setPeriodDate(e.target.value);
  };

  useEffect(()=>{
    let acadId = props?.history?.location?.state?.acadIdMain;
    if(periodDate && selectedGradeIds && selectedSectionIds && acadId && subjectId){
      dataList(subjectId)
    }
  },[periodDate])

  let date = moment().format('YYYY-MM-DD');

  const dataList = (subjectId) => {
    setLoading(true);
    axios
      .get(
        // `dev.reports.letseduvate.com/api/acad_performance/v1/teacher-dashboard/chapter-wise-topics-completion-stats/?grade_id=2,3&acad_session_id=102&date_range_type=2022-03-10`,
        `${
          endpoints.teacherDashboard.gradeSectionAggregated
        }?grade_id=${selectedGradeIds?.toString()}&section_id=${selectedSectionIds}&acad_session_id=${
          props?.history?.location?.state?.acadIdMain
        }&subject_id=${subjectId}&date_range_type=${periodDate}`,
        {
          headers: {
            // 'X-DTS-HOST': 'qa.olvorchidnaigaon.letseduvate.com',
            'X-DTS-HOST': window.location.host,
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setCurriculumData(result.data.result);
          setAlert('success', result?.data?.message);
        } else {
          setAlert('error', result?.data?.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        setAlert('error', error?.message);
        setLoading(false);
      });
  };

  // useEffect(() => {
  //   dataList();
  // }, []);

  return (
    <Layout>
      {loading && <Loader />}
      <div style={{ marginLeft: '1%', marginTop: '1%' }}>
        <ArrowBackIcon style={{ cursor: 'pointer' }} onClick={dashBoard} />
      </div>
      <div style={{ marginTop: '-2%', marginLeft: '-1%' }}>
        <CommonBreadcrumbs
          componentName='Dashboard'
          childComponentName='Curriculum Completion'
        />
      </div>
      <Grid
        xs={12}
        container
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        style={{ padding: 15, marginTop: '-2%' }}
      >
        <Grid
          container
          direction='row'
          // justifyContent='space-between'
          xs={12}
          sm={12}
          md={12}
          lg={12}
          spacing={1}
        >
          {/* <Grid item xs={12} md={2} spacing={1}>
            <Autocomplete
              id='combo-box-demo'
              size='small'
              // value={volume}
              // onChange={handleGrade}
              options={volumeArr || []}
              getOptionLabel={(option) => option?.volume || ''}
              // getOptionSelected={(option, value) => option?.id == value?.id}
              renderInput={(params) => (
                <TextField {...params} label='Volume' variant='outlined' />
              )}
            />
          </Grid> */}
          <Grid item xs={12} md={2} spacing={1}>
            <Autocomplete
              id='combo-box-demo'
              size='small'
              value={selectedGrade || []}
              onChange={handleGrade}
              options={gradeList || []}
              getOptionLabel={(option) => option?.grade__grade_name || ''}
              getOptionSelected={(option, value) => option?.id == value?.id}
              renderInput={(params) => (
                <TextField {...params} label='Grade' variant='outlined' />
              )}
            />
          </Grid>
          <Grid item xs={12} md={2} spacing={1}>
            <Autocomplete
              size='small'
              onChange={handleSection}
              id='branch_id'
              value={selectedSection || []}
              options={sectionList || []}
              getOptionLabel={(option) =>
                option?.section__section_name || option?.section_name || ''
              }
              getOptionSelected={(option, value) =>
                option?.section_id == value?.section_id
              }
              renderInput={(params) => (
                <TextField {...params} label='Section' variant='outlined' />
              )}
            />
          </Grid>
          <Grid item xs={12} md={2} spacing={1}>
            <Autocomplete
              id='subject'
              size='small'
              onChange={handleSubject}
              className='dropdownIcon'
              value={selectedSubject || []}
              options={subjectList || []}
              getOptionLabel={(option) =>
                option?.subject__subject_name || option?.subject__subject_name || ''
              }
              getOptionSelected={(option, value) =>
                option?.subject__subject_name == value?.subject__subject_name
              }
              renderInput={(params) => (
                <TextField {...params} label='Subject' variant='outlined' />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}></Grid>
          <Grid item xs={12} md={2} spacing={1}>
            <TextField
              style={{
                cursor: 'pointer',
                border: '1px solid black',
                borderRadius: '5px',
                paddingTop: '5px',
                width: '100%',
                // position: 'relative',
                // left: '200px',
                paddingLeft: '10px'
              }}
              id='date'
              // label='Till Date'
              type='date'
              size='small'
              defaultValue={date}
              onChange={handleDateClass}
              inputProps={{ max: date }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <div style={{ display: 'flex', marginBottom: 10, marginLeft: 20 }}>
        <div className={clsx(classes.textBold)}>
          Curriculum Completion Details :{'\u00A0'}
          {'\u00A0'}
        </div>
        <div className={clsx(classes.textBold)}>All grades and section</div>
      </div>
      <div style={{ padding: '0px 20px' }}>
        {curriculumData.length === 0? <div style={{height:'200px',justifyContent:'center',  marginTop:'70px'}} ><NoFilterData data={'No Data Found'}/></div> :
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ background: '#ebf2fe' }}>
              <TableRow>
                <TableCell className={clsx(classes.textLeft)}>
                  Grade and Subject
                </TableCell>
                <TableCell align='right'>Total Topics</TableCell>
                <TableCell align='right'>Completed Topics</TableCell>
                <TableCell align='right'>Completion Percentage</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {curriculumData.map((item) => (
                <TableRow key={item.totalTest}>
                  <TableCell
                    component='th'
                    scope='row'
                    className={clsx(classes.textLeft)}
                  >
                    <b>{item.period__subject_mapping__section_mapping__grade__grade_name}</b>
                    {'\u00A0'}-{'\u00A0'}
                    {item.period__subject_mapping__section_mapping__section__section_name}{' '}
                    {'\u00A0'}
                    {'\u00A0'}
                    {'\u00A0'}
                    {item.period__subject_mapping__subject__subject_name}
                  </TableCell>
                  <TableCell align='right'>{item.total_topics}</TableCell>
                  <TableCell align='right'>{item.total_completed}</TableCell>
                  <TableCell align='right'>
                    {item.percentage_completed ? item.percentage_completed : '0'}%
                  </TableCell>
                  {/* <TableCell align='left'>
                    <ArrowForwardIosIcon
                      style={{ cursor: 'pointer' }}
                      onClick={chapterTopicHandler}
                    />
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>}
      </div>
    </Layout>
  );
};

export default CurriculumCompletionDetails;
