
import React, { Component } from 'react'
import {

  Grid,

  Container,

  Breadcrumb,
  Icon,
  Segment

} from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import '../../css/staff.css'
import { RouterButton } from '../../../ui'

export default class Permission extends Component {
  constructor (props) {
    super(props)
    // console.warn(this.props.isChecked)
    this.state = {
      isChecked: false,
      create: false,
      view: false,
      delete: false,
      expert: false,
      Role: props.roleis
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleChangeCreate = this.handleChangeCreate.bind(this)
    this.handleChangeView = this.handleChangeView.bind(this)
    this.handleChangeDelete = this.handleChangeDelete.bind(this)
    this.handleChangeExport = this.handleChangeExport.bind(this)
  }
  handleChange (e) {
    console.log(e)

    this.setState({
      isChecked: !this.state.isChecked
    })
    if (this.state.isChecked === false) {
      this.setState({
        create: true,
        view: true,
        delete: true,
        export: true
      })
    }
  }
  handleChangeCreate (e) {
    //  console.log(e);
    this.setState({
      create: !this.state.create
    })
  }
  handleChangeView (e) {
    // console.log(e);
    this.setState({
      view: !this.state.view
    })
  }
  handleChangeDelete (e) {
    console.log('----------')
    this.setState({
      delete: !this.state.delete
    })
  }
  handleChangeExport (e) {
    // console.log(e);
    this.setState({
      export: !this.state.export
    })
  }
  render () {
    return (
      <React.Fragment>
        <div className='student-section'>
          <label className='student-heading'>
            Permission&nbsp;&nbsp;[{this.state.Role}]
          </label>
          <Breadcrumb
            size='mini'
            textAlign='center'
            className='student-breadcrumb'
          >
            <Breadcrumb.Section icon>
              <Icon name='tachometer alternate' />
              &nbsp;&nbsp; Home
            </Breadcrumb.Section>
            <Breadcrumb.Divider icon='right chevron' />
            <Breadcrumb.Section active>Roles</Breadcrumb.Section>
            <Breadcrumb.Divider icon='right chevron' />
            <Breadcrumb.Section active>Permission</Breadcrumb.Section>
          </Breadcrumb>
          <div className='formargin'>
            <Container>
              <Segment>
                <div>Masters</div>
                <Grid celled='internally'>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label style={{ position: 'relative', top: '18px' }}>
                        Staff
                      </label>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <label>All</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <label>Create</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.create}
                            onChange={this.handleChangeCreate}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>View</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.view}
                            onChange={this.handleChangeView}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>Delete</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.delete}
                            onChange={this.handleChangeDelete}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>Export</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.export}
                            onChange={this.handleChangeExport}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label>View Staff Mapping</label>
                    </Grid.Column>
                    <Grid.Column width={4} />
                    <Grid.Column width={4} />
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2} />
                    <Grid.Column width={2} />
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label style={{ position: 'relative', top: '18px' }}>
                        Students
                      </label>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>

              {/* master management */}
              <Segment>
                <div>Master Management</div>
                <Grid celled='internally'>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label style={{ position: 'relative', top: '18px' }}>
                        Subject
                      </label>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <label>All</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <label>Create</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>View</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>Delete</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>Export</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label>Subject Mapping</label>
                    </Grid.Column>
                    <Grid.Column width={4} />
                    <Grid.Column width={4} />
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2} />
                    <Grid.Column width={2} />
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label style={{ position: 'relative', top: '18px' }}>
                        Grade
                      </label>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label>Grade Mapping</label>
                    </Grid.Column>
                    <Grid.Column width={4} />
                    <Grid.Column width={4} />
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2} />
                    <Grid.Column width={2} />
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label style={{ position: 'relative', top: '18px' }}>
                        Section
                      </label>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label>Section Mapping</label>
                    </Grid.Column>
                    <Grid.Column width={4} />
                    <Grid.Column width={4} />
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2} />
                    <Grid.Column width={2} />
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label style={{ position: 'relative', top: '18px' }}>
                        Branch
                      </label>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label style={{ position: 'relative', top: '18px' }}>
                        Session
                      </label>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label style={{ position: 'relative', top: '18px' }}>
                        Designation
                      </label>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label style={{ position: 'relative', top: '18px' }}>
                        Class Group
                      </label>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label style={{ position: 'relative', top: '18px' }}>
                        Grade Category
                      </label>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label style={{ position: 'relative', top: '18px' }}>
                        Vacation
                      </label>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                  </Grid.Row>{' '}
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label style={{ position: 'relative', top: '18px' }}>
                        Vacation Type
                      </label>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                  </Grid.Row>{' '}
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label style={{ position: 'relative', top: '18px' }}>
                        Period
                      </label>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label style={{ position: 'relative', top: '18px' }}>
                        Role
                      </label>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label style={{ position: 'relative', top: '18px' }}>
                        Department
                      </label>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
              <Segment>
                <div>Manage Calender</div>
                <Grid celled='internally'>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label style={{ position: 'relative', top: '18px' }}>
                        Calender
                      </label>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <label>All</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <label>Create</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>View</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>Delete</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>Export</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label>View Calender</label>
                    </Grid.Column>
                    <Grid.Column width={4} />
                    <Grid.Column width={4} />
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2} />
                    <Grid.Column width={2} />
                  </Grid.Row>
                </Grid>
              </Segment>

              <Segment>
                <div>Manage Time Table</div>
                <Grid celled='internally'>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label style={{ position: 'relative', top: '18px' }}>
                        Add Time Table
                      </label>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <label>All</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <label>Create</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>View</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>Delete</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>Export</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label>View Time Table</label>
                    </Grid.Column>
                    <Grid.Column width={4} />
                    <Grid.Column width={4} />
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2} />
                    <Grid.Column width={2} />
                  </Grid.Row>
                </Grid>
              </Segment>
              <Segment>
                <div>Manage Micro Schedule</div>
                <Grid celled='internally'>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label style={{ position: 'relative', top: '18px' }}>
                        Add Micro Schedule
                      </label>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <label>All</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <label>Create</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>View</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>Delete</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>Export</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label>View Micro Scedule</label>
                    </Grid.Column>
                    <Grid.Column width={4} />
                    <Grid.Column width={4} />
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2} />
                    <Grid.Column width={2} />
                  </Grid.Row>
                </Grid>
              </Segment>
              <Segment>
                <div>Feedback Type 1</div>
                <Grid celled='internally'>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label style={{ position: 'relative', top: '18px' }}>
                        Thread
                      </label>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <label>All</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <label>Create</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>View</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>Delete</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>Export</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>

              <Segment>
                <div>Feedback Type 2</div>
                <Grid celled='internally'>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label style={{ position: 'relative', top: '18px' }}>
                        Feedback Specific to Book
                      </label>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <label>All</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <label>Create</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>View</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>Delete</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>Export</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>

              <Segment>
                <div>Feedback Type 1</div>
                <Grid celled='internally'>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label style={{ position: 'relative', top: '18px' }}>
                        Thread
                      </label>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <label>All</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <label>Create</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>View</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>Delete</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>Export</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
              <Segment>
                <div>Teacher Management</div>
                <Grid celled='internally'>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label style={{ position: 'relative', top: '18px' }}>
                        Assign Subject Teacher
                      </label>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <label>All</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <label>Create</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>View</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>Delete</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>Export</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label>Teacher Report</label>
                    </Grid.Column>
                    <Grid.Column width={4} />
                    <Grid.Column width={4} />
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2} />
                    <Grid.Column width={2} />
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label>Teacher Report Lagging</label>
                    </Grid.Column>
                    <Grid.Column width={4} />
                    <Grid.Column width={4} />
                    <Grid.Column width={2}>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2} />
                    <Grid.Column width={2} />
                  </Grid.Row>
                </Grid>
              </Segment>

              <Segment>
                <div>Observation Report</div>
                <Grid celled='internally'>
                  <Grid.Row>
                    <Grid.Column width={2}>
                      <label style={{ position: 'relative', top: '18px' }}>
                        Observation Report
                      </label>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <label>All</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <label>Create</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>View</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>Delete</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <label>Export</label>
                      <div>
                        <label className='switch'>
                          <input
                            type='checkbox'
                            checked={this.state.isChecked}
                            onChange={this.handleChange}
                          />
                          <div className='slider' />
                        </label>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>

              <div className='formargin' style={{ textAlign: 'center' }}>
                <Button color='green'>Update</Button>
                <RouterButton
                  value={{
                    label: 'Return',
                    color: 'blue',
                    href: '/role'
                  }}
                />
              </div>
            </Container>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
