import React from 'react'
// import { Grid } from '@material-ui/core'
import { Button, withStyles, Grid } from '@material-ui/core'
import axios from 'axios'
import CreatableSelect from 'react-select/lib/Creatable'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { urls } from '../../../urls'

// import { OmsSelect } from '../../../ui'

const styles = theme => ({
  root: {
    width: '90%'
  },
  padding: {
    padding: `0 ${theme.spacing.unit * 4}px`
  },
  button: {
    marginRight: theme.spacing.unit
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  floatRight: {
    // float: 'right'
  }
})
class addQuestionPaper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      questionPaperTypes: [],
      questionPaperSubTypes: []

    }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    this.sumbitTypesAndSubTypes = this.sumbitTypesAndSubTypes.bind(this)
    this.sumbitTypes = this.sumbitTypes.bind(this)
  }
  componentDidMount () {
    axios
      .get(urls.QuestionPaperType, {
        headers: {
          Authorization: 'Bearer ' + this.props.token
        }
      })
      .then(res => {
        const questionPapersType = res.data.map(qpt => {
          return {
            value: qpt.question_paper_type,
            label: qpt.question_paper_type
          }
        })
        this.setState({ questionPaperTypes: questionPapersType })
      })
      .catch((error) => {
        console.log(error)
      })
  }
  // handleQuestionPaperType = ({ value, label }) => {
  //   let { questionPaperTypelabel } = this.state
  //   console.log(value, label)
  //   this.setState({ questionPaperType: value, questionPaperTypeName: { value: value, label: label }, questionPaperTypelabel: label, questionPaperSubTypes: [], questionPaperSubtypelabel: '' })
  //   console.log(this.state.questionPaperType, this.state.questionPaperTypeName)
  //   axios.get(urls.typesAndSubTypes + '?type_id=' + questionPaperTypelabel.label + '&qp_type=' + 'type', {
  //     headers: {
  //       Authorization: 'Bearer ' + this.props.token
  //     }
  //   })
  //     .then(res => {
  //       const subtypesArr = res.data.map(qpst => {
  //         return {
  //           key: `${qpst.question_paper_type_id}`,
  //           value: qpst.question_paper_type_id,
  //           label: qpst.question_paper_sub_type_name
  //         }
  //       })
  //       this.setState({ questionPaperSubTypes: subtypesArr })
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //     })
  // }
  getQuestionTypesAndSubTypes = (option, value) => {
    let{ questionPaperTypelabel } = this.state
    // eslint-disable-next-line no-debugger
    // debugger
    let path = ''
    if (option === 'type') {
      path += `type_id=${questionPaperTypelabel.value}&qp_type=${'type'}`
    } else if (option === 'subType') {
      path += `type_id=${questionPaperTypelabel.value}&qp_type=${'type'}`
    }

    axios.get(`${urls.typesAndSubTypes}?${path}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        // eslint-disable-next-line camelcase
        const { question_paper_sub_type = [] } = res.data
        this.setState({ offlineSubTypes: question_paper_sub_type.map(item => {
          return {
            value: item.question_paper_sub_type,
            label: item.question_paper_sub_type
          }
        })
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
  sumbitTypes () {
    let { questionPaperTypelabel, questionPaperSubtypelabel } = this.state
    console.log(this.state, 'this.styate')
    if (this.state.questionPaperTypelabel && !this.state.questionPaperSubtypelabel) {
      let obj1 = {
      // qp_type: 'type',
        question_paper_type: questionPaperTypelabel.label
        // question_paper_sub_type: questionPaperSubtypelabel.label

      }
      axios
        .post(urls.submitTypesAndSubTypes + '?qp_type=' + 'type', JSON.stringify(obj1), {
          headers: {
            'Authorization': 'Bearer ' + this.props.token,
            'Content-Type': 'application/json'

          }
        })
        .then(res => {
          if (String(res.status).startsWith(String(2))) {
            this.props.alert.success('Created')
          }
        })
        .catch(error => {
          this.props.alert.error('Error occured')
          console.log(error)
        })
    } else if (this.state.questionPaperTypelabel.label && this.state.questionPaperSubtypelabel.label) {
      let obj2 = {
      // qp_type: 'type',
        question_paper_type: questionPaperTypelabel.label,
        question_paper_sub_type: questionPaperSubtypelabel.label

      }
      axios
        .post(urls.submitTypesAndSubTypes, JSON.stringify(obj2), {
          headers: {
            'Authorization': 'Bearer ' + this.props.token,
            'Content-Type': 'application/json'

          }
        })
        .then(res => {
          if (String(res.status).startsWith(String(2))) {
            this.props.alert.success('Created')
          }
        })
        .catch(error => {
          this.props.alert.error('Error occured')
          console.log(error)
        })
    }

    // axios
    //   .post(urls.submitTypesAndSubTypes + '?qp_type=' + 'type', JSON.stringify(obj), {
    //     headers: {
    //       'Authorization': 'Bearer ' + this.props.token,
    //       'Content-Type': 'application/json'

    //     }
    //   })
    //   .then(res => {
    //     if (String(res.status).startsWith(String(2))) {
    //       this.props.alert.success('Created')
    //     }
    //   })
    //   .catch(error => {
    //     this.props.alert.error('Error occured')
    //     console.log(error)
    //   })
  }
  sumbitTypesAndSubTypes () {
    let { questionPaperTypelabel, questionPaperSubtypelabel } = this.state
    console.log(this.state, 'this.styate')

    let obj = {
      // qp_type: 'type',
      question_paper_type: questionPaperTypelabel.label,
      question_paper_sub_type: questionPaperSubtypelabel.label

    }

    axios
      .post(urls.submitTypesAndSubTypes, JSON.stringify(obj), {
        headers: {
          'Authorization': 'Bearer ' + this.props.token,
          'Content-Type': 'application/json'

        }
      })
      .then(res => {
        if (String(res.status).startsWith(String(2))) {
          this.props.alert.success('Created')
        }
      })
      .catch(error => {
        this.props.alert.error('Error occured')
        console.log(error)
      })
  }
  render () {
    let { questionPaperSubtypelabel } = this.state
    console.log(this.state.questionPaperSubtypeValue, 'sun')
    console.log(this.state.questionPaperSubTypes, 'sub1')
    console.log(this.state.questionPaperSubType, 'sub2')
    console.log(this.state.questionPaperSubtypelabel, 'label')
    console.log('Question Type' + ':' + questionPaperSubtypelabel && questionPaperSubtypelabel)
    return (
      <React.Fragment>
        {/* <Grid container direction='row' justify='center' alignItems='center' spacing={0}> */}

        {/* <Grid style={{ margin: 16 }} item >
          <label>Question Paper Type:</label>
          <CreatableSelect
            label='Question Paper Type'
            // placeholder='Select question paper'
            defaultValue={this.state.questionPaperTypeName}
            options={this.state.questionPaperTypes}
            onChange={this.handleQuestionPaperType}
          />
        </Grid> */}
        <Grid style={{ margin: 16 }} item >
          <label>Question Paper Types:</label>
          <CreatableSelect
            label='Type'
            options={this.state.questionPaperTypes}
            value={this.state.questionPaperTypelabel}

            onChange={e => {
              this.setState({
                questionPaperTypelabel: e
              }, () => this.getQuestionTypesAndSubTypes('type', e))
            }}
          />

        </Grid>
        {this.state.questionPaperTypelabel
          ? <Grid style={{ margin: 16 }} item >
            <label>Sub Types:</label>
            <CreatableSelect
              label='Sub Type'
              options={this.state.offlineSubTypes}
              value={this.state.questionPaperSubtypelabel}
              onChange={e => {
                this.setState({
                  questionPaperSubtypelabel: e
                }, () => this.getQuestionTypesAndSubTypes('subType', e))
              }} />

          </Grid> : ''}
        {/* <Grid style={{ margin: 16 }} item >
          <label>Question Paper Sub Type:</label>
          <CreatableSelect
            disabled={this.state.questionPaperSubTypes.length === 0}
            // placeholder='Select question paper sub type'
            defaultValue={this.state.questionPaperSubtypeValue}
            options={this.state.questionPaperSubTypes}
            onChange={this.handleQuestionPaperType}

            // onChange={({ value, label }) => { this.setState({ questionPaperSubType: value, questionPaperSubtypeValue: { value: value, label: label }, questionPaperSubtypelabel: label }) }}
          />
        </Grid> */}
        <Grid container>
          <Grid item>
            { this.state.questionPaperTypelabel && <Button
              variant='contained'
              color='primary'
              style={{ margin: 16 }}
              onClick={this.sumbitTypes}
              disabled={!this.state.questionPaperTypelabel}
              // onClick={() => {
              //   this.setState({ isUploading: true }, this.handleQuestionPaper)
              // }}
            >
    Save
            </Button>
            }
          </Grid>
        </Grid>

      </React.Fragment>
    )
  }
}
const mapStateToProps = state => ({
  token: state.authentication.user
})
export default connect(
  mapStateToProps
)(withRouter(withStyles(styles)(addQuestionPaper)))
