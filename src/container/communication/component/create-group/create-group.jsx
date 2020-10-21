/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import CustomMultiSelect from '../custom-multiselect/custom-multiselect';
import CustomInput from '../custom-inputfield/custom-input';
import './create-group.css';

// eslint-disable-next-line no-unused-vars
const CreateGroup = withRouter(({ history, ...props }) => {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [groupName, setGroupName] = useState('');

  const roles = [
    'All',
    'Teacher',
    'Student',
    'Parrent',
    'Organiser',
    'Principal',
    'Administration',
    'Helper',
  ];

  const grade = [
    'All',
    'Grade 1',
    'Grade 2',
    'Grade 3',
    'Grade 4',
    'Grade 5',
    'Grade 6',
    'Grade 7',
  ];

  const section = ['All', 'Sec A', 'Sec B', 'Sec C'];

  const display = () => {
    console.log(selectedRoles);
    console.log(selectedSections);
    console.log(selectedGrades);
    console.log(groupName);
  };
  const addGroupName = (e) => {
    setGroupName(e.target.value);
  };

  return (
    <div className='creategroup__page'>
      <div className='creategroup_heading'>Communication &gt; Create Group</div>
      <div className='creategroup_firstrow'>
        <CustomInput className='group_name' onChange={addGroupName} name='Group name' />
        <CustomMultiSelect
          selections={selectedRoles}
          setSelections={setSelectedRoles}
          nameOfDropdown='User Role'
          optionNames={roles}
        />
      </div>
      {selectedRoles.length && !selectedRoles.includes('All') ? (
        <div className='creategroup_firstrow'>
          <CustomMultiSelect
            selections={selectedGrades}
            setSelections={setSelectedGrades}
            nameOfDropdown='Grade'
            optionNames={grade}
          />
          {selectedGrades.length && !selectedGrades.includes('All') ? (
            <CustomMultiSelect
              selections={selectedSections}
              setSelections={setSelectedSections}
              nameOfDropdown='Section'
              optionNames={section}
            />
          ) : null}
        </div>
      ) : null}
      <div className='button_wrapper'>
        <input
          className='custom_button addgroup_back_button'
          type='button'
          onClick={display}
          value='back'
        />
        <input
          className='custom_button addgroup_next_button'
          type='button'
          onClick={display}
          value='next'
        />
      </div>
    </div>
  );
});

export default CreateGroup;
