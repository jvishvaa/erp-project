import React, { useState, useEffect, useContext } from 'react'
import Layout from '../Layout'
import {  TextField, Grid, Button, useTheme } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CustomMultiSelect from '../communication/custom-multiselect/custom-multiselect';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import Loading from '../../components/loader/loader';
// import MyTinyEditor from './tinymce-editor'
import MyTinyEditor from '../question-bank/create-question/tinymce-editor'
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
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const themeContext = useTheme();
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
  const [moduleId, setModuleId] = useState(8);
  const [description, setDescription] = useState('');
  const [descriptionDisplay, setDescriptionDisplay] = useState('');



  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true);
    let requestData= {}
      requestData = {
          "title": title,
          "description": descriptionDisplay,
          "category": selectedSubSubCategory,
          "branch": selectedBranch.id,
          "grade": selectedGradeIds,
          "section": selectedSectionIds
      }
    axiosInstance.post(`${endpoints.discussionForum.CreateDissusionForum}`, requestData)

    .then(result=>{
    if (result.data.status_code === 200) {
      setLoading(false);
      setAlert('success', result.data.message);
    } else {        
      setLoading(false);
      setAlert('error', result.data.message);
    }
    }).catch((error)=>{
      setLoading(false);        
      setAlert('error', error.message);
    })
    };

    const getBranchApi = async () => {
      try {
        setLoading(true);
        const result = await axiosInstance.get(endpoints.communication.branches, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const resultOptions = [];
        if (result.status === 200) {
          result.data.data.map((items) => resultOptions.push(items.branch_name));
          setBranchList(result.data.data);
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
          `${endpoints.communication.grades}?branch_id=${selectedBranch.id}&module_id=${moduleId}`,
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
        axiosInstance.get(endpoints.discussionForum.categoryList).then((res) => {
            setcategoryListRes(res.data.result)
        }).catch(err => {
            console.log(err)
        })
    }

    getCategoryList();
    getBranchApi();
}, []);

const handleCategoryChange = (event,value) => {
  if (value && value.id) {
    setSelectedCategory(value.id);
    axiosInstance.get(`${endpoints.discussionForum.categoryList}?category_id=${value.id}&category_type=2`)
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
  setSelectedSubCategory(value.sub_category_id)
  axiosInstance.get(`${endpoints.discussionForum.categoryList}?category_id=${value.sub_category_id}&category_type=3`)
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
    setSelectedSubSubCategory(value.sub_sub_category_id)
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
      `${endpoints.communication.sections}?branch_id=${
        selectedBranch.id
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
        console.log('selected sections array ', selectedSectionsArray);
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
  const sectionsId = [];
  sectionList
  .filter((item) => selectedSections.includes(item['section__section_name']))
  .forEach((items) => {
    sectionsId.push(items.section_id);
  });
  setSelectedSectionIds(sectionsId)
  setTitle(e.target.value);

}
const handleEditorChange = (content, editor) => {
  setDescription(content);
  setDescriptionDisplay(editor.getContent({ format: 'text' }));
};


  return (
   <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>

        <Grid container spacing={isMobile ? 3 : 5} style={{ width: widerWidth, margin: wider }}>
                    <Grid xs={12} lg={4} className='create_group_items' item>
                          <Autocomplete
                            size='small'
                            style={{ width: '100%' }}

                            onChange={handleBranch}
                            value={selectedBranch}
                            id='message_log-branch'
                            className='create_group_branch'
                            options={branchList}
                            getOptionLabel={(option) => option?.branch_name}
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
                    <Grid xs={12} lg={4} className='create_group_items' item>
                    {selectedBranch && gradeList.length ? ( 
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
               ) : null }
                    </Grid>
                    <Grid xs={12} lg={4} className='create_group_items' item>
                      {selectedGrades.length && sectionList.length ? (
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
                      ) : null}
                     
                    </Grid>
                  </Grid>
         
          <Grid container spacing={isMobile ? 3 : 5} style={{ width: widerWidth, margin: wider }}>
           <Grid item xs={12} sm={4}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
               <Autocomplete
                   style={{ width: '100%' }}
                   id="tags-outlined"
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
                   onChange={
                       handleCategoryChange
                   }
               />
               </Grid>
          <Grid item xs={12} sm={4}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
          {selectedCategory && subCategoryListRes.length ? ( 
          <Autocomplete
              style={{ width: '100%' }}
              id="tags-outlined"
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
          ) : null}
          </Grid>
          <Grid item xs={12} sm={4}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
          {selectedSubCategory && subSubCategoryListRes.length ? ( 
          <Autocomplete
              style={{ width: '100%' }}
              id="tags-outlined"
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
          ) : null}
          </Grid>
        </Grid>
        <Grid container spacing={isMobile ? 3 : 5} style={{ width: widerWidth, margin: wider }}>

        <Grid item xs={12} sm={12}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
              <TextField
                id='outlined-helperText'
                label="Title"
                defaultValue=''
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
                        description={description}
                        handleEditorChange={handleEditorChange}
                        setOpenEditor={setOpenEditor}
                    />

  </Grid>
</Grid>

        <Grid container spacing={isMobile ? 1 : 5} style={{ width: '95%', margin: '-1.25rem 1.5% 0 1.5%' }}>
          <Grid item xs={6} sm={2}>
            <Button
              variant='contained'
              style={{ color: 'white' }}
              color="primary"
              className="custom_button_master"
              size='medium'
              type='submit'
              onClick={handleSubmit}
              disabled={!selectedSubCategory || !selectedCategory ||!selectedSubSubCategory || !selectedBranch
              ||!setTitle ||!setDescriptionDisplay }
            >
              Submit
        </Button>
          </Grid>
        </Grid>
      </Layout>
    </>
  )
}

export default CreateDiscussionForum;