import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import { Grid, useTheme, SvgIcon, Card, IconButton, Popover, MenuList, MenuItem, Button, Typography } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Layout from '../../Layout';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import Loading from '../../../components/loader/loader';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import noimg from '../../../assets/images/book-icon.jpg';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: '-10px auto',
    boxShadow: 'none',
  },
  container: {
    maxHeight: '70vh',
    width: '100%',
  },
}));


const AllBooksPage = ()  => {
  const history = useHistory();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [booksData, setBooksData] = useState([])

  useEffect(() => {
    setLoading(true);
    axiosInstance
    .get(`${endpoints.ibook.studentBook}`)
    .then((result) => {
      if (result.data.status_code === 200) {
        setBooksData(result.data.result.result);
        setLoading(false);
      } else {
        setLoading(false);
        setAlert('error', result.data.message);
      }
    })
    .catch((error) => {
      setLoading(false);
      setAlert('error', error.message);
    });
  
  }, [])

  const handleBookOpen = (item) =>{
    history.push(`/intelligent-book/${item?.id}/${item?.book_uid}/${item?.local_storage_id}`)
    // history.push(`/intelligent-book/91/1602923626_13_13_82/urnuuid4e29c6a7-972b-1929-3b6a-728582b4871f`)
  }

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div>
          <div style={{ width: '95%', margin: '20px auto' }}>
            <CommonBreadcrumbs componentName='Intellligent Book' childComponentName='Books' />
          </div>
        </div>
        <Paper className={classes.root}>
          <Grid
            container
            style={
              isMobile
                ? { width: '95%', margin: '20px auto' }
                : { width: '100%', margin: '20px auto' }
            }
            spacing={5}
          >
          

              {booksData && booksData.map((item, index) => {
                return (
                  <Grid item md={3} xs={12} key={item?.id}>
                    <Grid container spacing={2}>
                      <Grid item md={12} xs={12}>
                        <Card
                          style={{
                            width: '100%',
                            height: '160px',
                            borderRadius: 10,
                            padding: '5px',
                            boxShadow: '1px 1px 8px #c3c3c3',
                            backgroundColor: item?.ebook_type === '2' ? '#fefbe8' : '',
                          }}
                        >
                          <Grid container spacing={2}>
                            <Grid item md={6} xs={6}>
                              <img
                                src={noimg}
                                alt='crash'
                                width='100%'
                                height='150px'
                                style={{
                                  borderRadius: '8px',
                                  // border: '1px solid lightgray',
                                }}
                              />
                            </Grid>
                            <Grid item md={6} xs={6} style={{ textAlign: 'left' }}>
                              <Grid container spacing={1}>
                                <Grid
                                  item
                                  md={12}
                                  xs={12}
                                  style={{
                                    padding: '0px 10px',
                                    margin: '0px',
                                    textAlign: 'right',
                                  }}
                                >

                                </Grid>
                                <Grid item md={12} xs={12}>
                                  <Typography
                                    title='wings'
                                    className={classes.textEffect}
                                    style={{
                                      fontSize: '16px',
                                      fontWeight: 'bold',
                                      color: '#014B7E',
                                      marginTop: '15px',
                                    }}
                                  >
                                    {item.book_name}
                                  </Typography>
                                </Grid>

                                <Grid item md={12} xs={12}>
                                  <Typography
                                    style={{ fontSize: '10px', color: '#042955',margin: '10px 0', }}
                                  >
                                    Publication on &nbsp; {item?.Publication_date}

                                  </Typography>
                                </Grid>
                                <Grid item md={12} xs={12}>
                                  <Button
                                    size='small'
                                    color='primary'
                                    variant='contained'
                                    style={{
                                      width: '100px',
                                      height: '25px',
                                      fontSize: '15px',
                                      borderRadius: '6px',
                                    }}
                                   onClick={() => handleBookOpen(item)}
                                  >
                                    Read
                                </Button>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                )
                })}

          
          </Grid>
        </Paper>
      </Layout>
    </>
  );
};

export default AllBooksPage;
