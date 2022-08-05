import React from 'react';
import {
  List,
  Drawer,
  useMediaQuery,
  useTheme,
  ListItemIcon,
  ListItem,
  IconButton,
} from '@material-ui/core';
import SearchBar from './SearchBar';
import MenuIcon from '@material-ui/icons/Menu';
import DrawerMenu from 'v2/Layout/Drawer';
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
  const { drawerOpen, navigationData, handleOpen, handleRouting, superUser } = props;
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
          className='p-2'
          style={{
            position: 'sticky',
            top: 0,
            height: '64px',
            zIndex: '100000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f8f8f8',
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

      <List className='px-2' style={{ height: 'calc(100% - 64px)' }}>
        {!drawerOpen ? (
          <ListItem
            className={classes.menuControlContainer}
            onClick={() => handleOpen((prevState) => !prevState)}
          >
            {drawerOpen ? null : (
              <>
                <ListItemIcon className={'th-primary'}>
                  <MenuIcon />
                </ListItemIcon>
              </>
            )}
          </ListItem>
        ) : null}
        {drawerOpen
          ? navigationData &&
            navigationData.length > 0 && (
              <DrawerMenu
                superUser={superUser}
                drawerOpen={drawerOpen}
                navigationItems={navigationData}
                onClick={handleRouting}
                // flag={flag}
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
