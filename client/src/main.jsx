import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Layout from "./layouts/Layout.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
	  <AuthProvider>
	    <Layout>
	      <App />
	    </Layout>
	  </AuthProvider>
  </StrictMode>
);
