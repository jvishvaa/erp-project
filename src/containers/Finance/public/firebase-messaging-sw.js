/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js')
if (firebase.messaging.isSupported()) {
  firebase.initializeApp({
    apiKey: 'AIzaSyByTiELwI96kTDOdkJ-dWXCsuVoCmR0U74',
    authDomain: 'letseduvate-ba88b.firebaseapp.com',
    databaseURL: 'https://letseduvate-ba88b.firebaseio.com',
    projectId: 'letseduvate-ba88b',
    storageBucket: 'letseduvate-ba88b.appspot.com',
    messagingSenderId: '221160119784',
    appId: '1:221160119784:web:4cde7019bc613000'
  })

  const messaging = firebase.messaging()
  messaging.setBackgroundMessageHandler(function (payload) {
    const promiseChain = clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true
      })
      .then(windowClients => {
        for (let i = 0; i < windowClients.length; i++) {
          const windowClient = windowClients[i]
          windowClient.postMessage(payload)
        }
      })
      .then(() => {
        return registration.showNotification('my notification title')
      })
    return promiseChain
  })

  self.addEventListener('notificationclick', function (event) {
    event.notification.close()
    // Do something as the result of the notification click
  })
}
