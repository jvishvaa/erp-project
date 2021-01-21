import React, { Component } from 'react'
import { Container, Grid, Segment, Breadcrumb } from 'semantic-ui-react'
import { RouterButton, OmsFilterTable } from '../../../ui'
import '../../css/staff.css'

const addClassGroup = {
  label: 'Add Class Group',
  color: 'blue',
  href: 'classGroup/add',
  disabled: false
}

const classGroupData = {
  namespace: 'Class Group'
}

const csv = {
  label: 'CSV'
}

const excel = {
  label: 'Excel'
}

class classGroup extends Component {
  render () {
    return (
      <div className='student-section'>
        <label className='student-heading'>Manage</label>&nbsp;Class Group
        <Breadcrumb size='mini' className='student-breadcrumb'>
          <Breadcrumb.Section link>Home</Breadcrumb.Section>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section active>Class Group</Breadcrumb.Section>
        </Breadcrumb>
        <Container className='student-section-studentDetails'>
          <Segment.Group>
            <Segment>
              <Grid>
                <Grid.Row>
                  <Grid.Column computer={4} mobile={15} tablet={10}>
                                 Class Group
                  </Grid.Column>
                  <Grid.Column className='right' computer={12} mobile={15} tablet={10}>
                    {/* <Button primary>Add Class Group</Button> */}
                    <RouterButton value={addClassGroup} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
            <Segment>
              <RouterButton value={csv} /> &nbsp;
              <RouterButton value={excel} />
            </Segment>
            <Segment className='student-section-studentDetails'>
              <Grid>
                <Grid.Row>
                  <Grid.Column computer={15} mobile={13} tablet={15} className='staff-table1'>
                    <OmsFilterTable
                      filterTableData={classGroupData}
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

export default classGroup
