import { useEffect, useState } from "react";
import API from "../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ManageResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // FETCH ALL RESOURCES
  const fetchResources = async () => {
    try {
      const res = await API.get("/resources");

      setResources(res.data);
    } catch (error) {
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // DELETE RESOURCE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this resource?");

    if (!confirmDelete) return;

    try {
      await API.delete(`/resources/${id}`); //is router.delete("/:id", protect, isAdmin, deleteResource);

      toast.success("Resource deleted");

      // remove from UI instantly no need of refreshment
      setResources((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return <h3>Loading...</h3>;
  }

return (
  <div className="min-h-screen bg-[#0F766E] p-6">

    
    <div className="mb-8">

      <h1
        className="text-5xl font-black text-[#CCFBF1]"
        style={{ fontFamily: "'Ibarra Real Nova', serif" }}
      >
        NovaShelf
      </h1>

      <h2 className="text-3xl font-bold text-white mt-3">
        Manage Resources
      </h2>

      <p className="text-[#99F6E4] mt-2">
        Edit and manage all uploaded resources
      </p>

    </div>

    {/* No Resources */}
    {resources.length === 0 ? (

      <div className="bg-[#CCFBF1] rounded-2xl p-6 text-center shadow-lg">

        <p className="text-[#134E4A] text-lg font-semibold">
          No resources found
        </p>

      </div>

    ) : (

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {resources.map((item) => (

          <div
            key={item._id}
            className="bg-[#CCFBF1] rounded-3xl p-6 shadow-xl hover:scale-[1.02] transition duration-300"
          >

            {/* Title */}
            <h3 className="text-2xl font-bold text-[#134E4A] mb-4">
              {item.title}
            </h3>

            {/* Details */}
            <div className="space-y-2 mb-6">

              <p className="text-[#115E59] font-medium">
                Category:{" "}
                <span className="font-normal text-[#134E4A]">
                  {item.category}
                </span>
              </p>

              <p className="text-[#115E59] font-medium">
                Type:{" "}
                <span className="font-normal text-[#134E4A]">
                  {item.type}
                </span>
              </p>

            </div>

            {/* Buttons */}
            <div className="flex gap-3">

              <button
                onClick={() => navigate(`/admin/resources/edit/${item._id}`)}
                className="flex-1 bg-[#0F766E] hover:bg-[#115E59] transition text-white py-2 rounded-xl font-semibold"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(item._id)}
                className="flex-1 bg-red-500 hover:bg-red-600 transition text-white py-2 rounded-xl font-semibold"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    )}

  </div>
);
};

export default ManageResources;
