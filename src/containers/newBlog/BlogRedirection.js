import React, { useState, useEffect } from 'react';

import {
  makeStyles,
} from '@material-ui/core';
import "./blog.css";
import Layout from 'containers/Layout';

import { useTheme, withStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import Loader from '../../components/loader/loader';
import axiosInstance from '../../config/axios';
// import axios from 'v2/config/axios';
import axios from 'axios';
import endpoints from '../../config/endpoints';
import { Rating } from '@material-ui/lab';
import { Breadcrumb, Tabs, Button, Divider } from 'antd';
import moment from 'moment';
import image1 from "../../assets/images/gp1.png";
import image2 from "../../assets/images/gp2.png"

const drawerWidth = 350;
const { TabPane } = Tabs;



const StyledRating = withStyles((theme) => ({
  iconFilled: {
    color: '#E1C71D',
  },
  root: {
    '& .MuiSvgIcon-root': {
      color: 'currentColor',
    },
  },
  iconHover: {
    color: 'yellow',
  },
}))(Rating);

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: 300,
  },
  indeterminateColor: {
    color: '#f50057',
  },
  selectAllText: {
    fontWeight: 500,
  },
  selectedAll: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
  },
  root: {
    maxWidth: '90vw',
    width: '95%',
    margin: '20px auto',
    marginTop: theme.spacing(4),
    boxShadow: 'none',
  },
  media: {
    height: 240,
    objectFit: 'cover',
    width: '45%'
  },
  customFileUpload: {
    border: '1px solid black',
    padding: '6px 12px',

    cursor: 'pointer',
  },
  container: {
    maxHeight: '70vh',
    maxWidth: '90vw',
  },
  dividerColor: {
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  buttonColor: {
    color: `${theme.palette.secondary.main} !important`,
    backgroundColor: 'white',
  },
  buttonColor1: {
    color: `${theme.palette.primary.main} !important`,
    backgroundColor: 'white',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  tableCell: {
    color: theme.palette.secondary.main,
  },
  vl: {
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    height: '45px',
  },
  tickSize: {
    transform: "scale(2.0)",
  },
}));

const BlogWallRedirect = () => {
  const classes = useStyles();
  const themeContext = useTheme();
  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
  const token = data?.token;
  const user_level = data?.user_level;
  const user_id = JSON.parse(localStorage.getItem('ActivityManagement')) || {};
  const branch_update_user = JSON.parse(localStorage.getItem('ActivityManagementSession')) || {};
  const history = useHistory();
  const [periodData,setPeriodData] = useState([]);
  const [loading,setLoading]= useState(false);
  
  const handleBlogWriting = () => {
    history.push('/blog/studentview')
  }

  const handlePublicSpeaking = () => {
    history.push('/blog/publicspeaking')
  }


  useEffect(() =>{
    getActivitySession()
    ActvityLocalStorage()
  },[])

  const getActivitySession = () =>{
    setLoading(true)
    axios
    .post(`${endpoints.newBlog.activitySessionLogin}`,
    {},
      {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
          Authorization:`${token}`,
        },
      }
    )
    .then((response) => {
      // setBlogLoginId(response?.data?.result)
      localStorage.setItem(
        'ActivityManagementSession',
        JSON.stringify(response?.data?.result)
      );

      setLoading(false)
      
    })
    .catch((err) =>{

      console.log(err)
    }
    )
  }

  const ActvityLocalStorage = () => {
    setLoading(true)
    axios
      .post(
        `${endpoints.newBlog.activityWebLogin}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((response) => {
        // getActivitySession();

        localStorage.setItem(
          'ActivityManagement',
          JSON.stringify(response?.data?.result)
        );
        setLoading(false)
      });
  };

  const periodDataAPI = () => {
      setLoading(true)
      axiosInstance
        .get(`${endpoints.newBlog.blogRedirectApi}?type=student`, {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        })
        .then((result) => {
          setLoading(false)
          setPeriodData(result?.data?.result)
        })
        .catch((err) => {
          setLoading(false)
        })
    // }
  };

  useEffect(() =>{
    periodDataAPI()
  },[])



  const handleExplore = (data) => {
    if (data?.name == "Blog Activity") {
      handleBlogWriting()
    } else if (data?.name === "Public Speaking") {
      handlePublicSpeaking()
    } else {
    }
  }

  const getSubjectIcon = (value) => {
    switch(value) {
      case 'Blog Activity' :
        return image2;
      case 'Public Speaking' : 
        return image1;
      case 'Physical Activity' :
        return image2;
      case 'actiivtytype' : 
        return image1;
      default : 
          return ""
        
    }
  };


  return (
    <React.Fragment>
      <div>
      {loading && <Loader/>}
      <Layout>
        {''}
        <div className='row th-16 py-3 px-2'>
          <div className='col-md-8' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Activities Management
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className='row'>
            <div className='col-12' style={{ fontWeight: 'bold' }}>
              <Divider orientation="left" orientationMargin="0" style={{ fontSize: '22px' }}>Activities</Divider>
            </div>
            <div className='row p-3' style={{ height: 500, overflowY: 'scroll' }}>
              {
                periodData && periodData?.map((each,index) =>
                  // each?.data?.map((item) => (
                  <div className='col-md-4 pl-0 mt-2'>
                    <div
                      className='th-br-10 th-bg-grey dummy-background'
                    >
                      <div className='row p-3'>
                        <div className='col-4 th-br-5'>
                          <img
                            src={getSubjectIcon(each?.name)}
                            alt="Icon"
                            className='blog-redirect-card'
                          />
                        </div>
                        <div className='col-8'>
                          <div className='row -3 align-item-center th-black-1 '>
                            <div className='col-12 pl-0'>
                              <span className='th-18 th-fw-700 text-capitalize'>
                                {each?.name}
                              </span>
                              <p className='th-12 th-fw-200'>
                                {each?.count} Activity
                              </p>
                            </div>

                          </div>
                          <div className='row -3 th-bg-pink align-item-center th-br-5'>
                            <div className='col-12 pl-0'>
                              <span className='th-12 th-fw-500 ml-2 text-capitalize th-blue-1'>
                                Recently Added
                              </span>
                              <p className='th-12 th-fw-200 ml-2'>
                                {each?.title}
                              </p>
                            </div>

                          </div>
                          <div className='row -3 align-item-center'>
                            <div className='col-6 pl-0'>
                              <span className='th-12 th-fw-400 text-capitalize' style={{ color: 'grey' }}>
                                Last Updated
                              </span>
                              <p className='th-12 th-fw-200'>
                                {/* 2/04/2022, 5:30 PM */}
                                {moment(each?.last_update).format('ll')}
                              </p>
                            </div>
                            <div className='col-6 pl-0' style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '0px 0px' }}>
                              <Button type="primary"
                               onClick={() => handleExplore(each)}
                               >
                                Explore &gt;
                              </Button>
                            </div>

                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                )

              }
            </div>

          </div>

        </div>
      </Layout>

      </div>
    </React.Fragment>
  );
};
export default BlogWallRedirect;
