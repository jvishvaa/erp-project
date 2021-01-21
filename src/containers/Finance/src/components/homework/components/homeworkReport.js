import React from 'react'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { connect } from 'react-redux'
import withStyles from '@material-ui/core/styles/withStyles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import axios from 'axios'
import * as moment from 'moment'
import { Grid } from 'semantic-ui-react'
import {
  Button,
  Input
} from '@material-ui/core'
import { Toolbar } from '../../../ui'
import { urls } from '../../../urls'
import './toolbar.css'
import Download from '../../../assets/download.png'
import NoData from './images/noData.png'

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4
  }
})

class HomeworkReport extends React.Component {
  state={
    fileUrl: '',
    loading: true,
    // loadingLabel: 'Loading ...',
    reportDate: '',
    from: '',
    to: ''

  }
  onDate =(e) => {
    // console.log('dataaa', e.target.value)
    this.setState({ reportDate: e.target.value })
  }

  getReport =() => {
    const { reportDate } = this.state
    const date = moment(reportDate).format('DD-MM-YYYY')
    axios.get(`${urls.HomeWorkReport + `?date=` + date}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(({ data }) => {
        // console.log('Data', data.data)
        this.setState({ fileUrl: data.data, loading: false })
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
        }
        console.log(error.response)
      })
    const from = moment(reportDate).add(-2, 'days').toDate()
    const from1 = moment(from).format('DD-MM-YYYY')
    const to = moment(reportDate).add(-1, 'days').toDate()
    const to1 = moment(to).format('DD-MM-YYYY')
    this.setState({ from: from1, to: to1 })
  }
  handleUpload =() => {
    // console.log('fahad', this.state.fileUrl)
    setTimeout(() => {
      const response = {
        file: this.state.fileUrl
      }
      window.open(response.file)
    }, 100)
  }

  render () {
    const { fileUrl, from, to } = this.state
    return (
      <React.Fragment>

        <Toolbar>
          <Grid>
            <Grid item style={{ margin: '0px 10px', display: 'block' }}>
              <label>Report date:</label><br />
              <Input type='date' value={this.state.reportDate} onChange={e => this.onDate(e)} />
            </Grid>
            <Grid style={{ margin: '0px' }}>
              <Button variant='contained' style={{ margin: 0 }} color='primary' onClick={() => this.getReport()}>
              Get Report
              </Button>
            </Grid>
          </Grid>
        </Toolbar>

        <Grid.Column >
          {fileUrl
            ? <Table style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' }} size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Report Type</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell >To</TableCell>
                  <TableCell >Download</TableCell>
                </TableRow>
              </TableHead>
              <TableBody >
                {/* {selectedItems.map(row => ( */}
                <TableRow >
                  <TableCell >2 days</TableCell>
                  <TableCell >{from}</TableCell>
                  <TableCell >{to}</TableCell>
                  <TableCell onClick={() => this.handleUpload()}><img src={Download} width='15px' /></TableCell>
                </TableRow>
                {/* ))} */}
              </TableBody>
            </Table>
            : <div style={{ display: 'flex', position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', textAlign: 'center', background: '#fff' }} >
              <span style={{ 'margin-left': '450px', 'margin-top': '150px', backgroundImage: `url(${NoData})`, backgroundRepeat: 'no-repeat', width: '396px' }}>&nbsp;</span>
            </div>}

        </Grid.Column>

      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(
  mapStateToProps
)(withStyles(styles)(HomeworkReport))
