import React, { Component, Fragment } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { urls } from '../../../urls'
import { Pagination } from '../../../ui'
import StudentTestsUi from './StudentTestUi'

class StudentTests extends Component {
  constructor (props) {
    super(props)
    this.state = {
      onlineTests: [],
      currentPage: 1,
      totalPageCount: 0,
      rowsPerPage: 10
    }
  }
getTests= () => {
  const userProfile = JSON.parse(localStorage.getItem('user_profile'))
  this.sectionMappingId = userProfile.section_mapping_id
  const { role, token } = userProfile.personal_info
  this.role = role
  this.setState({ loading: true }, () => {
    axios.get(`${urls.StudentTest}?section_mapping_id=${this.sectionMappingId}&get_status=True&page_number=${this.state.currentPage}&page_size=${this.state.rowsPerPage}&onlinetest_type=Normal`, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log(res)
        this.setState({ onlineTests: res.data.data,
          totalPageCount: res.data.page_details.total_page_count,
          loading: false })
      })
      .catch(e => {
        console.log(e)
        this.setState({ loading: false })
      })
  })
}
componentDidMount () {
  this.getTests()
}

  handlePagination = (e, page) => {
    console.log()
    this.setState({ currentPage: page + 1 }, this.getTests)
  }

  setTestsPerPage = ({ target: { value } }) => {
    this.setState({ rowsPerPage: value }, this.getTests)
  }

  render () {
    const { onlineTests, rowsPerPage, totalPageCount, currentPage, loading } = this.state
    return <Fragment>
      <StudentTestsUi tests={onlineTests} loading={loading} />
      <div style={{ padding: 20, bottom: 20, right: 0, position: 'fixed' }}>
        <Pagination
          rowsPerPageOptions={[10, 20]}
          labelRowsPerPage={'Tests per page'}
          page={currentPage - 1}
          rowsPerPage={rowsPerPage}
          count={totalPageCount}
          onChangePage={this.handlePagination}
          onChangeRowsPerPage={this.setTestsPerPage}
        />
      </div>
    </Fragment>
  }
}

export default (withRouter(StudentTests))
