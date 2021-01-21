import React, { Component } from 'react'
import { Grid, Form, Input } from 'semantic-ui-react'
// import TextField from '@material-ui/core/TextField'
import withStyles from '@material-ui/core/styles/withStyles'
import { Button } from '@material-ui/core/'

import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import '../css/staff.css'
import { urls } from '../../urls'
import { apiActions } from '../../_actions'
// import { OmsSelect } from '../../ui'
import GSelect from '../../_components/globalselector'
import { COMBINATIONS } from './gsCombination'
// import { FormGroup } from '@material-ui/core'
// import { listGradeCategoryId } from '../../_reducers/listGradeCategoryId.reducer'

const styles = theme => ({
  inputBox: {
    input: {
      minWidth: 60
    }
  }
})
class AddChapter extends Component {
  constructor () {
    super()
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.state = {
      subjectsArr: [],
      gradeArr: [],
      checkedA: false

    }
    // this.changehandlergrade = this.changehandlergrade.bind(this)
    this.handleSubject = this.handleSubject.bind(this)
    this.handleChapter = this.handleChapter.bind(this)
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
  }

  componentDidMount = () => {
    this.role = this.userProfile.personal_info.role
    console.log(this.role)
    if (this.role === 'Admin') {
    }

    // this.props.listGrades()
    // this.mappindDetails = this.userProfile.academic_profile
    // this.role = this.userProfile.personal_info.role
    // if (this.role === 'Teacher' || this.role === 'Reviewer' || this.role === 'Subjecthead') {
    //   let mappedSubjectsArr = []
    //   let map = new Map()
    //   for (const item of this.mappindDetails) {
    //     // if (!map.has(item.subject_id)) {
    //     map.set(item.subject_id, true) // set any value to Map
    //     mappedSubjectsArr.push({
    //       ...item,
    //       value: item.subject_id,
    //       label: item.subject_name
    //     })
    //     // }
    //   }
    //   this.setState({ mappedSubjectsArr })
    // }
    // if (this.role === 'Teacher' || this.role === 'Reviewer' || this.role === 'Subjecthead') {
    //   let gradeData = []
    //   let map = new Map()
    //   for (const item of this.mappindDetails) {
    //     if (!map.has(item.grade_id)) {
    //       map.set(item.grade_id, true) // set any value to Map
    //       gradeData.push({
    //         value: item.grade_id,
    //         label: item.grade_name
    //       })
    //     }
    //   }
    //   this.setState({ gradeData: gradeData })
    // }
  }

  handleSubject = e => {
    console.log(e, 'subjectttttttttttttttttt')
    this.setState({ subjectId: e.value, valueSubject: e })
  }

  handleChapter = (e) => {
    this.setState({ chapterName: e.target.value })
  }

  handleSave = (e) => {
    console.log(this.state)
    let payLoad = { chapter_name: this.state.chapterName, grade: this.state.selectorData.grade_id, subject: this.state.selectorData.subject_id, is_academic: this.state.checkedA }
    console.log(JSON.stringify(this.state))
    axios
      .post(urls.Chapter, JSON.stringify(payLoad), {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })

      .then(res => {
        console.log(res)
        this.props.alert.success(res.data.Data)
        console.clear()
        console.log(this.state)
        this.setState({ valueGrade: {}, valueSubject: {}, chapterName: '' }, () => { console.log(this.state) })
      })
      .catch(error => {
        console.log(error)
        this.props.alert.error(
          'This chapter is already exist'
        )
      })
  }
  handleChange = name => event => {
    this.setState({ [name]: event.target.checked })
  }

  onChange = (data) => {
    let { selectorData } = this.state
    console.log(selectorData, data)
    this.setState({ selectorData: data })
  }

  render () {
    let { classes } = this.props
    let { chapterName, selectorData } = this.state
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSave} style={{ paddingLeft: '30px' }} className='form'>
          <Grid container>
            <Grid.Row>
              <Grid.Column
                className='student-section-inputField'
              >
                <GSelect variant={'selector'} config={COMBINATIONS} onChange={this.onChange} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid.Row>
            <Grid.Column
              computer={5}
              mobile={16}
              tablet={5}
              className='student-section-inputField'
            >
              <Form.Group>
                <Form.Field >
                  <label>
                Chapter<sup>*</sup>
                  </label>
                  <Input
                    className={classes.inputBox}
                    placeholder='Enter Chapter'
                    onChange={this.handleChapter}
                    value={this.state.chapterName}
                    required
                  />
                </Form.Field>
              </Form.Group>
              {this.role === 'Admin' && <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.checkedA}
                    onChange={this.handleChange('checkedA')}
                    value='checkedA'
                    inputProps={{
                      'aria-label': 'primary checkbox'
                    }}
                  />
                }
                label='is Academic'
              />}

              <Form.Group style={{ padding: '20px 5px' }}>
                <Button type='submit' color='green' disabled={!chapterName || !selectorData.subject_id || !selectorData.grade_id}>
              Save
                </Button>

                <Button
                  primary
                  onClick={this.props.history.goBack}
                  type='button'
                >
              Return
                </Button>
              </Form.Group>
            </Grid.Column>
          </Grid.Row>
        </Form>
      </React.Fragment>
    // </Grid.Column>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  subjects: state.subjects.items,
  grades: state.grades.items
})

const mapDispatchToProps = dispatch => ({
  listGrades: () => dispatch(apiActions.listGrades()),
  listSubjects: gradeId => dispatch(apiActions.listSubjects(gradeId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(AddChapter)))
