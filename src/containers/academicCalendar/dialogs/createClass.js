import React, { useContext, useEffect, useState, useRef } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Grid, Dialog } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { lighten, makeStyles } from '@material-ui/core/styles';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Autocomplete } from '@material-ui/lab';
import axiosInstance from '../../../config/axios';
import { connect, useSelector } from 'react-redux';
import endpoints from 'config/endpoints';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Loader from '../../../components/loader/loader';
import CustomSelectionTable from 'containers/communication/custom-selection-table/custom-selection-table';
import { MuiPickersUtilsProvider, KeyboardTimePicker } from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  tableCellIconAlign: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tableCellIcon: {
    width: '40px',
    height: '40px',
    display: 'flex',
    marginRight: '10px',
  },
  tableCellDescriptionIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableCellDescriptionTextAlign: {
    marginTop: '5px',
  },
  table_cell: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  blogActions: {
    width: 500,
  },
  discussionActions: {
    width: 10,
  },
}));

const CreateClass = ({
  createClassClicked,
  toggleCreateClass,
  setIsCreateClassClicked,
  isCreateClassOpen,
}) => {
  const handleClose = () => {
    setIsCreateClassClicked(false);
  };
  const [loading, setLoading] = useState(false);

  const classes = useStyles();
  const [pageno, setPageno] = useState(1);
  const [periodTypes, setPeriodTypes] = React.useState([]);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [moduleId, setModuleId] = useState('');
  const [academicYear, setAcademicYear] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [selectedbranchIds, setSelectedbranchIds] = useState([]);
  const [selectedGradeIds, setSelectedGradeIds] = useState([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(true);
  const [totalPage, setTotalPage] = useState(0);
  const [usersRow, setUsersRow] = useState([]);
  const [completeData, setCompleteData] = useState([]);
  const [selectAllObj, setSelectAllObj] = useState([]);
  const [selectedTime, setSelectedTime] = useState();
  const [duration, setDuration] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState();
  const [teacherList, setTeacherList] = useState([]);
  const [selectedTeacher, setSelectedTacher] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [periodName, setPeriodName] = useState();
  const [periodDate, setPeriodDate] = useState();
  const [sectionId, setSectionId] = useState('');
  let date = moment().format('YYYY-MM-DD');

  const handleDateClass = (e) => {
    setPeriodDate(e.target.value);
  };

  const handlePeriodName = (e) => {
    setPeriodName(e.target.value);
  };

  const handlePeriod = (e, value) => {
    setSelectedPeriod(value);
  };

  const handleDuration = (e) => {
    const re = /^[0-9]+$/g;
    if (
      (e.target.value === '' || re.test(e.target.value)) &&
      e.target.value.length <= 3
    ) {
      setDuration(e.target.value);
    }
  };

  const validateClassTime = (time) => {
    let isValidTime = false;
    const CLASS_HOURS = time.getHours();
    const CLASS_MINUTES = time.getMinutes();
    if (CLASS_HOURS >= 6 && CLASS_HOURS <= 22) {
      isValidTime = true;
      if (CLASS_HOURS === 22 && CLASS_MINUTES > 30) isValidTime = false;
    }
    return isValidTime;
  };

  const handleTimeChange = (date) => {
    if (validateClassTime(date)) {
      setSelectedTime(date);
    } else {
      setAlert('error', 'Class must be between 06:00AM - 10:30PM');
    }
    
  };

  const handleAcademicYear = (event, value) => {
    // setSelectedAcadmeicYear(value);
    if (value) {
      callApi(
        `${endpoints.communication.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`,
        'branchList'
      );
    }
    setSelectedGrade([]);
    setSectionList([]);
    setSelectedSection([]);
    setSelectedBranch([]);
  };

  const handleBranch = (event = {}, value = []) => {
    setSelectedBranch([]);
    setGradeList([]);
    setSelectedSection([]);
    setSelectedTacher([]);
    setSelectedSubject([]);
    if (value?.length) {
      const ids = value.map((el) => el);
      const selectedId = value.map((el) => el?.branch?.id);
      setSelectedBranch(ids);
      setSelectedbranchIds(selectedId);
      callApi(
        `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id
        }&branch_id=${selectedId.toString()}&module_id=${moduleId}`,
        'gradeList'
      );
    }
    if (value?.length === 0) {
      setSelectedGrade([]);
      setGradeList([]);
    }
  };

  const handleGrade = (event = {}, value = []) => {
    setSelectedGrade([]);
    setGradeList([]);
    setSelectedSection([]);
    setSelectedTacher([]);
    setSelectedSubject([]);
    if (value?.length) {
      value =
        value.filter(({ grade_id }) => grade_id === 'all').length === 1
          ? [...gradeList].filter(({ grade_id }) => grade_id !== 'all')
          : value;
      const ids = value.map((el) => el) || [];
      const selectedId = value.map((el) => el?.grade_id) || [];
      const branchId = selectedBranch.map((el) => el?.branch?.id) || [];
      setSelectedGrade(ids);
      setSelectedGradeIds(selectedId);
      callApi(
        `${endpoints.academics.sections}?session_year=${selectedAcademicYear?.id
        }&branch_id=${selectedbranchIds}&grade_id=${selectedId.toString()}&module_id=${moduleId}`,
        'section'
      );
    }
  };

  const handleSection = (event = {}, value = []) => {
    setSelectedSection([]);
    setSelectedTacher([]);
    setSelectedSubject([]);
    if (value?.length) {
      const ids = value.map((el) => el);
      const selectedId = value.map((el) => el?.section_id);
      const sectionid = value.map((each) => each?.id)
      setSectionId(sectionid)
      setSelectedSection(ids);
      setSelectedSectionIds(selectedId);
    }
  };

  function callApi(api, key) {
    setLoading(true);
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'academicYearList') {
            const defaultValue = result?.data?.data?.[0];
            handleAcademicYear({}, defaultValue);
            setAcademicYear(result?.data?.data || []);
          }
          if (key === 'branchList') {
            setBranchList(result?.data?.data?.results || []);
          }
          if (key === 'gradeList') {
            setGradeList(result.data.data || []);
          }
          if (key === 'section') {
            setSectionList(result.data.data);
          }
        } else {
          setAlert('error', result.data.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        setAlert('error', error.message);
        setLoading(false);
      });
  }
  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Online Class' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Create Class') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, [window.location.pathname]);

  useEffect(() => {
    callApi(
      `${endpoints.communication.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`,
      'branchList'
    );
  }, [moduleId, isCreateClassOpen]);

  const getPeriodTypes = () => {
    setLoading(true);

    axiosInstance
      .get(`${endpoints.period.periodType}`)
      .then((result) => {
        if (result?.data?.status_code === 200) {
          const lists = result.data?.result;
          setPeriodTypes(lists);
        } else {
          setAlert('error', result?.data?.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        setAlert('error', error?.message);
        setLoading(false);
      });
  };

  const getTeachers = () => {
    setLoading(true);
    axiosInstance
      .get(
        `${endpoints.aol.teacherList}?branch_id=${selectedbranchIds}&grade_id=${selectedGradeIds}&session_year=${selectedAcademicYear?.id}`
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setTeacherList(result?.data?.data);
        } else {
          setAlert('error', result?.data?.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        setAlert('error', error?.message);
        setLoading(false);
      });
  };

  const getSubjects = () => {
    setLoading(true);

    axiosInstance
      .get(
        `${endpoints.academics.subjects}?branch=${selectedbranchIds}&grade=${selectedGradeIds}&session_year=${selectedAcademicYear?.id}&section=${selectedSectionIds}&module_id=${moduleId}`
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          // setTeacherList(result?.data?.data)
          // setPeriodTypes(lists);
          setSubjectList(result?.data?.data);
        } else {
          setAlert('error', result?.data?.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        setAlert('error', error?.message);
        setLoading(false);
      });
  };

  const handleTeacher = (event = {}, value = []) => {
    setSelectedTacher(value);
  };

  const handleSubject = (event = {}, value = []) => {
    setSelectedSubject(value);
  };

  useEffect(() => {
    if (selectedSection?.length > 0) {
      getTeachers();
    }
  }, [selectedSection]);

  useEffect(() => {
    if (selectedTeacher?.roles) {
      getSubjects();
    }
  }, [selectedTeacher]);

  useEffect(() => {
    getPeriodTypes();
  }, [isCreateClassOpen]);

  useEffect(() => {
    if (!selectAll) {
      if (selectedSection.length > 0) {
        axiosInstance
          .get(
            `${endpoints.period.paticipantsList}?page=${pageno}&section_mappings=${sectionId}`
          )
          .then((result) => {
            if (result?.data?.status_code === 200) {
              setParticipants(result?.data?.result);
              setHeaders([
                // { field: 'id', headerName: 'ID', width: 250 },
                {
                  field: 'participant',
                  headerName: 'participant',
                  width: 250,
                  headerAlign: 'center',
                },
                {
                  field: 'branch_name',
                  headerName: 'Branch',
                  width: 100,
                  headerAlign: 'center',
                },
                {
                  field: 'grade_name',
                  headerName: 'Grade',
                  width: 100,
                  headerAlign: 'center',
                },
              ]);
              const rows = [];
              const selectionRows = [];
              result.data.result.results.forEach((items, index) => {
                rows.push({
                  id: index,
                  participant: items.name,
                  erp_id: items.erp_id,
                  userid: items.user_id,
                  id: items?.id,
                  branch_name: items?.branch_name,
                  grade_name: items?.grade_name,
                });
                selectionRows.push({
                  id: index,
                  data: {
                    id: index,
                    name: items.name,
                    erp_id: items.erp_id,
                    userid: items.user_id,
                    id: items?.id,
                  },
                  selected: selectAll
                    ? true
                    : selectedUsers.length
                      ? selectedUsers[pageno - 1].selected.includes(items.user_id)
                      : false,
                });
              });

              setUsersRow(rows);
              setCompleteData(selectionRows);
              setTotalPage(result.data.result.count);
              // handleSelectAll()
              if (!selectedUsers.length) {
                const tempSelectedUser = [];
                for (let page = 1; page <= result.data.result.total_pages; page += 1) {
                  tempSelectedUser.push({ pageNo: page, selected: [] });
                }
                setSelectedUsers(tempSelectedUser);
              }
              // UnSelectAll()
            } else {
              setAlert('error', result?.data?.message);
            }
          })
          .catch((error) => {
            setAlert('error', error?.message);
          });
      }
    }
  }, [selectAll, pageno]);

  const UnSelectAll = () => {
    var items = document.querySelectorAll('input[type=checkbox]');
    items.forEach((item, index) => {
      if (item.checked) {
        items[index].click();
      }
    });
  };

  const handleSelectAll = () => {
    const testclick = document.querySelectorAll('input[type=checkbox]'); // [class*="PrivateSwitchBase-input-"]
    if (pageno === 1 && !selectAll) {
      const testclick = document.querySelectorAll('input[type=checkbox]'); // [class*="PrivateSwitchBase-input-"]
      for (let i = 1; i < testclick.length; i += 1) {
        if (!testclick[i]?.checked) {
          testclick[i].click();
        }
      }
    } else {
      for (let i = 2; i < testclick.length; i += 1) {
        testclick[i].click();
      }
    }
  };

  const handleSelect = () => {
    // const testclick = document.querySelectorAll('input[type=checkbox]'); // [class*="PrivateSwitchBase-input-"]
    // if(selectAll){
    //   for (let i = 2; i < testclick.length; i += 1) {
    //     testclick[i].click();
    //   }
    //   setSelectAll(false)
    // }
    // if(!selectAll){
    //   setSelectAll(true)
    //   for (let i = 2; i < testclick.length; i += 1) {
    //     testclick[i].click();
    //   }
    // }
    if (selectAll) {
      setSelectAll(false);
    } else {
      setSelectAll(true);
    }
  };

  const checkAll = selectAllObj[pageno - 1]?.selectAll || false;

  const top100Films = [
    { time: '12:00 PM', year: 1994 },
    { time: '01:00 PM', year: 1972 },
    { time: '02:00 PM', year: 1974 },
    { time: '03:00 PM', year: 2008 },
    { time: '04:00 PM', year: 1957 },
  ];

  const handleCreateClass = () => {
    if (!periodDate) {
      setAlert('warning', 'Please select Date ');
      return;
    }
    if (selectedSection.length === 0) {
      setAlert('warning', 'All Fields Required');
    }
    if (selectedSubject?.subject__id === undefined) {
      setAlert('warning', 'All Fields Required');
    }
    if (duration.length === 0) {
      setAlert('warning', 'All Fields Required');
    } else {
      let selectionArray = [];
      if (!selectAll) {
        selectedUsers.forEach((item) => {
          item.selected.forEach((ids) => {
            selectionArray.push(ids);
          });
        });
      }
      let data = {};
      if (selectAll) {
        data = {
          period_type: selectedPeriod?.id,
          day: moment(periodDate).day(),
          date: periodDate,
          start_time: moment(selectedTime).format('HH:mm:ss'),
          duration: parseInt(duration),
          is_allowed_for_all: true,
          subject_mapping: selectedSubject?.id,
          teacher: selectedTeacher?.user__id,
          title: periodName,
        };
      } else {
        data = {
          day: moment(periodDate).day(),
          date: periodDate,
          start_time: moment(selectedTime).format('hh:mm:ss'),
          duration: parseInt(duration),
          is_allowed_for_all: false,
          subject_mapping: selectedSubject?.id,
          teacher: selectedTeacher?.user__id,
          participants: selectionArray,
          title: periodName,
          period_type: selectedPeriod?.id,
        };
      }
      setLoading(true);
      axiosInstance
        .post(`${endpoints.period.createPeriod}`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setAlert('success', 'Period Created');
            toggleCreateClass();
            handleClear();
            setLoading(false);
          } else {
            if ("period already allocated" === result?.data?.message.slice(0, 24)) {
              setAlert('error', "Tutor Already Occupied")
            }
            else {
              setAlert('error', result?.data?.message);
            }
            setLoading(false);
          }
        })
        .catch((error) => {
          setAlert('error', error?.message);
          setLoading(false);
        });
    }
  };

  const handleClear = () => {
    setPeriodName('');
    setSelectedBranch([]);
    setSelectedGrade([]);
    setSelectedSection([]);
    setSelectedbranchIds([]);
    setSelectedSectionIds([]);
    setSelectedGradeIds([]);
    setSelectedTacher();
    setSelectedSubject();
    setDuration();
    setSelectedPeriod();
  };

  return (
    <div>
      {loading && <Loader />}

      <Dialog
        open={isCreateClassOpen}
        onClose={toggleCreateClass}
        aria-labelledby='form-dialog-title'
        style={{ marginTop: '3%' }}
      >
        <div style={{ marginTop: '20px' }}>
          {' '}
          <span style={{ fontSize: '18px', margin: '20px', padding: 5 }}>
            <b>Create Class</b>
          </span>
          <HighlightOffIcon
            style={{ float: 'right', marginRight: '20px', cursor: 'pointer' }}
            onClick={toggleCreateClass}
          />
        </div>
        <div style={{ padding: 5 }}>
          <div className={classes.root}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'column',
                paddingLeft: '20px',
                cursor: 'pointer',
              }}
            >
              <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ margin: '0px' }}>
                <KeyboardTimePicker
                  margin='normal'
                  id='time-picker'
                  label='Start Time'
                  value={selectedTime}
                  onChange={handleTimeChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />
              </MuiPickersUtilsProvider>
              <TextField
                style={{ marginTop: '4%', cursor: 'pointer' }}
                id='date'
                label='Select Date'
                type='date'
                // defaultValue={TodayDate}
                onChange={handleDateClass}
                // className={classes.textField}
                inputProps={{ min: date }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', padding: '15px 20px' }}>
            <div style={{ display: 'flex' }}>
              <Grid style={{ margin: '3% 3% 3% 0' }}>
                <TextField
                  variant='outlined'
                  size='small'
                  // id='eventname'
                  label='Duration (min)'
                  type='number'
                  value={duration}
                  fullWidth
                  onChange={handleDuration}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    maxLength: 3,
                  }}
                />
              </Grid>
              <Grid style={{ margin: '3% 0' }}>
                <TextField
                  variant='outlined'
                  size='small'
                  // id='eventname'
                  label='Period Name'
                  value={periodName}
                  fullWidth
                  onChange={handlePeriodName}
                  inputProps={{
                    maxLength: 25,
                  }}
                />
              </Grid>
            </div>
            <Grid style={{ margin: '3% 0' }}>
              <Autocomplete
                // multiple
                id='combo-box-demo'
                options={periodTypes}
                value={selectedPeriod}
                onChange={handlePeriod}
                getOptionLabel={(option) => option.type}
                size='small'
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label=''
                    variant='outlined'
                    label='Period Type'
                    placeholder='Period Type'
                  />
                )}
              />
            </Grid>
            <Grid style={{ margin: '3% 0' }}>
              <Autocomplete
                multiple
                style={{ width: '100%' }}
                size='small'
                onChange={handleBranch}
                id='branch_id'
                className='dropdownIcon'
                value={selectedBranch || []}
                options={branchList || []}
                getOptionLabel={(option) => option?.branch?.branch_name || ''}
                getOptionSelected={(option, value) =>
                  option?.branch?.id == value?.branch?.id
                }
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
            <Grid style={{ margin: '3% 0' }}>
              <Autocomplete
                multiple
                style={{ width: '100%' }}
                size='small'
                limitTags={2}
                onChange={handleGrade}
                id='grade_id'
                className='dropdownIcon'
                value={selectedGrade || []}
                options={gradeList || []}
                getOptionLabel={(option) => option?.grade__grade_name || ''}
                getOptionSelected={(option, value) => option?.id == value?.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Grade'
                    placeholder='Grade'
                  />
                )}
              />
            </Grid>
            <Grid style={{ margin: '3% 0' }}>
              <Autocomplete
                multiple
                style={{ width: '100%' }}
                size='small'
                onChange={handleSection}
                id='branch_id'
                className='dropdownIcon'
                value={selectedSection || []}
                options={sectionList || []}
                getOptionLabel={(option) =>
                  option?.section__section_name || option?.section_name || ''
                }
                getOptionSelected={(option, value) =>
                  option?.section_id == value?.section_id
                }
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
            <Grid style={{ margin: '3% 0' }}>
              <Autocomplete
                // multiple
                style={{ width: '100%' }}
                size='small'
                onChange={handleTeacher}
                id='branch_id'
                className='dropdownIcon'
                value={selectedTeacher || []}
                options={teacherList || []}
                getOptionLabel={(option) => option?.name || option?.name || ''}
                getOptionSelected={(option, value) => option?.name == value?.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Teacher'
                    placeholder='Teacher'
                  />
                )}
              />
            </Grid>
            <Grid style={{ margin: '3% 0' }}>
              <Autocomplete
                // multiple
                style={{ width: '100%' }}
                size='small'
                onChange={handleSubject}
                id='branch_id'
                className='dropdownIcon'
                value={selectedSubject || []}
                options={subjectList || []}
                getOptionLabel={(option) =>
                  option?.subject__subject_name || option?.subject__subject_name || ''
                }
                getOptionSelected={(option, value) =>
                  option?.subject__subject_name == value?.subject__subject_name
                }
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
          </div>
          <div>
            <Grid item md={2} xs={4}>
              <Typography color='secondary'>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectAll}
                      onChange={(e) => handleSelect(e)}
                      color='primary'
                    />
                  }
                  label='Select all'
                />
              </Typography>
            </Grid>
          </div>
          {!selectAll ? (
            <>
              {/* <div>
                <Grid item md={2} xs={4}>
                  <Typography color="secondary">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectAll}
                          onChange={(e) => handleSelect(e)}
                          color='primary'
                        />
                      }
                      label='Select all'
                    />
                  </Typography>
                </Grid>
              </div> */}
              <div>
                <CustomSelectionTable
                  header={headers}
                  rows={usersRow}
                  checkAll={checkAll}
                  completeData={completeData}
                  totalRows={totalPage}
                  pageno={pageno}
                  selectedUsers={selectedUsers}
                  changePage={setPageno}
                  setSelectAll={setSelectAll}
                  setSelectedUsers={setSelectedUsers}
                  pageSize={15}
                  name='Create Class'
                />
              </div>
            </>
          ) : (
            ''
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              height: '3rem',
              marginBottom: '20px',
            }}
          >
            <Button variant='contained' color='primary' onClick={handleCreateClass}>
              Create Class
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default CreateClass;
