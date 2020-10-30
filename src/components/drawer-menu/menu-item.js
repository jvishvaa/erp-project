/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
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

const MenuItem = ({ item, onClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const classes = useStyles();
  return (
    <>
      <ListItem
        button
        onClick={() => {
          if (item.child_module.length > 0) {
            setMenuOpen((prevState) => !prevState);
          } else {
            onClick(item.parent_modules);
          }
        }}
      >
        <ListItemIcon className={classes.menuItemIcon}>
          {/* <MenuIcon name={item.parent_modules} /> */}
          {menuIcon(item.parent_modules)}
        </ListItemIcon>
        <ListItemText primary={item.parent_modules} className={classes.menuItemText} />
        {item.child_module && item.child_module.length > 0 ? (
          menuOpen ? (
            <ExpandLess style={{ marginLeft: '2rem' }} />
          ) : (
            <ExpandMore style={{ marginLeft: '2rem' }} />
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
                onClick={() => {
                  onClick(child.child_name);
                }}
              >
                <ListItemIcon className={classes.menuItemIcon}>
                  {/* <MenuIcon name={child.child_name} /> */}
                  {/* {menuIcon(child.child_name)} */}
                </ListItemIcon>
                <ListItemText
                  primary={child.child_name}
                  className={classes.menuItemText}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default MenuItem;
