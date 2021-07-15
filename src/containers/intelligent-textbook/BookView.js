import React, { useState } from 'react';
import Layout from 'containers/Layout';
import FilterFilledIcon from '../../components/icon/FilterFilledIcon';
import {
  Grid,
  TextField,
  Button,
  withStyles,
  makeStyles,
  Divider,
  Typography,
  Tab,
  Card,
  IconButton,
} from '@material-ui/core';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import kid from '../../assets/images/kid.png';
import './bookviewstyles.css';
function TabPanel(props) {
  const { children, value, index, ...other } = props;

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

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    flexGrow: 1,
    // backgroundColor: theme.palette.background.paper,
  },
  textEffect: {
    overflow: 'hidden',
    display: '-webkit-box',
    maxWidth: '100%',
    '-webkit-line-clamp': '3',
    '-webkit-box-orient': 'vertical',
    textOverflow: 'ellipsis',
    margin: '0%',
    padding: '0%',
    height: '65px !important',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
}));

function BookView() {
  const classes = useStyles({});
  const [acadList, setAcadList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [selectedAcad, setSelectedAcad] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [value, setValue] = React.useState(0);
  const [showMenu, setShowMenu] = useState(false);

  const handlePeriodMenuOpen = () => {
    setShowMenu(true);
  };
  const handlePeriodMenuClose = () => {
    setShowMenu(false);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClear = () => {
    // handleFilter();
    setSelectedAcad('');
    setGradeList([]);
    setSubjectList([]);
    setSelectedGrade('');
    setSelectedSubject('');
  };

  return (
    <>
      <Layout>
        <div>
          <Grid container spacing={2}>
            <Grid item md={12} xs={12} style={{ textAlign: 'left' }}>
              <CommonBreadcrumbs
                componentName='Intelligent Book'
                childComponentName='View Ibook'
              />
            </Grid>
            <Grid container spacing={2} style={{ padding: '5px 10px' }}>
              <Grid item md={3} xs={12}>
                <TextField
                  id='outlined-helperText'
                  label='Search_Book'
                  defaultValue=''
                  variant='outlined'
                  style={{ width: '100%' }}
                  className='dropdownIcon'
                  inputProps={{ maxLength: 100 }}
                  //   onChange={(event, value) => {
                  //     handleTitleChange(event);
                  //   }}
                  color='secondary'
                  size='small'
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  className='dropdownIcon'
                  // onChange={(event, value) => {
                  //   if (value) {
                  //     withAxiosInstance(
                  //       `${endpoints.communication.branches}?session_year=${
                  //         value?.id
                  //       }&module_id=${getModuleInfo('Ebook View').id}`,
                  //       'branch'
                  //     );
                  //   }
                  //   setSelectedAcad(value);
                  //   setSelectedGrade('');
                  //   setSelectedSubject('');
                  //   setSelectedBranch('');
                  // }}
                  id='Acad_id'
                  // options={acadList}
                  // value={selectedAcad}
                  // getOptionLabel={(option) => option.session_year}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Academic Year'
                      required
                      placeholder='Academic Year'
                    />
                  )}
                />
              </Grid>

              <Grid item md={3} xs={12}>
                <Autocomplete
                  size='small'
                  // onChange={(event, value) => {
                  //   if (value) {
                  //     withAxiosInstance(
                  //       `${endpoints.ebook.EbookMappedGrade}?branch_id=${selectedBranch.branch.id}&grade_id=${value.erp_grade}`,
                  //       'subject'
                  //     );
                  //   }
                  //   setSelectedGrade(value);
                  //   setSelectedSubject('');
                  // }}
                  className='dropdownIcon'
                  style={{ width: '100%' }}
                  id='grade'
                  // options={gradeList}
                  // value={selectedGrade}
                  // getOptionLabel={(option) => option?.erp_grade_name || ''}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Grades'
                      placeholder='Grades'
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <Autocomplete
                  size='small'
                  // onChange={(event, value) => {
                  //   setSelectedSubject(value);
                  // }}
                  className='dropdownIcon'
                  style={{ width: '100%' }}
                  id='subject'
                  // options={subjectList}
                  // getOptionLabel={(option) =>
                  //   (option &&
                  //     option.subject_id_name &&
                  //     option.subject_id_name[0] &&
                  //     option.subject_id_name[0].erp_sub_name) ||
                  //   ''
                  // }
                  // value={selectedSubject}
                  // getOptionLabel={(option) => option?.erp_sub_name||''}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Subject'
                      placeholder='Subject'
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <Autocomplete
                  size='small'
                  // onChange={(event, value) => {
                  //   setSelectedSubject(value);
                  // }}
                  className='dropdownIcon'
                  style={{ width: '100%' }}
                  id='subject'
                  // options={subjectList}
                  // getOptionLabel={(option) =>
                  //   (option &&
                  //     option.subject_id_name &&
                  //     option.subject_id_name[0] &&
                  //     option.subject_id_name[0].erp_sub_name) ||
                  //   ''
                  // }
                  // value={selectedSubject}
                  // getOptionLabel={(option) => option?.erp_sub_name||''}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Status'
                      placeholder='Status'
                      required
                    />
                  )}
                />
              </Grid>

              <Grid item md={9}></Grid>

              <Grid item md={3} xs={12}>
                <Grid container spacing={2}>
                  <Grid item md={6} xs={6}>
                    <Button
                      size='medium'
                      fullWidth
                      onClick={() => handleClear()}
                      variant='contained'
                    >
                      Clear All
                    </Button>
                  </Grid>
                  <Grid item md={6} xs={6}>
                    <Button
                      startIcon={<FilterFilledIcon />}
                      style={{ color: 'white' }}
                      size='medium'
                      variant='contained'
                      color='primary'
                      fullWidth
                      // onClick={() =>
                      //   handleFilter(
                      //     selectedAcad,
                      //     selectedBranch?.branch?.id,
                      //     selectedGrade,
                      //     selectedSubject,
                      //     selectedVolume
                      //   )
                      // }
                    >
                      Filter
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <Divider />
              </Grid>
            </Grid>
          </Grid>
          <Grid>
            <Tabs
              indicatorColor='primary'
              textColor='primary'
              value={value}
              onChange={handleChange}
              aria-label='simple tabs example'
            >
              <Tab label='All' {...a11yProps(0)} />
              <Tab label='Activated' {...a11yProps(1)} />
              <Tab label='Pending' {...a11yProps(2)} />
            </Tabs>

            <TabPanel value={value} index={0}>
              All
            </TabPanel>
            <TabPanel value={value} index={1}>
              Activated
            </TabPanel>
            <TabPanel value={value} index={2}>
              Pending
            </TabPanel>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12}>
                <Card
                  style={{
                    width: '80%',
                    height: '170px',
                    borderRadius: 10,
                    padding: '5px',
                    // backgroundColor: item?.ebook_type === '2' ? '#fefbe8' : '',
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item md={5} xs={6}>
                      <Grid item md={5} xs={6}>
                        <img
                          src={kid}
                          alt='crash'
                          width='145%'
                          style={{ borderRadius: '8px', border: '1px solid lightgray' }}
                        />
                      </Grid>
                    </Grid>
                    <Grid item md={7} xs={6}>
                      <Grid container spacing={1}>
                        <Grid item md={12} xs={12}>
                          {/* <IconButton
                            aria-label='more'
                            style={{ float: 'right' }}
                            onClick={() => handlePeriodMenuOpen()}
                            onMouseLeave={handlePeriodMenuClose}
                          >
                            <MoreHorizIcon color='primary' />
                          </IconButton>
                          <div className='tooltipContainer'>
                            <span className='tooltiptext'>
                              <div>Edit</div>
                              <div>Delete</div>
                            </span>
                          </div> */}
                          <Box>
                            <span
                              className='period_card_menu'
                              onClick={() => handlePeriodMenuOpen()}
                              onMouseLeave={handlePeriodMenuClose}
                              style={{ float: 'right' }}
                            >
                              <IconButton className='moreHorizIcon' color='primary'>
                                <MoreHorizIcon />
                              </IconButton>
                              {showMenu ? (
                                <div className='tooltipContainer'>
                                  <span className='tooltiptext'>
                                    {/* <div onClick={(e) => handleDelete(period)}>Delete</div> */}
                                    <div>Edit</div> <div></div>
                                    <div>Delete</div>
                                    {/* <Dialog
                                      open={deleteAlert}
                                      onClose={handleDeleteCancel}
                                    >
                                      <DialogTitle
                                        style={{ cursor: 'move', color: '#014b7e' }}
                                        id='draggable-dialog-title'
                                      >
                                        Delete Question
                                      </DialogTitle>
                                      <DialogContent>
                                        <DialogContentText>
                                          Are you sure you want to delete ?
                                        </DialogContentText>
                                      </DialogContent>
                                      <DialogActions>
                                        <Button
                                          onClick={handleDeleteCancel}
                                          className='labelColor cancelButton'
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          color='primary'
                                          onClick={(e) => handleDeleteConfirm(period)}
                                        >
                                          Confirm
                                        </Button>
                                      </DialogActions>
                                    </Dialog> */}
                                  </span>
                                </div>
                              ) : null}
                            </span>
                          </Box>
                          <Typography
                            // title={item && item.ebook_name}
                            title='Wings'
                            className={classes.textEffect}
                            style={{
                              fontSize: '14px',
                              fontWeight: 'bold',
                              color: '#014B7E',
                              marginTop: '15px',
                              marginRight: '2px',
                            }}
                          >
                            {/* {item && item.ebook_name} */}
                            {'wings'}
                          </Typography>
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <Typography
                            // title={
                            //   item &&
                            //   item.updated_at &&
                            //   new Date(item.updated_at).toLocaleDateString()
                            // }
                            title='Wings of fire'
                            style={{ fontSize: '10px', color: '#042955' }}
                          >
                            Publication on&nbsp;
                            {/* {item &&
                              item.updated_at &&
                              new Date(item.updated_at).toLocaleDateString()} */}
                            June 22
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
                              color: 'white',
                            }}
                            // onClick={() => handleClickOpen(item)}
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
        </div>
      </Layout>
    </>
  );
}

export default BookView;
