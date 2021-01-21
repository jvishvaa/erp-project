import React from 'react'

import { Button, Grid } from '@material-ui/core'
import { CheckCircleOutline } from '@material-ui/icons'

import NavigationBar from './navigationBar'
import { RouterButton } from '../../../ui'

import Filters from './filters'
import NotSubmittedHomeworks from './notSubmittedHomeworks'
import './toolbar.css'

const viewDashboard = {
  label: 'Homework Dashboard',
  color: 'blue',
  href: '/homework/dashboard',
  disabled: false
}
function Toolbar ({ data, cards, submittable, handleRouteChange, submitRemarksHandler, openEvaluationWindow, isEvaluated, alert }) {
  let params = (new URL(document.location)).searchParams
  // const [personalInfo] = useState(JSON.parse(localStorage.getItem('user_profile')).personal_info).role

  let path = params.get('path')
  let isSubmittable = true
  cards.forEach((card) => {
    if (card.media) {
      let extension = card.media.split('.').pop().toLowerCase()
      if (extension === 'jpg' || extension === 'png' || extension === 'jpeg') {
        if (!card.corrected) {
          isSubmittable = false
        }
      }
    }
  })
  return <div className='homework-mobile-toolbar'>
    <div className='homework-mobile-row'>

      <NavigationBar
        data={data}
        handleRouteChange={handleRouteChange}
        alert={alert} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={2} sm={2} style={{ display: 'contents' }}>
          <Grid style={{ padding: '20px', position: 'relative' }}>
            <RouterButton style={{ position: 'absolute', right: -150, top: 20 }} value={viewDashboard} color='primary' />
          </Grid>
        </Grid>
      </Grid>
      { (path && path.includes('submission')) && <div style={{ padding: 10 }}>{isEvaluated
        ? <div style={{ padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircleOutline /> Evaluated</div>
        : (isSubmittable
          ? <Button onClick={submitRemarksHandler}>
             Submit
          </Button>
          : 'Please evaluate images to submit.')}</div>
      }
    </div>
    <div style={{ flexDirection: 'row-reverse' }} className='homework-mobile-row'>

      <Filters
        cards={cards}
        data={data}
        submittable={submittable}
        alert={alert}
        isEvaluated={isEvaluated}
        submitRemarksHandler={submitRemarksHandler}
        openEvaluationWindow={openEvaluationWindow}
        handleRouteChange={handleRouteChange} />
      {path === 'online_class_homeworks' &&
      <NotSubmittedHomeworks alert={alert} />
      }
    </div>
  </div>

  // <div className='homework-toolbar'>
  //   <NavigationBar
  //     data={data}
  //     handleRouteChange={handleRouteChange}
  //     alert={alert} />
  //   <Filters
  //     cards={cards}
  //     data={data}
  //     submittable={submittable}
  //     alert={alert}
  //     isEvaluated={isEvaluated}
  //     submitRemarksHandler={submitRemarksHandler}
  //     openEvaluationWindow={openEvaluationWindow}
  //     handleRouteChange={handleRouteChange} />
  // </div>
}

export default Toolbar
