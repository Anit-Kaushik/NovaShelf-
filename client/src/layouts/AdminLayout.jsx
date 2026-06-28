import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    `px-4 py-2 rounded-xl font-medium transition ${
      isActive
        ? "bg-[#C2410C] text-white"
        : "hover:bg-[#C2410C] text-white"
    }`;

  return (
    <div className="min-h-screen bg-[#FFF7ED]">

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#EA580C] text-white shadow-lg">

        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 px-6 py-4">

          {/* Logo */}
          <div>
            <h1
              className="text-4xl font-black"
              style={{ fontFamily: "'Ibarra Real Nova', serif" }}
            >
              NovaShelf
            </h1>

            <p className="text-orange-100 text-sm">
              Admin Panel
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap gap-3">

            <NavLink end to="" className={navClass}>
              Dashboard
            </NavLink>

            <NavLink to="resources-view" className={navClass}>
              Resources
            </NavLink>

            <NavLink to="profile" className={navClass}>
              Profile
            </NavLink>

            <NavLink to="upload" className={navClass}>
              Upload
            </NavLink>

            <NavLink to="resources" className={navClass}>
              Manage
            </NavLink>

            <NavLink to="users" className={navClass}>
              Users
            </NavLink>

          </nav>

          {/* User + Logout */}
          <div className="flex items-center gap-4">

            <span className="hidden sm:block font-semibold">
              👋 {user?.name}
            </span>

            <button
              onClick={handleLogout}
              className="bg-white text-[#EA580C] px-4 py-2 rounded-xl font-semibold hover:bg-orange-100 transition"
            >
              Logout
            </button>

          </div>

        </div>

      </header>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto p-6">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;