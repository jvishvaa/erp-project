import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import { CardHeader, Avatar, TextField, Chip } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Autocomplete } from '@material-ui/lab';
import { fetchBranchesForCreateUser } from '../../../../redux/actions';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& .MuiSvgIcon-root': {
      color: '#fff',
    },
    '& .MuiChip-label': {
      color: theme.palette.primary.primarydark,
    },
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.main,
    paddingBottom: 0,
    '& .MuiCardHeader-action': {
      alignSelf: 'center',
      paddingRight: 10,
    },
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#ffffff',
  },
  acad_year: {
    fontSize: 10,
    fontWeight: 'bold',
    borderColor: '#ffffff',
    '& .MuiChip-label': {
      color: '#ffffff',
    },
  },
  cardBody: {
    // height: 150,
    height: 168,
    overflowY: 'auto',
    backgroundColor: theme.palette.primary.main,
    '& .MuiFormLabel-root': {
      color: '#ffffff',
    },
    '& .MuiAutocomplete-tag': {
      color: '#ffffff',
    },
  },
}));

const DashFilterWidget = ({ setBranchIds }) => {
  const classes = useStyles();
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [branches, setBranches] = useState([]);
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const navData = JSON.parse(localStorage.getItem('navigationData')) || [];
  const [moduleId, setModuleId] = useState();

  /* action to fetch branches */
  const fetchBranches = (acadId) => {
    fetchBranchesForCreateUser(acadId, moduleId).then((data) => {
      let transformedData = [
        {
          branch_name: 'Select All',
          id: 'all',
        },
      ];
      if (data?.length) {
        data.map((obj) =>
          transformedData.push({
            id: obj.id,
            branch_name: obj.branch_name,
          })
        );
        setBranches(transformedData);
        setSelectedBranches([transformedData[1]]);
        setBranchIds([transformedData[1]?.id]);
      }
    });
  };

  /* use effect to determine and set child module ID */
  useEffect(() => {
    if (navData && navData?.length) {
      for (let i = 0; i < navData.length; i++) {
        if (navData[i].child_module.length) {
          setModuleId(navData[i].child_module[0].child_id);
          break;
        }
      }
    }
  }, []);

  /* use effect to set branches */
  useEffect(() => {
    if (selectedYear && moduleId) {
      fetchBranches(selectedYear?.id);
    }
  }, [selectedYear, moduleId]);

  /* handle branches on change */
  const handleBranches = (event, value) => {
    setSelectedBranches([branches[1]]);
    setBranchIds([branches[1].id]);
    if (value?.length > 0) {
      value =
        value.filter(({ id }) => id === 'all').length === 1
          ? [...branches].filter(({ id }) => id !== 'all')
          : value;
      const ids = value.map((obj) => obj.id);
      setBranchIds(ids);
      setSelectedBranches(value);
    }
  };

  return (
    <Card className={classes.root} variant='outlined'>
      <CardHeader
        className={classes.cardHeader}
        titleTypographyProps={{
          className: classes.title,
          variant: 'h6',
          color: 'secondary',
        }}
        title='Dashboard Filters'
        action={
          <Chip
            variant='outlined'
            size='small'
            className={classes?.acad_year}
            label={selectedYear?.session_year}
          />
        }
        avatar={
          <Avatar aria-label='report-title' className={classes.avatar}>
            <FilterListIcon fontSize='small' />
          </Avatar>
        }
      />
      <CardContent className={classes.cardBody}>
        <Autocomplete
          size='small'
          limitTags={2}
          multiple
          onChange={handleBranches}
          id='dash__filter-grade'
          options={branches || []}
          getOptionLabel={(option) => option?.branch_name || ''}
          filterSelectedOptions
          value={selectedBranches || []}
          renderInput={(params) => (
            <TextField {...params} label='Branches' placeholder='Branches' />
          )}
        />
      </CardContent>
    </Card>
  );
};

export default DashFilterWidget;
