// commented lines are used for google api integartion as of now it is on hold

import React, { useState, useEffect, useCallback } from 'react'
// import axios from 'axios'
import { Grid, CardContent, Card } from '@material-ui/core'
import axios from 'axios'
import { qBUrls } from '../../../urls'
import { OmsSelect, InternalPageStatus } from '../../../ui'
import ExpenseChart from './expensesChart'
import ImpressionVsClicks from './impressionVsclicks'
// import FeedbackDistubution from './feedbackDistubution'
import RatingDistubution from './ratingDistrubution'
import '../styles/dashbord.css'

function FbAndGoogleDataAnalytics (props) {
  const [token] = useState(JSON.parse(localStorage.getItem('user_profile')).personal_info.token)
  const [facebookRating, setFacebookRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [ defaultVal, setDefaultValue ] = useState({ label: 'Weekly', value: '2' })
  const [ defaultValBranch, setDefaultValueBranch ] = useState({ label: '', value: '' })

  // const [defaultValBranch, setDefaultValBranch] = useState({})
  const [dateRangeValues] = useState([{ value: '1', label: 'Today' }, { value: '2', label: 'Weekly' }, { value: '3', label: 'Monthly' }]
  )

  const [branches, setBranches] = useState([{}])
  const [fplottedLineGraph, setFPlottedLineGraph] = useState({
    data1: [],
    Facebooklabels: [],
    plotteedColors: ['#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff'],
    fill: '#27ae60'

  })
  // const [gplottedLineGraph, setGPlottedLineGraph] = useState({
  //   data2: [],
  //   Facebooklabels: [],
  //   plotteedColors: [],

  //   fill: '#27ae60'

  // })
  const [facebookClicks, setFacebookClicks] = useState({
    data1: [],
    Facebooklabels: [],
    plotteedColors: [],

    fill: '#27ae60',
    fbClicks: true

  })
  const [facebookImpressions, setFacebookImpressions] = useState({
    data2: [],
    Facebooklabels: [],
    plotteedColors: [],
    fill: '#27ae60',
    fbImpressions: true

  })

  // const [feedbackDistubution] = useState({
  //   data: [5, 4.3, 2, 1, 5],
  //   labels: ['mon', 'tues', 'wed', 'thu', 'fri'],
  //   plotteedColors: [],
  //   fill: '#27ae60'

  // })

  const getExpenses = useCallback((val) => {
    let url = ''
    setLoading(true)
    if (val === 'Today') {
      url = qBUrls.FaceBookInsights + '?date_present=today'
    } else if (val === 'Monthly') {
      url = qBUrls.FaceBookInsights + '?date_present=last_30d'
    } else if (val === undefined || val === 'Weekly') {
      url = qBUrls.FaceBookInsights + '?date_present=last_7d'
    }
    let isToday = val === 'Today'

    console.log(isToday)

    axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(res => {
      setLoading(false)
      setFPlottedLineGraph({ ...fplottedLineGraph,
        Facebooklabels: isToday ? [res.data.date_start] : res.data && res.data.total_data.map(val => Object.keys(val)),
        data1: isToday ? [Number(res.data.spend)] : res.data && res.data.total_data.map(val => Object.values(val).map(item => Number(item.spend))).flat(),
        plotteedColors: [ '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff' ]

      })
      // setGPlottedLineGraph({ ...gplottedLineGraph,
      //   Facebooklabels: res.data && res.data.total_data.map(val => Object.keys(val)),
      //   data2: res.data && res.data.total_data.map(val => Object.values(val).map(item => Number(item.spend))).flat(),
      //   plotteedColors: ['#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff']

      // })

      setFacebookClicks({ ...facebookClicks,
        Facebooklabels: isToday ? [res.data.date_start] : res.data && res.data.total_data.map(val => Object.keys(val)),
        data1: isToday ? [Number(res.data.inline_link_clicks)] : res.data && res.data.total_data.map(val => Object.values(val).map(item => Number(item.inline_link_clicks))).flat(),
        plotteedColors: ['#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB', '#7DD8FB']

      })
      setFacebookImpressions({ ...facebookImpressions,
        Facebooklabels: isToday ? [res.data.date_start] : res.data && res.data.total_data.map(val => Object.keys(val)),
        data2: isToday ? [Number(res.data.impressions)] : res.data && res.data.total_data.map(val => Object.values(val).map(item => Number(item.impressions))).flat(),
        plotteedColors: [ '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff', '#0000ff' ]

      })
    }).catch(err => {
      setLoading(false)
      setFPlottedLineGraph({ ...fplottedLineGraph,
        Facebooklabels: '',
        data1: []

      })
      setFacebookClicks({ ...facebookClicks,
        Facebooklabels: '',
        data1: []
      })
      setFacebookImpressions({ ...facebookImpressions,
        Facebooklabels: '',
        data2: []
      })
      if (err.response && err.response.data.length === 0) {
        props.alert.warning('Zero data found for the selected date range')
      } else {
        props.alert.error('Failed to fetch data,please reload the page')
      }
    })
  }, [facebookClicks, facebookImpressions, fplottedLineGraph, props.alert, token])

  const ratings = useCallback((pageId) => {
    setLoading(true)
    let ratingsUrl
    if (pageId !== undefined) {
      ratingsUrl = `${qBUrls.FacebookPageRating}?page_id=${pageId}`
    } else {
      ratingsUrl = qBUrls.FacebookPageRating
    }
    axios.get(ratingsUrl, {
      headers: {
        Authorization: 'Bearer ' + token

      }
    }).then(res => {
      setLoading(false)
      if (pageId === undefined) {
        let rating = res.data && res.data.data[0] && res.data.data[0].overall_star_rating
        setFacebookRating(rating)
        setBranches(res.data.data)
        setDefaultValueBranch({ value: res.data && res.data.data[0] && res.data.data[0].id,
          label: res.data && res.data.data[0] && res.data.data[0].name
        })
      } else {
        let rating = res.data.overall_star_rating
        setFacebookRating(rating)
      }
    }).catch(err => {
      setLoading(false)
      console.log(err)
      props.alert.error('Failed to fetch data,please reload the page')
    })
  }, [props.alert, token])

  const handleBranches = (event) => {
    ratings(event.value)
    setDefaultValueBranch({ value: event.value, label: event.label })
  }
  useEffect(() => {
    getExpenses()
    ratings()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const handleDateRange = (event) => {
    setDefaultValue(event)
    getExpenses(event.label)
  }
  return (
    <React.Fragment>
      <div className='dashboard__header__mgmt' style={{ display: loading ? 'none' : '' }} />

      <div style={{ display: 'flex' }} />
      {
        loading ? <InternalPageStatus />
          : <Grid container spacing={2} style={{ marginTop: '-30px', marginLeft: '10px', width: '98%', marginBottom: '10px' }}>

            <RatingDistubution facebookRating={facebookRating} branches={branches} defaultValBranch={defaultValBranch} toggle={handleBranches} />
            <Grid item xs={12} sm={12} md={12} className='graphs__dashbord'>
              <Card style={{ borderRadius: '9px', border: '1px solid rgb(202, 239, 243)', width: 'auto', 'height': 'auto' }} >

                <CardContent >
                  <OmsSelect
                    className='omselect__phase2'
                    label='Date range'
                    placeholder='Select'
                    options={
                      dateRangeValues
                        ? dateRangeValues.map(val => ({
                          value: val.value,
                          label: val.label
                        })) : []
                    }
                    change={handleDateRange}
                    defaultValue={defaultVal}

                  />
                  <ExpenseChart expenses={{ ...fplottedLineGraph }} />
                  <ImpressionVsClicks impressionsAndClicks={{ ...facebookClicks, ...facebookImpressions }} />

                </CardContent>
              </Card>
            </Grid>

            {/* <FeedbackDistubution feedbackDistubution={{ ...feedbackDistubution }} /> */}

          </Grid>
      }

    </React.Fragment>
  )
}

export default FbAndGoogleDataAnalytics
