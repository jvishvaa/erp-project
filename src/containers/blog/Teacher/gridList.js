import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Grid, Card, Button, Typography } from '@material-ui/core';

const styles = (theme) => ({
  root: {
    width: '100%',
    flexGrow: 1,
    // overflow: 'scroll',
  },
  Card: {
    margin: 20,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    border: '1px solid red',
    borderRadius: '16px',
  },
});
class GridList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    return (
      <table style={{ border: '1px solid red' }}>
        <tr style={{ border: '1px solid red' }}>
          <td>
            <Card className={classes.Card} style={{ width: '555px', height: '260px' }}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image='/static/images/cards/contemplative-reptile.jpg'
                  title='Contemplative Reptile'
                />
                <CardContent>
                  <Typography gutterBottom variant='body2' align='left' component='p'>
                    Lizard
                  </Typography>
                  <Typography
                    variant='body2'
                    style={{
                      marginTop: '45px',
                      fontSize: 'x-large',
                      fontWeight: 'bolder',
                    }}
                    color='textSecondary'
                    component='p'
                  >
                    Lizards are a widespread group of squamate reptiles.
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions style={{ float: 'right' }}>
                <Button
                  size='small'
                  color='primary'
                  style={{ bottom: '-25px', width: 150 }}
                >
                  Read more
                </Button>
              </CardActions>
            </Card>
          </td>
          <td>
            <Card className={classes.Card} style={{ width: '265px', height: '390px' }}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image='/static/images/cards/contemplative-reptile.jpg'
                  title='Contemplative Reptile'
                />
                <CardContent>
                  <Typography gutterBottom variant='body2' align='left' component='p'>
                    Lizard
                  </Typography>
                  <Typography
                    variant='body2'
                    style={{
                      marginTop: '45px',
                      fontSize: 'x-large',
                      fontWeight: 'bolder',
                    }}
                    color='textSecondary'
                    component='p'
                  >
                    Lizards are a widespread group of squamate reptiles.
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions style={{ float: 'right' }}>
                <Button
                  size='small'
                  color='primary'
                  style={{ bottom: '-115px', width: 150 }}
                >
                  Read more
                </Button>
              </CardActions>
            </Card>
          </td>
          <td>
            <Card className={classes.Card} style={{ width: '265px', height: '390px' }}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image='/static/images/cards/contemplative-reptile.jpg'
                  title='Contemplative Reptile'
                />
                <CardContent>
                  <Typography gutterBottom variant='body2' align='left' component='p'>
                    Lizard
                  </Typography>
                  <Typography
                    variant='body2'
                    style={{
                      marginTop: '45px',
                      fontSize: 'x-large',
                      fontWeight: 'bolder',
                    }}
                    color='textSecondary'
                    component='p'
                  >
                    Lizards are a widespread group of squamate reptiles.
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions style={{ float: 'right' }}>
                <Button
                  size='small'
                  color='primary'
                  style={{ bottom: '-115px', width: 150 }}
                >
                  Read more
                </Button>
              </CardActions>
            </Card>
          </td>
        </tr>
        <tr style={{ border: '1px solid red' }}>
          <td style={{ border: '1px solid red' }}> hello</td>
          <td style={{ border: '1px solid red' }}>
            <Card className={classes.Card} style={{ width: '555px', height: '260px' }}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image='/static/images/cards/contemplative-reptile.jpg'
                  title='Contemplative Reptile'
                />
                <CardContent>
                  <Typography gutterBottom variant='body2' align='left' component='p'>
                    Lizard
                  </Typography>
                  <Typography
                    variant='body2'
                    style={{
                      marginTop: '45px',
                      fontSize: 'x-large',
                      fontWeight: 'bolder',
                    }}
                    color='textSecondary'
                    component='p'
                  >
                    Lizards are a widespread group of squamate reptiles.
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions style={{ float: 'right' }}>
                <Button
                  size='small'
                  color='primary'
                  style={{ bottom: '-25px', width: 150 }}
                >
                  Read more
                </Button>
              </CardActions>
            </Card>
          </td>
        </tr>
      </table>
    );
  }
}

export default withStyles(styles)(GridList);
