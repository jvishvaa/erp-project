// import React from 'react'
// import CircularProgress from '@material-ui/core/CircularProgress'
// import {
//   PromotedStudents
// } from './components'
import AolHome from './components/aol/aolHome'
import SampleVideos from './components/aol/sampleVideos'
import ThankYou from './components/aol/thankYou'

// let Login = React.lazy(() => import('./components/login'))
// let viewTimeTable = React.lazy(() => import('./components/manageTimeTable/viewTimeTable/viewTimeTable'))
// function SuspenseComponent (WrappedComponent) {
//   return class extends React.Component {
//     componentWillReceiveProps (nextProps) {
//       console.log('Current props: ', this.props)
//       console.log('Next props: ', nextProps)
//     }
//     render () {
//       // Wraps the input component in a container, without mutating it. Good!
//       return <Suspense fallback={<div style={{ width: '100%', height: '100%', alignItems: 'center', display: 'flex', justifyContent: 'center', backgroundColor: 'white', zIndex: 5000 }}> <CircularProgress color='secondary' style={{ margin: 20 }} /></div>}><WrappedComponent {...this.props} /></Suspense>
//     }
//   }
// }
// TeacherPractice
// PracticeTests
const routes = [
  {
    path: '/',
    component: AolHome,
    protected: false,
    exact: true
    // title: 'Scool Meal',
    // roles: ['FinanceAdmin']
  },
  {
    path: '/videos',
    component: SampleVideos,
    protected: false,
    exact: true
    // title: 'Scool Meal',
    // roles: ['FinanceAdmin']
  },
  {
    path: '/thankyou',
    component: ThankYou,
    protected: false,
    exact: true
    // title: 'Scool Meal',
    // roles: ['FinanceAdmin']
  }
]

export default routes
