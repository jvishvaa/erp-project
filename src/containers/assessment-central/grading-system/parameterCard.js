import React, { useEffect, useState, useRef } from 'react';
import { Grid, TextField } from '@material-ui/core';

const ParameterCard = ({ index, parameterData, ParameterChange, isEdit }) => {
  const firstUpdate = useRef(true);
  const [parameters, setParameters] = useState(parameterData);
  const [edit, setIsEdit] = useState(isEdit ? true : false);

  useEffect(() => {
    // if (firstUpdate.current) {
    //   firstUpdate.current = false;
    //   return;
    // }
    ParameterChange(index, 'parameter_name', parameters?.parameter_name);
  }, [parameters?.parameter_name]);

  useEffect(() => {
    if (parameterData) {
        setParameters(parameterData);
        setIsEdit(false);
    }
  }, [edit]);

  useEffect(() => {
    // if (firstUpdate.current) {
    //   firstUpdate.current = false;
    //   return;
    // }
    ParameterChange(index, 'parameter_description', parameters?.parameter_description);
  }, [parameters?.parameter_description]);

  return (
    <Grid container md={12} style={{ padding: '1%' }}>
      <Grid item md={3} sm={6} xs={12}>
        <TextField
          fullWidth
          className='grade-name'
          label='Parameter Name'
          variant='outlined'
          size='small'
          autoComplete='off'
          name='ParameterName'
          value={parameters?.parameter_name}
          onChange={(e) => {
            setParameters((prev) => ({ ...prev, parameter_name: e?.target?.value }));
          }}
          required
        />
      </Grid>
      <Grid item md={8} sm={6} xs={12} style={{ marginLeft: '2%' }}>
        <TextField
          fullWidth
          className='grade-name'
          label='Parameter Description'
          variant='outlined'
          size='small'
          autoComplete='off'
          name='ParameterDescription'
          value={parameters?.parameter_description}
          onChange={(e) => {
            setParameters((prev) => ({
              ...prev,
              parameter_description: e?.target?.value,
            }));
          }}
          required
        />
      </Grid>
    </Grid>
  );
};

export default ParameterCard;
