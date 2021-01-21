import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 60
  }
})

function AssessStatTable (props) {
  const { classes, data } = props
  // rows format --> { id, name, score, maxScore, percent: ((score / maxScore) * 100).toFixed(0) + '%' }
  const rows = data.online_test_assessment_response.map((item, ind) => {
    let score = item.assessment_score
    let maxScore = item.assessment_max_score
    let percent = score / maxScore
    percent = isNaN(percent) ? '--' : (percent * 100).toFixed(1) + '%'
    return { id: ind, name: item.assessment.name_assessment, score, maxScore: maxScore || '--', percent }
  })
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Assessment name</TableCell>
            <TableCell align='right'>Your score</TableCell>
            <TableCell align='right'>Max score</TableCell>
            <TableCell align='right'>percent %</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableCell component='th' scope='row'>
                {row.name}
              </TableCell>
              <TableCell align='right'>{row.score}</TableCell>
              <TableCell align='right'>{row.maxScore}</TableCell>
              <TableCell align='right'>{row.percent}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

AssessStatTable.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(AssessStatTable)
