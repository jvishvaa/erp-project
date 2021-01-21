import React, { useState } from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'

import { Grid, Card, CardHeader, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Divider } from '@material-ui/core'
import Rating from '@material-ui/lab/Rating'
import { OmsSelect } from '../../../ui'

const useStyles = makeStyles({
  table: {
    minWidth: 350
  }
})

const StyledTableCell = withStyles((theme) => ({
  head: {
    // backgroundColor: theme.palette.common.black,
    color: theme.palette.common.black
  },
  body: {
    fontSize: 14,
    'border-bottom': 'none'

  }
}))(TableCell)

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      'padding-left': '14vh',
      'border-bottom': 'none'

    }
  }
}))(TableRow)
function RatingDistubution (props) {
  const { branches, defaultValBranch } = props
  const classes = useStyles()

  const { facebookRating } = props
  //   const [ sites ] = useState([{ value: '1', label: 'Google' }, { value: '1', label: 'Facebook' }])
  const [ sites ] = useState([{ value: '1', label: 'Facebook' }])

  //   const [ googleRating ] = useState(2)
  const handleBranches = (e) => {
    props.toggle(e)
  }
  return (

    <React.Fragment>
      <Grid item xs={12} sm={12} md={12} className='graphs__dashbord'>
        <Card style={{ borderRadius: '9px', border: '1px solid rgb(202, 239, 243)', width: 'auto', 'height': '50vh' }} >
          <CardHeader
            title={<p style={{ width: '95px', marginLeft: '12px', color: '#5d1049', 'font-weight': '500', 'font-family': 'sans-serif', display: 'contents' }}>Rating Distribution</p>}

          />
          <CardContent >
            <div>

              <OmsSelect
                className='ratings__analytics'
                label='Branch'
                placeholder='Select'
                options={
                  branches
                    ? branches.map(val => ({
                      value: val.id,
                      label: val.name
                    })) : []
                }
                change={handleBranches}
                defaultValue={defaultValBranch}

              />
            </div>

            <Table aria-label='customized table' className={classes.table}>
              <TableHead>
                <TableRow >

                  <div style={{ display: 'flex', marginTop: '5vh' }}>

                    <h3 style={{ marginLeft: '6vh' }}>Site</h3>
                    <h3 style={{ marginLeft: '35vh', marginTop: '-1vh' }}>Avg Rating</h3>
                  </div>
                  <Divider />
                </TableRow>
              </TableHead>
              <TableBody>

                <TableCell >

                  {sites.map((row) => (
                    <StyledTableRow key={row.label}>
                      <StyledTableCell component='th' scope='row' align='right' style={{ 'border-bottom': 'none' }}>
                        {

                          row.label === 'Google'
                            ? <div style={{ marginLeft: '-125px', display: 'flex' }} >

                              {/* <img src={require('../images/google.svg')} alt='' width='280px' height='25vh' /> */}

                            </div>

                            : <div style={{ marginLeft: '-125px', display: 'flex' }}>

                              <img src={require('../images/facebook.svg')} alt='' width='320px' height='40vh' />
                            </div>
                        }

                      </StyledTableCell>
                      <StyledTableCell align='right'>
                        <Rating
                          style={{ 'margin-top': '3vh' }}
                          readOnly
                          precision={0.5}
                          size='large'
                          value={row.label === 'Google' ? '' : facebookRating}

                        />

                      </StyledTableCell>

                    </StyledTableRow>
                  ))}
                </TableCell>

              </TableBody>
            </Table>

          </CardContent>

        </Card>
      </Grid>
    </React.Fragment>
  )
}
export default RatingDistubution
