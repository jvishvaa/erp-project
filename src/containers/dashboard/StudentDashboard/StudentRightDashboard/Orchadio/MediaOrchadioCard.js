import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { AlertNotificationContext } from '../../../../../context-api/alert-context/alert-state';
import { useContext, useEffect } from 'react';
import endpoints from '../../config/Endpoint';
import apiRequest from '../../config/apiRequest';
import Endpoint from '../../config/Endpoint';
import classnames from 'classnames';
import Ott from './Ott.png';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        // backgroundColor: 'theme.palette.primary',
        // bgColor: 'theme.palette.primary'
        // bgColor: 'blue',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        padding: 61,
        display: 'flex',
        alignItems: 'center',
        height: 100,
        width: 100,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: 38,
        width: 38,
    },
    disabled: {
        color: 'gray',
    },
}));

export default function MediaControlCard() {
    const classes = useStyles();
    const { setAlert } = useContext(AlertNotificationContext);

    // state
    const [isPlaying, setIsPlaying] = useState(false);
    const [mediaData, setMediaData] = useState([]);
    const [currentAudioId, setCurrentAudioId] = useState(-1);
    const [changeAudio, setChangeAudio] = useState(false);
    const [totalAudioCount, setTotalAudioCount] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const [hasLiked, setHasLiked] = React.useState(false);
    const [likeCount, setLikeCount] = React.useState(0);
    const [isEnabled, setIsEnabled] = React.useState(false);

    //references
    const audioPlayer = useRef();

    const handleLikeButton = () => {
        apiRequest(
            'put',
            `${endpoints?.dashboard?.student?.likedsongorchadio}${mediaData[currentAudioId]?.id}/orchido-like/`
        )
            .then((res) => {
                if (hasLiked) {
                    setLikeCount(likeCount - 1);
                } else {
                    setLikeCount(likeCount + 1);
                }
                setHasLiked(!hasLiked);
                // setLikeChange(true);
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        apiRequest(
            'get',
            `${endpoints?.dashboard?.student?.orchadioapi}`,
            null,
            null,
            true,
            5000
        )
            .then((result) => {
                if (result?.data?.status_code === 200) {
                    setMediaData(result?.data?.result?.data);
                    setTotalAudioCount(result?.data?.result?.total_orchadioprograms);
                    setIsEnabled(result?.data?.is_enabled);
                    if (result?.data?.result?.data?.length > 0) {
                        setCurrentAudioId(0);
                        setPageNumber(1);
                        setLikeCount(result?.data?.result?.data[0]?.likes);
                        setHasLiked(result?.data?.result?.data[0]?.is_like);
                    }
                    //Add loader
                } else {
                    setAlert('error', 'No more songs to play');
                }
            })
            .catch((error) => {
                setAlert('error', 'Network Error');
            });
    }, []);

    const fetchMoreAudio = async (pageNumber) => {
        const response = await apiRequest(
            'get',
            `${endpoints.dashboard.student.orchadioapi}?page_number=${pageNumber}`,
            null,
            null,
            true,
            5000
        );
        if (response.data.status_code === 200) {
            setMediaData([...mediaData, ...response.data?.result?.data]);
            setTotalAudioCount(response?.data?.result?.total_orchadioprograms);
            setPageNumber(pageNumber);
            setIsEnabled(response?.data?.is_enabled);
        } else {
            setAlert('error', 'No more songs to play');
        }
    };

    const togglePlayPause = () => {
        const prevValue = isPlaying;
        setIsPlaying(!prevValue);
        if (!prevValue) {
            play();
        } else {
            pause();
        }
    };

    const play = () => {
        audioPlayer.current.play();
    };

    const pause = () => {
        audioPlayer.current.pause();
    };

    const playNext = () => {
        if (currentAudioId <= mediaData?.length - 1) {
            const prevValue = currentAudioId;
            setCurrentAudioId(prevValue + 1);
            setChangeAudio(true);
            setLikeCount(mediaData[prevValue + 1]?.likes);
            setHasLiked(mediaData[prevValue + 1]?.is_like);
            audioPlayer.current.src = `${Endpoint.s3.Audio}${mediaData[prevValue + 1].files[0]
                }`;
            if (
                mediaData?.length - (prevValue + 1) === 5 &&
                mediaData?.length < totalAudioCount
                && isEnabled
            ) {
                fetchMoreAudio(pageNumber + 1);
            }
        }
    };

    const playLast = () => {
        if (currentAudioId > 0) {
            const prevValue = currentAudioId;
            setCurrentAudioId(prevValue - 1);
            setChangeAudio(true);
            audioPlayer.current.src = `${Endpoint.s3.Audio}${mediaData[prevValue - 1].files[0]}`;
        }
    };

    const onLoadedMetadata = () => {
        if (changeAudio) {
            setIsPlaying(true);
            play();
            setChangeAudio(false);
        }
    };

    return (
        <Card className={classes.root}>
            <CardMedia className={classes.cover} image={Ott} title="orchidiologo" />
            <hr />
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <span component="h5" variant="h5">
                        {currentAudioId !== -1
                            ? `${mediaData[currentAudioId]?.album_name}, ${mediaData[currentAudioId]?.album_title}`
                            : `Loading...`}
                    </span>
                </CardContent>
                <div className={classes.controls}>
                    <IconButton
                        disabled={currentAudioId === 0 || currentAudioId === -1}
                        onClick={playLast}
                        aria-label="previous"
                    >
                        {
                            <SkipPreviousIcon
                                className={classnames({
                                    [classes.disabled]: currentAudioId === 0 || currentAudioId === -1,
                                })}
                            />
                        }
                    </IconButton>
                    {currentAudioId !== -1 && (
                        <audio
                            ref={audioPlayer}
                            src={`${Endpoint.s3.Audio}${mediaData[currentAudioId]?.files[0]}`}
                            onLoadedMetadata={onLoadedMetadata}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                        />
                    )}
                    <IconButton
                        disabled={currentAudioId === -1}
                        onClick={togglePlayPause}
                        aria-label="play/pause"
                    >
                        {isPlaying ? (
                            <PauseIcon className={classes.playIcon} />
                        ) : (
                            <PlayArrowIcon className={classes.playIcon} />
                        )}
                    </IconButton>
                    <IconButton
                        disabled={
                            currentAudioId === mediaData?.length - 1 || currentAudioId === -1
                        }
                        onClick={playNext}
                        aria-label="next"
                    >
                        {
                            <SkipNextIcon
                                className={classnames({
                                    [classes.disabled]: currentAudioId === mediaData?.length - 1 || currentAudioId === -1,
                                })}
                            />
                        }
                    </IconButton>
                    <IconButton aria-label="like audio" onClick={handleLikeButton}>
                        {hasLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        {likeCount}
                    </IconButton>
                </div>
            </div>
        </Card>
    );
}
