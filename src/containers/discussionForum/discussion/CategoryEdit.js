import React from 'react';
import {
  Box,
  Button,
  makeStyles,
  withStyles,
  TextField,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useSelector, useDispatch } from 'react-redux';
import { updateAllCategory } from '../../../redux/actions/discussionForumActions';

const useStyles = makeStyles({
  paperStyles: {
    textAlign: 'center',
    backgroundColor: '#FFF6F6',
    border: '1px solid #FE6B6B',
    borderRadius: '12px',
    marginTop: '10px',
    marginLeft: '10px',
    padding: '10px 20px',
    transition: '3s',
  },
  formControl: {
    marginBottom: '40px',
  },
  switchButton: {
    marginLeft: '10px',
    marginRight: '10px',
  },
  activeLabel: {
    color: '#014B7E',
  },
  closeIcon: {
    float: 'right',
    marginBottom: '10px',
  },
});

const StyledButton = withStyles({
  root: {
    backgroundColor: '#FF6B6B',
    color: '#FFFFFF',
    width: '156px',
    height: '36px',
    borderRadius: '12px',
    marginTop: '20px',
    marginBottom: '10px',
  },
})(Button);

const StyledTextField = withStyles({
  root: {
    borderRadius: '10px',
    marginBottom: '40px',
  },
})(TextField);

const CategoryEdit = ({cardData, hadleClose}) => {
  const classes = useStyles({});
  const categoryData = useSelector((state) => state.discussionReducers.editCategoryData);
  const dispatch = useDispatch();
  const [category, setCategory] = React.useState('');
  const [subCategory, setSubCategory] = React.useState('');
  const [subSubCategory, setSubSubCategory] = React.useState();
  const [activeCategory, setActiveCategory] = React.useState(false);
  //console.log(categoryData, 'edit data');

  const handleChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubCategory = (e) => {
    setSubCategory(e.target.value);
  };

  const handleSubSubCategory = (e) => {
    setSubSubCategory(e.target.value);
  };

  const handleCategoryStatus = () => {
    setActiveCategory(!activeCategory);
  };

  const hadleCloseEdit = () => {
    hadleClose();
  };

  React.useEffect(() => {
    if(categoryData){
      setCategory(categoryData.category);
      setSubCategory(categoryData.sub_category_name);
      setSubSubCategory(categoryData.sub_sub_category_name);
      setActiveCategory(categoryData.is_delete);
    }
  },[categoryData])

  const handleUpdateCategory = () => {
    if(category !== categoryData.category) {
      const params = {category_name: category, category_type: "1"}
      const id = categoryData.category_id;
      //dispatch(updateAllCategory(params));
    }
    if(subCategory !== categoryData.sub_category_name) {
      const params = {category_name: subCategory, category_type: "2", category_parent_id: categoryData.category_id}
      const id = categoryData.sub_category_id;
      //dispatch(updateAllCategory(params));
    }
    if(subSubCategory !== categoryData.sub_sub_category_name) {
      const id = categoryData.sub_sub_category_id;
      const params = {category_name: subSubCategory, category_type: "3", category_parent_id: categoryData.sub_category_id}
      dispatch(updateAllCategory(params, id));
    }
  }

  return (
    <Box className={classes.paperStyles}>
      <div className={classes.closeIcon}>
        <CloseIcon onClick={hadleCloseEdit} />
      </div>
      <StyledTextField
        id="outlined-basic"
        label="Category type"
        variant="outlined"
        placeholder="Type or select from filters above"
        value={category}
        defaultValue={category}
        onChange={handleChange}
        fullWidth
      />
      <StyledTextField
        id="outlined-basic"
        label="Sub category type"
        variant="outlined"
        placeholder="Type or select from filters above"
        value={subCategory}
        onChange={handleSubCategory}
        fullWidth
      />
      <StyledTextField
        id="outlined-basic"
        label="Sub sub category type"
        variant="outlined"
        placeholder="Type or select from filters above"
        value={subSubCategory}
        onChange={handleSubSubCategory}
        fullWidth
      />
      <div>
        <span className={classes.activeLabel}>In-Active</span>
          <Switch
            checked={!activeCategory}
            onChange={handleCategoryStatus}
            className={classes.switchButton}
            color="primary"
          />
        {/* <FormControlLabel
          control={(
            <Switch
              checked={activeCategory}
              onChange={handleCategoryStatus}
              className={classes.switchButton}
              color="primary"
            />
          )}
          style={{display: 'inline !important'}}
        /> */}
        <span className={classes.activeLabel}>Active</span>
      </div>
      <StyledButton onClick={handleUpdateCategory}>Save</StyledButton>
    </Box>
  );
};

export default CategoryEdit;
