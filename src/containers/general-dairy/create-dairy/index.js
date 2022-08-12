import React, { useContext, useEffect, useState } from 'react';
import {useSelector} from 'react-redux'
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
  lighten,
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
import './diary-scroll.css'

// import CustomSelectionTable from '../../communication/custom-selection-table/custom-selection-table';
import DiaryCustomSelectionTable from '../../communication/diary-curstom-selection-table/diary-custom-selection-table';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import { filter } from 'lodash';


// import CustomSelectionTable from '../../../containers/communication/custom-selection-table';
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
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


  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
    padding: 20,
  },
  table: {
    minWidth: 500,
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
  acceptedfiles: {
    color: theme.palette.secondary.main,
    fontSize: '16px',
    marginLeft: '28px',
    marginTop: '8px',
  },
  descriptionBorder: {
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: "10px",
    marginLeft: "2.3125rem",
    marginRight: "2.3125rem",
    opacity: 1,
  },
  attchmentbutton: {
    textTransform: "none",
    background: "white",
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: "10px",
    marginLeft: "1.75rem",
  }

}));
const headCells = [
  { id: 'si_no', label: 'S.No.' },
  { id: 'erp_id', label: 'ERP id' },
  { id: 'Student name', label: 'Name' },
];
function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead className='styled__table-head'>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            // style={{position:"relative",left:"10px"}}
            align='center'
            padding='none'
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span>
                  {order === 'desc' ? '' : ''}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell padding='checkbox'>
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};
const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '1 1 100%',
  },
}));
const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color='inherit'
          variant='subtitle1'
          component='div'
        >
          {`${numSelected} selected`}
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant='h6'
          id='tableTitle'
          component='div'
        >
          Filter student
        </Typography>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};


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
  // const classes = usedStyles();
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};

  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';
  const [flag, setFlag] = useState(false);
  const [sectionDropdown, setSectionDropdown] = useState([]);
  const [gradeDropdown, setGradeDropdown] = useState([]);
  const [sectionIds, setSectionIds] = useState([]);
  const [branchDropdown, setBranchDropdown] = useState([]);
  const [searchAcademicYear, setSearchAcademicYear] = useState('');
  const [academicYear, setAcademicYear] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 15;
  // const [page, setPage] = React.useState(1);
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
  // const [selectAll, setSelectAll] = useState(false);
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
  const [files, setFiles] = useState([]);



  const [order, setOrder] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [overviewSynopsis, setOverviewSynopsis] = useState([]);
  const [doc, setDoc] = useState(null);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [acadId, setAcadId] = useState();
  
  // useEffect(() => {});

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


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const handleSelectAllClick = (event) => {
    if (event.target.checked) {

      const newSelecteds = completeData.map((n) => n.id);

      setSelected(newSelecteds);
      //   dispatch(listFilteredStudents(newSelecteds));
      return;
    }
    // dispatch(listFilteredStudents([]));
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected?.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    // dispatch(listFilteredStudents(newSelected));
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) =>
    selected.indexOf(name) !== -1

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, props.rows?.length - page * rowsPerPage);

  const addIndex = () => {

    return usersRow.map((student, index) => ({ ...student, sl: index + 1 }));
  };

  // const handleChangePage = (event, newPage) => {
  //   setFlag(true);
  //   setPageno(newPage + 1);
  //   // displayUsersList();
  // };
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
    setFilterData({ ...filterData, branch: [], grade: [], subject: '', chapter: '', section: [] });
    setOverviewSynopsis([]);
    if (value) {
      setAcadId(value)
      setFilterData({
        ...filterData,
        branch: [value],
        grade: '',
        subject: '',
        chapter: '',
        section: [],
      });
      axiosInstance
        .get(
          `${endpoints.communication.grades}?session_year=${searchAcademicYear?.id
          }&branch_id=${value?.branch?.id}&module_id=${location.pathname === '/diary/student' ? studentModuleId : teacherModuleId
          }`
        )
        // axiosInstance.get(`${endpoints.communication.grades}?branch_id=${value.id}&module_id=${location.pathname === "/diary/student"?studentModuleId:teacherModuleId}`)
        .then((result) => {
          if (result.data.status_code === 200) {
            setGradeDropdown(result.data.data);
            // setSubjectDropdown([]);
            // setChapterDropdown([]);
          }
        })
        .catch((error) => {
          // setAlert('error', error.message);
          setGradeDropdown([]);
          setSectionDropdown([])
          // setSubjectDropdown([]);
          // setChapterDropdown([]);
        });
    } else {
      setGradeDropdown([]);
      setSectionDropdown([]);
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
      section: '',
    });
    setOverviewSynopsis([]);
    if (value && filterData.branch) {
      setFilterData({
        ...filterData,
        grade: [value],
        subject: '',
        chapter: '',
        section: '',
      });
      axiosInstance
        .get(
          `${endpoints.masterManagement.sections}?session_year=${searchAcademicYear?.id
          }&branch_id=${filterData?.branch[0]?.branch?.id}&grade_id=${value?.grade_id
          }&module_id=${location.pathname === '/lesson-plan/student-view'
            ? studentModuleId
            : teacherModuleId
          }`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setSectionDropdown(result.data.data);
          } else {
            setAlert('error', result?.data?.message);
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
      setFilterData({ ...filterData, section: [value] });
    }
  };

  const validateFileSize = (size) => {
    return size / 1024 / 1024 > 25 ? false : true;
  };

  const handleImageChange = (event) => {
    let fileType = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    let selectedFileType = event.target.files[0]?.type;
    if (!fileType.includes(selectedFileType)) {
      setAlert('error', 'File Type not supported');
      event.target.value = '';
      return;
    }

    const fileSize = event.target.files[0]?.size;
    if (!validateFileSize(fileSize)) {
      setAlert('error', 'File size must be less than 25MB');
      event.target.value = '';
      return;
    }

    if (!filterData.grade || !filterData.section || !filterData.branch) {
      setAlert('error', 'Select all fields');
      return;
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
        if (result?.data?.status_code === 200) {
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

  const handleAcademicYear = (event = {}, value = '') => {
    setSearchAcademicYear('');
    setFilterData({ ...filterData, branch: '', grade: '', section: '' });
    if (value) {
      setSearchAcademicYear(value);
      setFilterData({ ...filterData, branch: '', grade: '', section: '' });
      axiosInstance
        .get(
          `${endpoints.masterManagement.branchMappingTable}?session_year=${value.id
          }&module_id=${location.pathname === '/diary/student' ? studentModuleId : teacherModuleId
          }`
        )
        .then((result) => {
          if (result?.data?.status_code) {
            setBranchDropdown(result?.data?.data.results);
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
    if (teacherModuleId || studentModuleId) {
      axiosInstance
        .get(
          `${endpoints.userManagement.academicYear}?module_id=${location.pathname === '/diary/student' ? studentModuleId : teacherModuleId
          }`
        )
        .then((result) => {
          if (result.data?.status_code === 200) {
            setAcademicYear(result.data?.data);
            const defaultValue = result.data.data?.[0];
            handleAcademicYear({}, defaultValue);
          } else {
            setAlert('error', result.data.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
  }, [teacherModuleId, studentModuleId]);
  const handleTabChange = (event, tab) => {
    setCurrentTab(tab);
    setIsEmail(!isEmail);
  };

  const displayUsersList = async (e) => {
    setClicked(true);
    const rolesId = [];
    const gradesId = [];
    const sectionsId = [];
    if (e === undefined && activeTab === 0 && !flag) {
      return;
    }
    if (
      filterData.branch.length === 0 ||
      filterData.grade.length === 0 ||
      filterData.section.length === 0
    ) {
      return;
    }
    let getUserListUrl;
    getUserListUrl = `${endpoints.generalDairy.studentList}?academic_year=${searchAcademicYear?.id
      }&active=${!isEmail ? '0' : '1'
    }&bgs_mapping=${filterData?.section?.map(
      (s) => s.id
    )}&module_id=${location.pathname === '/diary/student' ? studentModuleId : teacherModuleId
      }`;

    if (selectedSections.length && !selectedSections.includes('All')) {
      sectionList
        .filter((item) => selectedSections.includes(item?.section__section_name))
        .forEach((items) => {
          sectionsId.push(items?.id);
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
          { field: 'si_no', headerName: 'S.No.', width: 500 },
          { field: 'name', headerName: 'Name', width: 500 },
          { field: 'erp_id', headerName: 'ERP Id', width: 500 },
        ]);
        const res = result.data.result.results;
        result.data.result &&
          res.reverse().forEach((items) => {
            rows.push({
              si_no: items.id,
              erp_id: items.erp_id,
              name: items.name,
            });
            selectionRows.push({
              id: items.id,
              data: {
                si_no: items.id,
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

  
  const getGradeApi = async () => {
    try {
      setLoading(true);
      const result = await axiosInstance.get(
        `${endpoints.communication.grades}?session_year=${searchAcademicYear?.id
        }&branch_id=${selectedBranch.id}&module_id=${location.pathname === '/diary/student' ? studentModuleId : teacherModuleId
        }`,
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
        `${endpoints.communication.sections}?branch_id=${selectedBranch.id
        }&session_year=${selectedAcademicYear?.id}&grade_id=${gradesId.toString()}&module_id=${location.pathname === '/diary/student' ? studentModuleId : teacherModuleId
        }`,
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
        completeData
          .forEach((items) => {
            selectionArray.push(items.id);
          });
        // selectionArray.push(0);
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
            academic_year:acadId?.id,
            branch: filterData?.branch[0]?.branch?.id,
            // grades:[54],
            grade: filterData.grade.map((g) => g.grade_id),
            section_mapping: filterData.section.map((s) => s.id),
            section: filterData.section.map((g) => g.section_id),
            user_id: selected,
            dairy_type: 1,
          }
          : {
            title,
            message: description,
            academic_year:filterData?.branch[0]?.id,
            branch: filterData?.branch[0]?.branch?.id,
            grade: filterData.grade.map((g) => g.grade_id),
            section_mapping: filterData.section.map((s) => s.id),
            section: filterData.section.map((g) => g.section_id),
            user_id: selected,
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
        setAlert('success', 'General Dairy Created Successfully ');
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
    setFiles(file);
    return (
      <div className='file_row_image_new'>
        <div className='file_name_container_new'>
          {index + 1}
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
  const removeFileHandler = (i,file) => {
      const list = [...filePath];
      axiosInstance
        .post(`${endpoints.circular.deleteFile}`, {
          file_name: `${file}`,
        })
        .then((result) => {
          if (result.data.status_code === 204) {
            list.splice(i, 1);
            setFilePath(list);
            setAlert('success', result.data.message);
          } else {
            setAlert('error', result.data.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        })
        .finally(() =>
          setLoading(false)
        );
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
        if (result?.data?.status_code === 200) {
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
      <div
        className='general-dairy-scroll'
        style={{
          height: '90vh',
          overflowX: 'hidden',
          overflowY: 'scroll',
        }}>
        <CommonBreadcrumbs
          componentName='General Diary'
          childComponentName='Create New'
        />
        <div style={{ overflow: 'hidden' }}>
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
                value={searchAcademicYear || ''}
                options={academicYear || []}
                getOptionLabel={(option) => option?.session_year}
                filterSelectedOptions
                className='dropdownIcon'
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
                options={branchDropdown || []}
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
                style={{ color: 'white', width: '100%' }}
                color='primary'
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

          {totalPage ? (
            <div>
              <span className='create_group_error_span'>{selectectUserError}</span>
              <Paper className={classes.paper}>
                <EnhancedTableToolbar numSelected={selected?.length} />

                <TableContainer>
                  <Table
                    // className={`${classes.table} styled__table`}
                    aria-labelledby='tableTitle'
                    aria-label='enhanced table'
                  >
                    <EnhancedTableHead
                      // classes={classes}
                      numSelected={selected?.length}
                      order={order}
                      orderBy={orderBy}
                      onSelectAllClick={handleSelectAllClick}
                      onRequestSort={handleRequestSort}
                      rowCount={usersRow?.length}
                    />
                    <TableBody className='styled__table-body'>
                      {stableSort(addIndex(usersRow), getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => {
                          const isItemSelected = isSelected(row.si_no);
                          const labelId = `enhanced-table-checkbox-${index}`;

                          return (
                            <TableRow
                              hover
                              onClick={(event) => handleClick(event, row.si_no)}
                              role='checkbox'
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={row.si_no}
                              selected={isItemSelected}
                            >
                              <TableCell align='center'>{row.sl}</TableCell>
                              <TableCell align='center'>{row.erp_id}</TableCell>

                              <TableCell >{row.name}</TableCell>
                              <TableCell padding='checkbox'>
                                <Checkbox
                                  checked={isItemSelected}

                                  inputProps={{ 'aria-labelledby': labelId }}
                                />
                              </TableCell>

                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[]}
                  component='div'
                  count={usersRow.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </Paper>

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
            <div className={classes.descriptionBorder}>
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
                    color='primary'
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
                    color='primary'
                    style={{ width: '100%' }}
                    defaultValue={state.isEdit ? editData.description : []}
                    // value={description}
                    variant='outlined'
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>
              </Grid>
              <div className='attachmentContainer'>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    padding: '10px',
                  }}
                  className='scrollsable'
                >
                  {filePath?.length > 0
                    ? filePath?.map((file, i) => (
                      <FileRow
                        key={`homework_student_question_attachment_${i}`}
                        file={file}
                        index={i}
                        onClose={() => removeFileHandler(i,file)}
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
                    className={classes.attchmentbutton}
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
                    {'Add Document'}
                  </Button>
                  <small
                    className={classes.acceptedfiles}
                  >
                    {' '}
                    Accepted files: [jpeg,jpg,png,pdf]
                  </small>
                </div>
              </div>
            </div>
            <div>
              <Button
                variant="contained"
                style={{ marginLeft: '37px', marginTop: "20px" }}
                onClick={() => history.goBack()}
                className='labelColor cancelButton'
              >
                BACK
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: '20px', marginTop: "20px", color: "white" }}
                onClick={state.isEdit ? handleEdited : handleSubmit}

              >
                SUBMIT
              </Button>
            </div>
          </div>
        </div>
        </div>
      </Layout>
    </>
  );
});

export default CreateGeneralDairy;
