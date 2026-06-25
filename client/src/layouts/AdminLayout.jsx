import { Outlet, Link } from "react-router-dom";

const AdminLayout = () => {
return (
  <div className="min-h-screen bg-[#FFF7ED]">

    
    <div className="bg-[#EA580C] text-white shadow-lg px-8 py-4 flex items-center justify-between">

      
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

     
      <div className="flex items-center gap-4 flex-wrap">

        <Link
          to=""
          className="px-4 py-2 rounded-xl hover:bg-[#C2410C] transition font-medium"
        >
          Dashboard
        </Link>

        <Link
          to="resources-view"
          className="px-4 py-2 rounded-xl hover:bg-[#C2410C] transition font-medium"
        >
          Resources
        </Link>

        <Link
          to="profile"
          className="px-4 py-2 rounded-xl hover:bg-[#C2410C] transition font-medium"
        >
          Profile
        </Link>

        <Link
          to="upload"
          className="px-4 py-2 rounded-xl hover:bg-[#C2410C] transition font-medium"
        >
          Upload
        </Link>

        <Link
          to="resources"
          className="px-4 py-2 rounded-xl hover:bg-[#C2410C] transition font-medium"
        >
          Manage
        </Link>

        <Link
          to="users"
          className="px-4 py-2 rounded-xl hover:bg-[#C2410C] transition font-medium"
        >
          Users
        </Link>

      </div>

    </div>

    
    <div className="p-6">

      <Outlet />

    </div>

  </div>
);
};

export default AdminLayout;
