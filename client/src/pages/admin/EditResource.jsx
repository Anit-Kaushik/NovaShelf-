import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { toast } from "react-toastify";

const EditResource = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const res = await API.get(`/resources/${id}`);

        setTitle(res.data.title || "");
        setAuthor(res.data.author || "");
        setCategory(res.data.category || "");
        setType(res.data.type || "");
      } catch (error) {
        toast.error("Failed to load resource");
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (updating) return;

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!author.trim()) {
      toast.error("Author is required");
      return;
    }

    if (!category.trim()) {
      toast.error("Category is required");
      return;
    }

    if (!type) {
      toast.error("Select resource type");
      return;
    }

    try {
      setUpdating(true);

      await API.put(`/resources/${id}`, {
        title: title.trim(),
        author: author.trim(),
        category: category.trim(),
        type,
      });

      toast.success("Resource updated successfully");

      navigate("/admin/resources");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Update failed"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h3 className="text-xl font-bold">Loading...</h3>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F766E] flex items-center justify-center px-4">

      <div className="w-full max-w-xl bg-[#CCFBF1] rounded-3xl shadow-2xl p-8">

        {/* Header */}
        <div className="text-center mb-8">

          <h1 className="text-5xl font-black text-[#134E4A]">
            NovaShelf
          </h1>

          <h2 className="text-3xl font-bold text-[#134E4A] mt-4">
            Edit Resource
          </h2>

          <p className="text-[#115E59] mt-2">
            Update resource details
          </p>

        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="space-y-5">

          {/* Title */}
          <div>
            <label className="block mb-2 font-semibold text-[#134E4A]">
              Title
            </label>

            <input
              type="text"
              disabled={updating}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border bg-white"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block mb-2 font-semibold text-[#134E4A]">
              Author
            </label>

            <input
              type="text"
              disabled={updating}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border bg-white"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 font-semibold text-[#134E4A]">
              Category
            </label>

            <input
              type="text"
              disabled={updating}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border bg-white"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block mb-2 font-semibold text-[#134E4A]">
              Resource Type
            </label>

            <select
              disabled={updating}
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border bg-white"
            >
              <option value="">Select Type</option>
              <option value="book">Book</option>
              <option value="pdf">PDF</option>
              <option value="notes">Notes</option>
              <option value="ebook">E-Book</option>
              <option value="assignment">Assignment</option>
              <option value="question-paper">Question Paper</option>
              <option value="video">Video</option>
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={updating}
            className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white py-3 rounded-xl font-bold disabled:opacity-60"
          >
            {updating ? "Updating..." : "Update Resource"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default EditResource;