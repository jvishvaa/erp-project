import React, { useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import Grid from '@material-ui/core/Grid';
import countryList from './list';

const useStyles = makeStyles((theme) => ({
  margin: {
    marginTop: '0px',
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

export default function CustomizedSelects(props) {
  const { name, handlePropsData, value } = props || {};
  const classes = useStyles();
  const handleChange = (event) => {
    handlePropsData(event.target.value);
  };

  useEffect(()=>{
    handlePropsData('+91')
  },[])

  return (
    <FormControl variant='outlined' margin='dense' fullWidth className={classes.margin}>
      <InputLabel>Code</InputLabel>
      <Select
        label='code'
        id={name}
        value={value || '+91'}
        name={name}
        onChange={(e) => handleChange(e)}
        MenuProps={MenuProps}
      >
        {countryList.map((code, index) => {
          return (
            <MenuItem id={code.country} key={code.country} value={code.callingCode}>
              {code.country}({code.callingCode})
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
