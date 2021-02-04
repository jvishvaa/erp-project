import React, { useContext, useEffect, useState } from 'react';
import Divider from '@material-ui/core/Divider';
import { useHistory } from 'react-router-dom';
import {
  Grid,
  TextField,
  Button,
  useTheme,
  SvgIcon,
  IconButton,
  TextareaAutosize,
} from '@material-ui/core';
import { useStyles } from '../../user-management/useStyles';
import { FormHelperText } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Layout from '../../Layout';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import attachmenticon from '../../../assets/images/attachmenticon.svg';
import deleteIcon from '../../../assets/images/delete.svg';
import Loading from '../../../components/loader/loader';
import validationSchema from '../../user-management/schemas/school-details';
import axios from 'axios';
import { useFormik } from 'formik';
import {
    fetchBranchesForCreateUser,
    fetchGrades,
    fetchSections,
    fetchAcademicYears as getAcademicYears,
    fetchSubjects as getSubjects,
  } from '../../../../src/redux/actions/index';

const CreateDailyDairy = (details, onSubmit) => {
  const [academicYears, setAcademicYears] = useState([]);
  const [branches, setBranches] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapterDropdown, setChapterDropdown] = useState([]);
  const [filePath,setFilePath] = useState([])
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};


  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';

  const formik = useFormik({
    initialValues: {
      academic_year: details.academic_year,
      branch: details.branch,
      grade: details.grade,
      section: details.section,
      subjects: details.subjects,
      chapters: details.chapters
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  const fetchAcademicYears = () => {
    getAcademicYears().then((data) => {
      const transformedData = data?.map((obj) => ({
        id: obj.id,
        session_year: obj.session_year,
      }));
      setAcademicYears(transformedData);
    });
  };

  const fetchBranches = () => {
    fetchBranchesForCreateUser().then((data) => {
      const transformedData = data?.map((obj) => ({
        id: obj.id,
        branch_name: obj.branch_name,
      }));
      setBranches(transformedData);
    });
  };

  const handleChangeBranch = (values) => {
    setGrades([]);
    setSections([]);
    fetchGrades(values).then((data) => {
      const transformedData = data
        ? data.map((grade) => ({
            id: grade.grade_id,
            grade_name: grade.grade__grade_name,
          }))
        : [];
      setGrades(transformedData);
    });
  };

  const handleChangeGrade = (values, branch) => {
    if (branch && branch.length > 0 && values && values.length > 0) {
      fetchSections(branch, values).then((data) => {
        const transformedData = data
          ? data.map((section) => ({
              id: section.section_id,
              section_name: `${section.section__section_name}`,
            }))
          : [];
        const filteredSelectedSections = formik.values.section.filter(
          (sec) => transformedData.findIndex((data) => data.id === sec.id) > -1
        );
        setSections(transformedData);
        formik.setFieldValue('section', filteredSelectedSections);
      });
      // fetchSubjects(branch, values);
    } else {
      setSections([]);
    }
  };

  const fetchChapters = () => {
        axios.get(`/academic/chapters/?academic_year=${academicYears}&subject=${formik.values.subjects}`)
        .then((result => {
            if (result.data.status_code === 200) {
                setChapterDropdown(result.data.result)
            } else {
                setAlert('error')
            }
        })).catch(error => {
            setAlert('error')
        })
}

  const fetchSubjects = (branch, grade, section) => {
    if (
      branch &&
      branch.length > 0 &&
      grade &&
      grade.length > 0 &&
      section &&
      section.length > 0
    ) {
      getSubjects(branch, grade, section).then((data) => {
        const transformedData = data.map((obj) => ({
          id: obj.subject__id,
          subject_name: obj.subject__subject_name,
        }));
        setSubjects(transformedData);
        const filteredSelectedSubjects = formik.values.subjects.filter(
          (sub) => transformedData.findIndex((data) => data.id === sub.id) > -1
        );
        formik.setFieldValue('subjects', filteredSelectedSubjects);
      });
    } else {
      setSubjects([]);
    }
}

  const handleSection = (e, value) => {
    formik.setFieldValue('section', value);
    if (!value.length) {
      formik.setFieldValue('subjects', []);
    }
    const {
      values: { branch = {}, grade = [] },
    } = formik;
    fetchSubjects([branch], grade, value);
  };
   
  const handleSubject = (e, value) => {
      formik.setFieldValue('subjects', value)
      if (subjects && subjects.length > 0){
          fetchChapters()
      }
  }

  const handleImageChange=  (event)=>{
    if(filePath.length<10){
        const data =event.target.files[0]
    const fd = new FormData();
    fd.append('file',event.target.files[0])
    // fd.append('branch',filterData.branch[0].branch_name)
    // fd.append('grade',filterData.grade[0].id)
    // fd.append('section',filterData.section.id)
    
    axiosInstance.post(`${endpoints.circular.fileUpload}`, fd)
        .then((result)=>{
        
            if(result.data.status_code === 200){
                console.log(result.data,'resp')
                setAlert('success',result.data.message)
                setFilePath([ ...filePath,result.data.result])
            }
            else{
                setAlert('error',result.data.message)
            }
  
        })
    }else{
        setAlert('warning','Exceed Maximum Number Attachment')
    }
    
  
  }

  const handleSubmit = async () => {
    const createDairyEntry = endpoints.dailyDairy.createDailyDairy;
    try {
      const response = await axiosInstance.post(
        createDairyEntry,
        {
          // title:title,
              // description:description,
              // module_name:filterData.role.value,
              branch: branches.map((b)=>b.id),
              grade:[grades.map((g)=> g.id)],
              mapping_bgs:[sections.map((se)=>se.id)],
              subject:subjects,
              // teacher_report:
              document:filePath,
              // Branch:filterData.branch.map(function (b) {
              //     return b.id
              //   }),
              // grades:[54],
          //     grade:filterData.grade.map((g)=>g.grade_id),
          //     mapping_bgs:filterData.section.map((s)=>s.id),
          // user_id: selectionArray,
        },
        {
          headers: {
            // 'application/json' is the modern content-type for JSON, but some
            // older servers may use 'text/json'.
            // See: http://bit.ly/text-json
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { message, status_code: statusCode } = response.data;
      if (statusCode === 200) {
        // props.history.push('/user-management/assign-role')
        // displayUsersList()
        setAlert('success', message);
        // setSelectedUsers([]);
        // setRoleError('');
        // setSelectedRole('');
        // setSelectAllObj([]);
        // setSelectedBranch();
        // setSelectedGrades([]);
        // setSelectedMultipleRoles([]);
        // setSelectedSections([]);
        // setSelectAllObj([]);
        // setSelectectUserError('');
        // setAssigenedRole();
        // clearSelectAll();
      } else {
        setAlert('error', response.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  useEffect(() => {
    fetchAcademicYears();
    fetchBranches();
    console.log('branches ', details.branch, details.grade);
    if (details.branch) {
      handleChangeBranch([details.branch]);
      if (details.grade && details.grade.length > 0) {
        handleChangeGrade(details.grade, [details.branch]);
      }
    }
    if (details.subjects && details.subjects.length > 0) {
        axios.get(`/academic/chapters/?academic_year=${formik.value.academic_year}&subject=${subjects}`)
        .then((result => {
            if (result.data.status_code === 200) {
                setChapterDropdown(result.data.result)
            } else {
                setAlert('error')
            }
        })).catch(error => {
            setAlert('error')
        })
    }
  }, []);
  const classes = useStyles();

  return (
    <>
      <Layout>
        <div className={isMobile ? 'breadCrumbFilterRow' : null}>
          <div style={{ width: '95%', margin: '20px auto' }}>
            <CommonBreadcrumbs
              componentName='Daily Dairy'
              childComponentName='Create New'
            />
          </div>
        </div>
        <Grid
          container
          spacing={isMobile ? 3 : 5}
          style={{ width: widerWidth, margin: wider }}
        >
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
        <FormControl fullWidth className={classes.margin} variant='outlined'>
          <Autocomplete
            id='academic_year'
            name='academic_year'
            onChange={(e, value) => {
              formik.setFieldValue('academic_years', value);
            }}
            value={formik.values.academic_year}
            options={academicYears}
            getOptionLabel={(option) => option.session_year || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Academic Year'
                placeholder='Academic Year'
              />
            )}
            size='small'
          />
          <FormHelperText style={{ color: 'red' }}>
            {formik.errors.academic_year ? formik.errors.academic_year : ''}
          </FormHelperText>
        </FormControl>
          </Grid>
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            id='branch'
            name='branch'
            onChange={(e, value) => {
              formik.setFieldValue('branch', value);
              formik.setFieldValue('grade', []);
              formik.setFieldValue('section', []);
              formik.setFieldValue('subjects', []);
              handleChangeBranch(value ? [value] : null);
            }}
            value={formik.values.branch}
            options={branches}
            getOptionLabel={(option) => option.branch_name || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Branch'
                placeholder='Branch'
              />
            )}
            size='small'
          />
          <FormHelperText style={{ color: 'red' }}>
            {formik.errors.branch ? formik.errors.branch : ''}
          </FormHelperText>
          </Grid>
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <FormControl fullWidth className={classes.margin} variant='outlined'>
          <Autocomplete
            id='grade'
            name='grade'
            onChange={(e, value) => {
              formik.setFieldValue('grade', value);
              formik.setFieldValue('section', []);
              formik.setFieldValue('subjects', []);
              handleChangeGrade(value || null, [formik.values.branch]);
            }}
            multiple
            value={formik.values.grade}
            options={grades}
            getOptionLabel={(option) => option.grade_name || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Grade'
                placeholder='Grade'
              />
            )}
            getOptionSelected={(option, value) => option.id == value.id}
            size='small'
          />
          <FormHelperText style={{ color: 'red' }}>
            {formik.errors.grade ? formik.errors.grade : ''}
          </FormHelperText>
        </FormControl>
          </Grid>
          </Grid>
          <Grid
          container
          spacing={isMobile ? 3 : 5}
          style={{ width: widerWidth, margin: wider }}
        >
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <FormControl fullWidth className={classes.margin} variant='outlined'>
          <Autocomplete
            id='section'
            name='section'
            onChange={handleSection}
            value={formik.values.section}
            options={sections}
            multiple
            getOptionLabel={(option) => option.section_name || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Section'
                placeholder='Section'
              />
            )}
            getOptionSelected={(option, value) => option.id == value.id}
            size='small'
          />
          <FormHelperText style={{ color: 'red' }}>
            {formik.errors.section ? formik.errors.section : ''}
          </FormHelperText>
        </FormControl>
          </Grid>
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <FormControl
          color='secondary'
          fullWidth
          className={classes.margin}
          variant='outlined'
        >
          <Autocomplete
            id='subjects'
            name='subjects'
            onChange={handleSubject}
            // {(e, value) => {
            //   formik.setFieldValue('subjects', value);
            // }}
            value={formik.values.subjects}
            limitTags={2}
            multiple
            options={subjects}
            getOptionLabel={(option) => option.subject_name || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Subjects'
                placeholder='Subjects'
              />
            )}
            getOptionSelected={(option, value) => option.id == value.id}
            size='small'
          />
          <FormHelperText style={{ color: 'red' }}>
            {formik.errors.subjects ? formik.errors.subjects : ''}
          </FormHelperText>
        </FormControl>
          </Grid>
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <FormControl fullWidth className={classes.margin} variant='outlined'>
                <Autocomplete
                    id='chapters'
                    style={{ width: '100%' }}
                    size='small'
                    onChange={(e, value) => {
                        formik.setFieldValue('chapters', value);
                      }}
                    value={formik.values.chapters}
                    options={chapterDropdown}
                    getOptionLabel={(option) => option?.chapter_name}
                    filterSelectedOptions
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant='outlined'
                            label='Chapter'
                            placeholder='Chapter'
                        />
                    )}
                />
                <FormHelperText style={{ color: 'red' }}>
            {formik.errors.chapters ? formik.errors.chapters : ''}
          </FormHelperText>
        </FormControl>
            </Grid>
        </Grid>

        {/* <<<<<<<<<< EDITOR PART  >>>>>>>>>> */}
        <div>
        <div className='descriptionBorder'>
        <Grid container spacing={isMobile ? 3 : 5} style={{ width: widerWidth, margin: wider }}>
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
                <TextField
                    id="outlined-multiline-static"
                    label="Recap of previous class"
                    multiline
                    rows="3"
                    color='secondary'
                    style={{ width: "100%",marginTop:'1.25rem'}}
                    // defaultValue="Default Value"
                    // value={title}
                    variant="outlined"
                    // onChange={e=> setTitle(e.target.value)}
                />
            </Grid>
                <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
                <TextField
                    id="outlined-multiline-static"
                    label="Details of classwork"
                    multiline
                    rows="3"
                    color='secondary'
                    style={{ width: "100%",marginTop:'1.25rem'}}
                    // defaultValue="Default Value"
                    // value={title}
                    variant="outlined"
                    // onChange={e=> setTitle(e.target.value)}
                />
            </Grid>
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
                <TextField
                    id="outlined-multiline-static"
                    label="Summary"
                    multiline
                    rows="3"
                    color='secondary'
                    style={{ width: "100%",marginTop:'1.25rem'}}
                    // defaultValue="Default Value"
                    // value={title}
                    variant="outlined"
                    // onChange={e=> setTitle(e.target.value)}
                />
            </Grid>
            </Grid>
        <Grid container spacing={isMobile ? 3 : 5} style={{ width: widerWidth, margin: wider }}>
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
                <TextField
                    id="outlined-multiline-static"
                    label="Tools Used"
                    multiline
                    rows="3"
                    color='secondary'
                    style={{ width: "100%",marginTop:'1.25rem'}}
                    // defaultValue="Default Value"
                    // value={title}
                    variant="outlined"
                    // onChange={e=> setTitle(e.target.value)}
                />
            </Grid>
                <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
                <TextField
                    id="outlined-multiline-static"
                    label="Homework"
                    multiline
                    rows="3"
                    color='secondary'
                    style={{ width: "100%",marginTop:'1.25rem'}}
                    // defaultValue="Default Value"
                    // value={title}
                    variant="outlined"
                    // onChange={e=> setTitle(e.target.value)}
                />
            </Grid>
            <Grid item xs={12} sm={5} className={isMobile ? '' : 'filterPadding'}>
            <div className="attachmentButtonContainer" style={{ marginTop:'10%' }}>

            <Button
                        startIcon={<SvgIcon
                            component={() => (
                                <img
                                    style={{ height: '20px', width: '20px' }}
                                    src={attachmenticon}
                                />
                            )}
                        />}
                        className="attchment_button"
                        title="Attach Supporting File"
                        variant='contained'
                        size="medium"
                        disableRipple
                        disableElevation
                        disableFocusRipple
                        disableTouchRipple
                        component="label"
                        style={{ textTransform: 'none' }}
                    >
                        <input
                            type='file'
                            style={{ display: 'none' }}
                            id='raised-button-file'
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    Add Document
                </Button>
                </div>
            </Grid>
            </Grid>
        </div>
        <div>
            <Button 
            style={{ marginLeft:'80%' }}
             onClick={handleSubmit}
              className='submit_button'>SUBMIT</Button>
        </div>
        </div>
      </Layout>
    </>
  );
};

export default CreateDailyDairy;