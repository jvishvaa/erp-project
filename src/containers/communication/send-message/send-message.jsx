/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable dot-notation */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/no-array-index-key */

/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  TextareaAutosize,
  Grid,
  useTheme,
  IconButton,
  Typography,
  Divider,
  Button,
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {
  Attachment as AttachmentIcon,
  HighlightOffOutlined as CloseIcon,
} from '@material-ui/icons';
import TextField from '@material-ui/core/TextField';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import HeaderSection from './components/header-section';
import CustomMultiSelect from '../custom-multiselect/custom-multiselect';
import CustomSelectionTable from '../custom-selection-table/custom-selection-table';
import Loading from '../../../components/loader/loader';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import './send-message.css';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 250,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  wrapper: {
    position: 'relative',
    overflow: 'hidden',
    display: 'inline-block',
  },
  attachmentIcon: {
    color: '#ff6b6b',
    marginLeft: '4%',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  fileInput: {
    fontSize: '50px',
    position: 'absolute',
    top: 0,
    bottom: 0,
    opacity: 0,
  },
  fileRow: {
    padding: '6px',
  },
  modalButtons: {
    position: 'sticky',
    width: '98%',
    margin: 'auto',
    bottom: 0,
  },
}));

const SendMessage = withRouter(({ history, ...props }) => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [customSelect, setCustomSelect] = useState(false);
  const [firstStep, setFirstStep] = useState(true);
  const [secondStep, setSecondStep] = useState(false);
  const [thirdStep, setThirdStep] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedAcademic, setSelectedAcademic] = useState('');
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [pageno, setPageno] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [usersRow, setUsersRow] = useState([]);
  const [completeData, setCompleteData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [group, setGroup] = useState([]);
  const [roles, setRoles] = useState([]);
  const [branch, setBranch] = useState([]);
  const [grade, setGrade] = useState([]);
  const [section, setSection] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [roleError, setRoleError] = useState('');
  const [gradeError, setGradeError] = useState('');
  const [branchError, setBranchError] = useState('');
  const [groupError, setGroupError] = useState('');
  const [selectUsersError, setSelectUsersError] = useState('');
  const [textMessage, setTextMessage] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [wordcount, setWordcount] = useState(641);
  const [isEmail, setIsEmail] = useState(false);
  const [smsTypeList, setSmsTypeList] = useState([]);
  const [selectedSmsType, setSelectedSmsType] = useState('');
  const [textMessageError, setTextMessageError] = useState('');
  const [messageTypeError, setMessageTypeError] = useState('');
  const [messageSending, setMessageSending] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [moduleId, setModuleId] = useState();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modulePermision, setModulePermision] = useState(true);

  const handleCustomChange = () => {
    setCustomSelect(!customSelect);
  };
  const getRoleApi = async () => {
    try {
      setLoading(true);
      const result = await axiosInstance.get(endpoints.communication.roles, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resultOptions = [];
      if (result.status === 200) {
        result.data.result.map((items) => resultOptions.push(items.role_name));
        setRoles([...roles, ...resultOptions]);
        setRoleList(result.data.result);
        setLoading(false);
      } else {
        setLoading(false);
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setLoading(false);
      setAlert('error', error.message);
    }
  };

  const getAcademicApi = async () => {
    axiosInstance.get(`/erp_user/list-academic_year/?module_id=${moduleId}`)
      .then((res) => {

        if (res.data.status_code === 200) {
          setAcademicYears(res.data.data);
          setLoading(false);
        } else {
          setAlert('error', res.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
        setLoading(false);
      })
  };

  const getBranchApi = async () => {
    axiosInstance.get(`${endpoints.academics.branches}?session_year=${selectedAcademic?.id}&module_id=${moduleId}`).then((res) => {
      if (res.data.status_code === 200) {
        const transformedResponse = res?.data?.data?.results.map(obj => ((obj && obj.branch) || {}));
        setBranchList(transformedResponse);
        setLoading(false);
      } else {
        setAlert('error', res.data.message);
        setLoading(false);
      }
    })
      .catch((error) => {
        setAlert('error', error.message);
        setLoading(false);
      })
    // try {
    //   setLoading(true);
    //   const result = await axiosInstance.get(endpoints.communication.branches, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });
    //   const resultOptions = [];
    //   if (result.status === 200) {
    //     result.data.data.map((items) => resultOptions.push(items.branch_name));
    //     setBranch([...branch, ...resultOptions]);
    //     setBranchList(result.data.data);
    //     setLoading(false);
    //   } else {
    //     setAlert('error', result.data.message);
    //     setLoading(false);
    //   }
    // } catch (error) {
    //   setAlert('error', error.message);
    //   setLoading(false);
    // }
  };
  const getGroupApi = async () => {
    try {
      setLoading(false);
      const result = await axiosInstance.get(`${endpoints.communication.groupList}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resultOptions = [];
      if (result.status === 200) {
        result.data.data.map((items) => resultOptions.push(items.group_name));
        setGroup([...group, ...resultOptions]);
        setGroupList(result.data.data);
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

  const getGradeApi = async () => {
    const branchsId = [];
    selectedBranch.length > 0 && selectedBranch.map((branchs) => branchsId.push(branchs?.id));
    try {
      setLoading(true);
      const result = await axiosInstance.get(
        `${endpoints.communication.grades}?session_year=${selectedAcademic?.id}&branch_id=${branchsId.toString()}&module_id=${moduleId}`,
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
      const branchsId = [];
      selectedBranch.length > 0 && selectedBranch.map((branchs) => branchsId.push(branchs?.id));
      const gradesId = [];
      gradeList
        .filter((item) => selectedGrades.includes(item['grade__grade_name']))
        .forEach((items) => {
          gradesId.push(items.grade_id);
        });
      setLoading(true);
      const result = await axiosInstance.get(
        `${endpoints.communication.sections}?session_year=${selectedAcademic?.id}&branch_id=${branchsId.toString()}&grade_id=${gradesId.toString()}&module_id=${moduleId}`,
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

  const displayUsersList = async () => {
    let getUserListUrl = '';
    if (customSelect) {
      const rolesId = [];
      const gradesId = [];
      const sectionsId = [];
      const branchsId = [];
      selectedBranch.length > 0 && selectedBranch.map((branchs) => branchsId.push(branchs?.id));
      getUserListUrl = `${endpoints.communication.communicationUserList}?page=${pageno}&page_size=15&module_id=${moduleId}`;
      if (selectedRoles.length) {
        roleList
          .filter((item) => selectedRoles.includes(item['role_name']))
          .forEach((items) => {
            rolesId.push(items.id);
          });
      }
      if (selectedGrades.length) {
        gradeList
          .filter((item) => selectedGrades.includes(item['grade__grade_name']))
          .forEach((items) => {
            gradesId.push(items.grade_id);
          });
      }
      if (selectedSections.length) {
        sectionList
          .filter((item) => selectedSections.includes(item['section__section_name']))
          .forEach((items) => {
            sectionsId.push(items.section_id);
          });
      }
      if (rolesId.length) {
        getUserListUrl += `&role=${rolesId.toString()}`;
      }
      if (gradesId.length) {
        getUserListUrl += `&grade=${gradesId.toString()}`;
      }
      if (selectedBranch) {
        getUserListUrl += `&branch=${branchsId.toString()}`;
      }
      if (sectionsId.length) {
        getUserListUrl += `&section=${sectionsId.toString()}`;
      }
    } else {
      const groupId = [];
      getUserListUrl = `${endpoints.communication.communicationUserList}?page=${pageno}&page_size=15&module_id=${moduleId}`;
      if (selectedGroup.length) {
        groupList
          .filter((item) => selectedGroup.includes(item['group_name']))
          .forEach((items) => {
            groupId.push(items.id);
          });
      }
      if (groupId.length) {
        getUserListUrl += `&group=${groupId.toString()}`;
      }
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
          { field: 'id', headerName: 'ID', width: 70 },
          { field: 'fullName', headerName: 'Name', width: 190 },
          { field: 'email', headerName: 'Email Id', width: 250 },
          { field: 'erp_id', headerName: 'Erp Id', width: 150 },
          { field: 'gender', headerName: 'Gender', width: 100 },
          { field: 'contact', headerName: 'Contact', width: 150 },
        ]);
        result.data.data.results.forEach((items) => {
          rows.push({
            id: items.id,
            fullName: `${items.user.first_name} ${items.user.last_name}`,
            email: items.user.email,
            erp_id: items.erp_id,
            gender: items.gender,
            contact: items.contact,
          });
          selectionRows.push({
            id: items.id,
            data: {
              id: items.id,
              fullName: `${items.user.first_name} ${items.user.last_name}`,
              email: items.user.email,
              erp_id: items.erp_id,
              gender: items.gender,
              contact: items.contact,
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
        setTotalPage(result.data.data.count);
        setLoading(false);
        if (!selectedUsers.length) {
          const tempSelectedUser = [];
          for (let page = 1; page <= result.data.data.total_pages; page += 1) {
            tempSelectedUser.push({ pageNo: page, selected: [] });
          }
          setSelectedUsers(tempSelectedUser);
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

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const testclick = document.querySelectorAll('input[type=checkbox]'); // [class*="PrivateSwitchBase-input-"]
    if (!selectAll) {
      testclick[1].click();
    } else {
      for (let i = 2; i < testclick.length; i += 1) {
        testclick[i].click();
      }
    }
  };

  const handleback = () => {
    if (!firstStep && secondStep && !thirdStep) {
      setSelectedUsers([]);
      setSelectAll(false);
      setHeaders([]);
      setUsersRow([]);
      setCompleteData([]);
      setTotalPage(0);
      setFirstStep(true);
      setSecondStep(false);
      setCurrentStep(1);
      setRoleError('');
      setGradeError('');
      setBranchError('');
      setGroupError('');
      setSelectUsersError('');
    }
    if (!firstStep && !secondStep && thirdStep) {
      //   setSelectAll(false);
      //   setSelectedUsers([]);
      setPageno(1);
      setHeaders([]);
      setUsersRow([]);
      setCompleteData([]);
      setTotalPage(0);
      displayUsersList();
      setTextMessage('');
      setWordcount(641);
      setIsEmail(false);
      setFiles([]);
      setSmsTypeList([]);
      setSelectedSmsType('');
      setSecondStep(true);
      setThirdStep(false);
      setCurrentStep(2);
      setTextMessageError('');
      setMessageTypeError('');
      setEmailSubject('');
    }
  };
  const handlenext = () => {
    if (firstStep && !secondStep && !thirdStep) {
      if (customSelect) {
        if (!selectedRoles.length) {
          setRoleError('Please select a role');
          return;
        }
        if (!selectedBranch) {
          setRoleError('');
          setBranchError('Please select a branch');
          return;
        }
        if (!selectedGrades.length) {
          setBranchError('');
          setGradeError('Please select a grade');
          return;
        }
        setRoleError('');
        setBranchError('');
        setGradeError('');
        setFirstStep(false);
        setSecondStep(true);
        setCurrentStep(2);
      }
      if (!customSelect) {
        if (!selectedGroup.length) {
          setGroupError('Please select a group');
          return;
        }
        setGroupError('');
        setFirstStep(false);
        setSecondStep(true);
        setCurrentStep(2);
      }
    }
    if (!firstStep && secondStep && !thirdStep) {
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
      if (!selectionArray.length) {
        setSelectUsersError('Please select a user');
        return;
      }
      setSelectUsersError('');
      setSecondStep(false);
      setThirdStep(true);
      setCurrentStep(3);
    }
  };
  const handleMessageChange = (e) => {
    if (wordcount || e.nativeEvent.inputType === 'deleteContentBackward') {
      setTextMessage(e.target.value);
    }
  };
  const wordCount = (text) => {
    if (typeof text === 'string') {
      const wordarray = text.split(' ');
      return wordarray.length;
    }
    return 0;
  };

  const getSmsTypeApi = async () => {
    try {
      const result = await axiosInstance.get(endpoints.communication.getMessageTypes, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.status === 200) {
        setSmsTypeList(result.data.data);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const handleMessageTypeChange = (event, value) => {
    if (value) {
      setSelectedSmsType(value);
    } else {
      setSelectedSmsType();
    }
  };

  const handleAcademicYears = (event, value) => {
    if (value) {
      setSelectedAcademic(value);
    } else {
      setSelectedAcademic('');
    }
  };

  const handleBranch = (event, value) => {
    if (value.length) {
      const ids = value.map((el) => el);
      setSelectedBranch(ids);
    } else {
      setSelectedBranch([]);
    }
  };

  const uploadFileHandler = (e) => {
    if (e.target.files[0]) {
      const newFiles = [...files, e.target.files[0]];
      setFiles(newFiles);
    }
  };

  const removeFileHandler = (i) => {
    const newFiles = files.filter((_, index) => index !== i);
    setFiles(newFiles);
  };

  const FileRow = (props) => {
    const { file, onClose, className } = props;
    return (
      <div className={className}>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={12} md={8}>
            <Typography className='file_name_container' variant='span'>
              {file.name}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <CloseIcon style={{ color: '#ff6b6b' }} onClick={onClose} />
          </Grid>
        </Grid>
        <Divider />
      </div>
    );
  };

  const handleSendMessage = async () => {
    if (!textMessage) {
      setTextMessageError('Please enter a message');
      return;
    }
    if (!selectedSmsType) {
      setMessageTypeError('Please select a message type');
      return;
    }
    if (!messageSending) {
      setTextMessageError('');
      setMessageTypeError('');
      setMessageSending(true);
      try {
        const sendMessageApi = endpoints.communication.sendMessage;
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
        const formData = new FormData();
        if (!customSelect) {
          const groupId = [];
          if (selectedGroup.length && !selectedGroup.includes('All')) {
            groupList
              .filter((item) => selectedGroup.includes(item['group_name']))
              .forEach((items) => {
                groupId.push(items.id);
              });
          }
          if (isEmail) {
            formData.set('communicate_type', selectedSmsType.id);
            formData.set('email_body', textMessage);
            formData.set('email_subject', emailSubject);
            formData.set('group_type', '1');
            formData.set('message_type', '1');
            formData.set('group', groupId);
            formData.set('erp_users', selectionArray);
            for (let i = 0; i < files.length; i++) {
              formData.append('files', files[i]);
            }
          }
          if (!isEmail) {
            formData.set('communicate_type', selectedSmsType.id);
            formData.set('message_content', textMessage);
            formData.set('group_type', '1');
            formData.set('message_type', '2');
            formData.set('group', groupId);
            formData.set('erp_users', selectionArray);
          }
        }
        if (customSelect) {
          const rolesId = [];
          const branchId = [];
          const gradesId = [];
          const sectionsId = [];
          if (selectedRoles.length) {
            roleList
              .filter((item) => selectedRoles.includes(item['role_name']))
              .forEach((items) => {
                rolesId.push(items.id);
              });
          }
          if (selectedBranch) {
            const blist = [...selectedBranch];
            for (let p = 0; p < blist.length; p++) {
              branchId.push(blist[p].id);
            }
          }
          if (selectedGrades.length) {
            gradeList
              .filter((item) => selectedGrades.includes(item['grade__grade_name']))
              .forEach((items) => {
                gradesId.push(items.grade_id);
              });
          }
          if (selectedSections.length) {
            sectionList
              .filter((item) => selectedSections.includes(item['section__section_name']))
              .forEach((items) => {
                sectionsId.push(items.id);
              });
          }
          const roleArray = [];
          const branchArray = [];
          const gradeArray = [];
          const sectionArray = [];
          rolesId.forEach((item) => {
            roleArray.push(item);
          });
          gradesId.forEach((item) => {
            gradeArray.push(item);
          });
          sectionsId.forEach((item) => {
            sectionArray.push(item);
          });
          branchId.forEach((item) => {
            branchArray.push(item);
          });
          if (isEmail) {
            formData.set('communicate_type', selectedSmsType.id);
            formData.set('email_body', textMessage);
            formData.set('email_subject', emailSubject);
            formData.set('group_type', '2');
            formData.set('message_type', '1');
            formData.set('role', roleArray);
            formData.set('branch', branchArray);
            if (gradeArray.length) {
              formData.set('grade', gradeArray);
            }
            if (sectionArray.length) {
              formData.set('mapping_bgs', sectionArray);
            }
            formData.set('erp_users', selectionArray);
            for (let i = 0; i < files.length; i++) {
              formData.append('files', files[i]);
            }
          }
          if (!isEmail) {
            formData.set('communicate_type', selectedSmsType.id);
            formData.set('message_content', textMessage);
            formData.set('group_type', '2');
            formData.set('message_type', '2');
            formData.set('role', roleArray);
            formData.set('branch', branchArray);
            if (gradeArray.length) {
              formData.set('grade', gradeArray);
            }
            if (sectionArray.length) {
              formData.set('mapping_bgs', sectionArray);
            }
            formData.set('erp_users', selectionArray);
          }
        }
        setLoading(true);
        const response = await axiosInstance({
          method: 'post',
          url: sendMessageApi,
          data: formData,
          headers: { Authorization: `Bearer ${token}` },
        });
        // .post(sendMessageApi, request, {
        //   headers: {
        //     // 'application/json' is the modern content-type for JSON, but some
        //     // older servers may use 'text/json'.
        //     // See: http://bit.ly/text-json
        //     Authorization: `Bearer ${token}`,
        //     'content-type': 'application/json',
        //   },
        // });
        const { message } = response.data;
        if (response.data.status_code === 200) {
          setAlert('success', message);
          setSelectedUsers([]);
          setHeaders([]);
          setUsersRow([]);
          setCompleteData([]);
          setFiles([]);
          setTotalPage(0);
          setFirstStep(true);
          setCustomSelect(false);
          setSecondStep(false);
          setThirdStep(false);
          setCurrentStep(1);
          setSelectedGroup([]);
          setSelectedBranch(null);
          setSelectedGrades([]);
          setSelectedRoles([]);
          setSelectedSections([]);
          setTextMessage('');
          setWordcount(641);
          setIsEmail(false);
          setSelectAll(false);
          setSmsTypeList([]);
          setSelectedSmsType('');
          setEmailSubject('');
          setThirdStep(false);
          setCurrentStep(1);
          setMessageSending(false);
          setLoading(false);
        } else {
          setAlert('error', response.data.message);
          setMessageSending(false);
          setLoading(false);
        }
      } catch (error) {
        
        setAlert('error', error.message);
        setMessageSending(false);
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Communication' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Send Message') {
              setModuleId(item.child_id);
              setModulePermision(true);
            } else {
              setModulePermision(false);
            }
          });
        } else {
          setModulePermision(false);
        }
      });
    } else {
      setModulePermision(false);
    }
  }, []);
  useEffect(() => {
    if (customSelect) {
      if (selectedRoles.length === 0) {
        getRoleApi();
      }
    }
    if (!customSelect) {
      getGroupApi();
    }
  }, [customSelect, selectedRoles]);

  useEffect(() => {
    if (moduleId) {
      getAcademicApi();
    }
  }, [moduleId]);

  useEffect(() => {
    if (selectedAcademic) {
      getBranchApi();
      setSelectedBranch([]);
      setBranchList([]);
      setGrade([]);
      setSection([]);
      setSelectedGrades([]);
      setSelectedSections([]);
    }
  }, [selectedAcademic]);

  useEffect(() => {
    if (thirdStep) {
      getSmsTypeApi();
    }
  }, [thirdStep]);

  useEffect(() => {
    if (!isEmail) {
      setSelectedSmsType('');
      setTextMessage('');
    }
  }, [isEmail]);

  useEffect(() => {
    if (selectedBranch.length > 0) {
      setGrade([]);
      setSelectedGrades([]);
      setSection([]);
      setSelectedSections([]);
      getGradeApi();
    }
  }, [selectedBranch]);

  useEffect(() => {
    if (selectedGrades.length) {
      getSectionApi();
    }
  }, [selectedGrades]);
  useEffect(() => {
    if (secondStep) {
      displayUsersList();
    }
  }, [secondStep, pageno]);

  useEffect(() => {
    const count = wordCount(textMessage);
    if (count) {
      setWordcount(641 - count);
    }
  }, [textMessage]);

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div className='send_message_wrapper'>
          <HeaderSection
            firstStep={firstStep}
            secondStep={secondStep}
            thirdStep={thirdStep}
            currentStep={currentStep}
          />
          {firstStep ? (
            <>
              <div className='send_message_type_wrapper'>
                <div className='send_message_group_select_lebel'>Group Select</div>
                <FormControlLabel
                  control={
                    <Switch
                      checked={customSelect}
                      onChange={handleCustomChange}
                      name='checkedA'
                    />
                  }
                  label='Custom select'
                />
              </div>

              <div>
                {customSelect ? (
                  <>
                    <div className='create_group_filter_container'>
                      <Grid container className='message_log_container' spacing={5}>
                        <Grid xs={12} lg={4} className='send_message_role_wrapper' item>
                          <CustomMultiSelect
                            selections={selectedRoles}
                            setSelections={setSelectedRoles}
                            nameOfDropdown='User Role'
                            optionNames={roles}
                          />
                          <span className='create_group_error_span'>{roleError}</span>
                        </Grid>
                        <Grid xs={12} lg={12} className='under_line_create_group' />
                      </Grid>
                    </div>
                    {selectedRoles.length ? (
                      <div className='create_group_filter_container'>
                        <Grid container className='create_group_container' spacing={5}>
                          <Grid xs={12} lg={4} className='create_group_items' item>
                            <div>
                              <div className='create_group_branch_wrapper'>
                                <Autocomplete
                                  size='small'
                                  onChange={handleAcademicYears}
                                  value={selectedAcademic}
                                  id='academic_year'
                                  className='create_group_branch'
                                  options={academicYears}
                                  getOptionLabel={(option) => option?.session_year}
                                  filterSelectedOptions
                                  renderInput={(params) => (
                                    <TextField
                                      className='message_log-textfield'
                                      {...params}
                                      variant='outlined'
                                      label='Academic Years'
                                      placeholder='Academic Years'
                                    />
                                  )}
                                />
                              </div>
                            </div>
                          </Grid>
                          {selectedAcademic?.id && (
                            <Grid xs={12} lg={4} className='create_group_items' item>
                              <div className='create_group_branch_wrapper'>
                                <Autocomplete
                                  size='small'
                                  multiple
                                  onChange={handleBranch}
                                  value={selectedBranch}
                                  id='message_log-branch'
                                  className='create_group_branch'
                                  options={branchList}
                                  getOptionLabel={(option) => option?.branch_name}
                                  filterSelectedOptions
                                  renderInput={(params) => (
                                    <TextField
                                      className='message_log-textfield'
                                      {...params}
                                      variant='outlined'
                                      label='Branch'
                                      placeholder='Branch'
                                    />
                                  )}
                                />
                                <span className='create_group_error_span'>
                                  {branchError}
                                </span>
                              </div>
                            </Grid>
                          )}
                          {selectedBranch.length > 0 && gradeList.length ? (
                            <Grid xs={12} lg={4} className='create_group_items' item>
                              <div>
                                <CustomMultiSelect
                                  selections={selectedGrades}
                                  setSelections={setSelectedGrades}
                                  nameOfDropdown='Grade'
                                  optionNames={grade}
                                />
                                <span className='create_group_error_span'>
                                  {gradeError}
                                </span>
                              </div>
                            </Grid>
                          ) : null}
                          {selectedGrades.length && sectionList.length ? (
                            <Grid xs={12} lg={4} className='create_group_items' item>
                              <CustomMultiSelect
                                selections={selectedSections}
                                setSelections={setSelectedSections}
                                nameOfDropdown='Section'
                                optionNames={section}
                              />
                            </Grid>
                          ) : null}
                          <Grid xs={12} lg={12} className='under_line_create_group' />
                        </Grid>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div className='create_group_filter_container'>
                    <Grid container className='message_log_container' spacing={5}>
                      <Grid xs={12} lg={4} item>
                        <CustomMultiSelect
                          selections={selectedGroup}
                          setSelections={setSelectedGroup}
                          nameOfDropdown='Group'
                          optionNames={group}
                        />
                        <span className='create_group_error_span'>{groupError}</span>
                      </Grid>
                      <Grid xs={12} lg={12} className='under_line_create_group' />
                    </Grid>
                  </div>
                )}
              </div>
            </>
          ) : null}
          {secondStep ? (
            <div className='send_message_table_wrapper'>
              <div className='send_message_user_list_wrapper'>
                {usersRow.length ? (
                  <div className='send_message_select_all_wrapper'>
                    <input
                      type='checkbox'
                      className='send_message_select_all_checkbox'
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                    <span style={{ marginLeft: '1%' }}>Select All</span>
                  </div>
                ) : null}
                <span className='create_group_error_span'>{selectUsersError}</span>
                <CustomSelectionTable
                  header={headers}
                  rows={usersRow}
                  completeData={completeData}
                  totalRows={totalPage}
                  setSelectAll={setSelectAll}
                  pageno={pageno}
                  selectedUsers={selectedUsers}
                  changePage={setPageno}
                  setSelectedUsers={setSelectedUsers}
                />
              </div>
            </div>
          ) : null}
          {thirdStep ? (
            <div className='message_sending_white_wrapper'>
              <div className='message_type_block_wrapper'>
                <div
                  className={`message_type_block ${isEmail ? null : 'message_type_block_selected'
                    }`}
                  onClick={() => {
                    if (isEmail) {
                      setIsEmail(false);
                      setSelectedSmsType('');
                      setTextMessage('');
                    }
                  }}
                >
                  SMS
                </div>
                <div
                  className={`message_type_block ${isEmail ? 'message_type_block_selected' : null
                    }`}
                  onClick={() => {
                    if (!isEmail) {
                      setIsEmail(true);
                      setSelectedSmsType('');
                      setTextMessage('');
                    }
                  }}
                >
                  Mail
                </div>
              </div>
              <div className='create_group_filter_container'>
                <Grid
                  container
                  className='create_group_custom_button_wrapper'
                  spacing={5}
                >
                  <Grid xs={12} lg={4} className='create_group_custom_button' item>
                    <Autocomplete
                      size='small'
                      onChange={handleMessageTypeChange}
                      value={selectedSmsType}
                      id='send_message-type'
                      className='send_message_type'
                      options={smsTypeList}
                      getOptionLabel={(option) =>
                        option && option.category_name ? option.category_name : ''
                      }
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          className='message_log-textfield'
                          {...params}
                          variant='outlined'
                          label={isEmail ? 'Email Type' : 'SMS Type'}
                          placeholder={isEmail ? 'Email Type' : 'SMS Type'}
                        />
                      )}
                    />
                    <span className='create_group_error_span'>{messageTypeError}</span>
                  </Grid>
                  <Grid xs={0} lg={8} className='create_group_items_mobile_none' item />
                  {isEmail ? (
                    <Grid xs={12} lg={8} className='email_subject_wrapper_grid' item>
                      <div className='email_subject_wrapper'>
                        <TextField
                          id='email_subject'
                          label='Email Subject'
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                        />
                      </div>
                    </Grid>
                  ) : null}
                  <Grid xs={12} lg={12} className='create_group_custom_button' item>
                    <div className='send_message_message_tag'>Message</div>
                    <TextareaAutosize
                      className='textFields_message'
                      aria-label='minimum height'
                      rowsMin={6}
                      onChange={handleMessageChange}
                      value={textMessage}
                    />
                    <span className='text_message_word_count'>{`Word count : ${wordcount} words left`}</span>
                    <span className='create_group_error_span'>{textMessageError}</span>
                  </Grid>
                  {isEmail ? (
                    <Grid xs={12} lg={8}>
                      <Grid
                        container
                        alignItems='center'
                        spacing={2}
                        justify='space-between'
                      >
                        <Grid item xs={2} className={classes.wrapper}>
                          <IconButton
                            fontSize='large'
                            // component={AttachmentIcon}
                            className={classes.attachmentIcon}
                          >
                            <AttachmentIcon
                              fontSize='large'
                              className={classes.Attachment}
                            />
                            <input
                              type='file'
                              onChange={uploadFileHandler}
                              className={classes.fileInput}
                            />
                          </IconButton>
                        </Grid>
                        <Grid item xs={8}>
                          {/* <Grid container alignItem='center' spacing={2}>
                            {files.map(file => (
                              <Grid item xs={12}>

                              </Grid>
                            ))}
                          </Grid> */}
                          {files.map((file, i) => (
                            <FileRow
                              file={file}
                              onClose={() => removeFileHandler(i)}
                              className={classes.fileRow}
                            />
                          ))}
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : null}
                </Grid>
              </div>
            </div>
          ) : null}
          <div className='create_group_filter_container'>
            <Grid container className='create_group_custom_button_wrapper' spacing={5}>
              {!firstStep ? (
                <Grid xs={12} lg={3} className='create_group_custom_button' item>
                  <Button
                    variant='contained'
                    onClick={handleback}
                    className='custom_button_master labelColor'
                    size='medium'
                    type='submit'
                  >
                    BACK
                  </Button>
                </Grid>
              ) : null}
              {thirdStep ? (
                <Grid xs={12} lg={3} className='create_group_custom_button' item>
                  <Button
                    variant='contained'
                    onClick={handleSendMessage}
                    style={{ color: 'white' }}
                    color='primary'
                    className='custom_button_master'
                    size='medium'
                  >
                    {messageSending ? 'Sending Message' : 'Send Message'}
                  </Button>
                </Grid>
              ) : (
                <Grid xs={12} lg={3} className='create_group_custom_button' item>
                  <Button
                    variant='contained'
                    onClick={handlenext}
                    style={{ color: 'white' }}
                    color='primary'
                    className='custom_button_master'
                    size='medium'
                  >
                    NEXT
                  </Button>
                </Grid>
              )}
            </Grid>
          </div>
        </div>
      </Layout>
    </>
  );
});

export default SendMessage;
