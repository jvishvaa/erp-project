import React from 'react';
import { makeStyles, Button, withStyles } from '@material-ui/core';
//import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
//import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const useStyles = makeStyles({
    pageNumberDive: {
        height: '53px',
        textAlign: 'center',
        marginTop: '50px',
    },
    pageNumberSpan: {
        display: 'inline-block',
        textAlign: 'center',
        width: '30px',
        height: '30px',
        fontSize: '20px',
        borderRadius: '50%',
        marginLeft: '5px',
        cursor: 'pointer',
    },
    activePageNumber: {
        color: '#001495',
        backgroundColor: '#F9D474',
    },
    pageNumber: {
        color: '#F9D474',
    },
    button: {
        backgroundColor: 'transparent',
        color: '#F9D474',
    }
})

const StyledButton = withStyles({
    root: {
        color: '#001495',
        backgroundColor: 'transparent',
    }
})(Button);

const Pagination = ({ showPerPage, onPaginationChange, totalCategory}) => {
    const classes = useStyles({});
    const [ page, setPage ] = React.useState(1);
    const [ numberOfPage, setNumberOfPage ] = React.useState(Math.ceil(totalCategory/showPerPage));

    React.useEffect(() => {
        const value = showPerPage * page;
        onPaginationChange(value - showPerPage, value);
    }, [page]);

    const onButtonClick = (type) => {
        if (type === 'prev') {
            if (page === 1) {
                setPage(1);
            } else {
                setPage( page - 1);
            }
        }
        else if (type === 'next') {
            setPage( page + 1);
            if(numberOfPage === page){
                setPage(page);
            } else {
                setPage( page + 1);
            }
        }
    }

    return (
        <div className={classes.pageNumberDive}>
            <StyledButton
                variant="text"
                //startIcon={<ArrowBackIosIcon/>}
                onClick={() => onButtonClick('prev')}
            >
                Previous
            </StyledButton>
            { new Array(numberOfPage).fill('').map((ele, index) => (
                <span
                    className={`${classes.pageNumberSpan} ${index + 1 === page ? classes.activePageNumber : classes.pageNumber}`}
                    onClick={() => setPage(index + 1)}
                    key={index}
                >
                    { index + 1}
                </span>
            ))}
            <StyledButton
                variant="text"
                //endIcon={<ArrowForwardIosIcon/>}
                onClick={() => onButtonClick('next')}
            >
                Next
            </StyledButton>
        </div>
    )
}

export default Pagination;