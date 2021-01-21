import React, { Component } from 'react'
import { Container, Grid, Header, Divider, Segment, Breadcrumb, Form } from 'semantic-ui-react'

class ViewCalendar extends Component {
  render () {
    return (
      <div className='student-section'>
        <Grid>
          <Grid.Column computer={8} mobile={16} tablet={10} floated='left'>
            <label className='student-heading'>View</label>&nbsp;Holidays
          </Grid.Column>
          <Grid.Column computer={8} mobile={16} tablet={10} floated='right'>
            <Breadcrumb
              size='mini'
              textAlign='center'
              className='student-breadcrumb'
            >
              <Breadcrumb.Section link>Home</Breadcrumb.Section>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section link>Holiday List</Breadcrumb.Section>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section active>Add Holidays</Breadcrumb.Section>
            </Breadcrumb>
          </Grid.Column>
        </Grid>

        <div className='formargin'>
          <Container>
            <Segment.Group>
              <Segment>
                <Header as='h3' style={{ color: '#4d4d4d' }}>Holidays Information</Header>
                <Divider />
                <Form >

                  <Form.Group>

                    <Form.Field width={4}>
                      <label style={{ display: 'inline-block' }} >Branch*</label>
                    </Form.Field>

                    <Form.Field width={4}>
                      <label style={{ display: 'inline-block' }} >Academic Year*</label>
                    </Form.Field>

                    <Form.Field width={4}>
                      <label style={{ display: 'inline-block' }} >Month*</label>
                    </Form.Field>

                    <Form.Field width={3} className='student-section-viewCalendar-Button'>
                    </Form.Field>

                  </Form.Group>

                </Form>

              </Segment>

            </Segment.Group>

          </Container>
        </div>

      </div>
    )
  }
}

export default ViewCalendar
