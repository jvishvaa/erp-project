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

const SuperUserMenu = ({ openMenu, onClickMenuItem, onChangeMenuState }) => {
  const history = useHistory();
  const classes = useStyles();
  const userMenuOpen = openMenu === 'user-management';
  const masterMenuOpen = openMenu === 'master-management';

  return (
    <>
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
     
      <ListItem
        button
        onClick={() => {
          onChangeMenuState('user-management');
        }}
      >
        <ListItemIcon className={classes.menuItemIcon}>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText className='menu-item-text'>User Management</ListItemText>
        {userMenuOpen ? (
          <ExpandLess className={classes.expandIcons} />
        ) : (
          <ExpandMore className={classes.expandIcons} />
        )}
      </ListItem>
      <Collapse in={userMenuOpen}>
        <Divider />
        <List>
          <ListItem
            button
            className={
              history.location.pathname === '/user-management/create-user'
                ? 'menu_selection'
                : null
            }
            onClick={() => {
              onClickMenuItem('create-user');
            }}
          >
            <ListItemIcon className={classes.menuItemIcon}>
              {/* <MenuIcon name={child.child_name} /> */}
              {/* {menuIcon(child.child_name)} */}
            </ListItemIcon>
            <ListItemText primary={`Create User`} className='menu-item-text' />
          </ListItem>
          <ListItem
            button
            className={
              history.location.pathname === '/user-management/view-users'
                ? 'menu_selection'
                : null
            }
            onClick={() => {
              onClickMenuItem('view-users');
            }}
          >
            <ListItemIcon className={classes.menuItemIcon}>
              {/* <MenuIcon name={child.child_name} /> */}
              {/* {menuIcon(child.child_name)} */}
            </ListItemIcon>
            <ListItemText primary='View User' className='menu-item-text' />
          </ListItem>
          <ListItem
            button
            className={
              history.location.pathname === '/user-management/bulk-upload'
                ? 'menu_selection'
                : null
            }
            onClick={() => {
              onClickMenuItem('bulk-upload');
            }}
          >
            <ListItemIcon className={classes.menuItemIcon}>
              {/* <MenuIcon name={child.child_name} /> */}
              {/* {menuIcon(child.child_name)} */}
            </ListItemIcon>
            <ListItemText primary={`Bulk Upload Status`} className='menu-item-text' />
          </ListItem>

          <ListItem
            button
            className={
              history.location.pathname === '/user-management/assign-role'
                ? 'menu_selection'
                : null
            }
            onClick={() => {
              onClickMenuItem('assign-role');
            }}
          >
            <ListItemIcon className={classes.menuItemIcon}>
              {/* <MenuIcon name={child.child_name} /> */}
              {/* {menuIcon(child.child_name)} */}
            </ListItemIcon>
            <ListItemText primary='Assign Role' className='menu-item-text' />
          </ListItem>
        </List>
      </Collapse>

      <ListItem
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
        <ListItemText className='menu-item-text'>Role management</ListItemText>
      </ListItem>
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

      <ListItem
        button
        onClick={() => {
          onChangeMenuState('master-management');
        }}
      >
        <ListItemIcon className={classes.menuItemIcon}>
          <SupervisorAccountOutlinedIcon />
        </ListItemIcon>
        <ListItemText className='menu-item-text'>Master Management</ListItemText>
        {masterMenuOpen ? (
          <ExpandLess className={classes.expandIcons} />
        ) : (
          <ExpandMore className={classes.expandIcons} />
        )}
      </ListItem>
      <Collapse in={masterMenuOpen}>
        <Divider />
        <List>
          <ListItem
            button
            className={
              history.location.pathname === '/master-mgmt/subject-table'
                ? 'menu_selection'
                : null
            }
            onClick={() => {
              onClickMenuItem('subject-table');
            }}
          >
            <ListItemIcon className={classes.menuItemIcon}>
              {/* <MenuIcon name={child.child_name} /> */}
              {/* {menuIcon(child.child_name)} */}
            </ListItemIcon>
            <ListItemText primary={`Subject`} className='menu-item-text' />
          </ListItem>

          <ListItem
            button
            className={
              history.location.pathname === '/master-mgmt/section-table'
                ? 'menu_selection'
                : null
            }
            onClick={() => {
              onClickMenuItem('section-table');
            }}
          >
            <ListItemIcon className={classes.menuItemIcon}>
              {/* <MenuIcon name={child.child_name} /> */}
              {/* {menuIcon(child.child_name)} */}
            </ListItemIcon>
            <ListItemText primary='Section' className='menu-item-text' />
          </ListItem>

          <ListItem
            button
            className={
              history.location.pathname === '/master-mgmt/grade-table'
                ? 'menu_selection'
                : null
            }
            onClick={() => {
              onClickMenuItem('grade-table');
            }}
          >
            <ListItemIcon className={classes.menuItemIcon}>
              {/* <MenuIcon name={child.child_name} /> */}
              {/* {menuIcon(child.child_name)} */}
            </ListItemIcon>
            <ListItemText primary='Grade' className='menu-item-text' />
          </ListItem>

          <ListItem
            button
            className={
              history.location.pathname === '/master-mgmt/academic-year-table'
                ? 'menu_selection'
                : null
            }
            onClick={() => {
              onClickMenuItem('academic-year-table');
            }}
          >
            <ListItemIcon className={classes.menuItemIcon}>
              {/* <MenuIcon name={child.child_name} /> */}
              {/* {menuIcon(child.child_name)} */}
            </ListItemIcon>
            <ListItemText primary='Academic Year' className='menu-item-text' />
          </ListItem>

          <ListItem
            button
            className={
              history.location.pathname === '/master-mgmt/message-type-table'
                ? 'menu_selection'
                : null
            }
            onClick={() => {
              onClickMenuItem('message-type-table');
            }}
          >
            <ListItemIcon className={classes.menuItemIcon}>
              {/* <MenuIcon name={child.child_name} /> */}
              {/* {menuIcon(child.child_name)} */}
            </ListItemIcon>
            <ListItemText primary='Message Type' className='menu-item-text' />
          </ListItem>

          <ListItem
            button
            className={
              history.location.pathname === '/subject/grade'
                ? 'menu_selection'
                : null
            }
            onClick={() => {
              onClickMenuItem('school-mapping');
            }}
          >
            <ListItemIcon className={classes.menuItemIcon}>
              {/* <MenuIcon name={child.child_name} /> */}
              {/* {menuIcon(child.child_name)} */}
            </ListItemIcon>
            <ListItemText primary='School Mapping' className='menu-item-text' />
          </ListItem>
        </List>
      </Collapse>
    </>
  );
};

export default SuperUserMenu;
