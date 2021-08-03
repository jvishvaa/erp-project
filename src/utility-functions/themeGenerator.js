import { createMuiTheme } from '@material-ui/core/styles';
import { colorLuminance } from '../utility-functions';
import axiosInstance from '../config/axios';
import endpoints from '../config/endpoints';

export function fetchThemeApi() {
  return axiosInstance
    .get(`${endpoints.themeAPI.school_theme_fetch}`)
    .then((res) => {
      if (res?.data?.status_code === 200) {
        const result = res?.data?.result?.data || [];
        const theme = [];
        if (result?.length > 0) {
          result.forEach((item) => {
            if (item.theme_key === 'primary_color') {
              let primary = {};
              primary['theme_key'] = item.theme_key;
              primary['theme_value'] = item.theme_value[0];
              theme.push(primary);
            }
            if (item.theme_key === 'second_color') {
              let second = {};
              second['theme_key'] = item.theme_key;
              second['theme_value'] = item.theme_value[0];
              theme.push(second);
            }
          });
          localStorage.setItem('themeDetails', JSON.stringify(theme));
        }
      }
    })
    .catch(() => {});
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

  if (themeDetails?.length > 0) {
    themeDetails.forEach(({ theme_key, theme_value }) => {
      elements['colors'][theme_key] = theme_value;
    });
    elements['colors']['darkprimary'] = colorLuminance(
      elements.colors.primary_color,
      -0.2
    );
    elements['colors']['lightprimary'] = colorLuminance(
      elements.colors.primary_color,
      -0.4
    );
  }
  return elements;
};

export function themeGenerator() {
  const { colors = {} } = getThemeElements() || {};
  const {
    primary_color: primarytemp = '#ff6b6b',
    second_color: secondrytemp = '#014b7e',
    darkprimary = '#ff6b6b',
    lightprimary = '#014b7e',
  } = colors || {};

  return createMuiTheme({
    palette: {
      primary: {
        // main: '#ff6b6b',
        primarylight: lightprimary,
        main: primarytemp,
        primarydark: darkprimary,
      },
      secondary: {
        // main: '#014b7e',
        main: secondrytemp,
      },
      text: {
        default: '#014b7e',
      },
      background: {
        primary: '#ffffff',
        secondary: '#f9f9f9',
      },
    },
    typography: {
      fontSize: 16,
      color: '#014b7e',
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
        },
      },
    },
  });
}
