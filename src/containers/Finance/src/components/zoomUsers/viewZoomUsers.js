import React, { useState, useEffect, useCallback } from 'react'
import ReactTable from 'react-table'
import { Toolbar, Chip } from '@material-ui/core'
// import EditIcon from '@material-ui/icons/EditOutlined'
import axios from 'axios'
import { RouterButton } from '../../ui'
import { qBUrls } from '../../urls'

const addZoomUser = {
  label: 'Add zoom user to ERP',
  color: 'blue',
  href: '/zoomusers/create',
  disabled: false

}
const ZoomUsers = (props) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const role = JSON.parse(localStorage.getItem('user_profile')) && JSON.parse(localStorage.getItem('user_profile')).personal_info.role
  console.log(role)

  const getZoomUsers = useCallback(() => {
    setLoading(true)
    axios.get(qBUrls.ZoomUser, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        'Content-Type': 'multipart/formData'
      }

    }).then(res => {
      setLoading(false)

      setUsers(res.data.data)
    })
      .catch(error => {
        console.log(error)
        setLoading(false)

        props.alert.error('Unable to fetch data')
      })
  }, [props.alert])

  useEffect(() => { getZoomUsers() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [currentPage, setCurrentPage, setUsers, setLoading])

  console.log(users)

  return (
    <React.Fragment>

      <Toolbar>

        <RouterButton value={addZoomUser} />

      </Toolbar>
      <ReactTable

        data={users}

        defaultPageSize={5}
        showPageSizeOptions
        loading={loading}
        columns={
          [
            {

              Header: 'Sr.no',
              Cell: row => {
                return (row.index + 1)
              },
              sortable: true,

              width: 60
            },
            {
              id: 'username',
              Header: <div >User</div>,

              accessor: val => {
                if (val.username !== null) {
                  return val.username
                } else {
                  return val.email
                }
              },

              sortable: true

            },
            {
              id: 'password',
              Header: <div className='student' >Password</div>,

              accessor: val => {
                return <input type='password' value={val.password} style={{ border: 'none' }} autoComplete='new-password' />
              },
              sortable: true

            },
            {
              id: 'iSActive',
              Header: <div className='student'>Status</div>,
              accessor: val => {
                return <Chip
                  color='primary'
                  label={
                    val.is_active
                      ? 'Active'
                      : 'In Active'
                  }
                />
              },
              sortable: true,
              width: 100

            },
            {
              id: 'iSDelete',
              Header: <div className='student'>Deleted</div>,
              accessor: val => {
                return <bold>{val.is_delete ? 'Yes' : 'No'}</bold>
              },
              sortable: true,
              width: 80

            },
            {
              id: 'id',
              Header: <div className='student'>Edit</div>,
              accessor: val => {
                return (

                  <RouterButton
                    label='Edit'
                    icon='edit'
                    color='blue'
                    value={{
                      basic: 'basic',
                      href: `/zoomusers/edit/${val.id}/`
                    }}
                    id={val.id}

                  />

                )
              }
            }

          ]}

      />
    </React.Fragment>
  )
}
export default ZoomUsers
