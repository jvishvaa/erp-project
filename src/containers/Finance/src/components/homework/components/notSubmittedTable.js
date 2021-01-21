import React, { useState, useEffect } from 'react'

import {
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TablePagination,
  TableFooter
} from '@material-ui/core'
import axios from 'axios'
import { useSelector } from 'react-redux'

import { CircularProgress } from '../../../ui'
import { urls } from '../../../urls'
import { TablePaginationAction } from '../../../utils'

const getStatus = (type) => {
  switch (type) {
    case 'E': {
      return 'evaluated'
    }
    case 'NS': {
      return 'nonsubmitted'
    }
    default: {
      return 'nonevaluated'
    }
  }
}

const WorkSubmission = ({
  type,
  id,
  alert,
  isOnlineClass
}) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [data, setData] = useState([])
  const [totalDataCount, setTotalDataCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const user = useSelector(state => state.authentication.user)

  useEffect(() => {
    console.log('table Comp: ')
    if (id) {
      const status = getStatus(type)
      let params = {
        page_no: page + 1,
        page_size: rowsPerPage,
        status
      }
      if (!isOnlineClass) {
        params = {
          ...params,
          teacher_report_id: id
        }
      } else {
        params = {
          ...params,
          online_class_id: id
        }
      }
      setIsLoading(true)
      axios.get(`${urls.HomeWorkSubmission}`, {
        params,
        headers: {
          Authorization: 'Bearer ' + user
        }
      }).then(res => {
        if (res.data) {
          res.data.data && setData(res.data.data)
          res.data.total_count && setTotalDataCount(res.data.total_count)
        }
        setIsLoading(false)
      }).catch(err => {
        console.error(err)
        setIsLoading(false)
        alert.warning('Something Went Wrong')
      })
    }
  }, [id, isOnlineClass, alert, rowsPerPage, page, type, user])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
    !rowsPerPage && setRowsPerPage(10)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  let circularProgress = null
  if (isLoading) {
    circularProgress = <CircularProgress open={isLoading} />
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {
        data.length ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S No.</TableCell>
                <TableCell>ERP</TableCell>
                <TableCell>Student Name</TableCell>
                {type !== 'NS' ? (
                  <TableCell>
                      Submissions
                  </TableCell>) : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow>
                  <TableCell>{index + 1 + (page * rowsPerPage)}</TableCell>
                  <TableCell>{item.erp}</TableCell>
                  <TableCell>{item.username.trim()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={6}
                  count={totalDataCount}
                  labelDisplayedRows={() => `${page + 1} of ${Math.ceil(+totalDataCount / (+rowsPerPage || 10))}`}
                  rowsPerPageOptions={[10, 20, 30, 40, 50]}
                  rowsPerPage={rowsPerPage || 10}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'Rows per page' }
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationAction}
                />
              </TableRow>
            </TableFooter>
          </Table>
        ) : (
          <Typography variant='caption'>
            No data Found
          </Typography>
        )
      }
      {circularProgress}
    </div>
  )
}

export default WorkSubmission
