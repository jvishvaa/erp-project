
import React, { Component } from 'react'
import { Button } from '@material-ui/core/'

import { Divider, Form, Container, Header, Breadcrumb, Icon, Segment } from 'semantic-ui-react'
import '../../css/staff.css'

export default class AddClassGroup extends Component {
  constructor () {
    super()
    this.state = {

    }
  }
  classGroup = (e) => {
    this.setState({ classGroup: e.target.value })
  }

  render () {
    return (
      <div className='student-section'>
        <label className='student-heading'>Add Class Group</label>
        <Breadcrumb size='mini' textAlign='center' className='student-breadcrumb'>
          <Breadcrumb.Section icon>
            <Icon name='tachometer alternate' />&nbsp;&nbsp;
                Home</Breadcrumb.Section>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section active>Class Group List</Breadcrumb.Section>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section active>Add Class Group</Breadcrumb.Section>
        </Breadcrumb>
        <div className='formargin'>
          <Container>
            <Segment.Group>
              <Segment>
                <Header as='h3' style={{ color: '#4d4d4d' }}>Class Group Information</Header>
                <Divider />
                <Form >
                  <Form.Group >
                    <Form.Field width={5}>
                      <label>Class Group*</label>
                      <input onChange={this.classGroup} placeholder='class group' />
                    </Form.Field>
                  </Form.Group>
                </Form>
              </Segment>
            </Segment.Group>
            <div className='formargin'>
              <Button type='submit' disabled={!this.state.classGroup} color='green'>Save</Button>
              <Button color='blue'>Return</Button>
            </div>
          </Container>
        </div>
      </div>
    )
  }
}
