import React, { useState, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Button, useTheme, IconButton, SvgIcon } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useHistory } from 'react-router-dom';
import useStyles from './useStyles';
import { connect } from 'react-redux';
import { addQuestionPaperToTest } from '../../../redux/actions';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { Context } from '../Store';

const menuOptions = ['Assign to test'];

const QuestionCard = (props) => {
  const themeContext = useTheme();
  const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const classes = useStyles();
  const [showMenu, setShowMenu] = useState(false);
  const [showPeriodIndex, setShowPeriodIndex] = useState();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState(null);

  const [data, setData] = useContext(Context);

  const menuOpen = Boolean(anchorEl);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddToTest = () => {
    props.initAddQuestionPaperToTest(props.result);
    history.push(`/create-assesment`);
  };

  const handleViewMore = (result) => {
    axios
      .get(`${endpoints.assementQP.assementViewmore}${result.id}/qp-questions-list/`, {
        headers: { 'x-api-key': 'vikash@12345#1231' },
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          setData(result.data.result);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  };

  const { result } = props;
  console.log(result, 'result', data);
  return (
    <Paper
      className={classes.root}
      style={isMobile ? { margin: '0rem auto' } : { margin: '0rem auto -1.1rem auto' }}
    >
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Box>
            <Typography
              className={classes.title}
              variant='p'
              component='p'
              color='primary'
            >
              {result.paper_name}
            </Typography>
          </Box>
          <Box>
            <Typography
              className={classes.content}
              variant='p'
              component='p'
              color='secondary'
              noWrap
            >
              {result.is_draft ? 'Draft' : ''}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4} className={classes.textRight}>
          <Box>
            <span
              className='period_card_menu'
              //   onClick={() => handlePeriodMenuOpen(index)}
              //   onMouseLeave={handlePeriodMenuClose}
            >
              <IconButton
                className='moreHorizIcon'
                color='primary'
                onClick={handleMenuOpen}
              >
                <MoreHorizIcon />
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
                {menuOptions.map((option) => (
                  <MenuItem
                    className='assesment-card-popup-menu-item'
                    key={option}
                    selected={option === 'Pyxis'}
                    onClick={handleAddToTest}
                    style={{
                      color: themeContext.palette.primary.main,
                    }}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Popover>
            </span>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} />
        <Grid item xs={6}>
          <Box>
            <Typography
              className={classes.title}
              variant='p'
              component='p'
              color='secondary'
            >
              Created on
            </Typography>
          </Box>
          <Box>
            <Typography
              className={classes.content}
              variant='p'
              component='p'
              color='secondary'
            >
              {result.created_at.substring(0, 10)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} className={classes.textRight}>
          {/* {!periodColor &&  */}

          <Button
            variant='contained'
            style={{ color: 'white' }}
            color='primary'
            className='custom_button_master modifyDesign'
            size='small'
            onClick={(e) => handleViewMore(result)}
          >
            VIEW MORE
          </Button>

          {/* } */}
        </Grid>
      </Grid>
    </Paper>
  );
};

const mapDispatchToProps = (dispatch) => ({
  initAddQuestionPaperToTest: (data) => dispatch(addQuestionPaperToTest(data)),
});

export default connect(null, mapDispatchToProps)(QuestionCard);
