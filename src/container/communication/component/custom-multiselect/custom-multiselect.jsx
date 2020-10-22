/* eslint-disable no-debugger */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import './custom-multiselect.css';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
    maxWidth: 400,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    color: '#014B7E',
  },
  chip: {
    margin: 2,
    zIndex: 5,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, selections, theme) {
  return {
    fontWeight:
      selections.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

// eslint-disable-next-line no-unused-vars
const CustomMultiSelect = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const { selections, setSelections, nameOfDropdown, optionNames } = props || {};

  const handleChange = (event) => {
    setSelections(event.target.value);
  };

  const handelRemove = (name) => {
    setSelections(selections.filter((item) => item !== name));
  };

  return (
    <div className='custom_multiselect_wrapper'>
      <FormControl variant='outlined' className={classes.formControl}>
        <InputLabel id='demo-mutiple-chip-label'>{nameOfDropdown}</InputLabel>
        <Select
          labelId='demo-mutiple-chip-label'
          id='demo-mutiple-chip'
          multiple
          value={selections}
          onChange={handleChange}
          input={<Input id='select-multiple-chip' />}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  className={classes.chip}
                  onDelete={() => handelRemove(value)}
                  onMouseDown={(event) => {
                    event.stopPropagation();
                  }}
                />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {optionNames.map((name) => (
            <MenuItem key={name} value={name} style={getStyles(name, selections, theme)}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default CustomMultiSelect;
