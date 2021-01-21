import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import ReactTable from 'react-table'
import axios from 'axios'
import Button from '@material-ui/core/Button'
import { COMBINATIONS } from './gSelector'
import GSelect from '../../../_components/globalselector'
import { urls } from '../../../urls'

class LatestTeacherReport extends React.Component {
  constructor () {
    super()
    this.state = {
      pageSize: 5,
      pageIndex: null,
      page: 1,
      currentPage: 1,
      selectorData: {},
      showReactTable: false,
      loading: true

    }
    this.onChange = this.onChange.bind(this)
    this.getTeacherList = this.getTeacherList.bind(this)
    this.fetchData = this.fetchData.bind(this)
  }
  fetchData = (state, instance) => {
    console.log(state, instance)
    this.getTeacherList(state)
  }
  getTeacherList (state, pageSize) {
    let url = urls.TeacherReportList
    this.setState({ showReactTable: true, loading: true }, () => {
      // let{ role } = this.state
      pageSize = pageSize || this.state.pageSize
      // let{ selectorData } = this.state
      if (Object.keys(this.state.selectorData).length > 0) {
        axios
          .get(url, {
            params: {
              page: state && state.page ? state.page + 1 : 1,
              page_size: pageSize,
              mapping_acad_branch_grade: this.state.selectorData.mapping_acad_branch_grade,
              section_mapping_id: this.state.selectorData.section_mapping_id,
              subject_mapping_id: this.state.selectorData.subject_mapping_id,
              branch_id: this.state.selectorData.branch_id,
              subject_id: this.state.selectorData.subject_id
              // ...selectorData
            },
            headers: {
              'Authorization': 'Bearer ' + this.props.user
            }
          })
          .then(res => {
            this.setState({ loading: false })
            if (res.status === 200) {
              this.setState({ teacherListData: res.data.data,
                pageIndex: 0,
                pages: res.data.total_pages,
                page: res.data.current_page,
                showReactTable: true
              })
            } else {
              this.props.alert.error('Error Occured')
            }
          })
          .catch(error => {
            this.setState({ loading: false })
            this.props.alert.error('Error Occured')
            console.log(error)
          })
      }
    })
  }

  onChange (data) {
    let { selectorData } = this.state
    console.log(selectorData, data)
    this.setState({ selectorData: { mapping_acad_branch_grade: data.acad_branch_grade_mapping_id, section_mapping_id: data.section_mapping_id, subject_mapping_id: data.subject_mapping_id, branch_id: data.branch_id, subject_id: data.subject_id } }, () => console.log(this.state.selectorData))

    // this.setState({ selectorData: data })
  }

  render () {
    return <React.Fragment>
      <Grid style={{ marginLeft: 4 }} item>
        <GSelect config={COMBINATIONS} variant={'filter'} onChange={this.onChange} />
      </Grid>
      <Grid item>
        <Button variant='contained' style={{ marginTop: 16 }} color='primary' onClick={() => this.getTeacherList(this.state.page || 1)} >
            Show Teacher List
        </Button>
      </Grid>
      {this.state.showReactTable && <ReactTable
        columns={[
          {
            Header: 'Teacher Name',
            accessor: 'teacher_name'
          },
          {
            Header: 'Erp',
            accessor: 'teacher_erp'
          },
          {
            Header: 'Grade',
            accessor: 'grade_name'
          },
          {
            Header: 'Section',
            accessor: 'section_name'
          },
          {
            Header: 'Subject',
            accessor: 'subject_name'
          },
          {
            Header: 'Chapter',
            accessor: 'chapter_name'
          },
          {
            Header: 'Updated At',
            accessor: 'updated_date'

          }

        ]}
        manual
        onFetchData={this.fetchData}
        data={this.state.teacherListData}
        loading={this.state.loading}
        defaultPageSize={5}
        showPageSizeOptions={false}
        pages={this.state.pages}
        pageSize={this.state.pageSize}
        page={this.state.page - 1}
      />}

    </React.Fragment>
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user

})
const mapDispatchToProps = dispatch => ({
})
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LatestTeacherReport))
