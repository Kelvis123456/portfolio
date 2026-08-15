"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ background: "#faf8f5", color: "#19140f" }}>
        <main
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.65 }}>
            Something went wrong
          </span>
          <h1 style={{ marginTop: "0.75rem", fontSize: "1.875rem", fontWeight: 600 }}>A critical error occurred</h1>
          <p style={{ marginTop: "1rem", maxWidth: "28rem", opacity: 0.7 }}>
            Sorry about that — you can try again, or reload the page.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: "2rem",
              borderRadius: "9999px",
              background: "#19140f",
              color: "#faf8f5",
              padding: "0.75rem 1.5rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
