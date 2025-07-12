import React from "react";
import Background from "../components/Background.jsx";

const Layout = ({ children }) => {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Background />
      <main className="relative z-10" style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
