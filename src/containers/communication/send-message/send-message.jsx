/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable dot-notation */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-debugger */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { TextareaAutosize } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import HeaderSection from './components/header-section';
import CustomMultiSelect from '../custom-multiselect/custom-multiselect';
import CustomSelectionTable from '../custom-selection-table/custom-selection-table';
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
}));

const SendMessage = withRouter(({ history, ...props }) => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [customSelect, setCustomSelect] = useState(false);
  const [firstStep, setFirstStep] = useState(true);
  const [secondStep, setSecondStep] = useState(false);
  const [thirdStep, setThirdStep] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [pageno, setPageno] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [usersRow, setUsersRow] = useState([]);
  const [completeData, setCompleteData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [group, setGroup] = useState(['All']);
  const [roles, setRoles] = useState(['All']);
  const [branch, setBranch] = useState(['All']);
  const [grade, setGrade] = useState(['All']);
  const [section, setSection] = useState(['All']);
  const [groupList, setGroupList] = useState([]);
  const [roleList, setRoleList] = useState([]);
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

  const handleCustomChange = () => {
    setCustomSelect(!customSelect);
  };
  const getRoleApi = async () => {
    try {
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
      } else {
        console.log('error');
        // dispatch(setAlert('error', result.data.message));
      }
    } catch (error) {
      console.log('error');
      // dispatch(setAlert('error', error.message));
    }
  };

  const getBranchApi = async () => {
    try {
      const result = await axiosInstance.get(endpoints.communication.branches, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resultOptions = [];
      if (result.status === 200) {
        result.data.data.map((items) => resultOptions.push(items.branch_name));
        setBranch([...branch, ...resultOptions]);
        setBranchList(result.data.data);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };
  const getGroupApi = async () => {
    try {
      const result = await axiosInstance.get(endpoints.communication.groupList, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resultOptions = [];
      if (result.status === 200) {
        result.data.data.map((items) => resultOptions.push(items.group_name));
        setGroup([...group, ...resultOptions]);
        setGroupList(result.data.data);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const getGradeApi = async () => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.communication.grades}?branch_id=${selectedBranch}`,
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
          setGrade(['All', ...resultOptions]);
        }
        setGradeList(result.data.data);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const getSectionApi = async () => {
    try {
      const gradesId = [];
      gradeList
        .filter((item) => selectedGrades.includes(item['grade__grade_name']))
        .forEach((items) => {
          gradesId.push(items.grade_id);
        });
      const result = await axiosInstance.get(
        `${
          endpoints.communication.sections
        }?branch_id=${selectedBranch}&grade_id=${gradesId.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resultOptions = [];
      if (result.status === 200) {
        result.data.data.map((items) => resultOptions.push(items.section__section_name));
        setSection(['All', ...resultOptions]);
        setSectionList(result.data.data);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const displayUsersList = async () => {
    let getUserListUrl = '';
    if (customSelect) {
      const rolesId = [];
      const gradesId = [];
      const sectionsId = [];
      getUserListUrl = `${endpoints.communication.userList}?page=${pageno}&page_size=15`;
      if (selectedRoles.length && !selectedRoles.includes('All')) {
        roleList
          .filter((item) => selectedRoles.includes(item['role_name']))
          .forEach((items) => {
            rolesId.push(items.id);
          });
      }
      if (selectedGrades.length && !selectedGrades.includes('All')) {
        gradeList
          .filter((item) => selectedGrades.includes(item['grade__grade_name']))
          .forEach((items) => {
            gradesId.push(items.grade_id);
          });
      }
      if (selectedSections.length && !selectedSections.includes('All')) {
        sectionList
          .filter((item) => selectedSections.includes(item['section__section_name']))
          .forEach((items) => {
            sectionsId.push(items.section_id);
          });
      }
      if (rolesId.length && !selectedRoles.includes('All')) {
        getUserListUrl += `&role=${rolesId.toString()}`;
      }
      if (gradesId.length && !selectedGrades.includes('All')) {
        getUserListUrl += `&grade=${gradesId.toString()}`;
      }
      if (selectedBranch) {
        getUserListUrl += `&branch=${selectedBranch}`;
      }
      if (sectionsId.length && !selectedSections.includes('All')) {
        getUserListUrl += `&section=${sectionsId.toString()}`;
      }
    } else {
      const groupId = [];
      getUserListUrl = `${endpoints.communication.userList}?page=${pageno}&page_size=5`;
      if (selectedGroup.length && !selectedGroup.includes('All')) {
        groupList
          .filter((item) => selectedGroup.includes(item['group_name']))
          .forEach((items) => {
            groupId.push(items.id);
          });
      }
      if (groupId.length && !selectedGroup.includes('All')) {
        getUserListUrl += `&group=${groupId.toString()}`;
      }
    }
    try {
      const result = await axiosInstance.get(getUserListUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.status === 200) {
        setHeaders([
          { field: 'id', headerName: 'ID', width: 100 },
          { field: 'fullName', headerName: 'Name', width: 250 },
          { field: 'email', headerName: 'Email Id', width: 200 },
          { field: 'erp_id', headerName: 'Erp Id', width: 150 },
          { field: 'gender', headerName: 'Gender', width: 100 },
          { field: 'contact', headerName: 'Contact', width: 150 },
        ]);
        const rows = [];
        const selectionRows = [];
        result.data.results.forEach((items) => {
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
        setTotalPage(result.data.count);
        if (!selectedUsers.length) {
          const tempSelectedUser = [];
          for (let page = 1; page <= result.data.total_pages; page += 1) {
            tempSelectedUser.push({ pageNo: page, selected: [] });
          }
          setSelectedUsers(tempSelectedUser);
        }
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const testclick = document.querySelectorAll('[class*="PrivateSwitchBase-input-"]');
    if (!selectAll) {
      testclick[0].click();
    } else {
      for (let i = 1; i < testclick.length; i += 1) {
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
      setSelectAll(false);
      setSelectedUsers([]);
      setHeaders([]);
      setUsersRow([]);
      setCompleteData([]);
      setTotalPage(0);
      displayUsersList();
      setTextMessage('');
      setWordcount(641);
      setIsEmail(false);
      setSmsTypeList([]);
      setSelectedSmsType('');
      setSecondStep(true);
      setThirdStep(false);
      setCurrentStep(1);
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
        selectionArray.push(0);
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
          selectionArray.push(0);
        }
        let request = {};
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
            request = {
              communicate_type: selectedSmsType,
              email_body: textMessage,
              email_subject: emailSubject,
              group_type: '1',
              message_type: '1',
              group: groupId[0],
              erp_users: selectionArray,
            };
          }
          if (!isEmail) {
            request = {
              communicate_type: selectedSmsType,
              message_content: textMessage,
              group_type: '1',
              message_type: '2',
              group: groupId[0],
              erp_users: selectionArray,
            };
          }
        }
        if (customSelect) {
          const rolesId = [];
          const branchId = [];
          const gradesId = [];
          const sectionsId = [];
          if (selectedRoles.length && !selectedRoles.includes('All')) {
            roleList
              .filter((item) => selectedRoles.includes(item['role_name']))
              .forEach((items) => {
                rolesId.push(items.id);
              });
          }
          if (selectedBranch) {
            branchId.push(selectedBranch);
          }
          if (selectedGrades.length && !selectedGrades.includes('All')) {
            gradeList
              .filter((item) => selectedGrades.includes(item['grade__grade_name']))
              .forEach((items) => {
                gradesId.push(items.grade_id);
              });
          }
          if (selectedSections.length && !selectedSections.includes('All')) {
            sectionList
              .filter((item) => selectedSections.includes(item['section__section_name']))
              .forEach((items) => {
                sectionsId.push(items.id);
              });
          }
          const branchArray = [];
          const gradeArray = [];
          const sectionArray = [];
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
            request = {
              communicate_type: selectedSmsType,
              email_body: textMessage,
              email_subject: emailSubject,
              group_type: '2',
              message_type: '1',
              role: rolesId[0],
              branch: branchArray,
              grade: gradeArray,
              mapping_bgs: sectionArray,
              erp_users: selectionArray,
            };
          }
          if (!isEmail) {
            request = {
              communicate_type: selectedSmsType,
              message_content: textMessage,
              group_type: '2',
              message_type: '2',
              role: rolesId[0],
              branch: branchArray,
              grade: gradeArray,
              mapping_bgs: sectionArray,
              erp_users: selectionArray,
            };
          }
        }
        const response = await axiosInstance.post(sendMessageApi, request, {
          headers: {
            // 'application/json' is the modern content-type for JSON, but some
            // older servers may use 'text/json'.
            // See: http://bit.ly/text-json
            Authorization: `Bearer ${token}`,
            'content-type': 'application/json',
          },
        });
        const { message } = response.data;
        if (response.data.status_code === 200) {
          setAlert('success', message);
          setSelectedUsers([]);
          setHeaders([]);
          setUsersRow([]);
          setCompleteData([]);
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
        } else {
          setAlert('error', response.data.message);
          setMessageSending(false);
        }
      } catch (error) {
        setAlert('error', error.message);
        setMessageSending(false);
      }
    }
  };
  useEffect(() => {
    if (customSelect) {
      getRoleApi();
      getBranchApi();
    }
    if (!customSelect) {
      getGroupApi();
    }
  }, [customSelect]);

  useEffect(() => {
    if (thirdStep) {
      getSmsTypeApi();
    }
  }, [thirdStep]);

  useEffect(() => {
    if (!isEmail) {
      setSelectedSmsType('');
    }
  }, [isEmail]);

  useEffect(() => {
    if (selectedBranch) {
      setGrade(['All']);
      setSelectedGrades([]);
      setSelectedSections([]);
      getGradeApi();
    }
  }, [selectedBranch]);
  useEffect(() => {
    if (selectedGrades.length && !selectedGrades.includes('All')) {
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
                  <div className='creategroup_firstrow'>
                    <div>
                      <CustomMultiSelect
                        selections={selectedRoles}
                        setSelections={setSelectedRoles}
                        nameOfDropdown='User Role'
                        optionNames={roles}
                      />
                      <span className='create_group_error_span'>{roleError}</span>
                    </div>
                  </div>
                  {selectedRoles.length && !selectedRoles.includes('All') ? (
                    <div className='creategroup_firstrow'>
                      <div>
                        <FormControl variant='outlined' className={classes.formControl}>
                          <InputLabel id='demo-simple-select-outlined-label'>
                            Branch
                          </InputLabel>
                          <Select
                            labelId='demo-simple-select-outlined-label'
                            id='demo-simple-select-outlined'
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            label='Branch'
                          >
                            <MenuItem value=''>
                              <em>None</em>
                            </MenuItem>
                            {branchList.map((items, index) => (
                              <MenuItem
                                key={`branch_create_group_${index}`}
                                value={items.id}
                              >
                                {items.branch_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <span className='create_group_error_span'>{branchError}</span>
                      </div>
                      {selectedBranch ? (
                        <div>
                          <CustomMultiSelect
                            selections={selectedGrades}
                            setSelections={setSelectedGrades}
                            nameOfDropdown='Grade'
                            optionNames={grade}
                          />
                          <span className='create_group_error_span'>{gradeError}</span>
                        </div>
                      ) : null}
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
                </>
              ) : (
                <div className='creategroup_firstrow'>
                  <CustomMultiSelect
                    selections={selectedGroup}
                    setSelections={setSelectedGroup}
                    nameOfDropdown='Group'
                    optionNames={group}
                  />
                  <span className='create_group_error_span'>{groupError}</span>
                </div>
              )}
            </div>
          </>
        ) : null}
        {secondStep ? (
          <div className='send_message_table_wrapper'>
            {usersRow.length ? (
              <div className='send_message_select_all_wrapper'>
                <input
                  type='checkbox'
                  className='send_message_select_all_checkbox'
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                <span>Select All</span>
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
        ) : null}
        {thirdStep ? (
          <div className='message_sending_screen_wrapper'>
            <div className='message_type_block_wrapper'>
              <div
                className={`message_type_block ${
                  isEmail ? null : 'message_type_block_selected'
                }`}
                onClick={() => setIsEmail(false)}
              >
                SMS
              </div>
              <div
                className={`message_type_block ${
                  isEmail ? 'message_type_block_selected' : null
                }`}
                onClick={() => setIsEmail(true)}
              >
                Mail
              </div>
            </div>
            <div className='message_type_wrapper'>
              <FormControl variant='outlined' className={classes.formControl}>
                <InputLabel id='demo-simple-select-outlined-label'>
                  {isEmail ? 'Email Type' : 'SMS Type'}
                </InputLabel>
                <Select
                  labelId='demo-simple-select-outlined-label'
                  id='demo-simple-select-outlined'
                  value={selectedSmsType}
                  onChange={(e) => setSelectedSmsType(e.target.value)}
                  label={isEmail ? 'Email Type' : 'SMS Type'}
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  {smsTypeList.map((items, index) => (
                    <MenuItem key={`sms_type_${index}`} value={items.id}>
                      {items.category_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <span className='create_group_error_span'>{messageTypeError}</span>
            {isEmail ? (
              <div className='email_subject_wrapper'>
                <TextField
                  id='email_subject'
                  label='Email Subject'
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>
            ) : null}
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
          </div>
        ) : null}
        <div className='send_message_button_wrapper'>
          {!firstStep ? (
            <input
              className='custom_button addgroup_back_button'
              type='button'
              onClick={handleback}
              value='back'
            />
          ) : null}
          {thirdStep ? (
            <input
              className='custom_button addgroup_next_button'
              type='button'
              onClick={handleSendMessage}
              value={messageSending ? 'Sending Message' : 'Send Message'}
            />
          ) : (
            <input
              className='custom_button addgroup_next_button'
              type='button'
              onClick={handlenext}
              value='next'
            />
          )}
        </div>
      </div>
    </Layout>
  );
});

export default SendMessage;
