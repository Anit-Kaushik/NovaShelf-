import { useEffect, useState } from "react";
import API from "../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ManageResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  // FETCH RESOURCES
  const fetchResources = async () => {
    try {
      setLoading(true);

      const res = await API.get("/resources");

      if (Array.isArray(res.data)) {
        setResources(res.data);
      } else {
        setResources([]);
      }
    } catch (error) {
      toast.error("Failed to load resources");
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // DELETE RESOURCE
  const handleDelete = async (id) => {
    if (deletingId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resource?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      await API.delete(`/resources/${id}`);

      toast.success("Resource deleted successfully");

      setResources((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Delete failed"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // LOADING UI
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F766E] flex items-center justify-center">
        <div className="text-white text-xl font-bold animate-pulse">
          Loading resources...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F766E] p-6">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-5xl font-black text-[#CCFBF1]">
          NovaShelf
        </h1>

        <h2 className="text-3xl font-bold text-white mt-3">
          Manage Resources
        </h2>

        <p className="text-[#99F6E4] mt-2">
          Edit and manage all uploaded resources
        </p>
      </div>

      {/* EMPTY STATE */}
      {resources.length === 0 ? (
        <div className="bg-[#CCFBF1] rounded-2xl p-10 text-center shadow-lg">
          <p className="text-[#134E4A] text-lg font-semibold">
            No resources found
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {resources.map((item) => (
            <div
              key={item._id}
              className="bg-[#CCFBF1] rounded-3xl p-6 shadow-xl hover:scale-[1.02] transition"
            >

              {/* TITLE */}
              <h3 className="text-2xl font-bold text-[#134E4A] mb-3">
                {item.title}
              </h3>

              {/* DETAILS */}
              <div className="space-y-2 mb-6 text-sm">

                <p className="text-[#115E59]">
                  Category:{" "}
                  <span className="text-[#134E4A] font-medium">
                    {item.category}
                  </span>
                </p>

                <p className="text-[#115E59]">
                  Type:{" "}
                  <span className="text-[#134E4A] font-medium">
                    {item.type}
                  </span>
                </p>

              </div>

              {/* BUTTONS */}
              <div className="flex gap-3">

                <button
                  onClick={() =>
                    navigate(
                      `/admin/resources/edit/${item._id}`
                    )
                  }
                  className="flex-1 bg-[#0F766E] hover:bg-[#115E59] text-white py-2 rounded-xl font-semibold"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  disabled={deletingId === item._id}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-semibold disabled:opacity-50"
                >
                  {deletingId === item._id
                    ? "Deleting..."
                    : "Delete"}
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