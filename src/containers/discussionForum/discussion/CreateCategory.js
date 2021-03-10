import React from 'react';
import {
  Paper,
  Grid,
  Typography,
  Button,
  withStyles,
  makeStyles,
  InputBase,
  Divider,
} from '@material-ui/core';

const useStyles = makeStyles({
  paperStyle: {
    height: '100%',
  },
  containerGrid: {
    padding: '15px 100px 150px 44px',
  },
  categoryTitle: {
    color: '#014B7E',
    fontSize: '20px',
    fontWeight: 'bold',
    fontFamily: 'Raleway',
    lineHeight: '24px',
  },
  dividerLine: {
    marginTop: '19px',
  },
});

const StyledButton = withStyles({
  root: {
    backgroundColor: '#FF6B6B',
    color: '#FFFFFF',
    height: '42px',
    marginTop: '29px',
  },
})(Button);

const StyledInput = withStyles({
  root: {
    height: '42px',
    width: '100%',
    padding: '5px 20px',
    border: '1px solid #DBDBDB',
    borderRadius: '10px',
    marginTop: '13px',
    marginBottom: '10px',
  },
})(InputBase);

const CreateCategory = () => {
  const classes = useStyles({});

  const [category, setCategory] = React.useState();
  const [subCategory, setSubCategory] = React.useState();
  const [subSubCategory, setSubSubCategory] = React.useState();

  const handleChangeCategory = (e) => {
    setCategory(e.target.value);
  };

  const handleSubCategory = (e) => {
    setSubCategory(e.target.value);
  };

  const handleSubSubCategory = (e) => {
    setSubSubCategory(e.target.value);
  };

  return (
    <Paper className={classes.paperStyle}>
      <Grid container>
        <Grid item xs={12} className={classes.containerGrid}>
          <form>
            <Typography className={classes.categoryTitle}>Category</Typography>
            <StyledInput
              placeholder='Type or select from filters above'
              value={category}
              onChange={handleChangeCategory}
              fullWidth
            />

            <Typography className={classes.categoryTitle}>Sub - category</Typography>
            <StyledInput
              placeholder='Type or select from filters above'
              value={subCategory}
              onChange={handleSubCategory}
              fullWidth
            />

            <Typography className={classes.categoryTitle}>Sub - sub category</Typography>
            <StyledInput
              placeholder='Type or select from filters above'
              value={subSubCategory}
              onChange={handleSubSubCategory}
              fullWidth
            />

            <Divider className={classes.dividerLine} />

            <StyledButton variant='contained' color='inherit'>
              Submit
            </StyledButton>
          </form>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CreateCategory;
