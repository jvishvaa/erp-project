import React, { useEffect, useState, useContext, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { styled } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import './viewClassParticipate.scss';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import {
  TableCell,
  TableBody,
  TableHead,
  Table,
  TableRow,
  TableContainer,
} from '@material-ui/core';
import { alpha } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Dialog from '@material-ui/core/Dialog';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { useParams, withRouter } from 'react-router-dom';
import Layout from '../../Layout';
import axiosInstance from 'config/axios';
import Pagination from 'components/PaginationComponent';
import CloseIcon from '@material-ui/icons/Close';
import AddScoreDialog from './addScoreDialog';
import Loader from '../../../components/loader/loader';
import endpoints from 'config/endpoints';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';


const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#EEEEEE',
    color: theme.palette.common.black,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },

  navcontent: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },

  closebutton: {
    padding: theme.spacing(2),
    textAlign: 'end',
  },

  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '50ch',
    },
    border: '1px solid #77787a',
    borderRadius: '5px',
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.primary,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  const classes = useStyles();
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      padding: '5px !important',
      backgroundColor: '#E7EFF6',
    },
    '&:nth-of-type(even)': {
      padding: '5px !important',
      backgroundColor: '#E6E6E6',
    },
  },
  table: {
    minWidth: 1120,
  },
}))(TableRow);

const debounce = (fn, delay) => {
  let timeoutId;
  return function(...args) {
    clearInterval(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

const ViewClassParticipate = withRouter(({ history, ...props }) => {
  const { id } = useParams();
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [confirmBox,setConfirmBox] = useState(false)
  const [selectedValue, setSelectedValue] = React.useState('Hello');
  const [loading, setLoading] = useState(false);
  const [checkedPresent, setCheckedPresent] = useState(false);
  const [classParticipant, setClassParticipant] = useState([]);
  const limit = 15;
  const { setAlert } = useContext(AlertNotificationContext);
  const [totalGenre, setTotalGenre] = useState(0);
  const [count, setCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [currentId, setCurrentId] = useState();
  const [studentName, setStudentName] = useState();
  const [score, setScore] = useState();
  const [isNewSearch, setIsNewSearch] = useState(false);
  const [effCall, setEffCall] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [remark, setRemark] = useState('');
  const handleStudentList = () => {
    setLoading(true);
    axiosInstance
      .get(`/period/${id}/attendance-list/?page=${pageNumber}&page_size=${limit}`)
      .then((res) => {
        if (res.data.status_code === 200) {
          setClassParticipant(res?.data?.result?.results);
          setTotalGenre(res?.data?.result?.count);
          setAlert('success', res?.data?.message);
          setCount(res?.data?.result?.count);
          setLoading(false);
        } else {
          setAlert('error', res?.data?.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        setAlert('error', err?.message);
        setLoading(false);
      });
  };

const handleSearch = () => {
    axiosInstance
    .get(`/period/${id}/attendance-list/?name=${searchName}`)
    .then((res) => {
      if (res.data.status_code === 200) {
        setClassParticipant(res?.data?.result?.results);
        setTotalGenre(res?.data?.result?.count);
        setAlert('success', res?.data?.message);
        setCount(res?.data?.result?.count);
      } else {
        setAlert('error', res?.data?.message);
      }
    })
    .catch((err) => {
      setAlert('error', err?.message);
    });
  };
  
  
  const debounceCallback = useCallback(
    debounce(value => {
      setIsNewSearch(true);
    }, 500),
    []
  );

  useEffect(()=> {
    setIsNewSearch(false);
    if (isNewSearch){
    handleSearch();
    }
  },[isNewSearch])

  useEffect(() => {
    handleStudentList();
  }, [pageNumber, effCall, history]);

  const setStudentScore = (val) => {
    setScore(val);
  };

  const handleSearchBar = (event) => {
    let search = event.target.value;
    setSearchName(event.target.value);
    if(search.length) {
      debounceCallback(search);
    }
    else {
      setIsNewSearch(false);
    }
  };

  const setStudentRemark = (val) => {
    setRemark(val);
  };

  const updateFlag = () => {
    setEffCall(!effCall);
  };
  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  const handleback = () => {
    history.goBack();
  };


  const handleConfirmSubmit = () => {
    confirmAttendance();
    setConfirmBox(false);
  }

  const dialogeClose = () =>{
    setConfirmBox(!confirmBox)
  }

  const confirmAttendance = () => {
    setLoading(true);
    const confirmData = { is_cp_confirmed : true }
    axiosInstance
      .put(
        `${endpoints.period.confirmAttendance}${id}/confirm-attendance`, confirmData)
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setAlert('success', result?.data?.message);
          setCheckedPresent(!checkedPresent);

        } else {
          setAlert('error', result?.data?.message);

        }
        setLoading(false);
      })
      .catch((error) => {
        setAlert('error', error?.message);
        setLoading(false);
      });
  };

  return (
    <Layout>
      {loading && <Loader />}
      <Toolbar>
        <div className={classes.root}>
          <Grid container spacing={3} style={{ backgroundColor: 'rgb(250,250,250)' }}>
            <Grid item xs={3}>
              <Typography className={classes.title1} variant='h6' noWrap>
                Class Participation
              </Typography>
            </Grid>
            <Grid item xs={6} justify='center' style={{display:"flex",flexDirection:"flex-end"}} className={classes.navcontent}>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder='Search Student'
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ 'aria-label': 'search' }}
                  onChange={handleSearchBar}
                />
              </div>
              <Button onClick={()=> setConfirmBox(!confirmBox)} size='small'>
                Confirm
              </Button>
            </Grid>
            <Grid item xs={3} className={classes.closebutton}>
              <CloseIcon onClick={handleback} style={{ cursor: 'pointer' }} />
            </Grid>
          </Grid>
        </div>
      </Toolbar>
      <Grid container spacing={3}>
        <Grid item={12} xs={12} sm={12} md={12} spacing={1}>
          <h5 style={{ paddingLeft: '10ch' }}>Period 3</h5>
          <hr />
          <TabPanel value={value} index={0}>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label='customized table'>
                <TableHead>
                  <TableRow>
                    <StyledTableCell
                      align='left'
                      style={{ display: 'flex', justifyContent: 'start' }}
                    >
                      Student Name
                    </StyledTableCell>
                    <StyledTableCell align='right'>Score</StyledTableCell>
                    <StyledTableCell align='right'>Remarks</StyledTableCell>
                    <StyledTableCell align='right'></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {classParticipant?.map((row, index) => (
                    <>
                      <div style={{ margin: 5, background: 'red' }}></div>
                      <StyledTableRow key={row.name}>
                        <StyledTableCell component='th' scope='row'>
                          <div style={{ display: 'flex', position: 'center' }}>
                            <AccountCircleIcon />
                            <div style={{ paddingLeft: 10 }}>
                              <h5 style={{ display: 'flex', justifyContent: 'start' }}>
                                {row?.name}
                              </h5>
                              <h5 style={{ display: 'flex', justifyContent: 'start' }}>
                                Erp ID: {row?.erp_id}
                              </h5>
                            </div>
                          </div>
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          {row?.participant?.cp_marks}
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          {!row.participant.cp_marks ? (
                            <span
                              style={{ cursor: 'pointer', color: 'red' }}
                              onClick={() => {
                                setOpen(true);
                                setCurrentId(row?.participant?.erp_id);
                                setStudentName(row.name);
                                setScore(0);
                                setRemark('');
                              }}
                            >
                              Add Remarks and Score
                            </span>
                          ) : (
                            row.participant.cp_remarks
                          )}
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          {row.participant.cp_marks ? (
                            <BorderColorIcon
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                setOpen(true);
                                setCurrentId(row.participant.erp_id);
                                setStudentName(row.name);
                                setScore(row.participant.cp_marks);
                                setRemark(row?.participant?.cp_remarks);
                              }}
                            />
                          ) : (
                            ''
                          )}
                        </StyledTableCell>
                      </StyledTableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <Grid container justify='center'>
            {classParticipant && totalGenre > 9 && (
              <Pagination
                totalPages={Math.ceil(totalGenre / limit)}
                currentPage={pageNumber}
                setCurrentPage={setPageNumber}
              />
            )}
          </Grid>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingLeft: 30,
              paddingRight: 30,
            }}
          >
            <h4>Total: {count} Students </h4>
          </div>
        </Grid>
        <AddScoreDialog
          periodId={id}
          selectedValue={selectedValue}
          open={open}
          onClose={handleClose}
          studentId={currentId}
          nameStudent={studentName}
          studentScore={score}
          updateScore={setStudentScore}
          flagprop={updateFlag}
          studentRemark={remark}
          handlestudentRemark={setStudentRemark}
        />
      </Grid>
      <Dialog open={confirmBox} onClose={dialogeClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" >Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you really want to lock the class participation for period {id} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={dialogeClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmSubmit} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
});

export default ViewClassParticipate;
