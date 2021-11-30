/* eslint-disable react/jsx-wrap-multilines */
import React, { useState } from 'react';
import { InputAdornment, Input, IconButton, InputBase ,Grid} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';


const CustomInput = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const { onChange, className, name, readonly, autoFocus , id, placeholder, type, value } = props;

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {type === 'password' ? (
        <Input
          className={className}
          id={id}
          placeholder={placeholder}
          name={name}
          readOnly={readonly}
          autoComplete='off'
          defaultValue={value}
          onChange={onChange}
          inputProps={{maxLength:20}}
          type={showPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position='start'>
              <IconButton
                aria-label='toggle password visibility'
                onClick={handleClickShowPassword}
                edge='end'
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      ) 
      : (
        <InputBase
          className={className}
          id={id}
          placeholder={placeholder}
          readOnly={readonly}
          name={name}
          defaultValue={value}
          inputProps={{maxLength:20}}
          autoComplete='off'
          type={type ||'text'}
          autoFocus = {autoFocus}
          onChange={onChange}
          inputProps={{
            form: {
              autocomplete: 'off',
            },
          }}
        />
      )}
    </>
  );
};
export default CustomInput;
