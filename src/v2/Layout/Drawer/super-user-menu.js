import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import { useHistory } from 'react-router-dom';
import useStyles from './useStyles';
import endpoints from 'config/endpoints';

const SuperUserMenu = ({ openMenu, onClickMenuItem, onChangeMenuState, drawerOpen }) => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <>
      {window.location.host !== endpoints.aolConfirmURL && (
        <ListItem
          button
          className={
            history.location.pathname === '/dashboard'
              ? 'menu_selection th-item-menu th-br-6 px-0 py-2 my-1 ' +
                (drawerOpen ? 'th-bg-white ' : '')
              : 'th-item-menu th-br-6 px-0 py-2 my-1'
          }
          onClick={() => {
            onClickMenuItem('Dashboard');
          }}
        >
          {' '}
          <ListItemIcon
            className={
              history.location.pathname === '/dashboard'
                ? classes.menuItemIconWhite
                : classes.menuItemIcon
            }
            style={{
              padding: '6px',
              marginRight: '10px',
              marginLeft: '10px',
              background:
                history.location.pathname === '/dashboard' ? '#1b4ccb' : '#ffffff',
              display: 'flex',
              justifyContent: 'center',
              borderRadius: '6px',
              minWidth: '34px',
            }}
          >
            <DashboardOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            className={'menu-item-text-v2 th-menu-item ' + (drawerOpen ? '' : 'd-none')}
          >
            Dashboard
          </ListItemText>
        </ListItem>
      )}
    </>
  );
};

export default SuperUserMenu;
