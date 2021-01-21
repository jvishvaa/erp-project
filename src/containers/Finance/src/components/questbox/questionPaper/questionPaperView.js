import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import axios from 'axios'
import { urls } from '../../../urls'

class viewQuestionPapers extends React.Component {
  constructor () {
    super()
    // this.props = props
    this.state = {

    }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
  }
  componentDidMount () {
    this.getTypesAndSubTypes()
  }
  getTypesAndSubTypes = (state, pageSize) => {
    // let { assessmentType } = this.state
    // this.toggleloading()
    pageSize = pageSize || this.state.pageSize
    var path = urls.getTypesAndSubType
    // path += `?page_number=${state && state.page ? state.page + 1 : 1}`
    // path += `&page_size=${pageSize}`

    axios.get(path, {
      headers: {
        'Authorization': 'Bearer ' + this.props.user
      }
    }).then((res) => {
      console.log(res, 'ressss')
      if (res.status === 200) {
        this.setState({ getData: res.data
          // pageIndex: 0,
          // pages: res.data.total_page_count,
          // page: state.page + 1
        }
        // , () => this.toggleloading()
        )
        console.log(res.data, 'data')
      }
    })
      .catch((error) => {
        console.log(error)
      })
  };
  render () {
    console.log(this.state.getData)
    return (
      <React.Fragment>
        <ReactTable
          manual
          data={this.state.getData}
          defaultPageSize={5}
          showPageSizeOptions={false}
          columns={[
            {
              Header: 'Question Paper Type',
              accessor: 'question_paper_type.question_paper_type'
            },
            {
              Header: 'Question Paper Sub Type',
              accessor: 'question_paper_sub_type'
            }
          ]}
        />
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user
})
export default connect(
  mapStateToProps
)(withRouter(viewQuestionPapers))
