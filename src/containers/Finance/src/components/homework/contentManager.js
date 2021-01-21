import axios from 'axios'
import moment from 'moment'
// import _ from 'lodash'
import { urls } from '../../urls'

export default class ContentManager {
  constructor () {
    this.history = {}
  }

  init () {
    return new Promise((resolve, reject) => {
      resolve([{
        id: 1,
        type: 'info_card',
        path: 'nonevaluated_all',
        content: 'nonevaluated_all Submissions'
      }])
    })
  }

  historyExists (params) {
    if (this.history[params.toString()]) {
      return true
    }
    return false
  }

  getHistoryData (params) {
    if (!params) {
      params = (new URL(document.location)).searchParams
    }
    if (!params.get('path')) {
      params.set('path', 'home')
    }
    let path = params.get('path')
    if (path === 'nonevaluated_all' || path === 'nonevaluated_grouped_homeworks') {
      params.set('type', 'onlineclass')
      params.set('corrected', 'False')
    }
    let data = {}
    Object.keys(this.history).forEach(key => {
      let historyParams = new URLSearchParams(key)
      historyParams.sort()
      params.sort()
      console.log(historyParams.toString(), params.toString())
      if (historyParams.toString() === params.toString()) {
        data = this.history[key]
      }
    })
    return data
  }

  setHistoryData (data, params) {
    params.sort()
    this.history[params.toString()] = data
    console.log('Setting history data', this.history)
  }
  getURL (path) {
    if (!path) {
      path = 'home'
    }
    if (path.includes('submission')) {
      return urls.HomeWorkSubmissions
    }
    switch (path) {
      case 'nonevaluated_all': return urls.HomeworkFilter
      case 'nonevaluated_grouped': return urls.HomeworkMappingCount
      case 'online_classes': return urls.OnlineClassHomeworkCount
      case 'online_class_homeworks': return urls.HomeworkFilter
      case 'nonevaluated_grouped_homeworks': return urls.HomeworkFilter
      case 'home': return urls.OnlineClassHomeworkCount
      default : console.log('Error')
    }
  }

  callAPIAndSerialize (path, params) {
    params.delete('path')
    if (path === 'nonevaluated_all' || path === 'nonevaluated_grouped_homeworks') {
      params.set('type', 'onlineclass')
      params.set('corrected', 'False')
    }
    this.activeCall = axios.CancelToken.source()
    return new Promise((resolve, reject) => {
      let url = this.getURL(path)
      console.log('URL', url)
      axios.get(url + '?' + params.toString(), {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('id_token'),
          'Content-Type': 'application/json'
        },
        cancelToken: this.activeCall.token
      }).then(res => {
        params.set('path', path)
        const cards = this.generateCards(path, res.data)
        const recentlyLoadedPage = res.data.page_number
        const totalPages = Math.ceil(Number(res.data.total_items) / Number(res.data.page_size))
        console.log(cards, recentlyLoadedPage)
        resolve({ cards, recentlyLoadedPage, data: res.data, totalPages })
      }).catch(e => reject(e))
    })
  }

  handleRouteChange (url) {
    let params
    console.log(this.history, 'history')
    if (url) {
      params = (new URL(document.location.origin + url)).searchParams
    } else {
      params = (new URL(document.location)).searchParams
    }
    console.log(this.history)
    console.log(params, this.getHistoryData(params))
    return new Promise((resolve, reject) => {
      let path = params.get('path')
      if (this.activeCall) {
        this.activeCall.cancel()
      }
      if (!path) {
        path = 'home'
      }
      if (this.historyExists(params)) {
        resolve({ cards: this.getHistoryData().cards, data: this.getHistoryData().data, isLastPage: this.isLastPage() })
      } else {
        this.callAPIAndSerialize(path, params).then(({ cards, recentlyLoadedPage, data, totalPages }) => {
          console.log(path, recentlyLoadedPage, cards)
          this.storeInHistory(recentlyLoadedPage, cards, data, totalPages, params)
          if (url) {
            const state = {}
            const title = ''
            window.history.pushState(state, title, url)
          }
          resolve({ cards, data, totalPages, isLastPage: this.isLastPage(params) })
        }).catch(e => reject(e))
      }
    })
  }

  generateCards (path, data) {
    if (!path) {
      path = 'home'
    }
    if (path.includes('submission')) {
      return this.generateSubmissionCards(data)
    }
    switch (path) {
      case 'nonevaluated_all': return this.generateHomeworkCards(data, 'nonevaluated_all')
      case 'nonevaluated_grouped': return this.generateMappingCards(data)
      case 'online_classes': return this.generateOnlineClassCards(data)
      case 'online_class_homeworks': return this.generateHomeworkCards(data, 'online_class')
      case 'nonevaluated_grouped_homeworks': return this.generateHomeworkCards(data, 'nonevaluated_grouped')
      case 'home': return this.generateHomePageCards(data)
    }
  }

  generateMappingCards (data) {
    let mappings = data.data.data
    let cards = []
    if (mappings) {
      cards = mappings.map((mapping, index) => {
        return {
          id: index + 1,
          type: 'folder',
          path: 'nonevaluated_grouped_homeworks',
          content: `${mapping.section}`,
          subtitle: `${mapping.branch_name} ${mapping.grade}`,
          count: mapping.count,
          details: {
            section_mapping_ids: mapping.section_mapping_id
          }
        }
      })
    }
    return cards
  }

  storeInHistory (recentlyLoadedPage, cards, data, totalPages, params) {
    this.setHistoryData({ recentlyLoadedPage, cards, data, totalPages, params }, params)
  }

  isLastPage (params) {
    let history = this.getHistoryData(params)
    console.log(history)
    let currentPage = history.recentlyLoadedPage
    let totalPages = history.totalPages
    console.log(currentPage, totalPages, 'Is lastPage Check')
    if (Number(currentPage) === Number(totalPages)) {
      return true
    } else if (!currentPage || !totalPages) {
      return true
    }
    return false
  }
  generateOnlineClassCards (data) {
    let params = (new URL(document.location)).searchParams
    let subjectMappingIds = params.get('subject_mapping_ids')
    let sectionMappingIds = params.get('section_mapping_ids')
    let cards = []
    let onlineClasses = data.data
    onlineClasses.forEach(onlineClass => {
      cards.push({
        id: onlineClass.id,
        type: 'folder',
        content: onlineClass.name,
        subtitle: onlineClass.subject,
        path: 'online_class_homeworks',
        details: {
          online_class_id: onlineClass.id,
          subject_mapping_ids: subjectMappingIds,
          section_mapping_ids: sectionMappingIds
        },
        count: onlineClass.not_corrected
      })
    })
    return cards
  }
  generateHomePageCards (data) {
    let cards = []
    if (data.page_number === 1) {
      cards = [{
        id: 1,
        type: 'folder',
        path: 'nonevaluated_all',
        content: 'All Nonevaluated Submissions'
      }]
    }
    let onlineClasses = data.data
    onlineClasses.forEach((onlineClass) => {
      cards.push({
        id: onlineClass.id,
        type: 'folder',
        content: onlineClass.name,
        path: 'online_class_homeworks',
        subtitle: onlineClass.subject,
        subtitle2: moment(onlineClass.start_time, 'YYYY-MM-DDTHH:mm').fromNow(),
        details: {
          'online_class_id': onlineClass.id
        },
        count: onlineClass.not_corrected
      })
    })
    return cards
  }
  generateHomeworkCards (data, homeworkParent) {
    let cards = []
    let homeworks = data.data
    homeworks.forEach(homework => {
      cards.push({
        id: homework.id,
        type: 'folder',
        path: homeworkParent + '_submission',
        content: homework.submitted_by.name,
        subtitle: homework.onlineclass ? homework.onlineclass.title : 'Not related',
        details: {
          homework_id: homework.id,
          student_id: homework.submitted_by.id
        }
      })
    })
    return cards
  }

  generateSubmissionCards (data) {
    let cards = []
    let submissions = data.homework_submission_details
    submissions.forEach(submission => {
      let content = submission.submission ? submission.submission.split('/')[submission.submission.split('/').length - 1] : 'Submission'
      if (content.length > 23) {
        const splittedContent = content.split('.')
        const name = splittedContent[0]
        const extension = splittedContent[1]
        content = name.substring(0, 20) + '...' + extension
      }
      cards.push({
        id: submission.id,
        type: 'image',
        path: 'submission_dialog',
        media: submission.submission,
        corrected: submission.corrected,
        review: submission.review,
        content,
        details: {
          submission_id: submission.id
        }
      })
    })
    return cards
  }

  loadMoreContent () {
    let params = (new URL(document.location)).searchParams
    let path = params.get('path')
    console.log(this.history)
    return new Promise((resolve, reject) => {
      let recentlyLoadedPage = Number(this.getHistoryData(params).recentlyLoadedPage)
      params.set('page_number', recentlyLoadedPage + 1)
      this.callAPIAndSerialize(path, params).then(({ cards, recentlyLoadedPage, data, totalPages }) => {
        let updatedCards = [...this.getHistoryData().cards, ...cards]
        this.storeInHistory(recentlyLoadedPage, updatedCards, data, totalPages, params)
        resolve({ cards: updatedCards, data, isLastPage: this.isLastPage(params) })
      }).catch(e => reject(e))
    })
  }
  reloadContent () {
    let params = (new URL(document.location)).searchParams
    let path = params.get('path')
    return new Promise((resolve, reject) => {
      this.history = {}
      this.callAPIAndSerialize(path, params).then(({ cards, recentlyLoadedPage, data, totalPages }) => {
        let updatedCards = cards
        this.storeInHistory(recentlyLoadedPage, updatedCards, data, totalPages, params)
        resolve({ cards: updatedCards, data, isLastPage: this.isLastPage(params) })
      }).catch(e => reject(e))
    })
  }
}
