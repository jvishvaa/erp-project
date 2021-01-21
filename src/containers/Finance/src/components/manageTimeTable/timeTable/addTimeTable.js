import React, { Component } from 'react'
import { Button } from '@material-ui/core/'
import { Divider, Form, Grid, Container, Header, Breadcrumb, Icon, Segment } from 'semantic-ui-react'
import '../../css/staff.css'

export default class ViewTimeTable extends Component {
  render () {
    return (
      <div className='student-section'>

        <Grid>
          <Grid.Column computer={8} mobile={16} tablet={10} floated='left'>
            <label className='student-heading'>View</label>&nbsp;&nbsp;&nbsp;Time Table
          </Grid.Column>
          <Grid.Column computer={8} mobile={16} tablet={10} floated='right'>
            <Breadcrumb
              size='mini'
              textAlign='center'
              className='student-breadcrumb'
            >
              <Breadcrumb.Section icon>
                <Icon name='tachometer alternate' />&nbsp;&nbsp;
        Home</Breadcrumb.Section>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section active>View Time Table</Breadcrumb.Section>
            </Breadcrumb>
          </Grid.Column>
        </Grid>
        <div className='formargin'>
          <Container>
            <Segment.Group>
              <Segment>
                <Header as='h3' style={{ color: '#4d4d4d' }}>Time Table Information</Header>
                <Divider />
                <Form >

                  <Form.Group>

                    <Form.Field label='Branch*' control='select' width={4}>

                      <option />
                      <option value='male'>Male</option>
                      <option value='female'>Female</option>
                    </Form.Field>
                    <Form.Field label='Grade*' control='select' width={4}>
                      <option />
                      <option value='male'>Male</option>
                      <option value='female'>Female</option>
                    </Form.Field>
                    <Form.Field label='Section*' control='select' width={4}>
                      <option />
                      <option value='male'>Male</option>
                      <option value='female'>Female</option>
                    </Form.Field>
                    <Form.Field label='Select Academic Year*' control='select' width={4}>
                      <option>2018-19</option>
                      <option>2019-20</option>
                      <option>2020-21</option>
                      <option>2021-22</option>
                      <option>2022-23</option>
                      <option>2023-24</option>
                      <option>2024-25</option>
                      <option>2025-26</option>
                      <option>2026-27</option>
                      <option>2027-28</option>
                    </Form.Field>

                  </Form.Group>

                </Form>
                <div className='formargin'>

                  <Button color='blue'>Get Timetable</Button>
                </div>

              </Segment>

            </Segment.Group>

          </Container>
        </div>
      </div>

    )
  }
}
