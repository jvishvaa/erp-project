import React, { Component } from 'react'
import { Container, Grid, Segment, Breadcrumb } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import '../../css/staff.css'
import { RouterButton, OmsFilterTable } from '../../../ui'

const addVacationType = {
  label: 'Add Vacation Type',
  color: 'blue',
  href: '/vacationType/addVacationType',
  disabled: false
}

const vacationTypeData = {
  namespce: 'Vacation Type'
}

class VacationType extends Component {
  render () {
    return (
      <div className='student-section'>
        <label className='student-heading'>Manage</label>&nbsp;Vacation Type
        <Breadcrumb size='mini' className='student-breadcrumb'>
          <Breadcrumb.Section link>Home</Breadcrumb.Section>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section active>Vacation Type</Breadcrumb.Section>
        </Breadcrumb>
        <Container className='student-section-studentDetails'>
          <Segment.Group>
            <Segment>
              <Grid>
                <Grid.Row>
                  <Grid.Column computer={4} mobile={15} tablet={10}>
                                 Vacation Type
                  </Grid.Column>
                  <Grid.Column className='right' computer={12} mobile={15} tablet={10}>
                    <RouterButton value={addVacationType} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
            <Segment>
              <Button>CSV</Button> &nbsp;
              <Button>Excel</Button>
            </Segment>
            <Segment className='student-section-studentDetails'>
              <Grid>
                <Grid.Row>
                  <Grid.Column computer={15} mobile={13} tablet={15} className='staff-table1'>
                    <OmsFilterTable
                      filterTableData={vacationTypeData}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          </Segment.Group>
        </Container>
      </div>
    )
  }
}

export default VacationType
