import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  durationWrapper: {
    display: 'flex',
    flexDirection: 'column',
    '& .durationTag': {
      color: theme.palette.secondary.main,
      fontSize: '18px',
      fontWeight: 600,
      textAlign: 'center',
    },
    '& .durationContainer': {
      margin: '20px 0 30px 0',
      borderRadius: '10px',
      minHeight: '49vh',
      maxHeight: '49vh',
      overflowY: 'auto',
      boxShadow: '0 4px 10px 0px rgba(1, 75, 126, 0.2)',
      '& .weeksContainer': {
        padding: '20px',
        '& .MuiFormControl-root': {
          width: '100%',
        },
      },
      '& .isRecursiveSwitch': {
        padding: '0 20px 10px 20px',
      },
      '& .recursiveContainer': {
        padding: '0 20px 20px 10px',

        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },

        '& .recursiveRow': {
          display: 'flex',
          justifyContent: 'space-between',
          margin: '10px 20px',

          '& .addRemoveIconContainer': {
            alignSelf: 'center',
            marginRight: '5%',
            display: 'flex',
          },

          '& .weekContainer': {
            width: '47.5%',
            display: 'flex',
            justifyContent: 'flex-start',

            [theme.breakpoints.down('sm')]: {
              width: '50%',
            },

            '& .recursiveWeekContainer': {
              width: '100%',
              [theme.breakpoints.down('sm')]: {
                width: '70%',
                marginRight: '5%',
              },
              '& .MuiFormControl-root': {
                background: '#f2f2f2',
                borderRadius: '10px',
              },
            },
          },

          '& .recursivePriceContainer': {
            width: '47.5%',
            marginLeft: '5%',
            [theme.breakpoints.down('sm')]: {
              width: '40%',
              marginLeft: '10%',
            },

            '& .MuiFormControl-root': {
              background: '#f2f2f2',
              borderRadius: '10px',
            },
          },
        },
      },
    },
    '& .singleButtonContainer': {
      width: '40%',
      display: 'flex',
      justifyContent: 'space-between',
      alignSelf: 'flex-end',
    },
    '& .multiButtonContainer': {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignSelf: 'flex-end',
    },
  },
}));

export default useStyles;
