import React from 'react';
import { Typography, Button, withStyles, makeStyles, Grid } from '@material-ui/core';
import MuiPaper from '@material-ui/core/Paper';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles({
  categoryTitle: {
    color: '#014B7E',
    fontSize: '20px',
    fontFamily: 'Raleway',
    fontWeight: 'bold',
    lineHeight: '24px',
  },
  subCategoryTitle: {
    marginTop: '10px',
    color: '#014B7E',
    fontSize: '20px',
    fontFamily: 'Raleway',
    fontWeight: 400,
    lineHeight: '24px',
  },
  subSubCategoryTitle: {
    marginTop: '10px',
    color: '#FF6B6B',
    fontSize: '20px',
    fontFamily: 'Raleway',
    fontWeight: 300,
    lineHeight: '24px',
  },
  actionGrid: {
    display: 'block',
    height: '42px',
  },
  editButton: {
    float: 'right',
    display: 'flex',
    marginLeft: 'auto',
  },
  activeIcon: {
    float: 'right',
    color: '#49ba60',
  },
  inactiveIcon: {
    float: 'right',
    color: '#ff2442',
  },
  selectedCard: {
    border: '1px solid #FE6B6B !important',
    backgroundColor: '#FFF6F6',
  },
});

const StyledButton = withStyles({
  root: {
    backgroundColor: '#FF6B6B',
    color: '#FFFFFF',
    width: '156px',
    height: '36px',
    borderRadius: '10px',
    marginTop: '10px',
  },
})(Button);

const StyledPaper = withStyles({
  root: {
    margin: '10px',
    padding: '14px 20.25px 20px 27px',
    border: '1px solid #E2E2E2',
    borderRadius: '12px',
    boxShadow: '0px 0px 4px #00000029',
  },
})(MuiPaper);

const CategoryCard = (props) => {
  const classes = useStyles({});
  const [isEdit, setIsEdit] = React.useState(props.isEdit);
  const handleEdit = () => {
    props.editCategory(props);
    setIsEdit(true);
  };

  return (
      <StyledPaper className={`${isEdit? classes.selectedCard : ''}`}>
        <Grid container>
          <Grid item xs={10}>
            <Typography className={classes.categoryTitle}>
              {props.category}
            </Typography>
            <Typography className={classes.subCategoryTitle}>
              {props.subCategory}
            </Typography>
            <Typography className={classes.subSubCategoryTitle}>
              {props.subSubCategory}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            {props.status !== 'undefined' && props.status === 'active' ?
              <CheckCircleIcon className={classes.activeIcon} />
              : <CancelIcon className={classes.inactiveIcon} />
            }
          </Grid>
          <Grid itxm xs={12} className={classes.actionGrid}>
              {!isEdit && (
                <StyledButton
                  variant='contained'
                  color='secondary'
                  className={classes.editButton}
                  onClick={handleEdit}
                >
                  Edit
                </StyledButton>
              )}
          </Grid>
        </Grid>
    </StyledPaper>
  );
};

export default CategoryCard;

// export default CategoryCard = React.memo(CategoryCardComponent);
