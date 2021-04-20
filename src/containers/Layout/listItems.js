import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import useStyles from './useStyles';

const MainListItems = () => {
  const classes = useStyles();

  return (
    <div>
      <ListItem button>
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
      </ListItem>
      
    </div>
  );
};

export default MainListItems;
