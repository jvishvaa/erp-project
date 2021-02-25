import React from 'react';
import {
  Typography,
  makeStyles,
  Button,
  withStyles,
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import RightArrow from '../icon/RightArrow';
import LeftArrow from '../icon/LeftArrow';

const useStyles = makeStyles({
  contentDiv: {
    marginTop: '17px',
    minHeight: '140px',
    padding: '5px 0',
    border: '1px solid #C9C9C9',
    borderRadius: '10px',
    backgroundColor: '#FFFFFF',
  },
  listItem: {
    height: '36px',
  },
  listItemText: {
    backgroundColor: '#EEEEEE',
  },
  buttonGrid: {
    display: 'flex',
  },
  leftArrow: {
    color: '#8C8C8C',
    marginTop: 'auto',
    fontSize: '16px',
  },
  rightArrow: {
    marginLeft: '10px',
    marginTop: 'auto',
  },
});

const StyledButton = withStyles({
  root: {
    marginTop: 'auto',
    color: '#014B7E',
    fontSize: '18px',
    padding: '5px 12px',
    textTransform: 'capitalize',
    backgroundColor: 'transparent',
  },
})(Button);

export default function SlectedFilterBox(props) {
  const itemList = props.itemList ?? [];
  const classes = useStyles({});
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography className={classes.contentTitle}>{props.filterTitle}</Typography>
      </Grid>
      <Grid item xs={8}>
        <div className={classes.contentDiv}>
          <List component='nav' aria-label='secondary mailbox folder'>
            {itemList.map((el, id) => (
              <ListItem
                key={id}
                button
                selected={selectedIndex === id}
                onClick={(event) => handleListItemClick(event, id)}
                className={classes.listItem}
              >
                <ListItemText primary={`Grade ${id}`} />
              </ListItem>
            ))}
          </List>
        </div>
      </Grid>
      <Grid item xs={4} className={classes.buttonGrid}>
        <StyledButton variant='text'>Expand</StyledButton>
        <span className={classes.rightArrow}>
          <LeftArrow />
          <RightArrow />
        </span>
      </Grid>
    </Grid>
  );
}
export const SlectedFilter = React.memo(SlectedFilterBox);
