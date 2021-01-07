import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import './discussionForum.scss';

const useStyles = makeStyles((theme) => ({
  typography: {
      color: 'red',
     padding: theme.spacing(1),
     fontSize:12,
    
  },
}));

export default function UpdateDeltePopoverClick() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
        <MoreHorizIcon  onClick={handleClick}/>
      
      <Popover
        className="pop-overs"
        id={"praveen"}
        open={open}
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
      >
        <Typography className={classes.typography}>DELETE POST</Typography>
        <Typography className={classes.typography}>EDIT POST</Typography>
      </Popover>
    </div>
  );
}

