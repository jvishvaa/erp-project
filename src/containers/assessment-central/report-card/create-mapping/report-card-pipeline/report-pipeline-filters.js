import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Grid, TextField, Button, Paper } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { getBranch, getGrade, getSection, getSubject, getStatus } from '../../apis';

const PipelineFilters = ({ moduleId, filterData, setFilterData, setCurrentPage }) => {
  const { id: academicYearId = 1 } =
    useSelector((state) => state.commonFilterReducer?.selectedYear) || {};

  const [dropDownData, setDropDownData] = useState({
    branch: [],
    grade: [],
    section: [],
    subject: [],
    status: [],
  });

  const fetchBranch = async () => {
    try {
      const branch = await getBranch(moduleId, academicYearId);
      setDropDownData((prev) => ({
        ...prev,
        branch,
        grade: [],
        section: [],
        subject: [],
      }));
    } catch (err) {}
  };

  const fetchGrade = async (branchId) => {
    try {
      const grade = await getGrade(moduleId, academicYearId, branchId);
      setDropDownData((prev) => ({
        ...prev,
        grade,
        section: [],
        subject: [],
      }));
    } catch (err) {}
  };

  const fetchSection = async (branchId, gradeId) => {
    try {
      const section = await getSection(moduleId, academicYearId, branchId, gradeId);
      setDropDownData((prev) => ({ ...prev, section }));
    } catch (err) {}
  };

  const fetchSubject = async (branchId, gradeId) => {
    try {
      const subject = await getSubject(moduleId, academicYearId, branchId, gradeId);
      setDropDownData((prev) => ({ ...prev, subject }));
    } catch (err) {}
  };

  const fetchStatus = async () => {
    try {
      let status = await getStatus();
      status = status.map(([id, status]) => ({ id, status }));
      setDropDownData((prev) => ({ ...prev, status }));
    } catch (err) {}
  };

  const handleBranch = (event, branch) => {
    setCurrentPage(1);
    let filterObject = { branch: '', grade: '', section: '', subject: '' };
    setDropDownData((prev) => ({
      ...prev,
      grade: [],
      section: [],
      subject: [],
    }));
    if (branch) {
      fetchGrade(branch?.branch?.id);
      filterObject = { ...filterObject, branch };
    }
    setFilterData((prev) => ({
      ...prev,
      ...filterObject,
    }));
  };

  const handleGrade = (event, grade) => {
    setCurrentPage(1);
    let filterObject = { grade: '', section: '', subject: '' };
    setDropDownData((prev) => ({
      ...prev,
      section: [],
      subject: [],
    }));
    if (grade) {
      fetchSection(filterData?.branch?.branch?.id, grade?.grade_id);
      fetchSubject(filterData?.branch?.branch?.id, grade?.grade_id);
      filterObject = { ...filterObject, grade };
    }
    setFilterData((prev) => ({
      ...prev,
      ...filterObject,
    }));
  };

  const handleSection = (event, section) => {
    setCurrentPage(1);
    let filterObject = { section: '' };
    setDropDownData((prev) => ({
      ...prev,
      subject: [],
    }));
    if (section) {
      filterObject = { ...filterObject, section };
    }
    setFilterData((prev) => ({ ...prev, ...filterObject }));
  };

  const handleSubject = (event, subject) => {
    setCurrentPage(1);
    let filterObject = { subject: '' };
    if (subject) {
      filterObject = { ...filterObject, subject };
    }
    setFilterData((prev) => ({ ...prev, ...filterObject }));
  };

  const handleStatus = (event, status) => {
    setCurrentPage(1);
    let filterObject = { status: '' };
    if (status) {
      filterObject = { ...filterObject, status };
    }
    setFilterData((prev) => ({ ...prev, ...filterObject }));
  };

  const handleClear = () => {
    setFilterData({
      branch: '',
      grade: '',
      section: '',
      subject: '',
      status: '',
    });
    setDropDownData((prev) => ({
      ...prev,
      grade: '',
      section: '',
      subject: '',
    }));
  };

  useEffect(() => {
    if (moduleId && academicYearId) {
      fetchBranch();
    }
    fetchStatus();
  }, [moduleId, academicYearId]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={3}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleBranch}
          id='branch'
          options={dropDownData.branch || []}
          value={filterData.branch || ''}
          getOptionLabel={(option) => option?.branch?.branch_name || ''}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              variant='outlined'
              label='Branch'
              placeholder='Branch'
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleGrade}
          id='grade'
          options={dropDownData.grade || []}
          value={filterData.grade || ''}
          getOptionLabel={(option) => option?.grade__grade_name || ''}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField {...params} variant='outlined' label='Grade' placeholder='Grade' />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleSection}
          id='section'
          options={dropDownData.section || []}
          value={filterData.section || ''}
          getOptionLabel={(option) => option?.section__section_name || ''}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              variant='outlined'
              label='Section'
              placeholder='Section'
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleSubject}
          id='subject'
          options={dropDownData.subject || []}
          value={filterData.subject || ''}
          getOptionLabel={(option) => option?.subject_name || ''}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              variant='outlined'
              label='Subject'
              placeholder='Subject'
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleStatus}
          id='status'
          options={dropDownData.status || []}
          value={filterData.status || ''}
          PaperComponent={(props) => (
            <Paper style={{ textTransform: 'capitalize' }} elevation={1} {...props} />
          )}
          getOptionLabel={(option) => option?.status || ''}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              variant='outlined'
              label='Status'
              placeholder='Status'
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <Button
          variant='contained'
          className='canceButton labelColor'
          style={{ width: '100%' }}
          size='medium'
          onClick={handleClear}
        >
          Clear All
        </Button>
      </Grid>
    </Grid>
  );
};

export default PipelineFilters;
