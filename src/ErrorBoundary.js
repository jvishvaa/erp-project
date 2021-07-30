import React from 'react';
import ErrorBoundary404 from 'components/ErrorBouderies404/errorBunderies404';
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    console.log(error, errorInfo, 'error');
  }

  render() {
    if (this.state.hasError) {
      return <ErrorBoundary404 />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
