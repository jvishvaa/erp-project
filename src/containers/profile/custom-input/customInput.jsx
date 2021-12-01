/* eslint-disable react/jsx-wrap-multilines */
import React, { useState } from 'react';
import { InputAdornment, Input, IconButton, InputBase ,TextField} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';


const CustomInput = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const { onChange, className, name, readonly, autoFocus, id, placeholder, type, value } = props;

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
          inputProps={{ maxLength: 20 }}
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
        : type === 'date' ? (
          <InputBase
            className={className}
            id={id}
            placeholder={placeholder}
            readOnly={readonly}
            name={name}
            defaultValue={value}          
            autoComplete='off'
            type={'date'}
            autoFocus = {autoFocus}
            onChange={onChange}
            inputProps={{ max: new Date().toISOString().slice(0, 10) }}

          />
          // <TextField
          //   // variant='outlined'
          //   type='date'
          //   size='small'
          //   className={className}
          //   id={id}
          //   placeholder={placeholder}
          //   readOnly={readonly}
          //   name={name}
          //   // defaultValue={value}
          //   inputProps={{ max: new Date().toISOString().slice(0, 10) }}
          //   className='date-time-picker bg-white'
          //   value={value}
          //   color='primary'
          //   // style={{ width: isMobile ? '50%' : '100%' }}
          //   onChange={onChange}
          // />

        ) : (
          <InputBase
            className={className}
            id={id}
            placeholder={placeholder}
            readOnly={readonly}
            name={name}
            defaultValue={value}
            autoComplete='off'
            type={type || 'text'}
            autoFocus={autoFocus}
            onChange={onChange}
            inputProps={{
              form: {
                autocomplete: 'off',
              },
              maxLength: 60
            }}
          />
        )}
    </>
  );
};
export default CustomInput;
