import { useParams, useNavigate } from "react-router-dom";

export function DetailPage() {
  const { code, cusip } = useParams<{ code: string; cusip?: string }>();
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <button
        onClick={() => navigate("/")}
        style={{
          padding: "0.5rem 1rem",
          marginBottom: "1rem",
          backgroundColor: "#f0f0f0",
          border: "1px solid #ddd",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        ← Back to Search
      </button>

      <div>
        <h1>Detail Page</h1>
        <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#f9f9f9", borderRadius: "4px" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "0.25rem" }}>
              Code:
            </label>
            <div style={{ fontSize: "1.2rem", color: "#333" }}>
              {code || "N/A"}
            </div>
          </div>

          {cusip && (
            <div>
              <label style={{ fontWeight: "bold", display: "block", marginBottom: "0.25rem" }}>
                CUSIP:
              </label>
              <div style={{ fontSize: "1.2rem", color: "#333" }}>
                {cusip}
              </div>
            </div>
          )}

          {!cusip && (
            <div style={{ color: "#999", fontSize: "0.9rem" }}>
              (Superinvestor record)
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: "#f0f8ff",
            border: "1px solid #b3d9ff",
            borderRadius: "4px",
          }}
        >
          <p style={{ margin: 0, color: "#333" }}>
            This is an empty state page. Future implementations can display detailed information here.
          </p>
        </div>
      </div>
    </div>
  );
}
