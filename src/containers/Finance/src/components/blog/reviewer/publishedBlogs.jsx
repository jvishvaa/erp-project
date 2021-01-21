import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Grid, Tabs, Tab, Button } from '@material-ui/core'
import { InternalPageStatus, Pagination } from '../../../ui'
import ReviewerBlogs from './ReviewerBlog'

import { urls } from '../../../urls'
import '../blog.css'

class PublishedBlogs extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentPage: 1,
      pageSize: 12,
      totalPages: 0,
      blogs: [],
      acrossOrchids: 'across_orchids',
      acrossBranch: 'across_branch',
      acrossGrade: 'across_grade',
      acrossSection: 'across_section',
      currentTabPub: 0,
      personalInfo: JSON.parse(localStorage.getItem('user_profile')).personal_info,
      role: JSON.parse(localStorage.getItem('user_profile')).personal_info.role,

      loading: true,
      mobileView: ''
    }
    this.updatedId = []
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
  }
  componentDidMount () {
    this.getPubBlogs()
    this.setState({
      mobileView: window.screen.width
    })
  }
  handlePagination = (page) => {
    this.setState({ currentPage: page, loading: true }, () => {
      this.getPubBlogs()
    })
  }
  getPubBlogs = () => {
    const { currentPage, pageSize, personalInfo, currentTabPub, acrossOrchids, acrossBranch, acrossGrade, acrossSection } = this.state
    let path = `${urls.CreateBlog}?page_number=${currentPage}&page_size=${pageSize}`
    if (currentTabPub === 0) {
      path += `&publish_across=${acrossOrchids}`
    } else if (currentTabPub === 1) {
      path += `&publish_across=${acrossBranch}`
    } else if (currentTabPub === 2) {
      path += `&publish_across=${acrossGrade}`
    } else if (currentTabPub === 3) {
      path += `&publish_across=${acrossSection}`
    }

    axios.get(path, {
      headers: {
        Authorization: 'Bearer ' + personalInfo.token
      }
    })
      .then(res => {
        if (currentTabPub === 0) {
          const { data, total_pages: totalPages, total_blogs: totalBlogs } = res.data
          this.setState({ blogs: data, loading: false, totalPages, totalBlogs })
        } else {
          const { data, total_pages: totalPages, total_blogs: totalRBlogs } = res.data

          this.setState({ blogs: data, loading: false, totalPages, totalRBlogs })
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({ loading: false })
      })
  }

  handleTabChange = (event, value) => {
    this.setState({ loading: true, currentPage: 1, currentTabPub: value, blogs: [] }, () => {
      this.getPubBlogs()
    })
  }

  detachBlogFromPendingList = (blogId) => {
    const { currentTabPub, blogs } = this.state
    if (currentTabPub === 0) {
      const filteredBlogs = blogs.filter(blog => (blog.id !== blogId))
      this.setState({ blogs: filteredBlogs })
    }
  }

  render () {
    let { role, pageSize, currentPage, totalPages, currentTabPub, loading, blogs, mobileView } = this.state

    return (
      <React.Fragment>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid>
              <Tabs value={currentTabPub} indicatorColor='primary'
                variant={mobileView < 1024 ? 'scrollable' : 'fullWidth'}
                scrollButtons={mobileView < 1024 ? 'on' : 'off'}

                textColor='primary'
                onChange={this.handleTabChange} aria-label='simple tabs example'>

                <Tab label='Across Orchids'

                />
                {role === 'Student' ? <Tab label='My Branch'

                /> : <Tab label='Across Branch'

                />}
                {role === 'Student' ? <Tab label='My Grade'

                /> : <Tab label='Across Grade'
                />}
                {role === 'Student' ? <Tab label='My Section'

                />
                  : <Tab label='Across Section' />
                }

              </Tabs>
            </Grid>
          </Grid>

          <Grid item xs={3}>
            <div style={{ padding: '10px' }} >
              <Button
                style={{ marginTop: 10 }}
                variant='contained'
                color='primary'
                onClick={this.props.history.goBack}
              > BACK </Button>
            </div>
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
          <div className='blog_tab'>
            {
              loading
                ? mobileView < 1024 ? <InternalPageStatus label='Loading Blogs...' loader />
                  : <h6 style={{ 'margin-left': '-403px' }}>
                    <InternalPageStatus label='Loading Blogs...' loader />
                  </h6>
                : <React.Fragment>
                  {
                    <Grid container spacing={2}>
                      { blogs && blogs.length
                        ? blogs.map((blog) => {
                          return <Grid item xs={12} sm={6} md={4}>
                            <ReviewerBlogs alert={this.props.alert} getPubBlogs={this.getPubBlogs} currentTabPub={currentTabPub} detachBlog={this.detachBlogFromPendingList} key={blog.id} {...blog} />
                          </Grid>
                        })
                        : mobileView < 1024 ? <InternalPageStatus label='No Blogs Found' loader={false} />
                          : <h6 style={{ 'margin-left': '-403px' }}>
                            <InternalPageStatus label='No Blogs Found' loader={false} />

                          </h6>
                      }
                    </Grid>
                  }
                </React.Fragment>
            }
          </div>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

const mapDispatchToProps = dispatch => ({
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PublishedBlogs))
