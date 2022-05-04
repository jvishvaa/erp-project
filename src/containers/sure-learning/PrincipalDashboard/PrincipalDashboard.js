/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import clsx from 'clsx';
// import { useTheme } from '@material-ui/core/styles';
// import ArrowBackIcon from '@material-ui/icons/ArrowBack';
// import Button from '@material-ui/core/Button';

import {
  Drawer,
  // AppBar,
  // Toolbar,
  // Typography,
  IconButton,
  List,
  CssBaseline,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  // withStyles,
} from '@material-ui/core/';
import {
  NavLink,
  //  Link,
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';

import {
  // Input as InputIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  // Report,
} from '@material-ui/icons';
import { useTheme } from '@material-ui/core/styles';
import styles from './PrincipalDashboard.style';
import ComponentList from './PrincipalComponentList';

function PrincipalDashboard() {
  const classes = styles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [pathnName] = useState('/principalDashboard/modules');
  // const [loginData] = useState(JSON.parse(localStorage.getItem('UserLogin')));
  const [sidebarClicked, setSidebarClicked] = useState(false);
  // const [routeLink, setRouteLink] = useState("");

  const ForwardNavLink = React.forwardRef((props, ref) => (
    <NavLink {...props} innerRef={ref} />
  ));

  // const role = loginData && loginData.personal_info && loginData.personal_info.role;
   const role = localStorage.getItem('userType')

  // const verifyEmail = loginData 
  // && loginData.academic_profile 
  // && loginData.academic_profile.user.email;
  const loginData = JSON.parse(localStorage.getItem('UserLogin'))
  var verify = loginData.role_permission.is_orchids;

  

  function handleDrawerOpen() {
    setOpen(true);
  }

  function handleDrawerClose() {
    setOpen(false);
  }
  // let verify=verifyEmail.includes("@orchids.edu.in")

  // const handleMenu = () => {
  //   localStorage.clear();
  //   window.location = '/';
  // };

  // const handleBack = () => {
  //   localStorage.removeItem('principalCourseType');
  //   window.location = '/inHouseCourses';
  // };
  // useEffect(() => {
  //   console.log("abcdef")
  // }, [])

  const sideBarList = ComponentList;
  const roleList = () => {
    if (role) {
      const roleLower = role.toLowerCase();
      // console.log(sideBarList);

      return sideBarList[roleLower];
    }
    return 0;
  };

  function onListClick() {
    setSidebarClicked((c) => !c);
    // eslint-disable-next-line no-console
    // console.log(route);
    // setRouteLink(roleList().filter(item => item.link === route)[0]);
  }
  

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
        open={open}
      >
        <div className={classes.toolbar} style={{ marginTop: '12vh' }}>
          {open === false ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              // className={clsx(classes.menuButton, {
              //   [classes.hide]: open
              // })}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          )}
        </div>
        <Divider />
        <List>
          <BrowserRouter>
            {roleList()
              && verify===false
              && roleList().length
              && roleList().map((text, index) => (text!==null && text!== undefined && (text.name==="Dashboard" || text.name==="Report" ||  text.name==="Branch wise report" || text.name==="Consolidated Report" || text.name==="Weekly Report") ? (
                <ListItem
                  key={index}
                  button
                  component={ForwardNavLink}
                  to={text.link}
                  onClick={() => onListClick(text.link)}
                >
                  <ListItemIcon>{text.icon}</ListItemIcon>
                  <ListItemText
                    primary={text.name}
                    style={{ paddingRight: '1rem' }}
                  />
                  
                </ListItem>
              ) : (
                ''
              )))}

            {roleList()
              && verify===true
              && roleList().length
              && roleList().map((text, index) => (text!==null && text!==undefined &&  text.name ? (
                <ListItem
                  key={index}
                  button
                  component={ForwardNavLink}
                  to={text.link}
                  onClick={() => onListClick(text.link)}
                >
                  <ListItemIcon>{text.icon}</ListItemIcon>
                  <ListItemText
                    primary={text.name}
                    style={{ paddingRight: '1rem' }}
                  />
                </ListItem>
              ) : (
                ''
              )))}
          </BrowserRouter>
          <Divider />
        </List>
      </Drawer>
      <main className={classes.content} style={{ backgroundColor: pathnName === window.location.pathname ? '' : '' }}>
        <div className={classes.toolbar} />
        {sidebarClicked && (
          <BrowserRouter>
            <Switch>
              {roleList()
                && roleList().length
                && roleList().map((comp, index) =>(comp!==null && comp!==undefined) ?(
                  <Route
                    key={index}
                    path={comp.link}
                    exact
                    component={comp.component}
                  />
                ):null)}
            </Switch>
          </BrowserRouter>
        )}
        {!sidebarClicked && (
          <BrowserRouter>
            <Switch>
              {roleList()
                && roleList().length
                && roleList().map((comp, index) =>(comp!==null && comp!==undefined)? (
                  <Route
                    key={index}
                    path={comp.link}
                    exact
                    component={comp.component}
                  />
                ):null)}
            </Switch>
          </BrowserRouter>
        )}
      </main>
    </div>
  );
}

export default PrincipalDashboard;
