import React from 'react'

import { Toolbar, Grid, Button, TextField, Tooltip, Switch, Tab, Tabs } from '@material-ui/core'
import axios from 'axios'
import _ from 'lodash'
import { InternalPageStatus, Pagination, RouterButton } from '../../../ui'
import Blog from './blog'
import '../blog.css'
import { urls } from '../../../urls'

const viewPublishedBlogs = {
  label: 'Published Blogs',
  color: 'blue',
  href: 'publishedBlogs',
  disabled: false
}

class StudentViewBlog extends React.Component {
  constructor () {
    super()
    this.state = {
      currentTab: 0,
      blogs: [],
      currentPage: 1,
      pageSize: 12,
      loading: true,
      totalPages: 0,
      selectedDate: null,
      personalInfo: JSON.parse(localStorage.getItem('user_profile')).personal_info,
      elasticVal: '',
      isDrafted: false
    }

    this.delayedCallback = _.debounce((value) => {
      if (value.length > 0) {
        this.getBlogsBySearch(value)
      } else {
        this.getBlogs(true)
      }
    }, 2000)
    this.handleSearch = this.handleSearch.bind(this)
  }

  componentDidMount () {
    this.getBlogs()
  }

  getBlogsBySearch = (query) => {
    const { currentPage, pageSize } = this.state
    console.log(currentPage)
    axios.get(`${urls.SearchBlogs}?q=${query}&page_no=${currentPage}&page_size=${pageSize}&is_published=false&is_deleted=false`, {
      headers: {
        Authorization: 'Bearer ' + this.state.personalInfo.token
      }
    })
      .then(res => {
        this.setState({ blogs: res.data.results, loading: false, totalPages: res.data.total_pages })
      })
      .catch(err => {
        console.log(err)
      })
  }

  getBlogs = (isFilter) => {
    setTimeout(() => {
      const { currentTab, currentPage, pageSize, personalInfo, selectedDate, isDrafted } = this.state
      let path = ''
      if (currentTab === 1) {
        path = `${urls.CreateBlog}?page_number=${currentPage}&is_deleted=True&page_size=${pageSize}&is_published=False&is_drafted=${isDrafted ? 'True' : ''}`
      } else {
        path = `${urls.CreateBlog}?page_number=${currentPage}&page_size=${pageSize}&is_published=False&is_drafted=${isDrafted ? 'True' : ''}`
      }
      if (isFilter) {
        if (selectedDate) {
          path += `&date=${selectedDate}`
        }
      }
      this.setState({ loading: true })
      axios.get(path, {
        headers: {
          Authorization: 'Bearer ' + personalInfo.token
        }
      })
        .then(res => {
          const { data, total_pages: totalPages } = res.data
          this.setState({ blogs: data, loading: false, totalPages: totalPages })
        })
        .catch(err => {
          this.setState({ loading: false })
          this.logError(err)
        })
    }, 2000)
  }

  handleTabChange = (event, tab) => {
    this.setState({ currentTab: tab, blogs: [] })
    this.getBlogs(true)
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

  handleDeleteBlog = (blogId) => {
    const { blogs, personalInfo } = this.state
    axios.delete(`${urls.CreateBlog}?id=${blogId}`, {
      headers: {
        Authorization: 'Bearer ' + personalInfo.token
      }
    })
      .then(res => {
        const blogsCopy = blogs
        const removeBlog = blogsCopy.filter(blog => blog.id !== blogId)
        this.setState({ blogs: removeBlog })
        this.props.alert.success('Successfully deleted the blog')
      })
      .catch(err => {
        this.logError(err)
      })
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

  handleDateChange = (event) => {
    const { value } = event.target
    this.setState({ selectedDate: value, elasticVal: '' })
  }

  handleFilterBLogs = () => {
    this.setState({ loading: true, currentPage: 1 }, () => {
      this.getBlogs(true)
    })
  }

  handleSearch = (event) => {
    const { value } = event.target
    const { elasticVal } = this.state
    this.setState({
      elasticVal: value
    }, () => {
      this.delayedCallback(value)
    }
    )
    console.log(value, 'val', elasticVal)
  }
  toggleDraft=() => {
    const { isDrafted } = this.state
    this.setState({
      isDrafted: !isDrafted,
      elasticVal: ''
    }, () => this.getBlogs(true))
  }
  render () {
    const { blogs, isDrafted, loading, currentPage, totalPages, selectedDate, pageSize, currentTab } = this.state
    return (
      <React.Fragment>
        <Toolbar className='student__viewblog--toolbar'>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={2} md={2}>
              <label className='blog--form-label'>Search Blog</label>
              <input onChange={this.handleSearch} type='text' placeholder='Search Blog...' className='blog--form-input' value={this.state.elasticVal} />
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
              <label className='blog--form-label'>Select date</label>
              <TextField
                id='date'
                // label='Select date'
                type='date'
                value={selectedDate}
                onChange={this.handleDateChange}
                InputLabelProps={{
                  shrink: true
                }}
                style={{ width: '50%' }}
              />

            </Grid>

            <Grid item xs={6} sm={1} md={1} style={{ 'margin-left': '-10%', 'margin-right': '4%' }}>
              <label className='blog--form-label--draft'>Drafted</label>

              <Tooltip title={isDrafted ? 'Drafted' : 'All'} arrow >
                <Switch

                  className='blog--form-switch'
                  checked={isDrafted}
                  onChange={this.toggleDraft}
                  name='checkedB'
                  color='primary'
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={2} md={2}>
              <Button color='primary' variant='contained' style={{ marginTop: 10 }} onClick={this.handleFilterBLogs} >
                Apply Filter
              </Button>

            </Grid>
            <Grid item xs={12} md={2} sm={2} style={{ display: 'contents' }}>
              <Grid style={{ padding: '13px', position: 'relative' }}>
                <RouterButton style={{ position: 'absolute', right: -80, top: 10 }} value={viewPublishedBlogs} variant='contained' color='primary' />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
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
            <Grid item xs={12} sm={4} md={4} style={{ paddingTop: 35 }}>
              <Tabs value={currentTab} onChange={this.handleTabChange} aria-label='simple tabs example'>
                <Tab label='My Blogs' />
                <Tab label='Deleted Blogs' />
              </Tabs>
            </Grid>

          </Grid>
        </Toolbar>
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
                          <Blog key={blog.id} {...blog} currentTab={currentTab} deleteBlog={this.handleDeleteBlog} />
                        </Grid>
                      })
                      : <InternalPageStatus label='No Blogs Found' loader={false} />
                    }
                  </Grid>
                }
              </React.Fragment>
          }
        </div>
      </React.Fragment>
    )
  }
}

export default StudentViewBlog
