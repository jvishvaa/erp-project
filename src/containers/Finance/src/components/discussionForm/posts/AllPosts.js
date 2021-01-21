import React, { useState } from 'react'
import { Button, Typography } from '@material-ui/core'

import IndividualPost from './IndividualPost'
import Answer from './replies/Answer'

function AllPosts ({ alert, allPosts, handelMore, viewMore, likeFunction, addAwardFunction, awwardResponse, rewardListInfo }) {
  const [showAnswer, setShowAnswer] = useState(false)
  const [individualData, setIndividualData] = useState()
  const [indexId, setIndexId] = useState('')
  const goToAnswer = () => {
    setShowAnswer(prevVal => !prevVal)
  }

  const getIndividualDataFunc = (data, number) => {
    setIndividualData(data)
    setIndexId(number)
  }

  return (
    <>
      {showAnswer === false
        ? <div>
          {allPosts && allPosts.length > 0 && allPosts.map((item, index) =>
            <IndividualPost data={item} key={item.id} showAns={goToAnswer} getData={getIndividualDataFunc} number={index} likeFunction={likeFunction} addAwardFunction={addAwardFunction} awwardResponse={awwardResponse} rewardListInfo={rewardListInfo} />
          )}
          {allPosts && allPosts.length === 0 &&
          <Typography variant='h5' style={{ color: 'blue', marginTop: '20px', textAlign: 'center' }}> Posts Not Found</Typography>
          }
          { allPosts.length >= 5 &&
          <Button variant='contained' color='primary' style={{ float: 'right', marginTop: '10px' }} disabled={handelMore} onClick={() => viewMore(allPosts.length)}>
            View More...
          </Button>
          }
        </div> : <Answer alert={alert} goToAllPosts={goToAnswer} yourData={individualData} number={indexId} likeFunction={likeFunction} />}
    </>
  )
}

export default AllPosts
