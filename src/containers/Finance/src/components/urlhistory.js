import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import axios from 'axios'
import { ArrowLeft, ArrowRight } from '@material-ui/icons'
import Chip from '@material-ui/core/Chip'
import routes from '../routes'
import { apiActions } from '../_actions'
import { urls } from '../urls'

class UrlHistory extends Component {
  constructor () {
    super()
    this.state = {
      urlhistorydata: [],
      expand: false,
      start: 0,
      end: 5,
      more: true
    }

    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.role = this.userProfile.personal_info.role
  }

  componentDidMount () {
    let userid = this.userProfile.personal_info.user_id
    console.log(userid)
    axios
      .get(urls.Urlhistory + `?user_id=` + userid, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })

      .then(res => {
        console.log(res)
        this.setState({ urlhistorydata: res.data })
        console.log(this.state.urlhistorydata)
      })
      .catch(error => {
        console.log(error)
      })
  }
  expandmore=(e) => {
    // let { urlhistorydata } = this.state
    this.setState({ start: 0, end: 10, more: false })
  }
  expandless=(e) => {
    this.setState({ start: 0, end: 5, more: true })
  }
  notRoles = ['GuestStudent']

  render () {
    let { start, end } = this.state
    console.log(routes)
    if (this.notRoles.includes(this.role)) return null
    return (
      <div style={{ maxWidth: '100%' }}>
        {this.state.urlhistorydata.length > 0 && <div style={{ display: 'flex', justifyContent: 'flex-start', overflow: 'auto', transition: 'all 250ms', height: '50px' }}>
          {
            this.state.urlhistorydata.map((data, index) => {
              let route = routes.filter(route => data.url_description_id.url_name === route.path)[0]
              let title = route ? route.title : data.url_description_id.url_name
              return <Chip
                style={{ marginTop: 4, marginLeft: index === 0 ? 0 : 5, borderRadius: 0 }}
                label={title}
                component={RouterLink}
                to={data.url_description_id.url_name}
                clickable
              />
            }).splice(start, end)
          }
          {this.state.more ? <IconButton onClick={this.expandmore}><ArrowRight /></IconButton> : <IconButton onClick={this.expandless} ><ArrowLeft /></IconButton>}
        </div>}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  roles: state.roles.items,
  user: state.authentication.user
})
const mapDispatchToProps = dispatch => ({
  loadRoles: dispatch(apiActions.listRoles())
})

export default connect(mapStateToProps,
  mapDispatchToProps
)(UrlHistory)
