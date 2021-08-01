import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  Popper,
  Fade,
  Paper,
  Grid,
} from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';

import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Box from '@material-ui/core/Box';
import CloseIcon from '@material-ui/icons/Close';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import { throttle, debounce } from 'throttle-debounce';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import UserDetails from './userDetails/user-details';
import AppSearchBarUseStyles from './AppSearchBarUseStyles'


const SearchBar = ({ children, history, ...props }) => {
  const classes = AppSearchBarUseStyles();
  const containerRef = useRef(null);
  const [navigationData, setNavigationData] = useState(false);
  const searchInputRef = useRef();
  const [superUser, setSuperUser] = useState(false);
  const [searchedText, setSearchedText] = useState('');
  const [searching, setSearching] = useState(false);
  const [globalSearchResults, setGlobalSearchResults] = useState(false);
  const [searchUserDetails, setSearchUserDetails] = useState([]);
  const [userId, setUserId] = useState();
  const [displayUserDetails, setDisplayUserDetails] = useState(false);
  const [globalSearchError, setGlobalSearchError] = useState(false);
  const [mobileSeach, setMobileSeach] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { setAlert } = useContext(AlertNotificationContext);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};

  const [anchorEl, setAnchorEl] = React.useState(null);

  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  const getGlobalUserRecords = async (text) => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.gloabSearch.getUsers}?search=${text}&page=${currentPage}&page_size=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (result.data.status_code === 200) {
        const tempData = [];
        result.data.data.results.map((items) =>
          tempData.push({
            id: items.id,
            name: items.name,
            erpId: items.erp_id,
            contact: items.contact,
          })
        );
        setTotalPage(result.data.data.total_pages);
        setSearchUserDetails(tempData);
      } else {
        setAlert('error', result.data.message);
        setGlobalSearchError(false);
      }
    } catch (error) {
      setAlert('error', error.message);
      setGlobalSearchError(false);
    }
  };

  useEffect(() => {
    const navigationData = localStorage.getItem('navigationData');
    if (navigationData) {
      setNavigationData(JSON.parse(navigationData));
    }
    let userDetails = localStorage.getItem('userDetails');
    if (!userDetails) {
      history.push('/');
    }
    if (userDetails) {
      userDetails = JSON.parse(userDetails);
      const { is_superuser = false } = userDetails;
      setSuperUser(is_superuser);
    }
    if (containerRef.scrollTop > 50) {
      containerRef.scrollTop = 0;
    }
  }, []);


  const autocompleteSearch = (q, pageId, isDelete) => {
    if (q !== '') {
      setSearching(true);
      setGlobalSearchResults(true);
      getGlobalUserRecords(q);
    }
  };
  const autocompleteSearchDebounced = debounce(500, autocompleteSearch);
  const autocompleteSearchThrottled = throttle(500, autocompleteSearch);

  useEffect(() => {
    if (searchedText !== '') {
      setGlobalSearchResults(false);
      setSearching(false);
      setSearchUserDetails([]);
      setTotalPage(0);
      setCurrentPage(1);
    }
  }, [history.location.pathname]);

  const changeQuery = (event) => {
    setSearchedText(event.target.value);
    if (event.target.value === '') {
      setGlobalSearchResults(false);
      setSearching(false);
      setSearchUserDetails([]);
      setTotalPage(0);
      setCurrentPage(1);
      return;
    }
    const q = event.target.value;
    if (q.length < 5) {
      setCurrentPage(1);
      autocompleteSearchThrottled(event.target.value);
    } else {
      setCurrentPage(1);
      autocompleteSearchDebounced(event.target.value);
    }
  };
  const handleTextSearchClear = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setSearchedText('');
      setGlobalSearchResults(false);
      setSearching(false);
      setSearchUserDetails([]);
      setTotalPage(0);
      setCurrentPage(1);
    }, 500);
  };

  return (
    <>
      {superUser && !isMobile ? (
        <Box className={clsx(classes.searchBar)}>
          <Box className={classes.search}>
            <Paper component='form' className={classes.searchInputContainer}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                style={{ innerWidth: '100%' }}
                value={searchedText}
                className={classes.searchInput}
                placeholder='Search'
                inputProps={{ 'aria-label': 'search across site' }}
                inputRef={searchInputRef}
                onChange={changeQuery}
                onBlur={handleTextSearchClear}
              />
              {searchedText ? (
                <IconButton
                  type='submit'
                  className={classes.clearIconButton}
                  aria-label='close'
                  onClick={handleTextSearchClear}
                >
                  <CloseIcon />
                </IconButton>
              ) : null}
            </Paper>
            <Popper
              open={searching}
              className={`${classes.searchDropdown} ${isMobile ? classes.searchDropdownMobile : 'null'
                }`}
              anchorEl={anchorEl}
              placement='bottom'
              disablePortal={true}
              style={{
                position: 'absolute',
                // top:'45px',
                // left:'25px',
                top: isMobile
                  ? searchInputRef.current &&
                  searchInputRef.current.getBoundingClientRect().top + 44
                  : searchInputRef.current &&
                  searchInputRef.current.getBoundingClientRect().top + 32,
                left: '50px',
                right: `calc(${isMobile ? '92vw' : '100vw'} - ${searchInputRef.current &&
                  searchInputRef.current.getBoundingClientRect().left +
                  searchInputRef.current.getBoundingClientRect().width
                  }px)`,
                zIndex: 3000,
              }}
              transition
            >
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                  <Paper>
                    <Grid
                      container
                      className='main_search_container'
                      style={{ flexDirection: 'column' }}
                    >
                      {globalSearchResults && searchUserDetails.length ? (
                        <>
                          <Grid item>
                            <Grid
                              container
                              style={{
                                flexDirection: 'row',
                                paddingBottom: 12,
                                paddingTop: 12,
                                paddingLeft: 16,
                                backgroundColor: 'rgb(224 224 224)',
                                paddingRight: 16,
                                minWidth: 374,
                              }}
                            >
                              <Grid
                                // onScroll={(event) => handleScroll(event)}
                                style={{
                                  paddingRight: 8,
                                  maxHeight: 385,
                                  height: 300,
                                  overflow: 'auto',
                                }}
                                item
                              >
                                {globalSearchResults && (
                                  <List
                                    style={{ minWidth: 61 }}
                                    subheader={
                                      <ListSubheader
                                        style={{
                                          background: 'rgb(224 224 224)',
                                          width: '100%',
                                          color: '#014B7E',
                                          fontSize: '1rem',
                                          fontWeight: 600,
                                        }}
                                      >
                                        Users
                                      </ListSubheader>
                                    }
                                  >
                                    {globalSearchResults &&
                                      searchUserDetails.length &&
                                      searchUserDetails.map((result, index) => {
                                        return (
                                          <ListItem
                                            style={{ width: 324 }}
                                            className='user_rows_details'
                                            button
                                            onClick={() => {
                                              setSearching(false);
                                              setUserId(result.id);
                                              setDisplayUserDetails(true);
                                            }}
                                          >
                                            <ListItemText
                                              primary={result.name}
                                              secondary={
                                                <div>
                                                  <span>{result.erpId}</span>
                                                  <span style={{ float: 'right' }}>
                                                    Mob: {result.contact}
                                                  </span>
                                                </div>
                                              }
                                            />
                                          </ListItem>
                                        );
                                      })}
                                  </List>
                                )}
                              </Grid>
                            </Grid>
                          </Grid>
                        </>
                      ) : (
                        <Grid
                          container
                          style={{
                            flexDirection: 'row',
                            backgroundColor: '#eee',
                            minHeight: 324,
                            minWidth: 374,
                            flexGrow: 1,
                          }}
                        >
                          <span
                            style={{
                              padding: 1,
                              textAlign: 'center',
                              margin: 'auto',
                              color: '#014B7E',
                            }}
                          >
                            No data available.
                          </span>
                        </Grid>
                      )}
                    </Grid>
                    <Grid container>
                      {globalSearchError && (
                        <Grid
                          style={{ padding: 8, width: '100%', backgroundColor: '#eee' }}
                          xs={12}
                          item
                        >
                          Something went wrong.
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Fade>
              )}
            </Popper>
          </Box>
        </Box>
      ) : null}

       {superUser && isMobile &&(
        <Box className={clsx(classes.searchBar1)}>
          <Box className={classes.search}>
            <Paper component='form' className={classes.searchInputContainer}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                style={{ innerWidth: '100%' }}
                value={searchedText}
                className={classes.searchInput}
                placeholder='Search'
                inputProps={{ 'aria-label': 'search across site' }}
                inputRef={searchInputRef}
                onChange={changeQuery}
                onBlur={handleTextSearchClear}
              />
              {searchedText ? (
                <IconButton
                  type='submit'
                  className={classes.clearIconButton}
                  aria-label='close'
                  onClick={handleTextSearchClear}
                >
                  <CloseIcon />
                </IconButton>
              ) : null}
            </Paper>
            <Popper
              open={searching}
              className={`${classes.searchDropdown} ${isMobile ? classes.searchDropdownMobile : 'null'
                }`}
              anchorEl={anchorEl}
              placement='bottom'
              disablePortal={true}
              style={{
                position: 'absolute',
                // top:'45px',
                // left:'25px',
                top: "50px",
                // overflow : "scroll",
                // isMobile
                  // ? searchInputRef.current &&
                  // searchInputRef.current.getBoundingClientRect().top 
                  // : searchInputRef.current &&
                  // searchInputRef.current.getBoundingClientRect().top + 32,
                left: '-5px',
                right: `calc(${isMobile ? '92vw' : '100vw'} - ${searchInputRef.current &&
                  searchInputRef.current.getBoundingClientRect().left +
                  searchInputRef.current.getBoundingClientRect().width
                  }px)`,
                zIndex: 3000,
              }}
              transition
            >
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                  <Paper>
                    <Grid
                      container
                      className='main_search_container'
                      style={{ flexDirection: 'column' }}
                    >
                      {globalSearchResults && searchUserDetails.length ? (
                        <>
                          <Grid item>
                            <Grid
                              container
                              style={{
                                flexDirection: 'row',
                                paddingBottom: 12,
                                paddingTop: 12,
                                paddingLeft: 10,
                                backgroundColor: 'rgb(224 224 224)',
                                paddingRight: 10,
                                minWidth: "95vw",
                              }}
                            >
                              <Grid
                                // onScroll={(event) => handleScroll(event)}
                                style={{
                                  paddingRight: 8,
                                  maxHeight: 385,
                                  height: 300,
                                  overflow: 'auto',
                                }}
                                item
                              >
                                {globalSearchResults && (
                                  <List
                                    style={{ minWidth: 61 }}
                                    subheader={
                                      <ListSubheader
                                        style={{
                                          background: 'rgb(224 224 224)',
                                          width: '100%',
                                          color: '#014B7E',
                                          fontSize: '1rem',
                                          fontWeight: 600,
                                        }}
                                      >
                                        Users
                                      </ListSubheader>
                                    }
                                  >
                                    {globalSearchResults &&
                                      searchUserDetails.length &&
                                      searchUserDetails.map((result, index) => {
                                        return (
                                          <ListItem
                                            style={{ whiteSpace : "break-spaces" , width : "84vw" }}
                                            className='user_rows_details'
                                            button
                                            onClick={() => {
                                              setSearching(false);
                                              setUserId(result.id);
                                              setDisplayUserDetails(true);
                                            }}
                                          >
                                            <ListItemText
                                              primary={result.name}
                                              secondary={
                                                <div>
                                                  <span>{result.erpId}</span>
                                                  <span style={{ float: 'right' }}>
                                                    Mob: {result.contact}
                                                  </span>
                                                </div>
                                              }
                                            />
                                          </ListItem>
                                        );
                                      })}
                                  </List>
                                )}
                              </Grid>
                            </Grid>
                          </Grid>
                        </>
                      ) : (
                        <Grid
                          container
                          style={{
                            flexDirection: 'row',
                            backgroundColor: '#eee',
                            minHeight: 324,
                            minWidth: "95vw",
                            flexGrow: 1,
                          }}
                        >
                          <span
                            style={{
                              padding: 1,
                              textAlign: 'center',
                              margin: 'auto',
                              color: '#014B7E',
                            }}
                          >
                            No data available.
                          </span>
                        </Grid>
                      )}
                    </Grid>
                    <Grid container>
                      {globalSearchError && (
                        <Grid
                          style={{ padding: 8, width: "84vw", backgroundColor: '#eee' }}
                          xs={12}
                          item
                        >
                          Something went wrong.
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Fade>
              )}
            </Popper>
          </Box>
        </Box>
      )}
      {displayUserDetails ? (
        <UserDetails
          close={setDisplayUserDetails}
          mobileSearch={setMobileSeach}
          userId={userId}
          setUserId={setUserId}
          setSearching={setSearching}
        />
      ) : null}
    </>
  )
}

export default withRouter(SearchBar)
