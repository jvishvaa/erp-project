import React, { useEffect, useState, useRef, useContext } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  Typography,
  DialogContent,
  makeStyles,
  Grid,
  TextField,
  Checkbox,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
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
import Loader from './../../../components/loader/loader';
import EventIcon from '@material-ui/icons/Event';
import EventNoteIcon from '@material-ui/icons/EventNote';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import InsertInvitationIcon from '@material-ui/icons/InsertInvitation';
import SubjectIcon from '@material-ui/icons/Subject';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import ConfirmModal from 'containers/assessment-central/assesment-card/confirm-modal';
import useMediaQuery from '@material-ui/core/useMediaQuery';


const useStyles = makeStyles(() => ({
  paper: {
    // minWidth: '825px',
    // minHeight: '400px',
    padding: '10px',
    // maxHeight: '550px',
    // marginLeft: window.innerWidth > 768 ? '100px' : "0",
    // marginTop: '50px',
  },
  Check: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
}));

const CreateAnnouncement = ({ openModalAnnouncement, setOpenModalAnnouncement, announcementType, setPage }) => {
  const fileUploadInput = useRef(null);
  const classes = useStyles();
  const [openUpload, setOpenUpload] = useState(false);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [uploadFiles, setuploadedFiles] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [loading, setLoading] = useState(false);
  const [openEditUpload, setOpenEditUpload] = useState(false)
  const setMobileView = useMediaQuery('(min-width:960px)');


  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const [moduleId, setModuleId] = useState('')

  const [userLevelList, setUserLevelList] = useState([]);
  const [selectedUserLevelData, setSelectedUserLevelData] = useState([]);
  const [selectedUserLevelId, setSelectedUserLevelId] = useState([]);
  const isStudentIncluded = selectedUserLevelId.includes(13);

  const [branchList, setBranchList] = useState([]);
  const [selectedbranchListData, setSelectedbranchListData] = useState({});
  const [selectedBranchId, setSelectedBranchId] = useState('');

  const [gradeList, setGradeList] = useState([]);
  const [selectedGradeListData, setSelectedGradeListData] = useState([]);
  const [selectedGradeId, setSelectedGradeId] = useState([]);

  const [sectionList, setSectionList] = useState([]);
  const [selectedSectionListData, setSelectedSectionListData] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState([]);
  const [selectedSectionMappingId, setSelectedSectionMappingId] = useState([]);

  const [memberList, setMemberList] = useState([]);
  const [memberCount, setMemberCount] = useState();


  const [title, setTitle] = useState();
  const [content, setContent] = useState();

  const [textEditorContent, setTextEditorContent] = useState('');

  const [fileToFilter, setFileToFilter] = useState([])

  const [openModalFinal, setopenModalFinal] = useState(false)

  const [fileToDelete, setFileToDelete] = useState()

  const handleEditFileClose = () => {
    setOpenEditUpload(false)
  }
  const handleEditFileOpen = () => {
    setOpenEditUpload(true)
  }

  const handleCloseModal = () => {
    setOpenModalAnnouncement(false);
    setSelectedUserLevelData([]);
    setSelectedUserLevelId([]);

    setSelectedbranchListData();
    setSelectedBranchId('');

    setSelectedGradeListData([]);
    setSelectedGradeId([]);

    setSelectedSectionListData([]);
    setSelectedSectionId([]);
    setSelectedSectionMappingId([]);


    setMemberList([]);
    setMemberCount()

    setTitle();
    // setContent()

    setTextEditorContent('');
    setuploadedFiles([]);
    setFileToFilter([])
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
    setLoading(true);
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
        setLoading(false);
      });
  };

  useEffect(() => {
    if (selectedUserLevelData.length > 0) {
      getBranch();
    }
  }, [selectedUserLevelData]);

  const getBranch = () => {
    setLoading(true);
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
        setLoading(false);
      });
  };

  const handleFiles = (files) => {
    // setuploadedFiles(files);
    setuploadedFiles((pre) => [...pre, ...files]);
    setFileToFilter((pre) => [...pre, ...files]);
  };

  const getGrade = () => {
    setLoading(true);
    axiosInstance
      .get(
        `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id
        }&branch_id=${selectedBranchId}&module_id=${moduleId}`
      )
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setGradeList(res?.data?.data);
        } else {
          setBranchList([]);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    if (selectedbranchListData && selectedUserLevelData.length > 0) {
      getGrade();
    }
  }, [selectedbranchListData]);

  const getSection = () => {
    setLoading(true);
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
        setLoading(false);
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


  useEffect(() => {
    getUserLevel();
  }, []);

  const handleUserLevel = (e, value) => {
    if (value.length) {
      const data = value.map((el) => el);
      const ids = value.map((el) => el.id);
      setSelectedUserLevelData(data);
      setSelectedUserLevelId(ids);
      setSelectedGradeId([]);
      setGradeList([]);
      setSelectedGradeListData([]);
      setSelectedSectionId([]);
      setSectionList([]);
      setSelectedSectionMappingId([]);
      setSelectedSectionListData([]);
      setMemberCount()
      setBranchList([])
      setSelectedBranchId('')
      setSelectedbranchListData(null)
    } else {
      setSelectedUserLevelData([]);
      setSelectedUserLevelId([]);
      setSelectedGradeId([]);
      setGradeList([]);
      setSelectedGradeListData([]);
      setSelectedSectionId([]);
      setSectionList([]);
      setSelectedSectionMappingId([]);
      setSelectedSectionListData([]);
      setMemberCount()
      setBranchList([])
      setSelectedBranchId('')
      setSelectedbranchListData(null)
    }
  };

  const handleBranch = (e, value) => {
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
      setMemberCount()
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
      setMemberCount()
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
      setMemberCount()
    } else {
      setSelectedSectionId([]);
      setSectionList([]);
      setSelectedSectionMappingId([]);
      setSelectedSectionListData([]);
      setSelectedGradeListData([]);
      setSelectedGradeId([]);
      setMemberCount()
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
      setMemberCount()
    } else {
      setSelectedSectionListData([]);
      setMemberCount()
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
    if (selectedBranchId) {
      getMember();
    }
  }, [
    selectedbranchListData,
  ]);

  useEffect(() => {
    if (selectedSectionListData.length > 0 && selectedBranchId) {
      getMember();
    }
  }, [
    selectedSectionListData,
  ]);


  const handleEditorChange = (content, editor) => {
    content = content.replace(/&nbsp;/g, '');
    //  editor?.getContent({ format: 'text' })
    setTextEditorContent(content);
  };

  const handleFilter = () => {
    const removeFile = fileToFilter.filter((z) => z != fileToDelete);
    setFileToFilter(removeFile)
  }

  const handleFilterClose = (status) => {
    if (status) {
      setuploadedFiles(fileToFilter)
      setAlert('success', 'Files saved successfully')
    }
    if (!status) {
      setFileToFilter(uploadFiles)
    }
    handleEditFileClose()
  }

  const handlePublish = (isDraft) => {
    if (!textEditorContent) {
      setAlert('warning', 'Please add description')
    }
    if (!title) {
      setAlert('warning', 'Please add title');
    }
    if (title?.length > 50) {
      setAlert('warning', 'Please enter Title within 50 Characters');
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
    if (!memberList.length > 0) {
      setAlert('warning', 'No members for announcement');
    }

    if (selectedBranchId && selectedUserLevelId.length > 0 && title && title.length < 50 && textEditorContent && announcementType?.id && memberList.length > 0) {
      let payLoad = {
        branch_id: selectedBranchId.toString() || '',
        // "section_mapping_id" : selectedSectionMappingId.toString() || "",
        role_id: selectedUserLevelId.toString() || '',
        title: title || '',
        content: textEditorContent || '',
        // "attachments" : uploadFiles || [],
        category: announcementType?.id,
        members: memberList || [],
      };
      if (isDraft) {
        payLoad['is_draft'] = true;
      }
      if (uploadFiles?.length > 0) {
        payLoad['attachments'] = uploadFiles.flat(1) || [];
      }
      if (isStudentIncluded) {
        payLoad['section_mapping_id'] = selectedSectionMappingId.toString() || '';
      }
      setLoading(true);
      axiosInstance
        .post(`${endpoints.announcementNew.createAnnouncement}`, payLoad)
        .then((res) => {
          if (res?.data?.status_code === 200) {
            setAlert('success', res?.data?.message);
            handleCloseModal();
          } else {
            setAlert('error', res?.data?.message);
          }
          setLoading(false);
        });
    }
  };


  return (
    <Dialog
      //   className='reminderDialog'
      classes={{ paper: classes.paper }}
      style={{marginLeft : setMobileView ? '5%' : ""}}
      fullWidth
      open={openModalAnnouncement}
      onClose={handleCloseModal}
      maxWidth='lg'
    //   aria-labelledby='draggable-dialog-title'
    >
      {loading && <Loader />}
      <Grid
        xs={12}
      >
        <Grid container justifyContent='space-between' alignItems='center' style={{ fontSize: 20, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {announcementType?.category_name === "Event" && (<EventIcon style={{ color: '#7852CC', marginRight: 10 }} />)}
            {announcementType?.category_name === "Exam" && (<EventNoteIcon style={{ color: '#EF005A', marginRight: 10 }} />)}
            {announcementType?.category_name === "Holiday" && (<BeachAccessIcon style={{ color: '#F96C00', marginRight: 10 }} />)}
            {announcementType?.category_name === "TimeTable" && (<InsertInvitationIcon style={{ color: '#62A7EB', marginRight: 10 }} />)}
            {announcementType?.category_name === "General" && (<SubjectIcon style={{ color: '#464D57', marginRight: 10 }} />)}
            {announcementType?.category_name}
          </div>
          <CancelOutlinedIcon
            style={{
              position: 'relative',
              top: '6px',
              color: 'black',
              cursor: 'pointer',
              marginTop: "-7px",
            }}
            onClick={handleCloseModal}
          />
        </Grid>
      </Grid>
      <hr style={{ marginBottom: '10px' }} />
      <DialogContent>
        <div style={{ height: '50vh' }}>
          <Grid container spacing={1}>
            <Grid xs={12} md={6} lg={6} item>
              <Grid style={{ marginBottom: 5 }}><b >Choose User Level</b></Grid>
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
              <Grid style={{ marginBottom: 5 }}><b>Branch</b></Grid>
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
                <Grid style={{ marginBottom: 5 }}><b>Grade</b></Grid>
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
                <Grid style={{ marginBottom: 5 }}><b>Section</b></Grid>
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

            <Grid container>
              <Grid xs={12} md={6} lg={6} item style={{ padding: '0 5px', margin: '10px 0px' }}>
                <Grid container justifyContent='space-between' alignItems='center' style={{ border: '1px solid #d3cbcb', padding: 7, borderRadius: 8 }}>
                  <Typography>
                    Total {memberCount ? memberCount : '0'} members selected
                  </Typography>
                  {/* <div style={{color :'#576DC5',textDecoration:'underline',cursor:'pointer'}}>
                    Select particular member
                  </div> */}
                </Grid>
              </Grid>
            </Grid>

            {/* <Grid item spacing={2} xs={12} sm={6} style={{border:'1px solid grey'}}>
              <Typography>Total Members {memberCount ? memberCount : '0'}</Typography>
            </Grid> */}

            <Grid md={12} lg={12} item>
              <hr />
            </Grid>
            <Grid xs={12} md={6} lg={6} item>
              <Grid style={{ marginBottom: 5 }}><b>Title</b></Grid>
              <TextField
                style={{ display: 'grid' }}
                id='outlined-basic'
                size='small'
                placeholder='Title'
                variant='outlined'
                onChange={(e) => setTitle(e.target.value)}
              />
              <div style={{ color: '#E60C38', display: 'flex', justifyContent: "flex-end", fontSize: 13, fontWeight: 600, marginTop: 5 }}>
                Max. 50 Characters
              </div>
            </Grid>
          </Grid>

          <Grid style={{ marginBottom: 5, marginTop: '5px' }}><b>Main Body</b></Grid>
          <MyTinyEditor
            id='Editor'
            //description={Description}
            content={textEditorContent}
            // placeholder='Description...'
            handleEditorChange={handleEditorChange}
            onChange={(e) => setContent(e.target.value)}
            //   handleEditorChange={handleEditorChange}
            //   setOpenEditor={openEditor}
            height='150px'
            isShowToolBar='fontselect fontsizeselect bold italic aligncenter underline bullist numlist file image customInsertButton'
          />
          <Grid style={{ marginBottom: 5, marginTop: '20px' }}><b>Upload attachment</b></Grid>
          <div
            style={{
              height: '40px',
              width: '50%',
              border: '1px solid #bbb8b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px',
              marginBottom: 10
            }}
          >
            <div>{uploadFiles?.length > 0 ? uploadFiles?.length : '0'} File Attached</div>
            <div style={{ cursor: 'pointer' }} onClick={() => setOpenUpload(true)}>
              <PublishIcon
                style={{ position: 'relative', top: '6px' }}
              //   onClick={() => fileUploadInput.current.click()}
              />
              Upload
            </div>
          </div>
          {fileToFilter.length > 0 && (<span style={{ textDecoration: 'underline', margin: "5px", cursor: 'pointer' }} onClick={() => { handleEditFileOpen() }}>
            View all files
          </span>)}
          <div style={{ height: '20px', width: '100%' }}></div>
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
        </div>

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
      <Dialog
        // fullScreen={true}
        open={openEditUpload}
        onClose={() => handleEditFileClose}
        aria-labelledby='responsive-dialog-title'
        fullWidth={true}
        maxWidth='sm'
      >
        <Grid item container justifyContent='space-between' alignItems='center' xs={12}>
          <Typography
            style={{ color: '#676767', paddingLeft: 20, fontWeight: 600, fontSize: 20 }}
          >
            All Uploaded Files
          </Typography>
          <HighlightOffIcon
            onClick={() => handleFilterClose(false)}
            style={{ cursor: 'pointer', paddingRight: 20, fontSize: '50px' }}
          />
        </Grid>
        <hr />
        <div style={{ padding: "0 20px" }}>
          <div
            style={{
              display: 'flex',
              padding: '10px 25px',
              background: '#E5E5E5',
              fontSize: 16,
              marginTop: 20,
              fontWeight: 600,
            }}
          >
            <div style={{ flex: 5, textAlign: 'left' }}>Name</div>
            <div style={{ flex: 2, textAlign: 'center', paddingRight: 25 }}>Type</div>
            <div style={{ flex: 1, textAlign: 'center' }}></div>
          </div>
          <div style={{ maxHeight: '250px', overflowY: 'scroll' }}>
            {fileToFilter?.length > 0 &&
              fileToFilter.flat(1)?.map((item, index) => (
                <div
                  style={{
                    display: 'flex',
                    padding: '10px 25px',
                    border: '1px solid #E5E5E5',
                    fontSize: 16,
                  }}
                >
                  <div
                    style={{
                      flex: 5,
                      textAlign: 'left',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.split('/')[2]}
                  </div>
                  <div style={{ flex: 2, textAlign: 'center' }}>
                    {item.split(".")[2]}
                  </div>
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    <HighlightOffIcon
                      onClick={() => {
                        setopenModalFinal(true)
                        setFileToDelete(item)
                      }
                      }
                      style={{ cursor: 'pointer', fontSize: '30px' }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
        <Grid
          container
          xs={12}
          justifyContent='center'
          style={{ marginBottom: 20, marginTop: 15 }}
        >
          <Button
            variant='contained'
            onClick={() => handleFilterClose(false)}
            style={{ padding: '5px 30px', marginRight: 10 }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            color='primary'
            style={{ padding: '5px 40px', marginLeft: 10 }}
            onClick={() => handleFilterClose(true)}
          >
            Save
          </Button>
        </Grid>
        <ConfirmModal
          submit={handleFilter}
          openModal={openModalFinal}
          setOpenModal={setopenModalFinal}
        />
      </Dialog>
    </Dialog>
  );
};

export default CreateAnnouncement;

