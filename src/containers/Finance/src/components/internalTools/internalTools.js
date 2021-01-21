import React, { Component } from 'react'
import axios from 'axios'
// import Button from '@material-ui/core/Button'
import ReactTable from 'react-table'
import { Grid } from 'semantic-ui-react'
import withStyles from '@material-ui/core/styles/withStyles'
import { connect } from 'react-redux'
// import { fade } from '@material-ui/core/styles/colorManipulator'
// import routerButton from '../../ui/routerButton'
import { Toolbar } from '../../ui'
import { urls } from './../../urls'
// import { IconButton } from '@material-ui/core'

const field = [
  {
    name: 'srNumber',
    displayName: 'Sr.'
  },
  {
    name: 'url',
    displayName: 'url'
  },
  {
    name: 'reported_datetime',
    displayName: 'Date&time'
  },
  {
    name: 'error_message',
    displayName: 'Error message'
  },
  {
    name: 'user',
    displayName: 'User'
  }
]
field.forEach(function (obj) {
  obj['inputFilterable'] = true
  obj['exactFilterable'] = true
  obj['sortable'] = true
})

const styles = theme => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15)
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20
  },
  details: {
    alignItems: 'center'
  },
  column: {
    flexBasis: '20%'
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
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
  },
  expandCol: {
    width: '5%'
  },
  expand: {
    transform: 'rotate(180deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    }),
    margin: 0,
    padding: 0
  },
  expandOpen: {
    transform: 'rotate(0deg)'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  grow: {
    flexGrow: 1
  }
})

class CrashReport extends Component {
  constructor () {
    super()
    this.state = {
      page: 0,
      rowsPerPage: 5
    }
  }
  componentDidMount () {
    // this.props.browserErrorMessage()
    // let { browserErrorMessage } = this.state
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role

    var updatedList = urls.BrowserErrorMessage // + '4'
    axios.get(updatedList, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then((res) => {
        this.setState({ browserErrorMessage: res.data.err_data })
        this.props.alert.success('Displaying Crash reports')
      })
      .catch(function (error) {
        console.log('Error: Couldnt fetch data from ' + urls.BrowserErrorMessage, error)
      })
  }

  render () {
    // let { browserErrorMessage } = this.state
    return (
      <React.Fragment>
        <Toolbar>
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <ReactTable
                  data={this.state.browserErrorMessage}
                  showPageSizeOptions={false}
                  defaultPageSize={5}

                  columns={[
                    {
                      Header: 'Url',
                      accessor: 'url',
                      width: 250,
                      Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
                    },
                    {
                      Header: 'Error message',
                      accessor: 'error_message',
                      width: 250,
                      Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
                    },
                    {
                      Header: 'Recorded Date and Time',
                      accessor: 'reported_datetime',
                      width: 250,
                      Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
                    },
                    {
                      Header: 'User',
                      accessor: 'user',
                      width: 250,
                      Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
                    }
                  ]}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Toolbar>
      </React.Fragment>
    )
  }
}
const mapStatetoProps = state => ({
  user: state.authentication.user
})

export default connect(mapStatetoProps)(withStyles(styles)(CrashReport))
