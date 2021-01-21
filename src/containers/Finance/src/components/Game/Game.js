import React from 'react'
import { connect } from 'react-redux'
import withStyles from '@material-ui/core/styles/withStyles'
import { Grid } from '@material-ui/core/'
import axios from 'axios'
// import Fullscreen from 'react-full-screen'
// import ReactStars from 'react-rating-stars-component'
import { urls } from '../../urls'
import StarRatings from '../../../node_modules/react-star-ratings'
import './game.css'
import Count from '../../assets/game/count.png'
// import WordSerach from '../../assets/game/wordsearch.jpg'
// import Game from '../../../public/Game/game1/index.html'

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4
  }
})

class Game extends React.Component {
  state={
    btnChange: true,
    gameView: true,
    isFull: false,
    gameURl: '',
    gameDetails: [],
    data: '',
    rating: 1
  }

  goFull = () => {
    this.setState({ isFull: true })
  }
  onGameView = (url, id, name) => {
    console.log('URL', urls.Game + name + '/index.html')
    this.setState({ gameView: false, isFull: true, gameURl: urls.Game + name + '/index.html' })

    let formData = new FormData()
    formData.append('id', id)
    const urll = '?id=' + id
    axios.put(urls.GameDetail + urll, formData, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'multipart/formData'
      }
    })
      .then(({ data }) => {
        // console.log('Game count', data)
        // this.setState({ gameDetails: data.message })
      })
      .catch(error => {
        // if (error.response && error.response.status === 404) {
        // }
        console.log(error.response)
      })
  }
  onClose = () => {
    this.setState({ gameView: true })
  }

  changeRating =(newRating, id) => {
    console.log('newRating:', newRating, 'id:', id)
    // this.setState({ rating: newRating })
    this.setState({ [id]: newRating })
    let formData = new FormData()
    formData.append('game_id', id)
    formData.append('rating', newRating)
    axios.post(urls.GameRating, formData, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'multipart/formData'
      }
    })
      .then(({ data }) => {
        // console.log('Game rating', data)
        // this.setState({ gameDetails: data.message })
      })
      .catch(error => {
        // if (error.response && error.response.status === 404) {
        // }
        console.log(error.response)
      })
  }
  // ratingChanged = (newRating) => {
  //   console.log(newRating)
  // }

  componentDidMount () {
    axios.get(`${urls.GameDetail}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(({ data }) => {
        console.log('Game Data', data)
        // for (let i = 0; i < data.message.length; i++) {
        //   console.log('Rating', data.message[i].user_rating)
        //   this.setState({ [data.message[0].id]: data.message[0].user_rating })
        // }
        this.setState({ gameDetails: data.message })
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
        }
        console.log(error.response)
      })

    // console.log('Start back')
    window.addEventListener('popstate', this.onBackButtonEvent)
  }
  componentWillUnmount () {
    // console.log('Remove back')
    // window.removeEventListener('popstate', this.onBackButtonEvent)
  }
  onBackButtonEvent = () => {
    window.history.forward()
  }

  render () {
    const { gameView, gameURl, gameDetails } = this.state
    return (
      <React.Fragment>
        <div>
          { gameView
            ? <Grid container spacing='3' style={{ padding: 15 }}>
              <Grid item xs={12}>
                <Grid item xs={7} sm={6} md={5} style={{ display: 'flex' }} >
                  {gameDetails
                    ? gameDetails.map(item => {
                      return <div id={item.game_id} style={{ marginLeft: '12px', width: '100%' }}>
                        <img className='gameIcon' src={item.icon} width='100%' onClick={() => this.onGameView(item.game_link, item.game_id, item.name)} />
                        <div style={{ fontSize: '17px' }}>{item.name} </div>
                        <div style={{ color: '#808080' }}>Rating :{item.average_rating.toFixed(1)}</div>
                        <div style={{ display: 'flex' }}><div><img src={Count} width='15px' /></div>&nbsp;<div>({item.play_count})</div></div>
                        <StarRatings
                          // rating={this.state[item.game_id]}
                          rating={item.user_rating === 0 ? this.state[item.game_id] : item.user_rating}
                          starRatedColor='blue'
                          changeRating={(newRating) => this.changeRating(newRating, item.game_id)}
                          numberOfStars={5}
                          starDimension='15px'
                          starSpacing='1px'
                          name='rating'
                        />
                      </div>
                    })
                    : null}
                  {/* <div style={{ marginLeft: '12px', width: '100%' }}>
                    <img className='gameIcon' src={WordSerach} width='100%' onClick={() => this.onGameView('searchword')} />
                    <div style={{ fontSize: '17px' }}>fahad</div>
                    <StarRatings
                      rating={rating}
                      starRatedColor='blue'
                      changeRating={this.changeRating}
                      numberOfStars={6}
                      starDimension='15px'
                      starSpacing='1px'
                      name='rating'
                    />
                    <ReactStars
                      count={5}
                      onChange={this.ratingChanged}
                      size={24}
                      color2={'#ffd700'}
                    />
                  </div> */}

                </Grid>
              </Grid>
            </Grid>
          // ? <div className='gamecard' onClick={this.onGameView}>
          //   <div>
          //     <img src={MathPop} />
          //   </div>
          // </div>
            // : <div><iframe className='view' src={urls.Game + gameURl} /> </div>
            : <div><iframe className='view' src={gameURl} /> </div>
          }
          { gameView ? null : <div onClick={this.onClose}>close</div>}

        </div>

      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(
  mapStateToProps
)(withStyles(styles)(Game))
