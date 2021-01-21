import React, { Component } from 'react'
import axios from 'axios'
import LinkTag from '@material-ui/core/Link'
import { urls } from '../../../urls'
import { InternalPageStatus } from '../../../ui'
import { triggerFetchParticipants } from './utilities'

export class ChangeAvatar extends Component {
  constructor () {
    super()
    this.state = {
      currentPage: 1,
      pageSize: 100,
      personalInfo: JSON.parse(localStorage.getItem('user_profile')).personal_info,
      avatars: [],
      fetchStatus: 'PENDING',
      totalPages: null
    }
  }

  componentDidMount () {
    this.getAvatars()
  }

    getAvatars = () => {
      this.setState({ fetchStatus: 'PENDING' }, () => {
        const { currentPage, pageSize, personalInfo, avatars } = this.state
        axios.get(`${urls.MultiplayerQuizAvatar}?page_number=${currentPage}&page_size=${pageSize}`, {
          headers: {
            Authorization: 'Bearer ' + personalInfo.token
          }
        })
          .then(res => {
            const { data, total_pages: totalPages } = res.data
            this.setState({ avatars: [...avatars, ...data], fetchStatus: 'FULLFILLED', totalPages })
          })
          .catch(err => {
            console.log(err)
            this.setState({ fetchStatus: 'REJECTED' })
          })
      })
    }

    handleScroll = (event) => {
      const { currentPage, fetchStatus, totalPages } = this.state
      const { scrollTop, clientHeight, scrollHeight } = event.target
      if (scrollTop + clientHeight >= scrollHeight && totalPages > currentPage) {
        this.setState({ currentPage: currentPage + 1 }, () => {
          if (fetchStatus !== 'PENDING') {
            this.getAvatars()
          }
        })
      }
    }

    handleAvatarChange = (event) => {
      const { id } = event.target
      const formData = new FormData()
      formData.append('avatar_id', id)
      axios.post(`${urls.MultiplayerQuizAvatar}`, formData, {
        headers: {
          Authorization: 'Bearer ' + this.state.personalInfo.token
        }
      })
        .then(res => {
          this.props.modalStatus()
          triggerFetchParticipants(this.props.socket)
        })
        .catch(err => {
          console.log(err)
          this.props.alert.error('Failed to change avatar')
        })
    }

    render () {
      const { fetchStatus, avatars } = this.state
      return (
        <div className='avatars__container'>
          {
            fetchStatus === 'FULLFILLED'
              ? <h1 style={{ textAlign: 'center', color: 'black' }}>Select Avatar</h1>
              : ''
          }

          {
            fetchStatus === 'PENDING'
              ? <InternalPageStatus label={'Loading Avatars'} />
              : <div className='quiz__avatars--holder' onScroll={this.handleScroll}>
                {
                  fetchStatus === 'FULLFILLED'
                    ? <React.Fragment>
                      {avatars.map(avatar => {
                        return <React.Fragment>
                          <div
                            className='quiz__avatar'
                            id={avatar.id}
                            onClick={this.handleAvatarChange}
                            style={{ backgroundImage: `url('${avatar.avatar_file}')` }}>
                            <span className='avatar__name'>{avatar.avatar_name}</span>
                          </div>
                        </React.Fragment>
                      })}
                    </React.Fragment>
                    : <InternalPageStatus
                    // label={`${message}`}
                      label={
                        <p>Failed to load avatars &nbsp;
                          <LinkTag
                            component='button'
                            onClick={this.getAvatars}>
                            <b>Click here to reload_</b>
                          </LinkTag>
                        </p>
                      }
                      loader={false}
                    />
                }
              </div>
          }
        </div>
      )
    }
}

export default ChangeAvatar
