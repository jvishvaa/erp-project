import React, { useContext, useRef, useState, useEffect } from 'react';
import {
  Button,
  Grid,
  makeStyles,
  Paper,
  withStyles,
  useTheme,
  Box,
  Input,
  CardContent,
  CardMedia,
  CardActions,
  Card,
  Typography,
} from '@material-ui/core';
import { Autocomplete, Pagination } from '@material-ui/lab';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

import endpoints from 'config/endpoints';
import axios from 'axios';

import { Link, useHistory } from 'react-router-dom';

function TressurBox() {
  const { setAlert } = useContext(AlertNotificationContext);
  const [totalGenre, setTotalGenre] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [moduleId, setModuleId] = useState('');
  const limit = 8;
  const [data, setData] = useState('');
  const [totalVediosCount, setTotalVediosCount] = useState([]);
  const [totalViewsCount, setTotalViewsCount] = useState([]);
  const useStyles = makeStyles((theme) => ({
    root: theme.commonTableRoot,
    paperStyled: {
      minHeight: '80vh',
      height: '100%',
      padding: '50px',
      marginTop: '15px',
    },
    guidelinesText: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: theme.palette.secondary.main,
    },
    errorText: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#fe6b6b',
      marginBottom: '30px',
      display: 'inline-block',
    },
    cards: {
      minWidth: 275,
    },
    table: {
      minWidth: 650,
    },
    downloadExcel: {
      float: 'right',
      fontSize: '16px',
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
    tablePaginationSpacer: {
      flex: 0,
    },
    tablePaginationToolbar: {
      justifyContent: 'center',
    },
    cardsContainer: {
      width: '95%',
      margin: '0 auto',
    },
    tablePaginationCaption: {
      fontWeight: '600 !important',
    },
    tablePaginationSpacer: {
      flex: 0,
    },
    tablePaginationToolbar: {
      justifyContent: 'center',
    },
    guidelineval: {
      color: theme.palette.primary.main,
      fontWeight: '600',
    },
    guideline: {
      color: theme.palette.secondary.main,
      fontSize: '16px',
      padding: '10px',
    },
  }));
  const classes = useStyles({});
  const history = useHistory();
  const handleBack = () => {
    history.push('/subjectTrain');
  };
  const handleViewMore = (id) => {
    history.push('/tressureVedios');
    sessionStorage.setItem('tressureBoxid', id);
  };
  // const limit = 8;
  const getCardColor = (index) => {
    const colors = [
      '#54688c',
      '#f47a62',
      '#4a66da',
      '#75cba8',
      // "#f2bf5e"
    ];
    const diffColors = index % 4;
    return colors[diffColors];
  };

  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails?.personal_info?.token;
  const moduleData = udaanDetails?.role_permission?.modules;
  console.log(moduleData, 'module');
  const handlePagination = (event, page) => {
    setPageNumber(page);
  };
  useEffect(() => {
    if (moduleData && moduleData.length) {
      moduleData.forEach((item) => {
        console.log(item.module, 'module Ids');
        if (item.module_name === 'Notification') {
          setModuleId(item.module);
        }
      });
    }
  }, []);
  useEffect(() => {
    console.log(udaanToken, moduleId, 'token');
    if (udaanToken && moduleId) {
      axios
        .get(
          endpoints.sureLearning.sendNotificationAPI +
            `?page_size=${limit}&page=${pageNumber}`,
          {
            headers: {
              Authorization: `Bearer ${udaanToken}`,
              module: moduleId,
            },
          }
        )
        .then((res) => {
          console.log(res.data.results, 'pagination');
          console.log(res.data.total_pages, 'pagination');

          setTotalGenre(res.data.total_pages);
          setData(res.data.results);
        })
        .catch((error) => {
          setAlert('error', 'Something Wrong!');
        });
    }
  }, [moduleId, pageNumber]);

  return (
    <Layout>
      <div>
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName='Notifications'
          isAcademicYearVisible={true}
        />
       
        <Grid container direction='row' style={{ paddingTop: '20px' }}>
         
            <Grid item md={3} xs={1} />
            <Grid item md={6} xs={10}>
              {data &&
                data.map((item, id) => {
                  return (
                    <Card variant='outlined' key={id}>
                    <CardContent>
                      <Typography variant='span' gutterBottom>
                       <strong> {item.send_by.username}</strong>
                      </Typography>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <Typography variant='span' style={{ fontSize: 12,float: 'right'}}>
                        {item.send_date}
                      </Typography>
                      <Typography variant='h5' component='h2' style={{ float: 'center'}}>
                        {item.text}
                      </Typography>
                      <Typography variant='body2' component='p' />
                    </CardContent>
                  </Card>
                  );
                })}
             
            </Grid>
            <Grid item md={3} xs={1} />
         

          <Grid container justify='center'>
            {/* {pageNumber > 1 && ( */}
            <Pagination
              onChange={handlePagination}
              count={totalGenre}
              color='primary'
              page={pageNumber}
            />
            {/* )} */}
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
}

export default TressurBox;
