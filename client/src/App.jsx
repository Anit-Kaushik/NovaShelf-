import React from "react";
import Login from "./pages/Login";
// react router dom -->Normally websites reload pages. but with this library it changes components/pages instantly.withour reload
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";
import Comments from "./pages/Comments";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PdfViewer from "./pages/PdfViewer";

import Resources from "./pages/Resources";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DashboardLayout from "./layouts/DashboardLayout";
import Profile from "./pages/Profile";
import AdminLayout from "./layouts/AdminLayout";
import UploadResource from "./pages/admin/UploadResource";
import ManageResources from "./pages/admin/ManageResources";
import Users from "./pages/admin/Users";
import EditResource from "./pages/admin/EditResource";

function App() {
  return (
    <BrowserRouter>
      {" "}
      {/*This enables routing/navigation in your React app.means when is watch url and decide which pg to go. Also use history system to go to back url*/}
     
      <Routes>
        {" "}
        {/*This is a container that holds all your routes.*/}
        {/* <Route path="/comments" element={<Comments />} /> */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />{" "}
        {/*when path become /login show login component*/}
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<h2>Home Page</h2>} />
          <Route path="resources" element={<Resources />} />
          <Route path="pdf/:pdfId" element={<PdfViewer />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<h2>Admin Dashboard</h2>} />
          <Route path="upload" element={<UploadResource />} />
          <Route path="resources" element={<ManageResources />}/>
          <Route path="resources/edit/:id"  element={<EditResource />}/>
          <Route path="users" element={<Users />} />
          <Route  path="resources-view" element={<Resources />}/>
          <Route  path="profile" element={<Profile />}/>
          <Route path="pdf/:pdfId" element={<PdfViewer />}/>
          

        </Route>
      </Routes>
      <ToastContainer position="bottom-right" autoClose={2000} />
    </BrowserRouter>
  );
}

export default App;
