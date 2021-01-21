import React, { Component } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
// import { Grid } from 'semantic-ui-react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/'
import { urls } from '../../../urls'
import QuestionPaperTemplate from './paperTemplate'
import QuestionTemplate from './questionTemplate'
import '../../css/staff.css'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  }
})
function TabContainer (props) {
  return <div>{props.children}</div>
}
class QuestionPaperDetails extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      paperDetails: [],
      value: 0
    }
  }

  componentDidMount () {
    console.log(this.props)
    axios
      .get(urls.ViewQuestionPaperDetail + this.props.match.params.id, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            questions: res.data.question_detail,
            paperDetails: res.data.question_paper_details[0]
          })
        } else {
          this.props.alert.warning('No Questions to display')
        }
      })
      .catch(error => {
        this.props.alert.warning('Error: Please try again.')
        console.log(error)
      })
  }
  handleChange =(event, value) => {
    this.setState({ value })
  }
  render () {
    let { value, paperDetails, questions } = this.state
    return (
      <div>
        <Tabs
          value={value}
          onChange={this.handleChange}
          variant='scrollable'
          scrollButtons='auto'

        >
          <Tab label='Teacher View(With Answer)' />
          {!this.props.match.params.studentid ? <Tab label='Student View(Column Wise Options)' /> : ''}
          {!this.props.match.params.studentid ? <Tab label='Student View(Options in a Row)' /> : ''}
          {!this.props.match.params.studentid ? <Tab label='Student View(Options in two Row)' /> : ''}
        </Tabs>
        { value === 0 && <TabContainer>
          <QuestionPaperTemplate paperDetails={paperDetails} />
          <QuestionTemplate questions={questions} view='teacher'
            isEditable={!!this.props.match.params.studentid}
            studentId={this.props.match.params.studentid}
            questionPaperId={this.props.match.params.id}
            uniqueTestId={this.props.match.params.testid}
          />
        </TabContainer> }
        { value === 1 && <TabContainer>
          <QuestionPaperTemplate paperDetails={paperDetails} />
          <QuestionTemplate questions={questions} view='student' />
        </TabContainer> }
        { value === 2 && <TabContainer>
          <QuestionPaperTemplate paperDetails={paperDetails} />
          <QuestionTemplate questions={questions} view='student1' />
        </TabContainer> }
        { value === 3 && <TabContainer>
          <QuestionPaperTemplate paperDetails={paperDetails} />
          <QuestionTemplate questions={questions} view='student2' />
        </TabContainer> }
      </div>
    )
    // let panes = [
    //   { menuItem: 'Teacher View(With Answer)',
    //     render: () =>
    //       <Tab.Pane
    //       >
    //         <QuestionPaperTemplate paperDetails={paperDetails} />
    //         <QuestionTemplate questions={questions} view='teacher' />
    //       </Tab.Pane> },

    //   { menuItem: 'Student View(Column Wise Options)',
    //     render: () =>
    //       <Tab.Pane
    //       >
    //         <QuestionPaperTemplate paperDetails={paperDetails} />
    //         <QuestionTemplate questions={questions} view='student' />
    //       </Tab.Pane> },

    //   { menuItem: 'Student View(Options in a Row)',
    //     render: () =>
    //       <Tab.Pane
    //       >
    //         <QuestionPaperTemplate paperDetails={paperDetails} />
    //         <QuestionTemplate questions={questions} view='student1' />
    //       </Tab.Pane> },

    //   { menuItem: 'Student View(Options in two Row)',
    //     render: () =>
    //       <Tab.Pane
    //       >
    //         <QuestionPaperTemplate paperDetails={paperDetails} />
    //         <QuestionTemplate questions={questions} view='student2' />
    //       </Tab.Pane> }
    // ]

    // return (
    //   <React.Fragment>
    //     <div className='student-section'>
    //       <Grid >
    //         <Grid.Row>
    //           <Grid.Column width={16} style={{ paddingLeft: '20px' }}>
    //             <Tab panes={panes} />
    //           </Grid.Column>
    //         </Grid.Row>
    //       </Grid>
    //     </div>
    //   </React.Fragment>
    // )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(mapStateToProps)(withStyles(styles)(withRouter(QuestionPaperDetails)))
