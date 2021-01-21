
import React, { Component } from 'react'
import { Divider, Form, Container, Header, Breadcrumb, Icon, Segment } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import '../../css/staff.css'

export default class AddVacation extends Component {
  render () {
    return (
      <div className='student-section'>
        <label className='student-heading'>Add Vacation</label>
        <Breadcrumb size='mini' textAlign='center' className='student-breadcrumb'>
          <Breadcrumb.Section icon>
            <Icon name='tachometer alternate' />&nbsp;&nbsp;
                Home</Breadcrumb.Section>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section active>Vacation List</Breadcrumb.Section>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section active>Add Vacation</Breadcrumb.Section>
        </Breadcrumb>
        <div className='formargin'>
          <Container>
            <Segment.Group>
              <Segment>
                <Header as='h3' style={{ color: '#4d4d4d' }}>Vacation Information</Header>
                <Divider />
                <Form >
                  <Form.Group >
                    <Form.Field width={5} label='Select Type*' control='select'>
                      <option value='male'>Select Type</option>
                      <option value='male'>Summer</option>
                      <option value='male'>Half Day(period 5)</option>
                      <option value='female'>Full Day</option>
                    </Form.Field>

                  </Form.Group>

                  <Form.Group >
                    <Form.Field width={5}>
                      <label>Vacation*</label>
                      <input placeholder='Vacation name' />
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
