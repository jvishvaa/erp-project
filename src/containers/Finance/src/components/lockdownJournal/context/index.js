/* eslint-disable no-unused-vars */
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react'
import axios from 'axios'
import _ from 'lodash'

import { urls } from '../../../urls'

export const LockDownContext = createContext()

export function useLockdown () {
  const context = useContext(LockDownContext)
  if (context === undefined) {
    throw new Error('error happened')
  }
  return context
}

export function LockDownContextProvider ({ children, alert }) {
  const [tool, setTool] = useState('')
  const [cancelCall, setCancelCall] = useState()
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [url, setUrl] = useState()
  // const [formdt, setFormdt] = useState({})
  const [journalId, setJournalId] = useState(0)
  const [isPending, setIsPending] = useState(false)
  const [formData, setFormData] = useState({})
  const [drawing, setDrawing] = useState('')
  const [loading, setLoading] = useState(false)
  const [continueJourney, setContinueJourney] = useState(false)
  const [status, setStatus] = useState('')
  const [pendingPageNumber, setPendingPageNumber] = useState()

  const delayedCallback = _.debounce((data) => {
    sendFormdata(data)
  }, 5000)
  function enableTool (event, updateTool) {
    if (updateTool !== tool) {
      setTool(updateTool)
    } else {
      setTool('')
    }
  }

  function onClickNext () {
    if (page + 1 <= totalPages) {
      if (isPending || loading) {
        setPendingPageNumber(page + 1)
        setPage(page + 1)
      } else {
        setPage(page + 1)
        getPageData(page + 1)
        setFormData({})
        setDrawing('')
      }
    }
  }

  function onClickPrevious () {
    if (page - 1 > 0) {
      if (isPending || loading) {
        setPendingPageNumber(page - 1)
        setPage(page - 1)
      } else {
        setPage(page - 1)
        getPageData(page - 1)
        setFormData({})
        setDrawing('')
      }
    }
  }

  const getPageData = useCallback((page) => {
    if (cancelCall) {
      cancelCall.cancel()
    }
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    setCancelCall(source)
    setLoading(true)
    axios.get(urls.GetJournal + `page/?page_number=${page}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        'Content-Type': 'multipart/formData'
      }
    }).then(res => {
      setLoading(false)

      if (res.data[0].journal_file && res.data[0].journal_file.journal_file !== undefined) {
        setUrl(res.data[0].journal_file.journal_file)
        setDrawing(res.data[0].image)
        setFormData(res.data[0].form_data)
        setJournalId(res.data[0].journal_file.id)
      }
    })
      .catch(err => {
        setLoading(false)
        console.log(err)
      })
  }, [cancelCall])

  useEffect(() => {
    if (pendingPageNumber && !isPending) {
      getPageData(pendingPageNumber)
      setFormData({})
      setDrawing('')
      setPendingPageNumber(null)
    }
  }, [getPageData, isPending, pendingPageNumber])

  const sendFormdata = (data) => {
    let formdata = new FormData()

    formdata.set('journal_file_id', journalId)
    formdata.set('page_number', page)
    if (data.formData) {
      formdata.set('form_data', JSON.stringify(data.formData))
    }

    if (data.image) {
      formdata.set('image', data.image)
    }
    axios.post(urls.GetJournal, formdata, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        'Content-Type': 'multipart/formData'
      }
    }).then(res => {
      alert.success('Saved successfully')
    })
      .catch(err => {
        console.log(err)
      })
  }
  function onChange (data) {
    if (data.formData) {
      setFormData(data.formData)
    }
    if (data.image) {
      setDrawing(data.image)
    }
    delayedCallback(data)
  }
  function decideJourney () {
    setContinueJourney(true)
    // getIntialData()
  }
  const getDataOnLoad = () => {
    setLoading(true)
    axios.get(urls.GetJournal, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        'Content-Type': 'multipart/formData'
      }
    }).then(res => {
      setLoading(false)
      setTotalPages(res.data.total_pages)
      setJournalId(res.data.data[0].journal_file.id)
      setStatus(res.data.status)
      if (res.data.status === 'continue') {
        setPage(res.data.journal_file.page_number)
        setFormData({})
        setDrawing('')
      } else {
        setPage(1)
        setFormData({})
        setDrawing('')
      }
    })
      .catch(err => {
        setLoading(false)
        console.log(err)
      })
  }
  useEffect(() => {
    getDataOnLoad()
  }, [])

  function downloadPdfFile () {
    const { grade_name: gradeName } = JSON.parse(localStorage.getItem('user_profile'))
    console.log(gradeName)
    const lowerGrades = ['Grade 1', 'Grade 2']
    let template
    if (lowerGrades.includes(gradeName)) {
      template = 'https://letseduvate.s3.ap-south-1.amazonaws.com/prod/media/lockdown_journal/B_W STAY AT HOME DIARY (1).pdf'
    } else {
      template = 'https://letseduvate.s3.ap-south-1.amazonaws.com/prod/media/lockdown_journal/My+Lockdown+Journal+(bw).pdf'
    }
    window.open(template, '_blank')
  }
  return (
    <LockDownContext.Provider value={{ setTool, getDataOnLoad, tool, setIsPending, isPending, enableTool, url, onChange, page, open, setOpen, formData, drawing, totalPages, onClickNext, onClickPrevious, decideJourney, continueJourney, setContinueJourney, status, getPageData, loading, downloadPdfFile }}>
      {children}
    </LockDownContext.Provider>
  )
}
