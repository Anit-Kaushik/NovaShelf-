import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthProvider from "./context/AuthContext";
import './index.css'
import SplashScreen from "./components/SplashScreen";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode> 
    <AuthProvider>  
      <SplashScreen>
  <App />
</SplashScreen>     
    </AuthProvider>
  </React.StrictMode>
);