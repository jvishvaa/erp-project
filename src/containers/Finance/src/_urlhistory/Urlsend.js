import axios from 'axios'
import { urls } from '../urls'

class Urlsend {
  sendurl () {
    let { pathname: pathName } = window.location
    console.log(pathName)
    if (localStorage.getItem('user_profile') !== null) {
      let usertoken = JSON.parse(localStorage.getItem('user_profile')).personal_info.token
      console.log(usertoken)
      this.userId = JSON.parse(localStorage.getItem('user_profile')).personal_info.user_id
      let payload = { url: pathName, user_id: this.userId }
      axios
        .post(urls.UserSender, JSON.stringify(payload), {
          headers: {
            Authorization: 'Bearer ' + usertoken,
            'Content-Type': 'application/json'
          }
        })
        .then(res => {
          if (res.status === 200) {
            this.props.alert.success('Message Sent')
          } else {
            this.props.alert.error('Error occured')
          }
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
}
export default Urlsend
