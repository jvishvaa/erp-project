/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';
import { Grid, TextField, IconButton, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Loader from '../../components/loader/loader';
import './style.scss';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import StudentTableList from './studentTableList';

const TotalStudentWiseDetails = ({ year, branch, grade, hadleClearGrade }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedGradeData, setSelecteGradeData] = useState('');
  const [loading, setLoading] = useState(false);
  function getFullSelectedGradeData() {
    setSelectedSection('');
    setLoading(true);
    axiosInstance
      .get(
        `${endpoints.studentListApis.gradeWiseStudentCount}?academic_year_id=${year}&branch_id=${branch}&grade_id=${grade.grade}`
      )
      .then((res) => {
        setLoading(false);
        if (res && res.data.status_code === 200) {
          setSelecteGradeData(res && res.data.data);
        } else {
          setAlert('error', res.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
        setLoading(false);
      });
  }
  function getSectionWiseData(sectionId) {
    if (sectionId) {
      setLoading(true);
      axiosInstance
        .get(
          `${endpoints.studentListApis.gradeWiseStudentCount}?academic_year_id=${year}&branch_id=${branch}&grade_id=${grade.grade}&mapping_id=${sectionId}`
        )
        .then((res) => {
          setLoading(false);
          if (res && res.data.status_code === 200) {
            setSelecteGradeData(res && res.data.data);
          } else {
            setAlert('error', res.data.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
          setLoading(false);
        });
    } else {
      getFullSelectedGradeData();
    }
  }
  useEffect(() => {
    if (grade) {
      getFullSelectedGradeData();
    }
  }, [grade]);
  return (
    <>
      <Grid container spacing={2} className='totalStudentMainCard'>
        <Grid item md={12} xs={12} className='totalStudentSubCard'>
          <Grid container spacing={2}>
            <Grid item md={12} xs={12} className='totalStudentSubSubCard1'>
              <Grid container spacing={2} className='totalStudentSubcard1Child'>
                <Grid item md={7} xs={12} style={{ textAlign: 'left', padding: '0px' }}>
                  <Grid container spacing={1} direction='row' alignItems='center'>
                    <Grid item md={12} xs={12}>
                      <span className='totalStudentStrenghtCardLabel'>
                        {(grade && grade.grade_name) || ''}
                      </span>
                    </Grid>
              
                    <Grid item md={12} xs={1}>
                      <span className='totalStudentStrenghtCardSubLabel'>
                        {(grade && grade.student_count) || '0'}
                      </span>
                      <span style={{ color: 'lightgray', fontSize: '25px' }}>
                        &nbsp;|&nbsp;
                      </span>
                      <span className='totalStudentStrenghtCardSubLabel1'>
                        {(grade && grade.active) || '0'}
                        &nbsp;Active
                      </span>
                    </Grid>
                    <Grid item md={8} xs={12} style={{ padding: '0px' }}>
                      <span style={{ color: '#009CE1', fontSize: '13px' }}>
                        Temporary Inactive -&nbsp;
                        {(grade && grade.temporary_inactive) || '0'}
                      </span>
                      <br />
                      <span style={{ color: '#9D9D9D', fontSize: '13px' }}>
                        Permanent Inactive -&nbsp;
                        {(grade && grade.permanent_inactive) || '0'}
                      </span>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={4} xs={6} style={{ textAlign: 'right', padding: '0px' }}>
                  <Grid container spacing={2}>
                    <Grid item md={12} xs={12}>
                      <Autocomplete
                        style={{ width: '100%' }}
                        size='small'
                        onChange={(event, value) => {
                          setSelectedSection(value);
                          getSectionWiseData((value && value.mapping_id) || '');
                        }}
                        id='branch_id'
                        className='dropdownIcon'
                        value={selectedSection}
                        options={
                          selectedGradeData &&
                          selectedGradeData.sections &&
                          selectedGradeData.sections.length !== 0
                            ? selectedGradeData.sections
                            : []
                        }
                        getOptionLabel={(option) => option?.section_name}
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
                    <Grid item md={12} xs={12}>
                      <span className='totalStudentStrenghtCardLabel1'>
                        {(grade && grade.new_admissions) || ''}
                      </span>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={1} xs={6} style={{ textAlign: 'right', padding: '0px' }}>
                  <IconButton
                    size='small'
                    style={{ fontSize: '5px', color: '#FE6B6B' }}
                    onClick={() => hadleClearGrade()}
                  >
                    <CloseIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              <StudentTableList
                tableData={
                  (selectedGradeData &&
                    selectedGradeData.students &&
                    selectedGradeData.students.length !== 0 &&
                    selectedGradeData.students) ||
                  []
                }
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {loading && <Loader />}
    </>
  );
};

TotalStudentWiseDetails.prototype = {
  year: PropTypes.number.isRequired,
  branch: PropTypes.number.isRequired,
  grade: PropTypes.number.isRequired,
  hadleClearGrade: PropTypes.func.isRequired,
};

export default TotalStudentWiseDetails;
