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
