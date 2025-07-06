import React from "react";
import Background from "../components/Background.jsx";

const Layout = ({ children }) => {
  return (
    <div>
      <Background />
      <main className="relative z-10">{children}</main>
    </div>
  );
};

export default Layout;
