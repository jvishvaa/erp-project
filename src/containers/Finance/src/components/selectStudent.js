import React from 'react'
import { connect } from 'react-redux'

import CssBaseline from '@material-ui/core/CssBaseline'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import withStyles from '@material-ui/core/styles/withStyles'
import { Button } from '@material-ui/core'
import { userActions } from '../_actions'

const styles = theme => ({
  main: {
    width: '100',
    display: 'block', // Fix IE 11 issue.
    padding: '10px',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'hidden',
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  },
  button: {
    'background-color': '#00bfff'

  }
})

class SelectStudent extends React.Component {
  onSelect (index) {
    let userProfile = JSON.parse(localStorage.getItem('parent_profile')).student_details[index]
    localStorage.setItem('user_profile', JSON.stringify(userProfile))
    localStorage.setItem('id_token', JSON.parse(localStorage.getItem('parent_profile')).student_details[index].personal_info.token)
    window.location.reload()
  }
  handleLogout = () => {
    this.props.logout()
    this.setState({ anchorEl: null })
  }
  render () {
    let { classes } = this.props
    let students = JSON.parse(localStorage.getItem('parent_profile')).student_details
    let isActive = true
    if (students.length > 0) {
      isActive = students.map(student => student.personal_info.is_temporary_inactive)
    }
    console.log(isActive)

    return <main className={classes.main}>
      <CssBaseline />
      <Paper elevation={1} className={classes.paper}>
        <React.Fragment>

          <img src={require('./logo.png')} alt='' width='350px' />

          {
            isActive.includes(true) ? <div style={{ 'padding-left': '20px' }}>
              <h5>Your Account Seems To Be Inoperative. You Are Requested To Contact Our School's Front Office.</h5>
              <Button variant='contained'
                onClick={this.handleLogout}

                className={classes.button}

              >
                <img src={require('./logout.png')} alt='' />

                    &nbsp;&nbsp;&nbsp;Logout

              </Button>
            </div>

              : '' }

          <div style={{ margin: '20px' }} >

            <Typography style={{ marginTop: 20 }}component='h1' variant='h5'>

Select Student
            </Typography>
            <List style={{ width: '100%', marginBottom: 20 }}>
              {students.map((student, index) => {
                if (student.personal_info && !student.personal_info.is_temporary_inactive) {
                  return <ListItem
                    onClick={() => this.onSelect(index)} button>
                    <ListItemText
                      primary={student.personal_info.first_name}
                      secondary={student.erp} />
                  </ListItem>
                } else {
                  return <ListItem
                    disabled
                    onClick={() => this.onSelect(index)} button>

                    <ListItemText
                      primary={student.personal_info.first_name}
                      secondary={student.erp} />
                  </ListItem>
                }
              })}
            </List>

          </div>

        </React.Fragment>
      </Paper>
    </main>
  }
}
const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(userActions.logout())

})
const mapStateToProps = state => ({
  loggingIn: state.authentication.loggingIn,
  error: state.authentication.error
})
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SelectStudent))
