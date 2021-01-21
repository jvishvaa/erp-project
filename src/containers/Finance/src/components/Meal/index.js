import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Button,
  Grid,
  Checkbox, FormControlLabel
} from '@material-ui/core/'
import { useSelector } from 'react-redux'

import { urls } from '../../urls'

const Meal = ({ alert }) => {
  const user = useSelector(state => state.authentication.user)
  const [mealUrl, setMealUrl] = useState('')
  const [mealUrl2, setMealUrl2] = useState('')
  const [mealData, setMealData] = useState(null)
  const [checked, setCheck] = useState(null)
  useEffect(() => {
    if (user) {
      axios.get(urls.SchoolMeal, {
        headers: {
          Authorization: `Bearer ${user}`
        }
      }).then(res => {
        setMealData(res.data)
        setMealUrl(res.data && res.data.url)
      }).catch(error => {
        console.error(error)
        if (error.response && (error.response.status === 400 || error.response.status === 404)) {
          alert.warning(error.response.data.err_msg)
        } else {
          alert.warning('Unable To get Status')
        }
      })
    }
  }, [user, alert])

  const handleChange = (e) => {
    console.log(e.target.checked)
    setCheck(e.target.checked)
  }

  const handleContinue = () => {
    if (!checked) {
      alert.warning('Agree the terms and conditions')
    }
    let body = {
      agreement: mealData.terms_and_conditions.id
    }
    axios.post(urls.scoolMealAtStudent, body, {
      headers: {
        Authorization: `Bearer ${user}`
      }
    }).then(res => {
      setMealUrl2(res.data.url)
      if (res.status === 201) {
        if (user) {
          axios.get(urls.SchoolMeal, {
            headers: {
              Authorization: `Bearer ${user}`
            }
          }).then(res => {
            setMealData(res.data)
            console.log('data', res.data)
            console.log('urls', res.data.url)
          }).catch(error => {
            console.error(error)
            if (error.response && (error.response.status === 400 || error.response.status === 404)) {
              window.alert(error.response.data.err_msg)
            } else {
              window.alert('Unable To get Status')
            }
          })
        }
      }
    }).catch(error => {
      console.error(error)
      if (error.response && (error.response.status === 400 || error.response.status === 404)) {
        window.alert(error.response.data.err_msg)
      } else {
        window.alert('Unable To get Status')
      }
    })
  }
  if (mealUrl2) {
    window.open(mealUrl2)
  }

  return (
    <Grid container style={{ marginTop: '40px' }} justify='center'>
      {mealData && !mealData.is_agree
        ? <React.Fragment>
          <Grid item xs={12}>
            <div style={{ fontSize: 12, lineHeight: 12, padding: '10px 60px' }}>
              <div style={{ fontSize: 12, lineHeight: 12, height: '200px', overflowY: 'scroll' }}>
                <p style={{ color: '#e50000', fontSize: 16 }}>IMPORTANT: PLEASE GO THROUGH BELOW TERMS AND CONDITIONS.</p>
                {mealData.terms_and_conditions.agreement.split('\n').map((item, i) => <p key={i}>{item}</p>)}
              </div>
              <FormControlLabel
                control={
                  <Checkbox checked={checked} onChange={handleChange} value='checked' />
                }
                label='I agree to the Terms and Conditions'
              />
              <Button
                color='primary'
                variant='contained'
                size='medium'
                disabled={!checked}
                onClick={handleContinue}
              >
                Continue
              </Button>
            </div>
          </Grid>
        </React.Fragment>
        : <Grid item xs={4}>
          {mealUrl ? (<Button
            color='primary'
            variant='contained'
            size='medium'
          >
            <a
              href={mealUrl || ''}
              target='_blank'
              style={{ color: 'white' }}
            >
              Go To Scool Meal
            </a>
          </Button>) : null}
        </Grid>}
    </Grid>
  )
}

export default Meal
