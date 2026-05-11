import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { toast } from "react-toastify";

const EditResource = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");

  const [loading, setLoading] = useState(true);

  // FETCH RESOURCE
  useEffect(() => {

    const fetchResource = async () => {
      try {

        const res = await API.get(`/resources/${id}`);

        setTitle(res.data.title);
        setCategory(res.data.category);
        setType(res.data.type);

      } catch (error) {

        toast.error("Failed to load resource");

      } finally {

        setLoading(false);

      }
    };

    fetchResource();

  }, [id]);

  // UPDATE RESOURCE
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {

      await API.put(`/resources/${id}`, {
        title,
        category,
        type
      });

      toast.success("Resource updated");

      navigate("/admin/resources");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Update failed"
      );

    }
  };

  if (loading) {
    return <h3>Loading...</h3>;
  }
return (
  <div className="min-h-screen bg-gradient-to-br from-[#EEF2FF] via-[#F8FAFC] to-[#E0F2FE] flex items-center justify-center px-4">

    <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-[40px] overflow-hidden shadow-2xl">

      {/* Left Creative Section */}
      <div className="bg-gradient-to-br from-[#4338CA] via-[#6366F1] to-[#7C3AED] p-10 flex flex-col justify-between relative overflow-hidden">

        {/* Decorative Circles */}
        <div className="absolute w-72 h-72 bg-white/10 rounded-full -top-20 -left-20"></div>
        <div className="absolute w-56 h-56 bg-white/10 rounded-full bottom-[-60px] right-[-40px]"></div>

        <div className="relative z-10">

          <h1
            className="text-6xl font-black text-white leading-tight"
            style={{ fontFamily: "'Ibarra Real Nova', serif" }}
          >
            NovaShelf
          </h1>

          <h2 className="text-4xl font-bold text-white mt-8">
            Edit Resource
          </h2>

          <p className="text-white/80 text-lg mt-5 leading-relaxed">
            Keep your library updated with modern and organized learning resources.
          </p>

        </div>

        <div className="relative z-10 mt-10">

          <div className="bg-white/15 backdrop-blur-md rounded-3xl p-5 border border-white/20">

            <p className="text-white text-lg font-semibold">
              📚 Smart Resource Management
            </p>

            <p className="text-white/70 mt-2">
              Edit titles, categories, and resource types with a beautiful interface.
            </p>

          </div>

        </div>

      </div>

      {/* Right Form Section */}
      <div className="p-10 flex items-center bg-white">

        <form onSubmit={handleUpdate} className="w-full space-y-6">

          {/* Title */}
          <div>

            <label className="block text-[#312E81] mb-2 font-semibold text-lg">
              Title
            </label>

            <input
              type="text"
              value={title}
              placeholder="Enter resource title"
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#6366F1] outline-none focus:ring-4 focus:ring-[#6366F1]/20 transition placeholder:text-gray-400"
            />

          </div>

          {/* Category */}
          <div>

            <label className="block text-[#312E81] mb-2 font-semibold text-lg">
              Category
            </label>

            <input
              type="text"
              value={category}
              placeholder="Enter category"
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#6366F1] outline-none focus:ring-4 focus:ring-[#6366F1]/20 transition placeholder:text-gray-400"
            />

          </div>

          {/* Type */}
          <div>

            <label className="block text-[#312E81] mb-2 font-semibold text-lg">
              Resource Type
            </label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#6366F1] outline-none focus:ring-4 focus:ring-[#6366F1]/20 transition"
            >

              <option value="">Select Type</option>
              <option value="pdf">PDF</option>
              <option value="notes">Notes</option>
              <option value="ebook">E-Book</option>
              <option value="assignment">Assignment</option>
              <option value="question-paper">Question Paper</option>

            </select>

          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:scale-[1.02] transition duration-300 text-white py-4 rounded-2xl font-bold text-lg shadow-lg"
          >
            Update Resource
          </button>

        </form>

      </div>

    </div>

  </div>
);
};

export default EditResource;