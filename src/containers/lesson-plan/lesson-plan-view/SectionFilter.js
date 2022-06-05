import React, { useState, useSelector, useEffect } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Button, Dialog, DialogContent, Grid, TextField } from '@material-ui/core';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';

const SectionFilter = ({ open, setOpen, sessionBranchGrade, handleComplete }) => {
  //   const [open, setOpen] = useState(false);
  const [sectionList, setSectionList] = useState([]);
  const [selectedSectionList, setSelectedSectionList] = useState([]);

  const [moduleId, setModuleId] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

  useEffect(() => {
    if (moduleId) {
      getSection();
    }
  }, [moduleId]);

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Lesson Plan' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Teacher View') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  const getSection = () => {
    const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
    axiosInstance
      .get(
        `${endpoints.communication.sections}?branch_id=${sessionBranchGrade?.branch?.id}&grade_id=${sessionBranchGrade?.grade?.grade_id}&module_id=${moduleId}&session_year=${sessionBranchGrade?.session?.id}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setSectionList(result.data.data);
        } else {
          //   setLoading(false);
          //   setAlert('error', result.data.description);
        }
      })
      .catch((error) => {
        // setLoading(false);
        // setAlert('error', error.message);
      });
  };

  const handleUserLevel = (e, value) => {
    if (value.length) {
      //   const data = value.map((el) => el);
      const ids = value.map((el) => el.id);
      setSelectedSectionList(ids);
    } else {
      setSelectedSectionList([]);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      className='dialog-container-section'
    >
      <DialogContent>
        <b style={{ fontSize: '20px', marginRight: '200px' }}>Select Section</b>
        <Grid xs={12}>
          <Autocomplete
            multiple
            size='small'
            onChange={handleUserLevel}
            // value={selectedUserLevelData}
            id='message_log-smsType'
            className='multiselect_custom_autocomplete'
            options={sectionList || []}
            limitTags='2'
            getOptionLabel={(option) => option?.section__section_name}
            filterSelectedOptions
            style={{ margin: '10px 0 10px 0' }}
            renderInput={(params) => (
              <TextField
                className='message_log-textfield'
                {...params}
                variant='outlined'
                // label={'Choose User Level'}
                placeholder={'Choose Section'}
              />
            )}
          />
        </Grid>
        <Button
          style={{ width: '100%' }}
          onClick={() => handleComplete(selectedSectionList)}
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SectionFilter;
