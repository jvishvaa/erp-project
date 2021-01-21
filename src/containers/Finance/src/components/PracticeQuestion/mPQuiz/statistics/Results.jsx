import React, { Component } from 'react'
import { TableBody, Table, TableHead, TableRow, withStyles } from '@material-ui/core'
import ImportContactsIcon from '@material-ui/icons/ImportContacts'
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary'
import { StyledQuizTableCell, StyledQuizTableRow } from './StyledTable'

const styles = theme => ({
  table: {
    minWidth: 700
  }
})

class Results extends Component {
  render () {
    const { results = [], classes } = this.props
    return (
      <React.Fragment>
        <Table className={classes.table} aria-label='customized table'>
          <TableHead>
            <TableRow>
              <StyledQuizTableCell>{''}</StyledQuizTableCell>
              {results[0].chapter_data.map((row) => (
                <StyledQuizTableCell colSpan={row.test_data.length}>
                  <LocalLibraryIcon fontSize='large' style={{ margin: '0px 15px -10px 0px', color: '#eb8f83' }} />
                  {row.chapter_name}
                </StyledQuizTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <StyledQuizTableCell>Name of Students</StyledQuizTableCell>
              {results[0].chapter_data.map(row => {
                return row.test_data.map(test => {
                  return <StyledQuizTableCell style={{ textTransform: 'capitalize' }}>
                    <ImportContactsIcon fontSize='large' style={{ margin: '0px 15px -10px 0px', color: 'rgb(142, 235, 131)' }} />
                    {test.test_name}
                  </StyledQuizTableCell>
                })
              })}
            </TableRow>
            {
              results.map((item, index) => {
                return (
                  <StyledQuizTableRow key={index}>
                    <StyledQuizTableCell>{item.student_name}</StyledQuizTableCell>
                    {
                      item.chapter_data.map(chapter => {
                        return chapter.test_data.map(mark => (
                          <StyledQuizTableCell>{mark.percentage}</StyledQuizTableCell>
                        ))
                      })
                    }
                  </StyledQuizTableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Results)
