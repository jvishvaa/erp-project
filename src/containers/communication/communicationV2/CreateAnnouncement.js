import React, { useEffect, useState, useRef, useContext } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Typography,
  DialogContent,
  makeStyles,
  Grid,
  TextField,
  Checkbox,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddBoxIcon from '@material-ui/icons/AddBox';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import PublishIcon from '@material-ui/icons/Publish';
// import TinyMce from '../../../components/TinyMCE/tinyMce';
import MyTinyEditor from '../../question-bank/create-question/tinymce-editor';
import UploadFiles from './uploadFiles';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { AlertNotificationContext } from './../../../context-api/alert-context/alert-state';

const useStyles = makeStyles(() => ({
  paper: {
    minWidth: '825px',
    minHeight: '400px',
    padding: '10px',
    maxHeight: '550px',
    marginLeft: '100px',
    marginTop: '50px',
  },
  Check: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
}));

const CreateAnnouncement = ({ openModal, setOpenModal, submit }) => {
  const fileUploadInput = useRef(null);
  const classes = useStyles();
  const [openUpload, setOpenUpload] = useState(false);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [uploadFiles, setuploadedFiles] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};


  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const [moduleId, setModuleId] = useState('')

  const [userLevelList, setUserLevelList] = useState([]);
  const [selectedUserLevelData, setSelectedUserLevelData] = useState([]);
  const [selectedUserLevelId, setSelectedUserLevelId] = useState([]);
  const isStudentIncluded = selectedUserLevelId.includes(13);

  const [branchList, setBranchList] = useState([]);
  const [selectedbranchListData, setSelectedbranchListData] = useState();
  const [selectedBranchId, setSelectedBranchId] = useState('');

  const [gradeList, setGradeList] = useState([]);
  const [selectedGradeListData, setSelectedGradeListData] = useState([]);
  const [selectedGradeId, setSelectedGradeId] = useState([]);

  const [sectionList, setSectionList] = useState([]);
  const [selectedSectionListData, setSelectedSectionListData] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState([]);
  const [selectedSectionMappingId, setSelectedSectionMappingId] = useState([]);

  const [announcementList, setAnnouncementList] = useState([]);
  const [selectedAnnouncementListData, setselectedAnnouncementListData] = useState();
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState();

  const [memberList, setMemberList] = useState([]);
  const [memberCount, setMemberCount] = useState();


  const [title, setTitle] = useState();
  const [content, setContent] = useState();

  const [textEditorContent, setTextEditorContent] = useState('');

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUserLevelData([]);
    setSelectedUserLevelId([]);

    setSelectedbranchListData();
    setSelectedBranchId('');

    setSelectedGradeListData([]);
    setSelectedGradeId([]);

    setSelectedSectionListData([]);
    setSelectedSectionId([]);
    setSelectedSectionMappingId([]);

    setselectedAnnouncementListData();
    setSelectedAnnouncementId();

    setMemberList([]);
    setMemberCount()

    setTitle();
    // setContent()

    setTextEditorContent('');
    setuploadedFiles([]);
  };


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


  const getUserLevel = () => {
    axios
      .get(`${endpoints.userManagement.userLevelList}`, {
        headers: {
          // Authorization: `Bearer ${token}`,
          'X-Api-Key': 'vikash@12345#1231',
        },
      })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setUserLevelList(res?.data?.result);
        } else {
          setUserLevelList([]);
        }
      });
  };

  useEffect(() => {
    if (selectedUserLevelData.length > 0) {
      getBranch();
    }
  }, [selectedUserLevelData]);

  const getBranch = () => {
    axiosInstance
      .get(
        `${endpoints.academics.branches}?session_year=${selectedAcademicYear?.id
        }&module_id=${moduleId}`
      )
      .then((res) => {
        if (res?.data?.status_code === 200) {
          const allBranchData = res?.data?.data?.results.map((item) => item.branch);
          setBranchList(allBranchData);
        } else {
          setBranchList([]);
        }
      });
  };

  const handleFiles = (files) => {
    // setuploadedFiles(files);
    setuploadedFiles(((pre) => [...pre, ...files]))
  };

  const getGrade = () => {
    axiosInstance
      .get(
        `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id
        }&branch_id=${selectedBranchId}&module_id=${moduleId}` //moduleId hardcore for right now
      )
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setGradeList(res?.data?.data);
        } else {
          setBranchList([]);
        }
      });
  };

  useEffect(() => {
    if (selectedbranchListData && selectedUserLevelData.length > 0) {
      getGrade();
    }
  }, [selectedbranchListData]);

  const getSection = () => {
    axiosInstance
      .get(
        `${endpoints.academics.sections}?session_year=${selectedAcademicYear?.id
        }&branch_id=${selectedBranchId}&grade_id=${selectedGradeId}&module_id=${moduleId}`
      )
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setSectionList(res?.data?.data);
        } else {
          setSectionList([]);
        }
      });
  };

  useEffect(() => {
    if (
      selectedbranchListData &&
      selectedGradeListData.length > 0 &&
      selectedUserLevelData.length > 0
    ) {
      getSection();
    }
  }, [selectedGradeListData]);

  const getAnnouncementType = () => {
    axiosInstance
      .get(`${endpoints.announcementNew.getAnnouncemenetCategory}`)
      .then((res) => {
        if (res?.data?.status_code === 200) {
          // const allBranchData = res?.data?.data?.results.map((item)=>item.branch)
          setAnnouncementList(res?.data?.data);
        } else {
          setAnnouncementList([]);
        }
      });
  };

  useEffect(() => {
    if (
      selectedbranchListData &&
      selectedSectionListData.length > 0 &&
      selectedUserLevelData.length > 0 &&
      selectedGradeListData.length > 0
    ) {
      getAnnouncementType();
    } else if (
      selectedbranchListData &&
      selectedUserLevelData.length > 0 &&
      !isStudentIncluded
    ) {
      getAnnouncementType();
    }
  }, [selectedSectionListData, selectedbranchListData]);

  useEffect(() => {
    getUserLevel();
  }, []);

  const handleUserLevel = (e, value) => {
    if (value.length) {
      const data = value.map((el) => el);
      const ids = value.map((el) => el.id);
      setSelectedUserLevelData(data);
      setSelectedUserLevelId(ids);
    } else {
      setSelectedUserLevelData([]);
      setSelectedUserLevelId([]);
    }
  };

  const handleBranch = (e, value = []) => {
    if (value) {
      // const data = value.map((el) => el);
      // const ids = value.map((el)=> el.id)
      setSelectedGradeId([]);
      setGradeList([]);
      setSelectedGradeListData([]);
      setSelectedSectionId([]);
      setSectionList([]);
      setSelectedSectionMappingId([]);
      setSelectedSectionListData([]);
      setSelectedbranchListData(value);
      setSelectedBranchId(value.id);
    } else {
      setSelectedbranchListData();
      setSelectedBranchId('');
      setSelectedGradeId([]);
      setGradeList([]);
      setSelectedGradeListData([]);
      setSelectedSectionId([]);
      setSectionList([]);
      setSelectedSectionMappingId([]);
      setSelectedSectionListData([]);
    }
  };

  const handleGrade = (e, value) => {
    if (value.length) {
      const data = value.map((el) => el);
      const ids = value.map((el) => el.grade_id);
      setSelectedSectionId([]);
      setSectionList([]);
      setSelectedSectionMappingId([]);
      setSelectedSectionListData([]);
      setSelectedGradeListData(data);
      setSelectedGradeId(ids);
    } else {
      setSelectedSectionId([]);
      setSectionList([]);
      setSelectedSectionMappingId([]);
      setSelectedSectionListData([]);
      setSelectedGradeListData([]);
      setSelectedGradeId([]);
    }
  };

  const handleSection = (e, value) => {
    if (value.length) {
      const data = value.map((el) => el);
      const ids = value.map((el) => el.section_id);
      const sectionMappingIds = value.map((el) => el.id);
      setSelectedSectionId(ids);
      setSelectedSectionListData(data);
      setSelectedSectionMappingId(sectionMappingIds);
    } else {
      setSelectedSectionListData([]);
    }
  };

  const getMember = () => {
    let url = `?role_id=${selectedUserLevelId}&session_year=${selectedAcademicYear?.id}&branch_id=${selectedBranchId}&is_allowed_for_all=True`;
    if (selectedSectionId.length > 0 && selectedGradeId.length > 0) {
      url += `&grade_id=${selectedGradeId}&section_id=${selectedSectionId}`;
    }
    axiosInstance.get(`${endpoints.announcementNew.getMembersData}${url}`).then((res) => {
      if (res?.data?.status_code === 200) {
        setMemberList(res?.data?.members);
        setMemberCount(res?.data?.count)
      }
    });
  };

  useEffect(() => {
    if ((selectedBranchId || selectedUserLevelId) || (selectedSectionId && openModal)) {
      getMember();
    }
  }, [
    // selectedUserLevelData,
    selectedbranchListData,
    // selectedGradeListData,
    selectedSectionListData,
  ]);

  const handleAnnouncementType = (e, value) => {
    if (value) {
      setSelectedAnnouncementId(value.id);
      setselectedAnnouncementListData(value);
    } else {
      setSelectedAnnouncementId();
      setselectedAnnouncementListData();
    }
  };

  const handleEditorChange = (content, editor) => {
    content = content.replace(/&nbsp;/g, '');
    //  editor?.getContent({ format: 'text' })
    setTextEditorContent(content);
  };

  const handlePublish = (isDraft) => {
    if (!textEditorContent) {
      setAlert('warning', 'Please add description')
    }
    if (!title) {
      setAlert('warning', 'Please add title');
    }
    if (!selectedAnnouncementId) {
      setAlert('warning', 'Please select announcement category');
    }
    if (isStudentIncluded && !selectedSectionMappingId.length > 0) {
      setAlert('warning', 'Please select sections');
    }
    if (isStudentIncluded && !selectedGradeId.length > 0) {
      setAlert('warning', 'Please select grade');
    }
    if (!selectedBranchId) {
      setAlert('warning', 'Please select branch');
    }
    if (!selectedUserLevelId.length > 0) {
      setAlert('warning', 'Please select user level');
    }

    if (selectedBranchId && selectedUserLevelId.length > 0 && title && textEditorContent && selectedAnnouncementId) {
      let payLoad = {
        branch_id: selectedBranchId.toString() || '',
        // "section_mapping_id" : selectedSectionMappingId.toString() || "",
        role_id: selectedUserLevelId.toString() || '',
        title: title || '',
        content: textEditorContent || '',
        // "attachments" : uploadFiles || [],
        category: selectedAnnouncementId,
        members: memberList || [],
      };
      if (isDraft) {
        payLoad['is_draft'] = true;
      }
      if (uploadFiles?.length > 0) {
        payLoad['attachments'] = uploadFiles || [];
      }
      if (isStudentIncluded) {
        payLoad['section_mapping_id'] = selectedSectionMappingId.toString() || '';
      }
      axiosInstance
        .post(`${endpoints.announcementNew.createAnnouncement}`, payLoad)
        .then((res) => {
          if (res?.data?.status_code === 200) {
            setAlert('success', res?.data?.message);
            handleCloseModal();
          } else {
            setAlert('error', res?.data?.message);
          }
        });
    }
  };


  return (
    <Dialog
      //   className='reminderDialog'
      classes={{ paper: classes.paper }}
      fullWidth
      open={openModal}
      onClose={handleCloseModal}
    //   aria-labelledby='draggable-dialog-title'
    >
      <DialogTitle
        id='customized-dialog-title'
        style={{ padding: '0px 0px 10px 10px', display: 'flex', alignItems: 'center' }}
      >
        <b>
          <AddBoxIcon style={{ position: 'relative', top: '7px' }} />
          Create New Announcement
        </b>
        <CancelOutlinedIcon
          style={{
            position: 'relative',
            top: '6px',
            marginLeft: '450px',
            cursor: 'pointer',
          }}
          onClick={handleCloseModal}
        />
      </DialogTitle>
      <hr style={{ marginBottom: '20px' }} />
      <DialogContent>
        <div>
          <Grid container spacing={1}>
            <Grid xs={12} md={6} lg={6} item>
              <b>Choose User Level</b>
              <Autocomplete
                multiple
                size='small'
                onChange={handleUserLevel}
                value={selectedUserLevelData}
                id='message_log-smsType'
                className='multiselect_custom_autocomplete'
                options={userLevelList || []}
                limitTags='2'
                getOptionLabel={(option) => option.level_name}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    className='message_log-textfield'
                    {...params}
                    variant='outlined'
                    // label={'Choose User Level'}
                    placeholder={'Choose User Level'}
                  />
                )}
              />
            </Grid>
            <Grid xs={12} md={6} lg={6} item>
              <b>Branch</b>
              <Autocomplete
                id='combo-box-demo'
                size='small'
                options={branchList || []}
                onChange={handleBranch}
                value={selectedbranchListData}
                getOptionLabel={(option) => option?.branch_name}
                // style={{ marginRight: 15 }}
                renderInput={(params) => (
                  <TextField {...params} placeholder='Branch' variant='outlined' />
                )}
              />
            </Grid>
            {isStudentIncluded && (
              <Grid xs={12} md={6} lg={6} item>
                <b>Grade</b>
                <Autocomplete
                  multiple
                  size='small'
                  onChange={handleGrade}
                  value={selectedGradeListData}
                  id='message_log-smsType'
                  className='multiselect_custom_autocomplete'
                  options={gradeList || []}
                  limitTags='2'
                  getOptionLabel={(option) => option.grade__grade_name || {}}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      className='message_log-textfield'
                      {...params}
                      variant='outlined'
                      // label={'Choose Branch'}
                      placeholder={'Choose Grade'}
                    />
                  )}
                />
              </Grid>
            )}
            {isStudentIncluded && (
              <Grid xs={12} md={6} lg={6} item>
                <b>Section</b>
                <Autocomplete
                  multiple
                  size='small'
                  onChange={handleSection}
                  value={selectedSectionListData}
                  id='message_log-smsType'
                  className='multiselect_custom_autocomplete'
                  options={sectionList || []}
                  limitTags='2'
                  getOptionLabel={(option) => option.section__section_name}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      className='message_log-textfield'
                      {...params}
                      variant='outlined'
                      // label={'Choose Branch'}
                      placeholder={'Choose Sections'}
                    />
                  )}
                />
              </Grid>
            )}

            <Typography>
              Total Members{' '}
              {memberCount ? memberCount : '0'}
            </Typography>

            <Grid md={12} lg={12} item>
              <hr />
            </Grid>
            <Grid xs={12} md={6} lg={6} item>
              <b>Announcement category</b>
              <Autocomplete
                id='combo-box-demo'
                size='small'
                options={announcementList || []}
                onChange={handleAnnouncementType}
                value={selectedAnnouncementListData}
                getOptionLabel={(option) => option?.category_name}
                // style={{ marginRight: 15 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder='Choose category'
                    variant='outlined'
                  />
                )}
              />
            </Grid>
            <Grid xs={12} md={6} lg={6} item>
              <b>Title</b>
              <TextField
                style={{ display: 'grid' }}
                id='outlined-basic'
                size='small'
                placeholder='Title'
                variant='outlined'
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>
          </Grid>
        </div>

        <b style={{ marginTop: '10px' }}>Main Body</b>
        <MyTinyEditor
          id='Editor'
          //description={description}
          content={textEditorContent}
          placeholder='description...'
          handleEditorChange={handleEditorChange}
          onChange={(e) => setContent(e.target.value)}
          //   handleEditorChange={handleEditorChange}
          //   setOpenEditor={setOpenEditor}
          height='150px'
          isShowToolBar='fontselect fontsizeselect bold italic aligncenter underline bullist numlist file image customInsertButton'
        />
        <b>Upload attachment</b>
        <div
          style={{
            height: '40px',
            width: '100%',
            border: '1px solid #bbb8b8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px',
          }}
        >
          <div>{uploadFiles?.length > 0 ? uploadFiles?.length : '0'} File Attached</div>
          <div style={{ cursor: 'pointer' }} onClick={() => setOpenUpload(true)}>
            <PublishIcon
              style={{ position: 'relative', top: '6px', }}
            //   onClick={() => fileUploadInput.current.click()}
            />
            Upload
          </div>
        </div>
        {/* <div
          classes={{ Check: classes.Check }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
        >
          <div>
            <Checkbox
            // value={upload}
            // checked={upload}
            // onChange={(e) => setUpload(e.target.checked)}
            />
            Intimate via SMS
          </div>
          <div>
            <Checkbox
            // value={upload}
            // checked={upload}
            // onChange={(e) => setUpload(e.target.checked)}
            />
            Intimat via Whatsapp
          </div>
          <div>
            <Checkbox
            // value={upload}
            // checked={upload}
            // onChange={(e) => setUpload(e.target.checked)}
            />
            Intimate via Email
          </div>
        </div> */}
        {/* <input
          className='file-upload-input'
          type='file'
          name='attachments'
          style={{ display: 'none' }}
          accept='.png, .jpg, .jpeg, .mp3, .mp4, .pdf, .PNG, .JPG, .JPEG, .MP3, .MP4, .PDF'
          onChange={(e) => {
            handleFileUpload(e.target.files[0]);
             e.target.value = null;
             onChange('attachments', Array.from(e.target.files)[]);
          }}
          ref={fileUploadInput}
        /> */}
        {/* 
        <Typography gutterBottom>
          Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna,
          vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla
          non metus auctor fringilla.
        </Typography> */}
      </DialogContent>
      <DialogActions style={{ justifyContent: 'center' }}>
        <Button
          onClick={() => handlePublish(true)}
          variant='contained'
          autoFocus
        // color='primary'
        >
          Save as Draft
        </Button>
        <Button
          onClick={() => handlePublish(false)}
          variant='contained'
          autoFocus
          color='primary'
        >
          Publish
        </Button>
      </DialogActions>
      {/* openModal={openModal} setOpenModal={setOpenModal} */}
      <UploadFiles
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
        handleFiles={handleFiles}
        branchId={selectedBranchId}
      />
    </Dialog>
  );
};

export default CreateAnnouncement;

