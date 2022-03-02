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
} from '@material-ui/core';
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
import { useHistory } from 'react-router-dom';

// import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
// import Loader from '../../components/loader/loader';
// import axiosInstance from '../../config/axios';
// import endpoints from '../../config/endpoints';
// import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Layout from '../../../Layout';
// import { getModuleInfo } from '../../utility-functions';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import { fetchAllSectionsPerGrade } from 'containers/Finance/src/components/Finance/store/actions';
import Loader from 'components/loader/loader';
import { connect, useSelector } from 'react-redux';
import communicationStyles from 'containers/Finance/src/components/Finance/BranchAccountant/Communication/communication.styles';
import '../academic/style.scss';

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
}));

const CurriculumCompletion = (props) => {
  const classes = useStyles();
  const [volume, setVolume] = React.useState('');
  const history = useHistory();
  const [tableData, setTableData] = React.useState([]);
  const [loading, setLoading] = React.useState(false)
  const [moduleId, setModuleId] = React.useState('');
  const [acadeId, setAcadeId] = React.useState('');
  const [gradeApiData, setGradeApiData] = React.useState([]);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const refs = tableData?.reduce((acc, value) => {
    acc[value?.period__subject_mapping__section_mapping__grade] = React.createRef();
    return acc;
  }, {});

  const {
    match: {
      params: { branchId },
    },
  } = props;

  useEffect(() => {
    // console.log(history?.location?.state, 'Mobile99999999')
    setModuleId(history?.location?.state?.module_id)
    setAcadeId(history?.location?.state?.acad_session_id)

  }, [history])

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };

  useEffect(() => {
    // console.log(branchId, moduleId,'BB=?')
    gradeData(branchId)
  }, [branchId, moduleId])

  const { acad_session_id, module_id } = history.location.state;

  const handleCurrSubject = (gradeId, gradeName) => {
    // console.log(gradeId,gradeName,'OPPPP')
    history.push(
      {
        pathname: `/curriculum-completion-subject/${branchId}/${gradeId}`,
        state: {
          grade: gradeId,
          gradeName: gradeName,
          acad_session_id: acad_session_id,
          module_id: moduleId

        }
      }
    )
  }

  const gradeData = (branchId) => {
    console.log(moduleId, 'mb==? ')
    if (moduleId !== '' || null || undefined) {
      axiosInstance.get(`${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${branchId}&module_id=${moduleId}`)
        .then((res) => {
          console.log(res, 'OnePlus====>')
          setGradeApiData(res?.data?.data)
        })
        .catch(() => { });
    }
  }

  useEffect(() => {
    gradeListTable({
      acad_session_id: acad_session_id,
    })

  }, [acad_session_id])


  const gradeListTable = (params = {}) => {
    setLoading(true)
    axiosInstance
      .get(`${endpoints.ownerDashboard.curriculumGradeReport}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': window.location.host,
          // Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InN1cGVyX2FkbWluX09MViIsImV4cCI6NjY0MDk0MzY4NCwiZW1haWwiOiJzdXBlcl9hZG1pbkBvcmNoaWRzLmVkdS5pbiIsImZpcnN0X25hbWUiOiJ0ZXN0IiwiaXNfc3VwZXJ1c2VyIjp0cnVlfQ.-xEeYFMvknL-PR6vsdR3a2QtCzej55lfIzllNgvJtTg'
        },
      })
      .then((res) => {
        console.log(res?.data?.result, 'HARSHA');
        setTableData(res?.data?.result)
        setLoading(false)

        // setStudentData(res.data.result);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false)
      });
  };


  const handleScroll = (each, index) => {
    // communicationStyles.log(each, 'Ru')
    refs[each?.period__subject_mapping__section_mapping__grade].current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }




  return (
    <Layout>
      <div style={{ width: '100%', overflow: 'hidden', padding: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className={clsx(classes.breadcrumb)}>
              <IconButton size='small'
                onClick={() => history.goBack()}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant='h6' className={clsx(classes.textBold)}
              >
                Curriculum Completion
              </Typography>
            </div>
          </Grid>
          <Grid item container xs={9} spacing={3}>
            <Grid item xs={3}>
              {/* <FormControl fullWidth variant='outlined' margin='dense'>
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
              </FormControl> */}
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1'>Overview of All Grades</Typography>
            </Grid>
            <Grid item xs={12}>
              <div className={clsx(classes.gradeOverviewContainer)}>
                {tableData &&
                  tableData.map((each, index) => {
                    return (
                      <>
                        <div ref={refs[each?.period__subject_mapping__section_mapping__grade]} className={classes.eachGradeOverviewContainer} onClick={() => handleCurrSubject(each?.period__subject_mapping__section_mapping__grade, each?.period__subject_mapping__section_mapping__grade__grade_name)}>
                          <Typography variant='body1' className={classes.eachGradeName}>
                            {' '}
                            {each?.period__subject_mapping__section_mapping__grade__grade_name}
                          </Typography>
                          <Typography variant='body1'> {each?.percentage_completed} %</Typography>
                        </div>
                      </>
                    );
                  })}
              </div>
            </Grid>
          </Grid>
          <div className='button-grade-scroll'>
            <Typography style={{ fontWeight: '600', padding: '2%' }}>View Gradewide {'>'}</Typography>
            <div className='button-container'>
              {tableData &&
                tableData.map((each, index) => {
                  return (
                    <>
                      <div className='button-area-div' >
                        <Button variant='contained' onClick={() => handleScroll(each, index)} style={{ minWidth: '100px' }} className='grade-button-hover' >
                          {each?.period__subject_mapping__section_mapping__grade__grade_name}
                        </Button>
                      </div>
                    </>
                  );
                })}
            </div>
          </div>

        </Grid>

        {loading && <Loader />}
      </div>
    </Layout>
  );
};

export default withRouter(CurriculumCompletion);
