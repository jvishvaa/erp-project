import React, { useState, useEffect } from 'react'
import {
  withStyles,
  Typography,
  Grid,
  Table,
  TableCell,
  TableRow,
  TablePagination,
  TableHead,
  TableBody,
  Switch
} from '@material-ui/core'
import axios from 'axios'
import styles from './discussionDashboard.style'
import GradeRow from './GradeRow'
import Loader from '../loader'
import { discussionUrls } from '../../../urls'

const DiscussionDashbard = ({ classes }) => {
  const [auth] = useState(JSON.parse(localStorage.getItem('user_profile')))
  const [loading, setloading] = useState(false)
  const [BranchData, setBranchData] = useState('')
  const [withStudentCount, setwithStudentCount] = useState(false)

  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  let loader = null
  if (loading) {
    loader = <Loader open />
  }

  useEffect(() => {
    if (auth) {
      setloading(true)
      const api = withStudentCount ? discussionUrls.discussionDashboardWithStudentCountApi : discussionUrls.discussionDashboardApi
      axios
        .get(api, {
          headers: {
            Authorization: 'Bearer ' + auth.personal_info.token
          }
        })
        .then(res => {
          if (res.status === 200) {
            setBranchData(res.data)
            setloading(false)
          } else {
            console.log('error')
            setloading(false)
          }
        })
        .catch(error => {
          console.log(error)
          setloading(false)
        })
    }
  }, [auth, withStudentCount])

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={12} xs={12} style={{ textAlign: 'center', padding: '20px' }}>
          Post Wise
          <Switch
            checked={withStudentCount}
            onChange={(e) => setwithStudentCount(e.target.checked)}
            color='primary'
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
          Student wise
        </Grid>
        {BranchData && BranchData.length === 0 &&
        <Grid item md={12} xs={12}>
          <Typography variant='h4' styles={{ color: 'blue', textAlign: 'center' }}>Records Not Found</Typography>
        </Grid>
        }
        {BranchData && BranchData.length !== 0 &&
          <Grid item md={12} xs={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell float='left'>Action</TableCell>
                  <TableCell float='left'>S.No</TableCell>
                  <TableCell float='left'>Branch</TableCell>
                  {withStudentCount && <TableCell float='left'> No of Students </TableCell>}
                  <TableCell float='left'>Total posts in 24 hours</TableCell>
                  <TableCell float='left'>Total post in 7 days</TableCell>
                  <TableCell float='left'>Overall total Post count</TableCell>
                  {withStudentCount && <TableCell float='left'> Percentage Interaction </TableCell>}
                  {!withStudentCount && <TableCell float='left'>Total posts deleted</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {BranchData && BranchData.length !== 0 &&
                BranchData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                  <GradeRow key={index + 1} rowId={index + 1} Branchdata={item} studentCount={withStudentCount} />
                ))
                }
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component='div'
              count={BranchData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Grid>}
      </Grid>
      {loader}
    </>
  )
}

export default withStyles(styles)(DiscussionDashbard)
