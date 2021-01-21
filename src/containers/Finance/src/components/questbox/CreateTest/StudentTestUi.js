import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Typography } from '@material-ui/core'
import { Card } from 'semantic-ui-react'
import { InternalPageStatus } from '../../../ui'

class StudentTestsUi extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tests: [],
      status: { NS: 'Not started', S: 'started', C: 'Completed' }
    }
  }

  getContent = (tests) => {
    return tests.map(test => (
      <Card
        style={{ maxWidth: window.isMobile ? '35vw' : '21vw', borderRadius: 0, border: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' }}
        data={test} key={test.id}
      >
        <Card.Content style={{ overflow: 'auto' }} header={test.onlinetest_name} meta={() => {
          return <div>
            <Typography
              component='p'
              style={{ float: 'left', color: test.status === 'C' ? 'green' : 'rgba(0,0,0,0.5)' }}
            >
              {this.state.status[test.status]}
            </Typography>
            {test.status === 'NS'
              ? ''
              : <Typography
                component='p'
                style={{ float: 'right', color: 'rgba(0,0,0,0.5)' }}
              >
                Marks: {test.total_score !== null ? test.total_score : '--'} out of {test.max_score ? test.max_score : '--'}
              </Typography>
            }
          </div>
        }} />
        <Button variant='contained' style={{ boxShadow: 'none', borderRadius: 0 }}color={test.status === 'C' ? 'default' : test.status === 'NS' ? 'primary' : 'secondary'} onClick={() => this.props.history.push(`/questbox/handleTest/${test.id}`)}>
          {test.status === 'C' ? <Fragment>D e t a i l s</Fragment> : null}
          {test.status === 'NS' ? <Fragment> T a k e        &nbsp; t e s t </Fragment> : null}
          {test.status === 'S' ? <Fragment> C o n t i n u e </Fragment> : null}
        </Button>
      </Card>
    ))
  }
  render () {
    const { tests = [], loading } = this.props
    console.log(tests)
    let isTestsAvailable = tests.length
    return <Fragment>
      <div style={{ minHeight: '50vh', padding: 16 }}>
        <Card.Group>
          {loading
            ? <InternalPageStatus label={'Loading...'} />
            : isTestsAvailable ? this.getContent(tests)
              : <InternalPageStatus label={'No tests available'} loader={false} />
          }
        </Card.Group>
      </div>
    </Fragment>
  }
}

export default (withRouter(StudentTestsUi))
