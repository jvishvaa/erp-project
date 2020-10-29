import React from 'react';
import TextField from '@material-ui/core/TextField';

export default function CustomInput(props) {
  const { onChange, className, name, id, value } = props || {};
  return (
    <TextField
      id={id}
      value={value}
      label={name}
      className={className}
      onChange={onChange}
      variant='outlined'
    />
  );
}
