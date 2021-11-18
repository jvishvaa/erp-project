import React, { useEffect } from 'react';
import endpoints from '../../config/Endpoint';
import apiRequest from './../../config/apiRequest';
import { makeStyles, Avatar } from '@material-ui/core';
import { red } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
    commentReply: {
        display: 'flex',
        marginTop: '10px'
    },
    avatar: {
        marginRight: '10px'
    },
    commentData: {
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: '10px',
        padding: '7px',
        width: '100%',
    }
}))

export default function CommentReplies(props) {
    console.log("Coming here: ", props)
    const classes = useStyles()
    const [comments, setComments] = React.useState([]);
    useEffect(() => {
        apiRequest('get', `${endpoints.dashboard.student.commentReplies}?comment=${props.id}`)
            .then((result) => {
                console.log('Data Recieved: ', result.data.result.results);
                if (result.data.status_code === 200) {
                    setComments(result?.data?.result?.results);
                    // setAlert('success', result.data.message)
                }
            })
            .catch((error) => {
                console.log('error');
                // setAlert('error', 'Failed to mark attendance');
            });
    }, [props.replayCount]);
    return (
        <>
            {comments.map((comment, index) => (
                <div className={classes.commentReply} key={index}>
                    <Avatar sx={{ bgcolor: red[500] }} className={classes.avatar}>
                        RD
                    </Avatar>
                    <div className={classes.commentData}>
                        <h4>{`${comment.first_name} ${comment.last_name}`}</h4>
                        <p>{comment.answer}</p>
                    </div>
                </div>
            ))}
        </>
    );
}
