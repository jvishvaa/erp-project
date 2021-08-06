import React, { useState, useContext } from 'react';
import { Button, IconButton, Menu, MenuItem, useTheme, Popover } from '@material-ui/core';
import moment from 'moment';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import './styles.scss';
import { deleteAssessmentTest, fetchAssesmentTests } from '../../../redux/actions';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import ConfirmModal from './confirm-modal';

const menuOptions = ['Delete'];

const ITEM_HEIGHT = 48;

const AssesmentCard = ({
  value,
  onClick,
  isSelected,
  selectedFilterData,
  activeTab,
  filterResults,
}) => {
  const themeContext = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const { setAlert } = useContext(AlertNotificationContext);
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(false);
  
  const handleOpen = () => {
    setOpen(true);
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleDelete = async (testId) => {
    const { results } = await deleteAssessmentTest(testId);
    if (results.status_code === 200) {
      setAlert('success', results?.message);
      filterResults(1); // 1 is the current page no.
    } else {
      setAlert('error', results.error || results.message);
    }
    handleMenuClose();
  };
  return (
    <div className={`assesment-card ${isSelected ? 'selected' : ''}`}>
      <div className='card-header'>
        <p className={`${isSelected ? 'selected' : 'header'}`}>{value.test_type__exam_name}</p>
        <div className='menu'>
          <IconButton
            aria-label='more'
            aria-controls='long-menu'
            aria-haspopup='true'
            onClick={handleMenuOpen}
          >
            <MoreHorizIcon color='primary' />
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
                // onClick={(e) => handleDelete(value?.id)}
                onClick = {(e) => {
                  setOpenModal(true);
                }}
                style={{
                  color: themeContext.palette.primary.main,
                }}
              >
                {option}
              </MenuItem>
            ))}
            {openModal && (
              <ConfirmModal
                submit={(e) => handleDelete(value?.id)}
                openModal={openModal}
                setOpenModal = {setOpenModal}
                />
            )}
          </Popover>
        </div>
      </div>
      <div className='name'>
        <p>{value.test_name}</p>
      </div>
      <div className='grade-details'>
        <div>
          <p>
            {
              `${value.question_paper__grade_name || value.grade_name} `
              // ${value.question_paper__subject_name && value.question_paper__subject_name?.join(', ')}`
            }
          </p>
          {/* <p className='completed'>Completed -30.12.2020</p> */}
          <p className='scheduled'>
            {`Scheduled on - ${moment(value.test_date).format('DD-MM-YYYY')}`}
            {', '}
            {value?.test_date?.slice(11, 16)}
          </p>
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
