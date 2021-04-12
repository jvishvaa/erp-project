import React, { useState } from 'react';
import { Button, IconButton, Menu, MenuItem, useTheme, Popover } from '@material-ui/core';
import moment from 'moment';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import './styles.scss';

const menuOptions = ['Edit test', 'Reschedule'];

const ITEM_HEIGHT = 48;

const AssesmentCard = ({ value, onClick, isSelected }) => {
  const themeContext = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className={`assesment-card ${isSelected ? 'selected' : ''}`}>
      <div className='card-header'>
        <p className='header'>{value.test_type__exam_name}</p>
        <div className='menu'>
          {/* <IconButton
            aria-label='more'
            aria-controls='long-menu'
            aria-haspopup='true'
            onClick={handleClick}
          >
            <MoreHorizIcon color='primary' />
          </IconButton> */}
          {/* <Menu
            id='long-menu'
            anchorEl={anchorEl}
            keepMounted
            open={menuOpen}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: '20ch',
                border: `1px solid ${themeContext.palette.primary.main}`,
                boxShadow: 0,
              },
            }}
            className='assesment-card-popup-menu'
          >
            {menuOptions.map((option) => (
              <MenuItem
                className='assesment-card-popup-menu-item'
                key={option}
                selected={option === 'Pyxis'}
                onClick={handleClose}
                style={{
                  color: themeContext.palette.primary.main,
                }}
              >
                {option}
              </MenuItem>
            ))}
          </Menu> */}
          <Popover
            id=''
            open={menuOpen}
            anchorEl={anchorEl}
            onClose={handleClose}
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
                maxHeight: ITEM_HEIGHT * 4.5,
                width: '20ch',
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
            {menuOptions.map((option) => (
              <MenuItem
                className='assesment-card-popup-menu-item'
                key={option}
                selected={option === 'Pyxis'}
                onClick={handleClose}
                style={{
                  color: themeContext.palette.primary.main,
                }}
              >
                {option}
              </MenuItem>
            ))}
          </Popover>
        </div>
      </div>
      <div className='name'>
        <p>{value.test_name}</p>
      </div>
      <div className='grade-details'>
        <div>
          <p>
            {`${
              value.question_paper__grade_name
            } ${value.question_paper__subject_name?.join(', ')}`}
          </p>
          {/* <p className='completed'>Completed -30.12.2020</p> */}
          <p className='scheduled'>{`Scheduled on - ${moment(value.test_date).format(
            'DD-MM-YYYY'
          )}`}</p>
        </div>
        <div className='btn-container'>
          {!isSelected && (
            <Button
              style={{ borderRadius: '10px', color: 'white' }}
              variant='contained'
              color='primary'
              onClick={() => {
                onClick(value);
              }}
            >
              View More
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
export default AssesmentCard;
