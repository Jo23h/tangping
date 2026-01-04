import { Component } from 'react';
import './GoogleDocViewer.css';
import { getEmbedUrl } from '../../services/googleDocsService';

// Error Boundary to prevent crashes
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('GoogleDocViewer Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="google-doc-error">
          <h3>Unable to load Google Doc</h3>
          <p>There was an error loading the document viewer.</p>
          <p className="error-details">{this.state.error?.message}</p>
          <button
            className="error-retry-btn"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function GoogleDocViewer({ googleDocUrl, taskText }) {
  if (!googleDocUrl) {
    return (
      <div className="google-doc-empty">
        <div className="google-doc-empty-content">
          <p>No memo created yet</p>
          <p className="google-doc-empty-hint">
            Click the memo button on a task to create a Google Doc
          </p>
        </div>
      </div>
    );
  }

  const embedUrl = getEmbedUrl(googleDocUrl);

  if (!embedUrl) {
    return (
      <div className="google-doc-error">
        <h3>Invalid Google Doc URL</h3>
        <p>The stored URL is not a valid Google Document.</p>
        <a
          href={googleDocUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="google-doc-link"
        >
          Open in new tab
        </a>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="google-doc-viewer">
        <div className="google-doc-header">
          <span className="google-doc-title">{taskText || 'Task Memo'}</span>
          <a
            href={googleDocUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="google-doc-open-btn"
          >
            Open in Google Docs
          </a>
        </div>
        <div className="google-doc-iframe-container">
          <iframe
            src={embedUrl}
            className="google-doc-iframe"
            title="Google Doc Viewer"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default GoogleDocViewer;
