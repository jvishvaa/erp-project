import React from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import { urls } from '../urls'

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
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
})

export class Scholarship extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      statement: '',
      name: '',
      email: '',
      applicantId: ''
    }
  }
  componentDidMount () {
    console.clear()
    let status = this.props.match.params.status
    let url = ''
    if (status === 'admit') {
      url = urls.ApplicantAdmit
    } else if (status === 'scholarship') {
      url = urls.ApplicantScholarship
    }
    axios
      .get(url + '?user_id=' + this.props.match.params.userId +
        '&secretkey=' + this.props.match.params.key, {
      })
      .then(res => {
        let data = JSON.parse(res.data)
        this.setState({
          statement: data['statement'],
          name: data['username'],
          email: data['email'],
          applicantId: data['applicant_id']
        })
      })
      .catch(error => {
        console.log("Error: Couldn't fetch data from ")
        console.log(error)
      })
  }

  render () {
    const { classes } = this.props
    return <main className={classes.main}>
      <CssBaseline />
      <Paper elevation={1} className={classes.paper}>
        <img src={require('./logo.png')} alt='' width='350px' />
        <Typography component='h1' variant='h5'>
          {this.state.statement}
        </Typography>
        <br />
        <p><h4>Name: {this.state.name}</h4></p>
        <p><h4>Applicant id: {this.state.applicantId}</h4></p>
        <p><h4>Applicant email: {this.state.email}</h4></p>
      </Paper>
    </main>
  }
}

export default (withRouter(withStyles(styles)(Scholarship)))
