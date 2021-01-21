import React from 'react'
import { Paper } from '@material-ui/core'

function SubComments ({ subComment, number }) {
  return (
    <Paper>
      <div style={{ padding: '20px', backgroundColor: number % 2 === 0 ? '#ffede2' : '#fff9f5' }}>
        <span style={{ display: 'block' }}>{subComment.reply_user.first_name === null ? `randomUser${subComment.id}` : subComment.reply_user.first_name}</span>
        <span style={{ color: '#888', marginBottom: '8px', display: 'block' }} >{subComment.replay_creation_ago}</span>
        <p style={{ fontSize: '16px', fontWeight: 700 }}>{subComment.answer}</p>
      </div>
    </Paper>
  )
}

export default SubComments
