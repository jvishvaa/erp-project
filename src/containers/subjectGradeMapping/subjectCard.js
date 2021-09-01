import React, { useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Button, IconButton, withStyles, Popover, SvgIcon } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Viewmore from './viewmore';
import useStyles from './useStyles';
import unfiltered from '../../assets/images/unfiltered.svg';
import { withRouter, Link } from 'react-router-dom';
import axiosInstance from '../../config/axios';
import Chip from '@material-ui/core/Chip';
import endpoints from '../../config/endpoints';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import './subjectgrademapping.scss';

const Subjectcard = (props) => {
  const classes = useStyles();
  const [isSubjectOpen, setIsSubjectOpen] = React.useState(false);
  const [viewMoreList, setViewMoreList] = React.useState([]);
  const { setAlert } = useContext(AlertNotificationContext);

  const { schoolGsMapping, updateDeletData, setFilters } = props;

  const handleViewMore = (view) => {
    setIsSubjectOpen(true);
    setViewMoreList(view);
  };

  const callDelete = (id, index) => {
    axiosInstance
      .delete(`${endpoints.mappingStudentGrade.delete}/${id}/delete-mapping-details/`)
      .then((res) => {
        updateDeletData(schoolGsMapping, index);
        setAlert('success', 'Successfully Deleted');
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Confirm Popover
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showMenu, setShowMenu] = React.useState(false);
  const [showPeriodIndex, setShowPeriodIndex] = React.useState();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handlePeriodMenuOpen = (index, id) => {
    setShowMenu(true);
    setShowPeriodIndex(index);
  };

  const handlePeriodMenuClose = (index) => {
    setShowMenu(false);
    setShowPeriodIndex();
  };

  return (
    <>
      <Grid
        item
        md={12}
        xs={10}
        style={{ display: 'flex', flexWrap: 'wrap', marginTop: 20 }}
      >
        {setFilters && schoolGsMapping.length === 0 && (
          <Grid container spacing={2} style={{ textAlign: 'center', marginTop: '20px' }}>
            <Grid item md={12} xs={12}>
              <div className={classes.periodDataUnavailable}>
                <SvgIcon component={() => <img src={unfiltered} alt='crash' />} />
                <Typography variant='h6' color='secondary'>
                  NO DATA FOUND
                </Typography>
              </div>
            </Grid>
          </Grid>
        )}
        {schoolGsMapping &&
          schoolGsMapping.length > 0 &&
          schoolGsMapping.map((list, index) => {
            return (
              <Paper className={classes.root} id='cardPaper'>
                <Grid container spacing={2} style={{ width: 310 }}>
                  <Grid item xs={8}>
                    <Box>
                      <Typography
                        // className={classes.content}
                        // variant='p'
                        // component='p'
                        // color='secondary'
                        // noWrap
                        // style={{marginTop: '0px' , fontSize: '13px'}}
                        className={classes.title}
                        variant='p'
                        component='p'
                        color='primary'
                      >
                        {list.erp_gs_mapping[0].subject_name}
                      </Typography>
                    </Box>
                    <Box className='centralSubBox'>
                      <Typography
                        className={classes.content}
                        id='centralPara'
                        variant='p'
                        component='p'
                        color='black'
                        noWrap
                        style={{ fontSize: '13px' }}
                      >
                        Central Subject :
                      </Typography>
                      <Typography
                        className={classes.content}
                        variant='p'
                        component='p'
                        id='centralValue'
                        color='secondary'
                        noWrap
                        style={{ fontSize: '13px' }}
                      >
                        {list.central_subject_name}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={4} className={classes.textRight}>
                    <Box>
                      <span
                        className='period_card_menu'
                        onClick={() => handlePeriodMenuOpen(index)}
                        onMouseLeave={handlePeriodMenuClose}
                      >
                        <IconButton
                          className='moreHorizIcon'
                          disableRipple
                          color='primary'
                        >
                          <MoreHorizIcon />
                        </IconButton>
                        {showPeriodIndex === index && showMenu ? (
                          <div
                            className='tooltip'
                            style={{ display: 'flex', justifyContent: 'space-between' }}
                          >
                            <span className={` ${classes.tooltiptext} tooltiptext`}>
                              <div
                                className='tooltip'
                                title='Delete'
                                onClick={(e) => handleClick(e)}
                              >
                                Delete
                              </div>
                            </span>
                            <Popover
                              id={id}
                              open={open}
                              anchorEl={anchorEl}
                              onClose={handleClose}
                              anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                              }}
                              transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                              }}
                            >
                              <div style={{ padding: '20px 30px' }}>
                                <Typography
                                  style={{ fontSize: '20px', marginBottom: '15px' }}
                                >
                                  Are you sure you want to delete?
                                </Typography>
                                <div>
                                  <Button
                                    variant="contained"
                                    className="labelColor cancelButton"
                                    onClick={(e) => handleClose()}>
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => callDelete(list.id, index)}
                                    style={{ float: 'right', color: "white" }}
                                  >
                                    Confirm
                                  </Button>
                                </div>
                              </div>
                            </Popover>
                          </div>
                        ) : null}
                      </span>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} />
                  <Grid item xs={6}>
                    {list.is_duplicate ? (
                      <Chip
                        size='small'
                        label='Duplicate'
                        className={classes.duplicate}
                        id='duplicateChip'
                      />
                    ) : (
                      <div className='noDuplicate'></div>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            );
          })}
      </Grid>

      {isSubjectOpen && <Viewmore viewMoreList={viewMoreList} />}
    </>
  );
};

export default withRouter(Subjectcard);
