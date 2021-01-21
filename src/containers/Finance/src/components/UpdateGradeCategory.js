import React, { Component } from 'react'
import { Container, Grid, Segment, Breadcrumb } from 'semantic-ui-react'
import axios from 'axios'
import AuthService from './AuthService'
import { urls } from '../urls'
import RouterButton from './Button'

const update = {
  label: 'Update',
  color: 'green',
  disabled: false
}

class UpdateGradeCategory extends Component {
  constructor (props) {
    super(props)
    this.props = props
    var auth = new AuthService()
    this.auth_token = auth.getToken()
    this.state = { }
    this.handleClickUpdate = this.handleClickUpdate.bind(this)
  }

  componentDidMount () {
    var id = window.location.href.split('?')[1]
    var UpdateStaff = urls.GradeCategory + id + '/'
    axios
      .get(UpdateStaff, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then((res) => {
        this.setState({ grade_category: res.grade_category })
      })
      .catch(function (error) {
        console.log("Error: Couldn't fetch data from " + urls.GRADE, error)
      })
  }

   handleClickUpdate = (event) => {

   }

   render () {
     return (
       <div className='student-section'>
         <label className='student-heading'>Update Staff</label>&nbsp;
         <Breadcrumb size='mini' className='student-breadcrumb'>
           <Breadcrumb.Section link>Home</Breadcrumb.Section>
           <Breadcrumb.Divider icon='right chevron' />
           <Breadcrumb.Section>Grade Category List</Breadcrumb.Section>
           <Breadcrumb.Divider icon='right chevron' />
           <Breadcrumb.Section active>Grade Category</Breadcrumb.Section>
         </Breadcrumb>
         <Container className='student-section-studentDetails'>
           <Segment.Group>
             <Segment>
               <Grid>
                 <Grid.Row>
                   <Grid.Column computer={4} mobile={15} tablet={10}>
                                        Grade Category Information
                   </Grid.Column>
                 </Grid.Row>
               </Grid>
             </Segment>
             <Segment className='student-addStudent-segment1'>
               <Grid>
                 <Grid.Row>
                   <Grid.Column
                     computer={5}
                     mobile={16}
                     tablet={10}
                     className='student-section-inputField1'
                   >
                     <label>Grade Category*</label>
                     <input name='text' type='text' className='form-control' placeholder='Grade Category' value={this.state.grade_category} />
                   </Grid.Column>
                 </Grid.Row>
                 <Grid.Row>
                   <Grid.Column
                     computer={5}
                     mobile={16}
                     tablet={15}
                     className='student-section-addstaff-button'
                   >
                     <RouterButton value={update} click={this.handleClickUpdate} />
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

export default UpdateGradeCategory
