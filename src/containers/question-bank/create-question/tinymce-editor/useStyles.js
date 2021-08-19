import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  myTinyEditor: {
    '& .tox-tinymce': {
      border: '1px solid #dbdbdb !important',
      borderRadius: '10px !important',
    },

    '& .tox-tbtn__select-label': {
      color: `${theme.palette.secondary.main} !important`,
    },

    '& .tox-collection__item-label': {
      color: `${theme.palette.secondary.main} !important`,
    },

    '& .tox-statusbar__branding': {
      display: 'none !important',
    },
    '& .tox-statusbar__path-item': {
      display: 'none !important',
    },

    '& .tox-editor-header': {
      background: 'white !important',
    },

    '& .tox-statusbar__wordcount': {
      color: `${theme.palette.secondary.main} !important`,
      fontSize: '14px !important',
      textTransform: 'capitalize !important',
      margin: '10px !important',
      fontWeight: '600 !important',
    },

    '& .tox-statusbar': {
      padding: '10px !important',
    },

    '& .tox-tbtn__select-chevron svg': {
      fill: `${theme.palette.secondary.main} !important`,
    },

    '& .tox-tbtn__icon-wrap svg': {
      fill: `${theme.palette.secondary.main} !important`,
    },

    '& .tox-toolbar__primary': {
      background: 'none !important',
      margin: '1% 0 -2% 37% !important',
      marginBottom: '1px !important',

      [theme.breakpoints.down('sm')]: {
        marginLeft: '83% !important',
      },
    },

    '& .tox-tbtn--bespoke': {
      border: `1px solid ${theme.palette.primary.main} !important`,
      borderRadius: '5px !important',
      width: '15% !important',
      marginRight: '10px !important',
      paddingRight: '10px !important',
    },

    '& .tox-tbtn--bespoke:nth-child(2)': {
      width: '10% !important',
      fontWeight: '600 !important',
    },

    '& .tox-tbtn': {
      border: `1px solid ${theme.palette.primary.main} !important`,
      borderRadius: '5px !important',
      marginRight: '10px !important',
    },

    '& .tox-tbtn--enabled': {
      background: `${theme.palette.primary.main} !important`,
    },

    '&  .tox-tbtn--enabled svg': {
      fill: 'white !important',
    },

    '& .tox-tbtn--select': {
      borderRadius: '10px',
    },

    '& .tox-tbtn:nth-last-child(1)': {
      background: `${theme.palette.primary.main} !important`,
      padding: '10px 20px !important',
      borderRadius: '10px !important',
      cursor: 'pointer !important',
      [theme.breakpoints.down('sm')]: {
        padding: '1px 10px !important',
      },
    },

    '& .tox-tbtn__select-label:nth-last-child(1)': {
      color: 'white !important',
      cursor: 'pointer !important',
    },

    '& .tox-statusbar__path-divider': {
      display: 'none !important',
    },

    '& ._2fxoL ._2wk9O-gbutton': {
      display: 'none !important',
    },
  },
}));

export default useStyles;
