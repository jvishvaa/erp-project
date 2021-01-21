import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import ButtonBase from '@material-ui/core/ButtonBase'
import CircularProgress from '@material-ui/core/CircularProgress'
import Badge from '@material-ui/core/Badge'

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: 20,
    bottom: 20,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px'
  }
}))(Badge)

function FolderCard ({ card, onClick, isLoading }) {
  return <ButtonBase focusRipple><StyledBadge anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'right'
  }} badgeContent={card.count} color='error'>
    <div onClick={onClick} style={{ display: 'flex', textAlign: 'start', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start', padding: 16, backgroundImage: `url("/folder.svg")`, width: window.isMobile ? ((window.screen.width / 2) - 48) : 295, height: window.isMobile ? ((window.screen.width / 2) - 48) * 0.717 : 211, backgroundSize: 'cover' }}>
      {isLoading && <div style={{ justifySelf: 'center', alignSelf: 'center' }}><CircularProgress size={24} /></div>}
      <div style={{ fontSize: window.isMobile ? 12 : 24, color: 'black', textAlign: 'start' }} className='card-title'>
        {card.content}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', fontSize: 12, color: 'black' }} className='card-subtitle-area'>
        <div>{card.subtitle}</div>
      </div>
      { card.subtitle2 ? <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', fontSize: 12, color: 'black' }} className='card-subtitle-2'>
        <div>{card.subtitle2}</div>
      </div> : ''}
    </div></StyledBadge></ButtonBase>
}

export default FolderCard
