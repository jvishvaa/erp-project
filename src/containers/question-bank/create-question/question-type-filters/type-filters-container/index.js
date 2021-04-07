import React, { useState, useEffect, useRef, useContext } from 'react';
import { Grid, TextField, Button, useTheme } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import endpoints from '../../../../../config/endpoints';
import axiosInstance from '../../../../../config/axios';
import { AlertNotificationContext } from '../../../../../context-api/alert-context/alert-state';

const TypeFiltersContainer = ({ levels, categories, filterData, setFilterData }) => {
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [questionTypes, setQuestionTypes] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [isEdit, setIsEdit] = useState(true);
  const [desc, setDesc] = useState();
  const descBox = useRef(null);

  const handleLevel = (event, value) => {
    setFilterData({ ...filterData, level: '' });
    if (value) {
      setFilterData({ ...filterData, level: value });
    }
  };

  const handleCategory = (event, value) => {
    setFilterData({ ...filterData, category: '' });
    if (value) {
      setFilterData({ ...filterData, category: value });
    }
  };

  const handleType = (event, value) => {
    setFilterData({ ...filterData, type: '' });
    if (value) {
      setFilterData({ ...filterData, type: value });
    }
  };

  useEffect(() => {
    axiosInstance
      .get(`${endpoints.createQuestionApis.questionType}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setQuestionTypes(result.data?.result?.filter((obj) => obj?.id !== 5));
        } else {
          setAlert('error', result.data?.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  }, []);

  return (
    <Grid container spacing={isMobile ? 3 : 5}>
      <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleLevel}
          id='level'
          className='dropdownIcon questionTypeFilter'
          value={filterData?.level}
          options={levels}
          getOptionLabel={(option) => option?.level}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              variant='outlined'
              label='Question Level'
              placeholder='Question Level'
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleCategory}
          id='category'
          className='dropdownIcon questionTypeFilter'
          value={filterData?.category}
          options={categories}
          getOptionLabel={(option) => option?.category}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              variant='outlined'
              label='Category'
              placeholder='Category'
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleType}
          id='type'
          className='dropdownIcon questionTypeFilter'
          value={filterData?.type}
          options={questionTypes}
          getOptionLabel={(option) => option?.question_type}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              variant='outlined'
              label='Question &#38; answer type'
              placeholder='Question &#38; answer type'
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default TypeFiltersContainer;
