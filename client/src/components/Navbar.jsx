import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {//a functional component
  const { user, logout } = useContext(AuthContext);//current login in user , function of logout
  const navigate = useNavigate();

  const handleLogout = () => {//function run when logout button clicked
    logout();//run logout function from global state
    navigate("/login");//navigate to login
  };

  const isAdmin = user?.role === "admin";//if role is admin then different pannel for admin than user

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      
      <h2>📚 OpenLibrar</h2>

      <div>
        {user ? ( //if user logged in(user exist) then run below code
          <>
            <span>Welcome, {user.name}</span>   {/*print user name from user from global state*/}
            
            {isAdmin && ( //if user is admin then navigate to admin component
            <button onClick={() => navigate("/admin")}>
              Admin Panel
            </button>
          )}
           {/*if user is not admin then remain on this component(below code)*/}
            <button onClick={handleLogout}>Logout</button> 
          </>
        ) : ( //run if user not logged in
          <button onClick={() => navigate("/login")}>
            Login {/*go to login page on click */}
          </button>
        )}
      </div>

    </div>
  );
};

export default Navbar;