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
// /home/aamani/develop/erp-revamp-frontend/src/containers/communication/custom-multiselect/custom-multiselect.jsx
// /home/aamani/develop/erp-revamp-frontend/src/components/loader/loader.jsx
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

  // const categoryTypeChoices=[ { label: 'Category', value: '1' },
  // { label: 'Sub category', value: '2' },
  // { label: 'Sub sub category', value: '3' }

  // ] 

  // const [categoryTypeChoicesValue,setCategoryTypeChoicesValue] =useState(1)
  const [categoryListRes, setcategoryListRes] = useState([]);
  const [subCategoryListRes,setSubCategoryListRes] =useState([]);
  const [categoryValue, setCategoryValue] = useState('');
  const [subCategoryValue, setSubCategoryValue]=useState('');
  const[categoryTypeValue,setCategoryTypeValue] =useState('');
  const [categoryName,setCategoryName] =useState('');
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
  const [branchError, setBranchError] = useState('');
  const [gradeError, setGradeError] = useState('');

  const [moduleId, setModuleId] = useState(8);

   

   

 
  // const handleNewType = (event, value) => {
  //   if (value && value.value){
  //   setCategoryTypeChoicesValue(value.value)
  //   }
  //   else{
  //     setCategoryTypeChoicesValue(1)
  //   }

  
    
  // }


  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true);
    let requestData= {}
    // if (categoryTypeChoicesValue === "1"){
    //   requestData = {
    //     "category_name":categoryName,
    //     "category_type":categoryTypeChoicesValue,
    //   }
  
    // } else if(categoryTypeChoicesValue === "2"){
    //   requestData = {
    //   "category_name":categoryName,
    //   "category_type":categoryTypeChoicesValue,
    //   "category_parent_id":  categoryValue
    //   } 
    // }else if(categoryTypeChoicesValue === "3") {
    //   requestData = {
    //     "category_name":categoryName,
    //     "category_type":categoryTypeChoicesValue,
    //     "category_parent_id":  subCategoryValue

    //   }
    // }
  

    axiosInstance.post(`${endpoints.discussionForum.PostCategory}`, requestData)

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
const handleCategoryChange = (value) => {
  console.log(value,"vvvvvvvvvvvvvvvvvvvvvvvvv")
  if (value && value.id) {
    setCategoryValue(value.id);
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
  setCategoryValue(null);
  
  }
}
const handleSubCategoryChange = (event,value) => {
  if (value && value.sub_category_id){
  setSubCategoryValue(value.sub_category_id)
  }else{
    setSubCategoryValue(null)
  }
}


const handleCategoryNameChange = (e) => {
  setCategoryName(e.target.value);
};
const handleBranch = (event, value) => {
  if (value) {
    setSelectedBranch(value);
  } else {
    setSelectedBranch();
  }
};

  return (
   <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>

        <Grid container spacing={isMobile ? 3 : 5} style={{ width: widerWidth, margin: wider }}>
        <div className='create_group_filter_container'>
                  <Grid container className='create_group_container' spacing={5}>
                    <Grid xs={12} lg={4} className='create_group_items' item>
                      <div>
                        <div className='create_group_branch_wrapper'>
                          <Autocomplete
                            size='small'
                            
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
                        </div>
                        <span className='create_group_error_span'>{branchError}</span>
                      </div>
                    </Grid>
                    <Grid xs={12} lg={4} className='create_group_items' item>
                      {selectedBranch && gradeList.length ? (
                        <div>
                          <CustomMultiSelect
                            selections={selectedGrades}
                            setSelections={setSelectedGrades}
                            nameOfDropdown='Grade'
                            optionNames={grade}
                          />
                          <span className='create_group_error_span'>{gradeError}</span>
                        </div>
                      ) : null}
                    </Grid>
                    <Grid xs={12} lg={4} className='create_group_items' item>
                      {selectedGrades.length && sectionList.length ? (
                        <CustomMultiSelect
                          selections={selectedSections}
                          setSelections={setSelectedSections}
                          nameOfDropdown='Section'
                          optionNames={section}
                        />
                      ) : null}
                    </Grid>
                    <Grid xs={12} lg={12} className='under_line_create_group' />
                  </Grid>
                </div>
          {/* <Grid item xs={6} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleNewType}
              id='category'
              required
              value={categoryTypeValue}
              options={categoryTypeChoices}
              getOptionLabel={(option) => option?.label}
              // getOptionSelected={(option, value) => value && option.id == value.value}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='New type'
                  placeholder='New type'
                />
              )}
            />
          </Grid> */}
          {/* {categoryTypeChoicesValue === '2'  || categoryTypeChoicesValue === '3'  ? */}

           <Grid item xs={6} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
               <Autocomplete
                   style={{ width: '100%' }}
                   value={categoryValue}
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
                   onChange={(value) => {
                       handleCategoryChange(value);
                   }}
                   getOptionSelected={(option, value) => value && option.id == value.id}
               />
               </Grid>
        
       {/* : ''} */}
        {/* {categoryTypeChoicesValue === '3'  ? */}

          <Grid item xs={6} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
          <Autocomplete
              style={{ width: '100%' }}
              value={subCategoryValue}
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
              onChange={(event, value) => {
                  handleSubCategoryChange(event,value);
              }}
              getOptionSelected={(option, value) => value && option.id == value.sub_category_id}
          />
          </Grid>

      {/* : ''} */}
          <Grid item xs={6} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
              <TextField
                id='outlined-helperText'
                label="title"
                defaultValue=''
                variant='outlined'
                inputProps={{ maxLength: 20 }}
                // onChange={(event,value)=>{handleTitleChange(event);}}
                color='secondary'
                size='small'
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
              // disabled={!categoryTypeChoicesValue || !categoryName }
            >
              Save
        </Button>
          </Grid>
        </Grid>
      </Layout>
    </>
  )
}

export default CreateDiscussionForum