import { Component, ErrorInfo, ReactNode } from 'react';
import safeStorage from '../services/storage';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in Civio Application:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="w-16 h-16 rounded-full bg-error/10 border border-error/20 flex items-center justify-center text-error mb-4 shadow-lg shadow-error/10">
            <span className="material-symbols-outlined text-3xl">report_problem</span>
          </div>
          <h1 className="font-display-lg text-2xl text-white font-extrabold mb-2">Something Went Wrong</h1>
          <p className="font-body-md text-on-surface-variant max-w-[400px] mb-6">
            An unexpected error occurred. Don't worry, your neighborhood alerts are safe.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-primary text-on-primary font-label-bold rounded-xl active:scale-95 transition-transform"
            >
              Reload App
            </button>
            <button
              onClick={() => {
                safeStorage.clear();
                window.location.href = '/onboarding';
              }}
              className="px-6 py-2.5 bg-surface-container hover:bg-surface-container-high border border-white/5 font-label-bold rounded-xl active:scale-95 transition-transform"
            >
              Reset Session
            </button>
          </div>
          {this.state.error && (
            <pre className="mt-8 p-4 bg-zinc-950 border border-white/5 rounded-xl text-left text-[10px] text-zinc-500 font-mono max-w-full overflow-auto max-h-40">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
