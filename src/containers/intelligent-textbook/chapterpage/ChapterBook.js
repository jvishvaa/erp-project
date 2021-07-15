import React, { useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import {
  Grid,
  useTheme,
  SvgIcon,
  Card,
  IconButton,
  Popover,
  MenuList,
  MenuItem,
  Button,
  Typography,
  Dialog,
  AppBar,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Layout from '../../Layout';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import './ChapterBook.css';
import Loading from '../../../components/loader/loader';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import noimg from '../../../assets/images/Chapter-icon.png';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Close } from '@material-ui/icons';

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

const ChapterBook = (props) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [booksData, setBooksData] = useState([]);
  const [open, setOpen] = useState(false);
  const [iframeSrc, setiframeSrc] = useState('');
  const { match: { params: { bookId, bookUid, localStorageName } } = {} } = props;
  const dispatch = useDispatch();
  const [chapterId, setChapterId] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const limit = 8;
  let bookUrl = `${bookUid}/index.html#/reader/chapter/`;

  const handlePagination = (event, page) => {
    setPageNo(page);
    // console.log(page, 'Page');
  };

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(
        `${endpoints.ibook.studentBook}?book=${bookId}&page=${pageNo}&page_size=${limit}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setBooksData(result.data.result.result);
          setTotalPages(Math.ceil(result.data.result.count / limit));
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
  }, [pageNo]);

  const handleClose = () => {
    setOpen(false);
    // setSelectedItem('');
  };

  const handleClickOpen = (item) => {
    setChapterId(item?.chapter_editor_id);
    setOpen(true);
  };

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div>
          <div style={{ width: '95%', margin: '20px auto' }}>
            <CommonBreadcrumbs
              componentName='Intellligent Book'
              childComponentName='chapter'
            />
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
            spacing={3}
          >
            {booksData &&
              booksData.map((item, index) => {
                return (
                  <Grid item md={3} xs={12} key={item?.id}>
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
                            ></Grid>
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
                                {item.chapter_name}
                              </Typography>
                            </Grid>

                            <Grid item md={12} xs={12}>
                              <Typography
                                style={{
                                  fontSize: '10px',
                                  color: '#042955',
                                  margin: '10px 0',
                                }}
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
                                onClick={() => handleClickOpen(item)}
                              >
                                Read
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
        </Paper>
        <Dialog
          fullScreen
          open={open}
          // onClose={handleClose}
          style={{ zIndex: '10000' }}
          // TransitionComponent={Transition}
        >
          <Grid container>
            <Grid item sm={12}>
              <AppBar>
                <div className={classes.root}>
                  <Grid container spacing={2}>
                    <Grid item xs={4} sm={4} md={4} style={{ paddingLeft: 30 }}>
                      <IconButton
                        color='inherit'
                        aria-label='Close'
                        style={{ color: 'white' }}
                      >
                        <Close onClick={handleClose} /> &nbsp;{' '}
                        <span onClick={handleClose} style={{ fontSize: '17px' }}>
                          Close
                        </span>
                      </IconButton>
                    </Grid>
                    <Grid item xs={4} sm={4} md={4}>
                      <div className='subject-name'>
                        <h2 style={{ 'text-transform': 'capitalize' }}>iBook</h2>
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </AppBar>

              {console.log(
                `https://erp-revamp.s3.ap-south-1.amazonaws.com/media/${bookUrl}${chapterId}?vi=0`,
                'bookurl'
              )}
              <iframe
                src={`http://35.154.221.179:3000/1606380603_17_2_85/index.html#/reader/chapter/2?vi=0`}
                // src={`https://plantanatomy.kotobee.com/#/reader`}
                // src={`https://erp-revamp.s3.ap-south-1.amazonaws.com/media/${bookUrl}${chapterId}?vi=0`}
                id='bookReader'
                className='bookReader'
                style={{ width: '100%', height: '625px', margin: 'auto', paddingTop: 50 }}
                title='Tutorials'
              ></iframe>
            </Grid>
          </Grid>
        </Dialog>
        {booksData && (
          <Grid item xs={12} md={12} style={{ textAlign: 'center' }}>
            <Pagination
              onChange={handlePagination}
              count={totalPages}
              color='primary'
              page={pageNo}
              style={{ paddingLeft: '45%' }}
            />
          </Grid>
        )}
      </Layout>
    </>
  );
};

export default ChapterBook;
