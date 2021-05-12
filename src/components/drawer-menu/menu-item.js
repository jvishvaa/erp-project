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
    // { name: 'View Class', Path: '/online-class/view-class' },
    // { name: 'Attend Online Class', Path: '/online-class/attend-class' },
    // { name: 'Teacher View Class', Path: '/online-class/teacher-view-class' },
    { name: 'Role Management', Path: '/role-management' },
    { name: 'View Role', Path: '/role-management' },
    { name: 'Master Management', Path: '/master-management' },
    { name: 'Branch', Path: '/master-management/branch-table' },
    { name: 'Branch Acad Mapping', Path: '/master-management/branch-acad-table' },
    { name: 'Subject', Path: '/master-management/subject-table' },
    { name: 'Subject Mapping', Path: '/master-management/subject-mapping-table' },
    { name: 'Section', Path: '/master-management/section-table' },
    { name: 'Section Mapping', Path: '/master-management/section-mapping-table' },
    { name: 'Grade', Path: '/master-management/grade-table' },
    { name: 'Academic Year', Path: '/master-management/academic-year-table' },
    { name: 'Chapter Creation', Path: '/master-management/chapter-type-table' },
    { name: 'Topic', Path: '/master-management/topic-table' },
    { name: 'Message Type', Path: '/master-management/message-type-table' },
    { name: 'Signature Upload', Path: '/master-management/signature-upload' },
    { name: 'Event Category', Path: '/master-management/event-category' },
    { name: 'Discussion Category', Path: '/master-management/discussion-category' },
    { name: 'Teacher Calendar', Path: '/attendance-calendar/teacher-view' }, //attendance
    { name: 'Student Calendar', Path: '/attendance-calendar/student-view' }, //
    { name: 'Course', Path: '/course-list' },
    { name: 'Course Price', Path: '/course-price' },
    { name: 'Content Mapping', Path: '/subject/grade' },
    { name: 'Create User', Path: '/user-management/create-user' },
    { name: 'View User', Path: '/user-management/view-users' },
    { name: 'Bulk Upload Status', Path: '/user-management/bulk-upload' },
    { name: 'Bulk Status Upload', Path: '/finance/BulkOperation/BulkUploadStatus' },
    { name: 'Assign Role', Path: '/user-management/assign-role' },
    { name: 'View Class', Path: '/erp-online-class' },
    { name: 'Attend Online Class', Path: '/erp-online-class-student-view' },
    { name: 'Teacher View Class', Path: '/erp-online-class-teacher-view' },
    { name: 'Create Class', Path: '/online-class/create-class' },
    { name: 'Online Class', Path: '/online-class/attend-class' },
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
    { name: 'Word Count Cofiguration', Path: '/blog/wordcount-config' },
    // { name: 'ID Cards', Path: '/student-id-card' },
    { name: 'ID Card View', Path: '/student-id-card' },
    { name: 'Student Strength', Path: '/student-strength' },
    { name: 'Teacher Circular', Path: '/teacher-circular' },
    { name: 'Student Circular', Path: '/student-circular' },

    //{ name: 'Discussion Forum', Path: '/discussion-forum' },
    { name: 'Teacher Forum', Path: '/teacher-forum' },
    { name: 'Student Forum', Path: '/student-forum' },
    { name: 'Assessment Report', Path: '/assessment-reports' },
    { name: 'Question Bank', Path: '/question-bank' },
    { name: 'Question Paper', Path: '/assessment-question' },
    { name: 'Create Test', Path: '/assesment' },
    { name: 'Take Test', Path: '/assessment' },
    { name: 'Student Attendance Report', Path: '/student-attendance-report' },
    { name: 'Student Strength', Path: '/student-strength' },
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
