import { Outlet, Link } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* SIDEBAR */}
      <div
        style={{
          width: "220px",
          borderRight: "1px solid #ccc",
          padding: "20px",
        }}
      >
        <h2>Admin Panel</h2>

        <ul style={{ listStyle: "none", padding: 0 }}>

          <li>
            <Link to="">Dashboard</Link>
          </li>

          
          <li>
            <Link to="resources-view">Resources</Link>
          </li>

          <li>
            <Link to="profile">Profile</Link>
          </li>

          

          <li>
            <Link to="upload">Upload Resource</Link>
          </li>

          <li>
            <Link to="resources">Manage Resources</Link>
          </li>

          <li>
            <Link to="users">Users</Link>
          </li>
        </ul>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
