import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Paper, withStyles, Grid } from '@material-ui/core'

const styles = theme => ({
  root: {
    borderRadius: 0,
    padding: 0,
    backgroundColor: '#f0f0f0',
    position: 'sticky',
    top: 64,
    zIndex: 1000,
    transition: theme.transitions.create(
      [`all`],
      { duration: 300 }
    )
  },
  floatRight: {
    float: 'right'
  }
})

class Toolbar extends Component {
  constructor () {
    super()
    this.state = {
      myRef: React.createRef()
    }
    this.handleScroll = this.handleScroll.bind(this)
  }
  componentDidMount () {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll () {
    let data = ReactDOM
      .findDOMNode(this.refs['paper']) && ReactDOM
      .findDOMNode(this.refs['paper'])
      .getBoundingClientRect()
    if (data.y === 64) {
      this.setState({ positioned: true })
    } else {
      this.setState({ positioned: false })
    }
  }

  render () {
    let { classes, style: userDefinedStyle } = this.props
    return <Paper id='toolbar' className={classes.root} ref='paper' elevation={this.state.positioned ? 1 : 0}>
      <Grid
        direction='row'
        justify='flex-start'
        alignItems='center'
        style={{ padding: 4, ...this.props.containerStyle, ...userDefinedStyle }}
        container>
        {this.props.children}
        <Grid item direction='row' className={classes.floatRight} style={{ marginLeft: 'auto' }}>{this.props.floatRight}</Grid>
      </Grid>
    </Paper>
  }
}
export default withStyles(styles)(Toolbar)
