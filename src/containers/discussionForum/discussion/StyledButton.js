import React from 'react';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Button from '@material-ui/core/Button';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#FF6B6B',
    },
    secondary: {
      main: '#FF6B6B',
    },
  },
});

const useStyels = makeStyles({
  contained: {
    color: '#FFFFFF',
    borderRadius: '10px',
  },
  outlined: {
    borderRadius: '10px',
  },
});

export function OutlinedButton(props) {
  const classes = useStyels({});
  return (
    <ThemeProvider theme={theme}>
      <Button color='primary' variant='outlined' className={classes.outlined}>
        Primary
      </Button>
    </ThemeProvider>
  );
}

export function ContainedButton() {
  const classes = useStyels({});
  return (
    <ThemeProvider theme={theme}>
      <Button color='primary' variant='contained' className={classes.contained}>
        Secondary
      </Button>
    </ThemeProvider>
  );
}

export function MyButton({ color, variant, ...props }) {
  const classes = useStyels({});

  return variant === 'outlined' ? (
    <ThemeProvider theme={theme}>
      <Button color={color || 'primary'} variant='outlined' className={classes.outlined}>
        Primary
      </Button>
    </ThemeProvider>
  ) : (
    <ThemeProvider theme={theme}>
      <Button
        color={color || 'primary'}
        variant='contained'
        className={classes.contained}
      >
        Secondary
      </Button>
    </ThemeProvider>
  );
}
