import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
// import ReactGA from 'react-ga'
import { Route, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import GA from '../components/analytics'
import { viewActions } from '../_actions'
// import Urlsend from '../_urlhistory/Urlsend'

const ga = new GA()
// const url = new Urlsend()
let mapDispatchToProps = dispatch => ({
  changePath: (title, path, withoutBase) => dispatch(viewActions.changePath(title, path, withoutBase))
})
const ProtectedRoutesWithGuard = connect(null, mapDispatchToProps)(withRouter((props) => {
  // eslint-disable-next-line no-undef
  // const detaildedObj = JSON.parse(sessionStorage.getItem('detailedObj'))
  // console.log(detaildedObj, 'private')

  // if (detaildedObj && detaildedObj.PageLocation !== window.location.href) {
  //   // eslint-disable-next-line no-undef
  //   sessionStorage.removeItem('activeStep')
  //   // eslint-disable-next-line no-undef
  //   sessionStorage.removeItem('detailedObj')
  // }
  const { Component } = props
  const token = localStorage.getItem('id_token')
  // console.log('Props', props)
  props.changePath(props.title, props.location.pathname, props.withoutBase)
  if (!token) {
    return (
      <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )
  }
  if (!props.roles || props.roles.length === 0) {
    return (
      <React.Fragment><CssBaseline /><Component {...props} /></React.Fragment>
    )
  }
  const roles = props.roles.map(ele => {
    return ele.toLowerCase()
  })

  const userProfile = JSON.parse(localStorage.getItem('user_profile'))
  if (roles.includes(userProfile.personal_info.role.toLowerCase())) {
    return (
      <React.Fragment><CssBaseline /><Component {...props} /></React.Fragment>
    )
  }

  props.history.push('/dashboard')
  return null
}))

const PrivateRoute = ({ component: Component, roles, title, withoutBase, ...rest }) => {
  ga.initializeReactGA()
  ga.pageViews()
  // console.log(JSON.parse(localStorage.getItem('user_profile')).personal_info, 'nulllllll')
  // url.sendurl()
  return <Route {...rest} render={() => <ProtectedRoutesWithGuard withoutBase={withoutBase} roles={roles} title={title} Component={Component} />} />
}

export default PrivateRoute
// return <Route {...rest} render={props => (
//   localStorage.getItem('id_token')
//     ? (<React.Fragment><CssBaseline /><OMSBase><Component {...props} /></OMSBase></React.Fragment>)
//     : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
// )}
