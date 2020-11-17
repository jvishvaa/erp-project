import React, { useState } from 'react';
import MenuItem from './menu-item';
import SuperUserMenu from './super-user-menu';
import './styles.scss';

const DrawerMenu = ({ navigationItems, superUser, onClick }) => {
  const [openMenu, setOpenMenu] = useState(null);
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
