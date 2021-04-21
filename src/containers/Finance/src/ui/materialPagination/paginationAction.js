import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
// import TextField from '@material-ui/core/TextField'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputAdornment from '@material-ui/core/InputAdornment'
// import Table from '@material-ui/core/Table'
// import TableBody from '@material-ui/core/TableBody'
// import TableCell from '@material-ui/core/TableCell'
// import TableFooter from '@material-ui/core/TableFooter'
// import TablePagination from '@material-ui/core/TablePagination'
// import TableRow from '@material-ui/core/TableRow'
// import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import LastPageIcon from '@material-ui/icons/LastPage'

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
    width: '100'
  },
  textField: {
    width: '15ch'
  }
})

class PaginationActions extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      item: this.props.page + 1
    }
  }
    handleFirstPageButtonClick = event => {
      this.setState({ item: 1 })
      this.props.onChangePage(event, 0)
    };

    handleBackButtonClick = event => {
      let { item } = this.state
      this.setState({ item: item - 1 })
      this.props.onChangePage(event, this.props.page - 1)
    };

    handleNextButtonClick = event => {
      let { item } = this.state

      this.setState({ item: Number(item) + 1 })
      this.props.onChangePage(event, this.props.page + 1)
    };

    handleLastPageButtonClick = event => {
      // let { PageCount } = this.state
      this.setState({ item: Math.ceil(this.props.count / this.props.rowsPerPage) })
      this.props.onChangePage(
        event,
        Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
      )
    };
    handlePage = (e) => {
      let { item } = this.state
      if (e.target.value === item) {
        // eslint-disable-next-line eqeqeq
        if (e.target.value == 0) {
          this.props.onChangePage(e, Number(e.target.value + 1) - 1)
          this.setState({ item: item + 1 })
        } else {
          this.props.onChangePage(e, Number(item) - 1)
        }
      }
    }
    handlePageInput =(e, PageCount) => {
      let { item } = this.state
      let value = e.target.value
      if (value <= PageCount && value !== null && value !== item) {
        // eslint-disable-next-line eqeqeq
        this.setState({ item: value })
      }
    }
    handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        this.handlePage(e)
      }
    }
    render () {
      const { classes, count, page, rowsPerPage, theme } = this.props
      let { item } = this.state
      let PageCount = Math.ceil(this.props.count / this.props.rowsPerPage)
      let value = PageCount === 0 ? 0 : item
      return (
        <div className={classes.root}>
          <OutlinedInput
            className={classes.textField}
            id='outlined-adornment-weight'
            label='Size'
            variant='outlined'
            size='small'
            type='number'
            defaultValue={PageCount}
            value={value}
            onKeyDown={e => e.target.value !== null ? this.handleKeyDown(e) : ''}
            // onMouseOut={e => e.target.value !== null ? window.setTimeout(this.handlePage(e), 1000) : ''}
            onChange={e => this.handlePageInput(e, PageCount)}
            // onChange={e => e.target.value <= PageCount && e.target.value !== null && e.target.value !== item ? this.setState({ item: e.target.value }) : PageCount}
            inputProps={{ maxLength: PageCount.toString().length }}
            endAdornment={<InputAdornment style={{ width: 100 }}position='end'>of {PageCount}</InputAdornment>}
            aria-describedby='outlined-weight-helper-text'
            labelWidth={0}
          />

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

PaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired
}

const PaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  PaginationActions
)

export default PaginationActionsWrapped
