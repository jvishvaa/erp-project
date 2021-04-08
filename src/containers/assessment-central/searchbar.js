import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },

    },
}));

export default function Search(props) {
    const classes = useStyles();
    const [searchValue, setsearchValue] = useState('')

    const handleChange = (e) => {
        const { value } = e.target;
        setsearchValue(value)
        props.handleSearch(value)

    };

    return (
        <form className={classes.root} noValidate autoComplete="off" style={{
            marginLeft: 'auto',
            order: 2
        }}>
            <TextField id="standard-basic"
                onChange={handleChange}
                label="Ont"
                style={{borderBottom: '1px solid #168D00'}}
                value={searchValue}
                InputProps={{
                    endAdornment: (
                        <SearchIcon style={{ color: 'red' }} />
                    ),
                }}
            />
        </form>
    );
}
