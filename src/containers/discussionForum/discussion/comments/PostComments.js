import React, { Fragment } from 'react';
import CommentBlock from './CommentBlock'
import Comments from './Comments';
import { makeStyles} from '@material-ui/core';

const useStyles = makeStyles({
    childComment: {
        marginLeft: '15px',
        marginTop: '10px',
    }
})

export default function PostCommentsComponent(props) {
    const classes = useStyles({});
    return (
        <Fragment>
            <Comments 
                firstname={props.firstname}
                lastname={props.lastname}
                commnet={props.commnet}
                likes={props.likes}
            />
            {props.replies !== undefined && (
                <div className={classes.childComment}>
                    {props.replies.map((rowData, id) => (
                        <CommentBlock
                            key={id}
                            firstname={rowData.firstname}
                            lastname={rowData.lastname}
                            commnet={rowData.commnet}
                            likes={rowData.likes}
                            replies={rowData.commnet_reply}
                        />
                    ))}
                </div>
            )}
        </Fragment>
    )
}

export const PostComments = React.memo(PostCommentsComponent);