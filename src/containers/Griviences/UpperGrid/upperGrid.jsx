import React, { useEffect, useState, useContext } from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import EmojiObjectsSharpIcon from '@material-ui/icons/EmojiObjectsSharp';
import Select from '@material-ui/core/Select';
import LayersClearIcon from '@material-ui/icons/LayersClear';
import FilterFilledIcon from '../../../components/icon/FilterFilledIcon';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Loader from '../../../components/loader/loader';
import { Button, IconButton } from '@material-ui/core';
import './upper-grid.scss';
import { set } from 'lodash';
import { Link } from 'react-router-dom';
const UpperGrade = (props) => {
  const [dataMap, setDataMap] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [acadamicYearID, setAcadamicYear] = useState('');
  const [loading, setLoading] = useState();
  const [acadamicYearData, setAcadamicYearData] = useState([]);
  const [gevienceTypeID, setGevienceTypeID] = useState();
  const [branchID, setBranchID] = useState();
  const [sectionID, setSectionID] = useState();
  const [gradeID, setGradeID] = useState();
  const [counter, setCounter] = useState(1);
  const [academicYear, setAcadamicYearName] = useState();
  const [grevancesData, setGrevancesData] = useState();
  const [grevancesDataName, setGrevancesDataName] = useState();
  const [branchName, setBranchName] = useState();
  const [gradeName, setGradeName] = useState();
  const [sectionName, setSectionName] = useState();
  const [studentView, setStudentView] = useState(false);
  const [userID, setUserID] = useState();
  const [openDialog] = useState(true);
  let userName = JSON.parse(localStorage.getItem('userDetails')) || {};
  //const moduleId = 175;

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Griviences' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Griviences Student' && userName.role !== 'SuperUser') {
              setModuleId(item.child_id);
            }
            if (item.child_name === 'Griviences Teacher') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  const handleChangeMultiple = (event) => {
    const { options } = event.target;
    console.log(event, 'eventtttttttt');
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
      console.log(value, 'sameeraaaa');
    }

    if (counter === 5) {
      setGevienceTypeID(value);
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
    if (counter === 4) {
      callingSectionAPI();
    }
    if (counter === 5) {
      callingGriviencesAPI();
    }
  };
  const handleClearAll = () => {
    setGrevancesDataName(null);
    setAcadamicYearData(null);
    setDataMap(null);
    setCounter(1);
  };
  const callingGriviencesAPI = () => {
    setLoading(true);
    axiosInstance
      .get('/academic/grievance_types/')
      .then((res) => {
        console.log(res, 'res data');
        setLoading(false);

        if (res.status === 200) {
          console.log(res);
          setGrevancesData(res.data.data);
          setLoading(false);
        }
        console.log(res, 'grievand');
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  const callingBranchAPI = () => {
    setLoading(true);
    axiosInstance
      .get(
        `${endpoints.communication.branches}?session_year=${acadamicYearID}&module_id=${moduleId}`
      )
      .then((res) => {
        console.log(res.data.data.results);
        setDataMap(res.data.data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  const callingGradeAPI = () => {
    setLoading(true);
    axiosInstance
      .get(
        `${
          endpoints.academics.grades
        }?session_year=${acadamicYearID}&branch_id=${branchID.toString()}&module_id=${moduleId}`
      )
      .then((res) => {
        console.log(res.data.data);
        setLoading(false);

        setDataMap(res.data.data);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  const callingSectionAPI = () => {
    setLoading(true);
    axiosInstance
      .get(
        `${endpoints.academics.sections}?session_year=${acadamicYearID}&branch_id=${branchID}&grade_id=${gradeID}&module_id=${moduleId}`
      )
      .then((res) => {
        console.log(res.data.data);
        setLoading(false);
        setDataMap(res.data.data);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  const callingAcadamicAPI = () => {
    setLoading(true);
    axiosInstance
      .get('/erp_user/list-academic_year/', {})
      .then((res) => {
        setLoading(false);

        setAcadamicYearData(res.data.data);
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
    let temp;
    if (grevancesDataName === 'type 1') {
      temp = 1;
    } else if (grevancesDataName === 'type 2') {
      temp = 2;
    } else if (grevancesDataName === 'type 3') {
      temp = 3;
    } else if (grevancesDataName === 'type 4') {
      temp = 4;
    }
    console.log(
      acadamicYearID,
      gevienceTypeID,
      branchID,
      gradeID,
      sectionID,
      temp,
      userID,
      '===============================>>>>>>>>>>>>>>>>>>>>'
    );
    if (path === '/griviences/admin-view') {
      props.getGrivienceData(
        acadamicYearID,
        gevienceTypeID,
        branchID,
        gradeID,
        sectionID,
        temp,
        openDialog
      );
      props.handlePassData(
        acadamicYearID,
        gevienceTypeID,
        branchID,
        gradeID,
        sectionID,
        temp,
        openDialog
      );
    } else if (path === '/griviences/student-view') {
      props.getGrivienceData(
        // acadamicYearID,
        // gevienceTypeID,
        // branchID,
        // gradeID,
        // sectionID,
        // temp,
        userID,
        studentView,
        openDialog
      );
      props.handlePassData(
        // acadamicYearID,
        // gevienceTypeID,
        // branchID,
        // gradeID,
        // sectionID,
        // temp,
        userID,
        studentView,
        openDialog
      );
    }
  };

  let path = window.location.pathname;
  console.log(path, 'path');

  useEffect(() => {
    if (path === '/griviences/admin-view') {
      console.log(path, 'path');
      setStudentView(false);
    }
    if (path === '/griviences/student-view') {
      // console.log(path, 'path');
      let userName = JSON.parse(localStorage.getItem('userDetails')) || {};
      console.log(userName.user_id, 'userName');
      setUserID(userName.user_id);
      setStudentView(!studentView);
      handleGenerateData();
    }
  }, []);
  return (
    <>
      {!studentView ? (
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
                  : counter === 4
                  ? 'box-right-3'
                  : counter === 5
                  ? 'box-right-4'
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
                        {acadamicYearData &&
                          acadamicYearData.map((name) => (
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
                  : counter === 3
                  ? 'box-right-1'
                  : counter === 4
                  ? 'box-right-3'
                  : counter === 5
                  ? 'box-right-4'
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
                              key={name?.branch?.id}
                              value={name?.branch?.id}
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
                  ? 'box-last-1'
                  : counter === 2
                  ? 'box-right-1'
                  : counter === 4
                  ? 'box-right-3'
                  : counter === 5
                  ? 'box-right-4'
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
                          dataMap?.map((name) => (
                            <option
                              key={name?.grade_id}
                              value={name?.grade_id}
                              onClick={() => setGradeName(name?.grade_name)}
                            >
                              {name?.grade_name}
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
                <label className='text-rotate'>Grade</label>
              )}
            </div>
            <div
              className={
                counter === 4
                  ? 'grade-container'
                  : counter === 1
                  ? 'box-last-1'
                  : counter === 2
                  ? 'box-right-1'
                  : counter === 3
                  ? 'box-right-3'
                  : counter === 5
                  ? 'box-right-4'
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
                          dataMap?.map((name) => (
                            <option
                              key={name?.id}
                              value={name?.section_id}
                              onClick={() => setSectionName(name?.section_name)}
                            >
                              {name?.section_name}
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
                <label className='text-rotate'>Section</label>
              )}
            </div>

            <div
              className={
                counter === 5
                  ? 'grade-container'
                  : counter === 1
                  ? 'box-last-2'
                  : counter === 2
                  ? 'box-last-1'
                  : counter === 3
                  ? 'box-right-3'
                  : counter === 4
                  ? 'box-right-4'
                  : 'box-last-2'
              }
            >
              {counter === 5 ? (
                <>
                  <div className='text-fixed'>Type</div>
                  <div className='inner-grade-container'>
                    <div className='change-grade-options'>
                      <Select
                        multiple
                        fullWidth
                        native
                        value={gevienceTypeID}
                        onChange={handleChangeMultiple}
                      >
                        {grevancesData &&
                          grevancesData.map((name) => (
                            <option
                              key={name.id}
                              value={name.id}
                              onClick={() => setGrevancesDataName(name?.grievance_name)}
                            >
                              {name?.grievance_name}
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
                <div className='text-rotate'>Type</div>
              )}
            </div>
          </div>

          <div className='table-button-container'>
            <Button
              size='small'
              variant='contained'
              className='clear-all'
              onClick={handleClearAll}
              startIcon={<LayersClearIcon />}
            >
              Clear All
            </Button>
            {/* <div className='generate-button'> */}

            <Button
              size='small'
              variant='contained'
              color='primary'
              startIcon={<FilterFilledIcon />}
              onClick={handleGenerateData}
            >
              <span style={{ color: 'white' }}> Filter</span>
            </Button>

            {/* </div> */}
            {/* <div className='generate-button'> */}
            <Button size='small' variant='contained' color='primary'>
              <Link
                to='/greviences/createnew'
                style={{ textDecoration: 'none', color: 'white' }}
              >
                Add New
              </Link>
            </Button>
          </div>
          {/* </div> */}
        </div>
      ) : (
        ''
      )}
      {loading && <Loader />}
    </>
  );
};

export default UpperGrade;
