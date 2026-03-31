import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches runtime errors and chunk loading failures (common after new deployments).
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    // If a chunk fails to load, it's usually a "Loading chunk failed" or similar error
    // in some browsers, it might be a script error.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Check if it's a chunk loading error. If so, we might want to suggest a reload.
    const isChunkError = /loading.*chunk/i.test(error.message) || /failed.*fetch/i.test(error.message);
    if (isChunkError) {
      console.warn('Chunk loading error detected. Site might be out of date. Reloading...');
      // Simple strategy: reload once.
      const lastReload = sessionStorage.getItem('last-error-reload');
      const now = Date.now();
      if (!lastReload || now - parseInt(lastReload) > 30000) {
        sessionStorage.setItem('last-error-reload', now.toString());
        window.location.reload();
      }
    }
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-[#072421] flex items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-6">
            <h2 className="text-white font-montserrat text-2xl font-bold uppercase tracking-tight">Ця сторінка не завантажилась</h2>
            <p className="text-white/40 text-sm">Спробуйте оновити сторінку. Це може статись після оновлення сайту.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-10 py-4 bg-primary text-black font-black uppercase text-[10px] tracking-widest rounded-sm hover:bg-white transition-all"
            >
              Оновити
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
