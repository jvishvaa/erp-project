/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
// { useState }
import clsx from 'clsx'
// import { makeStyles, useTheme, fade } from '@material-ui/core/styles
import { withStyles, useTheme } from '@material-ui/core/styles'
import axios from 'axios'
import { Grid, Select, MenuItem, InputLabel, FormControl, Paper } from '@material-ui/core'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
// import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
// import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
// import InboxIcon from '@material-ui/icons/MoveToInbox'
// import MailIcon from '@material-ui/icons/Mail'
// import SearchIcon from '@material-ui/icons/Search'
// import InputBase from '@material-ui/core/InputBase'
import Button from '@material-ui/core/Button'
import PostDiscussion from '../PostDiscussion'
import AllPosts from '../posts/AllPosts'
import styles from './Mainbar.style'
import { discussionUrls } from '../../../urls'
// import Answer from '../posts/replies/Answer'
// import GSelect from '../../../_components/globalselector'
// import { COMBINATIONS } from './combinationDiscussion'
import Loader from '../../discussion_form/loader'
import MyActivity from '../MyActivity/MyActivity'

const Mainbar = ({ alert, classes }) => {
//   const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = React.useState(true)
  const [post, setPost] = useState(0)
  const [allPosts, setAllPosts] = useState([])
  const [lastIndex, setLastIndex] = useState(0)
  const [authForm] = useState(JSON.parse(localStorage.getItem('user_profile')))

  const [branches, setBranches] = useState([])
  const [grades, setGrades] = useState([])
  const [sections, setSections] = useState([])

  const [SelectedAll, setSelectedAll] = useState(false)

  const [branch, setBranch] = useState((authForm.personal_info.role === 'Teacher' || authForm.personal_info.role === 'LeadTeacher' || authForm.personal_info.role === 'AcademicCoordinator') ? [authForm.branch_id] : [])
  const [grade, setGrade] = useState([])
  const [section, setSection] = useState([])

  // const [showActivity, setShowActivity] = useState(false)
  const [categoryList, setCategoriesList] = useState([])
  const [loading, setloading] = useState(false)
  const [likeStatus, setLikeStatus] = useState('')
  const [awardStatus, setAwardStatus] = useState('')
  const [rewardList, setRewardList] = useState([])
  const [handleMore, setHandleMore] = useState(false)

  const [selectedCategoryId, setSelectedCategoryId] = useState('')

  console.log(branches)

  let loader = null
  if (loading) {
    loader = <Loader open />
  }

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const postBtn = () => {
    if (post === 1 || post === 2) {
      setPost(0)
    } else {
      setPost(1)
    }
  }

  const newPost = () => {
    setPost(0)
    setLastIndex(0)
  }

  const showActivityFunc = () => {
    setPost(2)
    setOpen(false)
  }

  const lastIndexFunc = (data) => {
    setLastIndex(data)
  }

  function functionForAddLikeForPost (id) {
    let Url = `${discussionUrls.apiForLikePost}`
    axios
      .post(Url, {
        post: id
      }, {
        headers: {
          Authorization: 'Bearer ' + authForm.personal_info.token
        }
      })
      .then(res => {
        if (res.status === 201) {
          setLikeStatus(res.data)
        } else {
          // alert.warning(JSON.stringify(res.data))
        }
      })
      .catch(error => {
        console.log(error)
        console.log("Error: Couldn't fetch data from " + discussionUrls.PostDiscussion)
      })
  }

  function addAwardFunction (data, id, awardId) {
    if (!data || !awardId) {
      alert.warning('select Award')
      return
    }
    let Url = `${discussionUrls.addAwardForPosts}`
    axios
      .post(Url, {
        post: id,
        award: awardId
      }, {
        headers: {
          Authorization: 'Bearer ' + authForm.personal_info.token
        }
      })
      .then(res => {
        if (res.status === 201) {
          setAwardStatus(res.data)
        } if (res.status === 200) {
          setAwardStatus(res.data)
        } if (res.status === 400) {
          alert.warning("Don't give self award")
        } else {
          // alert.warning(JSON.stringify(res.data))
        }
      })
      .catch(error => {
        console.log(error, 'aa')
        alert.warning("Don't give self award")
        console.log("Error: Couldn't fetch data from " + discussionUrls.PostDiscussion)
      })
  }
  useEffect(() => {
    if (authForm) {
      axios
        .get(`${discussionUrls.awardListNameApi}`, {
          headers: {
            Authorization: 'Bearer ' + authForm.personal_info.token
          }
        })
        .then(res => {
          if (res.status === 200) {
            setRewardList(res.data)
          } else {
            // alert.warning(JSON.stringify(res.data))
          }
        })
        .catch(error => {
          console.log(error)
          console.log("Error: Couldn't fetch data from " + discussionUrls.PostDiscussion)
        })
    }
  }, [authForm])

  const getComponent = () => {
    if (post === 0) {
      return <AllPosts alert={alert} allPosts={allPosts} handelMore={handleMore}viewMore={lastIndexFunc} likeFunction={functionForAddLikeForPost} addAwardFunction={addAwardFunction} awwardResponse={awardStatus} rewardListInfo={rewardList} />
    } else if (post === 1) {
      return <PostDiscussion alert={alert} postSuccess={newPost} branch={branch} grade={grade} section={section} />
    } else if (post === 2) {
      return <MyActivity alert={alert} activities={allPosts} viewMore={lastIndexFunc} likeFunction={functionForAddLikeForPost} addAwardFunction={addAwardFunction} awwardResponse={awardStatus} rewardListInfo={rewardList} likeResponse={likeStatus} />
    }
  }

  function handleCategoryFunction (id) {
    setSelectedCategoryId(id)
  }

  useEffect(() => {
    setloading(true)
    axios
      .get(`${discussionUrls.CategoryApi}`, {
        headers: {
          Authorization: 'Bearer ' + authForm.personal_info.token
        }
      })
      .then(res => {
        if (res.status === 200) {
          setCategoriesList(res.data)
          setloading(false)
          // alert.success('Sucessfull Posted')
        //   this.refreshComponent()
        } else {
          setloading(false)
          // alert.warning(JSON.stringify(res.data))
        }
      })
      .catch(error => {
        console.log(error)
        setloading(false)
        console.log("Error: Couldn't fetch data from " + discussionUrls.PostDiscussion)
      })
  }, [authForm.personal_info.token])

  useEffect(() => {
    setHandleMore(false)
    if (lastIndex > 0) {
      let newData = `${discussionUrls.PostDiscussion}?last_index=${lastIndex}${grade && grade.length !== 0 ? `&grade=${grade}` : ''}${branch && branch.length !== 0 ? `&branch=${branch}` : ''}${section.length !== 0 ? `&section=${section}` : ''}${selectedCategoryId ? `&category=${selectedCategoryId}` : ''}`
      setloading(true)
      axios
        .get(newData, {
          headers: {
            Authorization: 'Bearer ' + authForm.personal_info.token
          }
        })
        .then(res => {
          if (res.status === 200) {
            setloading(false)
            setAllPosts(prevVal => [...prevVal, ...res.data])
            if (res.data.length !== 10) {
              setHandleMore(true)
            }
          } else {
            setloading(false)
          }
        })
        .catch(error => {
          console.log(error)
          setloading(false)
          console.log("Error: Couldn't fetch data from " + discussionUrls.PostDiscussion)
        })
    }
  }, [lastIndex])

  useEffect(() => {
    setLastIndex(0)
    setHandleMore(false)
    if (post !== 2) {
      let newData = `${discussionUrls.PostDiscussion}?last_index=${0}${grade ? `&grade=${grade}` : ''}${branch ? `&branch=${branch}` : ''}${section.length !== 0 ? `&section=${section}` : ''}${selectedCategoryId ? `&category=${selectedCategoryId}` : ''}`
      setloading(true)
      axios
        .get(newData, {
          headers: {
            Authorization: 'Bearer ' + authForm.personal_info.token
          }
        })
        .then(res => {
          if (res.status === 200) {
            setloading(false)
            setAllPosts(res.data)
          } else {
            setloading(false)
          }
        })
        .catch(error => {
          console.log(error)
          setloading(false)
          console.log("Error: Couldn't fetch data from " + discussionUrls.PostDiscussion)
        })
    }
  }, [authForm.personal_info.token, post, likeStatus, awardStatus, selectedCategoryId])

  function reloadFunction () {
    setSelectedCategoryId('')
    setBranch([])
    setGrade([])
    setSection([])
    setLastIndex(0)
    setloading(true)
    setHandleMore(false)
    const urlInfo = `${discussionUrls.PostDiscussion}?last_index=0`
    axios
      .get(urlInfo, {
        headers: {
          Authorization: 'Bearer ' + authForm.personal_info.token
        }
      })
      .then(res => {
        if (res.status === 200) {
          setAllPosts(res.data)
          setloading(false)
        } else {
          setloading(false)
        }
      })
      .catch(error => {
        console.log(error)
        setloading(false)
        console.log("Error: Couldn't fetch data from " + discussionUrls.PostDiscussion)
      })
  }

  const submitFilter = () => {
    setLastIndex(0)
    setloading(true)
    setHandleMore(false)
    const urlInfo = `${discussionUrls.PostDiscussion}?last_index=${0}${grade ? `&grade=${grade}` : ''}${branch ? `&branch=${branch}` : ''}${section.length !== 0 ? `&section=${section}` : ''}${selectedCategoryId ? `&category=${selectedCategoryId}` : ''}`
    axios
      .get(urlInfo, {
        headers: {
          Authorization: 'Bearer ' + authForm.personal_info.token
        }
      })
      .then(res => {
        if (res.status === 200) {
          setAllPosts(res.data)
          setloading(false)
        } else {
          setloading(false)
        }
      })
      .catch(error => {
        console.log(error)
        setloading(false)
        console.log("Error: Couldn't fetch data from " + discussionUrls.PostDiscussion)
      })
  }

  const clearFilter = () => {
    setGrade([])
    setBranch([])
    setSection([])
  }

  useEffect(() => {
    // if (authForm && authForm.personal_info.role !== 'Planner') {
    axios
      .get(`${discussionUrls.Branches}`, {
        headers: {
          Authorization: 'Bearer ' + authForm.personal_info.token
        }
      })
      .then(res => {
        if (res.status === 200) {
          setBranches(res.data)
        } else {
          console.log('error')
        }
      })
      .catch(error => {
        console.log(error)
        console.log("Error: Couldn't fetch data from " + discussionUrls.PostDiscussion)
      })
    // }
  }, [authForm.personal_info.token])

  useEffect(() => {
    setGrade([])
    if (branch.length !== 0) {
      setloading(true)
      axios
        .get(`${discussionUrls.GrancWiseGradesApi}?branch=${branch}`, {
          headers: {
            Authorization: 'Bearer ' + authForm.personal_info.token
          }
        })
        .then(res => {
          if (res.status === 200) {
            setGrades(res.data)
            setloading(false)
          } else {
            console.log('error')
          }
        })
        .catch(error => {
          console.log(error)
          setloading(false)
          console.log("Error: Couldn't fetch data from " + discussionUrls.PostDiscussion)
        })
    }
  }, [authForm.personal_info.token, branch])

  useEffect(() => {
    setSection([])
    if (grade.length === 1 && branch.length === 1) {
      setloading(true)
      axios
        .get(`${discussionUrls.gradeWiseSectionApi}?branch=${branch}&grade=${grade}`, {
          headers: {
            Authorization: 'Bearer ' + authForm.personal_info.token
          }
        })
        .then(res => {
          if (res.status === 200) {
            setSections(res.data)
            setloading(false)
          } else {
            console.log('error')
            setloading(false)
          }
        })
        .catch(error => {
          console.log(error)
          setloading(false)
          console.log("Error: Couldn't fetch data from " + discussionUrls.PostDiscussion)
        })
    }
  }, [authForm.personal_info.token, grade])

  function handleSelectALl (e) {
    if (SelectedAll === true && e.target.value.length - 1 === grades.length) {
      setSelectedAll(false)
      setGrade([])
      return
    }
    if (e.target.value.length !== 0) {
      if (e.target.value.filter((data) => data === '0').length === 1 && SelectedAll === false) {
        let setarray = []
        for (let i = 0; i < grades.length; i += 1) {
          setarray.push(grades[i].id)
        }
        setSelectedAll(true)
        setGrade(setarray)
      } else {
        setGrade(e.target.value)
        setSelectedAll(false)
      }
    } else {
      setGrade([])
      setSelectedAll(false)
    }
  }

  // const handleChange = (e) => {
  //   console.log(e, 'dddddddd')
  // }

  const getDropDowns = () => {
    console.log(authForm.personal_info.token)
    if (authForm.personal_info.role === 'Teacher' || authForm.personal_info.role === 'LeadTeacher' || authForm.personal_info.role === 'AcademicCoordinator') {
      return (
        <Grid container >
          <Grid item xs={3} >
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel id='demo-mutiple-name-label'>Grade</InputLabel>
              <Select
                labelId='demo-mutiple-name-label'
                id='demo-mutiple-name'
                value={grade}
                style={{ minWidth: 120, maxWidth: 300 }}
                multiple
                onChange={(e) => handleSelectALl(e)}
              >
                <MenuItem key='0' value='0'>
                   Select All
                </MenuItem>
                {grades.map((name) => (
                  <MenuItem key={name.id} value={name.id} style={{ color: grade.filter((gradeData) => gradeData === name.id).length === 1 ? 'white' : '', backgroundColor: grade.filter((gradeData) => gradeData === name.id).length === 1 ? '#835' : '' }}>
                    {name.grade}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={1} />
          {grade && grade.length === 1 &&
          <Grid item xs={3}>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel id='demo-mutiple-name-label'>Section</InputLabel>
              <Select
                labelId='demo-mutiple-name-label'
                id='demo-mutiple-name'
                multiple
                style={{ minWidth: 120, maxWidth: 300 }}
                value={section}
                onChange={(e) => setSection(e.target.value)}

              >
                {sections.map((name) => (
                  <MenuItem key={name.id} value={name.id} style={{ color: section.filter((gradeData) => gradeData === name.id).length === 1 ? 'white' : '', backgroundColor: section.filter((gradeData) => gradeData === name.id).length === 1 ? '#835' : '' }}>
                    {name.section_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          }
          {post === 0 &&
          <>
            {/* <Grid item xs={3}> */}
            <Button onClick={submitFilter} variant='contained' size='small' color='primary' style={{ marginLeft: '20px', marginTop: '12px', height: '40px' }}>Filter Topics</Button>
            <Button onClick={clearFilter} variant='contained' size='small' color='primary' style={{ marginLeft: '20px', marginTop: '12px', height: '40px' }}>Clear Filter</Button>
            {/* </Grid> */}

          </>
          }

        </Grid>
      )
    } else if ((authForm && authForm.personal_info.role === 'Principal') || (authForm && authForm.personal_info.role === 'Planner')) {
      return (<Grid container spacing={2} >
        {/* <GSelect variant={'selector'} config={COMBINATIONS} onChange={handleChange} /> */}
        <Grid item xs={3}>
          <FormControl className={classes.formControl} fullWidth>
            <InputLabel id='demo-mutiple-name-label'>Branch</InputLabel>
            <Select
              labelId='demo-mutiple-name-label'
              id='demo-mutiple-name'
              value={branch}
              multiple
              style={{ minWidth: 120, maxWidth: 300 }}
              onChange={(e) => setBranch(e.target.value)}
            >
              {branches.map((name) => (
                <MenuItem key={name.id} value={name.id} style={{ color: branch.filter((gradeData) => gradeData === name.id).length === 1 ? 'white' : '', backgroundColor: branch.filter((gradeData) => gradeData === name.id).length === 1 ? '#835' : '' }}>
                  {name.branch_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {branch && branch.length !== 0 &&
        <Grid item xs={3}>
          <FormControl className={classes.formControl} fullWidth>
            <InputLabel id='demo-mutiple-name-label'>Grade</InputLabel>
            <Select
              labelId='demo-mutiple-name-label'
              id='demo-mutiple-name'
              value={grade || []}
              multiple
              style={{ minWidth: 120, maxWidth: 300 }}
              onChange={(e) => handleSelectALl(e)}
            >
              <MenuItem key='0' value='0'>
              Select All
              </MenuItem>
              {grades.map((name) => (
                <MenuItem key={name.id} value={name.id} style={{ color: grade.filter((gradeData) => gradeData === name.id).length === 1 ? 'white' : '', backgroundColor: grade.filter((gradeData) => gradeData === name.id).length === 1 ? '#835' : '' }}>
                  {name.grade}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>}
        {grade.length === 1 && branch.length === 1 &&
        <Grid item xs={3}>
          <FormControl className={classes.formControl} fullWidth>
            <InputLabel id='demo-mutiple-name-label'>Section</InputLabel>
            <Select
              labelId='demo-mutiple-name-label'
              id='demo-mutiple-name'
              multiple
              style={{ minWidth: 120, maxWidth: 300 }}
              value={section}
              onChange={(e) => setSection(e.target.value)}

            >
              {sections.map((name) => (
                <MenuItem key={name.id} value={name.id} style={{ color: section.filter((gradeData) => gradeData === name.id).length === 1 ? 'white' : '', backgroundColor: section.filter((gradeData) => gradeData === name.id).length === 1 ? '#835' : '' }}>
                  {name.section_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        }
        {post === 0 && <>
          <Button onClick={submitFilter} variant='contained' size='small' color='primary' style={{ marginLeft: '20px', marginTop: '12px', height: '40px' }}>Filter Topics</Button>
          <Button onClick={clearFilter} variant='contained' size='small' color='primary' style={{ marginLeft: '20px', marginTop: '12px', height: '40px' }}>Clear Filters</Button>
          </>}
      </Grid>)
    } else {
      return (
        <div />
      )
    }
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position='static'
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open
        })}
      >
        <Toolbar>
          {post === 0 &&
          <Button
            color='primary'
            variant='contained'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            className={clsx(classes.menuButton, {
              [classes.hide]: open
            })}
          >
            {/* <MenuIcon /> */}
            View Categories
          </Button>
          }
          <Typography variant='h6' noWrap className={classes.title}>
            {post !== 1 ? 'Topics' : 'Post Your Question' }
          </Typography>
          {/* <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder='Search…'
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div> */}
          <Button variant='contained' className={classes.navBtn} color='primary' onClick={postBtn}>
            {post !== 1 ? post === 2 ? 'Back To Post' : 'Ask' : 'View Posts'}
          </Button>
          <Button variant='contained' color='primary' className={classes.navBtn} onClick={showActivityFunc}>
            My Activity
          </Button>
          {post !== 2 &&
          <Button variant='contained' color='primary' className={classes.navBtn} onClick={reloadFunction}>
             Reload
          </Button>
          }
        </Toolbar>
      </AppBar>
      { post !== 1 &&
      <Drawer
        variant='permanent'
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open
          }),
          paperAnchorDockedLeft: classes.newClass
        }}
      >
        <div className={classes.toolbar}>
          {theme.direction === 'rtl'
            ? <IconButton onClick={handleDrawerClose}>
              <ChevronRightIcon />
            </IconButton>
            : <div style={{ justifyContent: 'center' }}>
              <span style={{ color: '#835', fontSize: '20px', display: 'inline-block', marginTop: '4%', paddingLeft: '50px' }}>Categories</span>
              <IconButton style={{ float: 'right' }} onClick={handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
          }
        </div>
        <Divider />
        {open &&
        <>
          <List style={{ maxHeight: 500, overflow: 'auto', textAlign: 'center', backgroundColor: '#fdede2' }}>
            {categoryList.map((text) => (
              <ListItem button key={text.id} onClick={() => handleCategoryFunction(text.id)}>
                <ListItemText style={{ color: (selectedCategoryId === text.id) ? 'blue' : 'black' }}>{text.title}</ListItemText>
              </ListItem>
            ))}
          </List>
          <Divider />
        </>
        }
        {/* {!open &&
        <a className={classes.verticalButton}>
          <Button variant='contained' color='primary' onClick={() => setOpen(true)}>View Categories</Button>
        </a>
        } */}
      </Drawer>
      }
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {/* {post === false ? <AllPosts allPosts={allPosts} /> : <PostDiscussion postSuccess={postBtn} />} */}
        {post !== 2 &&
        <Paper style={{ padding: '20px', marginBottom: '20px' }}>
          {getDropDowns()}
        </Paper>
        }
        {post === 0 &&
        <>
          <Typography variant='h5' style={{ padding: '5px' }}>
            {selectedCategoryId === '' ? 'All Categories' : categoryList.filter((item) => item.id === selectedCategoryId)[0].title}
          </Typography>
          <Divider className={classes.divider} />
        </>
        }
        { getComponent() }
        {/* { post === 0 &&
        <Button variant='contained' color='primary' style={{ float: 'right', marginTop: '10px' }} className={classes.navBtn} onClick={lastIndexFunc}>
            View More...
        </Button>
        } */}
      </main>
      {loader}
    </div>
  )
}

export default withStyles(styles)(Mainbar)
