/* eslint-disable no-unused-vars */
/* eslint-disable no-trailing-spaces */
import React, { useState, useEffect } from 'react'
// import { Route } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import { Grid, withStyles } from '@material-ui/core'
import PropTypes from 'prop-types'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import FolderIcon from '@material-ui/icons/Folder'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Modal from '@material-ui/core/Modal'
import Fade from '@material-ui/core/Fade'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Chip from '@material-ui/core/Chip'
import axios from 'axios'
import { urls } from '../../urls'
import styles from './addCircularTemplate.style'
import ViewFile from './viewfile'

const ViewCircularTemplate = ({ alert, classes, history }) => {
  const token = JSON.parse(localStorage.getItem('user_profile')).personal_info.token
  const [allItems, setAllItems] = useState()
  const [loading, setLoading] = useState(true)
  const [anchorEl, setAnchorEl] = useState(null)
  const [chosenItem, setChosenItem] = useState([])
  const [allItemsArray, setAllItemsArray] = useState([])
  const [backButtonItems, setBackButtonItems] = useState()
  const [searchName, setSearchName] = useState('')
  const [allItemsBackup, setAllItemsBackup] = useState()
  const [downloadModalOpen, setDownloadModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [storeUrl, setStoreUrl] = useState('')
  const [parentId, setParentId] = useState('')
  const [parentItem, setParentItem] = useState()
  const [alterPath, setAlterPath] = useState('')

  const handleOpenDownloadModal = () => {
    setDownloadModalOpen(true)
  }

  const handleCloseDownloadModal = () => {
    setDownloadModalOpen(false)
  }
  const handleOpenViewModal = () => {
    setViewModalOpen(true)
  }
  const handleCloseViewModal = () => {
    setViewModalOpen(false)
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
  
  const fetchSubFolderPath = (val) => {
    setParentItem(val.file_path)
  }
  const fetchSubFolderItems = (value) => {
    setParentItem(value)
    console.log('value')
    console.log(value, 'valuuuuuuuuuu')
  
    console.log('allItemsarray....................')
    console.log(allItemsArray, 'allllllllllllll')
    setBackButtonItems(allItems)
    setParentId(value.file_id)
    setLoading(true)

    axios.get(`${urls.CircularTemplateCRUD}?parent=${value.file_id}`, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'

      }
    })
      .then(res => {
        // handleCloseFolder()
        setLoading(false)
        setAllItems(res.data.files)
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }
  
  const backButton = () => {
    console.log('.......................backButtonItems')
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
    setSearchName('') 
  }

  const folderRightClicked = (e, value) => {
    console.log('value.................................')
    setChosenItem(value)
    console.log(value)
    e.preventDefault()
    setAnchorEl(e.currentTarget)
    console.log('rightclicked on')
    console.log(chosenItem, 'chosennnnnnnn')
  }
  const handleFolderRightClickClose = () => {
    setAnchorEl(null)
  }
  const fetchS3Url = () => {
    console.log(chosenItem, 'chosennnnnnnn')
    axios.get(chosenItem.template_file, {
      type: 'blob',
      headers: {
        // Authorization: 'Bearer ' + token,
        // 'Content-Type': 'application/json'

      }
    })
      .then(res => {
        console.log(res, 'urllllllllllre')
        console.log(res.data, 'urllllllllllre')
        setStoreUrl(res.data) 
      })
      .catch(err => {
        console.log(err)
      })
  }
  let url
  function getFileUrl () {
    // let url
    if (storeUrl && window && URL) {
      url = window.URL.createObjectURL(
        new Blob([storeUrl], { type: 'application/msword' })
      )
    }
    return url 
  }
  // return url

  // function getFile (chosenItem) {
  //   // <Route path='/v2/circular/template/view/file' component={ViewFile} />
  //   browserHistory.push('/v2/circular/template/view/file')
  // }
  // function getview (data) {
  //   localStorage.setItem('s3link', JSON.stringify(data))
  //   history.push({
  //     pathname: '/v2/circular/template/view/file'
  //   })
  // }

  function functionToOpenDownloadModal () {
    let downloadModal = null
    downloadModal = (
      <>
        <Modal
          open={downloadModalOpen}
          onClose={handleCloseDownloadModal}
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
                  <IconButton onClick={() => handleCloseDownloadModal()}><CloseIcon /></IconButton>
                </Grid>
                <Divider className={classes.divider} />
                <Grid container alignItems='center' spacing={2}>
                  <Grid item md={12} xs={12}>
                    {chosenItem && <Typography variant='h5'>would you like to download {' '} {chosenItem.name}</Typography>}
                  </Grid>
                  <Divider className={classes.divider} />
                  <Grid item md={12} xs={12}>
                    {chosenItem && chosenItem.template_file &&
                    <a target='_blank' href={chosenItem.template_file} style={{ fontSize: 20 }}>
                      click to download {chosenItem.name}
                    </a>}
                  </Grid>
                  {/* <Grid item md={12} xs={12}>
                    <Button variant='contained' color='primary' onClick={() => fetchS3Url()} style={{ 'margin-left': '4%', 'margin-top': '3px' }} >Template1</Button> 
                  </Grid> */}
                  {/* <Grid item md={12} xs={12}>
                    {chosenItem && chosenItem.template_file && (
                      <a target='_blank' rel='noopener noreferrer' onClick={() => getview(chosenItem)} style={{ fontSize: 20 }}>
                        click to view {chosenItem.name}
                      </a>)}
                  </Grid> */}
                  <Grid item md={12} xs={12} style={{ textAlign: 'center' }}>
                    <Button
                      color='primary'
                      size='large'
                      variant='contained'
                      onClick={handleCloseDownloadModal}
                    >
                    Cancel
                    </Button>
                  </Grid> 
                </Grid>
              </Grid>  
            </Paper>  
          </Fade>
        </Modal>
      </>    
    )
    return downloadModal
  } 
  
  function functionToOpenViewModal () {
    let folder = null
    folder = (
      <>
        <Modal
          open={viewModalOpen}
          onClose={handleCloseViewModal}
          className={classes.modal}
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'
        >
          <Fade in={viewModalOpen}>
            <Paper className={classes.paperr}>
              <Grid container spacing={2}>
                <Grid item md={11} xs={11}>
                  <Typography variant='h4'>Create Folder</Typography>
                </Grid>
                <Grid item md={1} xs={1}>   
                  <IconButton onClick={() => handleCloseViewModal()}><CloseIcon /></IconButton>
                </Grid>
              </Grid>    
              <Divider className={classes.divider} />
              <Grid item md={12} xs={12} style={{ textAlign: 'center' }}>
                <Button
                  color='primary'
                  size='small'
                  variant='contained'
                  // onClick={createFolder}
                >
                    Create Folder
                </Button>
              </Grid>
            </Paper>
          </Fade>
        </Modal>
      </>
    )
    return folder
  }

  return (
    <>
      <React.Fragment>
        <Grid container spacing={3} className={classes.root} >
          <Grid item md={1} xs={12}>
            <Button 
              style={{ marginTop: 10 }}
              variant='contained'
              color='primary'
              size='large'
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
              color='primary'
              fullWidth
              onClick={() => cancelSearch()}
            >
              Cancel
            </Button>
          </Grid> 
        </Grid>    
        <Grid container className={classes.root} spacing={2} style={{ paddingTop: 50, paddingLeft: 50, paddingRight: 50, paddingBottom: 50 }}>
          <Typography variant='h5'> {allItems && allItems[0] && allItems[0].parent_id === null ? '/home/' : (parentItem ? `/home${parentItem}` : '/home/')} </Typography>
          <Grid item xs={12}>
            <Grid container spacing={3} >
              {allItems && allItems.length === 0 && (
                <Grid item md={12} xs={12}>
                  <Typography variant='h5' style={{ color: 'blue', textAlign: 'center' }}> No Files and Folders are Added To View </Typography>
                </Grid>
              )}
              {allItems && allItems.length !== 0 && allItems.map((item) => (
                <Grid key={item.file_id} item xs={2} md={2} sm={2}>
                  {item.file_type === 0 
                    ? <>
                      <FolderIcon 
                        color='primary'
                        aria-controls='simple-menu' aria-haspopup='true'
                        style={{ fontSize: 100, cursor: 'pointer' }}
                        onClick={() => { fetchSubFolderItems(item); fetchSubFolderPath(item); setAllItemsArray(item => [...item, allItems]) }} 
                        // onContextMenu={(e) => folderRightClicked(e, item)}
                      /> 
                      <p>{item.name}</p>
                    </> 
                    : <>
                      <FileCopyIcon 
                        color='primary' 
                        style={{ fontSize: 100, cursor: 'pointer' }}
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
        {functionToOpenDownloadModal()}
        {functionToOpenViewModal()}
        <Menu
          id='simple-menu'
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleFolderRightClickClose}
        >
          <MenuItem onClick={() => { handleFolderRightClickClose(); handleOpenDownloadModal() }}>Download</MenuItem>
        </Menu>
      </React.Fragment>
    </>
  )
}
ViewCircularTemplate.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired
}
// export default withStyles(styles)(ViewCircularTemplate)
export default (withStyles(styles)(withRouter(ViewCircularTemplate)))
