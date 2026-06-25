import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";

const Resources = () => {
  const [resources, setResources] = useState([]); //stores list of resources/books (initially empty array)

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const location = useLocation();
  const navigate = useNavigate(); //Initializes navigation function

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await API.get("/resources"); //Sends GET request to /resources endpoint
        setResources(res.data); //Stores fetched data into resources state
      } catch (error) {
        console.log(error);
      }
    };

    fetchResources();
  }, []);

  const filteredResources = resources.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(search.toLowerCase()); //"Does the title contain what the user typed?"

    const matchesCategory = category //If user selected category
      ? item.category?.toLowerCase() === category.toLowerCase()
      : true; //if category="" then  matchesCategory="true" means "Don’t filter by category, allow all"

    return matchesSearch && matchesCategory; //Keep item ONLY if BOTH are true search and category
  });

return (
  <div className="min-h-screen bg-[#FFF7ED] p-6">

    {/* Heading */}
    <div className="mb-8">

      <h1
        className="text-5xl font-black text-[#EA580C]"
        style={{ fontFamily: "'Ibarra Real Nova', serif" }}
      >
        NovaShelf
      </h1>

      <h2 className="text-3xl font-bold text-gray-800 mt-3">
        All Resources
      </h2>

      <p className="text-gray-500 mt-2">
        Explore your digital learning library
      </p>

    </div>

    {/* Search + Filter */}
    <div className="bg-white rounded-3xl shadow-lg p-5 mb-8 flex flex-col md:flex-row gap-4">

      {/* Search */}
      <input
        type="text"
        placeholder="Search resources..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 px-4 py-3 rounded-2xl border border-orange-200 bg-orange-50 outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-[#EA580C]"
      />

      {/* Category */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="px-4 py-3 rounded-2xl border border-orange-200 bg-orange-50 outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-[#EA580C]"
      >
        <option value="">All Categories</option>
        <option value="programming">Programming</option>
        <option value="math">Math</option>
        <option value="science">Science</option>
      </select>

    </div>

    {/* Resources Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

      {filteredResources.map((item) => (

        <div
          key={item._id}
          className="bg-white rounded-3xl shadow-lg p-6 border border-orange-100 hover:shadow-xl transition"
        >

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            {item.title}
          </h3>

          {/* Category */}
          <p className="text-gray-500 mb-5">
            Category: {item.category || "General"}
          </p>

          {/* Open Button */}
          <button
            onClick={() => {
              if (location.pathname.includes("/admin")) {
                navigate(`/admin/pdf/${item._id}`);
              } else {
                navigate(`/dashboard/pdf/${item._id}`);
              }
            }}
            className="w-full bg-[#EA580C] hover:bg-[#C2410C] transition text-white py-3 rounded-2xl font-semibold"
          >
            Open
          </button>

        </div>

      ))}

    </div>

  </div>
);
};

export default Resources;
