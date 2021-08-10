import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormHelperText,
  Grid,
  makeStyles,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  TextField,
  Button,
  SvgIcon,
  Checkbox,
  Popover,
  MenuItem,
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 20,
  },
  dailog: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  dialogPaper: {
    minHeight: '45vh',
    maxHeight: '45vh',
  },
  dgsize: {
    width: '100%',
  },
}));
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant='h6'>{children}</Typography>
      {onClose ? (
        <IconButton aria-label='close' className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);
const resolveQuestionTypeName = (type) => {
  switch (type) {
    case 1:
      return 'MCQ SINGLE CHOICE';
    case 2:
      return 'MCQ_MULTIPLE_CHOICE';
    case 3:
      return 'Match the Following';
    case 4:
      return 'Video Question';
    case 5:
      return 'PPT Question';
    case 6:
      return 'Matrix Questions';
    case 7:
      return 'Comprehension Questions';
    case 8:
      return 'True False';
    case 9:
      return 'Fill In The Blanks';
    case 10:
      return 'Descriptive';
    default:
      return '--';
  }
};

const ITEM_HEIGHT = 48;

const menuOptions = ['Remove'];

const Section = ({ question, section, questionId, onDelete, onDeleteQuestion }) => {
  let history = useHistory();

  const themeContext = useTheme();
  const [Diaopen, setdiaOpen] = React.useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const DiaClickOpen = () => {
    setdiaOpen(true);
  };

  const DiaClose = () => {
    setdiaOpen(false);
  };

  const handleDelete = () => {
    setDeleteAlert(true);
  };
  const handleDeleteConfirm = () => {
    setDeleteAlert(false);
    onDelete(questionId, section.id);
  };
  const handleDeleteQuestion = (q) => {
    handleMenuClose();
    onDeleteQuestion(q?.id, section);
  };
  const handleDeleteCancel = () => {
    setDeleteAlert(false);
  };

  return (
    <div className='section-container'>
      <div className='section-header'>
        <div className='left'>
          <div className='checkbox'>
            <Checkbox
              checked={true}
              onChange={() => {}}
              inputProps={{ 'aria-label': 'primary checkbox' }}
              color='primary'
            />
          </div>
          <div className='section-name'>{section.name}</div>
        </div>
        <div className='right'>
          <Button
            style={{ color: 'white' }}
            color='primary'
            size='medium'
            variant='contained'
            onClick={() => {
              history.push(
                `/question-bank?question=${questionId}&section=${section.name}`
              );
            }}
          >
            Add Question
          </Button>
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon color='primary' />
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
                onClick={handleDelete}
                // onClick={DiaClickOpen}
                style={{
                  color: themeContext.palette.primary.main,
                }}
              >
                {option}
              </MenuItem>
            ))}
            <Dialog open={deleteAlert} onClose={handleDeleteCancel}>
              <DialogTitle id='draggable-dialog-title'>Delete Question</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to remove this section ?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDeleteCancel} className='labelColor cancelButton'>
                  Cancel
                </Button>
                <Button
                  color='primary'
                  variant='contained'
                  style={{ color: 'white' }}
                  onClick={handleDeleteConfirm}
                >
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
          </Popover>
        </div>
      </div>
      <div className='section-content'>
        {section?.questions.map((q) => (
          <div className='selected-question-card'>
            <div className='selected-question-card-header'>
              <div className='header-name'>
                {resolveQuestionTypeName(q.question_type)}
              </div>
              <div className='icon'>
                <IconButton onClick={handleMenuOpen}>
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
                      onClick={() => handleDeleteQuestion(q)}
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
            <div className='content'>
              <div className='left'>
                <div style={{ fontWeight: 550, fontSize: '1rem' }}>Online</div>
                <div> {q.is_published ? 'Draft' : 'Published'}</div>
              </div>
              <div className='right'>
                <div className='created'>
                  <div>Created on</div>
                  <div style={{ fontWeight: 550, fontSize: '1rem' }}>
                    {`${moment(q.test_date).format('DD-MM-YYYY')}`}
                  </div>
                </div>
                {/* <div>
                  <Button variant='contained' color='primary'>
                    VIEW MORE
                  </Button>
                </div> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Section;
