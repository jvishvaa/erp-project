/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import {
  withStyles,
  Typography,
  Divider,
  Grid,
  Button,
  Paper,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  AppBar,
  Tabs,
  Tab,
  Modal,
  Backdrop,
  Switch,
  TextField
} from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import ReactHTMLParser from 'react-html-parser'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import CommentIcon from '@material-ui/icons/Comment'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt'
import TinyMce from '../TinyMCE/tinymce'
import styles from './editPost.style'
import Loader from '../../loader'
import { discussionUrls } from '../../../../urls'

const EditPost = ({ alert, classes, history }) => {
  const [auth] = useState(JSON.parse(localStorage.getItem('user_profile')))
  const [loading, setloading] = useState(false)

  const [categoryId, setCategoryId] = useState('')
  const [subCategoryId, setSubCategoryId] = useState('')
  const [subSubCategoryId, setSubSubCategoryId] = useState('')

  const [categoryList, setCategoryList] = useState([])
  const [subcategoryList, setSubCategoryList] = useState([])
  const [subSubcategoryList, setSubSubCategoryList] = useState([])

  const [grades, setGrades] = useState([])
  const [sections, setSections] = useState([])

  const [grade, setGrade] = useState('')
  const [section, setSection] = useState([])

  const [postListData, setPostListData] = useState([])
  const [viewMore, setViewMore] = useState(10)

  const [open, setOpen] = useState(false)
  const [postTitle, setPostTitle] = useState('')
  const [postDescription, setPostDescription] = useState('')
  const [postEditId, setPostEditId] = useState('')
  const [poststatus, setPostStatus] = useState(false)

  const [apihitting, setapiHitting] = useState(false)

  const [value, setValue] = React.useState(0)
  const [status, setStatus] = useState('is_active_true')
  const StatusArray = [
    // { statusId: 1, statusName: 'New Posts' },
    { statusId: 2, statusName: 'New Topic' },
    { statusId: 3, statusName: 'Deleted Topic' }
  ]

  function clearFunction () {
    setCategoryId('')
    setSubCategoryId('')
    setSubSubCategoryId('')
    setGrade([])
    setSection([])
  }

  function handleChange (event, newValue) {
    setapiHitting(true)
    setValue(newValue)
    console.log(status)
    // if (StatusArray[newValue].statusId === 1) {
    //   setStatus('is_active_false')
    // } else
    if (StatusArray[newValue].statusId === 2) {
      setStatus('is_active_true')
    } else if (StatusArray[newValue].statusId === 3) {
      setStatus('is_delete')
    }
  }

  useEffect(() => {
    axios
      .get(`${discussionUrls.Grades}`, {
        headers: {
          Authorization: 'Bearer ' + auth.personal_info.token
        }
      })
      .then(res => {
        if (res.status === 200) {
          setGrades(res.data)
        } else {
          console.log('error')
        }
      })
      .catch(error => {
        console.log(error)
        console.log("Error: Couldn't fetch data from " + discussionUrls.PostDiscussion)
      })
  }, [auth.personal_info.token])

  useEffect(() => {
    axios
      .get(`${discussionUrls.Sections}`, {
        headers: {
          Authorization: 'Bearer ' + auth.personal_info.token
        }
      })
      .then(res => {
        if (res.status === 200) {
          setSections(res.data)
        } else {
          console.log('error')
        }
      })
      .catch(error => {
        console.log(error)
        console.log("Error: Couldn't fetch data from " + discussionUrls.PostDiscussion)
      })
  }, [auth.personal_info.token])

  function functionToGetCategoryList () {
    setloading(true)
    const url = `${discussionUrls.getCategoryListApi}`
    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        setCategoryList(res.data)
        setloading(false)
      }).catch(err => {
        console.log(err)
        setloading(false)
      })
  }

  function functionTOGetSubCategoryList () {
    setloading(true)
    const url = `${discussionUrls.getSubCategoryListApi}?category_id=${categoryId}`
    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        setSubCategoryList(res.data)
        setloading(false)
      }).catch(err => {
        console.log(err)
        setloading(false)
      })
  }

  function functionTOGetSubSubCategoryList () {
    setloading(true)
    const url = `${discussionUrls.subSubCategoryGetListApi}?category_id=${categoryId}&sub_category_id=${subCategoryId}`
    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        setSubSubCategoryList(res.data)
        setloading(false)
      }).catch(err => {
        console.log(err)
        setloading(false)
      })
  }

  function functionTOGetPostListData () {
    setloading(true)
    setViewMore(10)
    const url = `${discussionUrls.getPostListApi}?last_index=0${grade ? `&grade=${grade}` : ''}${section ? `&section=${section}` : ''}${categoryId ? `&category_id=${categoryId}` : ''}${subCategoryId ? `&sub_category_id=${subCategoryId}` : ''}${subSubCategoryId ? `&sub_sub_category_id=${subSubCategoryId}` : ''}&${status}=${status === 'is_active_false' ? 'False' : 'True'}`
    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        setPostListData(res.data)
        if (res.data.length !== 10) {
          setViewMore(true)
        }
        setloading(false)
      }).catch(err => {
        console.log(err)
        setloading(false)
      })
  }

  function functionToUpdatePost () {
    if (!postTitle) {
      alert.warning('Enter Post Title')
      return
    }
    if (!postDescription) {
      alert.warning('Enter Post description')
      return
    }
    setloading(true)
    const url = `${discussionUrls.updatePostApi}${postEditId}/update_posts/`
    axios
      .put(url, {
        'title': postTitle,
        'description': postDescription,
        'is_active': poststatus
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        handleClose()
        functionTOGetPostListData()
        alert.success('Post Updated Successfully')
        setloading(false)
      }).catch(err => {
        console.log(err)
        alert.error('Please Try Again')
        setloading(false)
      })
  }

  function functionTodeletePost (id, status) {
    setloading(true)
    const url = `${discussionUrls.updatePostApi}${id}/update_posts/`
    axios
      .put(url, {
        'is_delete': status
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        console.log(res.data)
        functionTOGetPostListData()
        alert.success(`Post ${status === true ? 'Deleted' : 'Restored'} Successfully`)
        setloading(false)
      }).catch(err => {
        console.log(err)
        alert.error('Please Try Again')
        setloading(false)
      })
  }

  function functionToApprovePost (id) {
    setloading(true)
    const url = `${discussionUrls.updatePostApi}${id}/update_posts/`
    axios
      .put(url, {
        'is_active': true
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        console.log(res.data)
        functionTOGetPostListData()
        alert.success('Post Approved Successfully')
        setloading(false)
      }).catch(err => {
        console.log(err)
        alert.error('Please Try Again')
        setloading(false)
      })
  }
  function functionToUnApprovePost (id) {
    setloading(true)
    const url = `${discussionUrls.updatePostApi}${id}/update_posts/`
    axios
      .put(url, {
        'is_active': false
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        console.log(res.data)
        functionTOGetPostListData()
        alert.success('Post Un Approved Successfully')
        setloading(false)
      }).catch(err => {
        console.log(err)
        alert.error('Please Try Again')
        setloading(false)
      })
  }

  useEffect(() => {
    if (auth) {
      functionToGetCategoryList()
      functionTOGetPostListData()
    }
  }, [auth])

  useEffect(() => {
    if (status && apihitting) {
      setCategoryId('')
      setSubCategoryId('')
      setSubSubCategoryId('')
      functionTOGetPostListData()
    }
  }, [status])

  useEffect(() => {
    if (categoryId) {
      functionTOGetSubCategoryList()
      setSubCategoryId('')
      setSubSubCategoryId('')
    }
  }, [categoryId])

  useEffect(() => {
    if (subCategoryId) {
      functionTOGetSubSubCategoryList()
      setSubSubCategoryId()
    }
  }, [subCategoryId])

  let loader = null
  if (loading) {
    loader = <Loader open />
  }

  function functionToHandleViewMorePosts () {
    setViewMore(postListData.length)
    setloading(true)
    const url = `${discussionUrls.getPostListApi}?last_index=${postListData.length || viewMore}${grade ? `&grade=${grade}` : ''}${section ? `&section=${section}` : ''}${categoryId ? `&category_id=${categoryId}` : ''}${subCategoryId ? `&sub_category_id=${subCategoryId}` : ''}${subSubCategoryId ? `&sub_sub_category_id=${subSubCategoryId}` : ''}&${status}=${status === 'is_active_false' ? 'False' : 'True'}`
    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        let array = postListData
        if (res.data.length !== 10) {
          setViewMore(true)
        }
        for (let i = 0; i < res.data.length; i += 1) {
          array.push(res.data[i])
        }
        setPostListData(array)
        setloading(false)
      }).catch(err => {
        console.log(err)
        setloading(false)
      })
  }
  function openEditPostMode (title, desc, ptid, status) {
    setOpen(true)
    setPostTitle(title)
    setPostDescription(desc)
    setPostStatus(status)
    setPostEditId(ptid)
  }

  const handleClose = () => {
    setOpen(false)
    setPostTitle('')
    setPostDescription('')
    setPostEditId('')
  }

  function functionToOpenComments (data) {
    localStorage.setItem('commentId', JSON.stringify(data))
    history.push({
      pathname: '/discussion-form_edit_Comments'
    })
  }

  function modalOpen () {
    let modal = null
    modal = (
      <>
        <Modal
          aria-labelledby='transition-modal-title'
          aria-describedby='transition-modal-description'
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500
          }}
        >
          <Paper className={classes.modelpaper} >
            <Typography variant='h5'>Edit Post</Typography>
            <Divider className={classes.divider} />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12}>
                <TextField
                  label='Title'
                  margin='dense'
                  fullWidth
                  required
                  variant='outlined'
                  value={postTitle || ''}
                  onChange={e => setPostTitle(e.target.value)}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography>Description :</Typography>
                <TinyMce id={'Q1345'} get={(content) => setPostDescription(content)} content={postDescription} />
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography>Set Post as Approve/Un_Approve :</Typography>
                  Un Approve
                <Switch
                  checked={poststatus || false}
                  value={poststatus || false}
                  onChange={(e) => setPostStatus(e.target.checked)}
                  color='primary'
                />Approve
              </Grid>
              <Grid item md={12} xs={12} style={{ marginTop: '8px', textAlign: 'center' }}>
                <Button
                  color='primary'
                  variant='contained'
                  size='large'
                  onClick={() => functionToUpdatePost()}
                >
                   Update Post
                </Button>
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
          </Paper>
        </Modal>
      </>
    )
    return modal
  }

  return (
    <>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item md={3} xs={12}>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel id='demo-mutiple-name-label-grade'>Grade</InputLabel>
              <Select
                labelId='demo-mutiple-name-label-grade'
                id='demo-mutiple-name'
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                {grades.map((name) => (
                  <MenuItem key={name.id} value={name.id} >
                    {name.grade}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel id='demo-mutiple-name-label-section'>Section</InputLabel>
              <Select
                labelId='demo-mutiple-name-label-section'
                id='demo-mutiple-name'
                multiple
                value={section}
                onChange={(e) => setSection(e.target.value)}
              >
                {sections.map((name) => (
                  <MenuItem key={name.id} value={name.id} >
                    {name.section_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl margin='dense' required fullWidth>
              <InputLabel> Select Category </InputLabel>
              <Select
                label='select Category'
                placeholder='Select Category *'
                value={categoryId || ''}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <MenuItem key={1} value={1} disabled>
                  Select Category
                </MenuItem>
                {categoryList && categoryList.length !== 0 && categoryList.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl margin='dense' required fullWidth>
              <InputLabel> Select Sub Category </InputLabel>
              <Select
                label='select Sub Category'
                placeholder='Select Sub Category *'
                value={subCategoryId || ''}
                onChange={(e) => setSubCategoryId(e.target.value)}
              >
                <MenuItem key={1} value={1} disabled>
                  Select Sub Category
                </MenuItem>
                {subcategoryList && subcategoryList.length !== 0 && subcategoryList.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl margin='dense' required fullWidth>
              <InputLabel> Select Sub Sub Category </InputLabel>
              <Select
                label='Select Sub Sub Category'
                placeholder='Select Sub Sub Category*'
                value={subSubCategoryId || ''}
                onChange={(e) => setSubSubCategoryId(e.target.value)}
              >
                <MenuItem key={1} value={1} disabled>
                   Select Sub Sub Category
                </MenuItem>
                {subSubcategoryList && subSubcategoryList.length !== 0 && subSubcategoryList.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={1} xs={4}>
            <Button
              variant='contained'
              color='primary'
              fullWidth
              style={{ marginTop: '20px' }}
              onClick={() => functionTOGetPostListData()}
            >Search</Button>
          </Grid>
          <Grid item md={1} xs={4}>
            <Button
              variant='contained'
              color='primary'
              fullWidth
              style={{ marginTop: '20px' }}
              onClick={() => clearFunction()}
            >Clear</Button>
          </Grid>
          <Grid item md={1} xs={4}>
            <Button
              variant='contained'
              color='primary'
              fullWidth
              style={{ marginTop: '20px' }}
              onClick={() => functionTOGetPostListData()}
            >Reload</Button>
          </Grid>
        </Grid>
        <Divider className={classes.divider} />
        <Grid container spacing={2}>
          <Grid item md={12} xs={12}>
            <AppBar position='static' color='default'>
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor='primary'
                color='primary'
                variant='scrollable'
                scrollButtons='auto'
                aria-label='scrollable auto tabs example'
              >
                {StatusArray &&
                    StatusArray.map((statusData) => (
                      <Tab
                        key={statusData.statusId}
                        style={{ marginRight: '4%', marginLeft: '4%' }}
                        label={statusData.statusName}
                      />
                    ))}
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
        <Divider className={classes.divider} />
        <Grid container spacing={2}>
          {postListData && postListData.length === 0 &&
            <Grid item md={12} xs={12}style={{ textAlign: 'center', marginTop: '30px', color: 'blue' }}>
              <Typography variant='h5'>No Topic Are Added</Typography>
            </Grid>
          }
          {postListData && postListData.length !== 0 && postListData.map((item, index) => (
            <Grid item md={12} xs={12} style={{ padding: '20px', overflow: 'auto' }} key={index}>
              <Paper className={classes.postpaper} elevation={3} key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffede2' : '#fff9f5', position: 'relative' }}>
                <Grid container spacing={2}>
                  <Grid item md={6} xs={6} style={{ textAlign: 'left' }}>
                    <Button> <AccountCircleIcon /> &nbsp; {(item.post_user && item.post_user.first_name) || ''}</Button>
                  </Grid>
                  <Grid item md={6} xs={6} style={{ textAlign: 'right' }}>
                    <Typography>Posted on : {item.post_date}</Typography>
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <Typography variant='h5' style={{ color: 'blue' }}>Title : {item.title}</Typography>
                  </Grid>
                  <Grid item md={2} xs={12}>
                    <Typography variant='h6'>Description : </Typography>
                  </Grid>
                  <Grid item md={10} xs={12} style={{ marginTop: '6px' }}>
                    {ReactHTMLParser(item.description)}
                  </Grid>
                  <Grid item md={9} xs={12} style={{ textAlign: 'left' }}>
                    {/* <a href='/discussion-form_edit_Comments'> */}
                    <Button color='primary' onClick={() => functionToOpenComments(item)}>
                      <CommentIcon /> : {item.comment_count}
                    </Button>
                    {/* </a> */}
                    {''}
                    <Button color='primary'>
                      <ThumbUpAltIcon /> : {item.like_count}
                    </Button>
                  </Grid>
                  <Grid item md={1} xs={6} style={{ display: ((status === 'is_delete' || status === 'is_active_true') ? 'none' : '') }}>
                    <Button fullWidth variant='contained' color='primary' onClick={() => functionToApprovePost(item.id)}>
                          Approve
                    </Button>
                  </Grid>
                  <Grid item md={1} xs={6} style={{ display: ((status === 'is_delete' || status === 'is_active_true') ? 'none' : '') }}>
                    <Button fullWidth variant='contained' color='primary' onClick={() => openEditPostMode(item.title, item.description, item.id, item.is_active)}>
                          Edit
                    </Button>
                  </Grid>
                  <Grid item md={2} xs={6} style={{ display: ((status === 'is_delete' || status === 'is_active_false') ? 'none' : '') }}>
                    <Button fullWidth variant='contained' color='primary' onClick={() => functionToUnApprovePost(item.id)} style={{ display: 'none' }}>
                          Un Approve
                    </Button>
                  </Grid>
                  <Grid item md={1} xs={6} style={{ display: (status === 'is_delete' ? 'none' : '') }}>
                    <Button fullWidth variant='contained' color='primary' onClick={() => functionTodeletePost(item.id, true)}>
                          Delete
                    </Button>
                  </Grid>
                  <Grid item md={1} style={{ display: (status === 'is_delete' ? '' : 'none') }} />
                  <Grid item md={2} xs={6} style={{ display: (status === 'is_delete' ? '' : 'none') }}>
                    <Button fullWidth variant='contained' color='primary' onClick={() => functionTodeletePost(item.id, false)}>
                          Un Delete
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
          {postListData && postListData.length !== 0 &&
            <Grid item md={12} xs={12}style={{ textAlign: 'center', padding: '10px', color: 'blue' }}>
              <Button variant='contained' color='primary' disabled={viewMore === true} size='large' style={{ borderRadius: '10px' }} onClick={() => functionToHandleViewMorePosts(postListData.length)}>View More Posts</Button>
            </Grid>
          }
        </Grid>
      </Paper>
      {modalOpen()}
      {loader}
    </>
  )
}
export default (withStyles(styles)(withRouter(EditPost)))

// export default withStyles(styles)withRouter(EditPost)
