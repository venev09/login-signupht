import React from "react";

export default function HomePage() {
  const handleSignOut = () => {
    localStorage.removeItem("jwt_token");
    window.location.reload();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0f",
        color: "#fff",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 24,
        flexDirection: "column",
        gap: 20
      }}
    >
      <div>Home Page (You are logged in)</div>
      <button
        onClick={handleSignOut}
        style={{
          padding: "10px 16px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.08)",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        Sign Out
      </button>
    </div>
  );
}
