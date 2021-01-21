import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import FormControlLabel from '@material-ui/core/FormControlLabel'

import { Grid } from 'semantic-ui-react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton/IconButton'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import Checkbox from '@material-ui/core/Checkbox'

import GSelect from '../../_components/globalselector'
import { COMBINATIONS } from './gsCombination'
import { urls } from '../../urls'
import { apiActions } from '../../_actions'

class ViewChapter extends Component {
  constructor (props) {
    super(props)

    this.state = {
      chapterData: ''
    }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))

    this.role = this.userProfile.personal_info.role
  }

  getChapters = (gradeId, subjectId) => {
    let url = ''
    if (this.state.checkedA) {
      url = urls.Chapter + '?subject_id=' + subjectId + '&grade_id=' + gradeId + '&is_academic=' + this.state.checkedA
    } else {
      url = urls.Chapter + '?subject_id=' + subjectId + '&grade_id=' + gradeId
    }
    axios.get(url)
      .then(res => {
        console.log(res)
        if (typeof res.data === 'object' && res.data.length) {
          this.setState({ chapterData: res.data })
        } else {
          this.setState({ chapterData: '' })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  deleteHandler = (id) => {
    axios.delete(`${urls.Chapter}` + String(id) + '/', {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        this.props.alert.success('Chapter deleted')
        // this.setState({ loading: true })
        this.getChapters(this.state.selectorData.grade_id, this.state.selectorData.subject_id)
        console.log(this.state.selectorData)
      })
      .catch(error => {
        console.log(error)
      })
  }
  onChange = (data) => {
    console.log(data)
    this.setState({ selectorData: data })
    if (data.grade_id && data.subject_id) {
      this.getChapters(data.grade_id, data.subject_id)
    } else {
      this.setState({ chapterData: '' })
    }
  }
  handleChange = name => event => {
    this.setState({ [name]: event.target.checked })
  }
  render () {
    console.log(this.role, 'role')
    const { chapterData } = this.state
    const chapterList = chapterData.length ? chapterData.map(chapter => {
      return (
        <Grid.Column
          computer={4}
          mobile={16}
          tablet={6}
          style={{ marginTop: 10 }}
          key={chapter.id}
        >
          <Card>
            <CardContent>
              <Typography
                variant={'caption'}
                gutterBottom
              >
            Chapter Name
              </Typography>
              <Typography variant={'h6'}>
                {chapter.chapter_name}
                {
                  this.role === 'Admin'
                    ? <IconButton aria-label='Delete'>
                      <DeleteIcon style={{ margin: 'auto' }}fontSize='small'
                        onClick={(e) => {
                          this.deleteHandler(chapter.id)
                        }} />
                    </IconButton> : ''
                }

              </Typography>
            </CardContent>
          </Card>
        </Grid.Column>
      )
    }) : (
      <h1>No Chapters</h1>
    )
    return (
      <React.Fragment>

        <Grid container>
          <Grid.Row>
            <FormControlLabel
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
            />
            <GSelect variant={'selector'} config={COMBINATIONS} onChange={this.onChange} />

          </Grid.Row>
        </Grid>
        <Grid container>
          <Grid.Row>
            {chapterList}
          </Grid.Row>
        </Grid>
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user

})
const mapDispatchToProps = dispatch => ({
  loadBranches: dispatch(apiActions.listBranches()),
  listClassGroupType: dispatch(apiActions.listClassGroupType()),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewChapter)
