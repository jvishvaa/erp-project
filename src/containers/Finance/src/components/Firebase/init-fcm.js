import * as firebase from 'firebase/app'
import 'firebase/messaging'

const initializedFirebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyByTiELwI96kTDOdkJ-dWXCsuVoCmR0U74',
  authDomain: 'letseduvate-ba88b.firebaseapp.com',
  databaseURL: 'https://letseduvate-ba88b.firebaseio.com',
  projectId: 'letseduvate-ba88b',
  storageBucket: 'letseduvate-ba88b.appspot.com',
  messagingSenderId: '221160119784',
  appId: '1:221160119784:web:4cde7019bc613000'
})
try {
  var messaging = initializedFirebaseApp.messaging()
  messaging.usePublicVapidKey(
    'BPAqmPCSz6HgmRvdwh5sGG7YiBU3v9QsR9wkbn-zVkU3qpNO34Dy9tTbxf6Munm3Cj8Rp2bxYtWP6sSuyFk4UuE'
  )
} catch (err) {
  console.log('blah')
}

export { messaging }
