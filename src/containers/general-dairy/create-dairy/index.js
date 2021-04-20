import React, { useContext, useEffect, useState } from 'react';
import Divider from '@material-ui/core/Divider';
import { useHistory, withRouter, useLocation } from 'react-router-dom';
import {
  Grid,
  TextField,
  Button,
  useTheme,
  SvgIcon,
  IconButton,
  TextareaAutosize,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableHead,
  TableRow,
  withStyles,
  Tabs,
  Tab,
  Typography,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import axios from 'axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Layout from '../../Layout';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import attachmenticon from '../../../assets/images/attachmenticon.svg';
import deleteIcon from '../../../assets/images/delete.svg';
import Loading from '../../../components/loader/loader';
import CustomMultiSelect from '../../communication/custom-multiselect/custom-multiselect';
import { Context } from '../context/context';
import unfiltered from '../../../assets/images/unfiltered.svg';
import selectfilter from '../../../assets/images/selectfilter.svg';

import CustomSelectionTable from '../../communication/custom-selection-table/custom-selection-table';

// import CustomSelectionTable from '../../../containers/communication/custom-selection-table';

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      maxWidth: 85,
      width: '80%',
      backgroundColor: '#ff6b6b',
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: '#014b7e',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(0),
    '&:focus': {
      opacity: 1,
    },
  },
}))((props) => <Tab disableRipple {...props} />);

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: '0 auto',
    boxShadow: 'none',
  },
  container: {
    maxHeight: '70vh',
    width: '100%',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  tableCell: {
    color: theme.palette.secondary.main,
  },
  buttonContainer: {
    width: '95%',
    margin: '0 auto',
    background: theme.palette.background.secondary,
    paddingBottom: theme.spacing(2),
  },
}));

const CreateGeneralDairy = withRouter(({ history, ...props }) => {
  const {
    edit,
    preSeletedRoles,
    preSeletedBranch,
    preSeletedGrades,
    preSeletedSections,
    preSelectedGroupName,
    preSelectedGroupId,
    editClose,
  } = props || {};
  const classes = useStyles();
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};

  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';

  const [sectionDropdown, setSectionDropdown] = useState([]);
  const [gradeDropdown, setGradeDropdown] = useState([]);
  const [sectionIds, setSectionIds] = useState([]);
  const [branchDropdown, setBranchDropdown] = useState([]);
  const [searchAcademicYear, setSearchAcademicYear] = useState('');
  const [academicYear, setAcademicYear] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 15;
  const [page, setPage] = React.useState(1);
  const [currentTab, setCurrentTab] = useState(0);
  const [isEmail, setIsEmail] = useState(false);
  const [bulkData, setBulkData] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [pageno, setPageno] = useState(1);
  const [usersRow, setUsersRow] = useState([]);
  const [completeData, setCompleteData] = useState([]);
  const [moduleId, setModuleId] = useState();
  const [grade, setGrade] = useState([]);
  const [filePath, setFilePath] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [clicked, setClicked] = useState(false);

  const [selectedSections, setSelectedSections] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [selectectUserError, setSelectectUserError] = useState('');
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [section, setSection] = useState([]);

  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchList, setBranchList] = useState([]);
  const [selectAllObj, setSelectAllObj] = useState([]);
  const [title, setTitle] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const location = useLocation();
  const [studentModuleId, setStudentModuleId] = useState();
  const [teacherModuleId, setTeacherModuleId] = useState(null);

  const [description, setDescription] = useState('');
  // context
  const [state, setState] = useContext(Context);
  const { isEdit, editData } = state;
  const { setIsEdit, setEditData } = setState;

  const [overviewSynopsis, setOverviewSynopsis] = useState([]);
  const [doc, setDoc] = useState(null);
  useEffect(() => {
  })

  const selectionArray = [];

  if (!selectAll) {
    selectedUsers.forEach((item) => {
      item.selected.forEach((ids) => {
        selectionArray.push(ids);
      });
    });
  }
  if (selectAll) {
    selectionArray.push(0);
  }


  const handleClear = () => {
    setFilterData({
      grade: '',
      branch: '',
    });
    // setPeriodData([]);
    setSectionDropdown([]);
  };

  const handleChangePage = (event, newPage) => {
    setPageno(newPage + 1);
  };
  const [filterData, setFilterData] = useState({
    branch: '',
    grade: '',
    section: '',
    role: '',
  });

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Diary' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (
              location.pathname === '/diary/student' &&
              item.child_name === 'Student View'
            ) {
              setStudentModuleId(item?.child_id);
            } else if (
              location.pathname === '/create/general-diary' &&
              item.child_name === 'Teacher Diary'
            ) {
              setTeacherModuleId(item?.child_id);
            }
          });
        }
      });
    }
  }, [location.pathname]);

  const handleBranch = (event, value) => {
    setFilterData({ ...filterData, branch: [], grade: [], subject: '', chapter: '' });
    setOverviewSynopsis([]);
    if (value) {
      setFilterData({
        ...filterData,
        branch: [...filterData.branch, value],
        grade: '',
        subject: '',
        chapter: '',
      });
      axiosInstance
        .get(
          `${
            endpoints.communication.grades
          }?session_year=${searchAcademicYear}&branch_id=${value.id}&module_id=${
            location.pathname === '/diary/student' ? studentModuleId : teacherModuleId
          }`
        )
        // axiosInstance.get(`${endpoints.communication.grades}?branch_id=${value.id}&module_id=${location.pathname === "/diary/student"?studentModuleId:teacherModuleId}`)
        .then((result) => {
          if (result.data.status_code === 200) {
            setGradeDropdown(result.data.data);
          } else {
            setAlert('error', result.data.message);
            setGradeDropdown([]);
            // setSubjectDropdown([]);
            // setChapterDropdown([]);
          }
        })
        .catch((error) => {
          // setAlert('error', error.message);
          setGradeDropdown([]);
          // setSubjectDropdown([]);
          // setChapterDropdown([]);
        });
    } else {
      setGradeDropdown([]);
      // setSubjectDropdown([]);
      // setChapterDropdown([]);
    }
  };

  const handleGrade = (event, value) => {
    setFilterData({
      ...filterData,
      ...(filterData.grade = []),
      subject: '',
      chapter: '',
      section: ''
    });
    setOverviewSynopsis([]);
    if (value && filterData.branch) {
      setFilterData({
        ...filterData,
        grade: [...filterData.grade, value],
        subject: '',
        chapter: '',
        section: ''
      });
      axiosInstance
        .get(
          `${endpoints.masterManagement.sections}?session_year=${searchAcademicYear}&branch_id=${
            filterData?.branch[0]?.id
          }&grade_id=${value.grade_id}&module_id=${
            location.pathname === '/lesson-plan/student-view'
              ? studentModuleId
              : teacherModuleId
          }`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setSectionDropdown(result.data.data);
          } else {
            setAlert('error', result.data.message);
            setSectionDropdown([]);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
          setSectionDropdown([]);
        });
    } else {
      setSectionDropdown([]);
      // setChapterDropdown([]);
    }
  };
  const handleSection = (event, value) => {
    setFilterData({ ...filterData, ...(filterData.section = []) });
    if (value) {
      setFilterData({ ...filterData, section: [...filterData.section, value] });
    }
  };

  const handleImageChange = (event) => {
    let fileType = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    let selectedFileType = event.target.files[0]?.type
    if (!fileType.includes(selectedFileType)) {
      return setAlert('error', 'File Type not supported');
    }
    
    if (!filterData.grade || !filterData.section || !filterData.branch) {
      return setAlert('error', 'Select all fields');
    }
    
    setDoc(event.target.files[0]?.name);
    setLoading(true);
    if (filePath.length < 10) {
      // setLoading(true)
      const data = event.target.files[0];
      var fd = new FormData();
      fd.append('file', event.target.files[0]);
      fd.append('branch', filterData?.branch[0]?.branch_name);
      fd.append(
        'grade',
        filterData.grade.map((g) => g.grade_id)
      );
      fd.append(
        'section',
        filterData.section.map((s) => s.id)
      );
      axiosInstance.post(`${endpoints.generalDairy.uploadFile}`, fd).then((result) => {
        if (result.data.status_code === 200) {
          setAlert('success', result.data.message);
          setLoading(false);
          setFilePath([...filePath, result.data.result]);
        } else {
          setLoading(false);
          setAlert('error', result.data.message);
        }
      });
    } else {
      setAlert('warning', 'Exceed Maximum Number Attachment');
    }
  };

  const handleAcademicYear = (event, value) => {
    setSearchAcademicYear('');
    if (value) {
      setSearchAcademicYear(value.id);
      axiosInstance
        .get(
          `${endpoints.masterManagement.branchList}?session_year=${value.id}&module_id=${
            location.pathname === '/diary/student' ? studentModuleId : teacherModuleId
          }`
        )
        .then((result) => {
          if (result?.data?.status_code) {
            setBranchDropdown(result?.data?.data);
          } else {
            setAlert('error', result?.data?.message);
          }
        })
        .catch((error) => setAlert('error', error?.message));
    }
  };
  useEffect(() => {
    displayUsersList();
  }, [pageno, searchAcademicYear]);

  useEffect(() => {
    // getBranchApi();
  }, []);
  useEffect(() => {
    if (selectedBranch) {
      setGrade([]);
      getGradeApi();
    }
  }, [selectedBranch]);

  useEffect(() => {
    if (selectedGrades.length && gradeList.length) {
      // setSelectedSections([]);
      getSectionApi();
    } else if (!edit) {
      setSelectedSections([]);
    }
  }, [gradeList, selectedGrades]);

  useEffect(() => {
    // axiosInstance.get(`${endpoints.communication.branches}`)
    //     .then(result => {
    //         if (result.data.status_code === 200) {
    //             setBranchDropdown(result.data.data);
    //         } else {
    //             setAlert('error', result.data.message);
    //         }
    //     }).catch(error => {
    //         setBranchDropdown('error', error.message);
    //     })
    axiosInstance
      .get(endpoints.userManagement.academicYear)
      .then((result) => {
        if (result.status === 200) {
          setAcademicYear(result.data.data);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  }, []);
  const handleTabChange = (event, tab) => {
    setCurrentTab(tab);
    setIsEmail(!isEmail);
  };

  const displayUsersList = async (e) => {
    setClicked(true);
    const rolesId = [];
    const gradesId = [];
    const sectionsId = [];
    if (e === undefined && activeTab === 0) {
      return;
    }
    let getUserListUrl;
    getUserListUrl = `${
      endpoints.generalDairy.studentList
    }?academic_year=${searchAcademicYear}&active=${
      !isEmail ? '0' : '1'
    }&page=${pageno}&page_size=15&bgs_mapping=${filterData.section.map(
      (s) => s.id
    )}&module_id=${
      location.pathname === '/diary/student' ? studentModuleId : teacherModuleId
    }`;

    if (selectedSections.length && !selectedSections.includes('All')) {
      sectionList
        .filter((item) => selectedSections.includes(item.section__section_name))
        .forEach((items) => {
          sectionsId.push(items.section_id);
        });
    }

    if (sectionsId.length && !selectedSections.includes('All')) {
      getUserListUrl += `&bgs_mapping=${sectionsId.toString()}`;
    }

    try {
      setLoading(true);
      const result = await axiosInstance.get(getUserListUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.status === 200) {
        const rows = [];
        const selectionRows = [];
        setHeaders([
          { field: 'name', headerName: 'Name', width: 500 },
          { field: 'erp_id', headerName: 'Erp Id', width: 500 },
        ]);

        result.data.result &&
          result.data.result.results.forEach((items) => {
            rows.push({
              id: items.id,
              erp_id: items.erp_id,
              name: items.name,
            });
            selectionRows.push({
              id: items.id,
              data: {
                id: items.id,
                erp_id: items.erp_id,
                name: items.name,
              },
              selected: selectAll
                ? true
                : selectedUsers.length
                ? selectedUsers[pageno - 1].selected.includes(items.id)
                : false,
            });
          });
        setUsersRow(rows);
        setCompleteData(selectionRows);
        setTotalPage(result.data.result && result.data.result.count);
        setLoading(false);
        if (!selectedUsers.length) {
          const tempSelectedUser = [];
          for (
            let page = 1;
            page <= (result.data && result.data.result && result.data.result.total_pages);
            page += 1
          ) {
            tempSelectedUser.push({ pageNo: page, first: true, selected: [] });
          }
          setSelectedUsers(tempSelectedUser);
        }
        if (result.data.total_pages !== selectAllObj.length) {
          const tempSelectAll = [];
          for (let page = 1; page <= result.data.total_pages; page += 1) {
            tempSelectAll.push({ selectAll: false });
          }
          setSelectAllObj(tempSelectAll);
        }
      } else {
        setAlert('error', result.data.message);
        setLoading(false);
      }
    } catch (error) {
      setAlert('error', error.message);
      setLoading(false);
    }
  };

  // const getBranchApi = async () => {
  //   try {
  //     setLoading(true);
  //     const result = await axiosInstance.get(endpoints.communication.branches, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     const resultOptions = [];
  //     if (result.status === 200) {
  //       result.data.data.map((items) => resultOptions.push(items.branch_name));
  //       setBranchList(result.data.data);
  //       setLoading(false);
  //     } else {
  //       setAlert('error', result.data.message);
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     setAlert('error', error.message);
  //     setLoading(false);
  //   }
  // };

  const getGradeApi = async () => {
    try {
      setLoading(true);
      const result = await axiosInstance.get(
        `${endpoints.communication.grades}?session_year=${searchAcademicYear}&branch_id=${selectedBranch.id}&module_id=${moduleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resultOptions = [];
      if (result.status === 200) {
        result.data.data.map((items) => resultOptions.push(items.grade__grade_name));
        if (selectedBranch) {
          setGrade(resultOptions);
        }
        setGradeList(result.data.data);
        setLoading(false);
      } else {
        setAlert('error', result.data.message);
        setLoading(false);
      }
    } catch (error) {
      setAlert('error', error.message);
      setLoading(false);
    }
  };

  const getSectionApi = async () => {
    try {
      setLoading(true);
      const gradesId = [];
      gradeList
        .filter((item) => selectedGrades.includes(item.grade__grade_name))
        .forEach((items) => {
          gradesId.push(items.grade_id);
        });
      const result = await axiosInstance.get(
        `${endpoints.communication.sections}?branch_id=${
          selectedBranch.id
        }&grade_id=${gradesId.toString()}&module_id=${moduleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resultOptions = [];
      if (result.status === 200) {
        result.data.data.map((items) => resultOptions.push(items.section__section_name));
        setSection(resultOptions);
        setSectionList(result.data.data);
        if (selectedSections && selectedSections.length > 0) {
          // for retaining neccessary selected sections when grade is changed
          const selectedSectionsArray = selectedSections.filter(
            (sec) =>
              result.data.data.findIndex((obj) => obj.section__section_name == sec) > -1
          );
          setSelectedSections(selectedSectionsArray);
        }
        setLoading(false);
      } else {
        setAlert('error', result.data.message);
        setLoading(false);
      }
    } catch (error) {
      setAlert('error', error.message);
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const testclick = document.querySelectorAll('input[type=checkbox]');
    if (!selectAll) {
      testclick[1].click();
    } else {
      for (let i = 2; i < testclick.length; i += 1) {
        testclick[i].click();
      }
    }
  };

  const handleSubmit = async () => {
    // if (!!filePath.length) {
    //   return setAlert('error', 'Upload attachment!');
    // }
    const assignRoleApi = endpoints.generalDairy.SubmitDairy;

    setSelectectUserError('');
    try {
      const selectionArray = [];

      if (!selectAll) {
        selectedUsers.forEach((item) => {
          item.selected.forEach((ids) => {
            selectionArray.push(ids);
          });
        });
      }
      if (selectAll) {
        selectionArray.push(0);
      }

      if (!title || !description) {
        setAlert('error', 'Fill in required fields');
        return;
      }
      const response = await axiosInstance.post(
        assignRoleApi,
        filePath && filePath.length > 0
          ? {
              title,
              message: description,
              // module_name:filterData.role.value,
              documents: filePath,
              // branch:filterData.branch.map(function (b) {
              //     return b.id
              //   }),
              branch: filterData.branch[0].id,
              // grades:[54],
              grade: filterData.grade.map((g) => g.grade_id),
              mapping_bgs: filterData.section.map((s) => s.id),
              user_id: selectionArray,
              dairy_type: 1,
            }
          : {
              title,
              message: description,
              branch: filterData.branch[0].id,
              grade: filterData.grade.map((g) => g.grade_id),
              mapping_bgs: filterData.section.map((s) => s.id),
              user_id: selectionArray,
              dairy_type: 1,
            },
        {
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { message, status_code: statusCode } = response.data;
      if (statusCode === 200) {
        setAlert('success', message);
        history.push('/diary/teacher');
        setSelectedUsers([]);
        setSelectectUserError('');
      } else {
        setAlert('error', response.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };
  const FileRow = (props) => {
    const { file, onClose, index } = props;
    return (
      <div className='file_row_image_new'>
        <div className='file_name_container_new'>
          {file}
          {/* {index + 1} */}
        </div>
        <div>
          <span onClick={onClose}>
            <SvgIcon
              component={() => (
                <img
                  style={
                    isMobile
                      ? {
                          marginLeft: '',
                          width: '20px',
                          height: '20px',
                          // padding: '5px',
                          cursor: 'pointer',
                        }
                      : {
                          width: '20px',
                          height: '20px',
                          // padding: '5px',
                          cursor: 'pointer',
                        }
                  }
                  src={deleteIcon}
                  alt='given'
                />
              )}
            />
          </span>
        </div>
      </div>
    );
  };
  const removeFileHandler = (i) => {
    // const list = [...filePath];
    filePath.splice(i, 1);
    setAlert('success', 'File successfully deleted');
  };
  const handleEdited = () => {
    axiosInstance
      .put(`${endpoints.circular.updateCircular}`, {
        circular_id: editData.id,
        circular_name: title,
        description,
        module_name: filterData.role.value,
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          setState({ ...state, isEdit: false });
          setTitle('');
          setDescription('');
          setAlert('success', result.data.message);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.data.message);
      });
  };
  useEffect(() => {
    if (clicked) {
      displayUsersList(activeTab);
    }
  }, [activeTab]);

  const handleActiveTab = (tab) => {
    setActiveTab(tab);
  };
  const checkAll = selectAllObj[pageno - 1]?.selectAll || false;

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div style={{ overflow: 'hidden' }}>
          <div className={isMobile ? 'breadCrumbFilterRow' : null}>
            <div style={{ width: '95%', margin: '20px auto' }}>
              <CommonBreadcrumbs
                componentName='General Diary'
                childComponentName='Create New'
              />
            </div>
          </div>
          <Grid
            container
            spacing={isMobile ? 3 : 5}
            style={{ width: widerWidth, margin: wider }}
          >
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <Autocomplete
                size='small'
                style={{ width: '100%' }}
                onChange={handleAcademicYear}
                id='year'
                options={academicYear}
                getOptionLabel={(option) => option?.session_year}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Academic Year'
                    placeholder='Academic Year'
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={handleBranch}
                id='grade'
                className='dropdownIcon'
                value={filterData?.branch[0] || ''}
                options={branchDropdown}
                getOptionLabel={(option) => option?.branch_name}
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
            {/* <Grid xs={12} lg={4} className='create_group_items' item>
                      {selectedBranch && gradeList.length ? (
                        <div>
                          <CustomMultiSelect
                            selections={selectedGrades}
                            setSelections={setSelectedGrades}
                            nameOfDropdown='Grade'
                            optionNames={grade}
                          />
                        </div>
                      ) : null}
                    </Grid> */}
            <Grid
              item
              xs={12}
              sm={3}
              className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
            >
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={handleGrade}
                id='grade'
                className='dropdownIcon'
                value={filterData?.grade[0] || ''}
                options={gradeDropdown}
                getOptionLabel={(option) => option?.grade__grade_name}
                filterSelectedOptions
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

            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={handleSection}
                id='grade'
                className='dropdownIcon'
                value={filterData?.section[0] || ''}
                options={sectionDropdown}
                getOptionLabel={(option) => option?.section__section_name}
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
            <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
              <Button
                variant='contained'
                style={{ color: 'white' }}
                color='primary'
                className='custom_button_master'
                size='medium'
                type='submit'
                disabled={!filterData?.section[0]}
                // onClick={displayUsersList}
                onClick={(event) => displayUsersList(event)}
              >
                FILTER
              </Button>
            </Grid>
          </Grid>

          <Grid container className='studentview-tab-container'>
            <Grid item xs={12} sm={6}>
              <StyledTabs
                variant='standard'
                value={currentTab}
                onChange={handleTabChange}
                aria-label='styled tabs example'
              >
                <StyledTab
                  label={<Typography variant='h8'>Active Students</Typography>}
                  onClick={(e) => handleActiveTab(0)}
                />
                {/* <StyledTab label={<Typography variant='h8'>Inactive Students</Typography>} onClick={(e) => handleActiveTab(1)}/> */}

                {/* <StyledTab label={<Typography variant='h8'>In-Active Students</Typography>} /> */}
              </StyledTabs>
            </Grid>
            <input
              type='checkbox'
              className='send_message_select_all_checkbox'
              checked={selectAll}
              style={
                isMobile
                  ? { marginLeft: '252px', marginTop: '-22px' }
                  : { marginLeft: '521px', marginTop: '19px' }
              }
              // style={{marginLeft: '-344px', marginTop: '19px'}}
              onChange={handleSelectAll}
            />
            <span
              style={
                isMobile
                  ? { marginLeft: '1%', marginTop: '-25px', fontSize: '16px' }
                  : { marginLeft: '1%', marginTop: '14px', fontSize: '16px' }
              }
            >
              Select All
            </span>

            {/* <span style={{ marginLeft: '1%', marginTop: '14px', fontSize: '16px'}}>Select All</span> */}
          </Grid>

          {/* <div className='create_group_select_all_wrapper'>
                
                </div> */}
          {totalPage ? (
            <div>
              <span className='create_group_error_span'>{selectectUserError}</span>
              <CustomSelectionTable
                // header={headers}
                // rows={usersRow}
                // checkAll={checkAll}
                // completeData={completeData}
                // totalRows={totalPage}
                // pageno={pageno}
                // setSelectAll={setSelectAll}
                // selectedUsers={selectedUsers}
                // changePage={setPageno}
                // setSelectedUsers={setSelectedUsers}
                // onChangePage={handleChangePage}
                // page={pageno-1}
                // count={totalPage}
                // pageSize={5}
                header={headers}
                rows={usersRow}
                completeData={completeData}
                totalRows={totalPage}
                setSelectAll={setSelectAll}
                pageno={pageno}
                selectedUsers={selectedUsers}
                changePage={setPageno}
                setSelectedUsers={(data) => {
                  setSelectedUsers(data);
                }}
              />
            </div>
          ) : (
            <div className='periodDataUnavailable'>
              <SvgIcon
                component={() => (
                  <img
                    style={
                      isMobile
                        ? { height: '100px', width: '200px' }
                        : { height: '160px', width: '290px' }
                    }
                    src={unfiltered}
                  />
                )}
              />
              <SvgIcon
                component={() => (
                  <img
                    style={
                      isMobile
                        ? { height: '20px', width: '250px' }
                        : { height: '50px', width: '400px', marginLeft: '5%' }
                    }
                    src={selectfilter}
                  />
                )}
              />
            </div>
          )}

          {/* <<<<<<<<<< EDITOR PART  >>>>>>>>>> */}
          <div>
            <div className='descriptionBorder'>
              <Grid
                container
                spacing={isMobile ? 3 : 5}
                style={{ width: widerWidth, margin: wider }}
              >
                <Grid item xs={12}>
                  <TextField
                    id='outlined-multiline-static'
                    label='Title'
                    multiline
                    rows='1'
                    color='secondary'
                    style={{ width: '100%', marginTop: '1.25rem' }}
                    defaultValue={state.isEdit ? editData.title : []}
                    // value={title}
                    variant='outlined'
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id='outlined-multiline-static'
                    label='Description'
                    multiline
                    rows='6'
                    color='secondary'
                    style={{ width: '100%' }}
                    defaultValue={state.isEdit ? editData.description : []}
                    // value={description}
                    variant='outlined'
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>
              </Grid>
              <div className='attachmentContainer'>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '10px' }} className='scrollsable'>
                  {filePath?.length > 0
                    ? filePath?.map((file, i) => (
                        <FileRow
                        key={`homework_student_question_attachment_${i}`}
                        file={file}
                        index={i}
                        onClose={() => removeFileHandler(i)}
                      />
                      ))
                    : null}
                </div>

                <div
                  style={isMobile ? { marginLeft: '114px' } : { marginBottom: '14px' }}
                  className='attachmentButtonContainer'
                >
                  <Button
                    startIcon={
                      <SvgIcon
                        component={() => (
                          <img
                            style={{ height: '20px', width: '20px' }}
                            src={attachmenticon}
                          />
                        )}
                      />
                    }
                    className='attchment_button'
                    title='Attach Supporting File'
                    variant='contained'
                    size='medium'
                    disableRipple
                    disableElevation
                    disableFocusRipple
                    disableTouchRipple
                    component='label'
                    style={{ textTransform: 'none', marginLeft: '-100px' }}
                  >
                    <input
                      type='file'
                      // style={{ display: 'none' }}
                      style={
                        isMobile
                          ? { display: 'none', marginLeft: '10px' }
                          : { display: 'none' }
                      }
                      id='raised-button-file'
                      accept='image/*, .pdf'
                      onChange={handleImageChange}
                    />
                    {'Add Document' }
                  </Button>
                  <small
                    style={{
                      color: '#014b7e',
                      fontSize: '16px',
                      marginLeft: '28px',
                      marginTop: '8px',
                    }}
                  >
                    {' '}
                    Accepted files: [jpeg,jpg,png,pdf]
                  </small>
                </div>
              </div>
            </div>
            <div>
            <Button
                style={{ marginLeft: '37px' }}
                onClick={() => history.goBack()}
                className='submit_button'
              >
                BACK
              </Button>
              <Button
                style={{ marginLeft: '20px' }}
                onClick={state.isEdit ? handleEdited : handleSubmit}
                className='submit_button'
              >
                SUBMIT
              </Button>

            </div>
          </div>
        </div>
      </Layout>
    </>
  );
});

export default CreateGeneralDairy;
