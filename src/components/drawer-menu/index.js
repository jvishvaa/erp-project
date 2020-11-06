import React from 'react';

import MenuItem from './menu-item';

const DrawerMenu = ({ navigationItems, onClick }) => {
  return (
    <>
      {navigationItems &&
        navigationItems
          .filter((item) => item.child_module && item.child_module.length > 0)
          .map((item) => <MenuItem item={item} onClick={onClick} />)}
      {/* <ListItem button>
        <ListItemIcon className={classes.menuItemIcon}>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary='Dashboard' className={classes.menuItemText} />
      </ListItem>
      <ListItem button>
        <ListItemIcon className={classes.menuItemIcon}>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary='Orders' className={classes.menuItemText} />
      </ListItem>
      <ListItem button>
        <ListItemIcon className={classes.menuItemIcon}>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary='Customers' className={classes.menuItemText} />
      </ListItem>
      <ListItem button>
        <ListItemIcon className={classes.menuItemIcon}>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary='Reports' className={classes.menuItemText} />
      </ListItem>
      <ListItem button>
        <ListItemIcon className={classes.menuItemIcon}>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary='Integrations' className={classes.menuItemText} />
      </ListItem>
      <ListItem button>
        <ListItemIcon className={classes.menuItemIcon}>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary='Current month' className={classes.menuItemText} />
      </ListItem>
      <ListItem button>
        <ListItemIcon className={classes.menuItemIcon}>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary='Last quarter' className={classes.menuItemText} />
      </ListItem>
      <ListItem button>
        <ListItemIcon className={classes.menuItemIcon}>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary='Year-end sale' className={classes.menuItemText} />
      </ListItem> */}
    </>
  );
};

export default DrawerMenu;
