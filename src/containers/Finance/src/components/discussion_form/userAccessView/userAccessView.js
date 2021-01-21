/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import {
  withStyles,
  Divider,
  Typography,
  Grid,
  Button,
  Paper,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  TableHead,
  TableCell,
  Table,
  TableBody,
  TableRow,
  IconButton,
  TablePagination,
  Switch,
  Modal,
  Backdrop
} from '@material-ui/core'
import axios from 'axios'
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import LastPageIcon from '@material-ui/icons/LastPage'
import CancelIcon from '@material-ui/icons/Cancel'
import styles from './userAccessView.style'
import Loader from '../loader'
import { discussionUrls } from '../../../urls'

const UserAccessView = ({ alert, classes }) => {
  const [auth] = useState(JSON.parse(localStorage.getItem('user_profile')))
  const [RoleId, setRoleId] = useState('')
  const [userId, setUserId] = useState('')
  const [accessView, setAccessView] = useState('')
  const [status, setStatus] = useState(false)
  const [loading, setLoading] = useState(false)

  const [rowsPerPage, setRowsPerPage] = React.useState(null)
  const [page, setPage] = React.useState(0)
  const [open, setOpen] = useState(false)
  const [updateUsersId, setUpdateUsersId] = useState('')
  const [userName, setuserName] = useState('')

  const [roleList, setRoleList] = useState([])
  const [userList, setUserList] = useState([])
  const acessViewList = [
    { id: 'Admin', name: 'Admin' },
    { id: 'SuperAdmin', name: 'SuperAdmin' },
    { id: 'Moderator', name: 'Moderator' }
  ]

  const [userAddedList, setUserAddedList] = useState([])

  function handleChangePage (event, newPage) {
    setPage(newPage)
    if (!rowsPerPage) {
      setRowsPerPage(10)
    }
  }

  function handleChangeRowsPerPage (event) {
    setRowsPerPage(event.target.value)
    setPage(0)
  }
  function firstPageChange () {
    setPage(0)
  }

  function lastPageChange (lastPage) {
    setPage(lastPage)
  };

  function functionTOGetRoles () {
    setLoading(true)
    const url = `${discussionUrls.roleListApi}`
    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        setRoleList(res.data)
        setLoading(false)
      }).catch(err => {
        console.log(err)
        setLoading(false)
      })
  }

  function functionToGetUsersAccessList () {
    setLoading(true)
    const url = `${discussionUrls.createandGetUserAccessViewApi}?page_size=${rowsPerPage || 10}&page=${page + 1}`
    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        setUserAddedList(res.data)
        setLoading(false)
      }).catch(err => {
        console.log(err)
        setLoading(false)
      })
  }

  function functionTOGetUserList () {
    setLoading(true)
    const url = `${discussionUrls.usersListApi}?role_id=${RoleId}`
    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        setUserList(res.data)
        setLoading(false)
      }).catch(err => {
        console.log(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (RoleId) {
      functionTOGetUserList()
      setUserId('')
    }
  }, [RoleId])

  useEffect(() => {
    if (auth) {
      functionTOGetRoles()
      functionToGetUsersAccessList()
    }
  }, [auth])

  useEffect(() => {
    if (auth) {
      functionToGetUsersAccessList()
    }
  }, [page, rowsPerPage])

  let loader = null
  if (loading) {
    loader = <Loader open />
  }

  function createUserView () {
    if (!RoleId) {
      alert.warning('select Role')
      return
    }
    if (!userId) {
      alert.warning('select User')
      return
    }
    if (!accessView) {
      alert.warning('select Access')
      return
    }
    setLoading(true)
    const url = discussionUrls.createandGetUserAccessViewApi
    axios
      .post(url, {
        'access': accessView,
        'user': userId,
        'is_active': true
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        if (res.status === 201) {
          alert.success('User Successfully Created')
          handleClose()
          functionToGetUsersAccessList()
          setLoading(false)
        } else if (res.status === 302) {
          alert.warning('User Already Exist')
          setLoading(false)
        } else if (res.status !== 302 && res.status !== 201) {
          alert.warning('some thing went wrong please try again')
          setLoading(false)
        }
      }).catch(err => {
        console.log(err)
        alert.warning('User Already Exist')
        setLoading(false)
      })
  }

  function updateUserViewFunction () {
    const url = `${discussionUrls.updateUserAccessApi}${updateUsersId}/update_user_access/`
    setLoading(true)
    axios
      .put(url, {
        'access': accessView,
        'user': userId,
        'is_active': status
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.personal_info.token}`
        }
      }).then(res => {
        if (res.status === 200) {
          alert.success('User View Updated Successfully')
          functionToGetUsersAccessList()
          handleClose()
          setLoading(false)
        } else if (res.status !== 200) {
          alert.warning('User Already Exist')
          setLoading(false)
        }
      }).catch(err => {
        console.log(err)
        alert.warning('User Already Exist')
        setLoading(false)
      })
  }

  const handleClose = () => {
    setOpen(false)
    setStatus(false)
    setUserId('')
    setuserName('')
    setAccessView('')
    setUpdateUsersId('')
  }
  function modalOpen () {
    let modal = null
    modal = (
      <>
        <Modal
          aria-labelledby='transition-modal-title'
          aria-describedby='transition-modal-description'
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500
          }}
        >
          <Paper className={classes.paper}>
            <Typography variant='h5'>Edit Sub Category</Typography>
            <Divider className={classes.divider} />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12}>
                <Typography>User Name : {userName}</Typography>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl margin='dense' required fullWidth>
                  <InputLabel> Select Assess View </InputLabel>
                  <Select
                    label='select Access'
                    placeholder='Select Access*'
                    value={accessView || ''}
                    onChange={(e) => setAccessView(e.target.value)}
                  >
                    <MenuItem key={1} value={1} disabled>
                  Select Access
                    </MenuItem>
                    {acessViewList && acessViewList.length !== 0 && acessViewList.map(item => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <Typography>Set This User as Active/InActive :</Typography>
                    In Active
                <Switch
                  checked={status || false}
                  value={status || false}
                  onChange={(e) => setStatus(e.target.checked)}
                  color='primary'
                />Active
              </Grid>
              <Grid item md={12} xs={12} style={{ marginTop: '8px', textAlign: 'center' }}>
                <Button
                  color='primary'
                  variant='contained'
                  size='large'
                  onClick={() => updateUserViewFunction()}
                >
                     Update User Access
                </Button>
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
          </Paper>
        </Modal>
      </>
    )
    return modal
  }

  function functionToOpemUpdateModel (user, assess, id, statusInfo) {
    setUserId(user.id)
    setuserName(user.first_name)
    setAccessView(assess)
    setUpdateUsersId(id)
    setStatus(statusInfo)
    setOpen(true)
  }

  return (
    <>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item md={3} xs={12}>
            <FormControl margin='dense' required fullWidth>
              <InputLabel> Select Role </InputLabel>
              <Select
                label='select Role'
                placeholder='Select Role *'
                fluid
                search
                selection
                value={RoleId || ''}
                onChange={(e) => setRoleId(e.target.value)}
              >
                <MenuItem key={1} value={1} disabled>
                  Select Role
                </MenuItem>
                {roleList && roleList.length !== 0 && roleList.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.role_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl margin='dense' required fullWidth>
              <InputLabel> Select User </InputLabel>
              <Select
                label='select User'
                placeholder='Select User*'
                value={userId || ''}
                onChange={(e) => setUserId(e.target.value)}
              >
                <MenuItem key={1} value={1} disabled>
                  Select User
                </MenuItem>
                {userList && userList.length !== 0 && userList.map(item => (
                  <MenuItem key={item.id} value={item.user.id}>
                    {item.user.first_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <FormControl margin='dense' required fullWidth>
              <InputLabel> Select Assess View </InputLabel>
              <Select
                label='select Access'
                placeholder='Select Access*'
                value={accessView || ''}
                onChange={(e) => setAccessView(e.target.value)}
              >
                <MenuItem key={1} value={1} disabled>
                  Select Access
                </MenuItem>
                {acessViewList && acessViewList.length !== 0 && acessViewList.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12}>
            <Button
              variant='contained'
              color='primary'
              style={{ marginTop: '20px' }}
              onClick={() => createUserView()}
            >Add User</Button>
          </Grid>
        </Grid>
      </Paper>
      <Divider className={classes.divider} />
      <Paper>
        {userAddedList && userAddedList.results && userAddedList.results.length !== 0 &&
        <Table>
          <TableHead>
            <TableRow>
              <TableCell float='left'>
                <Typography>S.No</Typography>
              </TableCell>
              <TableCell float='left'>
                <Typography>User Name</Typography>
              </TableCell>
              <TableCell float='left'>
                <Typography>Access</Typography>
              </TableCell>
              <TableCell float='left'>
                <Typography>Status</Typography>
              </TableCell>
              <TableCell float='left'>
                <Typography>Edit</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userAddedList && userAddedList.results && userAddedList.results.length !== 0 && userAddedList.results.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell float='left'>
                  <Typography>{index + 1}</Typography>
                </TableCell>
                <TableCell float='left'>
                  <Typography>{(item.user && item.user.first_name) || ''}</Typography>
                </TableCell>
                <TableCell float='left'>
                  <Typography>{item.access}</Typography>
                </TableCell>
                <TableCell float='left'>
                  {item.is_active
                    ? <CheckCircleRoundedIcon style={{ color: 'green' }} /> : <CancelIcon style={{ color: 'red' }} />
                  }
                </TableCell>
                <TableCell float='left'>
                  <Button color='primary' variant='contained' onClick={() => functionToOpemUpdateModel(item.user, item.access, item.id, item.is_active)}>Update</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        }
        {userAddedList && userAddedList.results && userAddedList.results.length !== 0 &&
        <Table>
          <TableBody>
            <TableRow>
              <TablePagination
                colSpan={6}
                labelDisplayedRows={() => `Page ${page + 1} of ${+userAddedList.total_pages}`}
                rowsPerPageOptions={[5, 10, 20, 30]}
                count={+userAddedList.count}
                rowsPerPage={rowsPerPage || 10}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'Rows per page' }
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
              <TableCell style={{ marginTop: '13px' }}>
                <IconButton
                  onClick={firstPageChange}
                  disabled={page === 0 || page === 1}
                >
                  <FirstPageIcon />
                </IconButton>
                <IconButton
                  onClick={() => lastPageChange(userAddedList.total_pages - 1)}
                  disabled={page === (+userAddedList.total_pages - 1)}
                >
                  <LastPageIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        }
      </Paper>
      {modalOpen()}
      {loader}
    </>
  )
}

export default withStyles(styles)(UserAccessView)
