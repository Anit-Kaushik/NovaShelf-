import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAdmin = user?.role === "admin";

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      
      <h2>📚 OpenLibrar</h2>

      <div>
        {user ? ( 
          <>
            <span>Welcome, {user.name}</span>   
            
            {isAdmin && ( 
            <button onClick={() => navigate("/admin")}>
              Admin Panel
            </button>
          )}
          
            <button onClick={handleLogout}>Logout</button> 
          </>
        ) : ( 
          <button onClick={() => navigate("/login")}>
            Login 
          </button>
        )}
      </div>

    </div>
  );
};

export default Navbar;