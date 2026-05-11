import React from "react";//react lib. used to create components
import ReactDOM from "react-dom/client";//ReactDOM connects React code to the real browser page (HTML DOM).
import App from "./App";//think it as Main body of your website
import AuthProvider from "./context/AuthContext";//This gives whole app access to:user,token,etc
import './index.css'

ReactDOM.createRoot(document.getElementById("root")).render(// Finds the HTML element(in index.html) with id="root", creates a React root there, and renders the React app inside it.
  <React.StrictMode> {/* Enables extra checks and warnings in development mode to help catch React coding mistakes.*/}
    <AuthProvider>  {/*Wraps whole app with auth context.Means every component inside it can use user,token,setuser,settoken*/}
      <App />       {/* Entire app can now access auth data. as app component contains all other pages/components*/}
    </AuthProvider>
  </React.StrictMode>
);