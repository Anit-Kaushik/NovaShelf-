import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { toast } from "react-toastify";

const UploadResource = () => {
  const navigate = useNavigate();

  const fileRef = useRef(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setCategory("");
    setType("");
    setFile(null);
    setUploadProgress(0);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (loading) return;

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

    if (!file) {
      toast.error("Please choose a PDF");
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("Maximum file size is 20 MB");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("author", author.trim());
      formData.append("category", category.trim());
      formData.append("type", type);
      formData.append("file", file);

      await API.post("/resources/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },

        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) /
                progressEvent.total
            );

            setUploadProgress(percent);
          }
        },
      });

      toast.success("Resource uploaded successfully");

      resetForm();

      navigate("/admin/resources");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to upload resource"
      );
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F766E] flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-2xl bg-[#CCFBF1] rounded-3xl shadow-2xl p-8">

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
            Upload learning resources for students.
          </p>

        </div>

        <form
          onSubmit={handleUpload}
          className="space-y-6"
        >

          <div>
            <label className="block mb-2 font-semibold text-[#134E4A]">
              Title
            </label>

            <input
              type="text"
              disabled={loading}
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full px-4 py-3 rounded-xl border border-[#5EEAD4] bg-white focus:ring-2 focus:ring-[#0F766E] outline-none"
              placeholder="Enter resource title"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-[#134E4A]">
              Author
            </label>

            <input
              type="text"
              disabled={loading}
              value={author}
              onChange={(e) =>
                setAuthor(e.target.value)
              }
              className="w-full px-4 py-3 rounded-xl border border-[#5EEAD4] bg-white focus:ring-2 focus:ring-[#0F766E] outline-none"
              placeholder="Author name"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-[#134E4A]">
              Category
            </label>

            <input
              type="text"
              disabled={loading}
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-full px-4 py-3 rounded-xl border border-[#5EEAD4] bg-white focus:ring-2 focus:ring-[#0F766E] outline-none"
              placeholder="Example: Operating System"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-[#134E4A]">
              Resource Type
            </label>

            <select
              disabled={loading}
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
              className="w-full px-4 py-3 rounded-xl border border-[#5EEAD4] bg-white focus:ring-2 focus:ring-[#0F766E] outline-none"
            >
              <option value="">Select Type</option>
              <option value="book">Book</option>
              <option value="pdf">PDF</option>
              <option value="notes">Notes</option>
              <option value="ebook">E-Book</option>
              <option value="assignment">Assignment</option>
              <option value="question-paper">
                Question Paper
              </option>
              <option value="video">Video</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-[#134E4A]">
              PDF File
            </label>

            <input
              ref={fileRef}
              disabled={loading}
              type="file"
              accept=".pdf"
              onChange={(e) =>
                setFile(e.target.files[0])
              }
              className="w-full border border-[#5EEAD4] rounded-xl bg-white p-3"
            />
          </div>

          {loading && (
            <div>

              <div className="w-full h-4 rounded-full bg-[#99F6E4] overflow-hidden">

                <div
                  className="h-full bg-[#0F766E] transition-all"
                  style={{
                    width: `${uploadProgress}%`,
                  }}
                />

              </div>

              <p className="text-center mt-2 font-semibold text-[#134E4A]">
                Uploading... {uploadProgress}%
              </p>

            </div>
          )}

          <button
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#0F766E] text-white font-bold hover:bg-[#115E59] transition disabled:opacity-60"
          >
            {loading
              ? "Uploading..."
              : "Upload Resource"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default UploadResource;