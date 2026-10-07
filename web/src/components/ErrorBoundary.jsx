import React from 'react';

/**
 * ErrorBoundary — last-resort UI when a React render throws.
 *
 * ⚠️ INTERVIEW TIP: Without this, a single component crash becomes a white
 * screen. Production apps catch the error, log it, and give the user a way back.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('Placcera render error:', error, info);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 p-6 text-center">
                    <h1 className="text-2xl font-bold tracking-tight mb-2">Something went wrong</h1>
                    <p className="text-slate-500 max-w-md mb-6">
                        The page hit an unexpected error. Reload to continue. If this keeps happening, try signing in again.
                    </p>
                    <button
                        type="button"
                        onClick={this.handleReload}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                        Reload
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
