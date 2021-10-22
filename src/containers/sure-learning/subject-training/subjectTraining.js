import React, { useContext, useRef, useState, useEffect } from 'react';
import {
  Button,
  Grid,
  makeStyles,
  Paper,
  withStyles,
  useTheme,
  Box,
  Input,
  Typography,
} from '@material-ui/core';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { Autocomplete, Pagination } from '@material-ui/lab';
import { connect, useSelector } from 'react-redux';
import { Divider, TextField, SvgIcon } from '@material-ui/core';
import endpoints from 'config/endpoints';
import FeedbackFormDialog from '../components/feedbackForm/feedback_form';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import MediaCard from '../components/volumecards';
import './subject-traning.scss';
import { setSeconds } from 'date-fns';
import unfiltered from '../../../assets/images/unfiltered.svg';

const useStyles = makeStyles((theme) => ({
  FeedbackFormDialog: {
    marginLeft: '6px',
  },
  filters: {
    marginLeft: '15px',
  },
  root: theme.commonTableRoot,
  paperStyled: {
    minHeight: '80vh',
    height: '100%',
    padding: '50px',
    marginTop: '15px',
  },
  guidelinesText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: theme.palette.secondary.main,
  },
  errorText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fe6b6b',
    marginBottom: '30px',
    display: 'inline-block',
  },
  table: {
    minWidth: 650,
  },
  downloadExcel: {
    float: 'right',
    fontSize: '16px',
    // textDecoration: 'none',
    // backgroundColor: '#fe6b6b',
    // color: '#ffffff',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  tableCell: {
    color: theme.palette.secondary.main,
  },
  tablePaginationSpacer: {
    flex: 0,
  },
  tablePaginationToolbar: {
    justifyContent: 'center',
  },
  cardsContainer: {
    width: '95%',
    margin: '0 auto',
  },
  tablePaginationCaption: {
    fontWeight: '600 !important',
  },
  tablePaginationSpacer: {
    flex: 0,
  },
  tablePaginationToolbar: {
    justifyContent: 'center',
  },
  guidelineval: {
    color: theme.palette.primary.main,
    fontWeight: '600',
  },
  guideline: {
    color: theme.palette.secondary.main,
    fontSize: '16px',
    padding: '10px',
  },
}));

const guidelines = [
  {
    name: '',
    field: "Please don't remove or manipulate any header in the file format",
  },
  { name: 'Erp Code', field: ' is a mandatory field, Example: 2003970002_OLV' },
  { name: 'Is_lesson_plan', field: ' is a mandatory field' },
  { name: 'Is_online_class', field: ' is a mandatory field' },
  { name: 'Is_ebook', field: ' is a mandatory field' },
  { name: 'Is_ibook', field: ' is a mandatory field' },
  { field: ' If access is need please mention as “0”' },
  { field: ' If access has to remove mention as “1”' },
];

const StyledButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: '#FFFFFF',
    padding: '8px 15px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}))(Button);

const StyledButtonUnblock = withStyles({
  root: {
    backgroundColor: '#228B22',
    color: '#FFFFFF',
    padding: '2px 8px',
    fontSize: '10px',
    '&:hover': {
      backgroundColor: '#228B22 !important',
    },
  },
})(Button);

const StyledButtonBlock = withStyles({
  root: {
    backgroundColor: '#FF2E2E',
    color: '#FFFFFF',
    padding: '2px 8px',
    fontSize: '10px',
    '&:hover': {
      backgroundColor: '#FF2E2E !important',
    },
  },
})(Button);

const StyledClearButton = withStyles((theme) => ({
  root: {
    backgroundColor: '#E2E2E2',
    color: '#8C8C8C',
    padding: '8px 15px',
    marginLeft: '20px',
    '&:hover': {
      backgroundColor: '#E2E2E2 !important',
    },
  },
}))(Button);

const SubjectTraining = () => {
  const history = useHistory();
  const classes = useStyles({});
  const fileRef = useRef();
  const { setAlert } = useContext(AlertNotificationContext);
  const [file, setFile] = useState(null);
  const [uploadFlag, setUploadFlag] = useState(false);
  const [data, setData] = useState([]);
  const [failed, setFailed] = useState(false);
  const [excelData] = useState([]);
  const [academicYear, setAcademicYear] = useState();
  const [moduleId, setModuleId] = useState('');
  // const [selectedAcademicYear, setSelectedAcadmeicYear] = useState('');
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [subjectList, setSubjectList] = useState([]);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [volumeList, setVolumeList] = useState([]);
  const [selectedVolume, setSelectedVolume] = useState([]);
  const [allVolumes, setAllVolumes] = useState(null);

  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails?.personal_info?.token;
  const moduleData = udaanDetails?.role_permission?.modules;

  useEffect(() => {
    if (moduleData && moduleData.length) {
      moduleData.forEach((item) => {
        console.log(item.module, 'module Ids');
        if (item.module_name === 'Subject_Training') {
          setModuleId(item.module);
        }
      });
    }
  }, []);

  useEffect(() => {
    console.log(udaanToken, moduleId, 'token');
    if (udaanToken && moduleId) {
      axios
        .get(endpoints.sureLearning.branch, {
          headers: {
            Authorization: `Bearer ${udaanToken}`,
            module: moduleId,
          },
        })
        .then((res) => {
          console.log(res, 'academic');
          setGradeList(res.data.course_type);
          // setSubjectList(res.data.course_sub_type)
        })
        .catch((error) => {
          setAlert('error', 'Something Wrong!');
        });
    }
  }, [moduleId]);

  const handleGrade = (e, value) => {
    setSelectedVolume('');
    setSelectedSubject('');
    console.log(value, 'grade');
    setSelectedGrade(value);
    if (value) {
      axios
        .get(`${endpoints.sureLearning.subjectMap}?grade_id=${value?.id}`, {
          headers: {
            Authorization: `Bearer ${udaanToken}`,
            module: moduleId,
          },
        })
        .then((res) => {
          console.log(res, 'subject');
          setSubjectList(res.data);
        })
        .catch((error) => {
          setAlert('error', 'Something Wrong!');
        });
    }
  };

  const handleSubject = (e, value) => {
    setSelectedSubject(value);
    console.log(value, 'selectedsub');
    if (value) {
      axios
        .get(
          `${endpoints.sureLearning.volume}?grade_id=${selectedGrade?.id}&subject_id=${value?.subject_fk?.id}`,
          {
            headers: {
              Authorization: `Bearer ${udaanToken}`,
              module: moduleId,
            },
          }
        )
        .then((res) => {
          console.log(res, 'volume');
          setVolumeList(res?.data?.data);
        })
        .catch((error) => {
          setAlert('error', 'Something Wrong!');
        });
    }
  };

  const handleClearAll = () => {
    fileRef.current.value = null;
    // setSelectedAcadmeicYear();
  };

  const handleClearAllList = () => {
    // setSelectedAcadmeicYear();
    setSelectedGrade();
    setSelectedVolume([]);
    setSelectedSubject([]);
    setAllVolumes([]);
  };

  const startTrain = (id) => {
    history.push({
      pathname: '/allsubjectchapters',
      state: id,
      module: 'subjectTraining',
    });
    console.log(id, 'hit');
  };

  const handleVolume = (e, value) => {
    setSelectedVolume(value);
    console.log(value, 'volume');
  };

  const handleSubjectTrain = () => {
    console.log(selectedGrade, 'grade');
    console.log(selectedVolume, 'volume');
    console.log(selectedSubject, 'subject');
    if (selectedGrade || selectedVolume || selectedSubject) {
      axios
        .get(
          `${endpoints.sureLearning.filterSubject}?subject=${selectedSubject?.subject_fk?.id}&grade=${selectedGrade?.id}&subject_training=true&volume_id=${selectedVolume?.id}`,
          {
            headers: {
              Authorization: `Bearer ${udaanToken}`,
              module: moduleId,
            },
          }
        )
        .then((res) => {
          console.log(res, 'volume');
          setAllVolumes(res?.data);
          console.log(res?.data, 'allvolume');
          // setVolumeList(res?.data?.data);
        })
        .catch((error) => {
          setAlert('error', 'Something Wrong!');
        });
    }
  };
  
  return (
    <Layout className='accessBlockerContainer'>
      <div className={classes.parentDiv}>
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName='Subject Training'
          isAcademicYearVisible={true}
        />

        <div className='listcontainer'>
          <div className='filterStudent'>
            <Grid item md={3} xs={12} style={{ margin: '0 20px' }}>
              <Autocomplete
                // multiple
                style={{ width: '100%' }}
                size='small'
                onChange={handleGrade}
                id='branch_id'
                className='dropdownIcon'
                value={selectedGrade || ''}
                // onChange={(e) => handleGrade(e)}
                options={gradeList || ''}
                getOptionLabel={(option) => option?.type_name || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Grade'
                    placeholder='Grade'
                  />
                )}
              />
            </Grid>

            <Grid item md={3} xs={12} style={{ margin: '0 20px' }}>
              <Autocomplete
                // multiple
                style={{ width: '100%' }}
                size='small'
                onChange={handleSubject}
                id='branch_id'
                className='dropdownIcon'
                value={selectedSubject || ''}
                options={subjectList || ''}
                getOptionLabel={(option) => option?.subject_fk?.sub_type_name || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Subject'
                    placeholder='Subject'
                  />
                )}
              />
            </Grid>

            <Grid item md={3} xs={12} style={{ margin: '0 20px' }}>
              <Autocomplete
                // multiple
                style={{ width: '100%' }}
                size='small'
                onChange={handleVolume}
                id='branch_id'
                className='dropdownIcon'
                value={selectedVolume || ''}
                options={volumeList || ''}
                getOptionLabel={(option) => option?.volume_name || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Volume'
                    placeholder='Volume'
                  />
                )}
              />
            </Grid>
          </div>
          {/* <div className='filterArea'>
            <Grid sm={2} xs={6}>
              <StyledClearButton onClick={handleClearAllList}>
                Clear All
              </StyledClearButton>
            </Grid>

            <Grid sm={2} xs={6}>
              <StyledButton onClick={handleSubjectTrain}>Filter</StyledButton>
            </Grid>
            <Grid sm={2} xs={6}>
              <FeedbackFormDialog type='Subject Training' />
            </Grid>
          </div> */}
          <div className='listcontainer'>
            <div className='filterStudent'>
              <Grid md={2} sm={2} xs={6}>
                <StyledClearButton onClick={handleClearAllList}>
                  Clear All
                </StyledClearButton>
                <StyledButton
                  className={classes.filters}
                  onClick={handleSubjectTrain}
                >
                  Filter
                </StyledButton>
              </Grid>
              {/* <Grid md={2} sm={2} xs={6}>
              <StyledButton onClick={handleFilter}>Filter</StyledButton>
            </Grid>*/}
              <Grid md={2} sm={2} xs={6} className={classes.FeedbackFormDialog}>
                <FeedbackFormDialog type='Induction training' />
              </Grid>
              <Grid md={6} sm={2} xs={6} />
            </div>
          </div>
          <Paper className={`${classes.root} common-table`} id='singleStudent'>
            {allVolumes !== null ? (
              <Grid id='cardAreaSubject' style={{ margin: '20px 20px' }}>
                <MediaCard
                  allVolumes={allVolumes}
                  startTrain={startTrain}
                  
                />
              </Grid>
            ) : (
              <div className={classes.periodDataUnavailable}>
                <SvgIcon
                  component={() => (
                    <img style={{ paddingLeft: '380px' }} src={unfiltered} />
                  )}
                />
                <p style={{ paddingLeft: '440px' }}>NO DATA FOUND </p>
              </div>
            )}
          </Paper>
        </div>
      </div>
    </Layout>
  );
};

export default SubjectTraining;
