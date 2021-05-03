import React from 'react'
import Emoji from './assets/smile.svg'
import Laugh from './assets/laugh.svg'
import './StudentRankingDetails.css'

class AnimatedListReorder extends React.Component {
  state={}
  constructor (props) {
    super(props)
    this.state = {
      personalInfo,
      applyAnimEffect: false
    }
  }
  componentDidMount () {
    setTimeout(() => { this.setState({ applyAnimEffect: true }) }, 0)
  }

  computeTranslation = (item) => {
    const oldPosition = this.props.data.findIndex((currentItem) => currentItem.name === item.name) + 1
    const newPosition = this.props.previousData.findIndex((currentItem) => currentItem.name === item.name) + 1
    const translateX = oldPosition === newPosition
      ? 0
      : (100 + 10) * (newPosition - oldPosition)

    return {
      transform: `translateY(${translateX}px)`,
      transition: 'all 0.1s ease'
    }
  };
  // componentWillReceiveProps (nextProps) {
  //   // let{ data } = nextProps
  //   this.setState({ previousData: this.props.data, data: nextProps.data })
  // }
  render () {
    const { applyAnimEffect } = this.state
    const { currentUserId, data = [], previousData = [] } = this.props
    return (
      <div className='list__ordering--container'>
        <div className='list__ordering--itemscontainer'>
          {data.map((item, key) => {
            const me = String(currentUserId) === String(item.user_id)
            return <div
              key={key}
              className='list__ordering--item'
              style={(previousData.length && applyAnimEffect) ? this.computeTranslation(item) : {}}
            >
              <div className={`quiz__rank--container ${me ? 'quiz__rank--bg-white' : 'quiz__rank--bg-blue'}`} ref={item.user_id}>
                <div className='quiz__rank'>{item.rank}</div>
                <div className='quiz__line' />
                <div className='quiz__emoji'>
                  <img src={me ? Laugh : Emoji} alt='Smiley' />
                </div>
                <div className='quiz__user--name'>{ item.name || '' }</div>
                <div className='quiz__user--points'>{item.total_score || ''}</div>
              </div>
            </div>
          }
          )}
        </div>
      </div>
    )
  }
}

export default AnimatedListReorder
