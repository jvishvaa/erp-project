import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
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
// import './AllBooksPage.css';
import Loading from '../../../components/loader/loader';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import noimg from '../../../assets/images/book-icon.jpg';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import moment from 'moment';
import Filter from '../filter.jsx';
import { Close } from '@material-ui/icons';
import ViewBook from '../chapterpage/ViewBook';

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
  textEffect : {
    fontSize: '16px',
    fontWeight: 'bold',
    color: theme.palette.secondary.main,
    marginTop: '15px',
  }
}));

const AllBooksPage = () => {
  const history = useHistory();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [booksData, setBooksData] = useState([]);
  const [totalPages, setTotalPages] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const limit = 8;
  const [clearFilter, setclearFilter] = useState('');
  const [acadmicYear, setAcadmicYear] = useState('');
  const [branch, setBranch] = useState('');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [volume, setVolume] = useState('');

  const [open, setOpen] = useState(false);
  const [bookImage, setBookImage] = useState(
    // 'https://erp-revamp.s3.ap-south-1.amazonaws.com/dev/ibooks/'
    // 'https://d3ka3pry54wyko.cloudfront.net/dev/ibooks/'
    // 'https://erp-revamp.s3.ap-south-1.amazonaws.com/'
    'https://d3ka3pry54wyko.cloudfront.net/'

  );
  const [bookId, setbookId] = useState('');
  const [chapterId, setchapterId] = useState('');
  const [bookUid, setbookUid] = useState('');
  const [localStorageName, setlocalStorageName] = useState('');
  const [environment, setenvironment] = useState('');
  const [type, settype] = useState('');
  const [bookName, setbookName] = useState('')

  const getDomainName = () => {
    let token = JSON.parse(localStorage.getItem('userDetails')).token || {};
    const { host } = new URL(axiosInstance.defaults.baseURL); // "dev.olvorchidnaigaon.letseduvate.com"
    const hostSplitArray = host.split('.');
    const subDomainLevels = hostSplitArray.length - 2;
    let domain = '';
    let subDomain = '';
    let subSubDomain = '';
    if (hostSplitArray.length > 2) {
      domain = hostSplitArray.slice(hostSplitArray.length - 2).join('');
    }
    if (subDomainLevels === 2) {
      subSubDomain = hostSplitArray[0];
      subDomain = hostSplitArray[1];
    } else if (subDomainLevels === 1) {
      subDomain = hostSplitArray[0];
    }
    return subDomain;
  };

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(
        `${
          endpoints.ibook.studentBook
        }?domain_name=${getDomainName()}&page=${pageNo}&page_size=${limit}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setBooksData(result.data.result.result);
          setTotalPages(Math.ceil(result.data.result.count / limit));

          console.log(Math.ceil(result.data.result.count / limit), 'pagination');
          if (result?.data.result?.result[0]?.path === 'prod/ibooks/') {
            // setBookImage('https://erp-revamp.s3.ap-south-1.amazonaws.com/prod/ibooks/');
            // setBookImage('https://erp-revamp.s3.ap-south-1.amazonaws.com/');
            setBookImage('https://d3ka3pry54wyko.cloudfront.net/');

          }
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
  const handlePagination = (event, page) => {
    setPageNo(page);
  };

  const handleBookOpen = (item) => {
    // history.push(
    //   `/intelligent-book/${item?.id}/${item?.book_uid}/${item?.local_storage_id}/${item?.path}`
    // );
   
    console.log('item111',item)

    const path = item?.path.split("/")

    setbookId(item?.id);
    setchapterId();
    setbookName(item.book_name);
    setbookUid(item?.book_uid);
    setlocalStorageName(item?.local_storage_id);
    setenvironment(path[0]);
    settype(path[1]);
    setOpen(true);

  };

  const handleFilter = (acad, branch, grade, sub, vol) => {
    setAcadmicYear(acad);
    setBranch(branch);
    setGrade(grade);
    setSubject(sub);
    setVolume(vol);
    getEbook(acad, branch, grade, sub, vol);
  };

  const getEbook = (acad, branch, grade, subject, vol) => {
    const filterAcad = `${acad ? `&academic_year=${acad?.id}` : ''}`;
    const filterBranch = `${branch ? `&branch=${branch}` : ''}`;
    const filterGrade = `${grade ? `&grade=[${grade?.central_grade}]` : ''}`;
    const filterSubject = `${subject ? `&subject=${subject?.central_subject}` : ''}`;
    const filterVolumes = `${vol ? `&volume=${vol?.id}` : ''}`;

    setLoading(true);
    axiosInstance
      .get(
        `${
          endpoints.ibook.studentBook
        }?domain_name=${getDomainName()}&page=${pageNo}&page_size=${limit}${filterBranch}${filterGrade}${filterSubject}${filterVolumes}`
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
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <Grid container spacing={2}>
          <Grid item md={12} xs={12} style={{ textAlign: 'left' }}>
            <CommonBreadcrumbs
              componentName='Intelligent Book'
              childComponentName='Books'
              isAcademicYearVisible={true}
            />
          </Grid>
          <Grid item md={12} xs={12} style={{ margin: '10px 0px' }}>
            <Filter handleFilter={handleFilter} clearFilter={clearFilter} />
          </Grid>
        </Grid>

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
            {booksData &&
              booksData.map((item, index) => {
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
                                src={`${bookImage}${item.path}${item.book_image}`}
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
                                  >
                                    {item.book_name}
                                  </Typography>
                                </Grid>

                                <Grid item md={12} xs={12}>
                                  <Typography
                                  color="secondary"
                                    style={{
                                      fontSize: '9px',
                                      margin: '10px 0',
                                    }}
                                  >
                                    Publication on:{' '}
                                    {`${moment(item?.created_at).format('MM-DD-YYYY')}`}
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
                                      color : "white"
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
                        <Close style={{ color: 'white' }} onClick={handleClose} /> &nbsp;{' '}
                        <span onClick={handleClose} style={{ fontSize: '17px' }}>
                          Close
                        </span>
                      </IconButton>
                    </Grid>
                    <Grid item xs={4} sm={4} md={4}>
                      <div className='subject-name'>
                        <h2 style={{ 'text-transform': 'capitalize' }}>{bookName}</h2>
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </AppBar>

              <ViewBook
                bookId={bookId}
                chapterId={chapterId}
                bookUid={bookUid}
                localStorageName={localStorageName}
                environment={environment}
                type={type}
              />
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

export default AllBooksPage;
