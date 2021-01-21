import { withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

const StyledQuizTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: 'black',
    textAlign: 'center',
    fontSize: 18,
    border: '1px solid grey',
    color: 'white'
  },
  body: {
    fontSize: 14,
    textAlign: 'center',
    border: '1px solid grey',
    textTransform: 'capitalize'
  }
}))(TableCell)

const StyledQuizTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover
    }
  }
}))(TableRow)

export { StyledQuizTableCell, StyledQuizTableRow }
