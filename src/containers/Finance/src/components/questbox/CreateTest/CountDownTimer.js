import React from 'react'
import { Typography } from '@material-ui/core'
import moment from 'moment'

class Countdown extends React.Component {
    state = {
      days: undefined,
      hours: undefined,
      minutes: undefined,
      seconds: undefined
    };

    componentDidMount () {
      this.interval = setInterval(() => {
        const { timeTillDate } = this.props
        let difference = moment(timeTillDate).diff(moment.now())
        const duration = moment.duration(difference, 'milliseconds')
        const days = moment.duration(duration).days()
        const hours = moment.duration(duration).hours()
        const minutes = moment.duration(duration).minutes()
        const seconds = moment.duration(duration).seconds()

        this.setState({ days, hours, minutes, seconds })
      }, 1000)
    }

    componentWillUnmount () {
      if (this.interval) {
        clearInterval(this.interval)
      }
    }

    render () {
      const { days, hours, minutes, seconds } = this.state

      if (!seconds) {
        return null
      }

      return (
        <div>
          <Typography variant='h6' color='primary' style={{ marginTop: 2 }}>{<div><div>Start's In: {
            `${days}d ${hours}h ${minutes}m ${seconds}s`
          }</div></div>}</Typography>
        </div>
      )
    }
}

export default Countdown
