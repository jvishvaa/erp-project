import React from 'react'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import Title from './title'
import './header.css'

class Content extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false,
      marginTop: 0,
      withoutBase: props.withoutBase
    }
    this.role = ''
  }
  componentWillMount () {
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
  }
  shouldComponentUpdate (nextProps, prevState) {
    if (nextProps.withoutBase !== prevState.withoutBase) {
      return true
    }
    return false
  }
  render () {
    // console.log('Route changed', this.props)
    return !this.props.withoutBase ? <div id='title-header' style={{ marginTop: this.role === 'Student' && 40 }}>
      <Typography variant='h4' style={{ color: '#fff', marginLeft: 24, marginTop: 24 }}>
        <Title />
      </Typography>
    </div> : ''
  }
}

const mapStateToProps = state => ({
  withoutBase: state.view.withoutBase
})

export default connect(mapStateToProps, null)(Content)
