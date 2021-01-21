import React, { useState, useEffect } from 'react'

import {
  Typography,
  Divider,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Button,
  TablePagination,
  TableFooter
} from '@material-ui/core'
import axios from 'axios'
import { useSelector } from 'react-redux'

import { Modal, CircularProgress } from '../../../ui'
import { urls } from '../../../urls'
import SubmissionModal from './submissionModal'
import { TablePaginationAction } from '../../../utils'

const allowedRoles = ['Principal', 'AcademicCoordinator', 'Teacher', 'Admin', 'LeadTeacher', 'EA Academics']

const getTitle = (type) => {
  switch (type) {
    case 'E': {
      return 'Evaluated Submissions'
    }
    case 'NS': {
      return 'Not Submitted Students List'
    }
    default: {
      return 'Not Evaluated Submmissions List'
    }
  }
}

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
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [role, setRole] = useState(() => {
    const userProfile = JSON.parse(localStorage.getItem('user_profile'))
    if (userProfile && userProfile.personal_info) {
      const personalInfo = userProfile.personal_info
      const { role } = personalInfo
      return role
    }
    return 'Teacher'
  })
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [data, setData] = useState([])
  const [totalDataCount, setTotalDataCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const user = useSelector(state => state.authentication.user)

  useEffect(() => {
    const userProfile = JSON.parse(localStorage.getItem('user_profile'))
    const personalInfo = userProfile.personal_info
    const { role } = personalInfo
    setRole(role)
  }, [])

  useEffect(() => {
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

  const isAllowedRole = () => {
    return allowedRoles.includes(role)
  }

  const viewSubmissionHandler = (submissionData) => {
    setSelectedSubmission(submissionData)
    setIsOpen(true)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
    !rowsPerPage && setRowsPerPage(10)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  let submissionModal = null
  if (isOpen) {
    submissionModal = (
      <Modal
        open={isOpen}
        click={() => setIsOpen(false)}
        large
      >
        <SubmissionModal
          type={type}
          data={selectedSubmission}
          id={id}
          alert={alert}
          closeModal={() => setIsOpen(false)}
        />
      </Modal>
    )
  }

  let circularProgress = null
  if (isLoading) {
    circularProgress = <CircularProgress open={isLoading} />
  }

  return (
    <div>
      <Typography variant='h6'>
        {getTitle(type)}
      </Typography>
      <Divider />
      {
        data.length ? (
          <Paper variant='elevation' style={{ overflowX: 'scroll' }}>
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
                    {type !== 'NS' && isAllowedRole() ? (
                      <TableCell>
                        <Button
                          variant='outlined'
                          color='primary'
                          onClick={() => viewSubmissionHandler(item)}
                        >
                          View Submission
                        </Button>
                      </TableCell>) : null}
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
          </Paper>
        ) : (
          <Typography variant='caption'>
            No data Found
          </Typography>
        )
      }
      {submissionModal}
      {circularProgress}
    </div>
  )
}

export default WorkSubmission
