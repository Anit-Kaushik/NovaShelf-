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
  <div className="min-h-screen bg-[#0F766E] flex items-center justify-center px-4">

    <div className="w-full max-w-xl bg-[#CCFBF1] rounded-3xl shadow-2xl p-8">

     
      <div className="text-center mb-8">

        <h1
          className="text-5xl font-black text-[#134E4A]"
          style={{ fontFamily: "'Ibarra Real Nova', serif" }}
        >
          NovaShelf
        </h1>

        <h2 className="text-3xl font-bold text-[#134E4A] mt-4">
          Edit Resource
        </h2>

        <p className="text-[#115E59] mt-2">
          Update your resource details
        </p>

      </div>

      
      <form onSubmit={handleUpdate} className="space-y-5">

        
        <div>

          <label className="block text-[#134E4A] mb-2 font-semibold">
            Title
          </label>

          <input
            type="text"
            value={title}
            placeholder="Enter resource title"
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#5EEAD4] bg-white outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-[#0F766E] placeholder:text-gray-400"
          />

        </div>

        
        <div>

          <label className="block text-[#134E4A] mb-2 font-semibold">
            Category
          </label>

          <input
            type="text"
            value={category}
            placeholder="Enter category"
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#5EEAD4] bg-white outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-[#0F766E] placeholder:text-gray-400"
          />

        </div>

        
        <div>

          <label className="block text-[#134E4A] mb-2 font-semibold">
            Resource Type
          </label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#5EEAD4] bg-white outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-[#0F766E]"
          >

            <option value="">Select Type</option>
            <option value="pdf">PDF</option>
            <option value="notes">Notes</option>
            <option value="ebook">E-Book</option>
            <option value="assignment">Assignment</option>
            <option value="question-paper">Question Paper</option>

          </select>

        </div>

        
        <button
          type="submit"
          className="w-full bg-[#0F766E] hover:bg-[#115E59] transition text-white py-3 rounded-xl font-bold text-lg"
        >
          Update Resource
        </button>

      </form>

    </div>

  </div>
);
};

export default EditResource;