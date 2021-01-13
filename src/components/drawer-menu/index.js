import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import MenuItem from './menu-item';
import SuperUserMenu from './super-user-menu';
import './styles.scss';

const resolveMenu = (url) => {
  if (url.includes('user-management')) return 'user-management';
  if (url.includes('lesson-plan')) return 'lesson-plan';
  if (url.includes('master-mgmt')) return 'master-management';
  if (url.includes('online-class')) return 'Online Class';
  if (url.includes('communication')) return 'Communication';
  if (url.includes('homework')) return 'Homework';
  return null;
};

const DrawerMenu = ({ navigationItems, superUser, onClick }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const { location } = useHistory();
  useEffect(() => {
    setOpenMenu(resolveMenu(location.pathname));
  }, []);
  return (
    <>
      {superUser && (
        <SuperUserMenu
          onClickMenuItem={onClick}
          openMenu={openMenu}
          onChangeMenuState={(menu) => {
            if (menu === openMenu) {
              setOpenMenu(null);
            } else {
              setOpenMenu(menu);
            }
          }}
        />
      )}
      {navigationItems &&
        navigationItems
          .filter((item) => item.child_module && item.child_module.length > 0)
          .map((item) => (
            <MenuItem
              item={item}
              menuOpen={item.parent_modules === openMenu}
              onChangeMenuState={() => {
                if (item.parent_modules === openMenu) {
                  setOpenMenu(null);
                } else {
                  setOpenMenu(item.parent_modules);
                }
              }}
              onClick={onClick}
            />
          ))}
    </>
  );
};

export default DrawerMenu;
