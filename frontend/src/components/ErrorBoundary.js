import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
                    <h1>Something went wrong.</h1>
                    <p>{this.state.error?.message || 'An unknown error occurred.'}</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
