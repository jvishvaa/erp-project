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
    marginLeft: '30px',
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
    marginTop: '10px',
  },
})(Button);

const StyledTextField = withStyles({
  root: {
    borderRadius: '10px',
    marginBottom: '40px',
  },
})(TextField);

const CategoryEdit = (props) => {
  const classes = useStyles({});
  const [category, setCategory] = React.useState(props.cardData.category);
  const [subCategory, setSubCategory] = React.useState(props.cardData.subCategory);
  const [subSubCategory, setSubSubCategory] = React.useState(
    props.cardData.subSubCategory
  );
  const [activeCategory, setActiveCategory] = React.useState(
    props.cardData.status === 'active'
  );

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

  const hadleClose = () => {
    props.hadleClose();
  };

  return (
    <Box className={classes.paperStyles}>
        <div className={classes.closeIcon}>
            <CloseIcon onClick={hadleClose} />
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
            <FormControlLabel
              control={(
                <Switch
                  checked={activeCategory}
                  onChange={handleCategoryStatus}
                  className={classes.switchButton}
                />
              )}
            />
          <span className={classes.activeLabel}>Active</span>
        </div>
        <StyledButton>Save</StyledButton>
      </Box>
  );
};

export default CategoryEdit;
