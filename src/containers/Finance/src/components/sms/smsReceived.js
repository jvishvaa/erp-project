import React, { useState, useEffect } from 'react'
import CardHeader from '@material-ui/core/CardHeader'
import { CardContent } from 'semantic-ui-react'
import SmsIcon from '@material-ui/icons/Sms'
import Card from '@material-ui/core/Card'
import { connect } from 'react-redux'
import axios from 'axios'
import { apiActions } from '../../_actions'
import { urls } from '../../urls'
import './sms_received.css'

const SmsReceived = props => {
  console.log(props)
  const [msg, setMsg] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchdata = () => {
      if (currentPage === 1) {
        axios
          .get(`${urls.StudentSMS}?page_number=${currentPage}`, {
            headers: { Authorization: 'Bearer ' + props.user }

          }).then((res) => {
            console.log(res.data.sms)
            setMsg(res.data.sms)
          }).catch(e => {
            console.log('error', e)
          })
      }
    }
    fetchdata()
  }, [currentPage, props.user])

  function handleScroll (event) {
    const { target } = event
    console.log(target)
    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      axios.get(`${urls.StudentSMS}?page_number=${currentPage + 1}`, {
        headers: {
          Authorization: 'Bearer ' + props.user
        }
      })
        .then(res => {
          if (res.data.length) {
            setCurrentPage(currentPage + 1)
            setMsg([...msg, ...res.data])
          }
        })
    }
  }
  return (
    <div className='sms-received-container' onScroll={handleScroll}>{msg.length > 0 && msg.map(i => { return (<div><Card className='card-wrapper'><SmsIcon /><CardHeader /><CardContent style={{ padding: '0px 0px 20px 50px' }}>{i.sms_content}</CardContent></Card>    </div>) })}
    </div>

  )
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  roles: state.roles.items,
  smsTypes: state.smsTypes.items
})

const mapDispatchToProps = dispatch => ({
  loadRoles: dispatch(apiActions.listRoles()),
  loadSmsTypes: () => dispatch(apiActions.listSmsTypes())
})

export default connect(mapStateToProps, mapDispatchToProps)(SmsReceived)
