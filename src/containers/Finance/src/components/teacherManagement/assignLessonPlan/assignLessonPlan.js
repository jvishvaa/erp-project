import React, { Component } from 'react'
import { Button } from '@material-ui/core/'
import { Table, Form, Container, Header, Breadcrumb, Icon, Segment } from 'semantic-ui-react'
import '../../css/staff.css'

export default class AssignLessonPlan extends Component {
  render () {
    return (
      <div className='student-section'>
        <label className='student-heading'>Manage</label>&nbsp;&nbsp;&nbsp;Assign Lesson Plan
        <Breadcrumb size='mini' textAlign='center' className='student-breadcrumb'>
          <Breadcrumb.Section icon>
            <Icon name='tachometer alternate' />&nbsp;&nbsp;
                Home</Breadcrumb.Section>
          <Breadcrumb.Dividr icon='right chevron' />
          <Breadcrumb.Section active>Assign Lesson Plan</Breadcrumb.Section>
        </Breadcrumb>
        <Container>
          <Segment.Group>
            <Segment>
              <Header as='h3' style={{ color: '#4d4d4d' }}>Assign Lesson Plan</Header>
              <Form >
                <Form.Group>
                  <Form.Field label='&nbsp;&nbsp;Branch' control='select' width={4}>
                    <option />
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                  </Form.Field>
                  <Form.Field className='positionalignment' width={2}>
                    <Button color='blue'>Get Teacher</Button>
                  </Form.Field>
                </Form.Group>
              </Form>
              <br />

              <div id='tablecontent2'>
                <Table collapsing celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Sr.</Table.HeaderCell>
                      <Table.HeaderCell>Staff Name</Table.HeaderCell>
                      <Table.HeaderCell>Mobile</Table.HeaderCell>
                      <Table.HeaderCell>Email</Table.HeaderCell>
                      <Table.HeaderCell>Branch</Table.HeaderCell>
                      <Table.HeaderCell>Grade</Table.HeaderCell>
                      <Table.HeaderCell>Section</Table.HeaderCell>
                      <Table.HeaderCell>Designation</Table.HeaderCell>
                      <Table.HeaderCell>Subject</Table.HeaderCell>
                      <Table.HeaderCell>Department</Table.HeaderCell>
                      <Table.HeaderCell>Address</Table.HeaderCell>
                      <Table.HeaderCell>Added Date</Table.HeaderCell>
                      <Table.HeaderCell>Assign Lesson Plan</Table.HeaderCell>

                    </Table.Row>
                  </Table.Header>

                </Table>
              </div>
              <br />

            </Segment>

          </Segment.Group>
        </Container>
      </div>

    )
  }
}
