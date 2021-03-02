import React, { Fragment } from 'react';
import {
  Grid,
  Typography,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import DiscussionForum from './DiscussionForum';
import FilterIcon from '../../../components/icon/FilterIcon';
// import CategoryCard from '../categoryData';

const useStyles = makeStyles({
  root: {
    backgroundColor: '#f9f9f9',
  },
  cardTitle: {
    color: '#014B7E',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  categoryBox: {
    padding: '15px 15px 0px 15px',
  },
  categoryContainer: {
    padding: '18px 25px 25px 25px',
  },
  closeFilterButton: {
    color: '#014B7E',
    fontSize: '16px',
    fontFamily: 'Raleway',
    lineHeight: '19px',
    marginTop: 'auto',
  },
});

const SelectInput = withStyles({
  root: {
    height: '20px',
    width: '250px',
    color: '#014B7E',
  },
})(Select);

const StyledButton = withStyles({
  root: {
    color: '#014B7E',
    fontSize: '16px',
    fontFamily: 'Raleway',
    textTransform: 'capitalize',
    verticalAlign: 'bottom',
  },
  iconSize: {},
})(Button);

// Discusion_forum/Category
function CategoryPage() {
  const classes = useStyles({});

  const [category, setCategory] = React.useState('category1');

  const handleChange = (e) => {
    setCategory(e.target.value);
  };

  return (
    <>
      <Grid container className={classes.root}>
        <Grid item xs={12} className={classes.categoryBox}>
          <Typography className={classes.cardTitle}>Dashboard</Typography>
          <Grid container className={classes.categoryContainer}>
            <Grid item sm={3}>
              <FormControl
                variant='outlined'
                color='primary'
                className={classes.formControl}
              >
                <InputLabel id='demo-simple-select-outlined-label'>Category</InputLabel>
                <SelectInput
                  className={classes.selectInputCategory}
                  labelId='demo-simple-select-outlined-label'
                  id='demo-simple-select-outlined'
                  value={category}
                  onChange={handleChange}
                  label='Category'
                >
                  <MenuItem value='category1'>Category</MenuItem>
                  <MenuItem value='category2'>Category 2</MenuItem>
                  <MenuItem value='category3'>Category 3</MenuItem>
                </SelectInput>
              </FormControl>
            </Grid>

            <Grid item sm={3}>
              <FormControl
                variant='outlined'
                color='primary'
                className={classes.formControl}
              >
                <InputLabel id='demo-simple-select-outlined-label'>
                  Sub-category
                </InputLabel>
                <SelectInput
                  labelId='demo-simple-select-outlined-label'
                  id='demo-simple-select-outlined'
                  value={category}
                  onChange={handleChange}
                  label='Sub-category'
                >
                  <MenuItem value='category1'>Category</MenuItem>
                  <MenuItem value='category2'>Category 2</MenuItem>
                  <MenuItem value='category3'>Category 3</MenuItem>
                </SelectInput>
              </FormControl>
            </Grid>

            <Grid item sm={3}>
              <FormControl
                variant='outlined'
                color='primary'
                className={classes.formControl}
              >
                <InputLabel id='demo-simple-select-outlined-label'>
                  Sub-sub category
                </InputLabel>
                <SelectInput
                  labelId='demo-simple-select-outlined-label'
                  id='demo-simple-select-outlined'
                  value={category}
                  onChange={handleChange}
                  label='Sub-sub category'
                >
                  <MenuItem value='category1'>Category</MenuItem>
                  <MenuItem value='category2'>Category 2</MenuItem>
                  <MenuItem value='category3'>Category 3</MenuItem>
                </SelectInput>
              </FormControl>
            </Grid>
            <StyledButton variant='text' size='small' endIcon={<FilterIcon />}>
              Close filter
            </StyledButton>
          </Grid>
        </Grid>
        <DiscussionForum />
      </Grid>
    </>
  );
}

export default CategoryPage;
