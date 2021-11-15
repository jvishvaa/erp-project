import React, { useContext, useRef, useState, useEffect } from 'react';
import {
  Button,
  Grid,
  makeStyles,
  Paper,
  withStyles,
  useTheme,
  Box,
  SvgIcon,
  Input,
  Typography,
} from '@material-ui/core';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import FeedbackFormDialog from '../components/feedbackForm/feedback_form';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { Autocomplete, Pagination } from '@material-ui/lab';
import { connect, useSelector } from 'react-redux';
import { Divider, TextField } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import endpoints from 'config/endpoints';
import FileSaver from 'file-saver';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../../../config/axios';

import TableContainer from '@material-ui/core/TableContainer';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
//import exportFromJSON from 'export-from-json';
import { CSVLink } from 'react-csv';
import TablePagination from '@material-ui/core/TablePagination';
import unfiltered from '../../../assets/images/unfiltered.svg';

import MediaCard from '../components/volumecards';
import './induction-training.scss';

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

const InductionFilter = (props) => {
  const history = useHistory();
  const classes = useStyles({});
  const { setAlert } = useContext(AlertNotificationContext);
  const [moduleId, setModuleId] = useState('');
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [subjectList, setSubjectList] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [userDetails, setUserDetails] = useState([]);
  const [volumeList, setVolumeList] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails?.personal_info?.token;
  const moduleData = udaanDetails?.role_permission?.modules;

  useEffect(() => {
    if (moduleData && moduleData.length) {
      moduleData.forEach((item) => {
        console.log(item.module, 'module Ids');
        if (item.module_name === 'Induction_Training') {
          setModuleId(item.module);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (udaanToken && moduleId) {
      getUserDetails();
    }
  }, [moduleId]);

  useEffect(() => {
    if (selectedGrade !== null && selectedCategory !== null) {
      getSubjectDetails(selectedGrade.id, selectedCategory.id);
    }
  }, [selectedCategory, selectedGrade]);

  const getUserDetails = () => {
    let tempCtaegory = [];
    axios
      .get(endpoints.sureLearning.branch, {
        headers: {
          Authorization: `Bearer ${udaanToken}`,
          module: moduleId,
        },
      })
      .then((response) => {
        setBranchList(response.data.branch);
        // tempCtaegory.push(response.data.role_category);
        tempCtaegory.push(response.data.roles_category);
        setGradeList(response.data.course_type);
        setCategoryList(tempCtaegory);
        setUserDetails(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSubjectDetails = (roleId, gradeId) => {
    const tempSubject = [];
    axios
      .get(
        `${endpoints.sureLearning.subjectMap}?category_id=${gradeId}&category_type_id=${roleId}`,
        {
          headers: {
            Authorization: `Bearer ${udaanToken}`,
            module: moduleId,
          },
        }
      )
      .then((response) => {
        response.data.map((eachSubject) => {
          tempSubject.push(eachSubject.subject_fk);
        });
        setSubjectList(tempSubject);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleBranch = (e, value) => {
    setSelectedBranch(value);
  };

  const handleCategory = (e, value) => {
    setSelectedCategory(value);
  };

  const handleSelectGrade = (e, value) => {
    setSelectedGrade(value);
  };

  const handleSelectSubject = (e, value) => {
    setSelectedSubject(value);
  };

  const handleClearAllList = () => {
    setSelectedBranch(null);
    setSelectedCategory(null);
    setSelectedGrade(null);
    setSelectedSubject(null);
    setVolumeList(null);
  };

  const handleFilter = () => {
    axios
      .get(
        `${endpoints.sureLearning.filterSubject}?subject=${selectedSubject?.id}&induction_training=true`,
        {
          headers: {
            Authorization: `Bearer ${udaanToken}`,
            module: moduleId,
          },
        }
      )
      .then((response) => {
        console.log(response.data, 'EnrolledSelfCources');
        setVolumeList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const startTrain = (volume) => {
    console.log(volume.id, 'volume');
    if (volumeList && volumeList.length) {
      volumeList.forEach((con, index) => {
        if (con.id === volume.id && index > 0) {
          console.log(index - 1, 'index');
          let int = index - 1;
          console.log(volumeList[int], 'prev typ');
          console.log(int, 'prev');
          if (volumeList[index - 1].is_completed) {
            sessionStorage.setItem('selected_volume', volume.id);
            // history.push('/allchapters');
            history.push({
              pathname: '/allchaptersInduction',
              state: volume,
              module: 'inductionTraining',
            });
            
          } else {
            setAlert('warning', 'please complete previous chapter');
          }
        }
        if (con.id === volume.id && index < 1) {
          sessionStorage.setItem('selected_volume', volume.id);
          // history.push('/allchapters');
          history.push({
            pathname: '/allchaptersInduction',
            state: volume,
            module: 'inductionTraining',
          });
          
        }
      });
    }
  };

  return (
    <Layout className='accessBlockerContainer'>
      <div className={classes.parentDiv}>
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName='Induction Training'
          isAcademicYearVisible={true}
        />

        <div className='listcontainer'>
          <div className='filterStudent'>
            <Grid item md={3} xs={12} style={{ margin: '0 20px' }}>
              <Autocomplete
                // multiple
                style={{ width: '100%' }}
                size='small'
                onChange={handleBranch}
                id='branch_id'
                className='dropdownIcon'
                value={selectedBranch || ''}
                options={branchList || ''}
                getOptionLabel={(option) => option?.branch_name || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Branch'
                    placeholder='Branch'
                  />
                )}
              />
            </Grid>

            <Grid item md={3} xs={12} style={{ margin: '0 20px' }}>
              <Autocomplete
                // multiple
                style={{ width: '100%' }}
                size='small'
                onChange={handleCategory}
                id='branch_id'
                className='dropdownIcon'
                value={selectedCategory || ''}
                options={categoryList || ''}
                getOptionLabel={(option) => option?.name || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Category'
                    placeholder='Category'
                  />
                )}
              />
            </Grid>

            <Grid item md={3} xs={12} style={{ margin: '0 20px' }}>
              <Autocomplete
                // multiple
                style={{ width: '100%' }}
                size='small'
                onChange={handleSelectGrade}
                id='branch_id'
                className='dropdownIcon'
                value={selectedGrade || ''}
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
                onChange={handleSelectSubject}
                id='branch_id'
                className='dropdownIcon'
                value={selectedSubject || ''}
                options={subjectList || ''}
                getOptionLabel={(option) => option?.sub_type_name || ''}
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
          </div>
          <div className='listcontainer'>
            <div className='filterStudent'>
              <Grid md={2} sm={2} xs={6}>
                <StyledClearButton onClick={handleClearAllList}>
                  Clear All
                </StyledClearButton>
                <StyledButton className={classes.filters} onClick={handleFilter}>
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
            {volumeList !== null ? (
              <Grid item md={12} xs={12} style={{ margin: '20px 20px' }}>
                <MediaCard startTrain={startTrain} allVolumes={volumeList} />
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

export default InductionFilter;
