import React, { useContext, useRef, useState, useEffect } from 'react';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import endpoints from 'config/endpoints';
import ButtonBase from '@material-ui/core/ButtonBase';
import {
  Button,
  CardMedia,
  Divider,
  Grid,
  makeStyles,
  Tab,
  Paper,
  withStyles,
  useTheme,
  Dialog,
  DialogContent,
  Box,
  AppBar,
  Tabs,
  Input,
  Typography,
  Card,
  CardActions,
} from '@material-ui/core';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { Autocomplete, Pagination } from '@material-ui/lab';
import ReactHtmlParser from 'react-html-parser';
import '../tressureBox/tressureBoxVideo/videoviewer.scss';
const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1rem',
    borderRadius: '10px',
    width: '100%',
    margin: '1.5rem -0.1rem',
  },
  bord: {
    margin: theme.spacing(1),
    border: 'solid lightgrey',
    borderRadius: 10,
  },
  title: {
    fontSize: '1.1rem',
  },

  content: {
    fontSize: '20px',
    marginTop: '2px',
  },
  contentData: {
    fontSize: '12px',
  },
  contentsmall: {
    fontSize: '15px',
  },
  textRight: {
    textAlign: 'right',
  },
  paperSize: {
    width: '300px',
    height: '670px',
    borderRadius: '10px',
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

const Blogs = () => {
  const history = useHistory();
  const classes = useStyles({});
  const [value, setValue] = React.useState(0);
  const [categoryBlogs, setCategoryBlogs] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [moduleId, setModuleId] = useState('');
  const [listOfBlogs, setListOfBlogs] = useState([]);
  const [createBlogs, setCreateBlogs] = useState([]);
  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails?.personal_info?.token;
  const moduleData = udaanDetails?.role_permission?.modules;
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (moduleData && moduleData.length) {
      moduleData.forEach((item) => {
        console.log(item.module, 'module Ids');
        if (item.module_name === 'Blogs') {
          setModuleId(item.module);
        }
      });
    }
  }, []);

  useEffect(() => {
    console.log(history, 'history');
    if (moduleId && udaanToken) {
      axios
        .get(`${endpoints.sureLearning.CreateBlogs}`, {
          headers: {
            Authorization: `Bearer ${udaanToken}`,
            module: moduleId,
          },
        })
        .then((res) => {
          console.log(res , "response");
          setCreateBlogs(res.data.results);
        })
        .catch((error) => {
          setAlert('error', 'Something Wrong!');
        });
      getCategory();
    }
  }, [moduleId]);

  const getCategory = () => {
    axios
      .get(`${endpoints.sureLearning.CategoryBlogs}`, {
        headers: {
          Authorization: `Bearer ${udaanToken}`,
          module: moduleId,
        },
      })
      .then((res) => {
          console.log(res, 'Blogscat');
        setCategoryBlogs(res.data);
      })
      .catch((error) => {
        setAlert('error', 'Something Wrong!');
      });
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = (item) => {
    setOpen(true);
  };

  const handleBlog = (blog) => {
    console.log(blog , "blog");
    history.push({
      pathname:'/eachblog',
      state: blog,
      allBlogs: createBlogs
    })

  }

  const handleChange = (event, index) => {
    axios
      .get(`${endpoints.sureLearning.ListOfBlogs}?category_id=${event?.id}`, {
        headers: {
          Authorization: `Bearer ${udaanToken}`,
          module: moduleId,
        },
      })
      .then((res) => {
        console.log(res, 'LIII');
        // setListOfBlogs(res.data);
        setCreateBlogs(res.data)
      })
      .catch((error) => {
        setAlert('error', 'Something Wrong!');
      });
  };
  return (
    <Layout className='accessBlockerContainer'>
      <div className={classes.parentDiv} id='blogContainer'>
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName='Blogs'
          isAcademicYearVisible={true}
        />
        <div id='image-area-blog'>
          <img src='https://picsum.photos/1600/580' id='image-blog' />
          <p id='sure-learning'> Sure Learning </p>
          <p id='blogs'> Blogs </p>
        </div>

        <div className='tab-category'>
          <Tabs
            // value={value}
            // onChange={handleChange}
            indicatorColor='primary'
            textColor='primary'
            className='tabs'
          >
            {categoryBlogs &&
              categoryBlogs.map((tab, index) => (<Tab label={tab.category_title} onClick={() => handleChange(tab)} /> ))}
          </Tabs>
        </div>
        <div className='cards-area'>
          {createBlogs && createBlogs.map((blog , index) => (
          <Card className='card-container' onClick={() => handleBlog(blog)}  >
            <CardActionArea  >
             <img src={`${endpoints.s3UDAAN_BUCKET}${blog.blog_header_image.substring(31)}`} className='card-image'  />
              <CardContent>
                <Typography variant='body2' color='textSecondary' component='p' className='card-title' >
                { ReactHtmlParser( blog.blog_title)}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Blogs;
