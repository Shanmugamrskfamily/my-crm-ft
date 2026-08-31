// src/app/global-error.jsx
// Rendered when the root layout itself throws — must include <html>/<body>.
"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          background: "#0f172a",
          color: "#f1f5f9",
        }}
      >
        <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#e11d48",
              color: "#fff",
              fontWeight: 900,
              fontSize: 22,
              marginBottom: 20,
            }}
          >
            !
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 800, margin: "0 0 12px" }}>
            The app failed to load
          </h1>
          <p style={{ fontSize: 14, color: "#94a3b8", margin: "0 0 24px" }}>
            A critical error was raised before the application could render.
            Try again, or refresh the page.
          </p>
          {error?.digest && (
            <p
              style={{
                fontSize: 11,
                color: "#64748b",
                fontFamily: "monospace",
                marginBottom: 24,
              }}
            >
              Error reference: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: "10px 22px",
              borderRadius: 8,
              border: "none",
              background: "#4f46e5",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
