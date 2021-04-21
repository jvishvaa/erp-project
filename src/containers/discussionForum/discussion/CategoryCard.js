import React from 'react';
import { Typography, Button, withStyles, makeStyles, Grid } from '@material-ui/core';
import MuiPaper from '@material-ui/core/Paper';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { useSelector, useDispatch } from 'react-redux';
import { editCategoryDataAction } from '../../../redux/actions/discussionForumActions';

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

const CategoryCard = ({selectedId, data, editCategory}) => {
  const classes = useStyles({});
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = React.useState(false);
  //console.log(data)
  const handleEdit = () => {
    editCategory(data);
    setIsEdit(true);
    dispatch(editCategoryDataAction(data));
  };

  return (
      <StyledPaper className={`${selectedId === data.sub_sub_category_id ? classes.selectedCard : ''}`}>
        <Grid container>
          <Grid item xs={10}>
            <Typography className={classes.categoryTitle}>
              {data.category}
            </Typography>
            <Typography className={classes.subCategoryTitle}>
              {data.sub_category_name}
            </Typography>
            <Typography className={classes.subSubCategoryTitle}>
              {data.sub_sub_category_name}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            {data.is_delete ? <CancelIcon className={classes.inactiveIcon} />
              : <CheckCircleIcon className={classes.activeIcon} />
            }
          </Grid>
          <Grid itxm xs={12} className={classes.actionGrid}>
              {selectedId !== data.sub_sub_category_id && (
                <StyledButton
                  variant='contained'
                  color='primary'
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
