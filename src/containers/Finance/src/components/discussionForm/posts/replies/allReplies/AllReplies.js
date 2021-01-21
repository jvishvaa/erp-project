import React from 'react'
import { Paper } from '@material-ui/core'
import Reply from '../reply/reply'

function AllReplies ({ alert, replies, number, likeCommentFunction }) {
  return (
    <div style={{ marginTop: '20px', clear: 'both' }}>
      {replies && replies.map((reply, index) => (
        <Paper style={{ marginTop: '20px', backgroundColor: number % 2 === 0 ? '#ffede2' : '#fff9f5' }}>
          <Reply alert={alert} reply={reply} number={number} likeCommentFunction={likeCommentFunction} />
        </Paper>
      ))}
    </div>
  )
}
export default AllReplies
