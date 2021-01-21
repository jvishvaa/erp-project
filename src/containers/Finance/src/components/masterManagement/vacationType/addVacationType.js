
import React, { Component } from 'react'
import { Divider, Form, Container, Header, Breadcrumb, Icon, Segment, Button } from 'semantic-ui-react'
import '../../css/staff.css'

export default class AddVacationType extends Component {
  render () {
    return (
      <div className='student-section'>
        <label className='student-heading'>Add Vacation Type</label>
        <Breadcrumb size='mini' textAlign='center' className='student-breadcrumb'>
          <Breadcrumb.Section icon>
            <Icon name='tachometer alternate' />&nbsp;&nbsp;
                Home</Breadcrumb.Section>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section active>Vacation Type List</Breadcrumb.Section>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section active>Add Vacation Type</Breadcrumb.Section>
        </Breadcrumb>
        <div className='formargin'>
          <Container>
            <Segment.Group>
              <Segment>
                <Header as='h3' style={{ color: '#4d4d4d' }}>Vacation Type Information</Header>
                <div style={{ float: 'right' }}> <span style={{ fontSize: '20px', color: 'red' }}>Note:</span>&nbsp;For full day select Arrival </div>
                <div style={{ clear: 'both' }} />
                <Divider />
                <Form >
                  <Form.Group >
                    <Form.Field width={5} label='Select Period*' control='select'>
                      <option />

                    </Form.Field>

                    <Form.Field width={5}>
                      <label>Vacation Type*</label>
                      <input placeholder='Vacation Type' />
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
