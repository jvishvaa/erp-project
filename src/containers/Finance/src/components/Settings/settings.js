import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Menu, MenuItem, List, ListItem, ListItemText, Typography } from '@material-ui/core'
import { Grid } from 'semantic-ui-react'
import { urls } from '../../urls'
import { apiActions } from '../../_actions'
// import { OmsSelect } from './../.././ui'

class Settings extends Component {
  constructor () {
    super()
    this.state = {
      listAcadSession: [],
      AcadSession: [],
      anchorEl: null,
      selectedIndex: 0,
      selectedAcadSession: ''
    }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    this.userId = JSON.parse(localStorage.getItem('user_profile')).personal_info.user_id
  }
  componentDidMount () {
    this.getPreviousData()
    axios.get(urls.UTILACADEMICSESSION, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log(res)
        this.setState({ listAcadSession: res.data })
      })
      .catch(error => {
        console.log(error)
      })
  }
  // handledata =(e) => {
  //   this.setState({ session: e.value })
  //   console.log(this.session)
  //   this.switchSession(e.value, this.userId)
  // }
  getPreviousData =(e) => {
    axios.get(urls.ACADSESSION, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log(res.data)
        this.setState({ selectedAcadSession: res.data.acad_session })
      })
      .catch(error => {
        console.log(error)
      })
  }
  switchSession = (session, userId) => {
    console.log(session)
    axios.post(urls.ACADSESSION, {
      'user_id': userId,
      'acad_session': session }, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    }).then(res => {
      console.log(res)
      this.props.alert.success('User Academic Session Added Successfully')
      // window.location.assign('/')
    })
  }

 handleClickListItem =(event) => {
   this.setState({ anchorEl: event.currentTarget })
 }

 handleMenuItemClick = (event, index) => {
   this.setState({ selectedIndex: index, anchorEl: null, selectedAcadSession: event.target.textContent }, () => {
     this.switchSession(this.state.selectedAcadSession, this.userId)
   })
 }

 handleClose = () => {
   this.setState({ anchorEl: null })
 }

 render () {
   let { listAcadSession, selectedAcadSession } = this.state
   console.log(this.state.listAcadSession['session_year'], 'aaaaaa')
   return (
     <div style={{ padding: 30 }}>
       <Grid>
         <Grid.Row style={{ padding: 0 }}>
           <Grid.Column
             computer={3}
             mobile={16}
             tablet={4}
           >
             <h2 style={{ marginTop: 15 }}>Acad Session: </h2>
           </Grid.Column>
           <Grid.Column
             computer={4}
             mobile={16}
             tablet={4}
           >
             <div>
               <List aria-label='Device settings'>
                 <ListItem
                   button
                   onClick={this.handleClickListItem}
                 >
                   <ListItemText
                     primary={<Typography variant='h6' style={{ color: '#000' }}>{selectedAcadSession || 'Select acad Session'}</Typography>}
                   />
                 </ListItem>
               </List>
               <Menu
                 id='lock-menu'
                 anchorEl={this.state.anchorEl}
                 keepMounted
                 open={Boolean(this.state.anchorEl)}
                 onClose={this.handleClose}
               >
                 {listAcadSession.session_year ? listAcadSession.session_year.map((option, index) => (
                   <MenuItem
                     key={option}
                     selected={index === this.state.selectedIndex}
                     onClick={event => this.handleMenuItemClick(event, index)}
                   >
                     {option}
                   </MenuItem>
                 )) : ''}
               </Menu>
             </div>
           </Grid.Column>
         </Grid.Row>
       </Grid>
     </div>

   )
 }
}
const mapStateToProps = state => ({
  user: state.authentication.user

})

const mapDispatchToProps = dispatch => ({
  loadBranches: dispatch(apiActions.listBranches()),

  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings)
