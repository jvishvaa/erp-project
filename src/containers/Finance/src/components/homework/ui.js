import React, { useState, useEffect, useCallback } from 'react'
import { SpringGrid, measureItems, makeResponsive } from 'react-stonecutter'
import Button from '@material-ui/core/Button'
import { CircularProgress } from '@material-ui/core'
import axios from 'axios'
import CardItem from './card'
import horizontal from './layouts/horizontal'
import SubmissionPage from './submissionPage'
import Toolbar from './components/toolbar'
import { urls } from '../../urls'
import { useHomework } from './context'

const ResponsiveGrid = makeResponsive(measureItems(SpringGrid), {
  measureImages: true,
  maxWidth: 1920,
  minPadding: 16
})

function UI ({ alert }) {
  const homeworkManager = useHomework()
  const [cards, setCards] = useState([])
  const [remarks, setRemarks] = useState({})
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})
  const [isEvaluated, setIsEvaluated] = useState(false)
  const [isLastPage, setIsLastPage] = useState(false)
  const [folderLoading, setFolderLoading] = useState(-1) // -1 if none is loading
  const [overallRemarks, setOverallRemarks] = useState('')
  // const [submittable, setSubmittable] = useState(true)
  const [attemptedOverallRemarks, setAttemptedOverallRemarks] = useState('')
  const [isMoreContentLoading, setIsMoreContentLoading] = useState(false)
  const params = (new URL(document.location)).searchParams
  const path = params.get('path')
  // let corrected = params.get('corrected')
  const homeworkId = params.get('homework_id')
  // callback to handle route changes that happens and inform the content manager regarding the same to update the UI
  const handleRouteChange = useCallback((url) => {
    return homeworkManager.handleRouteChange(url).then(({ cards, data, isLastPage }) => {
      console.log(isLastPage)
      setIsLastPage(isLastPage)
      setCards(cards)
      setData(data)
      setLoading(false)
      setFolderLoading(-1)
    })
  }, [homeworkManager])

  const reloadContent = useCallback(() => {
    return homeworkManager.reloadContent().then(({ cards, data, isLastPage }) => {
      console.log(isLastPage)
      setIsLastPage(isLastPage)
      setCards(cards)
      setData(data)
      setLoading(false)
      setFolderLoading(-1)
    })
  }, [homeworkManager])

  homeworkManager.handleRouteChangeWithUIUpdate = handleRouteChange
  homeworkManager.reloadContentWithUIUpdate = reloadContent
  homeworkManager.setLoading = setLoading
  useEffect(() => {
    setLoading(true)
    handleRouteChange()
    function locationChange (event) {
      console.log('Route has been changed.')
      setLoading(true)
      handleRouteChange()
    }
    window.addEventListener('popstate', locationChange)
    return () => window.removeEventListener('popstate', locationChange)
  }, [handleRouteChange])

  if (data && data.homework_details && data.homework_details.corrected) {
    if (!isEvaluated) {
      setIsEvaluated(true)
      setAttemptedOverallRemarks(data.homework_details.over_all_review)
    }
  } else {
    if (isEvaluated) {
      setIsEvaluated(false)
      setAttemptedOverallRemarks('')
    }
  }

  function handleCardClick ({ id, content, path, details }) {
    // const state = {}
    // const title = ''
    let url
    const from = params.get('from')
    if (from) {
      url = path ? `/homework/?path=${path}&from=${content}&from_parent=${from}` + generateQueryParams(details) : '/homework/'
    } else {
      url = path ? `/homework/?path=${path}&from=${content}` + generateQueryParams(details) : '/homework/'
    }
    // window.history.pushState(state, title, url)
    setFolderLoading(Number(id))
    handleRouteChange(url)
  }

  function loadMoreContent () {
    setIsMoreContentLoading(true)
    homeworkManager.loadMoreContent().then(({ cards, data, isLastPage }) => {
      setCards(cards)
      setIsLastPage(isLastPage)
      setData(data)
      setIsMoreContentLoading(false)
    })
  }

  const submitRemarksHandler = () => {
    const remarksKeys = Object.keys(remarks)
    let isError = false
    data.homework_submission_details.forEach(submission => {
      if (submission.submission_type.trim() !== 'image') {
        if (!remarksKeys.includes(`${submission.id}`) || !remarks[submission.id]) {
          isError = true
        }
      }
    })

    if (isError || !overallRemarks.trim().length) {
      alert.warning('Please Provide  Remarks to Each Item and Overall Remarks')
      return
    }
    const remarksPerFile = remarksKeys.map(key => (
      {
        homework_submission: +key,
        review: remarks[key]
      }
    ))

    const body = {
      'file_review': remarksPerFile,
      'over_all_review': {
        'homework_id': data.homework_details.id,
        'review': overallRemarks
      }
    }
    axios.post(`${urls.HomeWorkSubmission}addReviewForSubmission/`, body, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('id_token')
      }
    }).then(res => {
      alert.success('Submission Successfull')
      reloadContent()
      // closeModal()
    }).catch(err => {
      console.error(err)
      alert.error('Remarks Submission Failed')
      // closeModal()
    })
  }

  function generateQueryParams (details) {
    let queryParam = '&'
    details && Object.keys(details).map((detail, index) => {
      queryParam += detail + '=' + details[detail]
      if (Object.keys(details).length - 1 !== index) {
        queryParam += '&'
      }
    })
    if (queryParam.length > 1) {
      return queryParam
    } else {
      return ''
    }
  }

  function openEvaluationWindow () {
    let ids = cards.map(card => card.id)
    window.open(`${urls.HomeWorkImageEvaluation}?hw_submission_id=${ids.join(',')}`)
  }
  console.log(isLastPage, 'is last page')

  return <div>
    <Toolbar
      homeworkManager={homeworkManager}
      alert={alert} cards={cards}
      data={data}
      isEvaluated={isEvaluated}
      openEvaluationWindow={openEvaluationWindow}
      submitRemarksHandler={submitRemarksHandler}
      handleRouteChange={handleRouteChange} />
    <div style={{ padding: 16 }}>
      <div style={{ display: cards.length === 0 ? 'flex' : 'none',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 96,
        left: 0,
        width: '100%',
        height: '76%',
        background: 'white',
        zIndex: 100 }}>
        <img src='/no_items.svg' style={{ height: '50%' }} />
      </div>
      <div style={{ display: loading ? 'flex' : 'none',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'white',
        zIndex: 100 }}>
        <CircularProgress />
      </div>
      {(path && path.includes('submission')) && folderLoading === -1 ? <SubmissionPage
        data={data}
        overallRemarks={overallRemarks}
        homeworkManager={homeworkManager}
        setOverallRemarks={setOverallRemarks}
        attemptedOverallRemarks={attemptedOverallRemarks}
        remarks={remarks}
        isEvaluated={isEvaluated}
        setRemarks={setRemarks}
        id={homeworkId}
        cards={cards} />
        : <ResponsiveGrid
          component='div'
          columnWidth={window.isMobile ? ((window.screen.width / 2) - 48) : 295}
          gutterWidth={16}
          gutterHeight={16}
          layout={horizontal}
          itemHeight={window.isMobile ? ((window.screen.width / 2) - 48) * 0.717 : 212}
          springConfig={{ stiffness: 170, damping: 26 }}
        >
          {Array.isArray(cards) && cards.length > 0 ? cards.map(card => {
            return <div itemHeight={card.type === 'folder' ? 212 : 345} it key={`${card.id}_${card.type}`}>
              <CardItem overallRemarks={overallRemarks} setOverallRemarks={setOverallRemarks} isLoading={folderLoading === Number(card.id)} onClick={() => handleCardClick(card)} card={card} />
            </div>
          }) : <div>No contents found.</div>}
        </ResponsiveGrid>}
      {
        (!path || (path && !path.includes('submission'))) && <div
          style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}
        >
          <Button
            style={{ margin: 8, marginTop: 16 }}
            disabled={isMoreContentLoading}
            onClick={loadMoreContent}>
            {(folderLoading === -1) && !isLastPage && (cards.length > 0) && (isMoreContentLoading ? 'Loading more items....' : 'Load more items')}
          </Button>
        </div>
      }
    </div>
  </div>
}

export default UI
