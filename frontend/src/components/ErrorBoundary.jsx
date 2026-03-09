import React from "react"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#0b0c10",
              color: "#fff",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>Something went wrong</h2>
            <p style={{ color: "#c5c6c7", marginBottom: "1.5rem" }}>
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false })
                window.location.reload()
              }}
              style={{
                padding: "0.7rem 1.5rem",
                background: "#66fcf1",
                color: "#0b0c10",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Reload Page
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
