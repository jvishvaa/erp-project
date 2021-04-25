import React, { useState, useEffect, useContext } from 'react'
import Layout from '../Layout'
import {  TextField, Grid, Button, useTheme } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CustomMultiSelect from '../communication/custom-multiselect/custom-multiselect';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import Loading from '../../components/loader/loader';
import { useSelector, useDispatch } from 'react-redux';
// import MyTinyEditor from './tinymce-editor'
import MyTinyEditor from '../question-bank/create-question/tinymce-editor'
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { editPostDataAction, editPostData } from '../../redux/actions/discussionForumActions';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '85%',
    margin: '1.25rem 3%',
    boxShadow: 'none'
  },
  container: {
    maxHeight: '70vh',
    width: '100%',
    boxShadow: '0px 0px 10px -5px #fe6b6b',
    borderRadius: '.5rem'
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
}));

const CreateDiscussionForum = () => {
  const classes = useStyles()
  const location = useLocation();
  const postsId = useParams();
  const dispatch = useDispatch();
  const hasEdited = useSelector((state) => state.discussionReducers.hasEdited);
  const [categoryListRes, setcategoryListRes] = useState([]);
  const [subCategoryListRes,setSubCategoryListRes] =useState([]);
  const [subSubCategoryListRes,setSubSubCategoryListRes] =useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState('');
  const [title,setTitle]=useState('');
  // const [description,setDescription]=useState('');
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const themeContext = useTheme();
  const [sessionYear, setSessionYear] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '0 0 -1rem 1.5%'
  const widerWidth = isMobile ? '90%' : '85%'
  const [grade, setGrade] = useState([]);
  const [section, setSection] = useState([]);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [selectedGradeIds,setSelectedGradeIds] = useState([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState([]);
  const [openEditor, setOpenEditor] = useState(true);
  //const [moduleId, setModuleId] = useState(8);
  const [moduleId, setModuleId] = useState();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [description, setDescription] = useState('');
  const [descriptionDisplay, setDescriptionDisplay] = useState('');
  const history = useHistory();

  // edit discussion state
  const [editData, setEditData] = useState('');

  const handleBackButton = () => {
    setDescription('');
    setTitle('')
    if(location.pathname === '/student-forum/create' || location.pathname === `/student-forum/edit/${postsId.id}`){
      history.push('/student-forum');
    }
    else {
      history.push('/teacher-forum');
    }
  }

  // new duscussion submit
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true);
    const sectionsId = [];
    sectionList
    .filter((item) => selectedSections.includes(item['section__section_name']))
    .forEach((items) => {
      sectionsId.push(items.id);
    });
    //setSelectedSectionIds(sectionsId)

    let requestData= {}
    if(location.pathname === '/student-forum/create'){
      const grade_id = userDetails.role_details?.grades[0]?.grade_id;
      const branch_id = userDetails.role_details?.branch[0]?.id;
      requestData = {
        "title": title,
        "description": descriptionDisplay,
        "category": selectedSubSubCategory.sub_sub_category_id,
        "branch": branch_id,
        "grade": [grade_id],
        //"section": selectedSectionIds
      }
    }
    else {
      requestData = {
        "title": title,
        "description": descriptionDisplay,
        "category": selectedSubSubCategory.sub_sub_category_id,
        "branch": selectedBranch.branch.id,
        "grade": selectedGradeIds,
        "section_mapping": sectionsId
      }
    }
    axiosInstance.post(`${endpoints.discussionForum.CreateDissusionForum}`, requestData)
    .then(result=>{
      if (result.data.status_code === 200) {
        setLoading(false);
        setAlert('success', result.data.message);
        if(location.pathname === '/student-forum/create'){
          history.push('/student-forum');
        }
        else {
          history.push('/teacher-forum');
        }
      } else {        
        setLoading(false);
        setAlert('error', result.data.message);
      }
    }).catch((error)=>{
      setLoading(false);        
      setAlert('error', error.message);
    })
  };

  // updatePost

  const handleUpdatePost = (e) => {
    e.preventDefault()
    //setLoading(true);
    let requestData = {}
    if(location.pathname === `/student-forum/edit/${postsId.id}`) {
      const grade_id = userDetails.role_details?.grades[0]?.grade_id;
      const branch_id = userDetails.role_details?.branch[0]?.id;
      requestData = {
        "title": title,
        "description": descriptionDisplay,
        "category": selectedSubSubCategory.sub_sub_category_id ?? selectedSubSubCategory.id,
        "branch": branch_id,
        "grade": [grade_id],
        //"section": selectedSectionIds
      }
    }
    else {
      requestData = {
        "title": title,
        "description": descriptionDisplay,
        "category": selectedSubSubCategory.id,
        "branch": editData?.branch_id,
        "grade": [editData?.grade_id],
        "section_mapping": [editData?.id]
      }
    }
    dispatch(editPostData(requestData, postsId?.id));
  }

  // session year API Call
    const getAcademicYear = () =>{
      axiosInstance.get(endpoints.userManagement.academicYear)
      .then((res) => {
        console.log(res.data);
        if(res.data.status_code === 200){
          setSessionYear(res.data.data);
        }
      })
      .catch((error) => {console.log(error)});
    }

    const getBranchApi = async () => {
      try {
        setLoading(true);
        const result = await axiosInstance.get(`${endpoints.communication.branches}?module_id=${moduleId}&session_year=${selectedSession?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const resultOptions = [];
        if (result.status === 200) {
          result.data.data.results.map((items) => resultOptions.push(items.branch.branch_name));
          setBranchList(result.data.data.results);
          setLoading(false);
        } else {
          setAlert('error', result.data.message);
          setLoading(false);
        }
      } catch (error) {
        setAlert('error', error.message);
        setLoading(false);
      }
    };

    const getGradeApi = async () => {
      try {
        setLoading(true);
        const result = await axiosInstance.get(
          `${endpoints.communication.grades}?session_year=${selectedSession?.id}&branch_id=${selectedBranch?.branch?.id}&module_id=${moduleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const resultOptions = [];
        if (result.status === 200) {
          result.data.data.map((items) => resultOptions.push(items.grade__grade_name));
          if (selectedBranch) {
            setGrade(resultOptions);
          }
          setGradeList(result.data.data);
          setLoading(false);
        } else {
          setAlert('error', result.data.message);
          setLoading(false);
        }
      } catch (error) {
        setAlert('error', error.message);
        setLoading(false);
      }
    };
    useEffect(() => {
      if (selectedSession) {
        setBranchList([]);
        getBranchApi();
      }
    }, [selectedSession]);

    useEffect(() => {
      if (selectedBranch) {
        setGrade([]);
        getGradeApi();
      }
    }, [selectedBranch]);

    useEffect(() => {
      if (selectedGrades.length && gradeList.length) {
        getSectionApi();
      } else {
       
          setSelectedSections([]);
      }
    }, [gradeList, selectedGrades]);

  useEffect(() => {
    const getCategoryList = () => {
        axiosInstance.get(`${endpoints.discussionForum.categoryList}?category_type=1&is_delete=False`).then((res) => {
            setcategoryListRes(res.data.result)
        }).catch(err => {
            console.log(err)
        })
    }

    getCategoryList();
    //getBranchApi();
    getAcademicYear();
  }, []);

  const handleCategoryChange = (event,value) => {
    if (value && value.id) {
      setSelectedCategory(value);
      setSelectedSubCategory(null);
      setSelectedSubSubCategory(null);
      axiosInstance.get(`${endpoints.discussionForum.categoryList}?category_id=${value.id}&category_type=2&is_delete=False`)
          .then(result => {
              if (result.data.status_code === 200) {
                setSubCategoryListRes(result.data.result);
              }
              else {
                  setAlert('error', result.data.message);
              }
          })
          .catch(error => {
              setAlert('error', error.message);
          })
  }
  else {
    setSelectedCategory(null);
    
    }
  }
  const handleSubCategoryChange = (event,value) => {
    if (value && value.sub_category_id){
    setSelectedSubCategory(value)
    setSelectedSubSubCategory(null);
    axiosInstance.get(`${endpoints.discussionForum.categoryList}?category_id=${value.sub_category_id}&category_type=3&is_delete=False`)
    .then(result => {
        if (result.data.status_code === 200) {
          setSubSubCategoryListRes(result.data.result);
        }
        else {
            setAlert('error', result.data.message);
        }
    })
    .catch(error => {
        setAlert('error', error.message);
    })
    }else{
      setSelectedSubCategory(null)
    }
  }
  const handleSubSubCategoryChange = (event,value) => {
    if (value){
      //sub_sub_category_id
      setSelectedSubSubCategory(value)
    }
    else{
      setSelectedSubSubCategory(null)  
    }
  }
  const getSectionApi = async () => {
    try {
      setLoading(true);
      const gradesId = [];
      gradeList
        .filter((item) => selectedGrades.includes(item['grade__grade_name']))
        .forEach((items) => {
          gradesId.push(items.grade_id);
        });
      const result = await axiosInstance.get(
        `${endpoints.communication.sections}?&session_year=${selectedSession?.id}&branch_id=${
          selectedBranch.branch.id
        }&grade_id=${gradesId.toString()}&module_id=${moduleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resultOptions = [];
      if (result.status === 200) {
        result.data.data.map((items) => resultOptions.push(items.section__section_name));
        setSection(resultOptions);
        setSectionList(result.data.data);
        if (selectedSections && selectedSections.length > 0) {
          // for retaining neccessary selected sections when grade is changed
          const selectedSectionsArray = selectedSections.filter(
            (sec) =>
              result.data.data.findIndex((obj) => obj.section__section_name == sec) > -1
          );
          setSelectedSections(selectedSectionsArray);
        }
        setLoading(false);
      } else {
        setAlert('error', result.data.message);
        setLoading(false);
      }
    } catch (error) {
      setAlert('error', error.message);
      setLoading(false);
    }
  };

  const handleGrade = (event, value) => {
      if (value) {
        
        setSelectedGrades(value);
      
      } else {
        setSelectedBranch();
      }
    }

    const handleAcademic = (event, value) => {
      if (value) {
        setSelectedSession(value);
      } else {
        setSelectedSession();
      }
    };

  const handleBranch = (event, value) => {
    if (value) {
      setSelectedBranch(value);
    } else {
      setSelectedBranch();
    }
  };

  const handleSection = (event, value) => {
    if (value) {
      const gradesId = [];
      gradeList
      .filter((item) => selectedGrades.includes(item['grade__grade_name']))
      .forEach((items) => {
        gradesId.push(items.grade_id);
      });
      setSelectedGradeIds(gradesId)
      setSelectedSections(value);
    } else {
      setSelectedSections();
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);

  }
  const handleEditorChange = (content, editor) => {
    setDescription(content);
    setDescriptionDisplay(editor.getContent({ format: 'text' }));
  };

  React.useEffect(() => {
    if (NavData && NavData.length) {
      let isModuleId = false;
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Discussion Forum' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Teacher Forum' && !isModuleId) {
              isModuleId = true;
              setModuleId(item.child_id);
            }
            else if (item.child_name === 'Student Forum' && !isModuleId) {
              isModuleId = true;
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  React.useEffect(() => {
    if(hasEdited && hasEdited !== ''){
      setAlert('success', 'Post Updated Successfully');
      setTitle('');
      setDescription('');
      setSelectedCategory('');
      setSelectedSubCategory('');
      setSelectedSubSubCategory('');
      setEditData('');
      dispatch(editPostDataAction());
      if(location.pathname === `/student-forum/edit/${postsId.id}`) {
        history.push('/student-forum');
      }
      if(location.pathname === `/teacher-forum/edit/${postsId.id}`) {
        history.push('/teacher-forum');
      }
    }
    if(hasEdited === false){
      setAlert('error', 'Something wrong');
      dispatch(editPostDataAction());
    }
  },[hasEdited])

  React.useEffect(() => {
    if(postsId?.id){
      axiosInstance.get(`/academic/${postsId?.id}/retrieve-post/`)
      .then((res) => {
        if(res.data.status_code === 200){
          console.log(res.data.result);
          setTitle(res.data.result.title);
          setDescription(res.data.result.description);
          setSelectedCategory(res.data.result.categories);
          setSelectedSubCategory(res.data.result.categories);
          setSelectedSubSubCategory(res.data.result.categories);
          setEditData(res.data.result.section_mapping[0])
        }
      })
      .catch((error) => {console.log(error)});
    }
  },[postsId])


  return (
   <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div className='breadcrumb-container-create' style={{ marginLeft: '15px' }}>
          <CommonBreadcrumbs
            componentName='Discussion forum'
            childComponentName='Create'
          />
        </div>
        {(location.pathname !== '/student-forum/create' &&
          location.pathname !== `/student-forum/edit/${postsId.id}` &&
          location.pathname !== `/teacher-forum/edit/${postsId.id}`) && (
          <Grid container spacing={isMobile ? 3 : 5} style={{ width: widerWidth, margin: wider }}>
            <Grid xs={12} lg={4} className='create_group_items' item>
              <Autocomplete
                size='small'
                style={{ width: '100%' }}
                onChange={handleAcademic}
                value={selectedSession}
                id='message_log-branch'
                className='create_group_branch'
                options={sessionYear}
                getOptionLabel={(option) => option?.session_year}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    className='message_log-textfield'
                    {...params}
                    variant='outlined'
                    label='Acadmic Year'
                    placeholder='Acadmic Year'
                  />
                )}
              />
            </Grid>
            {/* {selectedSession && branchList.length && ( */}
              <Grid xs={12} lg={4} className='create_group_items' item>
                <Autocomplete
                  size='small'
                  style={{ width: '100%' }}
                  onChange={handleBranch}
                  value={selectedBranch}
                  id='message_log-branch'
                  className='create_group_branch'
                  options={branchList}
                  getOptionLabel={(option) => option?.branch.branch_name}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      className='message_log-textfield'
                      {...params}
                      variant='outlined'
                      label='Branch'
                      placeholder='Branch'
                    />
                  )}
                />
              </Grid>
            {/* )} */}
            <Grid xs={12} lg={4} className='create_group_items' item>
              {/* {selectedSession && selectedBranch.length && gradeList.length ? (  */}
              <Autocomplete
                multiple
                style={{ width: '100%' }}
                size='small'
                onChange={handleGrade}
                id='grade'
                className='dropdownIcon'
                options={grade}
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
            {/* ) : null } */}
            </Grid>
            <Grid xs={12} lg={4} className='create_group_items' item>
              {/* {selectedSession && selectedBranch.length && selectedGrades.length && sectionList.length ? ( */}
              <Autocomplete
                multiple
                style={{ width: '100%' }}
                size='small'
                onChange={handleSection}
                id='section'
                className='dropdownIcon'
                options={section}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Section'
                    placeholder='Section'
                  />
                )}
              />
              {/* ) : null} */}
            </Grid>
          </Grid>
        )}
        <Grid container spacing={isMobile ? 3 : 5} style={{ width: widerWidth, margin: wider }}>
          <Grid item xs={12} sm={4}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
            <Autocomplete
              style={{ width: '100%' }}
              id="tags-outlined"
              value={selectedCategory}
              options={categoryListRes}
              getOptionLabel={(option) => option.category_name}
              filterSelectedOptions
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label=" Select category"
                />
              )}
              onChange={handleCategoryChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
            {/* {selectedCategory && subCategoryListRes.length ? (  */}
            <Autocomplete
              style={{ width: '100%' }}
              id="tags-outlined"
              value={selectedSubCategory}
              options={subCategoryListRes}
              getOptionLabel={(option) => option.sub_category_name}
              filterSelectedOptions
              size="small"
              renderInput={(params) => (
                  <TextField
                      {...params}
                      variant="outlined"
                      label=" Select sub category"

                  />
              )}
              onChange={
                  handleSubCategoryChange
              }
            />
             {/* ) : null} */}
          </Grid>
          <Grid item xs={12} sm={4}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
            {/* {selectedCategory && selectedSubCategory && subSubCategoryListRes.length ? (  */}
            <Autocomplete
              style={{ width: '100%' }}
              id="tags-outlined"
              value={selectedSubSubCategory}
              options={subSubCategoryListRes}
              getOptionLabel={(option) => option.sub_sub_category_name}
              filterSelectedOptions
              size="small"
              renderInput={(params) => (
                  <TextField
                      {...params}
                      variant="outlined"
                      label=" Select sub sub category"

                  />
              )}
              onChange={
                  handleSubSubCategoryChange
              }
            />
             {/* ) : null} */}
          </Grid>
        </Grid>
        <Grid container spacing={isMobile ? 3 : 5} style={{ width: widerWidth, margin: wider }}>
          <Grid item xs={12} sm={12}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
            <TextField
              id='outlined-helperText'
              label="Title"
              defaultValue=''
              value={title}
              placeholder="Title not more than 100 words"
              variant='outlined'
              style={{ width: '100%' }}
              inputProps={{ maxLength: 100 }}
              onChange={(event,value)=>{handleTitleChange(event);}}
              color='secondary'
              // helperText={`${title.length}/100`}
              size='small'
            />
          </Grid>
        </Grid>
        <Grid container spacing={isMobile ? 3 : 5} style={{ width: widerWidth, margin: wider }}>
          <Grid item xs={12} sm={12}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
            <MyTinyEditor
              id="Editor"
              //description={description}
              content={description}
              handleEditorChange={handleEditorChange}
              setOpenEditor={setOpenEditor}
            />
          </Grid>
        </Grid>
        <Grid container spacing={isMobile ? 1 : 5} style={{ width: '95%', margin: '-1.25rem 1.5% 0 1.5%' }}>
          <Grid item xs={6} sm={9}>
            <Button onClick={handleBackButton}>Back</Button>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Button
              variant='contained'
              style={{ color: 'white' }}
              color="primary"
              className="custom_button_master"
              size='medium'
              type='submit'
              onClick={(location.pathname === `/student-forum/edit/${postsId.id}` || location.pathname === `/teacher-forum/edit/${postsId.id}`) ? handleUpdatePost : handleSubmit}
              disabled={!selectedSubCategory || !selectedCategory ||!selectedSubSubCategory || !setTitle ||!setDescriptionDisplay }
            >
              {(location.pathname === `/student-forum/edit/${postsId.id}` || location.pathname === `/teacher-forum/edit/${postsId.id}`) ? 'Upadate' : 'Submit'}
            </Button>
          </Grid>
        </Grid>
      </Layout>
    </>
  )
}

export default CreateDiscussionForum;