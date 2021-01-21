import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'
import { OmsSelect } from '../../ui'
// import axios from 'axios'
import { apiActions } from '../../_actions'
// import { urls } from '../../urls'

class ViewSmsCredits extends Component {
  constructor () {
    super()
    this.state = {}
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
  }
  changehandlerbranch = (e) => {
    this.setState({ branch: e.value })
  };

  componentDidMount () {
    this.role = this.userProfile.personal_info.role
    let academicProfile = this.userProfile.academic_profile
    console.log(academicProfile)
    if (this.role === 'Principal' || this.role === 'FOE') {
      this.setState({
        branch: academicProfile.branch_id,
        branchValue: { value: academicProfile.branch_id, label: academicProfile.branch }
      })
      this.changehandlerbranch({ value: academicProfile.branch_id })
      if (this.role === 'Principal' || this.role === 'FOE') {

      }
    }
  }
  render () {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column
            computer={5}
            mobile={16}
            tablet={4}
            className='student-section-inputField'
          >
            <label>Branch*</label>
            <OmsSelect
              options={
                this.props.branches
                  ? this.props.branches.map(branch => ({
                    value: branch.id,
                    label: branch.branch_name
                  }))
                  : []
              }
              defaultValue={this.state.branchValue}
              change={this.changehandlerbranch}
            />
          </Grid.Column>
          <textarea />
        </Grid.Row>
        <Grid.Row>
          <Button style={{ marginLeft: 30 }}>add</Button>
        </Grid.Row>
      </Grid>
    )
  }
}
const mapStateToProps = state => ({
  branches: state.branches.items,
  roles: state.roles.items,
  user: state.authentication.user

})
const mapDispatchToProps = dispatch => ({
  listBranches: dispatch(apiActions.listBranches()),
  loadRoles: dispatch(apiActions.listRoles())
})

export default connect(mapStateToProps,
  mapDispatchToProps
)(ViewSmsCredits)
