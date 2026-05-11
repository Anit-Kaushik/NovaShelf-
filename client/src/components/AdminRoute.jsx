import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminRoute = ({ children }) => { //children means any component wrap innside <AdminRoute/>
  const { user } = useContext(AuthContext);//get user from global state

  if (!user || user.role !== "admin") {//if user is not logged in or not admin
    return <Navigate to="/login" />; //redirecct user to login page, prevent access to admin pages 
  }

  return children;//user exist and admin ->give acces and show admin pages(children)
};

export default AdminRoute;