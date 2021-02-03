<div className={classes.root}>
  {/* <GridList cellHeight='auto' cellWidth={450} className={classes.gridList} cols={4}>
          {tileData.map((tile) => (
            <GridListTile key={tile.img} cols={tile.cols || 1}>
              {tile.img}
            </GridListTile>
          ))}
        </GridList> */}

  <Grid container spacing={1}>
    <Grid item xs={12} sm={6}>
      <Grid item xs={8}>
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
            <Button size='small' color='primary' style={{ bottom: '-25px', width: 150 }}>
              Read more
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid container direction='row' justify='flex-start' alignItems='center'>
        <Grid item xs={3}>
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
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card
            className={classes.Card}
            style={{ width: '265px', height: '390px', marginLeft: '180px' }}
          >
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
        </Grid>
      </Grid>
    </Grid>
    <Grid item xs={12} sm={6}>
      <Grid container direction='row' justify='flex-start' alignItems='center'>
        <Grid item xs={3}>
          <Card
            className={classes.Card}
            style={{ width: '265px', height: '390px', marginLeft: '100px' }}
          >
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
        </Grid>
        <Grid item xs={3}>
          <Card
            className={classes.Card}
            style={{ width: '265px', height: '390px', marginLeft: '255px' }}
          >
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
        </Grid>
      </Grid>
      <Grid item xs={8}>
        <Card
          className={classes.Card}
          style={{ width: '555px', height: '260px', marginLeft: '100px' }}
        >
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
            <Button size='small' color='primary' style={{ bottom: '-25px', width: 150 }}>
              Read more
            </Button>
          </CardActions>
        </Card>
        {/* <Card
                className={classes.Card}
                style={{ width: '555px', height: '260px', marginLeft: '100px' }}
              >
                xs=12 sm=6
              </Card> */}
      </Grid>
    </Grid>
  </Grid>
</div>;
