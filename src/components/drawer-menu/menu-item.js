/* eslint-disable no-debugger */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import useStyles from './useStyles';
import menuIcon from './menu-icon';

const MenuItem = withRouter(({ history, ...props }) => {
  const { item, onClick, onChangeMenuState, menuOpen } = props || {};
  const [selectedIndex, setSelectedIndex] = useState(null);
  const menuSelectionArray = [
    { name: 'Take Class', Path: '/take-class' },
    { name: 'View Class', Path: '/online-class/view-class' },
    { name: 'Attend Online Class', Path: '/online-class/attend-class' },
    { name: 'Create Class', Path: '/online-class/create-class' },
    { name: 'Online Class', Path: '/create-class' },
    { name: 'Management View', Path: '/homework/coordinator' },
    { name: 'Configuration', Path: '/homework/admin' },
    { name: 'Student Homework', Path: '/homework/student' },
    { name: 'Teacher Homework', Path: '/homework/teacher' },
    { name: 'Assessment', Path: '/assessment' },
    { name: 'Communication', Path: '/communication' },
    { name: 'Add Group', Path: '/communication/addgroup' },
    { name: 'View&Edit Group', Path: '/communication/viewgroup' },
    { name: 'Send Message', Path: '/communication/sendmessage' },
    { name: 'Add SMS Credit', Path: '/communication/smscredit' },
    { name: 'SMS&Email Log', Path: '/communication/messageLog' },
    { name: 'Teacher View', Path: '/lesson-plan/teacher-view' },
    { name: 'Student View', Path: '/lesson-plan/student-view' },
    { name: 'Management Report', Path: '/lesson-plan/report' },
    { name: 'Graphical Report', Path: '/lesson-plan/graph-report' },
    { name: 'Student Blogs', Path: '/blog/student/dashboard' },
    { name: 'Teacher Blogs', Path: '/blog/teacher' },
    { name: 'Management Blogs', Path: '/blog/admin' },
    { name: 'Principal Blogs', Path: '/blog/principal' },
    { name: 'Genre', Path: '/blog/genre' },
    { name: 'Word Count Cofiguration', Path: '/blog/create/wordcount-config' },
  ];
  // const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    menuSelectionArray.forEach((items, index) => {
      if (items.Path === history.location.pathname) {
        setSelectedIndex(index);
      }
    });
  }, [history.location.pathname]);
  const classes = useStyles();
  return (
    <>
      <ListItem
        button
        onClick={() => {
          if (item.child_module.length > 0) {
            onChangeMenuState();
          } else {
            onClick(item.parent_modules);
          }
        }}
      >
        <ListItemIcon className={classes.menuItemIcon}>
          {/* <MenuIcon name={item.parent_modules} /> */}
          {menuIcon(item.parent_modules)}
        </ListItemIcon>
        <ListItemText primary={item.parent_modules} className='menu-item-text' />
        {item.child_module && item.child_module.length > 0 ? (
          menuOpen ? (
            <ExpandLess className={classes.expandIcons} />
          ) : (
            <ExpandMore className={classes.expandIcons} />
          )
        ) : (
          ''
        )}
      </ListItem>
      {item.child_module && item.child_module.length > 0 && (
        <Collapse in={menuOpen}>
          <Divider />
          <List>
            {item.child_module.map((child) => (
              <ListItem
                button
                className={
                  selectedIndex &&
                  child.child_name === menuSelectionArray[selectedIndex].name
                    ? 'menu_selection'
                    : null
                }
                onClick={() => {
                  onClick(child.child_name);
                }}
              >
                <ListItemIcon className={classes.menuItemIcon}>
                  {/* <MenuIcon name={child.child_name} /> */}
                  {/* {menuIcon(child.child_name)} */}
                </ListItemIcon>
                <ListItemText primary={child.child_name} className='menu-item-text' />
              </ListItem>
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
});

export default MenuItem;
