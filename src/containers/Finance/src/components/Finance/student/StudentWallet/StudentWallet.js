import React, { useEffect, useState } from 'react'
import { Grid, Button } from '@material-ui/core'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'
// import '../../../css/staff.css'
import './Wallet.css'
import { apiActions } from '../../../../_actions'
import { urls } from '../../../../urls'
import AllStudentTrasection from './AllStudentTransaction'
import Layout from '../../../../../../Layout'

function StudentWallet (props) {
  var currBrnch = JSON.parse(localStorage.getItem('user_profile'))
  const [ allTransaction, setallTransaction ] = useState()
  const [ success, setSuccess ] = useState(false)
  const [loading, setLoading] = useState()

  useEffect(() => {
    setLoading(true)
    if (currBrnch.current_acad_session && currBrnch.erp) {
      let url = `${urls.StudentWallet}?academic_year=${currBrnch.current_acad_session}&student=${currBrnch.erp}`
      axios
        .get(url, {
          headers: {
            'Authorization': 'Bearer ' + props.user
          }
        })
        .then(res => {
          setLoading(false)
          setallTransaction(res.data[0])
        })
        .catch(error => {
          props.alert.error('Error Occured')
          console.log(error)
        })
    }
  }, [currBrnch.current_acad_session, currBrnch.erp, props.alert, props.user])

  const handleClick = () => {
    if (success) {
      setSuccess(false)
    } else {
      setSuccess(true)
    }
  }
  if (allTransaction) {
  }

  return (
    <Layout>    <div>
      {
        !loading
          ? allTransaction
            ? <Grid container spacing={3}>
              <Grid item xs={6} md={4} lg={4} >
                <div className='wallet'>
                  <div className='wallet-icon'> <AccountBalanceWalletIcon fontSize='large' color='primary' />  </div>
                  { allTransaction
                    ? <div>&#8377;{allTransaction.reaming_amount}</div> : null
                  }
                </div>
              </Grid>
              <Grid item xs={3} md={4} >
                <div className='button'>
                  <Button
                    fontSize='20px'
                    color='primary' variant='contained'
                    onClick={handleClick}
                  >
                    {
                      success
                        ? 'close Details' : 'view transaction'
                    }
                  </Button>
                </div>
              </Grid>
            </Grid> : <div style={{ textAlign: 'center', fontSize: '20px', marginTop: '140px', fontStyle: 'italic' }}> No remaining amount is available yet </div> : <div style={{ alignItems: 'center' }}> <CircularProgress /></div>
      }
      {
        success
          ? <div className='react-table'>
            <AllStudentTrasection />
          </div> : null
      }
    </div>
    </Layout>
  )
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions())
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(StudentWallet)))
