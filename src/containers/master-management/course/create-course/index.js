import React, { useContext, useEffect, useState, useMemo } from 'react';
import {useHistory} from 'react-router-dom';
import Loading from '../../../../components/loader/loader';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import Layout from '../../../Layout';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Grid, TextField, Button, useTheme, SvgIcon } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Autocomplete from '@material-ui/lab/Autocomplete';
import endpoints from '../../../../config/endpoints';
import axiosInstance from '../../../../config/axios';
import axios from 'axios';
import moment from 'moment';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import CourseCard from '../course-card';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import './style.css'
import deleteIcon from '../../../../assets/images/delete.svg';
import attachmenticon from '../../../../assets/images/attachmenticon.svg';
import { LeakAddRounded } from '@material-ui/icons';
import {Context} from '../view-course/context/ViewStore'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: '0 auto',
    boxShadow: 'none',
  },
  container: {
    maxHeight: '70vh',
    width: '100%',
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
  buttonContainer: {
    width: '95%',
    margin: '0 auto',
    background: theme.palette.background.secondary,
    paddingBottom: theme.spacing(2),
  },
}));

const CreateCourse = () => {
  const classes = useStyles();
  const history=useHistory()
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';

  const [branchDropdown, setBranchDropdown] = useState([]);
  const [gradeDropdown, setGradeDropdown] = useState([]);
  const [gradeIds, setGradeIds] = useState([]);
  const [classDuration, setClassDuration] = useState('');
  const [noOfPeriods, setNoPeriods] = useState(0);
  const [title, setTitle] = useState('');
  const [coursePre, setCoursePre] = useState('');
  const [learn, setLearn] = useState('');
  const [overview, setOverview] = useState('');
  const [filePath, setFilePath] = useState([]);
  const [nextToggle, setNextToggle] = useState(false);

  const [card, setCard] = useState(0);


  //context
  const [state,setState]= useContext(Context)

  const firstPageData=state.editData
  const sencondPageData=state.viewPeriodData
  const flag=state.isEdit

  // const [cardData,setCardData]=useState([
  //   {title:'',desc:'',files:''}
  // ])
  // const cardData= {title:'',desc:'',files:''}

  // const [cardState,setCardState]=useState([{...cardData},])

  const [data, setData] = useState([]);

  const [cardTitle, setCardTitle] = useState(null);
  const [cardDesc, setCardDesc] = useState(null);

  const [filterData, setFilterData] = useState({
    branch: '',
    grade: [],
    courseLevel: '',
  });

  const courseLevel = [
    { value: 'Beginner', level: 'Low' },
    { value: 'Intermediate', level: 'Mid' },
    { value: 'Advance', level: 'High' },
  ];

  const handleCourseLevel = (event, value) => {
    setFilterData({ ...filterData, courseLevel: '' });
    if (value) {
      setFilterData({ ...filterData, courseLevel: value });
    }
  };

  // const handlePeriod = (e) => {
  //   setNoPeriods(e.target.value);
  // };

  const handleNext = () => {
    const list = [...data];
    for (let i = 0; i < noOfPeriods; i++) {
      list.push({ title: '', description: '', files: [] });
    }
    setData(list);
    setNextToggle(!nextToggle);
  };

  // useEffect(()=>{
  //   if(noOfPeriods>0){
  //     const list=[...data];
  //     for (let i = 0; i < noOfPeriods; i++) {
  //     list.push({title:'',desc:''});
  //   };
  //   setData(list)
  //   }

  // },[noOfPeriods])
  // console.log(data,'======')
  //function to craete multiple card
  // var objects = []

  // console.log(
  //   filterData.courseLevel,
  //   filterData.branch.id,
  //   gradeIds,
  //   classDuration,
  //   noOfPeriods,
  //   title,
  //   coursePre,
  //   learn,
  //   overview,
  //   '======='
  // );
  const handleBranch = (event, value) => {
    setFilterData({ ...filterData, branch: '' });
    if (value) {
      setFilterData({
        ...filterData,
        branch: value,
      });
      axiosInstance
        .get(`${endpoints.communication.grades}?branch_id=${value.id}&module_id=8`)
        .then((result) => {
          if (result.data.status_code === 200) {
            setGradeDropdown(result.data.data);
          } else {
            setAlert('error', result.data.message);
            setGradeDropdown([]);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
          setGradeDropdown([]);
        });
    } else {
      setGradeDropdown([]);
    }
  };

  const handleGrade = (event, value) => {
    setFilterData({ ...filterData, grade: [] });
    if (value?.length > 0) {
      const ids = value.map((obj) => obj.grade_id);
      setGradeIds(ids);
      setFilterData({
        ...filterData,
        grade: value,
      });
    }
  };

  const removeFileHandler = (i) => {
    // const list = [...filePath];
    filePath.splice(i, 1);
    setAlert('success', 'File successfully deleted');
  };
  const handleImageChange = (event) => {
    if (filePath.length < 10) {
      const data = event.target.files[0];
      const fd = new FormData();
      fd.append('file', event.target.files[0]);

      axiosInstance.post(`${endpoints.onlineCourses.fileUpload}`, fd).then((result) => {
        if (result.data.status_code === 200) {
          setFilePath([...filePath, result.data.result.get_file_path]);
          setAlert('success', result.data.message);
        } else {
          setAlert('error', result.data.message);
        }
      });
    } else {
      setAlert('warning', 'Exceed Maximum Number Attachment');
    }
  };

  const handleSubmit = () => {
    // console.log('helloooooooooooooo');
    axiosInstance.post(`${endpoints.onlineCourses.createCourse}`, {
      course_name: title,
      // "course_description":desc,
      pre_requirement: coursePre,
      overview: overview,
      learn: learn,
      grade: gradeIds,
      level: filterData.courseLevel.level,
      // "duration":"0:30:0",
      no_of_periods: parseInt(noOfPeriods),
      files: filePath,
      period_data: data,
    })
    .then(result=>{

      if (result.data.status_code === 200) {
       
        setAlert('success', result.data.message);
        setFilterData({
          branch: '',
    grade: [],
    courseLevel: '',
        })
        setFilePath([])
        setNoPeriods(0)
        setNextToggle(!nextToggle)
   
      } else {
        setAlert('error', result.data.message);
        setGradeDropdown([]);
      }
    })
    
  .catch((error) => {
    setAlert('error', error.message);
    setGradeDropdown([]);
  });
  };

  const FileRow = (props) => {
    const { file, onClose, index } = props;
    return (
      <div className='file_row_image'>
        <div className='file_name_container'>File {index + 1}</div>
        <Divider orientation='vertical' className='divider_color' flexItem />
        <div className='file_close'>
          <span onClick={onClose}>
            <SvgIcon
              component={() => (
                <img
                  style={{
                    width: '20px',
                    height: '20px',
                    // padding: '5px',
                    cursor: 'pointer',
                  }}
                  src={deleteIcon}
                  alt='given'
                />
              )}
            />
          </span>
        </div>
      </div>
    );
  };

  useEffect(() => {
    axiosInstance
      .get(`${endpoints.communication.branches}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setBranchDropdown(result.data.data);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setBranchDropdown('error', error.message);
      });
  }, []);
  console.log(firstPageData,sencondPageData,flag, '=============');
  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div>
          <div style={{ width: '95%', margin: '20px auto' }}>
            <CommonBreadcrumbs
              componentName='Master Management'
              // childComponentName='Course List'
              childComponentNameNext='Create Courses'
            />
          </div>
        </div>
        {!nextToggle ? (
          <Grid
            container
            spacing={isMobile ? 3 : 5}
            style={{ width: widerWidth, margin: wider }}
          >
            <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={handleCourseLevel}
                // onChange={e=> handleCourseLevel(courseLevel)}
                id='academic-year'
                className='dropdownIcon'
                value={filterData?.courseLevel}
                options={courseLevel}
                getOptionLabel={(option) => option?.value}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Course Level'
                    placeholder='Course Level'
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={handleBranch}
                id='grade'
                className='dropdownIcon'
                value={filterData?.branch}
                options={branchDropdown}
                getOptionLabel={(option) => option?.branch_name}
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
            <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
              <Autocomplete
                multiple
                style={{ width: '100%' }}
                size='small'
                onChange={handleGrade}
                id='volume'
                className='dropdownIcon'
                value={filterData?.grade}
                options={gradeDropdown}
                getOptionLabel={(option) => option?.grade__grade_name}
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
            {/* <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
              <TextField
                id='subname'
                type='number'
                className='dropdownIcon'
                style={{ width: '100%' }}
                label='Class Duration In mins'
                placeholder='Class Duration In mins'
                variant='outlined'
                size='small'
                // value={noOfChapter}
                inputProps={{ pattern: '[0-9]*', min: 0, maxLength: 20 }}
                name='subname'
                onChange={(e) => setClassDuration(e.target.value)}
                required
              />
            </Grid> */}
            <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
              <TextField
                id='subname'
                type='number'
                className='dropdownIcon'
                style={{ width: '100%' }}
                label='No. Of Periods'
                placeholder='No. Of Periods'
                variant='outlined'
                size='small'
                value={firstPageData?.no_of_periods || noOfPeriods}
                inputProps={{ pattern: '[0-9]*', min: 0, maxLength: 20 }}
                name='subname'
                onChange={(e) => setNoPeriods(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id='outlined-multiline-static'
                label='Course Title'
                placeholder='Course Title'
                multiline
                rows='1'
                color='secondary'
                style={{ width: '100%' }}
                // defaultValue="Default Value"
                value={firstPageData?.course_name || title}
                variant='outlined'
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id='outlined-multiline-static'
                label='Course Prerequisites'
                placeholder='Course Prerequisites'
                multiline
                rows='6'
                color='secondary'
                style={{ width: '100%' }}
                // defaultValue="Default Value"
                value={firstPageData?.pre_requirement || coursePre}
                variant='outlined'
                onChange={(e) => setCoursePre(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id='outlined-multiline-static'
                label='What Will You Learn From This Course'
                placeholder='What Will You Learn From This Course'
                multiline
                rows='6'
                color='secondary'
                style={{ width: '100%' }}
                // defaultValue="Default Value"
                value={firstPageData?.learn || learn}
                variant='outlined'
                onChange={(e) => setLearn(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id='outlined-multiline-static'
                label='Course Overview'
                placeholder='Course Overview'
                multiline
                rows='6'
                color='secondary'
                style={{ width: '100%' }}
                // defaultValue="Default Value"
                value={firstPageData?.overview || overview}
                variant='outlined'
                onChange={(e) => setOverview(e.target.value)}
              />
            </Grid>
           
           {!flag ?
            <div className='attachmentContainer'>
              <div style={{ display: 'flex' }} className='scrollable'>
                {filePath?.length > 0
                  ? filePath?.map((file, i) => (
                      <FileRow
                        key={`homework_student_question_attachment_${i}`}
                        file={file}
                        index={i}
                        onClose={() => removeFileHandler(i)}
                      />
                    ))
                  : null}
              </div>

              <div className='attachmentButtonContainer'>
                <Button
                  startIcon={
                    <SvgIcon
                      component={() => (
                        <img
                          style={{ height: '20px', width: '20px' }}
                          src={attachmenticon}
                        />
                      )}
                    />
                  }
                  className='attchment_button'
                  title='Attach Supporting File'
                  variant='contained'
                  size='medium'
                  disableRipple
                  disableElevation
                  disableFocusRipple
                  disableTouchRipple
                  component='label'
                  style={{ textTransform: 'none' }}
                >
                  <input
                    type='file'
                    style={{ display: 'none' }}
                    id='raised-button-file'
                    accept='image/*'
                    onChange={handleImageChange}
                  />
                  Add Document
                </Button>
              </div>
            </div>
           : null} 

            <Grid item xs={12} sm={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} sm={6} className={isMobile ? '' : 'filterPadding'}>
              <Button style={{ width: '15rem' }} onClick={handleNext}>
                NEXT
              </Button>
            </Grid>
          </Grid>
        ) : (
          <>
            <Paper className={classes.root}>
              <Grid
                container
                style={
                  isMobile
                    ? { width: '95%', margin: '20px auto' }
                    : { width: '100%', margin: '20px auto' }
                }
                spacing={5}
              >
                <Grid item xs={12} sm={12}>
                  <Grid container spacing={isMobile ? 3 : 5}>
                    {data?.map((period, i) => (
                      <Grid
                        item
                        xs={12}
                        style={isMobile ? { marginLeft: '-8px' } : null}
                        sm={4}
                      >
                        <CourseCard
                          index={i}
                          cData={data}
                          setData={setData}
                        />
                      </Grid>
                    ))} 
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
            <div className='submit'>
              <Grid item xs={12} sm={12}>
                <Button onClick={handleSubmit}>SUBMIT</Button>
              </Grid>
            </div>
          </>
        )}
      </Layout>
    </>
  );
};

export default CreateCourse;
