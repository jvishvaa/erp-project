import { createMuiTheme } from '@material-ui/core/styles';
import { colorLuminance } from '../utility-functions';
import axiosInstance from '../config/axios';
import endpoints from '../config/endpoints';
const colorsys = require('colorsys')

  const isV2 = sessionStorage.getItem('selected_branch')
  ? JSON.parse(sessionStorage.getItem('selected_branch'))?.isV2
  : '';
  const isV2Button = JSON.parse(localStorage.getItem('selectedVersion'));

export function fetchThemeApi() {
  return axiosInstance
    .get(`${endpoints.themeAPI.school_theme_fetch}`)
    .then((res) => {
      if (res?.data?.status_code === 200) {
        const result = res?.data?.result?.data || [];
        const theme = [];
        if (result?.length > 0) {
          result.forEach(({ theme_key = 'primary_color', theme_value = ['#ff6b6b'] }) => {
            theme.push({
              theme_key: theme_key,
              theme_value: theme_value[0],
            });
          });
          localStorage.setItem('themeDetails', JSON.stringify(theme));
        }
      }
    })
    .catch(() => { });
}
const getlightestcolor = (color) => {
  const hex_RGB = colorsys.parseCss(color);//return rgb 
  var hsv = colorsys.rgb_to_hsv(hex_RGB)//convert to hsv
  const hue = hsv['h']
  hsv = { h: hue, s: 6, v: 100 }
  const lightRGB = colorsys.hsv_to_rgb(hsv)
  return (colorsys.rgbToHex(lightRGB))
}

const getThemeElements = () => {
  let themeDetails = null;
  try {
    themeDetails = JSON.parse(localStorage.getItem('themeDetails')) || [];
  } catch (e) {
    themeDetails = [];
  }
  const elements = {
    colors: {
      primary_color: '#ff6b6b',
      second_color: '#014b7e',
    },
  };

  if (isV2) {
    if(isV2Button === null || isV2Button){
      elements['colors']['primary_color'] = '#1B4CCB';
      elements['colors']['second_color'] = '#32334A';
    }
  } else if (themeDetails?.length > 0) {
    themeDetails.forEach(({ theme_key, theme_value }) => {
      elements['colors'][theme_key || 'primary_color'] = theme_value || '#ff6b6b';
    });
  }

  elements['colors']['darkprimary'] = colorLuminance(elements.colors.primary_color, -0.2);
  elements['colors']['lightprimary'] = colorLuminance(
    elements.colors.primary_color,
    -0.4
  );
  elements['colors']['lightestprimary'] = getlightestcolor(elements.colors.primary_color);
  return elements;
};

export const isFetchThemeRequired = () => {
  let themeDetails = null;
  try {
    themeDetails = JSON.parse(localStorage.getItem('themeDetails')) || [];
  } catch (e) {
    themeDetails = [];
  }
  return (
    !themeDetails.every(({ theme_key, theme_value }) =>
      Boolean(theme_key && theme_value)
    ) || themeDetails?.length === 0
  );
};

export function themeGenerator() {
  const { colors = {} } = getThemeElements() || {};
  const {
    primary_color: primarytemp = '#ff6b6b',
    second_color: secondarytemp = '#014b7e',
    darkprimary = '#cc5656',
    lightprimary = '#994040',
    lightestprimary = '#fff6f6  '
  } = colors || {};

  return createMuiTheme({
    palette: {
      primary: {
        // main: '#ff6b6b',
        primarylight: lightprimary,
        main: primarytemp,
        primarydark: darkprimary,
        primarylightest: lightestprimary,
      },
      secondary: {
        // main: '#014b7e',
        main: secondarytemp,
      },
      text: {
        // default: '#014b7e',
        default: secondarytemp,
      },
      background: {
        primary: '#ffffff',
        secondary: '#f9f9f9',
      },
      v2Color1: {
        primaryV2: isV2 ? '#4a77e8' : '#FFD9D9',
      },
      v2Color2: {
        primaryV2: isV2 ? '#4a77e8' : '#ef676a',
      }
    },
    typography: {
      fontSize: 16,
      color: secondarytemp,
    },
    MuiButtonBase: {
      root: {
        color: primarytemp,
      },
    },
    commonTableRoot: {
      width: '100%',
      boxShadow: 'none',
      '& th': {
        '&:not(:last-child)': {
          '&:after': {
            backgroundColor: primarytemp,
          },
        },
      },
    },

    switchLabel: {
      fontWeight: '600 !important',
      color: `${primarytemp} !important`,
    },
    //Css for view more card
    rootViewMore: {
      border: `1px solid ${primarytemp}`,
      borderRadius: '10px !important',
      height: '80vh',
      width: '100%',
      margin: '0 auto',
      boxShadow: 'none',
      overflowY: 'scroll',
      position: 'sticky',
      top: '10%',
      animationDuration: '500ms',
      animationName: 'slidein',

      /* width */
      '&::-webkit-scrollbar': {
        width: '10px',
      },

      /* Track */
      '&::-webkit-scrollbar-track': {
        background: '#f9f9f9',
        borderRadius: '10px',
      },

      /* Handle */
      '&::-webkit-scrollbar-thumb': {
        background: '#949090',
        borderRadius: '10px',
      },

      /* Handle on hover */
      '&::-webkit-scrollbar-thumb:hover': {
        background: '#949090',
      },

      '& .bodyTitle': {
        fontSize: '1rem',
        fontWeight: 600,
        color: secondarytemp,
        display: 'flex',
        justifyContent: 'space-between',
        margin: '0 auto',
        paddingLeft: '10px',
      },
      '& .bodyContent': {
        fontSize: '1rem',
        color: secondarytemp,
        margin: '15px auto',
        display: 'flex',
        justifyContent: 'space-between',
        wordBreak: 'break-all',
        paddingLeft: '10px',
      },
      '& .viewMoreBody': {
        margin: '15px',
        paddingBottom: '10px',
        borderBottom: '1px solid #e2e2e2',
      },
      '& .viewMoreHeader': {
        // backgroundColor: '#fceeee',
        backgroundColor: lightestprimary,
        display: 'flex',
        justifyContent: 'space-between',
        borderRadius: '10px 0px 0px 0px',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        '& .headerContent': {
          fontSize: '1.1rem',
          color: secondarytemp,
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
        },
        '& .headerTitle': {
          fontSize: '1.1rem',
          color: primarytemp,
          marginBottom: '7px',
        },
        '& .leftHeader': {
          display: 'flex',
          flexDirection: 'column',
          padding: '15px',
        },
        '& .rightHeader': {
          display: 'flex',
          flexDirection: 'column',
          padding: '15px',
          '& .closeIcon': {
            alignSelf: 'flex-end',
            '& .MuiIconButton-root': {
              padding: '0px',
            },
          },
          '& .viewUpdatedDate': {
            alignSelf: 'flex-end',
          },
        },
      },
      '@media screen and (max-width:768px)': {
        zIndex: '1',
        width: '90%',
        margin: '20px 0 0 -12px',
        position: 'absolute',
        boxShadow: '0px 0px 100px 100px rgba(192, 192, 192, 0.5) !important',
      },
    },
    dayIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '25px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: '1rem',
      fontWeight: 600,
      border: `1px solid ${primarytemp} !important`,
      '@media screen and(max-width:768px)': {
        width: '30px',
        height: '30px',
        borderRadius: '25px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '1rem',
        fontWeight: 600,
        color: secondarytemp,
        fontSize: '12px',
        border: `1px solid ${primarytemp}`,
      },
    },
    homeworkTableWrapper: {
      border: `1px solid ${primarytemp}`,
      boxShadow: 'none',
      borderRadius: '10px',
      '& .MuiTableCell-root': {
        '&:not(:last-child)': {
          borderRight: `1px solid ${primarytemp}`,
        },
      },
      '& .MuiTableHead-root': {
        '& .MuiTableCell-root': {
          borderBottom: `1px solid ${primarytemp}`,
          color: secondarytemp,
        },
      },
      '& .MuiTableRow-root': {
        '&:not(:last-child)': {
          '& .MuiTableCell-root': {
            borderBottom: `1px solid ${primarytemp}`,
          },
        },
        '& .MuiTableCell-root': {
          color: secondarytemp,
        },
      },
    },
    toolTipText: {
      color: primarytemp,
      border: `1px solid ${primarytemp}`,
    },
    overrides: {
      MuiButton: {
        // Name of the rule
        root: {
          // Some CSS
          textTransform: 'capitailize',
          textDecoration: 'none',
          borderRadius: '10px',
          color: '#ffffff',
          backgroundColor: primarytemp,
          '& .MuiSvgIcon-root': {
            color: '#fff',
          },
        },
      },
      MuiSvgIcon: {
        root: {
          color: primarytemp,
        },
      },
      MuiSelect: {
        icon: {
          color: primarytemp,
        },
      },
      MuiInputBase: {
        root: {
          borderRadius: '10px',
          // color: secondarytemp,
        },
      },
      MuiButtonBase: {
        root: {
          color: secondarytemp,
          '& .MuiTab-wrapper': { color: secondarytemp },
        },
      },
      MuiFormLabel: {
        root: {
          color: secondarytemp,
          '&.Mui-focused': {
            color: secondarytemp,
            fontWeight: '600',
          },
        },
      },
      MuiOutlinedInput: {
        root: {
          borderRadius: '10px',
        },
        '& .Mui-focused.MuiOutlinedInput-notchedOutline': {
          borderColor: secondarytemp,
        },
      },
      MuiInputLabel: {
        outlined: {
          '&.MuiInputLabel-shrink': {
            fontWeight: '600',
          },
        },
      },
      MuiTablePagination: {
        caption: {
          fontWeight: 600,
          color: secondarytemp,
        },
      },
      MuiDialogTitle: {
        root: {
          color: secondarytemp,
        },
      },
    },
  });
}
