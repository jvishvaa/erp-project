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
      elements['colors'][theme_key || 'primary_color'] = theme_value || '#ff6b6b';
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
    darkprimary = '#cc5656',
    lightprimary = '#994040',
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
