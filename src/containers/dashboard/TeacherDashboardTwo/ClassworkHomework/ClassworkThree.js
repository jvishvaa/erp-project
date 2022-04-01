import React, { useState, useEffect, createContext, useContext } from 'react';

import Layout from '../../../Layout/index';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { Search } from '@material-ui/icons';
import Submitted from './Submitted';
import Pending from './Pending';
import Remarks from './Remarks';
import { Typography, makeStyles, IconButton } from '@material-ui/core';
import moment from 'moment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
import endpoints from 'config/endpoints';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import axiosInstance from '../../../../config/axios';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import DateRangeIcon from '@material-ui/icons/DateRange';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

import { useHistory } from 'react-router-dom';
export const FilterContext = createContext();

const useStyles = makeStyles((theme) => ({
  pending: {
    backgroundColor: 'white',
    border: '0.5px solid whitesmoke',
    cursor: 'pointer',
    width: '150px',
    textAlign: 'center',
    color: '#4093D4',
    // '&:active': {
    //   backgroundColor: '#4093D4 !important',
    //   color: 'white',
    // },
    // '&:hover': {
    //   backgroundColor: '#4093D4 !important',
    //   color: 'white',
    // },
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

function ClassworkThree(props) {
  const classes = useStyles();
  const [section, setSection] = useState();
  const [grade, setGrade] = useState();
  const [subject, setSubject] = useState();
  const [date, setDate] = useState();
  // console.log('debugclassthree', props);
  const history = useHistory();

  const databranch = props?.history?.location?.state?.databranch;
  const dataGrade = props?.history?.location?.state?.databranch;
  const dataSection = props?.history?.location?.state?.databranch;
  const selectedDate =
    props?.history?.location?.state?.detail?.uploaded_at__date ||
    props?.history?.location?.state?.detail?.date;
  const [defaultdate, setDefaultDate] = useState(selectedDate);
  const acadSessionId = history?.location?.state?.data?.acad_session_id;
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [homework, setHomework] = useState(true);
  const { setAlert } = useContext(AlertNotificationContext);

  const [acadIDS, setAcadIDS] = useState();
  const [moduleId, setModuleId] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [selectedbranchIds, setSelectedbranchIds] = useState([]);

  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(
    props?.history?.location?.state?.selectedGradevalue
  );

  const upcominggradeid = props?.history?.location?.state?.selectedGradeIds1;
  const [selectedGradeIds, setSelectedGradeIds] = useState(upcominggradeid);
  const [selectedSubject, setSelectedSubject] = useState(
    props?.history?.location?.state?.selectedSubjectvalue
  );

  const [sectionId, setSectionId] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState(
    props?.history?.location?.state?.selectedSectionvalue
  );

  const [subjectList, setSubjectList] = useState([]);
  const upcommingsubjectId =
    props?.history?.location?.state?.subjectId1 ||
    props?.history?.location?.state?.detail?.subject_id;
  const [subjectId, setSubjectId] = useState(upcommingsubjectId);
  const upcomingsectionId = props?.history?.location?.state?.selectedSectionIds1;
  const [selectedSectionIds, setSelectedSectionIds] = useState(upcomingsectionId);
  const [periodDate, setPeriodDate] = useState();
  const [classworkData, setClassworkData] = useState([]);
  const [dateRangeTechPer, setDateRangeTechPer] = useState([]);

  // let date = moment().format('YYYY-MM-DD');

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [gradeSectionList, setGradeSectionList] = useState([]);
  const [indvalue, setIndvalue] = useState(0);
  const [rowGrade, setRowGrade] = useState();
  const [rowSubject, setrowSubject] = useState();
  const [rowSection, setRowSection] = useState();
  const [updatedGrade, setUpdatedGrade] = useState('red');
  const [subjectmappingId, setSubjectmappingId] = useState(null);

  const [urlhwId, seturlhwID] = useState(
    props?.history?.location?.state?.detail?.homework_id
  );
  const [urlperiodId, seturlPeriodID] = useState(
    props?.history?.location?.state?.detail?.period_id
  );

  const [subjectChangedfilterOn, setSubjectChangedfilterOn] = useState(false);
  // const [filteredSection, setFilteredSection] = useState('');
  // const [filteredSubject, setFilteredSubject] = useState('');
  // const [filteredDate, setFilteredDate] = useState('');

  const [status, setStatus] = useState({
    pending: false,
    submitted: true,
    remarks: false,
  });
  const pendingClick = () => {
    setStatus({ pending: true, submitted: false, remarks: false });
  };
  const submittedClick = () => {
    setStatus({ pending: false, submitted: true, remarks: false });
  };
  const remarksClick = () => {
    setStatus({ pending: false, submitted: false, remarks: true });
  };
  const dataincoming = props?.history?.location?.state;

  const handleBranch = () => {
    // setGradeList([]);
    // setSelectedSection([]);
    // setSelectedSubject([]);
    callApi(
      `${
        endpoints.academics.grades
      }?session_year=${sessionYearIDDDD}&branch_id=${databranch}&module_id=${2}`,
      'gradeList'
    );
  };

  const handleGrade = (event = {}, value = []) => {
    setSelectedSection([]);
    setSelectedSubject([]);
    const selectedId = value?.grade_id;
    setSelectedGrade(value);
    setSelectedGradeIds(selectedId);

    callApi(
      `${
        endpoints.academics.sections
      }?session_year=${sessionYearIDDDD}&branch_id=${databranch}&grade_id=${selectedId?.toString()}&module_id=${2}`,
      'section'
    );
  };

  const handleSection = (event = {}, value = []) => {
    // setSectionList([])
    // setSubjectId()
    if (value) {
      setSubjectList([]);
      setSelectedSubject([]);
      setSelectedSectionIds([]);
      setSubjectId();

      const selectedsecctionId = value?.section_id;
      const sectionid = value?.id;
      setSectionId(sectionid);
      setSelectedSection(value);
      setSelectedSectionIds(selectedsecctionId);
      callApi(
        `${
          endpoints.academics.subjects
        }?session_year=${sessionYearIDDDD}&branch=${databranch}&grade=${selectedGradeIds?.toString()}&section=${selectedsecctionId.toString()}&module_id=${2}`,
        'subject'
      );
    } else {
      setSubjectList([]);
      setSelectedSubject([]);
      setSelectedSectionIds([]);
      setSubjectId();
    }
  };

  const handleSubject = (event = {}, value = []) => {
    setSelectedSubject(value);

    setSubjectId(value?.subject__id);
    setSubjectmappingId(value?.id);
    setSubjectChangedfilterOn(true);
    // pendingInfo();
    // pendingDetails(sectionId, value?.subject__id, periodDate);
  };

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

  const { id } = JSON.parse(sessionStorage.getItem('acad_session')) || {};
  const sessionYearIDDDD = id;

  useEffect(() => {
    handleBranch();
  }, []);

  // const handleDateChange = (newValue) => {
  //   setDateRangeTechPer(newValue);
  //   setStartDate(moment(newValue[0]).format('YYYY-MM-DD'));
  //   setEndDate(moment(newValue[1]).format('YYYY-MM-DD'));
  // };
  const dateUpdatefun = (event) => {
    setDefaultDate(event.target.value);
  };

  const datapass = {
    selectedSectionIds,
    subjectChangedfilterOn,
    subjectmappingId,
    defaultdate,
  };

  const displayDetails = () => {
    return (
      <FilterContext.Provider value={datapass}>
        <Grid style={{ width: '100%' }}>
          {status.submitted && !status.pending && !status.remarks && (
            <Submitted
              dataincoming={dataincoming}
              selectedGradeIds2={selectedGradeIds}
              selectedSectionIds2={selectedSectionIds}
              subjectId2={subjectId}
              Date2={defaultdate}
              Subjectfiltered={subjectChangedfilterOn}
              subjectmapping={subjectmappingId}
            />
          )}
          {status.pending && !status.submitted && !status.remarks && (
            <Pending
              dataincoming={dataincoming}
              selectedGradeIds2={selectedGradeIds}
              selectedSectionIds2={selectedSectionIds}
              subjectId2={subjectId}
              Date2={defaultdate}
              Subjectfiltered={subjectChangedfilterOn}
              subjectmapping={subjectmappingId}
            />
          )}
          {status.remarks && !status.submitted && !status.pending && (
            <Remarks
              dataincoming={dataincoming}
              selectedGradeIds2={selectedGradeIds}
              selectedSectionIds2={selectedSectionIds}
              subjectId2={subjectId}
              Date2={defaultdate}
              Subjectfiltered={subjectChangedfilterOn}
              subjectmapping={subjectmappingId}
            />
          )}
        </Grid>
      </FilterContext.Provider>
    );
  };

  useEffect(() => {
    displayDetails();
  }, [sectionId, selectedSectionIds, defaultdate, selectedGradeIds]);

  const classWorkTotal = classworkData[0]?.classwork_details?.total;

  return (
    <Layout>
      {/* <Header pendingDetails={pendingDetails} main={props} filterArray={dataupdate}/> */}
      <>
        {/* {loading && <Loader />} */}
        <CommonBreadcrumbs
          componentName='Dashboard'
          childComponentName={
            dataincoming?.hwcwstatus ? (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span>Homework And Classwork</span> <KeyboardArrowRightIcon />{' '}
                <span>HomeWork</span>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span>Homework And Classwork</span> <KeyboardArrowRightIcon />{' '}
                <span>ClassWork</span>
              </div>
            )
          }
        />
        <KeyboardBackspaceIcon
          style={{ cursor: 'pointer', marginLeft: 40 }}
          onClick={() => history.goBack()}
        />
        <Grid
          xs={12}
          container
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          style={{ padding: 15 }}
        >
          <Grid container item direction='row' xs={12} md={6} spacing={2}>
            <Grid item xs={12} md={3} spacing={2}>
              <Autocomplete
                id='combo-box-demo'
                size='small'
                options={gradeList}
                onChange={handleGrade}
                value={selectedGrade}
                getOptionLabel={(option) => option?.grade_name}
                // style={{ marginRight: 15 }}
                renderInput={(params) => (
                  <TextField {...params} label='Grade' variant='outlined' />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3} spacing={2}>
              <Autocomplete
                id='combo-box-demo'
                size='small'
                options={sectionList}
                onChange={handleSection}
                value={selectedSection}
                getOptionLabel={(option) => option?.section__section_name}
                // style={{ marginRight: 15 }}
                renderInput={(params) => (
                  <TextField {...params} label='Section' variant='outlined' />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3} spacing={2}>
              <Autocomplete
                id='combo-box-demo'
                size='small'
                options={subjectList}
                onChange={handleSubject}
                value={selectedSubject}
                getOptionLabel={(option) => option?.subject__subject_name}
                // style={{ width: 120 }}
                renderInput={(params) => (
                  <TextField {...params} label='Subject' variant='outlined' />
                )}
              />
            </Grid>
          </Grid>
          <div
            style={{ marginTop: window.innerWidth < 768 ? '15px' : '', marginRight: 15 }}
          >
            <TextField
              id='date'
              label='Date'
              type='date'
              defaultValue={defaultdate}
              value={defaultdate || moment().format('YYYY-MM-DD')}
              onChange={dateUpdatefun}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        </Grid>
      </>
      {/* <Details section={section} subject={subject} date={date} /> */}
      {/* <Details hworcw={props} /> */}
      <>
        {/* <dataPropsContext.Provider value={dataincoming}> */}
        <Grid
          container
          style={{
            marginLeft: '22px',
            paddingRight: '46px',
          }}
          alignItems='center'
        >
          <Grid
            container
            style={{
              backgroundColor: '#EBF2FE',
              paddingRight: '10px',
            }}
            direction='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <Grid item style={{ paddingLeft: 15 }}>
              {/* <TextField
                id='input-with-icon-textfield'
                placeholder='Search'
                variant='outlined'
                margin='dense'
                size='small'
                style={{
                  width: 250,
                  backgroundColor: 'white',
                  borderRadius: 5,
                  transform: 'scaleY(0.8)',
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start' style={{ pointerEvents: 'none' }}>
                      <Search />
                    </InputAdornment>
                  ),
                }}
              /> */}
            </Grid>
            <Grid item>
              <Grid
                container
                justifyContent='center'
                alignItems='center'
                style={{ padding: '12px' }}
              >
                <Grid item>
                  <Typography style={{ fontSize: '12px', paddingRight: '15px' }}>
                    Actions:{' '}
                  </Typography>
                </Grid>
                <Grid
                  item
                  className={classes.pending}
                  onClick={pendingClick}
                  style={{
                    backgroundColor: status.pending ? '#4093D4' : 'white',
                    color: !status.pending ? '#4093D4' : 'white',
                    padding: '8px',
                  }}
                >
                  <span style={{ fontSize: '14px', padding: '5px' }}>Pending</span>
                </Grid>
                <Grid
                  item
                  className={classes.pending}
                  onClick={submittedClick}
                  style={{
                    backgroundColor: status.submitted ? '#4093D4' : 'white',
                    color: !status.submitted ? '#4093D4' : 'white',
                    padding: '8px',
                  }}
                >
                  <span style={{ fontSize: '14px', padding: '5px' }}>Submitted</span>
                </Grid>
                {dataincoming?.hwcwstatus && (
                  <Grid
                    item
                    className={classes.pending}
                    onClick={remarksClick}
                    style={{
                      backgroundColor: status.remarks ? '#4093D4' : 'white',
                      color: !status.remarks ? '#4093D4' : 'white',
                      padding: '8px',
                    }}
                  >
                    <span style={{ fontSize: '14px', padding: '5px' }}>
                      {' '}
                      Remark and Score
                    </span>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>

          {displayDetails()}
        </Grid>
        {/* </dataPropsContext.Provider> */}
      </>
    </Layout>
  );
}

export default ClassworkThree;
