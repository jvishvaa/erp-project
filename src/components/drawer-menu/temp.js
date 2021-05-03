/////////////////////////////////////////////
//////////////USER MANAGEMENT////////////////
/////////////////////////////////////////////

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



/////////////////////////////////////////////
//////////////MASTER MANAGEMENT//////////////
/////////////////////////////////////////////


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

          {/* {window.location.host !== endpoints.aolConfirmURL && ( */}
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
          {/* )} */}

          {/* {window.location.host !== endpoints.aolConfirmURL && ( */}
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
          {/* )} */}

          {/* {window.location.host !== endpoints.aolConfirmURL && ( */}
            <ListItem
              button
              className={
                history.location.pathname === '/master-mgmt/chapter-type-table'
                  ? 'menu_selection'
                  : null
              }
              onClick={() => {
                onClickMenuItem('chapter-type-table');
              }}
            >
              <ListItemIcon className={classes.menuItemIcon}>
                {/* <MenuIcon name={child.child_name} /> */}
                {/* {menuIcon(child.child_name)} */}
              </ListItemIcon>
              <ListItemText primary='Chapter Creation' className='menu-item-text' />
            </ListItem>
          {/* )} */}
          

          {window.location.host !== endpoints.aolConfirmURL && (
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
          )}

          {window.location.host !== endpoints.aolConfirmURL && (
            <ListItem
              button
              className={
                history.location.pathname === '/master-mgmt/signature-upload'
                  ? 'menu_selection'
                  : null
              }
              onClick={() => {
                onClickMenuItem('signature-upload');
              }}
            >
              <ListItemIcon className={classes.menuItemIcon}>
                {/* <MenuIcon name={child.child_name} /> */}
                {/* {menuIcon(child.child_name)} */}
              </ListItemIcon>
              <ListItemText primary='Signature Upload' className='menu-item-text' />
            </ListItem>
          )}

          <ListItem
            button
            className={
              history.location.pathname === '/course-list' ? 'menu_selection' : null
            }
            onClick={() => {
              onClickMenuItem('course-table');
            }}
          >
            <ListItemIcon className={classes.menuItemIcon}>
              {/* <MenuIcon name={child.child_name} /> */}
              {/* {menuIcon(child.child_name)} */}
            </ListItemIcon>
            <ListItemText primary='Course' className='menu-item-text' />
          </ListItem>
          {window.location.host === endpoints.aolConfirmURL && (
            <ListItem
              button
              className={
                history.location.pathname === '/course-price' ? 'menu_selection' : null
              }
              onClick={() => {
                onClickMenuItem('course-price');
              }}
            >
              <ListItemIcon className={classes.menuItemIcon}>
                {/* <MenuIcon name={child.child_name} /> */}
                {/* {menuIcon(child.child_name)} */}
              </ListItemIcon>
              <ListItemText primary='Course Price' className='menu-item-text' />
            </ListItem>
          )}

          {window.location.host !== endpoints.aolConfirmURL && (
            <ListItem
              button
              className={
                history.location.pathname === '/subject/grade' ? 'menu_selection' : null
              }
              onClick={() => {
                onClickMenuItem('school-mapping');
              }}
            >
              <ListItemIcon className={classes.menuItemIcon}>
                {/* <MenuIcon name={child.child_name} /> */}
                {/* {menuIcon(child.child_name)} */}
              </ListItemIcon>
              <ListItemText primary='Content Mapping' className='menu-item-text' />
            </ListItem>
          )}
        </List>
      </Collapse>
    