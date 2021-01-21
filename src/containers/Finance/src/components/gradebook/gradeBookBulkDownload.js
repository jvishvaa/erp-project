import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Grid, Button } from '@material-ui/core'
import { Toolbar, OmsSelect } from '../../ui'
import { urls } from '../../urls'
import { apiActions } from '../../_actions'

class GradebookDownload extends Component {
  constructor () {
    super()
    this.state = {
      termList: [],
      selectedTermId: '',
      selectedGradeBookId: ''

    }
  }

  componentDidMount () {
    this.getTerms()
      .then(result => { this.setState({ termList: result.data }) })
      .catch(err => { console.log(err) })
  }

  getTerms = async () => {
    let res = await axios.get(urls.AcademicTerms, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
    return res
  }

  handleTabChange = (data, e) => {
    // this.setState({ selectedValue: e.label })
    this.setState({ currentTab: data.value, selectedData: {}, selectedValue: data.label })
  }
  handleTermChange = (data, e) => {
    this.setState({ selectedTermId: e.value })
    this.setState({ showSelectors: true, selectedTermId: data.value }, () => {
    })
  }
  handleAcademicYear = e => {
    this.setState({ acadId: e.value })
  }
  bulkDownload=() => {
    let { selectedValue, selectedTermId, acadId } = this.state
    let path = urls.BulkDownloadRecords + '?'
    path += selectedTermId ? `t_id=${selectedTermId}&` : ''
    path += selectedValue ? `type=${selectedValue}&` : ''
    path += acadId ? `session_year=${acadId}&` : ''

    this.setState({ downloading: true })
    axios.get(path, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(res => {
        console.log(res)
        let { file_path: filePath } = res.data
        if (filePath) {
          let anchorTag = document.createElement('a')
          anchorTag.href = urls.MEDIA_BASE + filePath
          anchorTag.click()
        }
        this.setState({ downloading: false })
      })
      .catch(error => {
        this.setState({ downloading: false })
        console.log(error)
      })
  }
  render () {
    console.log(this.state.res)
    const { termList } = this.state
    let gradebookTypes = [{ label: 'Scholastic', value: 0 }, { label: 'CoScholastic', value: 1 }, { label: 'Teacher Remark & Attendance', value: 2 }, { label: 'Theatre', value: 3 }, { label: 'Competition', value: 4 }]
    return (
      <div>
        <Toolbar style={{ padding: 0, boxSizing: 'border-box' }}>
          <Grid container>
            <Grid>
              <OmsSelect
                label={'Academic Year'}
                options={
                  this.props.session
                    ? this.props.session.session_year.map(
                      session => ({
                        value: session,
                        label: session
                      })
                    )
                    : null
                }
                change={this.handleAcademicYear}
              />
            </Grid>
            <Grid>
              <OmsSelect
                label={'Term'}
                options={termList.map((term) => {
                  return { label: term.term, value: term.id }
                })}
                change={this.handleTermChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <OmsSelect
                label='GradeBook Type'
                placeholder='Select'
                options={
                  gradebookTypes.map((gradebook) => {
                    return { label: gradebook.label, value: gradebook.value }
                  })
                }
                change={this.handleTabChange}
              />

            </Grid>
            <Button disabled={this.state.downloading} onClick={this.bulkDownload}>{this.state.downloading ? 'Downloading...' : 'Download'}</Button>

          </Grid>
        </Toolbar>

      </div>

    )
  }
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  session: state.academicSession.items

})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions())

})

export default connect(mapStateToProps, mapDispatchToProps)(GradebookDownload)
