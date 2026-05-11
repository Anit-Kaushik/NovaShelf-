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
    <div>
      <h2>Manage Resources</h2>

      {resources.length === 0 ? (
        <p>No resources found</p>
      ) : (
        <div>
          {resources.map((item) => (
            <div
              key={item._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              <h3>{item.title}</h3>

              <p>Category: {item.category}</p>

              <p>Type: {item.type}</p>

              <button
                onClick={() => navigate(`/admin/resources/edit/${item._id}`)}
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(item._id)}
                style={{
                  background: "red",
                  color: "white",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageResources;
