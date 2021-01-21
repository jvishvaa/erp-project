import React, { Component } from 'react'
import {
  Form,
  Button
  //   Grid

} from 'semantic-ui-react'
import axios from 'axios'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import { urls, qBUrls } from '../../urls'
import { OmsSelect } from '../../ui'
import GSelect from '../../_components/globalselector'
import { COMBINATIONS } from './config/questionCountConfig'
import { apiActions } from '../../_actions'

class QuestionCount extends Component {
  constructor (props) {
    super(props)
    this.state = {
      questionLevel: [],
      selectedQuestionLevel: [],
      selectorData: [],
      page: 1,
      pageSize: 5

    }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.role = this.userProfile.personal_info.role
    this.getCount = this.getCount.bind(this)
    this.downloadExcel = this.downloadExcel.bind(this)
  }

  componentDidMount () {
    axios
      .get(qBUrls.QuestionLevel, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log('Qustn level: ', res.data)
        if (Array.isArray(res.data)) {
          let qLvl = []
          for (let i = 0; i < res.data.length; i++) {
            qLvl[i] = { ...res.data[i], label: res.data[i].question_level }
          }
          this.setState({ questionLevel: qLvl })
        }
        if (typeof res.data === 'string') {
          console.log(res.data)
        }
      })
      .catch(error => {
        console.log("Error: Couldn't fetch data from " + qBUrls.QuestionLevel)
        console.log(error)
      })
  }
  fetchData = (state, instance) => {
    console.log(state, instance)
    this.setState({ loading: true })
    if (this.role === 'Admin') {
      this.getCount(state)
    } else {
      this.getCount(state)
    }
  }

  downloadExcel = () => {
    // let url = urls.QuestionCountExcelDownload
    if (this.role === 'Admin' || this.role === 'Principal' || this.role === 'AcademicCoordinator') {
      let gradeId = this.state.selectorData.grade_id
      let subjectId = this.state.selectorData.subject_id
      let levelData = this.state.selectedQuestionLevel.value
      axios.get(`${urls.QuestionCountExcelDownload}?grade_id=${gradeId}&subject_id=${subjectId}&level=${levelData}`, {
        responseType: 'arraybuffer',
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })

        .then(res => {
          var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          var link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = 'question_count_excel_report.xls'
          link.click()
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      let gradeId = this.state.selectorData.grade_id
      let subjectId = this.state.selectorData.subject_id
      let levelData = this.state.selectedQuestionLevel.value
      let branchId = this.state.selectorData.branch_id
      axios.get(`${urls.QuestionCountExcelDownload}?branch_id=${branchId}&grade_id=${gradeId}&subject_id=${subjectId}&level=${levelData}`, {
        responseType: 'arraybuffer',
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          var link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = 'question_count_excel_report.xls'
          link.click()
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  getCount = (state, pageSize) => {
    let url = urls.QuestionCount

    console.log(this.state.selectorData.grade_id)
    if (this.role === 'Admin' || this.role === 'Principal' || this.role === 'AcademicCoordinator') {
      pageSize = pageSize || this.state.pageSize

      axios
        .get(url, {
          params: {
            subject_id: this.state.selectorData.subject_id,
            grade_id: this.state.selectorData.grade_id,
            level: this.state.selectedQuestionLevel.value,
            page: state && state.page ? state.page + 1 : 1,
            page_size: pageSize

          },
          headers: {
            'Authorization': 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          this.setState({ quesCount: res.data.results,
            pages: res.data.total_pages,
            page: res.data.page })
        })
        .catch(error => {
          console.log(error)
        })
    } else {
      pageSize = pageSize || this.state.pageSize

      axios
        .get(url, {
          params: {
            subject_id: this.state.selectorData.subject_id,
            grade_id: this.state.selectorData.grade_id,
            level: this.state.selectedQuestionLevel.value,
            branch_id: this.state.selectorData.branch_id,
            page: state && state.page ? state.page + 1 : 1,
            page_size: pageSize

          },
          headers: {
            'Authorization': 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          this.setState({ quesCount: res.data.results,
            pages: res.data.total_pages,
            page: res.data.page })
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
  onChange = (data) => {
    console.log(data)
    this.setState({ selectorData: data })
  }
  render () {
    let { quesCount } = this.state
    console.log(quesCount, 'qu')
    const adminColumns = [
      {
        Header: 'Grade',
        accessor: 'Grade'
      },
      {
        Header: 'Subject',
        accessor: 'subject'
      },
      {
        Header: 'Chapter',
        accessor: 'chapter'
      },
      {
        Header: 'Published Count',
        accessor: 'published_count'
      },
      {
        Header: 'Draft Count',
        accessor: 'draft_count'
      },
      {
        Header: 'Total Count',
        accessor: 'total_count'
      }
    ]
    const otherRoleColumns = [{
      Header: 'Name',
      accessor: 'Name'
    },
    {
      Header: 'Role',
      accessor: 'Role'
    }, {
      Header: 'Grade',
      accessor: 'Grade'
    },
    {
      Header: 'Subject',
      accessor: 'subject'
    },
    {
      Header: 'Chapter',
      accessor: 'chapter'
    },
    {
      Header: 'Published Count',
      accessor: 'published_count'
    },
    {
      Header: 'Draft Count',
      accessor: 'draft_count'
    },
    {
      Header: 'Total Count',
      accessor: 'total_count'
    }]

    return (
      <React.Fragment>

        <div>
          <GSelect variant={'selector'} config={COMBINATIONS} onChange={this.onChange} />

          <Form.Field required width={5}>
            <label>Question Level</label>
            <OmsSelect
              options={this.state.questionLevel}
              change={e => {
                this.setState({
                  selectedQuestionLevel: {
                    ...e,
                    value: e.id,
                    label: e.question_level
                  }
                })
              }}
            />
          </Form.Field>
          <Form.Field>
            <Button
              onClick={() => this.getCount()} >
            Get Question Count
            </Button>
            <Button variant='contained' style={{ marginTop: 16 }} color='primary' onClick={() => this.downloadExcel()}>
            Download Excel Report
            </Button>
          </Form.Field>
        </div>

        {this.role !== 'Admin'
          ? <ReactTable
            style={{ fontFamily: 'Arial', fontSize: '1.15rem', fontWeight: 'bold' }}
            manual
            onFetchData={this.fetchData}

            data={quesCount}
            defaultPageSize={5}
            showPageSizeOptions={false}
            pages={this.state.pages}
            pageSize={this.state.pageSize}
            page={this.state.page - 1}
            columns={otherRoleColumns}
          />
          : <ReactTable
            style={{ fontFamily: 'Arial', fontSize: '1.15rem', fontWeight: 'bold' }}
            manual

            onFetchData={this.fetchData}

            data={quesCount}
            defaultPageSize={5}
            showPageSizeOptions={false}
            pages={this.state.pages}
            pageSize={this.state.pageSize}
            page={this.state.page - 1}
            columns={adminColumns}
          />}
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => ({
  grades: state.gradeMap.items,
  subjects: state.subjects.items,
  user: state.authentication.user
})

const mapDispatchToProps = dispatch => ({
  listGrades: dispatch(apiActions.listGrades()),
  listSubjects: dispatch(apiActions.listSubjects()),
  listBranches: dispatch(apiActions.listBranches())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionCount)
