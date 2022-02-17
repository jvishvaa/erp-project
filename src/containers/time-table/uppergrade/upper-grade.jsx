import React, { useContext, useEffect, useState } from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import EmojiObjectsSharpIcon from '@material-ui/icons/EmojiObjectsSharp';
import {  useSelector } from 'react-redux';
import Select from '@material-ui/core/Select';
import LayersClearIcon from '@material-ui/icons/LayersClear';
import { Button, IconButton ,makeStyles} from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import './upper-grade.scss';

const useStyles = makeStyles((theme)=>({
  textFixed:{
    color: theme.palette.secondary.main,
    fontSize: "20px",
    padding: "13px",
    fontFamily: "roboto"
  },
  textFixedLast:{
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    color: theme.palette.secondary.main,
    fontSize: "20px",
    fontFamily: "roboto",
    paddingLeft: "16px",
  },
  textRotate:{
    transformOrigin: "0 0",
    transform: "rotate(270deg)",
    width: "100%",
    color: theme.palette.secondary.main,
    fontSize: "16px",
    paddingTop: "8px",
    fontWeight: 600,
    fontFamily:"roboto",
  },
arrowbutton:{
  color : theme.palette.secondary.main
}
}))
const UpperGrade = (props) => {
  const classes = useStyles()
  const [dataMap, setDataMap] = useState();
  const { setAlert } = useContext(AlertNotificationContext);
  const [gradeID, setGradeID] = useState(null);
  const [sectionID, setSectionID] = useState(null);
  const [branchID, setBranchID] = useState(null);
  const [counter, setCounter] = useState(2);
  const [academicYear, setAcadamicYearName] = useState(
    useSelector((state) => state.commonFilterReducer?.selectedYear)
  );
  const [gradeName, setGradeName] = useState();
  const [branchName, setBranchName] = useState();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [sectinName, setSectionName] = useState();
  const [addPeriodButton, setShowAddPeriodButton] = useState(false);
const [section, setSection] = useState();

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
    if(props?.moduleId)
    callingAPI();
  }, [counter,props?.moduleId]);
  const handleOpenNewPeriod = () => {
    props.handlePassOpenNewPeriod();
  };
  const callingAPI = () => {
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
      .get(
        `${endpoints.academics.grades}?session_year=${academicYear?.id}&branch_id=${branchID}&module_id=${props?.moduleId}`
      )
      .then((res) => {
        setDataMap(res.data.data);
      })
      .catch((error) => {
        setAlert('error', "can't fetch grade list");
      });
  };
  const handleGrade =(value) => {
    setGradeName(value?.grade__grade_name)
    // props.section_mapping_id(value?.id)
  }
  const handleSection = (value) => {
    setSection(value)
    setSectionName(value?.section__section_name)
    
  }
  const callingBranchAPI = () => {
    axiosInstance
      .get(
        `${endpoints.communication.branches}?session_year=${academicYear?.id}&module_id=${props?.moduleId}`
      )
      .then((res) => {
        if (res.status === 200) {
          setDataMap(res?.data?.data?.results);
        }
      })
      .catch((error) => {
        setDataMap(null);
        setAlert('error', "can't fetch branch list");
      });
  };
  const callingSectionAPI = () => {
    axiosInstance
      .get(
        `${endpoints.academics.sections}?session_year=${academicYear?.id}&branch_id=${branchID}&grade_id=${gradeID}&module_id=${props?.moduleId}`
      )
      .then((res) => {  
        if (res.status === 200) {
          setDataMap(res.data.data);
        }
      })
      .catch((error) => {
        setDataMap(null);
        setAlert('error', "can't fetch section list");
      });
  };
  const clearButtonColor = {
    color: 'gray',
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
    if (branchID === null || gradeID === null || sectionID === null) {
      setAlert('warning', 'please select all filters');
    } else {
      setShowAddPeriodButton(true);
      props.section_mapping_id(section?.id)
      props.handlePassData(
        academicYear?.id,
        gradeID,
        sectionID,
        branchID,
        academicYear?.session_year,
        gradeName,
        branchName,
        sectinName
      );
      props.handleClickAPI();
      handleClearData('generate');
    }
  };
  const handleClearData = (data) => {
    if (data === 'clear') {
      setShowAddPeriodButton(false);
      props.handleCloseTable(false);
      // 
      setCounter(2);
      setBranchID(null);
      setGradeID(null);
      setSectionID(null);
    }
    if (data === 'generate') {
      props.handleCloseTable(true);
    }
  };
  return (
    <>
      <div className='upper-table-container'>
        <div className='all-box-container'>
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
                <div className={classes.textFixed}>Branch</div>
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
                            key={name?.branch?.id}
                            value={name?.branch?.id}
                            onClick={() => setBranchName(name?.branch?.branch_name)}
                          >
                            {name && name.branch && name.branch.branch_name}
                          </option>
                        ))}
                    </Select>
                  </div>
                  <div className={classes.textFixedLast}>
                    Expand
                    <IconButton onClick={() => setCounter(counter + 1)} size='small'>
                      <ArrowForwardIcon className = {classes.arrowbutton} />
                    </IconButton>
                  </div>
                </div>
              </>
            ) : (
              <label className={classes.textRotate}>Branch</label>
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
                <div className={classes.textFixed}>Grade</div>
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
                            key={name?.id}
                            value={name?.grade_id}
                            onClick={() => handleGrade(name)}
                          >
                            {name?.grade__grade_name}
                          </option>
                        ))}
                    </Select>
                  </div>
                  <div className={classes.textFixedLast}>
                    Expand
                    <IconButton
                      aria-label='delete'
                      onClick={() => setCounter(counter - 1)}
                      size='small'
                    >
                      <ArrowBackIcon className={classes.arrowbutton} />
                    </IconButton>
                    <IconButton
                      aria-label='delete'
                      onClick={() => setCounter(counter + 1)}
                      size='small'
                    >
                      <ArrowForwardIcon className={classes.arrowbutton} />
                    </IconButton>
                  </div>
                </div>
              </>
            ) : (
              <div className={classes.textRotate}>Grade</div>
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
                <div className={classes.textFixed}>Section</div>
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
                            key={name?.id}
                            value={name?.section_id}
                            onClick={() =>handleSection(name)}
                          >
                            {name?.section__section_name}
                          </option>
                        ))}
                    </Select>
                  </div>
                  <div className={classes.textFixedLast}>
                    Expand
                    <IconButton
                      aria-label='delete'
                      onClick={() => handleCounter('back')}
                      size='small'
                    >
                      <ArrowBackIcon className={classes.arrowbutton} />
                    </IconButton>
                  </div>
                </div>
              </>
            ) : (
              <label className={classes.textRotate}>Section</label>
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
              Filter
            </Button>
          </div>
          {/* {props.teacherView && addPeriodButton ? (
            <Button color="primary"
              variant="contained"
              style={{ color: "white !important" }}
              className={classes.addnewperiodbutton} onClick={() => handleOpenNewPeriod()}>
              Add Period
            </Button>
          ) : (
            <></>
          )} */}
        </div>
      </div>
    </>
  );
};

export default UpperGrade;
