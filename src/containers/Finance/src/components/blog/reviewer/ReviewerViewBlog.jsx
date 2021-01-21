/* eslint-disable no-unused-vars */
import React from 'react'
import { Toolbar, Grid, Button, Tabs, Tab } from '@material-ui/core'
import ClearIcon from '@material-ui/icons/Clear'
import CreatableSelect from 'react-select'
import axios from 'axios'
import _ from 'lodash'

import Badge from '@material-ui/core/Badge'
import { InternalPageStatus, Pagination, RouterButton } from '../../../ui'
import ReviewerBlogs from './ReviewerBlog'

import { urls } from '../../../urls'
import '../blog.css'
import GSelect from '../../../_components/globalselector'
import { COMBINATIONS } from '../utils/gselectConfiguration'

const viewDashboard = {
  label: 'Blog Dashboard',
  color: 'blue',
  href: 'dashboard',
  disabled: false
}
const viewPublishedBlogs = {
  label: 'Published Blogs',
  color: 'blue',
  href: 'publishedBlogs',
  disabled: false
}

class ReviewerViewBLog extends React.Component {
  constructor () {
    super()
    this.state = {
      blogs: [],
      currentPage: 1,
      pageSize: 12,
      totalPages: 0,
      isPublished: false,
      loading: true,
      currentTab: 0,
      selectedDate: '',
      count: 0,
      selectorData: {},
      personalInfo: JSON.parse(localStorage.getItem('user_profile')).personal_info,
      elasticVal: '',
      totalBlogs: 0,
      totalRBlogs: 0,
      currentSubTab: 0
    }
    this.delayedCallback = _.debounce((value) => {
      if (value.length > 0) {
        this.getBlogsBySearch(value)
      } else {
        this.getBlogs(true)
      }
    }, 2000)
    this.handleElasticSearch = this.handleElasticSearch.bind(this)
  }

  componentDidMount () {
    this.getBlogs()
  }

  logError = (err, alertType = 'error') => {
    let { message, response: { data: { status: messageFromDev, err_msg: middleWareMsg } = {} } = {} } = err || {}
    let alertMsg
    if (messageFromDev) {
      alertMsg = messageFromDev
    } else if (middleWareMsg) {
      alertMsg = middleWareMsg
    } else if (message) {
      alertMsg = message
    } else {
      alertMsg = 'Failed to connect to server'
    }
    this.props.alert[alertType](`${alertMsg}`)
  }

  getBlogs = (isFilter) => {
    const { currentPage, pageSize, personalInfo, isPublished, currentTab, selectorData, selectedDate } = this.state
    let path = `${urls.CreateBlog}?page_number=${currentPage}&page_size=${pageSize}&is_published=${isPublished ? 'True' : 'False'}&is_reviewed=${currentTab !== 0 ? 'True' : 'False'}`

    const { branch_id: branchId, acad_branch_grade_mapping_id: branchGradeId, section_mapping_id: sectionId, subject_mapping_id: subjectId, subject_id: subject } = selectorData
    if (isFilter) {
      if (selectedDate) {
        path += `&date=${selectedDate}`
      }
      if (personalInfo.role === 'Admin' || personalInfo.role === 'Blog Admin' || personalInfo.role === 'Teacher' || personalInfo.role === 'Principal' || personalInfo.role === 'AcademicCoordinator') {
        if (subjectId && sectionId) {
          path += `&subject_id=${subjectId}&section_id=${sectionId}`
        } else if (sectionId) {
          path += `&section_id=${sectionId}`
        } else if (branchGradeId) {
          path += `&grade_id=${branchGradeId}`
        } else if (branchId) {
          path += `&branch_id=${branchId}`
        }
      } else if (personalInfo.role === 'Subjecthead' || personalInfo.role === 'Planner') {
        if (sectionId) {
          path += `&section_id=${sectionId}`
        } else if (branchGradeId) {
          path += `&grade_id=${branchGradeId}`
        } else if (subject) {
          path += `&subject_id=${subject}`
        } else if (branchId) {
          path += `&branch_id=${branchId}`
        }
      }
    }

    axios.get(path, {
      headers: {
        Authorization: 'Bearer ' + personalInfo.token
      }
    })
      .then(res => {
        if (currentTab === 0) {
          const { data, total_pages: totalPages, total_blogs: totalBlogs } = res.data
          this.setState({ blogs: data, loading: false, totalPages, totalBlogs })
        } else {
          const { data, total_pages: totalPages, total_blogs: totalRBlogs } = res.data

          this.setState({ blogs: data, loading: false, totalPages, totalRBlogs })
        }
      })
      .catch(err => {
        this.logError(err)
        this.setState({ loading: false })
      })
  }

  handleTabChange = (value, tab) => {
    const { elasticVal, currentTab } = this.state

    if (elasticVal.length > 0) {
      this.setState({ currentTab: tab, loading: true, currentPage: 1 }, () => {
        this.delayedCallback(elasticVal)
      })
    } else {
      this.setState({ currentTab: tab, loading: true, currentPage: 1 }, () => {
        this.getBlogs(true)
      })
    }
  }

  detachBlogFromPendingList = (blogId) => {
    const { currentTab, blogs } = this.state
    if (currentTab === 0) {
      const filteredBlogs = blogs.filter(blog => (blog.id !== blogId))
      this.setState({ blogs: filteredBlogs })
    }
  }

  handleGSelect = (data) => {
    this.setState({ selectorData: data, elasticVal: '' })
  }

  handleApplyFilter = () => {
    this.setState({ loading: true, currentPage: 1 }, () => {
      this.getBlogs(true)
    })
  }

  handleDateChange = (event) => {
    const { value } = event.target
    this.setState({ selectedDate: value, elasticVal: '' })
  }

  handlePagination = (page) => {
    const { elasticVal } = this.state
    if (elasticVal.length > 0) {
      this.setState({ currentPage: page, loading: true }, () => {
        this.delayedCallback(elasticVal)
      })
    } else {
      this.setState({ currentPage: page, loading: true }, () => {
        this.getBlogs(true)
      })
    }
  }

  clearSelection = () => {
    this.setState({ selectorData: {}, selectedDate: '', count: this.state.count + 1, currentPage: 1, loading: true }, () => {
      this.getBlogs(false)
    })
  }

  getBlogsBySearch = (query) => {
    const { currentPage, pageSize, isPublished, currentTab } = this.state
    axios.get(`${urls.SearchBlogs}?q=${query}&page_no=${currentPage}&page_size=${pageSize}&is_published=${isPublished ? 'true' : 'false'}&is_reviewed=${currentTab === 1 ? 'true' : 'false'}&is_deleted=false`, {
      headers: {
        Authorization: 'Bearer ' + this.state.personalInfo.token
      }
    })
      .then(res => {
        console.log(res)

        this.setState({ blogs: res.data.results, loading: false, totalPages: res.data.total_pages })
      })
      .catch(err => {
        console.log(err)
      })
  }

  handleElasticSearch=(event) => {
    const { value } = event.target
    const { elasticVal } = this.state

    this.setState({
      elasticVal: value
    }, () => {
      this.delayedCallback(value)
    })
  }
  getBadge = (tabLabel) => {
    let { loading, totalBlogs } = this.state

    return <Badge color='primary' badgeContent={loading ? '' : totalBlogs} max={9999}>{tabLabel}</Badge>
  }
  getReviewedBadge= (tabLabel) => {
    let { loading, totalRBlogs } = this.state

    return <Badge color='primary' badgeContent={loading ? '' : totalRBlogs} max={9999}>{tabLabel}</Badge>
  }

  render () {
    console.log(this.state.elasticVsal)
    const { blogs, loading, currentPage, totalPages, currentTab, pageSize, count, selectedDate, personalInfo } = this.state
    return (
      <div>
        <Toolbar className='student__viewblog--toolbar'>
          <div className='root_pagnation-tabs'>
            <Grid container spacing={2}>
              <Grid item xs={12} md={personalInfo.role === 'Teacher' ? 4 : 6} sm={personalInfo.role === 'Teacher' ? 4 : 6}>

                <Grid>
                  <label>Search Blog/Name/Erp/Description</label>
                  <input onChange={this.handleElasticSearch} type='text' placeholder='Search Blog...' className='blog--form-input' value={this.state.elasticVal} />
                </Grid>
              </Grid>
              <Grid item xs={12} md={4} sm={4}>
                <Grid>
                  <label>Select date</label>
                  <input
                    width='100%'
                    className='blog--form-input'
                    id='date'
                    type='date'
                    value={selectedDate}
                    onChange={this.handleDateChange}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>

                {personalInfo.role === 'Admin' || personalInfo.role === 'Blog Admin' || personalInfo.role === 'Subjecthead' || personalInfo.role === 'Teacher' || personalInfo.role === 'Principal' || personalInfo.role === 'Planner' || personalInfo.role === 'AcademicCoordinator'
                  ? <Grid item xs={12} md={2} sm={2} style={{ display: 'contents' }}>
                    <Grid style={{ padding: '20px', position: 'relative' }}>
                      <RouterButton style={{ position: 'absolute', right: -150, top: 20 }} value={viewPublishedBlogs} variant='contained' color='primary' />
                    </Grid>
                  </Grid> : ''}

                {personalInfo.role === 'Admin' || personalInfo.role === 'Blog Admin' || personalInfo.role === 'Subjecthead' || personalInfo.role === 'Teacher' || personalInfo.role === 'Principal' || personalInfo.role === 'Planner' || personalInfo.role === 'AcademicCoordinator'
                  ? <Grid item xs={12} md={2} sm={2} style={{ display: 'contents' }}>
                    <Grid style={{ padding: '20px', position: 'relative' }}>
                      <RouterButton style={{ position: 'absolute', right: -150, top: 20 }} value={viewDashboard} variant='contained' color='primary' />
                    </Grid>
                  </Grid> : ''}
              </Grid>

              <Grid item xs={12} md={2} sm={2} style={{ display: 'contents' }}>
                <Grid style={{ padding: '10px', position: 'relative' }}>
                  <GSelect key={count} config={COMBINATIONS} variant={'filter'} onChange={this.handleGSelect} />
                  <Button style={{ position: 'absolute', right: -150, top: 20 }} onClick={this.handleApplyFilter} variant='contained' color='primary' >Apply Filter</Button>
                  <Button
                    style={{ position: 'absolute', right: -250, top: 20 }}
                    onClick={this.clearSelection}
                    variant='outlined'
                    color='primary'
                    size='small'
                  >
                    <ClearIcon />
            Clear
                  </Button>
                </Grid>

              </Grid>

            </Grid>
          </div>
        </Toolbar>
        <hr />
        <div className='root_pagnation-tabs2'>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Grid>
                <Tabs value={currentTab} onChange={this.handleTabChange} aria-label='simple tabs example'>
                  <Tab label={this.getBadge('Pending Review')}
                  />
                  <Tab label={this.getReviewedBadge('Reviewed')} />

                </Tabs>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid>
                <Pagination
                  rowsPerPageOptions={[]}
                  labelRowsPerPage={''}
                  page={currentPage - 1}
                  rowsPerPage={pageSize}
                  count={(totalPages * pageSize)}
                  onChangePage={(e, i) => {
                    this.handlePagination(i + 1)
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </div>

        <div className='blog_tab'>
          {
            loading
              ? <InternalPageStatus label='Loading Blogs...' loader />
              : <React.Fragment>
                {
                  <Grid container spacing={2}>
                    { blogs && blogs.length
                      ? blogs.map((blog) => {
                        return <Grid item xs={12} sm={6} md={4}>
                          <ReviewerBlogs alert={this.props.alert} currentTab={currentTab} detachBlog={this.detachBlogFromPendingList} key={blog.id} {...blog} />
                        </Grid>
                      })
                      : <InternalPageStatus label='No Blogs Found' loader={false} />
                    }
                  </Grid>
                }
              </React.Fragment>
          }
        </div>
      </div>
    )
  }
}

export default ReviewerViewBLog
