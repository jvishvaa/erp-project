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


  


const EditCategory = (props) => {
  const catId =props.match.params.id
  const classes = useStyles()
  const [categoryTypeChoicesValue,setCategoryTypeChoicesValue] =useState(1)
  const [categoryListRes, setcategoryListRes] = useState([]);
  const [categoryName,setCategoryName] =useState('');
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false)
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '0 0 -1rem 1.5%'
  const widerWidth = isMobile ? '90%' : '85%'

  
      
   

   

 
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true);
    let requestData= {}
    if (categoryTypeChoicesValue === "1"){
      // requestData = {
      //   "category_name":categoryName,
      //   "category_type":categoryTypeChoicesValue,
      // }
  
    } else if(categoryTypeChoicesValue === "2"){
      // requestData = {
      // "category_name":categoryName,
      // "category_type":categoryTypeChoicesValue,
      // "category_parent_id":  categoryValue
      // } 
    }else if(categoryTypeChoicesValue === "3") {
      // requestData = {
      //   "category_name":categoryName,
      //   "category_type":categoryTypeChoicesValue,
      //   "category_parent_id":  subCategoryValue

      // }
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
      // axiosInstance.get(`${endpoints.discussionForum.categoryList}?id=${catId}`)
      axiosInstance.get(`${endpoints.discussionForum.categoryList}?id=33`)

      .then((res) => {
            setcategoryListRes(res.data.result[0])
        }).catch(err => {
            console.log(err)
        })
    }

    getCategoryList();
}, []);


const handleSubCategoryNameChange = (e) => {
  setCategoryName(e.target.value);
};
const handleSubSubCategoryNameChange = (e) => {
  setCategoryName(e.target.value);
};
const handleCategoryNameChange = (e) => {
  setCategoryName(e.target.value);
};


  return (
   <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>

        <Grid container spacing={isMobile ? 3 : 5} style={{ width: widerWidth, margin: wider }}>
          

           <Grid item xs={12} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
               <TextField
                id='outlined-helperText'
                label="Category" 
                defaultValue=''
                value={categoryListRes && categoryListRes.category}
                variant='outlined'
                style={{ width: '100%' }}
                inputProps={{ maxLength: 20 }}
                onChange={handleCategoryNameChange}
                color='secondary'
                size='small'
              />
               </Grid>
        

          <Grid item xs={12} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
           <TextField
                id='outlined-helperText'
                label="Sub category" 
                defaultValue=''
                value={categoryListRes && categoryListRes.sub_category_name}
                variant='outlined'
                style={{ width: '100%' }}
                inputProps={{ maxLength: 20 }}
                onChange={handleSubCategoryNameChange}
                color='secondary'
                size='small'
              />
          </Grid>

          <Grid item xs={12} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
              <TextField
                id='outlined-helperText'
                label="Sub sub category" 
                defaultValue=''
                value={categoryListRes && categoryListRes.sub_sub_category_name}
                variant='outlined'
                style={{ width: '100%' }}
                inputProps={{ maxLength: 20 }}
                onChange={handleSubSubCategoryNameChange}
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
            >
              Save
        </Button>
          </Grid>
        </Grid>
      </Layout>
    </>
  )
}

export default EditCategory
