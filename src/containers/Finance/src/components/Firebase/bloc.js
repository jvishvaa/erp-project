import * as firebase from 'firebase'

import * as rxjs from 'rxjs'
import axios from 'axios'

export let messages = new rxjs.Subject({})
class Firebase {
  async init () {
    if (!firebase.apps.length && firebase.messaging.isSupported()) {
      let firebaseApp = await firebase.initializeApp({
        apiKey: 'AIzaSyByTiELwI96kTDOdkJ-dWXCsuVoCmR0U74',
        authDomain: 'letseduvate-ba88b.firebaseapp.com',
        databaseURL: 'https://letseduvate-ba88b.firebaseio.com',
        projectId: 'letseduvate-ba88b',
        storageBucket: 'letseduvate-ba88b.appspot.com',
        messagingSenderId: '221160119784',
        appId: '1:221160119784:web:4cde7019bc613000'
      })
      let messaging = await firebaseApp.messaging()
      await messaging.usePublicVapidKey(
        'BPAqmPCSz6HgmRvdwh5sGG7YiBU3v9QsR9wkbn-zVkU3qpNO34Dy9tTbxf6Munm3Cj8Rp2bxYtWP6sSuyFk4UuE'
      )
      this.token = await firebaseApp.messaging().getToken()
      this.firebaseApp = firebaseApp
      console.log(this.token, firebaseApp)
    } else {
      console.log("Didn't initialize here..")
    }
    this.initializeMessaging()
  }

  requestPermission () {
    /* global Notification */
    return Notification.requestPermission()
  }
  /**
   * @description Subscribe to a specific topic
   * @param {*} topic
   */
  async subscribeToTopic (topic) {
    this.token && axios({
      url: 'https://iid.googleapis.com/iid/v1/' + this.token + '/rel/topics/' + topic,
      method: 'POST',
      // eslint-disable-next-line no-undef
      headers: {
        'Authorization': 'key=AAAAM34rneg:APA91bEcqmbEsjc4Pj6psiNNhw2vglJwqBXgH7cHu4YtqXYPZvitSYBroO5d4U6dUEuqovUmoOUPIjXt6vi1A6ZMXbTmI4Xx2y9qjHNzd3B59JrPiThmrLSIc6sParwVwclW7oSb85yB'
      }
    }).then(response => {
      if (response.status < 200 || response.status >= 400) {
        // eslint-disable-next-line no-throw-literal
        throw 'Error subscribing to topic: ' + response.status + ' - ' + response.text()
      }
      console.log('Subscribed to "' + topic + '"')
    }).catch(error => {
      console.error(error)
    })
  }
  initializeMessaging () {
    if ('serviceWorker' in navigator) {
      // Handler for messages coming from the service worker
      navigator.serviceWorker.addEventListener('message', function (event) {
        console.log(event.data, event)
        messages.next(event.data)
      })
    }
  }
}

export default Firebase
