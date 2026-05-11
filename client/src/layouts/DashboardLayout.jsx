import { Outlet, Link } from "react-router-dom";

const DashboardLayout = () => {
   return (
    <div className="h-screen flex flex-col">

      {/* TOP NAVBAR */}
      <Navbar />

      {/* MAIN DASHBOARD AREA */}
      <div className="flex flex-1">

        {/* SIDEBAR */}
        <div className="w-64 bg-gray-900 text-white p-5">

          <h2 className="text-2xl font-bold mb-8">
            Dashboard
          </h2>

          <ul className="space-y-4">

            <li>
              <Link
                to=""
                className="block hover:bg-gray-700 px-4 py-2 rounded-lg transition"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="resources"
                className="block hover:bg-gray-700 px-4 py-2 rounded-lg transition"
              >
                Resources
              </Link>
            </li>

            <li>
              <Link
                to="profile"
                className="block hover:bg-gray-700 px-4 py-2 rounded-lg transition"
              >
                Profile
              </Link>
            </li>

          </ul>
        </div>

        {/* PAGE CONTENT */}
        <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;