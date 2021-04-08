import React, { useEffect, useState } from 'react';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import { Button, useTheme, IconButton, SvgIcon, TextField } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const AssignMarksMenu = ({ menuOptions, handleChange }) => {
  const themeContext = useTheme();
  const [marks, setMarks] = useState([0, 0]);

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    console.log('mounted menu');
    console.log('marksmarks',marks);
  });
  return (
    <>
      <IconButton className='moreHorizIcon' color='primary' onClick={handleMenuOpen}>
        <MoreVertIcon />
      </IconButton>
      <Popover
        id=''
        open={menuOpen}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        className='assesment-card-popup-menu'
        PaperProps={{
          style: {
            border: `1px solid ${themeContext.palette.primary.main}`,
            boxShadow: 0,
            '&::before': {
              content: '',
              position: 'absolute',
              right: '50%',
              top: '-6px',
              backgroundColor: '#ffffff',
              width: '10px',
              height: '10px',
              transform: 'rotate(45deg)',
              border: '1px solid #ff6b6b',
              borderBottom: 0,
              borderRight: 0,
              zIndex: 10,
            },
          },
        }}
      >
        {menuOptions
          .filter((opt) => opt === 'Assign marks' || opt === 'Negative marking')
          .map((option) => (
            <MenuItem
              className='assesment-card-popup-menu-item'
              key={option}
              selected={option === 'Pyxis'}
              onClick={() => {}}
              style={{
                color: themeContext.palette.primary.main,
              }}
            >
              {option}
              <div className='value-input'>
                <TextField
                  variant='outlined'
                  size='small'
                  type='number'
                  value={option === 'Assign marks' ? marks[0] : marks[1]}
                  onChange={(e) => {
                    e.persist();
                    const value = e.target.value < 0 ? 0 : e.target.value;
                    if (option === 'Assign marks')
                      setMarks((prevState) => [value, prevState[1]]);
                    else setMarks((prevState) => [prevState[0], value]);
                    handleChange(option, Number(value));
                  }}
                />
              </div>
            </MenuItem>
          ))}
      </Popover>
    </>
  );
};
export default AssignMarksMenu;
