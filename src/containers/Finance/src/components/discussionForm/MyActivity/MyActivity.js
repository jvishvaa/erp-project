/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import { Typography, Grid } from '@material-ui/core'
import IndividualPost from '../posts/IndividualPost'
import Answer from '../posts/replies/Answer'
import Loader from '../../discussion_form/loader'
import { discussionUrls } from '../../../urls'

function MyActivity ({ alert, likeFunction, addAwardFunction, awwardResponse, likeResponse, rewardListInfo }) {
  const [authForm] = useState(JSON.parse(localStorage.getItem('user_profile')))
  const [indexId, setIndexId] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [individualData, setIndividualData] = useState()
  const [lastIndex, setLastIndex] = useState(0)
  const [handleMode, setHandleMore] = useState(false)
  const [myPosts, setMyPosts] = useState([])
  const [loading, setLoading] = useState(false)

  console.log(lastIndex)

  const lastIndexFunc = (data) => {
    setLastIndex(prevVal => prevVal + data)
    setLoading(true)
    axios
      .get(`${discussionUrls.getActivityPostApi}?last_index=${data}`, {
        headers: {
          Authorization: 'Bearer ' + authForm.personal_info.token
        }
      })
      .then(res => {
        if (res.status === 200) {
          setMyPosts(prevVal => [...prevVal, ...res.data])
          if (res.data.length !== 10) {
            setHandleMore(true)
          }
          // setMyPosts(res.data)
          setLoading(false)
          // alert.success('Sucessfull Posted')
          //   this.refreshComponent()
        } else {
          setLoading(false)
          // alert.warning(JSON.stringify(res.data))
        }
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
        console.log("Error: Couldn't fetch data from " + discussionUrls.PostDiscussion)
      })
  }
  let loader = null
  if (loading) {
    loader = <Loader open />
  }

  function functionToFetData () {
    setLoading(true)
    axios
      .get(`${discussionUrls.getActivityPostApi}?last_index=0`, {
        headers: {
          Authorization: 'Bearer ' + authForm.personal_info.token
        }
      })
      .then(res => {
        if (res.status === 200) {
        // setMyPosts(prevVal => [...prevVal, ...res.data])
          setMyPosts(res.data)
          setLoading(false)
        // alert.success('Sucessfull Posted')
        //   this.refreshComponent()
        } else {
          setLoading(false)
        // alert.warning(JSON.stringify(res.data))
        }
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
        console.log("Error: Couldn't fetch data from " + discussionUrls.PostDiscussion)
      })
  }

  function functionReload () {
    setLastIndex(0)
    setHandleMore(false)
    functionToFetData()
  }

  useEffect(() => {
    setLastIndex(0)
    setHandleMore(false)
    functionToFetData()
  }, [awwardResponse, likeResponse, authForm.personal_info.token])

  const goToAnswer = () => {
    setShowAnswer(prevVal => !prevVal)
  }

  const getIndividualDataFunc = (data, number) => {
    setIndividualData(data)
    setIndexId(number)
  }

  return (
    <>
      <Grid container spacing={1}>
        <Grid item md={6} xs={6}>
          <h2>My Activity</h2>
        </Grid>
        <Grid item md={6} xs={6}>
          <Button style={{ float: 'right' }} variant='contained' color='primary' onClick={() => functionReload()}>Reload</Button>
        </Grid>
      </Grid>
      {/* {myPosts && myPosts.length > 0 && myPosts.map((item, index) =>
        <IndividualPost data={item} key={item.id} showAns={goToAnswer} likeFunction={likeFunction} addAwardFunction={addAwardFunction} awwardResponse={awwardResponse} rewardListInfo={rewardListInfo} alert={alert} />
      )}
      <Button variant='contained' color='primary' style={{ float: 'right', marginTop: '10px' }} onClick={lastIndexFunc}>
            View More...
      </Button> */}
      {showAnswer === false
        ? <div>
          {myPosts && myPosts.length > 0 && myPosts.map((item, index) =>
            <IndividualPost data={item} key={item.id} showAns={goToAnswer} getData={getIndividualDataFunc} number={index} likeFunction={likeFunction} addAwardFunction={addAwardFunction} awwardResponse={awwardResponse} rewardListInfo={rewardListInfo} />
          )}
          {myPosts && myPosts.length === 0 && <Typography variant='h6' style={{ color: 'blue', textAlign: 'center' }}>Activity Not Found</Typography>}
          {myPosts.length >= 5 &&
          <Button variant='contained' color='primary' style={{ float: 'right', marginTop: '10px' }} disabled={handleMode} onClick={() => lastIndexFunc(myPosts.length)}>
            View More...
          </Button>
          }
        </div> : <Answer alert={alert} goToAllPosts={goToAnswer} yourData={individualData} number={indexId} likeFunction={likeFunction} />}
      {loader}
    </>
  )
}

export default MyActivity
