import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { connect } from 'react-redux'
import Paper from '@material-ui/core/Paper'
import 'firebase/messaging'
import { TopBar, ContentStart } from './core'
import { renderRoutes } from '../_components'
import routes from '../routes'
import aolRoutes from '../aol_routes'
// Do not remove this dynamic import for sidebar
const Sidebar = React.lazy(() => import('./core/sidebar'))
const drawerWidth = 240

const styles = theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },

  menuButton: {
    marginLeft: 8,
    marginRight: 16
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  drawerOpen: {
    width: drawerWidth,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: 64,
    [theme.breakpoints.up('sm')]: {
      width: 64
    }
  },
  listItemTextOpen: {
    opacity: 1.0,
    display: 'block',
    minWidth: 150,
    transition: theme.transitions.create(['all'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  bodyContentClose: {
    minWidth: 'calc( 100vw - 64px )',
    maxWidth: 'calc( 100vw - 64px )',
    transition: theme.transitions.create(['all'], {
      duration: 400
    })
  },
  bodyContentOpen: {
    minWidth: 'calc( 100vw - 240px )',
    maxWidth: 'calc( 100vw - 240px )',
    transition: theme.transitions.create(['all'], {
      duration: 400
    })
  },
  listItemTextClose: {
    opacity: 0.0,
    minWidth: 150,
    transition: theme.transitions.create(['all'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  expandIconOpen: {
    opacity: 1.0,
    transition: theme.transitions.create(['all'], {
      easing: theme.transitions.easing.sharp,
      duration: 1000
    })
  },
  expandIconClose: {
    opacity: 0.0,
    transition: theme.transitions.create(['all'], {
      easing: theme.transitions.easing.sharp,
      duration: 30
    })
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  grow: {
    flexGrow: 1
  },
  content: {
    flexGrow: 1
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200
      }
    }
  }

})

class OMSBase extends React.Component {
  constructor () {
    super()
    this.state = {
      user: {},
      noOfTimesSubscribed: 0,
      withoutBase: false
    }
  }

  render () {
    const { classes, theme, withoutBase } = this.props
    var user = JSON.parse(localStorage.getItem('user_profile'))
    return (
      <Router basename={process.env.REACT_APP_UI_ENV === 'dev' ? '/oms' : '/'}>
        { user && !withoutBase ? <div className={classes.root}>
          <CssBaseline />
          {user ? <TopBar alert={this.props.alert} classes={classes} /> : null}
          {user ? <Sidebar classes={classes} theme={theme} /> : null}
          <main className={classes.content}>
            <div>
              {user ? <ContentStart classes={classes} /> : null}
              <Paper id='content'
                style={{
                  marginTop: -50,
                  borderRadius: 0,
                  minHeight: '65vh',
                  position: 'relative',
                  transition: 'width 300ms',
                  display: 'flex',
                  flexDirection: 'column',
                  ...window.isMobileFunc() ? {}
                    : { marginLeft: 24,
                      marginRight: 24,
                      maxWidth: (document.documentElement.clientWidth > 600) ? 'calc(100vw - 112px)' : 'calc(100vw - 48px)'
                    }
                }}
              >
                <Switch>{renderRoutes(routes, { alert: this.props.alert })}</Switch>
              </Paper>
            </div>
            <div
              style={{ marginTop: 40, padding: 8, paddingTop: 24, paddingBottom: 24, flex: 1, backgroundColor: 'white', paddingLeft: 24, borderTop: '1px solid rgba(0,0,0,0.2)' }}>

              {window.location.host.includes('alwaysonlearning.com')
                ? <span>Copyright&copy; 2020, K12 Techno Services Pvt. Ltd. All Rights Reserved</span>
                : <span>Copyright&copy; 2019, K12 Techno Services Pvt. Ltd. All rights reserved.</span>}
            </div>
          </main>
        </div> : window.location.host.includes('alwaysonlearning.com') ? <Switch>{renderRoutes(aolRoutes, { alert: this.props.alert })}</Switch> : <Switch>{renderRoutes(routes, { alert: this.props.alert })}</Switch>}
      </Router>
    )
  }
}

const mapStateToProps = state => ({
  withoutBase: state.view.withoutBase
})

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps)(OMSBase))
