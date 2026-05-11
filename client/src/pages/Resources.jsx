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
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", flex: 1 }}
        />

        {/* CATEGORY */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="">All Categories</option>
          <option value="programming">Programming</option>
          <option value="math">Math</option>
          <option value="science">Science</option>
        </select>
      </div>
      <h2 style={{ marginBottom: "20px" }}>All Resources</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredResources.map((item) => (
          <div
            key={item._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              background: "#fff",
            }}
          >
            <h3>{item.title}</h3>

            <p style={{ color: "gray" }}>
              Category: {item.category || "General"}
            </p>

            <button
              onClick={() => {
                if (location.pathname.includes("/admin")) {
                  navigate(`/admin/pdf/${item._id}`);
                } else {
                  navigate(`/dashboard/pdf/${item._id}`);
                }
              }}
              style={{
                marginTop: "10px",
                padding: "8px 12px",
                background: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
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
