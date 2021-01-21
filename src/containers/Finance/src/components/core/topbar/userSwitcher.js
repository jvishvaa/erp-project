import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'

export default function UserSwitcher (props) {
  let isParentLoggedIn = localStorage.getItem('parent_profile')
  let currentUserERP = JSON.parse(localStorage.getItem('user_profile')).erp
  let otherStudents = isParentLoggedIn && JSON.parse(localStorage.getItem('parent_profile')).student_details.filter(item => item.erp !== currentUserERP)
  return isParentLoggedIn ? <React.Fragment>
    {otherStudents.map(item => {
      return <MenuItem onClick={() => {
        localStorage.setItem('user_profile', JSON.stringify(item))
        localStorage.setItem('id_token', item.personal_info.token)
        localStorage.removeItem('ps_revision')
        window.location.reload()
      }}>{item.personal_info.first_name}</MenuItem>
    })}
  </React.Fragment> : ''
}
