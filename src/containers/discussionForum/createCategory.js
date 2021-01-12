import React, { useState, useEffect, useContext } from 'react'
import Layout from '../Layout'
import {  TextField, Grid, Button, useTheme } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import Loading from '../../components/loader/loader';


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


  


const CreateCategory = () => {
  const classes = useStyles()

  const categoryTypeChoices=[ { label: 'Category', value: '1' },
  { label: 'Sub category', value: '2' },
  { label: 'Sub sub category', value: '3' }

  ] 

  const [categoryTypeChoicesValue,setCategoryTypeChoicesValue] =useState(1)
  const [categoryListRes, setcategoryListRes] = useState([]);
  const [subCategoryListRes,setSubCategoryListRes] =useState([]);
  const [categoryValue, setCategoryValue] = useState('');
  const [subCategoryValue, setSubCategoryValue]=useState('');
  const[categoryTypeValue,setCategoryTypeValue] =useState('');
  const [categoryName,setCategoryName] =useState('');
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false)
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '0 0 -1rem 1.5%'
  const widerWidth = isMobile ? '90%' : '85%'

  
      
   

   

 
  const handleNewType = (event, value) => {
    if (value && value.value){
    setCategoryTypeChoicesValue(value.value)
    setCategoryTypeValue(value)
    }
    else{
      setCategoryTypeChoicesValue(1)
      setCategoryTypeValue('')

    }

  
    
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true);
    let requestData= {}
    if (categoryTypeChoicesValue === "1"){
      requestData = {
        "category_name":categoryName,
        "category_type":categoryTypeChoicesValue,
      }
  
    } else if(categoryTypeChoicesValue === "2"){
      requestData = {
      "category_name":categoryName,
      "category_type":categoryTypeChoicesValue,
      "category_parent_id":  categoryValue
      } 
    }else if(categoryTypeChoicesValue === "3") {
      requestData = {
        "category_name":categoryName,
        "category_type":categoryTypeChoicesValue,
        "category_parent_id":  subCategoryValue

      }
    }
  

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

 

  

  useEffect(() => {
    const getCategoryList = () => {
        axiosInstance.get(endpoints.discussionForum.categoryList).then((res) => {
            setcategoryListRes(res.data.result)
        }).catch(err => {
            console.log(err)
        })
    }

    getCategoryList();
}, []);
const handleCategoryChange = (event,value) => {
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


  return (
   <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>

        <Grid container spacing={isMobile ? 3 : 5} style={{ width: widerWidth, margin: wider }}>
          <Grid item xs={12} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleNewType}
              id='category'
              required
              options={categoryTypeChoices}
              getOptionLabel={(option) => option?.label}
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
          </Grid>
          {categoryTypeChoicesValue === '2'  || categoryTypeChoicesValue === '3'  ?

           <Grid item xs={12} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
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
                  //  getOptionSelected={(option, value) => value && option.id == value.id}
               />
               </Grid>
        
       : ''}
        {categoryTypeChoicesValue === '3'  ?

          <Grid item xs={12} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
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
              getOptionSelected={(option, value) => value && option.id == value.sub_category_id}
          />
          </Grid>

      : ''}
          <Grid item xs={12} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
              <TextField
                id='outlined-helperText'
                label={ categoryTypeChoicesValue ==='3'?'Sub sub category name':
                (categoryTypeChoicesValue === '2'?'Sub category name':'Category name')}
                defaultValue=''
                variant='outlined'
                style={{ width: '100%' }}
                inputProps={{ maxLength: 20 }}
                onChange={(event,value)=>{handleCategoryNameChange(event);}}
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
              disabled={!categoryTypeChoicesValue || !categoryName }
            >
              Save
        </Button>
          </Grid>
        </Grid>
      </Layout>
    </>
  )
}

export default CreateCategory