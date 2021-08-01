import React from 'react';
import ErrorBoundary404 from 'components/ErrorBoundaries404/errorBoundaries404';
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: true, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorBoundary404 />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
