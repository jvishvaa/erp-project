import React, { useState, useEffect } from 'react'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import {
  Divider,
  makeStyles,
  Button,
  AppBar,
  Grid
} from '@material-ui/core'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AudioPlayerWrapper from './audioPlayerWrapper'
import { urls } from '../../../urls'
import { getSparseDate, getFormattedHrsMnts } from '../../../utils'
import { CircularProgress, Pagination } from '../../../ui'
import orchadioImg from '../../../assets/ORCHADIO.jpg'
import radio from './assets/radio.svg'
import styles from './orchadioListeners.styles'

const useStyles = makeStyles(styles)

const OrchadioListeners = ({
  alert,
  location,
  history
}) => {
  const [selectedDate, setSelectedDate] = useState()
  const [radioData, setRadioData] = useState([])
  const [showDate, setShowDate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInterestedInRJ, setIsInterestedInRJ] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [count, setCount] = useState(0)
  const rowsPerPage = 10
  const user = useSelector(state => state.authentication.user)
  const role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
  const userId = JSON.parse(localStorage.getItem('user_profile')).personal_info.user_id
  console.log(role, 'role')

  const classes = useStyles()

  useEffect(() => {
    if (location && location.state) {
      setSelectedDate(location.state.date || new Date())
      setShowDate(location.state.showDate)
    } else {
      setSelectedDate(new Date())
    }
  }, [location])

  const fetchOrchadioList = (pageNumber) => {
    if (selectedDate) {
      const [yyyy, mm, dd] = getSparseDate(selectedDate)
      setIsLoading(true)
      axios.get(`${urls.OrchadioList}?date=${yyyy}-${mm}-${dd}&page_number=${pageNumber + 1}&page_size=${rowsPerPage}`, {
        headers: {
          'Authorization': `Bearer ${user}`
        }
      }).then(res => {
        const { intrested_rj: interested = false } = res.data || {}
        if (res.data && res.data.data) {
          setRadioData(res.data.data)
          setCount(res.data.count)
        }
        setIsInterestedInRJ(interested)
        setIsLoading(false)
      }).catch(err => {
        console.error(err)
        setIsLoading(false)
        alert.warning('Something Went Wrong')
      })
    }
  }

  useEffect(() => {
    fetchOrchadioList(0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, user, alert])

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  const likeClickHandler = (id) => {
    const body = {
      radio_program_id: id
    }

    axios.post(`${urls.OrchadioLike}`, body, {
      headers: {
        Authorization: `Bearer ${user}`
      }
    }).then(res => {
      if (res.data && res.data.success === 'true') {
        const data = radioData.map(item => {
          if (item.id === id) {
            item.total_program_likes += 1
            item.is_liked = 'True'
          }
          return item
        })
        setRadioData(data)
      }

      if (res.data && res.data.success === 'false') {
        const data = radioData.map(item => {
          if (item.id === id) {
            item.total_program_likes -= 1
            item.is_liked = 'False'
          }
          return item
        })
        setRadioData(data)
      }
    })
  }

  const completionCallback = (id) => {
    const body = {
      radio_program_id: id
    }

    // Just making the request not handling
    axios.post(`${urls.OrchadioParticipants}`, body, {
      headers: {
        Authorization: `Bearer ${user}`
      }
    })
  }

  const completedOnPecentageLimit = (id, percentageCompleted) => {
    const body = {
      radio_program_id: id,
      listened_upto: percentageCompleted === 1 ? 0 : 30
    }
    axios.post(`${urls.OrchadioListeningParticipants}`, body, {
      headers: {
        Authorization: `Bearer ${user}`
      }
    }).then((res) => {
      console.log(res)
    }

    ).catch(err => console.log(err))
  }

  const addIntrestedParticipantForRj = () => {
    const body = {
      user_id: userId
    }
    axios.post(`${urls.IntrestedParticipants}`, body, {
      headers: {
        Authorization: `Bearer ${user}`
      }
    }).then((res) => {
      alert.success('Your interest has been successfully recorded')
      setIsInterestedInRJ(true)
    }

    ).catch(err => {
      console.log(err)
      alert.error('Something went wrong')
    })
  }

  const goBackClickHandler = () => {
    history.replace('/orchadio/listeners')
  }

  const getRadioList = () => {
    const list = radioData.map((item, i) => {
      const date = getSparseDate(item.start_time)
      return (
        <div style={{ marginBottom: '20px' }} key={`${item.id} ${i + 1}`}>
          <AudioPlayerWrapper
            albumName={item.program_name}
            // imageTxt='Orchids'
            albumComposers={item.program_made_by.split(', ')}
            src={item.audio_file}
            timeToStart={getFormattedHrsMnts(date[3], date[4])}
            timedStart
            dateToStart={selectedDate}
            duration={item.duration}
            completionPercentage={80}
            completionCallback={() => completionCallback(item.id)}
            completedOnPecentageLimit={(percentage) => completedOnPecentageLimit(item.id, percentage)}
            likeHandler={() => likeClickHandler(item.id)}
            likesCount={item.total_program_likes}
            viewCount={item.total_program_participants}
            imageSrc={orchadioImg}
            isLiked={item.is_liked === 'True'}
            radioProgramId={item.id}
          />
        </div>
      )
    }
    )
    return list
  }

  const getBlankView = () => {
    return (
      <div
        style={{
          position: 'relative',
          minHeight: '65vh',
          width: '100%',
          overflow: 'hidden'
        }}>
        <img src={radio} alt='radio' className={classes.radioImg} />
        <div className={classes.notFound}>Sorry! No Scheduled Programs Found</div>
        <div
          className={classes.backButton}
          onClick={goBackClickHandler}
        >
          Go Back
        </div>
      </div>
    )
  }

  const handlePagination = (event, page) => {
    setIsLoading(true)
    setCurrentPage(page)
    fetchOrchadioList(page)
  }

  return (
    <div>
      <AppBar position='static' color='white' style={{ padding: '0 10px', marginBottom: 10 }} >
        <Grid container style={{ justifyContent: 'space-between', marginBottom: '-14px' }}>
          <Grid item>
            { showDate && (
              <React.Fragment>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    margin='normal'
                    id='date-picker-dialog'
                    label='Select Date'
                    format='dd/MM/yyyy'
                    value={selectedDate}
                    maxDate={(location &&
                    location.state &&
                    location.state.date) ||
                new Date()}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date'
                    }}
                  />
                </MuiPickersUtilsProvider>
              </React.Fragment>
            )
            }
          </Grid>
          <Grid>
            <Pagination
              rowsPerPageOptions={[]}
              page={currentPage}
              rowsPerPage={rowsPerPage}
              count={count}
              onChangePage={handlePagination}
            />

            {role === 'GuestStudent' && !isInterestedInRJ && <Button
              onClick={(e) => addIntrestedParticipantForRj()}
              style={{ float: 'right', marginTop: '20px', marginBottom: '20px', position: 'relative' }} color='primary'
              variant='contained'>
        Click here if you are interested in becoming an RJ
            </Button>}<br />
            <Divider style={{ marginTop: '20px', marginBottom: '20px' }} />
          </Grid>
        </Grid>
      </AppBar>
      {
        radioData.length ? getRadioList() : getBlankView()
      }
      {isLoading && <CircularProgress open />}
    </div>
  )
}

export default withRouter(OrchadioListeners)
