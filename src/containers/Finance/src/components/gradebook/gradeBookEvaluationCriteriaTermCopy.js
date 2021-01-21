import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Grid,
  Button
} from '@material-ui/core'
import axios from 'axios'
import { OmsSelect } from '../../ui'
import { urls } from '../../urls'

class GradebookEvaluationCriteriaTermCopy extends Component {
  constructor () {
    super()
    this.state = {
      termList: [],
      selectedTermId: null
    }
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
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
      handleCopyFromTermChange = (data) => {
        this.setState({ selectedFromTermId: data.value
        })
      }
      handleCopyToTermChange = (data) => {
        this.setState({ selectedToTermId: data.value
        })
      }

      handleSubmit = () => {
        if (!this.state.selectedToTermId || !this.state.selectedFromTermId) {
          this.props.alert.warning('Select All fields')
          return
        }
        let path = ''
        path += `?copy_from_term_id=${this.state.selectedFromTermId}&copy_to_term_id=${this.state.selectedToTermId}`

        axios.get(`${urls.GRADEBOOKEVALUATIONTERMCOPY}${path}`, {
          headers: {
            'Authorization': 'Bearer ' + this.props.user,
            'Content-Type': 'multipart/formData'
          }

        })
          .then(res => {
            if (res.status === 200) {
              this.props.alert.success('GradeBookEvaluation Copied Successfully')
            } else {
              this.props.alert.error('Error Occured')
            }
          })
          .catch(error => {
            this.props.alert.error('Error Occured')
            console.log(error)
          })
      }

      render () {
        console.log(this.state.termList)
        let termListCopy = this.state.termList.filter(term => {
          return term.id !== this.state.selectedFromTermId
        })
        return (
          <React.Fragment>

            <Grid container>
              <Grid item style={{ padding: '10px' }}>
                <OmsSelect
                  label={' Copy From Term'}
                  options={this.state.termList.map((term) => {
                    return { label: term.term, value: term.id, locked: term.locked }
                  })}
                  change={this.handleCopyFromTermChange}
                />
              </Grid>
              <Grid item style={{ padding: '10px' }}>
                <OmsSelect
                  label={' Copy To Term'}
                  options={termListCopy.map((term) => {
                    return { label: term.term, value: term.id, locked: term.locked }
                  })}
                  change={this.handleCopyToTermChange}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item style={{ padding: '10px' }} >
                <Button
                  style={{ marginTop: '25px',
                    marginRight: '25px' }}
                  variant='contained'
                  color='primary'
                  onClick={this.handleSubmit}
                >
                  COPY
                </Button>&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;

                <Button
                  style={{ marginTop: '25px',
                    marginRight: '25px' }}
                  variant='contained'
                  colorInherit
                  color='primary'
                  onClick={this.props.history.goBack}
                >
                  Return
                </Button>

              </Grid>
            </Grid>
          </React.Fragment>

        )
      }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(
  mapStateToProps
)(withRouter(GradebookEvaluationCriteriaTermCopy))
