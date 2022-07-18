import React from 'react';
import {
  List,
  Drawer,
  useMediaQuery,
  useTheme,
  Divider,
  ListItemIcon,
  ListItem,
  IconButton,
} from '@material-ui/core';
import SearchBar from './SearchBar';
import MenuIcon from '@material-ui/icons/Menu';
import DrawerMenu from 'components/drawer-menu';
import useStyles from './useStyles';
import './styles.scss';
import clsx from 'clsx';
import logo from '../../assets/images/logo.png';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

const Sidebar = (props) => {
  const classes = useStyles();
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const {
    drawerOpen,
    navigationData,
    handleOpen,
    handleRouting,
    superUser,
    setDrawerOpen,
  } = props;
  return (
    <Drawer
      open={drawerOpen}
      variant={isMobile ? '' : 'permanent'}
      className={`${clsx(classes.drawer, {
        [classes.drawerPaper]: drawerOpen,
        [classes.drawerPaperClose]: !drawerOpen,
      })} drawerScrollBar`}
      classes={{
        paper: clsx({
          [classes.drawer]: true,
          [classes.drawerPaper]: drawerOpen,
          [classes.drawerPaperClose]: !drawerOpen,
        }),
      }}
      onClose={() => handleOpen(false)}
    >
      {isMobile ? <div className={classes.appBarSpacer} /> : null}
      {isMobile ? <SearchBar /> : null}

      {isMobile ? null : (
        <div
          style={{
            paddingBottom: 10,
            background: '#fafafa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <img src={logo} alt='logo' style={{ height: '36px', paddingLeft: '15px' }} />
          <IconButton onClick={() => handleOpen((prevState) => !prevState)}>
            {themeContext.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
      )}

      <Divider />
      <List>
        <ListItem
          className={classes.menuControlContainer}
          onClick={() => handleOpen((prevState) => !prevState)}
        >
          {drawerOpen ? null : (
            <>
              <ListItemIcon className={classes.menuItemIcon}>
                <MenuIcon />
              </ListItemIcon>
            </>
          )}
        </ListItem>
        {drawerOpen
          ? navigationData &&
            navigationData.length > 0 && (
              <DrawerMenu
                superUser={superUser}
                drawerOpen={drawerOpen}
                navigationItems={navigationData}
                onClick={handleRouting}
              />
            )
          : navigationData &&
            navigationData.length > 0 && (
              <DrawerMenu
                superUser={superUser}
                navigationItems={navigationData}
                onClick={handleOpen}
                drawerOpen={drawerOpen}
              />
            )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
