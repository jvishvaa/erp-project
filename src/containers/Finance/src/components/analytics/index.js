import ReactGA from 'react-ga'

class GA {
  constructor () {
    this.isDevelopersEnv = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    let { personal_info: { user_id: userId } = { userId: 'No-user' } } = JSON.parse(window.localStorage.getItem('user_profile')) || {}
    this.userId = userId
  }
  initializeReactGA = () => {
    ReactGA.initialize('UA-132055953-1')
  }

  pageViews () {
    let { isDevelopersEnv, userId } = this
    if (isDevelopersEnv) {
      ReactGA.pageview(`${window.location.hostname}:user_${userId}` + window.location.pathname + window.location.search)
    } else {
      ReactGA.pageview(window.location.pathname + window.location.search)
    }
  }

  testAnalytics (action, testId, testType, category) {
    console.log('test analytics')
    if (!action || !testId || !testType) { return }
    category = category || 'Online test'
    let label = `id: ${testId}, type: ${testType}`
    if (this.isDevelopersEnv) {
      category += '/localhost'
    }
    // {
    //   category: 'Online Test',
    //   action: 'Started || Finished || Aborted || Resumed',
    //   label: 'id :$$, type -> Practice || Online'
    // }
    ReactGA.event({ category, action, label })
  }
}
export default GA
