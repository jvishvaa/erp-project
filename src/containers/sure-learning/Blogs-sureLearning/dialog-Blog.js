import React, { useContext, useRef, useState, useEffect } from 'react';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import { Link, useHistory } from 'react-router-dom';
import endpoints from 'config/endpoints';
import '../tressureBox/tressureBoxVideo/videoviewer.scss';
import ReactHtmlParser from 'react-html-parser';
import {
    Button,
    Grid,
    makeStyles,
    ListItemText,
    ListItem,
    List,
    Paper,
    CardMedia,
    withStyles,
    useTheme,
    // Dialog,
    Box,
    Input,
    Typography,
  } from '@material-ui/core';


const EachBlog = () => {
  const history = useHistory();
  const [eachBlog , setEachBlog ] = useState(''); 

    useEffect(()=>{
        if(history?.location?.state){
            console.log(history , "blog");
            setEachBlog(history?.location?.state)
        }
    },[])

    const handleback = () => {
    history.goBack();

    }
    return(
        <Layout className='accessBlockerContainer'>
        <div className='blog-container' id='blogContainer'>
          <CommonBreadcrumbs
            componentName='Sure Learning'
            childComponentName='Blog'
            isAcademicYearVisible={true}
          />
          <Grid item md={3} xs={12} className='btn-area'>
          <Button
              variant='contained'
              size='medium'
              style={{ width: '50%' }}
              className='cancelButton labelColor'
              // onClick={history.push('/subjectTrain')}
              onClick={handleback}
            >
              Back
            </Button>
            </Grid>
            <div className='image-area'>
                <img src={eachBlog.blog_header_image} className='blog-img' />
                <Typography className='title-blog' > {ReactHtmlParser(eachBlog.blog_title)} </Typography>
            </div>
            <Paper style={{margin: '3%' , padding: '2%'}}>
              {ReactHtmlParser(eachBlog.blog_content)}
            </Paper>
          </div>
          </Layout>
    )
}
export default EachBlog;