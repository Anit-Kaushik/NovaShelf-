import { useState } from "react";
import API from "../../api/axios";
import { toast } from "react-toastify";

const UploadResource = () => {

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [type, setType] = useState("");

  const [loading, setLoading] = useState(false);

  // ✅ NEW STATE
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async (e) => {

    e.preventDefault();

    if (!title || !category || !type || !file) {
      toast.error("All fields are required");
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("category", category);
      formData.append("file", file);
      formData.append("type", type);

      await API.post(
        "/resources/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },

          // ✅ Upload Progress
          onUploadProgress: (progressEvent) => {

            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            setUploadProgress(percentCompleted);
          },
        }
      );

      toast.success("Resource uploaded successfully");

      setTitle("");
      setCategory("");
      setFile(null);
      setType("");

    } catch (error) {

      toast.error(error.response?.data?.message || "Upload failed");

    } finally {

      setLoading(false);

      // Reset Progress
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F766E] flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-2xl bg-[#CCFBF1] rounded-3xl shadow-2xl p-8">

        {/* Heading */}
        <div className="text-center mb-8">

          <h1
            className="text-5xl font-black text-[#134E4A]"
            style={{ fontFamily: "'Ibarra Real Nova', serif" }}
          >
            NovaShelf
          </h1>

          <h2 className="text-3xl font-bold text-[#134E4A] mt-4">
            Upload Resource
          </h2>

          <p className="text-[#115E59] mt-2">
            Add new learning resources to your library
          </p>

        </div>

        {/* Form */}
        <form onSubmit={handleUpload} className="space-y-6">

          {/* Title */}
          <div>

            <label className="block text-[#134E4A] mb-2 font-semibold">
              Title
            </label>

            <input
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#5EEAD4] bg-white outline-none focus:ring-2 focus:ring-[#0F766E]"
            />

          </div>

          {/* Category */}
          <div>

            <label className="block text-[#134E4A] mb-2 font-semibold">
              Category
            </label>

            <input
              type="text"
              placeholder="Enter category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#5EEAD4] bg-white outline-none focus:ring-2 focus:ring-[#0F766E]"
            />

          </div>

          {/* Type */}
          <div>

            <label className="block text-[#134E4A] mb-2 font-semibold">
              Resource Type
            </label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#5EEAD4] bg-white outline-none focus:ring-2 focus:ring-[#0F766E]"
            >

              <option value="">Select Type</option>
              <option value="pdf">PDF</option>
              <option value="notes">Notes</option>
              <option value="ebook">E-Book</option>
              <option value="question-paper">Question Paper</option>
              <option value="assignment">Assignment</option>

            </select>

          </div>

          {/* File Upload */}
          <div>

            <label className="block text-[#134E4A] mb-2 font-semibold">
              Upload PDF
            </label>

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full bg-white border border-[#5EEAD4] rounded-xl p-3 text-[#134E4A] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#0F766E] file:text-white file:font-semibold hover:file:bg-[#115E59]"
            />

          </div>

          {/* ✅ Progress Bar */}
          {loading && (

            <div>

              <div className="w-full bg-[#99F6E4] rounded-full h-4 overflow-hidden">

                <div
                  className="bg-[#0F766E] h-4 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>

              </div>

              <p className="text-[#134E4A] font-semibold mt-2 text-center">
                Uploading... {uploadProgress}%
              </p>

            </div>

          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0F766E] hover:bg-[#115E59] transition text-white py-3 rounded-xl font-bold text-lg disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default UploadResource;