
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import LastPageIcon from '@material-ui/icons/LastPage'
import TableFooter from '@material-ui/core/TableFooter'
import TablePagination from '@material-ui/core/TablePagination'
import PropTypes from 'prop-types'
import { PieChart } from 'react-minimal-pie-chart'
import moment from 'moment'
import axios from 'axios'
import Icon from '@material-ui/core/Icon'

import { urls } from '../../../urls'

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  }
})

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0)
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1)
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1)
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
    )
  };

  render () {
    const { classes, count, page, rowsPerPage, theme } = this.props

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label='First Page'
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label='Previous Page'
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label='Next Page'
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label='Last Page'
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    )
  }
}
TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired
}

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions
)

const StyledTableCell = withStyles(theme => ({
  head: {
    fontSize: 14,
    borderRight: '1px solid #d0cdcd',
    borderTop: '1px solid #d0cdcd'
  },
  body: {
    fontSize: 12,
    borderRight: '1px solid #d0cdcd'
  }
}))(TableCell)

const styles = {
  card: {
    minWidth: 275,
    width: '100px',
    marginLeft: '144px',
    marginTop: '12px',
    height: '204px',
    backgroundImage: 'linear-gradient(  #FFFBDE, #FFFFFF  )'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  previousCard: {
    minWidth: 275,
    width: '100px',
    marginLeft: '589px',
    marginTop: '-195px',
    height: '195px'
  },
  topClasses: {
    minWidth: 254,
    marginTop: '9px',
    marginLeft: '3px'

  },
  root: {
    width: '100%'
    // marginTop: spacing.unit * 3
  },
  table: {
    minWidth: 500
  },
  tableWrapper: {
    overflowX: 'auto'
  }

}
// const ratingsArray = [1, 2, 3, 4, 5]

class StudentReviewForTeacher extends Component {
  constructor () {
    super()
    this.state = {

      page: 0,
      rowsPerPage: 5,
      top3Classes: [],
      lowest3classes: [],
      percentageDistribution: [],
      lastWeekPercentageDistribution: [],
      currentWeekAvgRating: [],
      previousWeekAvgRating: [],
      previousWeeks: [],
      showText: false

    }
  }
  componentDidMount () {
    this.teacherView()
  }

  teacherView (state, pageSize) {
    let url = urls.StudentReview
    axios
      .get(url, {

        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({ teacherView: res.data,
            top3Classes: res.data.this_week && res.data.this_week.top_3_classes,
            lowest3classes: res.data.this_week && res.data.this_week.bottom_3_classes,
            previousWeeks: res.data.previous_weeks,
            percentageDistribution: res.data.this_week && res.data.this_week.percentage_distribution,
            lastWeekPercentageDistribution: res.data.last_week && res.data.last_week.percentage_distribution,
            currentWeekAvgRating: res.data.this_week && res.data.this_week.this_weeks_average_rating,
            previousWeekAvgRating: res.data.last_week && res.data.last_week.average_rating,
            showText: true
          })
        }
      })
      .catch(error => {
        // this.setState({ teacherView: data })

        this.props.alert.error('No Data')
        console.log(error)
      })
  }
  handleChangePage = (event, page) => {
    this.setState({ page })
  };

  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value })
  };
  render () {
    const sample = []
    this.state.percentageDistribution && this.state.percentageDistribution.map(item => {
      let number = Number(Object.keys(item).join('')); console.log(number, 'number')
      let color
      let emoji
      switch (number) {
        case 1: color = '#FF5078'; emoji = '😞'
          break
        case 2: color = '#71E2D1'; emoji = '😕'
          break
        case 3: color = '#FFA55C'; emoji = '😐'
          break
        case 4: color = '#D259CF'; emoji = '😊'
          break
        case 5: color = '#30EC90'; emoji = '😃'
          break
        default:
          break
      }
      sample.push({ title: emoji, value: item[Number(Object.keys(item).join(''))], color })
    })
    console.log(sample, 'sample')
    /// //previous //////////
    const previousRatings = []
    this.state.lastWeekPercentageDistribution && this.state.lastWeekPercentageDistribution.map(item => {
      let number = Number(Object.keys(item).join('')); console.log(number, 'number')
      let color
      let emoji
      switch (number) {
        case 1: color = '#FF5078'; emoji = '😞'

          break
        case 2: color = '#71E2D1'; emoji = '😕'
          break
        case 3: color = '#FFA55C'; emoji = '😐'
          break
        case 4: color = '#D259CF'; emoji = '😊'
          break
        case 5: color = '#30EC90'; emoji = '😃'
          break
        default:
          break
      }
      previousRatings.push({ title: emoji, value: item[Number(Object.keys(item).join(''))], color })
    })

    // console.log(data.previous_weeks.map(item => item.start_date), 'previous')

    const { rowsPerPage, page, showText } = this.state
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.state.previousWeeks.length - page * rowsPerPage)

    const { classes } = this.props
    // const bull = <span className={classes.bullet}>•</span>
    return (
      <React.Fragment>
        <div>
          {!window.isMobile ? <div >
            <h3 style={{ marginTop: '101px', marginLeft: '54px', fontSize: '30px' }}>   {this.state.currentWeekAvgRating && this.state.currentWeekAvgRating} </h3>
            {showText && <Typography style={{ marginTop: '-13px', marginLeft: '23px' }}>  Average Rating</Typography>}
            <br />
            {showText && <Typography style={{ marginTop: '-13px', marginLeft: '23px' }}>  Current Week</Typography>}
          </div>
            : <div style={{ marginTop: '-53px', marginLeft: '92px' }}>
              <h3 style={{ marginTop: '101px', marginLeft: '54px', fontSize: '30px' }}>   {this.state.currentWeekAvgRating && this.state.currentWeekAvgRating} </h3>
              {showText && <Typography style={{ marginTop: '-13px', marginLeft: '23px' }}>  Average Rating</Typography>}
              <br />
              {showText && <Typography style={{ marginTop: '-13px', marginLeft: '23px' }}>  Current Week</Typography>}
            </div>}
          <div>
            {!window.isMobile && <PieChart style={{ marginLeft: '-234px', height: '200px', marginTop: '-151px' }}
              // label={(item) => item.title}
              data={
                sample
              }
              label={({ dataEntry }) => { return `${dataEntry.value}%( ${dataEntry.title} )` }}
              labelStyle={(index) => ({
                fill: sample[index].color,
                fontSize: '7px',
                fontFamily: 'sans-serif'
              })}
              radius={42}
              labelPosition={112}

              // label={({ dataEntry }) => (dataEntry.value) + dataEntry.title}

            />}
          </div>

          {!window.isMobile && <PieChart style={{ marginLeft: '165px', height: '200px', marginTop: '-202px' }}
            data={
              previousRatings
            }
            label={({ dataEntry }) => { return `${dataEntry.value}%( ${dataEntry.title} )` }}
            labelStyle={(index) => ({
              fill: previousRatings[index].color,
              fontSize: '7px',
              fontFamily: 'sans-serif'
            })}
            radius={42}
            labelPosition={112}
          />}

          {/* <Icon>add_circle</Icon>'jhjhjh'
        <Typography variant='srOnly'>Create a user</Typography> */}

          {!window.isMobile ? <div style={{ marginLeft: '86%', marginTop: '-241px' }}>
            <h3 style={{ marginTop: '101px', marginLeft: '54px', fontSize: '30px' }}>   {this.state.previousWeekAvgRating && this.state.previousWeekAvgRating} </h3>
            {showText && <Typography style={{ marginTop: '-13px', marginLeft: '23px' }}>  Average Rating</Typography>}
            <br />
            {showText && <Typography style={{ marginTop: '-13px', marginLeft: '23px' }}>  Previous Week</Typography>}
          </div>
            : <div style={{ marginLeft: '250px', marginTop: '-188px' }}>
              <h3 style={{ marginTop: '101px', marginLeft: '54px', fontSize: '30px' }}>   { this.state.previousWeekAvgRating && this.state.previousWeekAvgRating} </h3>
              {showText && <Typography style={{ marginTop: '-13px', marginLeft: '23px' }}>  Average Rating</Typography>}
              <br />
              {showText && <Typography style={{ marginTop: '-13px', marginLeft: '23px' }}>  Previous Week</Typography>}
            </div>}

          {!window.isMobile && <div style={{ marginLeft: '50px' }}>
            <Icon style={{ color: '#FF5078', marginTop: '67px', marginLeft: '333px' }}>circle</Icon><p style={{ marginLeft: '309px', marginTop: '-27px', fontSize: '17px' }}>😞</p>
            <Icon style={{ color: '#71E2D1', marginTop: '-52px', marginLeft: '397px', marginBottom: '33px' }}>circle</Icon><p style={{ marginLeft: '374px', marginTop: '-60px', fontSize: '17px' }}>😕</p>
            <Icon style={{ color: '#FFA55C', marginTop: '-39px', marginLeft: '461px', marginBottom: '33px' }}>circle</Icon><p style={{ marginLeft: '437px', marginTop: '-61px', fontSize: '17px' }}>😐</p>
            <Icon style={{ color: '#D259CF', marginTop: '-38px', marginLeft: '525px', marginBottom: '29px' }}>circle</Icon><p style={{ marginLeft: '502px', marginTop: '-57px', fontSize: '17px' }}>😊</p>
            <Icon style={{ color: '#30EC90', marginTop: '-38px', marginLeft: '589px', marginBottom: '31px' }}>circle</Icon><p style={{ marginLeft: '566px', marginTop: '-59px', fontSize: '17px' }}>😃</p>
          </div>}
          <div style={{ marginTop: '15px' }}>
            <Typography style={{ fontSize: '17px', marginLeft: '10px' }} variant='h6' component='h4' >
          Top 3 Clases rating of current week
            </Typography>

            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <StyledTableCell align='center'>Sr.No</StyledTableCell>
                  <StyledTableCell align='center'>Class Title</StyledTableCell>
                  <StyledTableCell align='center'>Class Date</StyledTableCell>
                  <StyledTableCell align='center'>Subject</StyledTableCell>
                  <StyledTableCell align='center'>Average Class Rating</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.top3Classes && this.state.top3Classes.map((row, index) => (
                  <TableRow key={row.id}>
                    <StyledTableCell align='center' component='th' scope='row'>
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell align='center'>{row.class_title}</StyledTableCell>
                    <StyledTableCell align='center'>{moment(row.class_date).format('MMMM Do YYYY')}</StyledTableCell>
                    <StyledTableCell align='center'>{row.subject }</StyledTableCell>
                    <StyledTableCell align='center'>{row.average_rating}</StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Typography style={{ fontSize: '17px', marginTop: '29px', marginLeft: '10px' }} variant='h6' component='h4' >
          Lowest 3 Clases rating of current week
          </Typography>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <StyledTableCell align='center'>Sr.No</StyledTableCell>
                <StyledTableCell align='center'>Class Title</StyledTableCell>
                <StyledTableCell align='center'>Class Date</StyledTableCell>
                <StyledTableCell align='center'>Subject</StyledTableCell>
                <StyledTableCell align='center'>Average Class Rating</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.lowest3classes && this.state.lowest3classes.map((row, index) => (
                <TableRow key={row.id}>
                  <StyledTableCell align='center' component='th' scope='row'>
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell align='center'>{row.class_title}</StyledTableCell>
                  <StyledTableCell align='center'>{moment(row.class_date).format('MMMM Do YYYY')}</StyledTableCell>
                  <StyledTableCell align='center'>{row.subject }</StyledTableCell>
                  <StyledTableCell align='center'>{row.average_rating}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Typography style={{ fontSize: '17px', marginTop: '29px', marginLeft: '10px' }} variant='h6' component='h4' >
         Weekly Class Details
          </Typography>
          <Paper className={classes.root}>
            <div className={classes.tableWrapper}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    {/* <StyledTableCell align='center'>Sr.No</StyledTableCell> */}
                    <StyledTableCell align='center'>Start Date</StyledTableCell>
                    <StyledTableCell align='center'>End Date</StyledTableCell>
                    <StyledTableCell align='center'>Total Classes</StyledTableCell>
                    <StyledTableCell align='center'>Average Rating</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.previousWeeks && this.state.previousWeeks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                    <TableRow key={row.id}>
                      {/* <StyledTableCell align='center' component='th' scope='row'>
                      {index + 1}
                    </StyledTableCell> */}
                      <StyledTableCell align='center'>{moment(row.start_date).format('MMMM Do YYYY')}</StyledTableCell>
                      <StyledTableCell align='center'>{moment(row.end_date).format('MMMM Do YYYY')}</StyledTableCell>
                      <StyledTableCell align='center'>{row.total_classes}</StyledTableCell>

                      <StyledTableCell align='center'>{row.average_rating}</StyledTableCell>

                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 48 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      colSpan={3}
                      count={this.state.previousWeeks.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      SelectProps={{
                        native: true
                      }}
                      onChangePage={this.handleChangePage}
                      onChangeRowsPerPage={this.handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActionsWrapped}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </Paper>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(mapStateToProps, null)(
  withStyles(styles)(withRouter(StudentReviewForTeacher)))
