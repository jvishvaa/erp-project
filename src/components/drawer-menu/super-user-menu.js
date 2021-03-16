import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import PeopleIcon from '@material-ui/icons/People';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import SupervisorAccountOutlinedIcon from '@material-ui/icons/SupervisorAccountOutlined';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import { useHistory } from 'react-router-dom';
import useStyles from './useStyles';
import endpoints from '../../config/endpoints';

const SuperUserMenu = ({ openMenu, onClickMenuItem, onChangeMenuState }) => {
  const history = useHistory();
  const classes = useStyles();
  const userMenuOpen = openMenu === 'user-management';
  const masterMenuOpen = openMenu === 'master-management';

  return (
    <>
      {/* {window.location.host !== endpoints.aolConfirmURL && (
        <ListItem
          button
          className={history.location.pathname === '/dashboard' ? 'menu_selection' : null}
          onClick={() => {
            onClickMenuItem('Dashboard');
          }}
        >
          {' '}
          <ListItemIcon className={classes.menuItemIcon}>
            <AssignmentIndIcon />
          </ListItemIcon>
          <ListItemText className='menu-item-text'>Dashboard</ListItemText>
        </ListItem>
      )} */}
      {/* <ListItem
        button
        className={
          history.location.pathname === '/homework/teacher' ? 'menu_selection' : null
        }
        onClick={() => {
          onClickMenuItem('homework-teacher');
        }}
      >
        {' '}
        <ListItemIcon className={classes.menuItemIcon}>
          <HomeWorkIcon />
        </ListItemIcon>
        <ListItemText className='menu-item-text'>Homework</ListItemText>
      </ListItem> */}

      {/* <ListItem
        button
        className={
          history.location.pathname === '/role-management' ? 'menu_selection' : null
        }
        onClick={() => {
          onClickMenuItem('role-management');
        }}
      >
        <ListItemIcon className={classes.menuItemIcon}>
          <AssignmentIndIcon />
        </ListItemIcon>
        <ListItemText className='menu-item-text'>Role Management</ListItemText>
      </ListItem> */}
      
      {/*
        <ListItem
          button
          className={
            history.location.pathname === '/discussion-forum' ? 'menu_selection' : null
          }
          onClick={() => {
            onClickMenuItem('discussion-forum');
          }}
        >
          <ListItemIcon className={classes.menuItemIcon}>
            <AssignmentIndIcon />
          </ListItemIcon>
          <ListItemText className='menu-item-text'>Discussion Forum</ListItemText>
        </ListItem>
      */}
    </>
  );
};

export default SuperUserMenu;
