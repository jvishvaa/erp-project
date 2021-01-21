
import React, { Component } from 'react'
import { Button } from '@material-ui/core/'

import { Divider, Form, Container, Header, Breadcrumb, Icon, Segment } from 'semantic-ui-react'
import '../../css/staff.css'

export default class AddPeriod extends Component {
  render () {
    return (
      <div className='student-section'>
        <label className='student-heading'>Add Period</label>
        <Breadcrumb size='mini' textAlign='center' className='student-breadcrumb'>
          <Breadcrumb.Section icon>
            <Icon name='tachometer alternate' />&nbsp;&nbsp;
                Home</Breadcrumb.Section>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section active>Period List</Breadcrumb.Section>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section active>Add Period</Breadcrumb.Section>
        </Breadcrumb>
        <div className='formargin'>
          <Container>
            <Segment.Group>
              <Segment>
                <Header as='h3' style={{ color: '#4d4d4d' }}>Period Information</Header>

                <Divider />
                <Form >
                  <Form.Group >
                    <Form.Field width={6} label='Select Type*' control='select'>
                      <option>Select Type</option>
                      <option>Period</option>
                      <option>Break</option>

                    </Form.Field>

                  </Form.Group>

                  <Form.Group>
                    <Form.Field width={6}>
                      <label>Name*</label>
                      <input placeholder='Name' />
                    </Form.Field>

                  </Form.Group>

                </Form>

              </Segment>

            </Segment.Group>
            <div className='formargin'>
              <Button color='green'>Save</Button>
              <Button color='blue'>Return</Button>
            </div>
          </Container>
        </div>
      </div>

    )
  }
}
