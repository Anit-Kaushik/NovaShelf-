import { useContext } from "react";//usecontext-->to acces global state
import { Navigate } from "react-router-dom";//navigate->used to redirect to another page
import { AuthContext } from "../context/AuthContext";//import authentication context contains user,token, login ,logout

const ProtectedRoute = ({ children }) => {//create protectedRoute component, children are any components(only components which should work when user login) wrapped inside it
  const { user } = useContext(AuthContext);//get user form global state

  if (!user) {//is no login go to loginpage . protect routes 
    return <Navigate to="/login" />;
  }

  return children;//if login ->allow access->show protected pages(childeren)
};

export default ProtectedRoute;