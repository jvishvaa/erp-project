import React from 'react';
import {
  makeStyles,
  withStyles,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
// import ArrowBackIcon from '@material-ui/icons/ArrowBack';
// import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import RightArrow from '../../../components/icon/RightArrow';
import LeftArrow from '../../../components/icon/LeftArrow';
import AcademicYear from '../../../components/icon/AcademicYear';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    height: '223px',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '22px',
  },
  accordion: {
    display: 'flex',
  },
  academicYear: {
    fontSize: '120px',
    height: '166px',
  },
  item: {
    display: 'none',
  },
  item1: {
    display: 'flex',
    height: '223px',
    width: '72px',
    padding: '20px',
    backgroundColor: '#FEF5F5',
    borderRadius: '10px 10px 10px 10px',
    alignItems: 'center',
    cursor: 'pointer',
  },
  item2: {
    display: 'flex',
    height: '223px',
    width: '72px',
    padding: '20px',
    backgroundColor: '#FFE5E5',
    borderRadius: '10px 10px 10px 10px',
    alignItems: 'center',
    cursor: 'pointer',
  },
  item3: {
    display: 'flex',
    height: '223px',
    width: '72px',
    padding: '20px',
    backgroundColor: '#FFEFEF',
    borderRadius: '10px 10px 10px 10px',
    alignItems: 'center',
    cursor: 'pointer',
  },
  item4: {
    display: 'flex',
    height: '223px',
    width: '72px',
    padding: '20px',
    backgroundColor: '#FEF5F5',
    borderRadius: '10px 10px 10px 10px',
    alignItems: 'center',
    cursor: 'pointer',
  },
  title: {
    display: 'inline-block',
    width: '183px',
    color: '#014B7E',
    fontSize: '20px',
    fontWeight: 300,
    fontFamily: 'Raleway',
    transform: 'rotate(-90deg)',
    lineHeight: '24px',
    marginTop: 'auto',
    marginBottom: '10px',
  },
  contentTitle: {
    color: '#014B7E',
    fontSize: '20px',
    fontWeight: 400,
    fontFamily: 'Raleway',
  },
  content: {
    display: 'none',
    transition: 'all 0.5s cubic-bezier(0,1,0,1)',
  },
  contentShow: {
    display: 'inline-block',
    height: '223px',
    width: '500px',
    padding: '20px',
    marginRight: '-15px',
    marginLeft: '-15px',
    backgroundColor: '#FFD9D9',
    borderRadius: '10px',
    transition: 'all 0.5s cubic-bezier(1,0,1,0)',
    zIndex: 1,
  },
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

export default function FiltersComponent() {
  const classes = useStyles({});

  const [expanded, setExpanded] = React.useState('panel1');
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(panel);
  };

  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.accordion}>
        <div
          className={`${
            expanded === 'panel1'
              ? classes.item
                : expanded === 'panel2'
                ? classes.item2
                : expanded === 'panel3'
                ? classes.item3
                : classes.item1
          }`}
          onClick={handleChange('panel1')}
        >
          <AcademicYear text="Academic Year" />
        </div>
        <div
          className={`${expanded === 'panel1' ? classes.contentShow : classes.content}`}
        >
          <Grid container>
            <Grid item xs={12}>
              <Typography className={classes.contentTitle}>Academic Year</Typography>
            </Grid>
            <Grid item xs={8}>
              <div className={classes.contentDiv}>
                <List component="nav" aria-label="secondary mailbox folder">
                  <ListItem
                    button
                    selected={selectedIndex === 2}
                    onClick={(event) => handleListItemClick(event, 2)}
                    className={classes.listItem}
                  >
                    <ListItemText primary="2019-2020" />
                  </ListItem>
                  <ListItem
                    button
                    selected={selectedIndex === 3}
                    onClick={(event) => handleListItemClick(event, 3)}
                    className={classes.listItem}
                  >
                    <ListItemText primary="2020-2021" />
                  </ListItem>
                </List>
              </div>
            </Grid>
              <Grid item xs={4} className={classes.buttonGrid}>
                <StyledButton variant="text">Expand</StyledButton>
                <span className={classes.rightArrow}>
                  <LeftArrow />
                  <RightArrow />
                </span>
            </Grid>
          </Grid>
        </div>

        <div
          className={`${
            expanded === 'panel2'
              ? classes.item
              : expanded === 'panel1'
              ? classes.item2
              : expanded === 'panel3'
              ? classes.item2
              : classes.item3
          }`}
          onClick={handleChange('panel2')}
        >
          <AcademicYear text="Grade" />
        </div>
        <div
          className={`${expanded !== 'panel2' ? classes.content : classes.contentShow}`}
        >
          <Grid container>
              <Grid item xs={12}>
                  <Typography className={classes.contentTitle}>Grade</Typography>
            </Grid>
              <Grid item xs={8}>
                  <div className={classes.contentDiv}>
                      <List component="nav" aria-label="secondary mailbox folder">
                          {[1,2,3].map((el,id) => (
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
                  <StyledButton variant="text">Expand</StyledButton>
                  <span className={classes.rightArrow}>
                      <LeftArrow />
                      <RightArrow />
              </span>
            </Grid>
          </Grid>
        </div>

        <div
          className={`${
            expanded === 'panel3'
              ? classes.item
              : expanded === 'panel1'
              ? classes.item3
              : expanded === 'panel2'
              ? classes.item2
              : classes.item2
          }`}
          onClick={handleChange('panel3')}
        >
          <AcademicYear text="Grade" />
        </div>
        <div
          className={`${expanded !== 'panel3' ? classes.content : classes.contentShow}`}
        >
          <Grid container>
              <Grid item xs={12}>
                  <Typography className={classes.contentTitle}>Grade</Typography>
            </Grid>
              <Grid item xs={8}>
                  <div className={classes.contentDiv}>
                      <List component="nav" aria-label="secondary mailbox folder">
                          {[1,2,3].map((el,id) => (
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
                  <StyledButton variant="text">Expand</StyledButton>
                  <span className={classes.rightArrow}>
                      <LeftArrow />
                      <RightArrow />
              </span>
            </Grid>
            </Grid>
        </div>

        <div
          className={`${
            expanded === 'panel4'
              ? classes.item
              : expanded === 'panel1'
              ? classes.item1
              : expanded === 'panel2'
              ? classes.item3
              : classes.item2
          }`}
          onClick={handleChange('panel4')}
        >
          <AcademicYear text="Section" />
        </div>
        <div
          className={`${expanded !== 'panel4' ? classes.content : classes.contentShow}`}
        >
          <Grid container>
              <Grid item xs={12}>
                  <Typography className={classes.contentTitle}>Section</Typography>
            </Grid>
              <Grid item xs={8}>
                  <div className={classes.contentDiv}>
                      <List component="nav" aria-label="secondary mailbox folder">
                          {[1,2,3].map((el,id) => (
                              <ListItem
                                  key={id}
                                  button
                                  selected={selectedIndex === id}
                                  onClick={(event) => handleListItemClick(event, id)}
                      className={classes.listItem}
                                >
                                  <ListItemText primary={`Section ${id}`} />
                                </ListItem>
                  ))}
                        </List>
              </div>
            </Grid>
              <Grid item xs={4} className={classes.buttonGrid}>
                  <StyledButton variant="text">Expand</StyledButton>
                  <span className={classes.rightArrow}>
                      <LeftArrow />
                      <RightArrow />
              </span>
                </Grid>
            </Grid>
        </div>
      </div>
    </div>
  );
}

export const Filters = React.memo(FiltersComponent);
