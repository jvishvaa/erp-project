import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import EmojiObjectsSharpIcon from '@material-ui/icons/EmojiObjectsSharp';
import Select from '@material-ui/core/Select';
import LayersClearIcon from '@material-ui/icons/LayersClear';
import { Button, IconButton } from '@material-ui/core';
import './upper-grid.scss';
import { set } from 'lodash';
const UpperGrade = (props) => {
  const [dataMap, setDataMap] = useState([]);
  const [acadamicYearID, setAcadamicYear] = useState(1);
  const [gradeID, setGradeID] = useState(1);
  const [branchID, setBranchID] = useState(1);
  const [counter, setCounter] = useState(1);
  const [academicYear, setAcadamicYearName] = useState();
  const [gradeName, setGradeName] = useState();
  const [branchName, setBranchName] = useState();
  const [openDialog] = useState(true);

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
  };
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
  };
  const callingGradeAPI = () => {
    axiosInstance
      .get('/erp_user/grade/', {})
      .then((res) => {
        setDataMap(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const callingBranchAPI = () => {
    axiosInstance
      .get('/erp_user/branch/', {})
      .then((res) => {
        console.log(res.data.data , " branches ");
        setDataMap(res.data.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const callingAcadamicAPI = () => {
    axiosInstance
      .get('/erp_user/list-academic_year/', {})
      .then((res) => {
        setDataMap(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleCounter = (value) => {
    if (value === 'back' && counter > 1) {
      setCounter(counter - 1);
    }
    if (value === 'forward' && counter < 3) {
      setCounter(counter + 1);
    }
  };
  const handleGenerateData = () => {
    props.handlePassData(
      acadamicYearID,
      gradeID,
      branchID,
      academicYear,
      gradeName,
      branchName,
      openDialog
    );
  };
  return (
    <>
      <div className='upper-table-container'>
        <div className='all-box-container'>
          <div
            className={
              counter === 1
                ? 'grade-container'
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
                      {dataMap &&
                        dataMap.map((name) => (
                          <option
                            key={name.id}
                            value={name.id}
                            onClick={() => setAcadamicYearName(name.session_year)}
                          >
                            {name.session_year}
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
                            {name?.branch?.branch_name}
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
                      onClick={() => handleCounter('back')}
                      size='small'
                    >
                      <ArrowBackIcon className='arrow-button' />
                    </IconButton>
                  </div>
                </div>
              </>
            ) : (
              <div className='text-rotate'>Grade</div>
            )}
          </div>
        </div>

        <div className='table-button-container'>
          <Button
            size='small'
            variant='contained'
            className='clear-all'
            startIcon={<LayersClearIcon />}
          >
            Clear All
          </Button>
          <div className='generate-button'>
          <Button
            size='small'
            variant='contained'
            color='primary'
            className='signatureUploadFilterButton'
            onClick={handleGenerateData}
            startIcon={<EmojiObjectsSharpIcon />}
          >
            Filter
          </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpperGrade;
