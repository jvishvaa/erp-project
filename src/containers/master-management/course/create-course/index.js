import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
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
import './style.css';
import deleteIcon from '../../../../assets/images/delete.svg';
import attachmenticon from '../../../../assets/images/attachmenticon.svg';
import { LeakAddRounded } from '@material-ui/icons';
import { Context } from '../view-course/context/ViewStore';
import { filter } from 'lodash';
import DaysFilterContainer from './days-filter-container';
import DurationContainer from './duration-container';
import JoinLimitContainer from './join-limit-container';

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
  const history = useHistory();
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [clear,setClear] = useState(false);
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';

  //context
  const [state, setState] = useContext(Context);

  const [branchDropdown, setBranchDropdown] = useState([]);
  const [gradeDropdown, setGradeDropdown] = useState([]);
  const [gradeIds, setGradeIds] = useState([]);
  const [categoryDropdown, setCategoryDropdown] = useState([])
  const [subjectDropdown, setSubjectDropdown] = useState([])
  const [age, setAge] = useState([])

  const [classDuration, setClassDuration] = useState('');
  const [noOfPeriods, setNoPeriods] = useState(state.editData.no_of_periods || 0);
  const [title, setTitle] = useState('');
  const [coursePre, setCoursePre] = useState('');
  const [learn, setLearn] = useState('');
  const [overview, setOverview] = useState('');
  const [filePath, setFilePath] = useState([]);
  const [nextToggle, setNextToggle] = useState(false);

  // const [erpGradeId,setErpGradeId]=useState([])

  const [card, setCard] = useState(0);

  const firstPageData = state.editData;
  const [secondPageData, setSecondPageData] = useState(state?.viewPeriodData || []);
  const flag = state.isEdit;


  const [data, setData] = useState([]);

  const [cardTitle, setCardTitle] = useState(null);
  const [cardDesc, setCardDesc] = useState(null);

  const branchDrop = [{ branch_name: 'AOL' }]
  const [filterData, setFilterData] = useState({
    branch: '',
    grade: [],
    courseLevel: '',
    category: '',
    age: '',
    subject: '',
    erpGrade: ''
  });

  const courseLevel = [
    { value: 'Beginner', level: 'Low' },
    { value: 'Intermediate', level: 'Mid' },
    { value: 'Advance', level: 'High' },
  ];


  //hardcoded data

  // const category = [
  //   { value: 'Pre-Primary', },
  //   { value: 'Primary', },
  //   { value: 'Secondary', },
  // ];

  // const age = [
  //   { value: '2-3', },
  //   { value: '3-4', },
  //   { value: '4-5', },
  //   { value: '5-6' },
  //   { value: '6-7' },
  //   { value: '7-8' },
  //   { value: '8-9' },
  //   { value: '9-10' },
  //   { value: '10-11' },
  //   { value: '11-12' },
  //   { value: '12-13' },
  //   { value: '13-14' },
  //   { value: '14-15' },

  // ];

  // const subject = [
  //   { value: 'Music' },
  //   { value: 'Dance' },
  //   { value: 'Art' },
  //   { value: 'Fit-Kids-Physical Education' },
  //   { value: 'Instrument' },
  //   { value: 'Numeracy' },
  //   { value: 'Literacy' },
  //   { value: 'English' },
  //   { value: 'French' },
  //   { value: 'Robotics' },
  //   { value: 'Hindi' },
  //   { value: 'Coding' },
  //   { value: 'Science' },

  // ]

  const handleCourseLevel = (event, value) => {
    setFilterData({ ...filterData, courseLevel: '' });
    if (value) {
      setFilterData({ ...filterData, courseLevel: value });
    }
  };


  const handleNext = () => {
    // <<<<<<<>>>>>>>>>>>>
    if (flag) {
      setData(secondPageData || []);
      setNextToggle(!nextToggle);
    } else {

      const list = [...data];
      for (let i = 0; i < noOfPeriods; i++) {
        list.push({ title: '', description: '', files: [] });
      }
      setData(list);
      setNextToggle(!nextToggle);
    }
  };

  const handleBranch = (event, value) => {
    setFilterData({ ...filterData, branch: '' });
    if (value) {
      setFilterData({
        ...filterData,
        branch: value,
      });
      axiosInstance
        .get(`${endpoints.communication.grades}?branch_id=${5}&module_id=8`)
        .then((result) => {
          if (result.data.status_code === 200) {
            // setGradeDropdown(result.data.data);
          } else {
            setAlert('error', result.data.message);
            // setGradeDropdown([]);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
          // setGradeDropdown([]);
        });
    } else {
      // setGradeDropdown([]);
    }
  };

  const handleCategory = (event, value) => {
    setFilterData({ ...filterData, category: '' })
    if (value) {
      setFilterData({ ...filterData, category: value })
      axiosInstance.get(`${endpoints.onlineCourses.categoryList}?tag_type=2&parent_id=${value.id}`)
        .then(result => {
          if (result.data.status_code === 201) {
            // console.log(result.data.result, '===========')
            const list1 = [...subjectDropdown];
            const list2 = [...gradeDropdown];
            result.data.result.map(object => {
              if (object?.tag_type === "1") {
                list1.push({ id: object.id, subjectName: object?.subject__subject_name });
              } else {
                list2.push({ id: object.id, gradeName: object?.grade__grade_name, gradeId: object?.grade_id });
              }
            })
            setSubjectDropdown(list1);
            setGradeDropdown(list2);
          }
        })
    }
  }

  const handleSubject = (event, value) => {
    setFilterData({ ...filterData, subject: value })
    if (value) {
      setFilterData({ ...filterData, subject: value })

    }
  }

  const handleAge = (event, value) => {
    setFilterData({ ...filterData, age: '' })
    if (value) {
      setFilterData({ ...filterData, age: value })
    }
  }







  const handleGrade = (event, value) => {
    console.log(value, '====')
    setFilterData({ ...filterData, grade: [], erpGrade: '' });
    // if (value?.length > 0) {
    if (value) {
      // const ids = value.map((obj) => obj.id);
      // setGradeIds(ids);
      setFilterData({
        ...filterData,
        grade: value,
        erpGrade: value.gradeId
      });
      axiosInstance.get(`${endpoints.onlineCourses.categoryList}?tag_type=3&parent_id=${value.id}`)
        .then(result => {
          if (result.data.status_code === 201) {
            setAge(result.data.result)
          }
          else {
            setAlert('error', result.data.message)
          }
        }).catch(error => {
          setAlert('error', error.description)
        })
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
    axiosInstance
      .post(`${endpoints.onlineCourses.createCourse}`, {
        course_name: title,
        pre_requirement: coursePre,
        overview: overview,
        learn: learn,
        // grade: gradeIds,
        grade: [filterData.erpGrade],
        level: filterData.courseLevel.level,
        no_of_periods: parseInt(noOfPeriods),
        files: filePath,
        period_data: data,
        tag_id: `${filterData.age.id},${filterData.subject.id}`
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          setFilePath([]);
          setData([]);
          setNoPeriods(0);
          setTitle('')
          setCoursePre('')
          setOverview('')
          setLearn('')
          setFilterData({
            branch: '',
            grade: [],
            courseLevel: '',
            category: '',
            age: '',
            subject: '',
          });
          setAlert('success', result.data.message);
          setNextToggle(!nextToggle);
          history.push('/course-list');
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

  const handleEdit = () => {
    axiosInstance.put(`${endpoints.onlineCourses.updateCourse}11/update-course/`, {
      "course_name": title,
      pre_requirement: coursePre,
      overview: overview,
      learn: learn,
      grade: [24],
      level: filterData.courseLevel.level,
      no_of_periods: parseInt(noOfPeriods),
      period_data: data,
      tag_id: `${filterData.age.id},${filterData.subject.id}`

    }).then(result => {
      if (result.data.status_code === 200) {
        setState({ ...state, isEdit: false, viewPeriodData: [], editData: [] })
        setFilePath([]);
        setData([])
        setNoPeriods(0);
        setTitle('')
        setCoursePre('')
        setOverview('')
        setLearn('')
        setFilterData({
          branch: '',
          grade: [],
          courseLevel: '',
          category: '',
          age: '',
          subject: '',
        });
        setAlert('success', result.data.message)
        setNextToggle(!nextToggle)
        history.push('/course-list');
      }
    })
  }

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
        setBranchDropdown([])
        setAlert('error', error.message);
      });

    axiosInstance
      .get(`${endpoints.onlineCourses.categoryList}?tag_type=1`)
      .then((result) => {
        if (result.data.status_code === 201) {
          setCategoryDropdown(result.data.result)
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setCategoryDropdown([])
        setAlert('error', error.message)
      });

  }, []);
  // console.log(subjectDropdown,'=======',state);
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
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
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
                options={branchDrop}
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
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={handleCategory}
                id='volume'
                className='dropdownIcon'
                value={filterData?.category}
                options={categoryDropdown}
                getOptionLabel={(option) => option?.tag_name}
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
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <Autocomplete
                // multiple
                style={{ width: '100%' }}
                size='small'
                onChange={handleGrade}
                id='volume'
                className='dropdownIcon'
                value={filterData?.grade}
                options={gradeDropdown}
                getOptionLabel={(option) => option?.gradeName}
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
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={handleAge}
                id='volume'
                className='dropdownIcon'
                value={filterData?.age}
                options={age}
                getOptionLabel={(option) => option?.tag_name}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Age'
                    placeholder='Age'
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={handleSubject}
                id='volume'
                className='dropdownIcon'
                value={filterData?.subject}
                options={subjectDropdown}
                getOptionLabel={(option) => option?.subjectName}
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
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <TextField
                id='subname'
                type='number'
                className='dropdownIcon'
                style={{ width: '100%' }}
                label='No. Of Periods'
                placeholder='No. Of Periods'
                variant='outlined'
                size='small'
                value={noOfPeriods}
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

            {!flag ? (
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
            ) : null}

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
                          <CourseCard key={i} index={i} cData={data} setData={setData} />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
              <div className='submit'>
                <Grid item xs={12} sm={12}>
                  {!state?.isEdit ? <Button onClick={handleSubmit} style={{ width: '16rem', marginLeft: '1.2rem' }}>SUBMIT</Button>
                    :
                    <Button onClick={handleEdit} style={{ width: '16rem', marginLeft: '1.2rem' }}>EDIT</Button>
                  }

                </Grid>
              </div>
            </>
          )}
        <Grid
          container
          spacing={isMobile ? 3 : 5}
          style={{ width: widerWidth, margin: wider }}
        >
          <Grid item xs={12} sm={4}>
            <JoinLimitContainer
            clear={clear} 
            setClear={setClear}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DaysFilterContainer 
            clear={clear}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DurationContainer
            clear={clear}
            />
          </Grid>
        </Grid>
      </Layout>
    </>
  );
};

export default CreateCourse;
