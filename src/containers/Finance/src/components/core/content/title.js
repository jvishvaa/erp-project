import React from 'react'
import { connect } from 'react-redux'

class Title extends React.Component {
  render () {
    return this.props.title ? this.props.title : ''
  }
}

const mapStateToProps = state => ({
  title: state.view.title
})
export default connect(mapStateToProps)(Title)
