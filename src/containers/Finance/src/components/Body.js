
import withStyles from '@material-ui/core/styles/withStyles'
import classNames from 'classnames'

import OMSDashboard from './Dashboard'

const React = require('react')
// const { Toolbar, Filters: { NumericFilter, AutoCompleteFilter, MultiSelectFilter, SingleSelectFilter }, Data: { Selectors } } = require('react-data-grid-addons');

const styles = theme => ({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  contentOpen: {
    flexGrow: 1,
    overflowX: 'hidden',
    width: '80%',
    marginLeft: '20%',
    marginTop: 30,
    padding: theme.spacing.unit * 3
  },
  contentClose: {
    flexGrow: 1,
    overflowX: 'hidden',
    width: '97%',
    marginLeft: '3%',
    marginTop: 30,
    padding: theme.spacing.unit * 3
  }
})

class OMSBody extends React.Component {
  constructor (props, context) {
    super(props, context)
    console.log('loading body')
    console.log(props.match)
    this.state = {
      m: 'default',
      comp: <OMSDashboard />
    }
  }

  componentWillMount () {
    if (typeof (this.props.match) !== 'undefined') {
      this.setState({ m: this.props.match.path })
    } else {
      this.setState({ m: 'first run' })
    }
    console.log('***', this.state)
    console.log('+++', this.props.match)
  }
  render () {
    const { classes } = this.props
    return (
      <main className={classNames(classes.contentOpen, {
        [classes.contentClose]: !this.props.parentState,
        [classes.contentOpen]: this.props.parentState
      })} />
    )
  }
}

export default withStyles(styles, { withTheme: true })(OMSBody)
