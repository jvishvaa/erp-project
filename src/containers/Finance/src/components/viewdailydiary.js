import React, { Component } from 'react'
import { Button } from '@material-ui/core/'

import { Tab, Divider, Form, Grid, Container, Header, Breadcrumb, Icon, Segment } from 'semantic-ui-react'
import './css/staff.css'
import Calender from './calender1'

const panes = [
  { menuItem: 'Individual Student',
    render: () => <Tab.Pane>
      <Form>
        <Form.Group widths='equal'>
          <Form.Field label='Branch*' control='select' >

            <option />
            <option value='male'>Male</option>
            <option value='female'>Female</option>
          </Form.Field>
          <Form.Field label='Grade*' control='select' >
            <option />
            <option value='male'>Male</option>
            <option value='female'>Female</option>
          </Form.Field>
          <Form.Field label='Section*' control='select' >
            <option />
            <option value='male'>Male</option>
            <option value='female'>Female</option>
          </Form.Field>

          <Form.Field label='Academic Year*' control='select' >
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
        <Form.Group>

          <Form.Field >
            <Calender />
          </Form.Field>

          <Form.Field >
            <Button style={{ color: 'white', background: '#3c8dbc' }}>Get Individual Report</Button>
          </Form.Field>
        </Form.Group>
      </Form>

    </Tab.Pane> },
  { menuItem: 'Report',
    render: () => <Tab.Pane>
      <Form>
        <Form.Group >
          <Form.Field label='Branch*' control='select' width={4} >

            <option />
            <option value='male'>Male</option>
            <option value='female'>Female</option>
          </Form.Field>
          <Form.Field label='Grade*' control='select' width={4} >
            <option />
            <option value='male'>Male</option>
            <option value='female'>Female</option>
          </Form.Field>
          <Form.Field label='Section*' control='select' width={4} >
            <option />
            <option value='male'>Male</option>
            <option value='female'>Female</option>
          </Form.Field>
          <Form.Field className='forpositioning' >
            <label>Date Range*</label>
            <Calender />
          </Form.Field>
        </Form.Group>
        <Button style={{ color: 'white', background: '#3c8dbc' }}>Get Report</Button>

      </Form>
    </Tab.Pane> },
  { menuItem: 'Circular',
    render: () => <Tab.Pane>
      <Form>
        <Form.Group >
          <Form.Field label='Branch*' control='select' width={4} >

            <option />
            <option value='male'>Male</option>
            <option value='female'>Female</option>
          </Form.Field>
          <Form.Field label='Grade*' control='select' width={4} >
            <option />
            <option value='male'>Male</option>
            <option value='female'>Female</option>
          </Form.Field>
          <Form.Field label='Section*' control='select' width={4} >
            <option />
            <option value='male'>Male</option>
            <option value='female'>Female</option>
          </Form.Field>
          <Form.Field className='forpositioning' >
            <label>Date Range*</label>
            <Calender />
          </Form.Field>
        </Form.Group>
        <Button style={{ color: 'white', background: '#3c8dbc' }}>Get Circular Report</Button>

      </Form>
    </Tab.Pane> }

]

export default class ViewDailyDairy extends Component {
  render () {
    return (
      <div className='student-section'>

        <Grid>
          <Grid.Column computer={8} mobile={16} tablet={10} floated='left'>
            <label className='student-heading'>Manage</label>&nbsp;&nbsp;&nbsp;View Dail Diary
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
              <Breadcrumb.Section active>View Dail Diary</Breadcrumb.Section>
            </Breadcrumb>
          </Grid.Column>
        </Grid>
        <div className='formargin'>
          <Container>
            <Segment id='removeborder'>

              <Header as='h3' style={{ color: '#4d4d4d' }}>View Dail Diary</Header>
              <Divider />
              <Segment>
                <Tab panes={panes} />
              </Segment>

            </Segment>

          </Container>
        </div>
      </div>

    )
  }
}
