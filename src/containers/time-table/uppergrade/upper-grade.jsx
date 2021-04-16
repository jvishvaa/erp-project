import React, {useContext, useEffect, useState } from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import EmojiObjectsSharpIcon from '@material-ui/icons/EmojiObjectsSharp';
import Select from '@material-ui/core/Select';
import LayersClearIcon from '@material-ui/icons/LayersClear';
import WbIncandescentSharpIcon from '@material-ui/icons/WbIncandescentSharp';
import { Button, IconButton } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import { getModuleInfo }from '../../../utility-functions';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import './upper-grade.scss';
import { set } from 'lodash';
const UpperGrade = (props) => {
  const [dataMap, setDataMap] = useState();
  const [dataMapAcademicYear, setDataMapAcademicYear] = useState();
  const location = useLocation();
  const { setAlert } = useContext(AlertNotificationContext);
  const [acadamicYearID, setAcadamicYear] = useState(1);
  const [gradeID, setGradeID] = useState(1);
  const [sectionID, setSectionID] = useState(1);
  const [branchID, setBranchID] = useState([]);
  const [counter, setCounter] = useState(1);
  const [academicYear, setAcadamicYearName] = useState();
  const [gradeName, setGradeName] = useState();
  const [branchName, setBranchName] = useState();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [sectinName, setSectionName] = useState();

  const handleChangeMultiple = (event) => {
    const { options } = event.target;
    const value = [];
    for (
      let noOfOption = 0, length = options.length;
      noOfOption < length;
      noOfOption += 1
    ) {
      if (options[noOfOption].selected) {
        value.push(options[noOfOption].value);
      }
    }
    if (counter === 1) {
      setAcadamicYear(value);
    }
    if (counter === 2) {
      setBranchID(value);
    }
    if (counter === 3) {
      setGradeID(value);
    }
    if (counter === 4) {
      setSectionID(value);
    }
  };
  // '/erp_user/branch/'
  useEffect(() => {
    callingAPI();
  }, [counter]);
  const callingAPI = () => {
    if (counter === 1) {
      callingAcadamicAPI();
    }
    if (counter === 2) {
      callingBranchAPI();
    }
    if (counter === 3) {
      callingGradeAPI();
    }
    if (counter === 4) {
      callingSectionAPI();
    }
  };
  const callingGradeAPI = () => {
    axiosInstance
      .get(`/erp_user/grademapping/?session_year=${acadamicYearID}&branch_id=${branchID}`)
      .then((res) => {
        setDataMap(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const callingBranchAPI = () => {
    axiosInstance
      .get(`/erp_user/branch/?session_year=${acadamicYearID}`)
      .then((res) => {
        if(res.status === 200){
          setDataMap(res.data.data.results);
        }
        
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const callingAcadamicAPI = () => {
    axiosInstance
      .get(`/erp_user/list-academic_year/`, {})
      .then((res) => {
        console.log(res, 'Academic');
        setDataMapAcademicYear(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const callingSectionAPI = () => {
    axiosInstance
      .get(
        `/erp_user/sectionmapping/?session_year=${acadamicYearID}&branch_id=${branchID}&grade_id=${gradeID}`
      )
      .then((res) => {
        if (res.status === 200) {
          setDataMap(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const clearButtonColor = {
    color: 'gray',
  };
  const getModuleId = () => {
    const tempObj = {
      '/time-table/teacher-view/': 'Teacher Time Table',
      '/time-table/teacher-view': 'Teacher Time Table',
      '/time-table/student-view': 'Student Time Table',
      '/time-table/student-view/': 'Student Time Table',
      default: 'Student Time Table',
    };
    const moduleName = tempObj[location.pathname] || tempObj['default'];
    return getModuleInfo(moduleName).id;
  };
  const handleCounter = (value) => {
    if (value === 'back' && counter > 1) {
      setCounter(counter - 1);
    }
    if (value === 'forward' && counter < 4) {
      setCounter(counter + 1);
    }
  };
  const handleGenerateData = () => {
    props.handlePassData(
      acadamicYearID,
      gradeID,
      sectionID,
      branchID,
      academicYear,
      gradeName,
      branchName,
      sectinName
    );
    props.handleClickAPI();
    handleClearData('generate');
  };
  const handleClearData = (data) =>{
    if(data === 'clear'){
      props.handleCloseTable(false);
      setCounter(1);
      setAcadamicYear(null);
      setBranchID(null);
      setGradeID(null);
      setSectionID(null);
    }
    if(data === 'generate'){
      props.handleCloseTable(true)
    }
}
  return (
    <>
      <div className='upper-table-container'>
        <div className='all-box-container'>
          <div
            className={
              counter === 1
                ? 'grade-container'
                : counter === 4
                ? 'box-right-3'
                : counter === 2
                ? 'box-right-1'
                : counter === 3
                ? 'box-right-2'
                : 'acadamic-year-box'
            }
          >
            {counter === 1 ? (
              <>
                <div className='text-fixed'>Acadamic Year</div>
                <div className='inner-grade-container'>
                  <div className='change-grade-options'>
                    <Select
                      multiple
                      fullWidth
                      native
                      value={acadamicYearID}
                      onChange={handleChangeMultiple}
                    >
                      {dataMapAcademicYear &&
                        dataMapAcademicYear.map((name) => (
                          <option
                            key={name?.id}
                            value={name?.id}
                            onClick={() => setAcadamicYearName(name?.session_year)}
                          >
                            {name?.session_year}
                          </option>
                        ))}
                    </Select>
                  </div>
                  <div className='text-fixed-last'>
                    Expand
                    {/* <IconButton
                      disabled color="primary"
                      size='small'
                    >
                      <ArrowBackIcon className='arrow-button' />
                    </IconButton> */}
                    <IconButton
                      aria-label='delete'
                      onClick={() => setCounter(counter + 1)}
                      size='small'
                    >
                      <ArrowForwardIcon className='arrow-button' />
                    </IconButton>
                  </div>
                </div>
              </>
            ) : (
              <div className='text-rotate'>AcadamicYear</div>
            )}
          </div>
          <div
            className={
              counter === 2
                ? 'grade-container'
                : counter === 1
                ? 'box-last-1'
                : counter === 4
                ? 'box-right-2'
                : counter === 3
                ? 'box-right-1'
                : 'box-last-2'
            }
          >
            {counter === 2 ? (
              <>
                <div className='text-fixed'>Branch</div>
                <div className='inner-grade-container'>
                  <div className='change-grade-options'>
                    <Select
                      multiple
                      fullWidth
                      native
                      value={branchID}
                      onChange={handleChangeMultiple}
                    >
                      {dataMap &&
                        dataMap?.map((name) => (
                          <option
                            key={name.id}
                            value={name.id}
                            onClick={() => setBranchName(name?.branch?.branch_name)}
                          >
                           
                            {name && name.branch && name.branch.branch_name}
                          </option>
                        ))}
                    </Select>
                  </div>
                  <div className='text-fixed-last'>
                    Expand
                    <IconButton
                      aria-label='delete'
                      onClick={() => setCounter(counter - 1)}
                      size='small'
                    >
                      <ArrowBackIcon className='arrow-button' />
                    </IconButton>
                    <IconButton onClick={() => setCounter(counter + 1)} size='small'>
                      <ArrowForwardIcon className='arrow-button' />
                    </IconButton>
                  </div>
                </div>
              </>
            ) : (
              <label className='text-rotate'>Branch</label>
            )}
          </div>
          <div
            className={
              counter === 3
                ? 'grade-container'
                : counter === 1
                ? 'box-last-2'
                : counter === 2
                ? 'box-last-1'
                : counter === 4
                ? 'box-right-1'
                : 'box-last-2'
            }
          >
            {counter === 3 ? (
              <>
                <div className='text-fixed'>Grade</div>
                <div className='inner-grade-container'>
                  <div className='change-grade-options'>
                    <Select
                      multiple
                      fullWidth
                      native
                      value={gradeID}
                      onChange={handleChangeMultiple}
                    >
                      {dataMap &&
                        dataMap.map((name) => (
                          <option
                            key={name.id}
                            value={name.id}
                            onClick={() => setGradeName(name.grade_name)}
                          >
                            {name.grade_name}
                          </option>
                        ))}
                    </Select>
                  </div>
                  <div className='text-fixed-last'>
                    Expand
                    <IconButton
                      aria-label='delete'
                      onClick={() => setCounter(counter - 1)}
                      size='small'
                    >
                      <ArrowBackIcon className='arrow-button' />
                    </IconButton>
                    <IconButton
                      aria-label='delete'
                      onClick={() => setCounter(counter + 1)}
                      size='small'
                    >
                      <ArrowForwardIcon className='arrow-button' />
                    </IconButton>
                  </div>
                </div>
              </>
            ) : (
              <div className='text-rotate'>Grade</div>
            )}
          </div>
          <div
            className={
              counter === 4
                ? 'grade-container'
                : counter === 1
                ? 'box-last-3'
                : counter === 3
                ? 'box-last-1'
                : 'box-last-2'
            }
          >
            {counter === 4 ? (
              <>
                <div className='text-fixed'>Section</div>
                <div className='inner-grade-container'>
                  <div className='change-grade-options'>
                    <Select
                      multiple
                      fullWidth
                      native
                      value={sectionID}
                      onChange={handleChangeMultiple}
                    >
                      {dataMap &&
                        dataMap.map((name) => (
                          <option
                            key={name.id}
                            value={name.id}
                            onClick={() => setSectionName(name.section_name)}
                          >
                            {name.section_name}
                          </option>
                        ))}
                    </Select>
                  </div>
                  <div className='text-fixed-last'>
                    Expand
                    <IconButton
                      aria-label='delete'
                      onClick={() => handleCounter('back')}
                      size='small'
                    >
                      <ArrowBackIcon className='arrow-button' />
                    </IconButton>
                    {/* <IconButton
                      disabled color="primary"
                      size='small'
                    >
                      <ArrowForwardIcon className='arrow-button' />
                    </IconButton> */}
                  </div>
                </div>
              </>
            ) : (
              <label className='text-rotate'>Section</label>
            )}
          </div>
        </div>

        <div className='table-button-container'>
          <Button
            size='small'
            variant='contained'
            className='clear-all'
            onClick={() => handleClearData('clear')}
            startIcon={<LayersClearIcon />}
          >
            Clear All
          </Button>
          <div className='generate-button'>
            <Button
              size='small'
              variant='contained'
              color='primary'
              inputProps={clearButtonColor}
              className='signatureUploadFilterButton'
              onClick={handleGenerateData}
              startIcon={<EmojiObjectsSharpIcon />}
            >
              Generate
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpperGrade;
