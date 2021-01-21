/* eslint-disable no-unused-vars */
/* eslint-disable no-trailing-spaces */
import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Grid, withStyles } from '@material-ui/core'
//  import BackupIcon from '@material-ui/icons/Backup'
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import Fade from '@material-ui/core/Fade'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import axios from 'axios'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import FolderIcon from '@material-ui/icons/Folder'
import styles from './addCircularTemplate.style'
import { urls } from '../../urls'
import { InternalPageStatus } from '../../ui'

// const usePrevious = value => {
//   const ref = useRef()
//   useEffect(() => {
//     ref.current = value
//   })
//   return ref.current
// }

const AddCircularTemplate = ({ alert, classes }) => {
  // const []
  const token = JSON.parse(localStorage.getItem('user_profile')).personal_info.token
  const user = JSON.parse(localStorage.getItem('user_profile')).personal_info
  const [open, setOpen] = useState(false)
  const [folderopen, setFolderOpen] = useState(false)
  const [folderTitle, setFolderTitle] = useState('')
  const [fileTitle, setFileTitle] = useState('')
  const [uploadFile, setUploadFile] = useState('')
  const [fileType, setFileType] = useState('')
  const [openMoveModal, setOpenMoveModal] = useState(false)
  const [fileId, setFileId] = useState('')
  const [value, setValue] = useState('')
  const [field, setField] = useState('')
  const [parentId, setParentId] = useState('')
  const [allItems, setAllItems] = useState()
  const [anchorEl, setAnchorEl] = useState(null)
  const [chosenItem, setChosenItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [renameModalOpen, setRenameModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [searchName, setSearchName] = useState('')
  const [allItemsBackup, setAllItemsBackup] = useState()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [downloadModalOpen, setDownloadModalOpen] = useState(false)
  const [backButtonItems, setBackButtonItems] = useState()
  const [allItemsArray, setAllItemsArray] = useState([])
  const [parentItem, setParentItem] = useState()
  const [folderPath, setFolderPath] = useState('/home')
  const [folderPathArray, setFolderPathArray] = useState(['/home'])
  const [alterPath, setAlterPath] = useState('')
  const [subFolderBackup, setSubFolderBackup] = useState()
  const [backIdArray, setBackIdArray] = useState([])

  const handleClose = () => {
    setOpen(false)
    setFileTitle('')
    setUploadFile('')
    setFileType('')
  }
  const handleCloseFolder = () => {
    setFolderOpen(false)
    setFolderTitle('')
  }
  function handleOpenModal () {
    setOpen(true)
    console.log('aaaaaa')
  }
  function handleOpenFolderModal () {
    setFolderOpen(true)
  }
  const handleOpenMoveModal = () => {
    setOpenMoveModal(true)
  }
  const handleCloseMoveModal = () => {
    setOpenMoveModal(false)
    setValue('')
  }

  const handleOpenRenameModal = () => {
    setRenameModalOpen(true)
  }

  const handleCloseRenameModal = () => {
    setRenameModalOpen(false)
  }

  const handleOpenDeleteModal = () => {
    setDeleteModalOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false)
  }
  const handleCloseDownload = () => {
    setDownloadModalOpen(false)
  }
  const handleOpenDownloadModal = () => {
    setDownloadModalOpen(true)
  }
  const backButton = () => {
    console.log('.......................backButtonItems')
    setParentId(backIdArray.pop())
    setAllItems(allItemsArray.pop())
    if (parentItem) {
      const alterPathArr = parentItem.split('/')
      if (parentItem.endsWith('/')) {
        alterPathArr.splice(alterPathArr.length - 1, 1)
      }
      alterPathArr.pop()
      setParentItem(alterPathArr.join('/'))
    }
    console.log('alterPath....................')
    console.log(alterPath)
    // setParentItem()
    console.log('allItems inside back button')
    console.log(allItems)
  }

  const moveFolder = () => {
    if (!value) {
      alert.warning('Select Folder')
      return
    }
    console.log(chosenItem)
    const formData = new FormData()
    formData.append('file_id', chosenItem.file_id)
    formData.append('field', 'parent')
    formData.append('value', value)

    axios.patch(urls.CircularTemplateCRUD, formData, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'

      }
    })
      .then(res => {
        if (res.status === 200) {
          alert.success('Successfully Moved')
        }
        handleCloseMoveModal()
        setOpenMoveModal(false)
        console.log(res, 'movvvvv')
        console.log(res.data, 'moveeeee')
        fetchAllItems()
      })
      .catch(err => {
        console.log(err)
      })
  }
  const handleErrors = (response) => {
    console.log('response................')
    console.log(response)
    if (response.status !== 200) {
      if (response.status === 400) {
        alert.error(`Error: ${response.status}`)
        return response
      }
    }
    return response
  }
  
  const renameItem = () => {
    if (!name) {
      alert.warning('Enter Name')
      return
    }
    if ((name.indexOf('.')) > -1) {
      alert.warning('Name should not contain dot')
      return
    }
    const data = {
      'file_id': chosenItem.file_id,
      'field': 'name',
      'value': name
    }
    axios.patch(urls.CircularTemplateCRUD, data, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'

      }
    })
      .then(res => {
        if (res.data.status === ' name already exists') {
          alert.warning('Name already exists!')
        } else if (res.data.status === ' name format invalid') {
          alert.warning('name format invalid')
        } else {
          alert.success('Renamed Successfully')
          setRenameModalOpen(false)
          if (allItems && allItems[0] && allItems[0].parent_id !== null) {
            fetchSubFolderItems({ 'file_id': parentId })
          } else {
            fetchAllItems()
          }
        } 
        console.log('res inside renameItem patch.............')
        console.log(res)
      })
      .catch(err => {
        // if (err.data.status === ' name format invalid') {
        //   alert.warning('name format invalid')
        // }
        console.log(err)
      })
    console.log('chosenItem in renameFolder')
    console.log(chosenItem)
  }
  
  const deleteItem = () => {
    const data = {
      'file_id': chosenItem.file_id,
      'name': chosenItem.name,
      'file_type': chosenItem.file_type
    }
    console.log(data)
    const formData = new FormData()
    formData.append('file_id', chosenItem.file_id)
    formData.append('name', chosenItem.name)
    formData.append('file_type', chosenItem.file_type)
    // eslint-disable-next-line no-debugger
    // debugger
    axios.delete(`${urls.CircularTemplateCRUD}?file_id=${chosenItem.file_id}`, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        alert.success('Successfully deleted')
        if (allItems && allItems[0] && allItems[0].parent_id !== null) {
          fetchSubFolderItems({ 'file_id': parentId })
        } else {
          fetchAllItems()
        }
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }
  const deleteFolder = () => {
    setDeleteModalOpen(false)
    if (chosenItem && chosenItem.file_type === 0) {
      // if the right click was done on a folder, check if it's empty
      // basically trying to achieve the functionality that 'only EMPTY folders can be deleted'
      axios.get(`${urls.CircularTemplateCRUD}?parent=${chosenItem.file_id}`, {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
  
        }
      })
        .then(res => {
          // handleCloseFolder()
          if (res.data && res.data.files && res.data.files.length !== 0) { // folder emptiness check
            alert.warning('Only empty folders can be deleted')
          } else {
            deleteItem()
          }
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      // if it's not a folder, API call anyway
      deleteItem()
    }
    console.log(chosenItem)
  }

  const folderRightClicked = (e, value) => {
    console.log('value.................................')
    setChosenItem(value)
    console.log(value)
    e.preventDefault()
    setAnchorEl(e.currentTarget)
    console.log('rightclicked on')
    console.log(chosenItem)
  }

  const handleFolderRightClickClose = () => {
    setAnchorEl(null)
  }

  // async function classicFetch (url) {
  //   setLoading(true)
  //   const response = await fetch (url, {
  //     method: 'GET',
  //     body: JSON.stringify({ 'parent': value.file_id }),
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${token}`
  //     }
  //   })
  //   const res = await response.json()
  //   return res
  // }
  const fetchSubFolderPath = (val) => {
    setParentItem(val.file_path)
  }
  const fetchSubFolderItems = (value) => {
    setBackIdArray((item) => [...item, allItems[0].parent_id])
    console.log('value')
    console.log(value)
    setParentId(value.file_id)
    setLoading(true)
    // classicFetch(urls.CircularTemplateCRUD)
    //   .then((res) => {
    //     setAllItems(res.data.files)
    //     console.log(res)
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //   })
    console.log('allItemsarray....................')
    console.log(allItemsArray)
    setBackButtonItems(allItems)
    axios.get(`${urls.CircularTemplateCRUD}?parent=${value.file_id}`, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'

      }
    })
      .then(res => {
        setLoading(false)
        // handleCloseFolder()
        setAllItems(res.data.files)
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const fetchAllItems = () => {
    setParentId(null)
    setLoading(true)
    axios.get(urls.CircularTemplateCRUD, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'

      }
    })
      .then(res => {
        if (res.status === 200) {
          alert.success('Fetched successfully')
          // setloading(false)
        }
        // handleCloseFolder()
        setLoading(false)
        setAllItems(res.data.files)
        setAllItemsBackup(res.data.files)
        console.log(res.data.files, 'qqqqqeeeeerrrrrrttttt')
        console.log(allItems, 'typtttttttttt')
        console.log(res, 'resssssssssssss')
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    fetchAllItems()
    console.log(`token`)
    console.log(token)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const createFolder = () => {
    if (!folderTitle) {
      alert.warning('Enter Folder Title')
      return
    }
    const data = {
      'file_type': 0,
      'file_name': folderTitle,
      'parent': parentId
    }
    axios.put(urls.CircularTemplateCRUD, data, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'

      }
    })
      .then(res => {
        if (res.data.status === ' File already exists ') {
          alert.warning('Folder Name already Exists')
          // setloading(false)
        } else if (res.data.status === ' name format invalid') {
          alert.warning('name format invalid')
        } else {     
          alert.success('Folder Created Successfully')
          if (allItems && allItems[0] && allItems[0].parent_id !== null) {
            fetchSubFolderItems({ 'file_id': parentId })
          } else {
            fetchAllItems()
          }
          // setloading(false)
          setFolderOpen(false)
        } 
        setLoading(false)
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }

  function functionToHandleFile (data) {
    console.log('entereddddd')
    setUploadFile(data)
    console.log(data.type, 'aaaaaaaadataaaaaaaatype')
    if (data && data.type === 'application/msword') {
      setFileType(1)
    } else {
      setFileType(2)
    }
  }

  const funcUploadFile = () => {
    if (!fileTitle) {
      alert.warning('Enter File Title')
      return
    }
    if (!uploadFile) {
      alert.warning('Upload file')
      return
    }
    handleClose()
    const formData = new FormData()
    formData.append('file_name', fileTitle)
    formData.append('template_file', uploadFile)
    formData.append('file_type', fileType)
    if (parentId !== null) {
      formData.append('parent', parentId)
    }
    axios.put(urls.CircularTemplateCRUD, formData, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.data.status === ' File already exists ') {
          alert.warning('File already Exists')
          // setloading(false)
        } else if (res.data.status === ' name format invalid') {
          alert.warning('name format invalid')
        } else {     
          alert.success('File Uploaded Successfully')
          console.log('allItems')
          console.log(allItems)
          console.log('allItems[0]')
          console.log(allItems[0])
          console.log('allItems[0].parent_id')
          console.log(allItems[0].parent_id)
          if (allItems && allItems[0] && allItems[0].parent_id !== null) {
            console.log('fetching sub folder')
            fetchSubFolderItems({ 'file_id': parentId })
          } else {
            console.log('fetching ROOT folder')
          
            fetchAllItems()
          }
          handleClose()
          // setloading(false)
        }   
        console.log(JSON.stringify(res.data.status, 'staatusssss'))
        console.log(JSON.stringify(res.data), 'statussss')
      })
      .catch(err => {
        // if (err.data.status === ' name format invalid') {
        //   alert.warning('name format invalid')
        // }
        console.log(err)
      })
  }

  const cancelSearch = () => {
    setAllItems(allItemsBackup)
  }

  const filterByname = () => {
    if (searchName !== '') {
      setAllItems((k) => {
        return k && k.filter((oneItem) => 
          oneItem.name === searchName || 
          oneItem.name.includes(searchName) || 
          oneItem.name.includes(`${searchName}.doc`) ||
          oneItem.name.includes(`${searchName}.docx`)
        )
      })
    }
  }

  function functionToOpenModal () {
    let view = null
    view = (
      <>
        <Modal
          open={open}
          onClose={handleClose}
          className={classes.modal}
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'
        >
          <Fade in={open}>
            <Paper className={classes.paperr}>
              <Grid container spacing={2}>
                <Grid item md={11} xs={11}>
                  <Typography variant='h4'>Upload File</Typography>
                </Grid>
                <Grid item md={1} xs={1}>
                  <IconButton onClick={() => handleClose()}><CloseIcon /></IconButton>
                </Grid>  
              </Grid>
              <Divider className={classes.divider} />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12}>
                  <TextField
                    id='filled-basic'
                    label='Title'
                    variant='filled'
                    fullWidth
                    margin='dense'
                    value={fileTitle}
                    onChange={e => setFileTitle(e.target.value)} 
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <Typography variant='h6'>
                    Upload File (only .doc and .docx) &nbsp;
                    <b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <input
                    style={{ display: 'none' }}
                    className={classes.fileUpload}
                    id='outlined-button-filee'
                    type='file'
                    accept='.doc, .docx'
                    onChange={(e) => functionToHandleFile(e.target.files[0])}
                  />
                  <label htmlFor='outlined-button-filee'>
                    <Button
                      variant='outlined'
                      component='span'
                      size='small'
                      className={classes.fileUpload}
                      startIcon={<CloudUploadIcon />}
                    >
                      Browse
                    </Button>
                  </label>
                </Grid>
                <Grid item md={12} xs={12} style={{ textAlign: 'center' }}>
                  <Button
                    color='primary'
                    size='small'
                    variant='contained'
                    // onClick={() => (edit === true && functionToUpdateBlog()) || (edit === false && addBlogFunction())}
                    onClick={funcUploadFile}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Fade>
        </Modal>
      </>
    )
    return view
  }

  function functionToOpenFolderModal () {
    let folder = null
    folder = (
      <>
        <Modal
          open={folderopen}
          onClose={handleCloseFolder}
          className={classes.modal}
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'
        >
          <Fade in={folderopen}>
            <Paper className={classes.paperr}>
              <Grid container spacing={2}>
                <Grid item md={11} xs={11}>
                  <Typography variant='h4'>Create Folder</Typography>
                </Grid>
                <Grid item md={1} xs={1}>   
                  <IconButton onClick={() => handleCloseFolder()}><CloseIcon /></IconButton>
                </Grid>
              </Grid>    
              <Divider className={classes.divider} />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12}>
                  <TextField
                    id='filled-basic'
                    label='Title'
                    variant='filled'
                    fullWidth
                    margin='dense' 
                    onChange={e => setFolderTitle(e.target.value)}
                  />
                </Grid>
                <Grid item md={12} xs={12} style={{ textAlign: 'center' }}>
                  <Button
                    color='primary'
                    size='small'
                    variant='contained'
                    onClick={createFolder}
                  >
                    Create Folder
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Fade>
        </Modal>
      </>
    )
    return folder
  }

  function functionToOpenMoveModal () {
    let move = null
    move = (
      <>
        <Modal
          open={openMoveModal}
          onClose={handleCloseMoveModal}
          className={classes.modal}
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'
        >
          <Fade in={openMoveModal}>
            <Paper className={classes.paperr}>
              <Grid container spacing={2}>
                <Grid item md={11} xs={11}>
                  <Typography variant='h4'>Select Folder To Move </Typography>
                </Grid>
                <Grid item md={1} xs={1}>   
                  <IconButton onClick={() => handleCloseMoveModal()}><CloseIcon /></IconButton>
                </Grid>
              </Grid>    
              <Divider className={classes.divider} />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12}>
                  <FormControl variant='filled' className={classes.formControl}>
                    <InputLabel id='demo-simple-select-filled-label'>Select Folder</InputLabel>
                    <Select
                      margin='dense'
                      labelId='demo-simple-select-filled-label'
                      id='demo-simple-select-filled'
                      fullWidth
                      value={value || ''}
                      onChange={(e) => setValue(e.target.value)}
                    >
                      {allItems && allItems.length !== 0 && chosenItem && chosenItem.length !== 0 &&
                        allItems.filter((filterItem) => filterItem.file_id !== chosenItem.file_id).filter((folder) => folder.file_type === 0).map((item) => (
                        // folders = [item.file_type === 0]
                          <MenuItem key={item.file_id} value={item.file_id}>
                            {item.name}
                          </MenuItem>
                        
                        ))}
                    </Select>
                  </FormControl>  
                  <Grid item md={12} xs={12} style={{ textAlign: 'center' }}>
                    <Button
                      color='primary'
                      size='small'
                      variant='contained'
                      onClick={moveFolder}
                    >
                    Move
                    </Button>
                  </Grid>
                </Grid>  
              </Grid>    
            </Paper>  
          </Fade>
        </Modal>   
      </>
    )
    return move 
  }

  const functionToOpenDeleteModal = () => {
    let deleteModal = null
    deleteModal = (
      <>
        <Modal
          open={deleteModalOpen}
          onClose={handleCloseDeleteModal}
          className={classes.modal}
          aria-labelledby='delete-modal-title'
          aria-describedby='delete-modal-description'
        >
          <Fade in={deleteModalOpen}>
            <Paper className={classes.paperr}>
              <Grid container spacing={2}>
                <Grid item md={11} xs={11}>
                  <Typography variant='h4'>Delete Folder</Typography>
                </Grid>
                <Grid item md={1} xs={1}>   
                  <IconButton onClick={() => handleCloseDeleteModal()}><CloseIcon /></IconButton>
                </Grid>
              </Grid>    
              <Divider className={classes.divider} />
              {chosenItem && <Typography variant='h4'>Are you sure to delete {chosenItem.name}? This action can not be undone.</Typography>}
              <Divider className={classes.divider} />
              <Grid container spacing={2}>
                {/* <Grid item md={12} xs={12}>
                  <TextField
                    id='filled-basic'
                    label='New name'
                    variant='filled'
                    fullWidth
                    margin='dense' 
                    onChange={e => setName(e.target.value)}
                  />
                </Grid>
                <Grid item md={12} xs={12} style={{ textAlign: 'center' }}>
                  <Button
                    color='primary'
                    size='medium'
                    variant='contained'
                    onClick={renameItem}
                  >
                    Rename {chosenItem && chosenItem.name}
                  </Button>
                </Grid> */}
                <Grid item md={6} xs={12} style={{ textAlign: 'center' }}>
                  <Button
                    color='primary'
                    size='large'
                    variant='contained'
                    onClick={deleteFolder}
                  >
                    OK
                  </Button>
                </Grid>
                <Grid item md={6} xs={12} style={{ textAlign: 'center' }}>
                  <Button
                    color='primary'
                    size='large'
                    variant='contained'
                    onClick={handleCloseDeleteModal}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Fade>
        </Modal>
      </>
    )
    return deleteModal
  }

  const functionToOpenRenameModal = () => {
    let rename = null
    rename = (
      <>
        <Modal
          open={renameModalOpen}
          onClose={handleOpenRenameModal}
          className={classes.modal}
          aria-labelledby='rename-modal-title'
          aria-describedby='rename-modal-description'
        >
          <Fade in={renameModalOpen}>
            <Paper className={classes.paperr}>
              <Grid container spacing={2}>
                <Grid item md={11} xs={11}>
                  <Typography variant='h4'>Rename</Typography>
                </Grid>
                <Grid item md={1} xs={1}>   
                  <IconButton onClick={() => handleCloseRenameModal()}><CloseIcon /></IconButton>
                </Grid>
              </Grid>    
              <Divider className={classes.divider} />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12}>
                  <TextField
                    id='filled-basic'
                    label='New name'
                    variant='filled'
                    fullWidth
                    margin='dense' 
                    onChange={e => setName(e.target.value)}
                  />
                </Grid>
                {/* <Grid item md={12} xs={12}>
                  <TextField 
                    id='filled-basic' 
                    label='Description' 
                    variant='filled'
                    fullWidth
                    placeholder='MultiLine with rows: 3 and rowsMax: 4'
                    multiline
                    rowsMax={4}   
                  />
                </Grid> */}
                <Grid item md={12} xs={12} style={{ textAlign: 'center' }}>
                  <Button
                    color='primary'
                    size='medium'
                    variant='contained'
                    onClick={renameItem}
                  >
                    Rename {chosenItem && chosenItem.name}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Fade>
        </Modal>
      </>
    )
    return rename
  }

  function functionToOpenDownloadModal () {
    let download = null
    download = (
      <>
        <Modal
          open={downloadModalOpen}
          onClose={handleCloseDownload}
          className={classes.modal}
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'
        >
          <Fade in={downloadModalOpen}>
            <Paper className={classes.paperr}>
              <Grid container spacing={2}>
                <Grid item md={11} xs={11}>
                  <Typography variant='h4'>Download File</Typography>
                </Grid>
                <Grid item md={1} xs={1}>   
                  <IconButton onClick={() => handleCloseDownload()}><CloseIcon /></IconButton>
                </Grid>
              </Grid>    
              <Divider className={classes.divider} />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12}>
                  {chosenItem && <Typography variant='h5'>would you like to download {' '} {chosenItem.name}</Typography>}
                </Grid>
                <Grid item md={12} xs={12}>
                  {chosenItem && chosenItem.template_file &&
                  <a target='_blank' href={chosenItem.template_file} style={{ fontSize: 20 }}>
                    click to download {chosenItem.name}
                  </a>}
                </Grid>
                <Grid item md={12} xs={12} style={{ textAlign: 'center' }}>
                  <Button
                    color='primary'
                    size='small'
                    variant='contained'
                    onClick={handleCloseDownload}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Fade>
        </Modal>
      </>
    )
    return download
  }

  return (
    <>
      {loading ? <InternalPageStatus label={'Fetching your files...'} /> : <React.Fragment>
        <Grid container spacing={3} className={classes.root}>
          <Grid item xs={12} sm={6} md={6}>
            <Button 
              variant='contained'
              size='large'
              color='primary'
              fullWidth
              onClick={() => handleOpenModal()}
            >Upload File</Button>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Button 
              variant='contained'
              size='large'
              color='primary'
              fullWidth
              onClick={() => handleOpenFolderModal()}
            >Create Folder</Button>
          </Grid>
          {functionToOpenModal()}
          {functionToOpenFolderModal()}
          {functionToOpenMoveModal()}  
          {functionToOpenRenameModal()}
          {functionToOpenDeleteModal()}
          {functionToOpenDownloadModal()}
          <Grid item md={1} xs={12}>
            <Button 
              style={{ marginTop: 10 }}
              variant='contained'
              size='large'
              color='primary'
              onClick={() => fetchAllItems()}
              disabled={allItems && allItems[0] && !allItems[0].parent_id}
            >
              Home
            </Button>
          </Grid>
          <Grid item md={1} xs={12}>
            <Button 
              style={{ marginTop: 10 }}
              variant='contained'
              size='large'
              color='primary'
              disabled={allItems && allItems[0] && (allItems[0].level === 0 || allItems.length === 0)}
              onClick={backButton}
            >
              Back
            </Button>
          </Grid>
          <Grid item md={4} xs={12} />
          <Grid item md={3} xs={12}>
            <TextField
              id='search'
              label='Search file or folder'
              variant='filled'
              fullWidth
              margin='dense' 
              onChange={e => { setSearchName(e.target.value.split('.doc')[0]) }}
            />
          </Grid>
          <Grid item md={1} xs={12}>
            <Button 
              style={{ marginTop: 10 }}
              variant='contained'
              size='large'
              fullWidth
              color='primary'
              onClick={() => filterByname()}
            >
              Search
            </Button>
          </Grid>
          <Grid item md={1} xs={12}>
            <Button 
              style={{ marginTop: 10 }}
              variant='contained'
              size='large'
              fullWidth
              color='primary'
              onClick={() => cancelSearch()}
            >
              Cancel
            </Button>
          </Grid>
          <Grid container className={classes.root} spacing={2} style={{ paddingTop: 50, paddingLeft: 50, paddingRight: 50, paddingBottom: 50 }}>
            {/* <Typography variant='h5'> {folderPath} </Typography> */}
            <Typography variant='h5'> {allItems && allItems[0] && allItems[0].parent_id === null ? '/home/' : (parentItem ? `/home${parentItem}` : '/home/')} </Typography>
            <Grid item md={12} xs={12}>
              <Grid container spacing={3} >
                {allItems && allItems.length === 0 && 
                <Grid item md={12} xs={12} style={{ textAlign: 'center', marginTop: '40px' }}>
                  <Typography variant='h5'style={{ color: 'blue' }}>Files Not Found</Typography>
                </Grid>
                }
                {allItems && allItems.length !== 0 && allItems.map((item) => (
                  <Grid key={item.file_id} item xs={6} md={2} sm={4}>
                    {item.file_type === 0 
                      ? <>
                        <FolderIcon 
                          color='primary'
                          aria-controls='simple-menu' aria-haspopup='true'
                          style={{ fontSize: 100, cursor: 'pointer' }} 
                          onClick={() => { fetchSubFolderItems(item); fetchSubFolderPath(item); setAllItemsArray(item => [...item, allItems]); setFolderPathArray(path => [...path, item.file_path]) }} 
                          onContextMenu={(e) => folderRightClicked(e, item)} /> 
                        <p>{item.name}</p>
                      </> 
                      : <>
                        <FileCopyIcon 
                          color='primary' 
                          style={{ fontSize: 100, cursor: 'pointer' }} 
                          href={item.template_file}
                          onContextMenu={(e) => folderRightClicked(e, item)} /> 
                        <p>
                          {item.file_type === 1 ? `${item.name}.doc` : `${item.name}.docx`}
                        </p>
                      </> }
                  </Grid>
                ))}
              </Grid>
            </Grid> 
          </Grid>
        </Grid>
        <Menu
          id='simple-menu'
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleFolderRightClickClose}
        >
          <MenuItem onClick={() => { handleFolderRightClickClose(); handleOpenMoveModal() }}>Move</MenuItem>
          <MenuItem onClick={() => { handleFolderRightClickClose(); handleOpenDeleteModal() }}>Delete</MenuItem>
          <MenuItem onClick={() => { handleFolderRightClickClose(); handleOpenRenameModal() }}>Rename</MenuItem>
          <MenuItem onClick={() => { handleFolderRightClickClose(); handleOpenDownloadModal() }}>Download</MenuItem>
          {/* {chosenItem && chosenItem.file_type !== 0 && <MenuItem href={chosenItem.template_file} >Download</MenuItem> } */}
          {/* <MenuItem onClick={handleFolderRightClickClose}>more options</MenuItem> */}
        </Menu>
      </React.Fragment>}
    </>
  )
}    
AddCircularTemplate.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired
}
export default withStyles(styles)(AddCircularTemplate)
